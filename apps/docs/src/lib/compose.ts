import type { VivTrigger } from 'vivace-css';
import type { Group } from './stores/playground.svelte';

export interface Composition {
	viv: string;
	on: VivTrigger;
	/** True once at least one group has an @key. */
	complete: boolean;
}

/**
 * Render the groups in the canonical notation: modifiers concatenate
 * onto their key (the _ prefix delimits them), groups are separated by
 * spaces — "@fd @sl-y_ease-out-back".
 */
export function compose(groups: Group[], on: VivTrigger): Composition {
	const parts = groups
		.filter((g) => g.key)
		.map((g) => g.key + g.mods.map((m) => m.token).join(''));

	return {
		viv: parts.join(' '),
		on,
		complete: parts.length > 0
	};
}

/**
 * Parse a canonical viv string back into groups. Keys never contain
 * '_', and modifier tokens never contain a second '_', so splitting on
 * lookahead-underscore recovers the tokens exactly.
 */
export function parseViv(viv: string): { key: string; mods: string[] }[] {
	const groups: { key: string; mods: string[] }[] = [];
	for (const part of viv.split(/\s+/).filter(Boolean)) {
		const tokens = part.split(/(?=_)/);
		if (tokens[0]?.startsWith('@')) {
			groups.push({ key: tokens[0], mods: tokens.slice(1) });
		} else if (groups.length > 0) {
			// Modifier-only part: attach to the previous group.
			groups[groups.length - 1]!.mods.push(...tokens);
		}
	}
	return groups;
}

/** Render a composition as copy-pasteable HTML. */
export function toSnippet(c: Composition): string {
	const on = c.on === 'load' ? '' : ` data-viv-on="${c.on}"`;
	return `<div data-viv="${c.viv}"${on}>…</div>`;
}
