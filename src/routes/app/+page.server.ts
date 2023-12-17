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

		if (!amount) return fail(400, { message: 'Amount  is required' });

		await db.insert(transactionTable).values({
			amount: amount,
			merchant: merchants[Math.floor(Math.random() * merchants.length)],
			tag: tags[Math.floor(Math.random() * tags.length)],
			bank: banks[Math.floor(Math.random() * banks.length)]
		});

		return { message: 'Transaction added successfully' };
	},

	update: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id')?.toString();
		const notes = formData.get('notes')?.toString();

		if (!notes || !id) return fail(400, { message: 'Error updating Transaction' });

		// await db
		// 	.update(todos)
		// 	.set({
		// 		content,
		// 		completed: !!completed
		// 	})
		// 	.where(eq(todos.id, +id));

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
