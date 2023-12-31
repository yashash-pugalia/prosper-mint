import { real, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const transactionTable = pgTable('transactionTable', {
	id: serial('id').primaryKey(),
	amount: real('amount').notNull(),
	bank: text('bank').notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
	merchant: text('merchant'),
	notes: text('notes'),
	tag: text('tag')
});
