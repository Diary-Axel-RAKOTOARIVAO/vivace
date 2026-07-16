import type { D1Database } from '@cloudflare/workers-types';
import { TRIGGERS } from 'vivace';

export interface GalleryEntry {
	id: number;
	name: string;
	author: string;
	viv: string;
	trig: string;
	subject: string;
	created_at: string;
}

export const SUBJECT_IDS = ['stats', 'card', 'hero', 'list', 'nav', 'toast'];

/** Compositions are @/_ tokens only — reject anything else before it hits the DB. */
const VIV_PATTERN = /^[@_a-z0-9!+.\- ]+$/i;

export interface SubmissionInput {
	name: string;
	author: string;
	viv: string;
	trig: string;
	subject: string;
}

export function validateSubmission(input: SubmissionInput): string | null {
	const name = input.name.trim();
	const author = input.author.trim();
	const viv = input.viv.trim();

	if (name.length < 2 || name.length > 40) return 'Name must be 2–40 characters.';
	if (author.length < 2 || author.length > 30) return 'Author must be 2–30 characters.';
	if (viv.length < 3 || viv.length > 200) return 'Composition must be 3–200 characters.';
	if (!VIV_PATTERN.test(viv) || !viv.includes('@')) {
		return 'Composition may only contain @keys and _modifiers.';
	}
	if (!(TRIGGERS as readonly string[]).includes(input.trig)) return 'Unknown trigger.';
	if (!SUBJECT_IDS.includes(input.subject)) return 'Unknown subject.';
	return null;
}

export async function listEntries(db: D1Database, limit = 60): Promise<GalleryEntry[]> {
	const { results } = await db
		.prepare('SELECT id, name, author, viv, trig, subject, created_at FROM gallery ORDER BY created_at DESC, id DESC LIMIT ?')
		.bind(limit)
		.all<GalleryEntry>();
	return results;
}

export async function insertEntry(db: D1Database, input: SubmissionInput): Promise<void> {
	await db
		.prepare('INSERT INTO gallery (name, author, viv, trig, subject) VALUES (?, ?, ?, ?, ?)')
		.bind(
			input.name.trim(),
			input.author.trim(),
			input.viv.trim(),
			input.trig,
			input.subject
		)
		.run();
}

/** Shown when no D1 binding is around (e.g. building without wrangler). */
export const DEMO_ENTRIES: GalleryEntry[] = [
	{
		id: -1,
		name: 'Gather',
		author: 'vivace',
		viv: '@pr-i_child-ascend_ease-out-back @fd @sc-i!',
		trig: 'load',
		subject: 'hero',
		created_at: ''
	},
	{
		id: -2,
		name: 'Rise',
		author: 'vivace',
		viv: '@sl-y!_child-ascend_ease-out-back @fd',
		trig: 'load',
		subject: 'stats',
		created_at: ''
	},
	{
		id: -3,
		name: 'Drop',
		author: 'vivace',
		viv: '@dr',
		trig: 'load',
		subject: 'toast',
		created_at: ''
	}
];
