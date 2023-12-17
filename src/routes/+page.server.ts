import db from '$lib/server/db';
import { todos } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

export const load = async () => {
	return {
		todos: await db.select().from(todos).orderBy(desc(todos.createdAt))
	};
};

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();

		const content = formData.get('content')?.toString();

		if (!content) return fail(400, { message: 'Title is required' });

		await db.insert(todos).values({
			content
		});

		return { message: 'Todo added successfully' };
	},

	update: async ({ request }) => {
		const formData = await request.formData();

		const content = formData.get('content')?.toString();
		const completed = formData.get('completed')?.toString();
		const id = formData.get('id')?.toString();

		if (!content || !id) return fail(400, { message: 'Error updating todo' });

		await db
			.update(todos)
			.set({
				content,
				completed: !!completed
			})
			.where(eq(todos.id, +id));

		return { message: 'Todo updated successfully' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id')?.toString();

		if (!id) return fail(400, { message: 'Error deleting todo' });

		await db.delete(todos).where(eq(todos.id, +id));

		return { message: 'Todo deleted successfully' };
	}
};
