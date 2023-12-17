import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
	id: serial('id').primaryKey(),
	content: text('title').notNull(),
	completed: boolean('completed').notNull().default(false),
	createdAt: timestamp('created_at').defaultNow()
});
