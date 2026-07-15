import type { VivTrigger } from 'vivace';
import type { NodeConfig } from './stores/playground.svelte';

export interface Composition {
	viv: string;
	on: VivTrigger;
	/** True once the chain holds at least one animation. */
	complete: boolean;
}

/**
 * Resolve the chain into a data-viv composition: nodes contribute their
 * tokens in chain order — animations first, then modifiers, with the
 * trigger deciding data-viv-on.
 */
export function compose(chain: string[], config: Record<string, NodeConfig>): Composition {
	const animations: string[] = [];
	const modifiers: string[] = [];
	let trigger: VivTrigger = 'load';

	for (const id of chain) {
		const c = config[id];
		if (!c) continue;
		if (c.kind === 'trigger') trigger = c.value;
		else if (c.kind === 'animation' && c.token) animations.push(c.token);
		else if (c.kind === 'modifier' && c.token) modifiers.push(c.token);
	}

	return {
		viv: [...animations, ...modifiers].join('|'),
		on: trigger,
		complete: animations.length > 0
	};
}

/** Render a composition as copy-pasteable HTML. */
export function toSnippet(c: Composition): string {
	const on = c.on === 'load' ? '' : ` data-viv-on="${c.on}"`;
	return `<div data-viv="${c.viv}"${on}>…</div>`;
}
