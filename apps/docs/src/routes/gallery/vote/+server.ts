import { json } from '@sveltejs/kit';
import { isValidGithubName, isValidVoter, toggleVote } from '$lib/server/gallery';
import type { RequestHandler } from './$types';

/**
 * Toggle an upvote. Identity is deliberately lightweight: a persistent
 * per-browser voter token dedupes votes, and a GitHub username is
 * required as a nudge toward accountability — not verified.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB;
	if (!db) return json({ error: 'Voting is unavailable right now.' }, { status: 503 });

	let body: { id?: unknown; voter?: unknown; gh?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid payload.' }, { status: 400 });
	}

	const id = Number(body.id);
	const voter = String(body.voter ?? '');
	const gh = String(body.gh ?? '');

	if (!Number.isInteger(id) || id <= 0 || !isValidVoter(voter) || !isValidGithubName(gh)) {
		return json({ error: 'Invalid payload.' }, { status: 400 });
	}

	const result = await toggleVote(db, id, voter, gh);
	if (!result) return json({ error: 'Unknown entry.' }, { status: 404 });
	return json(result);
};
