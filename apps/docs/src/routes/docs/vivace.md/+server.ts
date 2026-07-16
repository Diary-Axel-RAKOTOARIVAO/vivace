import { buildLlmsDoc } from '$lib/llms';
import type { RequestHandler } from './$types';

// Same document as /llms.txt, at a human-guessable .md path.
export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(buildLlmsDoc(), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
