import type { VivTrigger } from 'vivace';
import type { ChainItem } from './stores/playground.svelte';

export interface Composition {
	viv: string;
	on: VivTrigger;
	/** True once the chain holds at least one animation key. */
	complete: boolean;
}

/**
 * Resolve the chain into a data-viv composition — animation keys first,
 * then modifiers, with the trigger deciding data-viv-on.
 */
export function compose(items: ChainItem[], on: VivTrigger): Composition {
	const animations = items.filter((i) => i.token.startsWith('@')).map((i) => i.token);
	const modifiers = items.filter((i) => i.token.startsWith('_')).map((i) => i.token);

	return {
		viv: [...animations, ...modifiers].join('|'),
		on,
		complete: animations.length > 0
	};
}

/** Render a composition as copy-pasteable HTML. */
export function toSnippet(c: Composition): string {
	const on = c.on === 'load' ? '' : ` data-viv-on="${c.on}"`;
	return `<div data-viv="${c.viv}"${on}>…</div>`;
}
