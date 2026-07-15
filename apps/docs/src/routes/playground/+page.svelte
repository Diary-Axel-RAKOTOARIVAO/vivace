<script lang="ts">
	import { onMount } from 'svelte';
	import Vivace, { MODIFIERS, PRESETS, TRIGGER_OPTIONS, TRIGGERS, type VivTrigger } from 'vivace';

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

	const composition = $derived(compose(playground.items, playground.triggerValue));
	const snippet = $derived(toSnippet(composition));

	// Preview target: one element, or a parent whose children animate.
	// _child compositions only make sense on children — force that mode.
	let mode = $state<'single' | 'children'>('single');
	const childForced = $derived(composition.viv.includes('_child'));
	const effectiveMode = $derived(childForced ? 'children' : mode);
	let childCount = $state(4);

	let stage: HTMLElement;

	function play() {
		for (const el of stage.querySelectorAll<HTMLElement>('[data-viv]')) {
			Vivace.trigger(el);
		}
	}

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
	<h1 class="gradient-text">Playground</h1>

	<!-- Composer: [on ▾] (−)[token ▾] … (+)  PLAY -->
	<div class="composer">
		<span class="pill trigger-pill">
			<span class="pill-label">on:</span>
			<select bind:value={playground.triggerValue} aria-label="Trigger">
				{#each TRIGGER_OPTIONS as option (option.value)}
					<option value={option.value}>{option.value}</option>
				{/each}
			</select>
		</span>

		{#each playground.items as item (item.id)}
			<span class="pill token-pill">
				<button
					class="round minus"
					aria-label="Remove token"
					onclick={() => playground.remove(item.id)}>−</button
				>
				<select bind:value={item.token} aria-label="Token">
					<optgroup label="Animations">
						{#each PRESETS as preset (preset.key)}
							{#each preset.variants as v (v)}
								<option value={v}>{v}</option>
							{/each}
						{/each}
					</optgroup>
					<optgroup label="Modifiers">
						{#each MODIFIERS as mod (mod.key)}
							{#each mod.variants as v (v)}
								<option value={v}>{v}</option>
							{/each}
						{/each}
					</optgroup>
				</select>
			</span>
		{/each}

		<button class="round plus" aria-label="Add token" onclick={() => playground.add()}>+</button>

		<button class="play" onclick={play} disabled={!composition.complete}>PLAY</button>
	</div>

	<!-- Target mode: single element vs staggered children -->
	<div class="target" role="group" aria-label="Preview target">
		<button
			class="mode"
			class:active={effectiveMode === 'single'}
			disabled={childForced}
			title={childForced ? '_child compositions animate children' : 'Single element'}
			aria-label="Single element"
			onclick={() => (mode = 'single')}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" /></svg>
		</button>
		<span class="sep"></span>
		<button
			class="mode"
			class:active={effectiveMode === 'children'}
			aria-label="Children"
			onclick={() => (mode = 'children')}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				{#each [3, 10, 17] as y (y)}
					{#each [3, 10, 17] as x (x)}
						<rect {x} {y} width="4.5" height="4.5" />
					{/each}
				{/each}
			</svg>
		</button>
	</div>

	<!-- Preview: code wraps a dashed stage, like the A.css reference tool -->
	<section class="preview">
		<code class="tag open">
			<span class="dim">&lt;div </span>data-viv=<span class="str">"{composition.viv}"</span
			>{#if composition.on !== 'load'}<span> data-viv-on=</span><span class="str"
					>"{composition.on}"</span
				>{/if}<span class="dim">&gt;</span>
		</code>

		<div class="stage-wrap" bind:this={stage}>
			{#key snippet + effectiveMode + childCount}
				{#if effectiveMode === 'single'}
					<div data-viv={composition.viv} data-viv-on={composition.on} class="box">V</div>
				{:else}
					<div data-viv={composition.viv} data-viv-on={composition.on} class="box-grid">
						{#each Array(childCount), i (i)}
							<div class="box">V</div>
						{/each}
					</div>
				{/if}
			{/key}
		</div>

		<code class="tag close"><span class="dim">&lt;/div&gt;</span></code>

		{#if effectiveMode === 'children'}
			<div class="counts">
				{#each [2, 4, 6, 8] as n (n)}
					<button class:active={childCount === n} onclick={() => (childCount = n)}>{n}</button>
				{/each}
			</div>
		{/if}
	</section>

	<div class="actions">
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

	<div class="examples">
		{#each EXAMPLES as example (example.name)}
			<button class="chip" onclick={() => playground.load(example.tokens, example.on)}>
				{example.name}
			</button>
		{/each}
	</div>

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
		max-width: 880px;
		margin: 0 auto;
		padding: 3rem 1.5rem 5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.25rem;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		letter-spacing: -0.03em;
	}

	/* ---------- composer ---------- */
	.composer {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.3rem 0.5rem;
	}

	.pill select {
		background: none;
		border: none;
		color: var(--text);
		font-family: var(--mono);
		font-size: 0.85rem;
		cursor: pointer;
		outline: none;
	}

	.trigger-pill .pill-label {
		color: #fbbf24;
		font-family: var(--mono);
		font-size: 0.8rem;
	}

	.trigger-pill select {
		color: #fbbf24;
	}

	.round {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: none;
		color: #fff;
		font-size: 0.85rem;
		line-height: 1;
		cursor: pointer;
		display: grid;
		place-items: center;
		padding: 0;
		flex-shrink: 0;
		transition: transform 0.15s ease;
	}

	.round:hover {
		transform: scale(1.15);
	}

	.plus {
		background: var(--accent);
	}

	.minus {
		background: var(--accent-2);
	}

	.play {
		margin-left: 0.75rem;
		padding: 0.45rem 1.3rem;
		background: none;
		border: 1px solid var(--text);
		color: var(--text);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		cursor: pointer;
		transition:
			background 0.15s ease,
			color 0.15s ease;
	}

	.play:hover:not(:disabled) {
		background: var(--text);
		color: var(--bg);
	}

	.play:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	/* ---------- target mode ---------- */
	.target {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.target .sep {
		width: 1px;
		height: 28px;
		background: var(--border);
	}

	.mode {
		background: none;
		border: none;
		padding: 0.25rem;
		cursor: pointer;
	}

	.mode svg {
		width: 30px;
		height: 30px;
		fill: none;
		stroke: var(--text-dim);
		stroke-width: 1.5;
	}

	.mode:hover svg {
		stroke: var(--text);
	}

	.mode.active svg {
		stroke: var(--accent);
		fill: color-mix(in srgb, var(--accent) 25%, transparent);
	}

	.mode:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	/* ---------- preview ---------- */
	.preview {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tag {
		background: none;
		border: none;
		font-size: 0.85rem;
		color: var(--text);
		overflow-x: auto;
		white-space: nowrap;
	}

	.tag .dim {
		color: var(--text-dim);
	}

	.tag .str {
		color: var(--accent-2);
	}

	.stage-wrap {
		border: 1px dashed var(--text-dim);
		padding: 2.5rem 1.5rem;
		display: flex;
		justify-content: center;
		overflow: hidden;
	}

	.box {
		width: 72px;
		height: 72px;
		display: grid;
		place-items: center;
		border: 1px solid var(--border);
		background: linear-gradient(-45deg, var(--bg-card), var(--bg-raised));
		color: var(--text);
		font-weight: 700;
		font-size: 1.1rem;
	}

	.box-grid {
		display: flex;
		gap: 2px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.counts {
		display: flex;
		justify-content: center;
		gap: 0.4rem;
		margin-top: 0.5rem;
	}

	.counts button {
		width: 26px;
		height: 26px;
		border: 1px solid var(--border);
		background: var(--bg-card);
		color: var(--text-dim);
		font-family: var(--mono);
		font-size: 0.8rem;
		cursor: pointer;
	}

	.counts button.active {
		background: var(--text);
		color: var(--bg);
		border-color: var(--text);
	}

	/* ---------- actions / examples ---------- */
	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		transform: none;
	}

	.examples {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
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

	.experiments {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.experiments h2 {
		margin: 0 0 0.25rem;
		font-size: 1.1rem;
	}
</style>
