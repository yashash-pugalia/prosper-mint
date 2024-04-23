import db from '$lib/server/db';
import { bankTable, transactionTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { merchants, tags } from '../store';

export const load = async () => {
	const transactions = await db
		.select()
		.from(transactionTable)
		.orderBy(desc(transactionTable.timestamp));
	const banks = await db.select().from(bankTable);

	return { transactions, banks };
};

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();

		const amount = Number(formData.get('amount'));
		const merchant = merchants[Math.floor(Math.random() * merchants.length)];
		const tag = tags[Math.floor(Math.random() * tags.length)];
		// const bank = banks[Math.floor(Math.random() * banks.length)];

		const allBanks = await db.select().from(bankTable);
		const bank_id = allBanks[Math.floor(Math.random() * allBanks.length)].id;

		if (!amount) return fail(400, { message: 'Amount  is required' });

		try {
			await db.insert(transactionTable).values({ amount, merchant, tag, bank_id });
			return { message: 'Transaction added successfully' };
		} catch (e) {
			return fail(500, { message: `Error adding Transaction: ${e}` });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();

		const id = Number(formData.get('id'));
		// const amount = Number(formData.get('amount'));
		const bank_id = Number(formData.get('bank_id'));
		// const timestamp = new Date(formData.get('timestamp') as string);
		const merchant = formData.get('merchant')?.toString();
		const notes = formData.get('notes')?.toString();
		const tag = formData.get('tag')?.toString();

		if (!id) return fail(400, { message: 'Transaction ID is required.' });

		try {
			await db
				.update(transactionTable)
				.set({ bank_id, merchant, notes, tag })
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

		try {
			await db.delete(transactionTable).where(eq(transactionTable.id, id));
			return { message: 'Todo deleted successfully' };
		} catch (e) {
			return fail(500, { message: `Error deleting Transaction: ${e}` });
		}
	}
};
