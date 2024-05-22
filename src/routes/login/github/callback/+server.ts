import { github, lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { oauthAccountTable, userTable } from '$lib/server/schema';
import { OAuth2RequestError } from 'arctic';
import { and, eq } from 'drizzle-orm';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingAccount = await db.query.oauthAccountTable.findFirst({
			where: and(
				eq(oauthAccountTable.providerId, 'github'),
				eq(oauthAccountTable.providerUserId, githubUser.id.toString())
			)
		});

		if (existingAccount) {
			const session = await lucia.createSession(existingAccount.userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const [user] = await db
				.insert(userTable)
				.values({ name: githubUser.name, email: githubUser.email })
				.returning();
			await db.insert(oauthAccountTable).values({
				providerId: 'github',
				providerUserId: githubUser.id.toString(),
				userId: user.id
			});

			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/portfolio'
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, { status: 400 });
		}
		return new Response(null, { status: 500 });
	}
}

interface GitHubUser {
	id: number;
	name: string;
	email: string;
}
