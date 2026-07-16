import { buildLlmsDoc } from '$lib/llms';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(buildLlmsDoc(), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
