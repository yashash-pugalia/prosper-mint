import { google, lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { oauthAccountTable, userTable } from '$lib/server/schema';
import { OAuth2RequestError } from 'arctic';
import { and, eq } from 'drizzle-orm';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	const storedState = event.cookies.get('GOOGLE_OAUTH_STATE');
	const storedCodeVerifier = event.cookies.get('GOOGLE_OAUTH_CODE_VERIFIER');

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState)
		return new Response(null, { status: 400 });

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
		const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: { Authorization: `Bearer ${tokens.accessToken}` }
		});

		const googleUser: GoogleUser = await googleUserResponse.json();

		if (!googleUser.email || !googleUser.email_verified)
			return new Response('No primary email or email unverified', { status: 400 });

		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.email, googleUser.email));

		if (existingUser) {
			const [existingOauthAccount] = await db
				.select()
				.from(oauthAccountTable)
				.where(
					and(
						eq(oauthAccountTable.providerId, 'google'),
						eq(oauthAccountTable.providerUserId, googleUser.sub)
					)
				);
			if (!existingOauthAccount) {
				await db.insert(oauthAccountTable).values({
					userId: existingUser.id,
					providerId: 'google',
					providerUserId: googleUser.sub
				});
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const [user] = await db
				.insert(userTable)
				.values({ name: googleUser.name, email: googleUser.email })
				.returning();

			await db.insert(oauthAccountTable).values({
				providerId: 'google',
				providerUserId: googleUser.sub,
				userId: user.id
			});

			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, { status: 302, headers: { Location: '/portfolio' } });
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) return new Response(null, { status: 400 });

		return new Response(null, { status: 500 });
	}
}

interface GoogleUser {
	sub: string;
	name: string;
	picture: string;
	email: string;
	email_verified: boolean;
}
