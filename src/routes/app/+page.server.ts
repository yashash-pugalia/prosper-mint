import db from '$lib/server/db';
import { transactionTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { banks, merchants, tags } from '../store';

export const load = async () => {
	return {
		transactions: await db.select().from(transactionTable).orderBy(desc(transactionTable.timestamp))
	};
};

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();

		const amount = Number(formData.get('amount'));
		const merchant = merchants[Math.floor(Math.random() * merchants.length)];
		const tag = tags[Math.floor(Math.random() * tags.length)];
		const bank = banks[Math.floor(Math.random() * banks.length)];

		if (!amount) return fail(400, { message: 'Amount  is required' });

		await db.insert(transactionTable).values({ amount, merchant, tag, bank });

		return { message: 'Transaction added successfully' };
	},

	update: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id')?.toString();
		// const amount = Number(formData.get('amount'));
		const bank = formData.get('bank')?.toString();
		// const timestamp = new Date(formData.get('timestamp') as string);
		const merchant = formData.get('merchant')?.toString();
		const notes = formData.get('notes')?.toString();
		const tag = formData.get('tag')?.toString();

		if (!id) return fail(400, { message: 'Error updating Transaction' });

		await db
			.update(transactionTable)
			.set({ bank, merchant, notes, tag })
			.where(eq(transactionTable.id, +id));

		return { message: 'Todo updated successfully' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id')?.toString();

		if (!id) return fail(400, { message: 'Error deleting todo' });

		await db.delete(transactionTable).where(eq(transactionTable.id, +id));

		return { message: 'Todo deleted successfully' };
	}
};
