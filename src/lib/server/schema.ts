import {
	bigint,
	integer,
	pgEnum,
	pgTable,
	real,
	serial,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

export const bankTable = pgTable('bankTable', {
	id: serial('id').primaryKey(),
	accountNo: bigint('accountNo', { mode: 'number' }).notNull().unique(),
	name: text('name').notNull(),
	swift: text('swift'),
	ifsc: text('ifsc')

	// FUTURE: when we have a user table
	// holder_id: integer('holder_id').references(() => userTable.id).notNull()
});
export const transactionTable = pgTable('transactionTable', {
	id: serial('id').primaryKey(),
	amount: real('amount').notNull(),
	bank_id: integer('bank_id')
		.references(() => bankTable.id, { onDelete: 'cascade' })
		.notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
	merchant: text('merchant'),
	notes: text('notes'),
	tag: text('tag')
});

export const investmentTypeEnum = pgEnum('investmentType', ['stock', 'mf', 'bond', 'etf']);

export const brokerTable = pgTable('brokerTable', {
	id: serial('id').primaryKey(),
	accountNo: bigint('accountNo', { mode: 'number' }).notNull().unique(),
	name: text('name').notNull()
});
export const investmentTable = pgTable('investmentTable', {
	id: serial('id').primaryKey(),
	amount: real('amount').notNull(),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull(),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
	type: investmentTypeEnum('type').notNull()
});
