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

	// Widgets read their state straight from the token chain.
	const childMode = $derived(playground.items.some((i) => i.token.startsWith('_child')));
	const originToken = $derived(
		playground.items.find((i) => i.token.startsWith('_origin'))?.token ?? null
	);

	// 3x3 origin picker; null = center = default (no token)
	const ORIGIN_CELLS: (string | null)[] = [
		'_origin-lt',
		'_origin-t',
		'_origin-rt',
		'_origin-l',
		null,
		'_origin-r',
		'_origin-lb',
		'_origin-b',
		'_origin-rb'
	];

	let childCount = $state(3);

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

<main class="mx-auto max-w-5xl px-5 py-12">
	<h1 class="mb-8 text-2xl font-extrabold tracking-tight">Playground</h1>

	<div class="grid items-start gap-10 md:grid-cols-[1fr_19rem]">
		<!-- LEFT: the actual <div> -->
		<section class="min-w-0">
			<code class="block overflow-x-auto bg-transparent p-0 text-[13px] whitespace-nowrap">
				<span class="text-base-content/40">&lt;div </span>data-viv=<span class="token"
					>"{composition.viv}"</span
				>{#if composition.on !== 'load'}
					data-viv-on=<span class="token">"{composition.on}"</span>{/if}<span
					class="text-base-content/40">&gt;</span
				>
			</code>

			<div
				class="my-2 flex min-h-56 items-center justify-center overflow-hidden border border-dashed border-base-content/35 px-6 py-10"
				bind:this={stage}
			>
				{#key snippet + childMode + childCount}
					{#if childMode}
						<div
							data-viv={composition.viv}
							data-viv-on={composition.on}
							class="flex flex-wrap justify-center gap-1"
						>
							{#each Array(childCount), i (i)}
								<div
									class="flex h-20 w-24 items-center justify-center border border-base-300 bg-base-200 text-lg font-bold"
								>
									V
								</div>
							{/each}
						</div>
					{:else}
						<div
							data-viv={composition.viv}
							data-viv-on={composition.on}
							class="flex h-20 w-24 items-center justify-center border border-base-300 bg-base-200 text-lg font-bold"
						>
							V
						</div>
					{/if}
				{/key}
			</div>

			<code class="block bg-transparent p-0 text-[13px] text-base-content/40">&lt;/div&gt;</code>

			{#if childMode}
				<div class="mt-3 flex gap-1.5">
					{#each [2, 3, 4, 6] as n (n)}
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

		<!-- RIGHT: controls -->
		<aside class="flex flex-col gap-5 rounded-box border border-base-300 bg-base-200/40 p-5">
			<!-- Trigger -->
			<label class="flex items-center justify-between gap-2">
				<span class="font-mono text-xs text-base-content/50">on:</span>
				<select
					bind:value={playground.triggerValue}
					class="select select-sm grow bg-base-100 font-mono text-[13px]"
					aria-label="Trigger"
				>
					{#each TRIGGER_OPTIONS as option (option.value)}
						<option value={option.value}>{option.value}</option>
					{/each}
				</select>
			</label>

			<!-- Token chain -->
			<div class="flex flex-col gap-1.5">
				{#each playground.items as item (item.id)}
					<span class="flex items-center gap-1">
						<button
							class="btn btn-circle btn-ghost h-5 min-h-0 w-5 text-error"
							aria-label="Remove token"
							onclick={() => playground.remove(item.id)}
						>
							<iconify-icon icon="lucide:minus" width="13"></iconify-icon>
						</button>
						<select
							bind:value={item.token}
							class="select select-sm token grow bg-base-100 text-[13px]"
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
					class="btn btn-outline btn-sm mt-1 gap-1 border-base-300"
					aria-label="Add token"
					onclick={() => playground.add()}
				>
					<iconify-icon icon="lucide:plus" width="14"></iconify-icon>
					token
				</button>
			</div>

			<!-- Target (tree) & origin (grid), like the A.css reference tool -->
			<div class="flex items-center justify-center gap-6">
				<div class="flex flex-col items-center" role="group" aria-label="Animation target">
					<button
						class="p-1"
						title="Animate the element itself"
						aria-label="Animate the element itself"
						aria-pressed={!childMode}
						onclick={() => playground.setChildMode(false)}
					>
						<span
							class="block h-3.5 w-3.5 rounded-full border-2 {!childMode
								? 'border-accent bg-accent'
								: 'border-base-content/40 bg-base-100'}"
						></span>
					</button>
					<svg width="46" height="10" viewBox="0 0 46 10" class="text-base-content/30">
						<path
							d="M23 0 L7 10 M23 0 L23 10 M23 0 L39 10"
							stroke="currentColor"
							fill="none"
							stroke-width="1.5"
						/>
					</svg>
					<button
						class="flex gap-2 p-1"
						title="Animate the children (_child)"
						aria-label="Animate the children"
						aria-pressed={childMode}
						onclick={() => playground.setChildMode(true)}
					>
						{#each [0, 1, 2] as i (i)}
							<span
								class="block h-3.5 w-3.5 rounded-full border-2 {childMode
									? 'border-accent bg-accent'
									: 'border-base-content/40 bg-base-100'}"
							></span>
						{/each}
					</button>
				</div>

				<span class="h-12 w-px bg-base-300"></span>

				<div
					class="grid grid-cols-3 gap-[3px]"
					role="group"
					aria-label="Transform origin (_origin)"
				>
					{#each ORIGIN_CELLS as cell, i (i)}
						<button
							class="h-4.5 w-4.5 rounded-[3px] transition-colors {originToken === cell &&
							cell !== null
								? 'bg-accent'
								: cell === null && originToken === null
									? 'bg-base-content/50'
									: 'bg-base-300 hover:bg-base-content/35'}"
							title={cell ?? 'center (default)'}
							aria-label={cell ?? 'center (default)'}
							onclick={() => playground.setOrigin(cell)}
						></button>
					{/each}
				</div>
			</div>

			<!-- Actions -->
			<button
				class="btn btn-primary tracking-[0.15em]"
				onclick={play}
				disabled={!composition.complete}
			>
				PLAY
			</button>
			<div class="grid grid-cols-3 gap-1.5">
				<button class="btn btn-sm border-base-300" onclick={copy} disabled={!composition.complete}>
					{copied ? '✓' : 'Copy'}
				</button>
				<button class="btn btn-sm border-base-300" onclick={share} disabled={!composition.complete}>
					{shared ? '✓' : 'Share'}
				</button>
				<button class="btn btn-sm border-base-300" onclick={addRow} disabled={!composition.complete}>
					Keep
				</button>
			</div>
		</aside>
	</div>

	<div class="mt-8 flex flex-wrap items-center gap-1.5">
		<span class="mr-1 text-sm text-base-content/50">Examples:</span>
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
		<section class="mt-8 flex w-full flex-col gap-3">
			<h2 class="text-lg font-bold">Experiments</h2>
			{#each playground.experiments as experiment (experiment.id)}
				<PreviewRow {experiment} />
			{/each}
		</section>
	{/if}
</main>
