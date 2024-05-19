import { db } from '$lib/server/db.js';
import { bankTable, transactionTable } from '$lib/server/schema.js';
import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

export const load = async (event) => {
	if (!event.locals.user) {
		// TODO: not the best way to handle this.
		// https://kit.svelte.dev/docs/load#implications-for-authentication move to hooks

		const unprotectedRoutes = ['/', '/login'];

		if (unprotectedRoutes.includes(event.route.id!))
			return { user: null, banks: [], transactions: [] };

		redirect(302, '/login');
	}

	return {
		user: event.locals.user,
		banks: await db.select().from(bankTable).where(eq(bankTable.userId, event.locals.user.id)),
		transactions: await db
			.select()
			.from(transactionTable)
			.where(eq(transactionTable.userId, event.locals.user.id))
			.limit(10)
			.orderBy(desc(transactionTable.createdAt))
	};
};
