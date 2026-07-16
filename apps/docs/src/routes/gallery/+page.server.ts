import { fail } from '@sveltejs/kit';
import {
	DEMO_ENTRIES,
	insertEntry,
	listEntries,
	validateSubmission
} from '$lib/server/gallery';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform?.env?.DB;
	if (!db) {
		return { entries: DEMO_ENTRIES, live: false };
	}
	try {
		return { entries: await listEntries(db), live: true };
	} catch {
		// Migrations not applied yet — degrade to the demo set.
		return { entries: DEMO_ENTRIES, live: false };
	}
};

export const actions: Actions = {
	submit: async ({ request, platform }) => {
		const form = await request.formData();
		const input = {
			name: String(form.get('name') ?? ''),
			author: String(form.get('author') ?? ''),
			viv: String(form.get('viv') ?? ''),
			trig: String(form.get('trig') ?? 'load'),
			subject: String(form.get('subject') ?? 'card')
		};

		const db = platform?.env?.DB;
		if (!db) return fail(503, { error: 'Gallery is read-only right now.', ...input });

		const error = validateSubmission(input);
		if (error) return fail(400, { error, ...input });

		await insertEntry(db, input);
		return { published: true };
	}
};
