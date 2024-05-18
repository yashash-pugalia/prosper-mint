import { integer, pgEnum, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('userTable', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	email: text('email').unique(),
	name: text('name'),
	githubId: integer('githubId').unique(),
	githubUsername: text('githubUsername').unique()
});
export const sessionTable = pgTable('sessionTable', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expiresAt', { withTimezone: true, mode: 'date' }).notNull(),
	userId: integer('userId')
		.notNull()
		.references(() => userTable.id)
});

export const bankTable = pgTable('bankTable', {
	id: serial('id').primaryKey(),
	accountNo: text('accountNo').notNull(),
	balance: real('balance').default(10000).notNull(),
	// TODO:  balance history an array storing balance and timestamp?
	ifsc: text('ifsc'),
	name: text('name').notNull(),
	swift: text('swift'),
	userId: integer('userId')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' })
});
export const transactionTable = pgTable('transactionTable', {
	id: serial('id').primaryKey(),
	amount: real('amount').notNull(),
	bankId: integer('bankId')
		.references(() => bankTable.id, { onDelete: 'cascade' })
		.notNull(),
	userId: integer('userId')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	merchant: text('merchant'),
	notes: text('notes'),
	tag: text('tag')
});

export const brokerTable = pgTable('brokerTable', {
	id: serial('id').primaryKey(),
	accountNo: text('accountNo').notNull(),
	name: text('name').notNull(),
	userId: integer('userId')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' })
});
export const investmentTypeEnum = pgEnum('investmentType', ['stock', 'mf', 'bond', 'etf']);
export const investmentTable = pgTable('investmentTable', {
	id: serial('id').primaryKey(),
	amount: real('amount').notNull(),
	brokerId: integer('brokerId')
		.references(() => brokerTable.id)
		.notNull(),
	createdAt: timestamp('createdAt').defaultNow().notNull(),
	name: text('name').notNull(),
	type: investmentTypeEnum('type').notNull(),
	quantity: integer('quantity').notNull()
});
