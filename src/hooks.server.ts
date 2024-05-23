import { lucia } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;

		if (event.route.id?.startsWith('/(app)')) throw redirect(303, '/login');
		else return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);

	// If the session is newly created (due to session expiration extension), generate a new session cookie
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	// If the session is invalid, generate a blank session cookie to remove the existing session cookie from the browser
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	if (!session && event.route.id?.startsWith('/(app)')) throw redirect(303, '/login');

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
