import type { HighlighterCore } from 'shiki/core';

/**
 * Lazy, fine-grained Shiki bundle on the JS regex engine (no wasm).
 * Grammars load per-language on first use instead of all upfront —
 * compiling 8 grammars at page load was costing ~seconds of mobile
 * main-thread time for pages that highlight 2 languages.
 */
const LANG_LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
	html: () => import('shiki/langs/html.mjs'),
	typescript: () => import('shiki/langs/typescript.mjs'),
	javascript: () => import('shiki/langs/javascript.mjs'),
	tsx: () => import('shiki/langs/tsx.mjs'),
	svelte: () => import('shiki/langs/svelte.mjs'),
	vue: () => import('shiki/langs/vue.mjs'),
	scss: () => import('shiki/langs/scss.mjs'),
	shellscript: () => import('shiki/langs/shellscript.mjs')
};

let corePromise: Promise<HighlighterCore> | null = null;
const loadedLangs = new Set<string>();

function getCore(): Promise<HighlighterCore> {
	corePromise ??= (async () => {
		const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
			import('shiki/core'),
			import('shiki/engine/javascript')
		]);
		return createHighlighterCore({
			themes: [import('shiki/themes/github-light.mjs')],
			langs: [],
			engine: createJavaScriptRegexEngine({ forgiving: true })
		});
	})();
	return corePromise;
}

export async function highlight(code: string, lang: string): Promise<string> {
	try {
		const loader = LANG_LOADERS[lang];
		if (!loader) return '';
		const core = await getCore();
		if (!loadedLangs.has(lang)) {
			// biome-ignore lint/suspicious/noExplicitAny: shiki's lang input type is a union of raw shapes
			await core.loadLanguage((await loader()).default as any);
			loadedLangs.add(lang);
		}
		return core.codeToHtml(code, { lang, theme: 'github-light' });
	} catch {
		return '';
	}
}
