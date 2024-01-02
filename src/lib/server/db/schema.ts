import { sql } from 'drizzle-orm';
import { blob, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	// other user attributes
	first_name: text('first_name'),
	last_name: text('last_name'),
	email: text('email').notNull()
});
export const session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activeExpires: blob('active_expires', {
		mode: 'bigint'
	}).notNull(),
	idleExpires: blob('idle_expires', {
		mode: 'bigint'
	}).notNull()
});
export const key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password')
});

export const transactionTable = sqliteTable('transactionTable', {
	id: integer('id').primaryKey(),
	amount: real('amount').notNull(),
	bank: text('bank').notNull(),
	timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
	merchant: text('merchant'),
	notes: text('notes'),
	tag: text('tag')
});
