import { db } from '$lib/server/db';
import { bankTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const actions = {
	add: async ({ request, locals }) => {
		const formData = await request.formData();

		const userId = locals.user?.id!;
		const name = formData.get('name')?.toString().toUpperCase();
		const accountNo = formData.get('accountNo')?.toString().toUpperCase();
		const swift = formData.get('swift')?.toString().toUpperCase();
		const ifsc = formData.get('ifsc')?.toString().toUpperCase();
		// current user as holder name in future

		if (!name || !accountNo) return fail(400, { message: 'Name and Account No are required' });

		try {
			await db.insert(bankTable).values({ userId, name, accountNo, swift, ifsc });
			return { message: 'Bank added successfully' };
		} catch (e) {
			return fail(500, { message: `Error adding Bank: ${e}` });
		}
	},

	// yet to be tested
	update: async ({ request, locals }) => {
		const formData = await request.formData();

		const id = Number(formData.get('id'));
		const name = formData.get('name')?.toString().toUpperCase();
		const accountNo = formData.get('accountNo')?.toString().toUpperCase();
		const swift = formData.get('swift')?.toString().toUpperCase();
		const ifsc = formData.get('ifsc')?.toString().toUpperCase();

		try {
			await db
				.update(bankTable)
				.set({ name, accountNo, swift, ifsc })
				.where(and(eq(bankTable.id, id), eq(bankTable.userId, locals.user?.id!)));
			return { message: 'Bank details updated successfully' };
		} catch (e) {
			return fail(500, { message: `Error updating Bank Details: ${e}` });
		}
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Bank id is required.' });

		try {
			await db
				.delete(bankTable)
				.where(and(eq(bankTable.id, id), eq(bankTable.userId, locals.user?.id!)));

			return { message: 'Bank deleted successfully' };
		} catch (e) {
			return fail(500, { message: `Error deleting Bank: ${e}` });
		}
	}
};
