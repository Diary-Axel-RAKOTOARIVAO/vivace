import type { VivTrigger } from 'vivace';

/**
 * The playground is a linear chain, A.css-reference-tool style:
 * [trigger ▾] [⊖ token ▾] [⊖ token ▾] [⊕] — every token is a dropdown
 * pill, ⊕ appends one, ⊖ removes its own.
 */
export interface ChainItem {
	id: number;
	token: string;
}

export interface Experiment {
	id: number;
	viv: string;
	on: VivTrigger;
	playing: boolean;
}

let nextItemId = 1;
let nextExperimentId = 1;

class PlaygroundStore {
	triggerValue = $state<VivTrigger>('load');
	items = $state<ChainItem[]>([{ id: 0, token: '@fd' }]);
	experiments = $state<Experiment[]>([]);

	add(token = '@fd') {
		this.items.push({ id: nextItemId++, token });
	}

	remove(id: number) {
		this.items = this.items.filter((i) => i.id !== id);
	}

	/** Replace the whole chain with a composition (examples, shared URLs). */
	load(tokens: string[], on: VivTrigger) {
		this.triggerValue = on;
		this.items = tokens.map((token) => ({ id: nextItemId++, token }));
	}

	addExperiment(viv: string, on: VivTrigger) {
		this.experiments.push({ id: nextExperimentId++, viv, on, playing: true });
	}

	removeExperiment(id: number) {
		this.experiments = this.experiments.filter((e) => e.id !== id);
	}
}

export const playground = new PlaygroundStore();
