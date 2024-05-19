import { db } from '$lib/server/db';
import { bankTable, transactionTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { and, asc, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { merchants, tags } from '../store';

export const load = async ({ locals, url }) => {
	const sortBy = url.searchParams.get('sortBy'); // asc or desc
	const filterTransactionType = url.searchParams.get('filterTransactionType'); // income expense or all
	const search = url.searchParams.get('search'); // search by merchant or tag or notes or bank name

	return {
		transactions: await db.query.transactionTable.findMany({
			where: and(
				eq(transactionTable.userId, locals.user?.id!),
				filterTransactionType === 'income'
					? gt(transactionTable.amount, 0)
					: filterTransactionType === 'expense'
						? lt(transactionTable.amount, 0)
						: undefined
			),
			orderBy: sortBy === 'asc' ? asc(transactionTable.createdAt) : desc(transactionTable.createdAt)
		})
		// sql`to_tsvector('simple', ${transactionTable.merchant}) @@ to_tsquery('simple', ${search})`
	};
};

export const actions = {
	add: async ({ request, locals }) => {
		const formData = await request.formData();

		const userId = locals.user?.id!;
		const amount = Number(formData.get('amount'));
		const merchant = merchants[Math.floor(Math.random() * merchants.length)];
		const tag = tags[Math.floor(Math.random() * tags.length)];
		// const bank = banks[Math.floor(Math.random() * banks.length)];

		const allBanks = await db.select().from(bankTable);
		const bankId = allBanks[Math.floor(Math.random() * allBanks.length)].id;

		if (!amount) return fail(400, { message: 'Amount  is required' });

		try {
			await db.insert(transactionTable).values({ amount, merchant, tag, bankId, userId });
			return { message: 'Transaction added successfully' };
		} catch (e) {
			return fail(500, { message: `Error adding Transaction: ${e}` });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();

		const id = Number(formData.get('id'));
		// const amount = Number(formData.get('amount'));
		const bankId = Number(formData.get('bankId'));
		// const createdAt = new Date(formData.get('createdAt') as string);
		const merchant = formData.get('merchant')?.toString();
		const notes = formData.get('notes')?.toString();
		const tag = formData.get('tag')?.toString();

		if (!id) return fail(400, { message: 'Transaction ID is required.' });

		// TODO: user must own the transaction account 		where(eq(transactionTable.userId, event.locals.user.id))

		try {
			await db
				.update(transactionTable)
				.set({ bankId, merchant, notes, tag })
				.where(eq(transactionTable.id, id));
			return { message: 'Transaction details updated successfully' };
		} catch (e) {
			return fail(500, { message: `Error updating Transaction Details: ${e}` });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();

		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Transaction ID is required.' });

		// TODO: user must own the transaction account 		where(eq(transactionTable.userId, event.locals.user.id))

		try {
			await db.delete(transactionTable).where(eq(transactionTable.id, id));
			return { message: 'Todo deleted successfully' };
		} catch (e) {
			return fail(500, { message: `Error deleting Transaction: ${e}` });
		}
	}
};
