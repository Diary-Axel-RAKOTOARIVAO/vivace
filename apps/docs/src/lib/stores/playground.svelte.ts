import type { VivTrigger } from 'vivace-css';
import { parseViv } from '$lib/compose';

/**
 * The composer is a list of GROUPS, A.css reference-tool style: each
 * group is one @key plus the _modifiers connected to it, and MIX
 * appends another group — "@fd_ease-out-back @sl-y" is two groups.
 */
export interface Mod {
	id: number;
	token: string;
}

export interface Group {
	id: number;
	key: string;
	mods: Mod[];
}

export interface Experiment {
	id: number;
	viv: string;
	on: VivTrigger;
	playing: boolean;
}

let nextId = 1;
let nextExperimentId = 1;

class PlaygroundStore {
	triggerValue = $state<VivTrigger>('load');
	groups = $state<Group[]>([{ id: 0, key: '@fd', mods: [] }]);
	experiments = $state<Experiment[]>([]);

	/** MIX: add another @key group. */
	addGroup(key = '@fd') {
		this.groups.push({ id: nextId++, key, mods: [] });
	}

	removeGroup(id: number) {
		this.groups = this.groups.filter((g) => g.id !== id);
	}

	addMod(groupId: number, token = '_ease-out-back') {
		this.groups.find((g) => g.id === groupId)?.mods.push({ id: nextId++, token });
	}

	removeMod(groupId: number, modId: number) {
		const group = this.groups.find((g) => g.id === groupId);
		if (group) group.mods = group.mods.filter((m) => m.id !== modId);
	}

	/** Replace the whole composition (examples, shared URLs). */
	load(viv: string, on: VivTrigger) {
		this.triggerValue = on;
		this.groups = parseViv(viv).map((g) => ({
			id: nextId++,
			key: g.key,
			mods: g.mods.map((token) => ({ id: nextId++, token }))
		}));
		if (this.groups.length === 0) this.addGroup();
	}

	/** Target widget: animate children (adds _child) or the element itself. */
	setChildMode(on: boolean) {
		if (on) {
			if (!this.hasMod('_child')) this.addMod(this.groups[0]!.id, '_child-ascend');
		} else {
			this.stripMods('_child');
		}
	}

	/** Origin widget: swap the _origin-* token; null resets to center. */
	setOrigin(token: string | null) {
		this.stripMods('_origin');
		if (token && this.groups[0]) this.addMod(this.groups[0].id, token);
	}

	hasMod(prefix: string): boolean {
		return this.groups.some((g) => g.mods.some((m) => m.token.startsWith(prefix)));
	}

	findMod(prefix: string): string | null {
		for (const g of this.groups) {
			const hit = g.mods.find((m) => m.token.startsWith(prefix));
			if (hit) return hit.token;
		}
		return null;
	}

	private stripMods(prefix: string) {
		for (const g of this.groups) {
			g.mods = g.mods.filter((m) => !m.token.startsWith(prefix));
		}
	}

	addExperiment(viv: string, on: VivTrigger) {
		this.experiments.push({ id: nextExperimentId++, viv, on, playing: true });
	}

	removeExperiment(id: number) {
		this.experiments = this.experiments.filter((e) => e.id !== id);
	}
}

export const playground = new PlaygroundStore();
