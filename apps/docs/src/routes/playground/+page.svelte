<script lang="ts">
	import { onMount } from 'svelte';
	import Vivace, { MODIFIERS, PRESETS, TRIGGER_OPTIONS, TRIGGERS, type VivTrigger } from 'vivace';

	import PreviewRow from '$lib/components/PreviewRow.svelte';
	import Subject from '$lib/components/Subject.svelte';
	import PlaygroundTour, { TOUR_KEY } from '$lib/components/PlaygroundTour.svelte';
	import { playground } from '$lib/stores/playground.svelte';
	import { compose, toSnippet } from '$lib/compose';
	import { SUBJECTS } from '$lib/subjects';

	let tourOpen = $state(false);

	// Install hint in the code panel, honoring the package-manager choice
	// remembered by the docs' install tabs.
	const PM_COMMANDS: Record<string, string> = {
		bun: 'bun add vivace',
		npm: 'npm install vivace',
		pnpm: 'pnpm add vivace',
		yarn: 'yarn add vivace'
	};
	let installCommand = $state(PM_COMMANDS.bun!);
	let installCopied = $state(false);

	async function copyInstall() {
		await navigator.clipboard.writeText(installCommand);
		installCopied = true;
		setTimeout(() => (installCopied = false), 1500);
	}

	// Shared URLs (?c=@fd @sl-y_ease-out-back&on=appearing) seed the composer.
	onMount(() => {
		if (!localStorage.getItem(TOUR_KEY)) tourOpen = true;

		installCommand = PM_COMMANDS[localStorage.getItem('vivace-pm') ?? 'bun'] ?? PM_COMMANDS.bun!;

		const params = new URLSearchParams(window.location.search);
		const c = params.get('c');
		if (!c) return;
		const on = params.get('on');
		playground.load(
			c,
			on && (TRIGGERS as readonly string[]).includes(on) ? (on as VivTrigger) : 'load'
		);
	});

	const composition = $derived(compose(playground.groups, playground.triggerValue));
	const snippet = $derived(toSnippet(composition));

	// Widgets read their state straight from the groups.
	const childMode = $derived(
		playground.groups.some((g) => g.mods.some((m) => m.token.startsWith('_child')))
	);
	const originToken = $derived(
		playground.groups.flatMap((g) => g.mods).find((m) => m.token.startsWith('_origin'))?.token ??
			null
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

	// Preview subject: a mock page section the composition applies to.
	let template = $state('stats');
	let variant = $state('');
	const subject = $derived(SUBJECTS.find((s) => s.id === template) ?? SUBJECTS[0]);

	function pickSubject(id: string) {
		template = id;
		variant = SUBJECTS.find((s) => s.id === id)?.variants?.[0]?.id ?? '';
	}

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

	const publishUrl = $derived.by(() => {
		const params = new URLSearchParams({ c: composition.viv, subject: template });
		if (composition.on !== 'load') params.set('on', composition.on);
		return `/gallery?${params}`;
	});
</script>

<svelte:head>
	<title>Playground — Vivace</title>
</svelte:head>

<div class="flex h-[calc(100dvh-3.5rem)] flex-col md:flex-row">
	<!-- CANVAS: the <div> under test, on a flow-style dotted field -->
	<section class="dots relative min-h-[45vh] flex-1 overflow-hidden">
		<!-- generated markup, floating panel -->
		<div
			class="absolute top-4 left-4 z-10 max-w-[calc(100%-2rem)] overflow-x-auto rounded-box border border-base-300 bg-base-100/95 px-4 py-3 shadow-sm"
			data-tour="code"
		>
			<code class="block bg-transparent p-0 text-xs leading-relaxed whitespace-pre"><span
					class="text-base-content/40">&lt;div&nbsp;</span
				>data-viv=<span class="token">"{composition.viv}"</span>{#if composition.on !== 'load'}&nbsp;data-viv-on=<span
						class="token">"{composition.on}"</span
					>{/if}<span class="text-base-content/40">&gt;</span>{'\n'}<span
					class="text-base-content/30">  …</span
				>{'\n'}<span class="text-base-content/40">&lt;/div&gt;</span></code>
			<div class="mt-2.5 flex items-center gap-2 border-t border-base-200 pt-2">
				<code class="grow bg-transparent p-0 text-[11px] whitespace-nowrap text-base-content/55">
					<span class="text-base-content/35">$</span>
					{installCommand}
				</code>
				<button
					class="btn btn-ghost btn-xs h-5 min-h-0 px-1 text-base-content/45"
					title="Copy install command"
					aria-label="Copy install command"
					onclick={copyInstall}
				>
					<iconify-icon icon={installCopied ? 'lucide:check' : 'lucide:copy'} width="11"></iconify-icon>
				</button>
			</div>
		</div>

		<!-- subject picker, floating top-right rail -->
		<div
			class="absolute top-4 right-4 z-10 flex flex-col gap-0.5 rounded-box border border-base-300 bg-base-100/95 p-1 shadow-sm"
			role="group"
			aria-label="Preview subject"
			data-tour="subjects"
		>
			{#each SUBJECTS as s (s.id)}
				<button
					class="btn btn-square btn-sm {template === s.id ? 'btn-neutral' : 'btn-ghost'}"
					title={s.name}
					aria-label={s.name}
					aria-pressed={template === s.id}
					onclick={() => pickSubject(s.id)}
				>
					<iconify-icon icon={s.icon} width="16"></iconify-icon>
				</button>
			{/each}
		</div>

		<!-- stage -->
		<div class="flex h-full items-center justify-center p-10" bind:this={stage}>
			{#key snippet + template + variant + childCount}
				<Subject
					{template}
					{variant}
					viv={composition.viv}
					on={composition.on}
					count={childCount}
				/>
			{/key}
		</div>

		<!-- subject options, floating bottom-left: layout variants / child count -->
		{#if subject.variants || subject.repeat}
			<div
				class="absolute bottom-4 left-4 z-10 flex items-center gap-1 rounded-box border border-base-300 bg-base-100/95 p-1.5 shadow-sm"
				data-tour="options"
			>
				{#if subject.variants}
					{#each subject.variants as v (v.id)}
						<button
							class="btn btn-square btn-xs {variant === v.id ? 'btn-neutral' : 'btn-ghost'}"
							title={v.name}
							aria-label={v.name}
							aria-pressed={variant === v.id}
							onclick={() => (variant = v.id)}
						>
							<iconify-icon icon={v.icon} width="14"></iconify-icon>
						</button>
					{/each}
				{/if}
				{#if subject.repeat}
					<iconify-icon icon="lucide:layout-grid" width="14" class="ml-1 text-base-content/40"
					></iconify-icon>
					{#each [2, 3, 4, 6] as n (n)}
						<button
							class="btn btn-square btn-xs font-mono {childCount === n
								? 'btn-neutral'
								: 'btn-ghost'}"
							onclick={() => (childCount = n)}
						>
							{n}
						</button>
					{/each}
				{/if}
			</div>
		{/if}

		<!-- presets suited to the current subject, floating bottom-center -->
		<div
			class="absolute bottom-4 left-1/2 z-10 flex max-w-[55%] -translate-x-1/2 items-center gap-1.5 overflow-x-auto rounded-box border border-base-300 bg-base-100/95 p-1.5 shadow-sm"
			data-tour="presets"
		>
			{#each subject.presets as preset (preset.name)}
				<button
					class="btn btn-ghost btn-xs shrink-0 font-mono font-normal"
					onclick={() => playground.load(preset.viv, preset.on)}
				>
					{preset.name}
				</button>
			{/each}
		</div>

		<!-- replay, floating bottom-right -->
		<button
			class="btn btn-primary btn-circle absolute right-4 bottom-4 z-10 shadow-md"
			title="Play"
			aria-label="Play"
			onclick={play}
			disabled={!composition.complete}
		>
			<iconify-icon icon="lucide:play" width="18"></iconify-icon>
		</button>
	</section>

	<!-- SIDEBAR: controls -->
	<aside
		class="flex w-full flex-col border-t border-base-300 bg-base-100 md:h-full md:w-80 md:border-t-0 md:border-l"
	>
		<div class="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
			<!-- Target & origin widgets — on top -->
			<section data-tour="widgets">
				<h2 class="mb-3 text-[11px] font-semibold tracking-wider text-base-content/50 uppercase">
					Target · Origin
				</h2>
				<div
					class="flex items-center justify-center gap-8 rounded-field border border-base-300 bg-base-200/40 py-4"
				>
					<div class="flex flex-col items-center" role="group" aria-label="Animation target">
						<button
							class="p-1"
							title="Animate the element itself"
							aria-label="Animate the element itself"
							aria-pressed={!childMode}
							onclick={() => playground.setChildMode(false)}
						>
							<span
								class="block h-3.5 w-3.5 rounded-full border-2 transition-colors {!childMode
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
									class="block h-3.5 w-3.5 rounded-full border-2 transition-colors {childMode
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
								class="h-5 w-5 rounded-[3px] transition-colors {originToken === cell &&
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
			</section>

			<!-- Trigger -->
			<section data-tour="trigger">
				<h2 class="mb-3 text-[11px] font-semibold tracking-wider text-base-content/50 uppercase">
					Trigger
				</h2>
				<label class="flex items-center gap-2">
					<span class="font-mono text-xs text-base-content/50">on:</span>
					<select
						bind:value={playground.triggerValue}
						class="select select-sm grow font-mono text-[13px]"
						aria-label="Trigger"
					>
						{#each TRIGGER_OPTIONS as option (option.value)}
							<option value={option.value}>{option.value}</option>
						{/each}
					</select>
				</label>
			</section>

			<!-- Composition groups -->
			<section data-tour="composition">
				<h2 class="mb-3 text-[11px] font-semibold tracking-wider text-base-content/50 uppercase">
					Composition
				</h2>
				<div class="flex flex-col gap-2.5">
					{#each playground.groups as group (group.id)}
						<div class="rounded-field border border-base-300 bg-base-200/40 p-2.5">
							<div class="flex items-center gap-1">
								<select
									bind:value={group.key}
									class="select select-sm token grow bg-base-100 text-[13px]"
									aria-label="Animation key"
								>
									{#each PRESETS as preset (preset.key)}
										<optgroup label="{preset.key} — {preset.name}">
											{#each preset.variants as v (v)}
												<option value={v}>{v}</option>
											{/each}
										</optgroup>
									{/each}
								</select>
								{#if playground.groups.length > 1}
									<button
										class="btn btn-circle btn-ghost h-6 min-h-0 w-6 text-error"
										aria-label="Remove group"
										onclick={() => playground.removeGroup(group.id)}
									>
										<iconify-icon icon="lucide:x" width="13"></iconify-icon>
									</button>
								{/if}
							</div>

							{#if group.mods.length > 0}
								<div class="mt-1.5 flex flex-col gap-1 border-l-2 border-base-300 pl-2">
									{#each group.mods as mod (mod.id)}
										<span class="flex items-center gap-1">
											<button
												class="btn btn-circle btn-ghost h-5 min-h-0 w-5 text-error"
												aria-label="Remove modifier"
												onclick={() => playground.removeMod(group.id, mod.id)}
											>
												<iconify-icon icon="lucide:minus" width="12"></iconify-icon>
											</button>
											<select
												bind:value={mod.token}
												class="select select-xs token grow bg-base-100 text-xs"
												aria-label="Modifier"
											>
												{#each MODIFIERS as m (m.key)}
													<optgroup label="{m.key} — {m.name}">
														{#each m.variants as v (v)}
															<option value={v}>{v}</option>
														{/each}
													</optgroup>
												{/each}
											</select>
										</span>
									{/each}
								</div>
							{/if}

							<button
								class="btn btn-ghost btn-xs mt-1.5 gap-1 font-mono text-base-content/60"
								onclick={() => playground.addMod(group.id)}
							>
								<iconify-icon icon="lucide:plus" width="12"></iconify-icon>
								_modifier
							</button>
						</div>
					{/each}

					<button
						class="btn btn-outline btn-sm gap-1.5 border-base-300 tracking-[0.15em]"
						title="Mix in another animation key"
						onclick={() => playground.addGroup()}
					>
						<iconify-icon icon="lucide:plus" width="14"></iconify-icon>
						MIX
					</button>
				</div>
			</section>

			<!-- Experiments -->
			{#if playground.experiments.length > 0}
				<section>
					<h2 class="mb-3 text-[11px] font-semibold tracking-wider text-base-content/50 uppercase">
						Experiments · {playground.experiments.length}
					</h2>
					<div class="flex flex-col gap-2">
						{#each playground.experiments as experiment (experiment.id)}
							<PreviewRow {experiment} />
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<!-- Action bar: PLAY lives on the canvas; here you ship it -->
		<div
			class="grid grid-cols-[1fr_auto_auto_auto_auto] gap-1.5 border-t border-base-300 p-3"
			data-tour="actions"
		>
			<a
				class="btn btn-primary btn-sm gap-1.5 tracking-[0.15em] {composition.complete
					? ''
					: 'btn-disabled'}"
				title="Publish to the gallery"
				href={publishUrl}
			>
				<iconify-icon icon="lucide:upload" width="14"></iconify-icon>
				CREATE
			</a>
			<button
				class="btn btn-square btn-sm border-base-300"
				title="Copy snippet"
				aria-label="Copy snippet"
				onclick={copy}
				disabled={!composition.complete}
			>
				<iconify-icon icon={copied ? 'lucide:check' : 'lucide:copy'} width="14"></iconify-icon>
			</button>
			<button
				class="btn btn-square btn-sm border-base-300"
				title="Copy share link"
				aria-label="Copy share link"
				onclick={share}
				disabled={!composition.complete}
			>
				<iconify-icon icon={shared ? 'lucide:check' : 'lucide:link'} width="14"></iconify-icon>
			</button>
			<button
				class="btn btn-square btn-sm border-base-300"
				title="Keep as experiment"
				aria-label="Keep as experiment"
				onclick={addRow}
				disabled={!composition.complete}
			>
				<iconify-icon icon="lucide:bookmark-plus" width="14"></iconify-icon>
			</button>
			<button
				class="btn btn-square btn-ghost btn-sm text-base-content/50"
				title="How does this work?"
				aria-label="Open the tour"
				onclick={() => (tourOpen = true)}
			>
				<iconify-icon icon="lucide:circle-help" width="15"></iconify-icon>
			</button>
		</div>
	</aside>
</div>

<PlaygroundTour bind:open={tourOpen} />

<style>
	/* Svelte-Flow-style dotted field */
	.dots {
		background-color: var(--color-base-200);
		background-image: radial-gradient(
			color-mix(in oklch, var(--color-base-content) 22%, transparent) 1px,
			transparent 1px
		);
		background-size: 20px 20px;
	}
</style>
