import type { VivTrigger } from 'vivace';
import type { ChainItem } from './stores/playground.svelte';

export interface Composition {
	viv: string;
	on: VivTrigger;
	/** True once the chain holds at least one animation key. */
	complete: boolean;
}

/**
 * Resolve the chain into a data-viv composition using the A.css-style
 * notation: each @key starts a group, _modifiers concatenate onto the
 * preceding key (the _ prefix delimits them), and groups are separated
 * by spaces — "@fd @sl-y_ease-out-back".
 */
export function compose(items: ChainItem[], on: VivTrigger): Composition {
	const groups: string[] = [];
	for (const { token } of items) {
		if (!token) continue;
		if (token.startsWith('_') && groups.length > 0) {
			groups[groups.length - 1] += token;
		} else {
			groups.push(token);
		}
	}

	return {
		viv: groups.join(' '),
		on,
		complete: items.some((i) => i.token.startsWith('@'))
	};
}

/** Render a composition as copy-pasteable HTML. */
export function toSnippet(c: Composition): string {
	const on = c.on === 'load' ? '' : ` data-viv-on="${c.on}"`;
	return `<div data-viv="${c.viv}"${on}>…</div>`;
}
