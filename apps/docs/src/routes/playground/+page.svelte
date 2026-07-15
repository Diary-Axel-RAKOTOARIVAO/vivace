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

<main class="mx-auto flex max-w-4xl flex-col items-center gap-9 px-5 py-12">
	<h1 class="text-2xl font-extrabold tracking-tight">Playground</h1>

	<!-- Composer: [on ▾] (−)[token ▾] … (+)  PLAY -->
	<div class="flex flex-wrap items-center justify-center gap-2.5">
		<label
			class="flex items-center gap-1 rounded-field border border-base-300 bg-base-200/60 py-1.5 pr-1 pl-2.5"
		>
			<span class="font-mono text-xs text-base-content/50">on:</span>
			<select
				bind:value={playground.triggerValue}
				class="cursor-pointer bg-transparent font-mono text-[13px] outline-none"
				aria-label="Trigger"
			>
				{#each TRIGGER_OPTIONS as option (option.value)}
					<option value={option.value}>{option.value}</option>
				{/each}
			</select>
		</label>

		{#each playground.items as item (item.id)}
			<span
				class="flex items-center gap-0.5 rounded-field border border-base-300 bg-base-100 py-1.5 pr-1 pl-1.5"
			>
				<button
					class="btn btn-circle btn-ghost h-5 w-5 min-h-0 text-error"
					aria-label="Remove token"
					onclick={() => playground.remove(item.id)}
				>
					<iconify-icon icon="lucide:minus" width="13"></iconify-icon>
				</button>
				<select
					bind:value={item.token}
					class="token cursor-pointer bg-transparent text-[13px] outline-none"
					aria-label="Token"
				>
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

		<button
			class="btn btn-circle btn-outline btn-sm border-base-300"
			aria-label="Add token"
			onclick={() => playground.add()}
		>
			<iconify-icon icon="lucide:plus" width="15"></iconify-icon>
		</button>

		<button
			class="btn btn-primary btn-sm ml-3 tracking-[0.15em]"
			onclick={play}
			disabled={!composition.complete}
		>
			PLAY
		</button>
	</div>

	<!-- Target mode: single element vs staggered children -->
	<div class="flex items-center gap-2" role="group" aria-label="Preview target">
		<button
			class="btn btn-square btn-sm {effectiveMode === 'single' ? 'btn-neutral' : 'btn-ghost'}"
			disabled={childForced}
			title={childForced ? '_child compositions animate children' : 'Single element'}
			aria-label="Single element"
			onclick={() => (mode = 'single')}
		>
			<iconify-icon icon="lucide:square" width="16"></iconify-icon>
		</button>
		<span class="h-6 w-px bg-base-300"></span>
		<button
			class="btn btn-square btn-sm {effectiveMode === 'children' ? 'btn-neutral' : 'btn-ghost'}"
			aria-label="Children"
			onclick={() => (mode = 'children')}
		>
			<iconify-icon icon="lucide:layout-grid" width="16"></iconify-icon>
		</button>
	</div>

	<!-- Preview: code wraps a dashed stage, like the A.css reference tool -->
	<section class="w-full">
		<code class="block overflow-x-auto whitespace-nowrap bg-transparent p-0 text-[13px]">
			<span class="text-base-content/40">&lt;div </span>data-viv=<span class="token"
				>"{composition.viv}"</span
			>{#if composition.on !== 'load'}
				data-viv-on=<span class="token">"{composition.on}"</span>{/if}<span
				class="text-base-content/40">&gt;</span
			>
		</code>

		<div
			class="my-2 flex justify-center overflow-hidden border border-dashed border-base-content/35 px-6 py-10"
			bind:this={stage}
		>
			{#key snippet + effectiveMode + childCount}
				{#if effectiveMode === 'single'}
					<div
						data-viv={composition.viv}
						data-viv-on={composition.on}
						class="flex h-18 w-18 items-center justify-center border border-base-300 bg-base-200 text-lg font-bold"
					>
						V
					</div>
				{:else}
					<div
						data-viv={composition.viv}
						data-viv-on={composition.on}
						class="flex flex-wrap justify-center gap-0.5"
					>
						{#each Array(childCount), i (i)}
							<div
								class="flex h-18 w-18 items-center justify-center border border-base-300 bg-base-200 text-lg font-bold"
							>
								V
							</div>
						{/each}
					</div>
				{/if}
			{/key}
		</div>

		<code class="block bg-transparent p-0 text-[13px] text-base-content/40">&lt;/div&gt;</code>

		{#if effectiveMode === 'children'}
			<div class="mt-3 flex justify-center gap-1.5">
				{#each [2, 4, 6, 8] as n (n)}
					<button
						class="btn btn-square btn-xs font-mono {childCount === n
							? 'btn-neutral'
							: 'btn-ghost border border-base-300'}"
						onclick={() => (childCount = n)}
					>
						{n}
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<div class="flex gap-2">
		<button class="btn btn-sm border-base-300" onclick={copy} disabled={!composition.complete}>
			<iconify-icon icon="lucide:copy" width="14"></iconify-icon>
			{copied ? 'Copied' : 'Copy'}
		</button>
		<button class="btn btn-sm border-base-300" onclick={share} disabled={!composition.complete}>
			<iconify-icon icon="lucide:link" width="14"></iconify-icon>
			{shared ? 'Link copied' : 'Share'}
		</button>
		<button class="btn btn-primary btn-sm" onclick={addRow} disabled={!composition.complete}>
			<iconify-icon icon="lucide:plus" width="14"></iconify-icon>
			Add experiment
		</button>
	</div>

	<div class="flex flex-wrap items-center justify-center gap-1.5">
		{#each EXAMPLES as example (example.name)}
			<button
				class="badge badge-lg cursor-pointer border-base-300 bg-base-100 font-mono text-xs hover:border-base-content/40"
				onclick={() => playground.load(example.tokens, example.on)}
			>
				{example.name}
			</button>
		{/each}
	</div>

	{#if playground.experiments.length > 0}
		<section class="flex w-full flex-col gap-3">
			<h2 class="text-lg font-bold">Experiments</h2>
			{#each playground.experiments as experiment (experiment.id)}
				<PreviewRow {experiment} />
			{/each}
		</section>
	{/if}
</main>
