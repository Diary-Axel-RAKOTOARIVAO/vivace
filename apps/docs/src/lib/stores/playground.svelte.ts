import type { Edge, Node } from '@xyflow/svelte';
import type { VivTrigger } from 'vivace';

/**
 * Config each chain node contributes to the composition. Node components
 * write here (keyed by node id) so composing doesn't depend on Svelte
 * Flow's internal data reactivity.
 */
export type NodeConfig =
	| { kind: 'trigger'; value: VivTrigger }
	| { kind: 'animation'; token: string }
	| { kind: 'modifier'; token: string };

export interface Experiment {
	id: number;
	viv: string;
	on: VivTrigger;
	playing: boolean;
}

export const TRIGGER_ID = 'trigger';
export const PLUS_ID = 'plus';
const SPACING = 250;

let nextNodeId = 1;
let nextExperimentId = 1;

/**
 * The playground is a guided chain, not a free-form graph:
 * Trigger → Animation → Animation → … → (+). The plus node always hangs
 * off the tail; picking from it appends a node and pushes the plus along.
 */
class PlaygroundStore {
	nodeConfig = $state<Record<string, NodeConfig>>({});
	experiments = $state<Experiment[]>([]);

	/** The trigger node's selection — lives here so load() can drive it. */
	triggerValue = $state<VivTrigger>('appearing');

	/** Node ids in composition order, trigger first. */
	chain = $state<string[]>([TRIGGER_ID]);

	nodes = $state.raw<Node[]>([
		{ id: TRIGGER_ID, type: 'trigger', position: { x: 0, y: 80 }, data: {}, deletable: false },
		{ id: PLUS_ID, type: 'add', position: { x: SPACING, y: 96 }, data: {}, deletable: false }
	]);

	edges = $state.raw<Edge[]>([]);

	constructor() {
		this.rebuildEdges();
	}

	setConfig(id: string, config: NodeConfig) {
		this.nodeConfig[id] = config;
	}

	removeConfig(id: string) {
		delete this.nodeConfig[id];
	}

	/** Append an animation/modifier where the plus node sits, then move the plus along. */
	append(kind: 'animation' | 'modifier', initialToken: string) {
		const id = `${kind}-${nextNodeId++}`;
		const plus = this.nodes.find((n) => n.id === PLUS_ID)!;
		const at = { ...plus.position, y: 80 };

		this.nodes = [
			...this.nodes.filter((n) => n.id !== PLUS_ID),
			{ id, type: kind, position: at, data: { initialToken }, deletable: false },
			{ ...plus, position: { x: at.x + SPACING, y: 96 } }
		];
		this.chain.push(id);
		this.rebuildEdges();
	}

	/** Replace the whole chain with a composition (examples, shared URLs). */
	load(tokens: string[], on: VivTrigger) {
		this.triggerValue = on;
		this.chain = [TRIGGER_ID];
		this.nodes = [
			{ id: TRIGGER_ID, type: 'trigger', position: { x: 0, y: 80 }, data: {}, deletable: false },
			{ id: PLUS_ID, type: 'add', position: { x: SPACING, y: 96 }, data: {}, deletable: false }
		];
		this.rebuildEdges();
		for (const token of tokens) {
			this.append(token.startsWith('_') ? 'modifier' : 'animation', token);
		}
	}

	/** Remove a chain node; the chain heals around it. */
	remove(id: string) {
		if (id === TRIGGER_ID) return;
		this.chain = this.chain.filter((c) => c !== id);
		this.nodes = this.nodes.filter((n) => n.id !== id);
		this.rebuildEdges();
	}

	private rebuildEdges() {
		const edges: Edge[] = [];
		const path = [...this.chain, PLUS_ID];
		for (let i = 0; i < path.length - 1; i++) {
			edges.push({
				id: `e-${path[i]}-${path[i + 1]}`,
				source: path[i],
				target: path[i + 1],
				animated: path[i + 1] === PLUS_ID
			});
		}
		this.edges = edges;
	}

	addExperiment(viv: string, on: VivTrigger) {
		this.experiments.push({ id: nextExperimentId++, viv, on, playing: true });
	}

	removeExperiment(id: number) {
		this.experiments = this.experiments.filter((e) => e.id !== id);
	}
}

export const playground = new PlaygroundStore();
