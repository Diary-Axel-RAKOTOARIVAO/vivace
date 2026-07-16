import type { D1Database } from '@cloudflare/workers-types';
import { TRIGGERS } from 'vivace';
import { z } from 'zod';

export interface GalleryEntry {
	id: number;
	name: string;
	author: string;
	viv: string;
	trig: string;
	subject: string;
	created_at: string;
	votes: number;
}

export const PER_PAGE = 12;

export const SUBJECT_IDS = ['stats', 'card', 'hero', 'list', 'nav', 'toast'] as const;

/** Compositions are @/_ tokens only — reject anything else before it hits the DB. */
const VIV_PATTERN = /^[@_a-z0-9!+.\- ]+$/i;

/** GitHub username rules: 1–39 alphanumerics/hyphens, no leading/trailing/double hyphen. */
const GITHUB_USERNAME = /^(?!-)(?!.*--)[a-z\d-]{1,39}$/i;

export const submissionSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Name must be 2–40 characters.')
		.max(40, 'Name must be 2–40 characters.'),
	author: z
		.string()
		.trim()
		.regex(GITHUB_USERNAME, 'Author must be a valid GitHub username.')
		.refine((v) => !v.endsWith('-'), 'Author must be a valid GitHub username.'),
	viv: z
		.string()
		.trim()
		.min(3, 'Composition must be 3–200 characters.')
		.max(200, 'Composition must be 3–200 characters.')
		.regex(VIV_PATTERN, 'Composition may only contain @keys and _modifiers.')
		.refine((v) => v.includes('@'), 'Composition needs at least one @key.'),
	trig: z.enum(TRIGGERS as unknown as [string, ...string[]], { message: 'Unknown trigger.' }),
	subject: z.enum(SUBJECT_IDS, { message: 'Unknown subject.' })
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

/** Submissions allowed per (hashed) IP per minute — anti-hammering, not a quota. */
export const RATE_LIMIT = 3;

const IP_SALT = 'vivace-gallery-v1';

export async function hashIp(ip: string): Promise<string> {
	const bytes = new TextEncoder().encode(`${IP_SALT}:${ip}`);
	const digest = await crypto.subtle.digest('SHA-256', bytes);
	return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function isRateLimited(db: D1Database, ipHash: string): Promise<boolean> {
	const count = await db
		.prepare(
			"SELECT COUNT(*) AS n FROM gallery WHERE ip_hash = ? AND created_at > datetime('now', '-1 minute')"
		)
		.bind(ipHash)
		.first<number>('n');
	return (count ?? 0) >= RATE_LIMIT;
}

export async function listEntries(
	db: D1Database,
	page = 1
): Promise<{ entries: GalleryEntry[]; total: number }> {
	const offset = (Math.max(1, page) - 1) * PER_PAGE;
	const [rows, count] = await db.batch([
		db
			.prepare(
				`SELECT g.id, g.name, g.author, g.viv, g.trig, g.subject, g.created_at,
					COUNT(v.entry_id) AS votes
				FROM gallery g
				LEFT JOIN votes v ON v.entry_id = g.id
				GROUP BY g.id
				ORDER BY g.created_at DESC, g.id DESC
				LIMIT ? OFFSET ?`
			)
			.bind(PER_PAGE, offset),
		db.prepare('SELECT COUNT(*) AS n FROM gallery')
	]);
	return {
		entries: (rows!.results ?? []) as unknown as GalleryEntry[],
		total: ((count!.results?.[0] as { n?: number } | undefined)?.n ?? 0) as number
	};
}

/** Persistent per-browser voter id — random uuid-ish token. */
const VOTER_PATTERN = /^[a-z0-9-]{8,64}$/i;

export function isValidVoter(voter: string): boolean {
	return VOTER_PATTERN.test(voter);
}

export function isValidGithubName(name: string): boolean {
	return /^(?!-)(?!.*--)[a-z\d-]{1,39}$/i.test(name) && !name.endsWith('-');
}

/** Toggle a vote; returns the new state and count for the entry. */
export async function toggleVote(
	db: D1Database,
	entryId: number,
	voter: string,
	gh: string
): Promise<{ voted: boolean; votes: number } | null> {
	const exists = await db
		.prepare('SELECT 1 AS x FROM gallery WHERE id = ?')
		.bind(entryId)
		.first();
	if (!exists) return null;

	const removed = await db
		.prepare('DELETE FROM votes WHERE entry_id = ? AND voter = ?')
		.bind(entryId, voter)
		.run();

	let voted = false;
	if (removed.meta.changes === 0) {
		await db
			.prepare('INSERT INTO votes (entry_id, voter, gh) VALUES (?, ?, ?)')
			.bind(entryId, voter, gh)
			.run();
		voted = true;
	}

	const votes =
		(await db
			.prepare('SELECT COUNT(*) AS n FROM votes WHERE entry_id = ?')
			.bind(entryId)
			.first<number>('n')) ?? 0;
	return { voted, votes };
}

export async function insertEntry(
	db: D1Database,
	input: SubmissionInput,
	ipHash: string
): Promise<void> {
	await db
		.prepare(
			'INSERT INTO gallery (name, author, viv, trig, subject, ip_hash) VALUES (?, ?, ?, ?, ?, ?)'
		)
		.bind(input.name, input.author, input.viv, input.trig, input.subject, ipHash)
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
		created_at: '',
		votes: 0
	},
	{
		id: -2,
		name: 'Rise',
		author: 'vivace',
		viv: '@sl-y!_child-ascend_ease-out-back @fd',
		trig: 'load',
		subject: 'stats',
		created_at: '',
		votes: 0
	},
	{
		id: -3,
		name: 'Drop',
		author: 'vivace',
		viv: '@dr',
		trig: 'load',
		subject: 'toast',
		created_at: '',
		votes: 0
	}
];
