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

export const userTable = pgTable('userTable', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	email: text('email').notNull().unique(),
	name: text('name').notNull()
});
export const sessionTable = pgTable('sessionTable', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id)
});

export const bankTable = pgTable('bankTable', {
	id: serial('id').primaryKey(),
	accountNo: bigint('accountNo', { mode: 'number' }).notNull().unique(),
	ifsc: text('ifsc'),
	name: text('name').notNull(),
	swift: text('swift'),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' })
});
export const transactionTable = pgTable('transactionTable', {
	id: serial('id').primaryKey(),
	amount: real('amount').notNull(),
	bankId: integer('bank_id')
		.references(() => bankTable.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('timestamp').defaultNow().notNull(),
	merchant: text('merchant'),
	notes: text('notes'),
	tag: text('tag')
});

export const brokerTable = pgTable('brokerTable', {
	id: serial('id').primaryKey(),
	accountNo: bigint('accountNo', { mode: 'number' }).notNull().unique(),
	name: text('name').notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' })
});
export const investmentTypeEnum = pgEnum('investmentType', ['stock', 'mf', 'bond', 'etf']);
export const investmentTable = pgTable('investmentTable', {
	id: serial('id').primaryKey(),
	amount: real('amount').notNull(),
	brokerId: integer('broker_id')
		.references(() => brokerTable.id)
		.notNull(),
	createdAt: timestamp('timestamp').defaultNow().notNull(),
	name: text('name').notNull(),
	type: investmentTypeEnum('type').notNull(),
	quantity: integer('quantity').notNull()
});
