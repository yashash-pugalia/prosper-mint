import { db } from '$lib/server/db';
import { investmentTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getNseData, type StocksResponse } from './nsedata';

const res: StocksResponse = await getNseData();

const allStocks = res.data
	.filter((s) => s.symbol !== 'NIFTY TOTAL MARKET')
	.map((s) => ({
		prevClose: s.previousClose,
		symbol: s.symbol,
		companyName: s.meta.companyName,
		chart365dPath: s.chart365dPath
	}));

// const allStocks = [];

export const load = async ({ locals }) => ({
	investments: await db
		.select()
		.from(investmentTable)
		.where(eq(investmentTable.userId, locals.user?.id!))
		.then((res) =>
			res.map((e) => {
				const stock = allStocks.find((s) => s.symbol === e.name);

				if (e.type === 'stocks') {
					return {
						...e,
						companyName: stock?.companyName || e.name,
						prevClose: stock?.prevClose || e.amount,
						chart365dPath: stock?.chart365dPath || ''
					};
				} else if (e.type === 'mf') {
					return {
						...e,
						companyName: e.name,
						prevClose: e.amount + (0.5 - Math.random()) * e.amount,
						chart365dPath: ''
					};
				} else {
					// its an FD
					return {
						...e,
						companyName: e.name,
						prevClose: e.amount + (e.amount * 7 * e.quantity) / 100,
						chart365dPath: ''
					};
				}
			})
		),
	allStocks
});

export const actions = {
	// Add broker and investment
	add: async ({ request, locals }) => {
		const formData = await request.formData();

		const userId = locals.user?.id!;
		const name = formData.get('name')?.toString();
		const amount = parseFloat(formData.get('amount')?.toString() || '0');
		const quantity = parseInt(formData.get('quantity')?.toString() || '0');
		const type = formData.get('type')?.toString() ?? 'stocks';

		if (!name || !userId || !amount || !quantity || !type)
			return fail(400, { message: 'All fields are required' });
		if (!['stocks', 'mf', 'fd'].includes(type))
			return fail(400, { message: 'Invalid investment type' });

		try {
			await db.insert(investmentTable).values({ amount, userId, name, type, quantity });

			return { message: 'Investment added successfully' }; // Return success message
		} catch (e) {
			return fail(500, { message: `Error adding to portfolio: ${e}` }); // Catch any errors during insertion
		}
	},

	// Update broker or investment
	update: async ({ request, locals }) => {
		const formData = await request.formData();

		const id = Number(formData.get('id'));
		const name = formData.get('name')?.toString();
		const accountNo = formData.get('accountNo')?.toString();
		const amount = parseFloat(formData.get('amount')?.toString() || '0');
		const quantity = parseInt(formData.get('quantity')?.toString() || '0');
		const type = formData.get('type')?.toString();

		try {
			await db
				.update(investmentTable)
				.set({ amount, name, type, quantity })
				.where(eq(investmentTable.id, id));

			return { message: 'Broker and Investment details updated successfully' }; // Return success message
		} catch (e) {
			return fail(500, { message: `Error updating portfolio: ${e}` }); // Catch any errors during update
		}
	},

	// Delete broker and investment
	delete: async ({ request, locals }) => {
		const formData = await request.formData();

		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'Broker id is required.' });

		try {
			// Delete associated investments from investmentTable
			await db.delete(investmentTable).where(eq(investmentTable.id, id));

			return { message: 'Broker and associated investments deleted successfully' };
		} catch (e) {
			return fail(500, { message: `Error deleting portfolio: ${e}` }); // Catch any errors during deletion
		}
	}
};
