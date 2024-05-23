import { db } from '$lib/server/db.js';
import { bankTable, transactionTable } from '$lib/server/schema.js';
import { desc, eq } from 'drizzle-orm';

export const load = async ({ locals }) => ({
	user: locals.user,
	banks: await db.select().from(bankTable).where(eq(bankTable.userId, locals.user?.id!)),
	transactions: await db
		.select()
		.from(transactionTable)
		.where(eq(transactionTable.userId, locals.user?.id!))
		.limit(10)
		.orderBy(desc(transactionTable.createdAt))
});
