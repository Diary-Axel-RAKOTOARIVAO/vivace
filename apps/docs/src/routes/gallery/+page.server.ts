import { fail } from '@sveltejs/kit';
import {
	DEMO_ENTRIES,
	hashIp,
	insertEntry,
	isRateLimited,
	listEntries,
	submissionSchema
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
	submit: async ({ request, platform, getClientAddress }) => {
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

		const parsed = submissionSchema.safeParse(input);
		if (!parsed.success) {
			const error = parsed.error.issues[0]?.message ?? 'Invalid submission.';
			return fail(400, { error, ...input });
		}

		const ipHash = await hashIp(getClientAddress());
		if (await isRateLimited(db, ipHash)) {
			return fail(429, { error: 'Rate limit reached — try again in an hour.', ...input });
		}

		try {
			await insertEntry(db, parsed.data, ipHash);
		} catch (e) {
			if (e instanceof Error && e.message.includes('UNIQUE')) {
				return fail(409, { error: 'That exact composition is already in the gallery.', ...input });
			}
			throw e;
		}

		return { published: true };
	}
};
