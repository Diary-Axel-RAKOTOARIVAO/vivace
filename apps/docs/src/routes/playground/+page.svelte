<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteFlow, Background, Controls, type NodeTypes } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { TRIGGERS, type VivTrigger } from 'vivace';

	import TriggerNode from '$lib/components/nodes/TriggerNode.svelte';
	import AnimationNode from '$lib/components/nodes/AnimationNode.svelte';
	import ModifierNode from '$lib/components/nodes/ModifierNode.svelte';
	import PlusNode from '$lib/components/nodes/PlusNode.svelte';
	import PreviewRow from '$lib/components/PreviewRow.svelte';
	import { playground } from '$lib/stores/playground.svelte';
	import { compose, toSnippet } from '$lib/compose';
	import { EXAMPLES } from '$lib/examples';

	// Shared URLs (?c=@fd|@sl-y&on=appearing) seed the chain, A.css-style.
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const c = params.get('c');
		if (!c) return;
		const on = params.get('on');
		playground.load(
			c.split('|').filter(Boolean),
			on && (TRIGGERS as readonly string[]).includes(on) ? (on as VivTrigger) : 'load'
		);
	});

	const nodeTypes: NodeTypes = {
		trigger: TriggerNode,
		animation: AnimationNode,
		modifier: ModifierNode,
		add: PlusNode
	};

	const composition = $derived(compose(playground.chain, playground.nodeConfig));
	const snippet = $derived(toSnippet(composition));

	let copied = $state(false);
	let shared = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(snippet);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	async function share() {
		const url = new URL(window.location.href);
		url.search = '';
		url.searchParams.set('c', composition.viv);
		if (composition.on !== 'load') url.searchParams.set('on', composition.on);
		await navigator.clipboard.writeText(url.toString());
		shared = true;
		setTimeout(() => (shared = false), 1500);
	}

	function addRow() {
		playground.addExperiment(composition.viv, composition.on);
	}
</script>

<svelte:head>
	<title>Playground — Vivace</title>
</svelte:head>

<main>
	<header class="bar">
		<h1>Playground</h1>
		<p class="hint">
			Pick a trigger, then stack animations and modifiers from the <strong>+</strong> at the end of
			the chain.
		</p>
	</header>

	<div class="examples">
		<span>Examples:</span>
		{#each EXAMPLES as example (example.name)}
			<button class="chip" onclick={() => playground.load(example.tokens, example.on)}>
				{example.name}
			</button>
		{/each}
	</div>

	<div class="canvas">
		<SvelteFlow
			bind:nodes={playground.nodes}
			bind:edges={playground.edges}
			{nodeTypes}
			fitView
			colorMode="dark"
			nodesConnectable={false}
			defaultEdgeOptions={{ deletable: false }}
		>
			<Background />
			<Controls />
		</SvelteFlow>
	</div>

	<section class="result">
		<div class="code">
			{#if composition.complete}
				<code>{snippet}</code>
			{:else}
				<code class="dim">Add an animation from the + to compose…</code>
			{/if}
			<div class="code-actions">
				<button class="btn" onclick={copy} disabled={!composition.complete}>
					{copied ? 'Copied ✓' : 'Copy'}
				</button>
				<button class="btn" onclick={share} disabled={!composition.complete}>
					{shared ? 'Link copied ✓' : 'Share'}
				</button>
				<button class="btn primary" onclick={addRow} disabled={!composition.complete}>
					+ Add experiment
				</button>
			</div>
		</div>
		{#if composition.complete}
			<div class="live">
				{#key composition.viv + composition.on}
					<div
						data-viv={composition.viv}
						data-viv-on={composition.on}
						class="live-subject"
						class:as-parent={composition.viv.includes('_child')}
					>
						{#if composition.viv.includes('_child')}<i></i><i></i><i></i>{/if}
					</div>
				{/key}
				<span class="live-hint">
					{composition.on === 'load' ? 'plays on mount' : `waiting for ${composition.on}…`}
				</span>
			</div>
		{/if}
	</section>

	{#if playground.experiments.length > 0}
		<section class="experiments">
			<h2>Experiments</h2>
			{#each playground.experiments as experiment (experiment.id)}
				<PreviewRow {experiment} />
			{/each}
		</section>
	{/if}
</main>

<style>
	main {
		max-width: 1080px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 5rem;
	}

	.bar {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.bar h1 {
		margin: 0;
		font-size: 1.5rem;
	}

	.bar .hint {
		margin: 0;
		color: var(--text-dim);
		font-size: 0.9rem;
	}

	.examples {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.examples span {
		color: var(--text-dim);
		font-size: 0.85rem;
	}

	.chip {
		padding: 0.3rem 0.9rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--bg-card);
		color: var(--accent-2);
		font-family: var(--mono);
		font-size: 0.8rem;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.chip:hover {
		border-color: var(--accent);
	}

	.canvas {
		height: 420px;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.result {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1rem;
		margin-top: 1rem;
	}

	.code {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.9rem 1.25rem;
		overflow: hidden;
	}

	.code code {
		flex: 1;
		background: none;
		border: none;
		color: var(--accent-2);
		overflow-x: auto;
		white-space: nowrap;
	}

	.code .dim {
		color: var(--text-dim);
	}

	.code-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.live {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.5rem 1.25rem;
		min-width: 200px;
	}

	.live-subject {
		width: 44px;
		height: 44px;
		border-radius: 11px;
		background: var(--accent-grad);
	}

	/* _child compositions animate children, so give the subject some */
	.live-subject.as-parent {
		background: none;
		display: flex;
		gap: 4px;
	}

	.live-subject.as-parent i {
		flex: 1;
		border-radius: 5px;
		background: var(--accent-grad);
	}

	.live-hint {
		color: var(--text-dim);
		font-size: 0.8rem;
	}

	.experiments {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.experiments h2 {
		margin: 0 0 0.25rem;
		font-size: 1.1rem;
	}

	.btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		transform: none;
	}

	/* Shared look for the custom nodes (global — they live in child components) */
	:global(.viv-node) {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.75rem 1rem;
		width: 210px;
		font-size: 0.85rem;
	}

	:global(.viv-node header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-weight: 700;
		margin-bottom: 0.5rem;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	:global(.viv-node .remove) {
		background: none;
		border: none;
		color: var(--text-dim);
		cursor: pointer;
		font-size: 0.8rem;
		padding: 0 0.15rem;
	}

	:global(.viv-node .remove:hover) {
		color: var(--accent-2);
	}

	:global(.viv-node select) {
		width: 100%;
		margin-bottom: 0.4rem;
		background: var(--bg-raised);
		color: var(--text);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.35rem 0.5rem;
		font-family: var(--mono);
		font-size: 0.8rem;
	}

	:global(.viv-node p) {
		margin: 0.25rem 0 0;
		color: var(--text-dim);
		font-size: 0.75rem;
		line-height: 1.4;
	}
</style>
