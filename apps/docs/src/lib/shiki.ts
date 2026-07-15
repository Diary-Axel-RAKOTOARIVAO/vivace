import type { HighlighterCore } from 'shiki/core';

/**
 * Lazy, fine-grained Shiki bundle — only the grammars the docs use, on
 * the JS regex engine (no wasm). Loaded client-side by CodeBlock.
 */
let highlighter: Promise<HighlighterCore> | null = null;

function get(): Promise<HighlighterCore> {
	highlighter ??= (async () => {
		const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
			import('shiki/core'),
			import('shiki/engine/javascript')
		]);
		return createHighlighterCore({
			themes: [import('shiki/themes/github-light.mjs')],
			langs: [
				import('shiki/langs/html.mjs'),
				import('shiki/langs/typescript.mjs'),
				import('shiki/langs/javascript.mjs'),
				import('shiki/langs/tsx.mjs'),
				import('shiki/langs/svelte.mjs'),
				import('shiki/langs/vue.mjs'),
				import('shiki/langs/scss.mjs'),
				import('shiki/langs/shellscript.mjs')
			],
			engine: createJavaScriptRegexEngine({ forgiving: true })
		});
	})();
	return highlighter;
}

export async function highlight(code: string, lang: string): Promise<string> {
	try {
		const h = await get();
		return h.codeToHtml(code, { lang, theme: 'github-light' });
	} catch {
		return '';
	}
}
