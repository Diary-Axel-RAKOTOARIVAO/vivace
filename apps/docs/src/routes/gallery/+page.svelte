<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Vivace, { TRIGGER_OPTIONS } from 'vivace';
	import Subject from '$lib/components/Subject.svelte';
	import { SUBJECTS } from '$lib/subjects';

	let { data, form } = $props();

	let formOpen = $state(false);

	// Playground's Publish button prefills via query params; failed
	// submissions echo the typed values back.
	const prefill = $derived({
		name: form && 'name' in form ? form.name : '',
		author: form && 'author' in form ? form.author : '',
		viv: form && 'viv' in form ? form.viv : (page.url.searchParams.get('c') ?? ''),
		trig: form && 'trig' in form ? form.trig : (page.url.searchParams.get('on') ?? 'load'),
		subject:
			form && 'subject' in form ? form.subject : (page.url.searchParams.get('subject') ?? 'card')
	});

	$effect(() => {
		if (prefill.viv) formOpen = true;
	});

	function replay(event: MouseEvent) {
		const card = event.currentTarget as HTMLElement;
		const el = card.querySelector<HTMLElement>('[data-viv]');
		if (el) Vivace.trigger(el);
	}

	function playgroundUrl(viv: string, trig: string) {
		const params = new URLSearchParams({ c: viv });
		if (trig !== 'load') params.set('on', trig);
		return `/playground?${params}`;
	}

	let copiedId = $state<number | null>(null);

	async function copyEntry(event: MouseEvent, entry: { id: number; viv: string; trig: string }) {
		event.stopPropagation();
		const on = entry.trig === 'load' ? '' : ` data-viv-on="${entry.trig}"`;
		await navigator.clipboard.writeText(`<div data-viv="${entry.viv}"${on}>…</div>`);
		copiedId = entry.id;
		setTimeout(() => (copiedId = null), 1500);
	}

	// Subjects have very different natural sizes (hero is ~3x a card) —
	// give each a base width and a scale so previews fill the stage
	// uniformly instead of clipping wide ones and dwarfing narrow ones.
	const PREVIEW_FIT: Record<string, { width: number; scale: number }> = {
		hero: { width: 640, scale: 0.52 },
		nav: { width: 576, scale: 0.62 },
		stats: { width: 460, scale: 0.72 },
		list: { width: 300, scale: 0.78 },
		toast: { width: 330, scale: 0.8 },
		card: { width: 250, scale: 0.68 }
	};

	function fit(subject: string) {
		return PREVIEW_FIT[subject] ?? PREVIEW_FIT.card!;
	}
</script>

<svelte:head>
	<title>Gallery — Vivace</title>
	<meta name="description" content="Community-shared Vivace compositions." />
</svelte:head>

<main class="mx-auto max-w-5xl px-5 py-10">
	<header class="mb-8 flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-extrabold tracking-tight">Gallery</h1>
			<p class="mt-1 text-base-content/60">
				Compositions the community shipped. Click a card to replay it.
			</p>
		</div>
		<button class="btn btn-primary btn-sm" onclick={() => (formOpen = !formOpen)}>
			<iconify-icon icon="lucide:upload" width="14"></iconify-icon>
			Share yours
		</button>
	</header>

	{#if form?.published}
		<div class="alert alert-success mb-6">
			<iconify-icon icon="lucide:party-popper" width="16"></iconify-icon>
			Published — thanks for sharing!
		</div>
	{/if}

	{#if formOpen}
		<form
			method="POST"
			action="?/submit"
			use:enhance={() =>
				async ({ update }) => {
					await update();
					formOpen = false;
				}}
			class="mb-8 grid gap-3 rounded-box border border-base-300 bg-base-200/40 p-5 md:grid-cols-2"
		>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Name
				<input
					name="name"
					required
					minlength="2"
					maxlength="40"
					class="input input-sm w-full"
					placeholder="Silky entrance"
					value={prefill.name}
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				GitHub username
				<input
					name="author"
					required
					maxlength="39"
					pattern="[A-Za-z0-9\-]+"
					class="input input-sm w-full font-mono"
					placeholder="octocat"
					value={prefill.author}
				/>
				<span class="text-[11px] font-normal text-base-content/50">
					Shown with your avatar, linked to your profile.
				</span>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium md:col-span-2">
				Composition
				<input
					name="viv"
					required
					maxlength="200"
					class="input input-sm w-full font-mono"
					placeholder="@fd @sl-y_ease-out-back"
					value={prefill.viv}
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Trigger
				<select name="trig" class="select select-sm w-full font-mono" value={prefill.trig}>
					{#each TRIGGER_OPTIONS as t (t.value)}
						<option value={t.value}>{t.value}</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Preview subject
				<select
					name="subject"
					class="select select-sm w-full"
					value={prefill.subject}
				>
					{#each SUBJECTS as s (s.id)}
						<option value={s.id}>{s.name}</option>
					{/each}
				</select>
			</label>
			{#if form?.error}
				<p class="text-sm text-error md:col-span-2">{form.error}</p>
			{/if}
			{#if !data.live}
				<p class="text-sm text-warning md:col-span-2">
					The gallery database isn't connected in this environment — submissions are disabled.
				</p>
			{/if}
			<div class="flex gap-2 md:col-span-2">
				<button class="btn btn-primary btn-sm" disabled={!data.live}>Publish</button>
				<button type="button" class="btn btn-ghost btn-sm" onclick={() => (formOpen = false)}>
					Cancel
				</button>
			</div>
		</form>
	{/if}

	<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
		{#each data.entries as entry (entry.id)}
			<article
				class="entry group overflow-hidden rounded-box border border-base-300 transition-colors hover:border-base-content/40"
			>
				<button
					class="dots relative flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden border-b border-base-200"
					title="Click to play"
					onclick={replay}
				>
					<div
						class="pointer-events-none flex shrink-0 justify-center"
						style="width: {fit(entry.subject).width}px; transform: scale({fit(entry.subject)
							.scale});"
					>
						<Subject template={entry.subject} viv={entry.viv} on="load" count={3} />
					</div>
					<span
						class="absolute top-2 right-2 flex items-center gap-1 rounded-full border border-base-300 bg-base-100/90 px-2 py-0.5 text-[10px] font-medium text-base-content/55 transition-colors group-hover:border-base-content/40 group-hover:text-base-content"
					>
						<iconify-icon icon="lucide:play" width="10"></iconify-icon>
						click to play
					</span>
				</button>
				<div class="flex items-start justify-between gap-3 p-4">
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<span class="font-semibold">{entry.name}</span>
							<a
								href="https://github.com/{entry.author}"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1 text-xs text-base-content/45 hover:text-base-content"
								onclick={(e) => e.stopPropagation()}
							>
								<img
									src="https://github.com/{entry.author}.png?size=32"
									alt=""
									loading="lazy"
									class="h-4 w-4 rounded-full bg-base-300"
								/>
								{entry.author}
							</a>
						</div>
						<code class="mt-1 block overflow-x-auto bg-transparent p-0 text-[11px] whitespace-nowrap text-base-content/60">
							{entry.viv}{entry.trig !== 'load' ? ` · on:${entry.trig}` : ''}
						</code>
					</div>
					<span class="flex shrink-0 gap-1">
						<button
							class="btn btn-ghost btn-xs gap-1 text-base-content/60"
							title="Copy the snippet"
							onclick={(e) => copyEntry(e, entry)}
						>
							<iconify-icon
								icon={copiedId === entry.id ? 'lucide:check' : 'lucide:copy'}
								width="12"
							></iconify-icon>
							{copiedId === entry.id ? 'copied' : 'copy'}
						</button>
						<a
							href={playgroundUrl(entry.viv, entry.trig)}
							class="btn btn-ghost btn-xs gap-1 text-base-content/60"
							title="Open in the playground"
							onclick={(e) => e.stopPropagation()}
						>
							<iconify-icon icon="lucide:pencil-ruler" width="12"></iconify-icon>
							remix
						</a>
					</span>
				</div>
			</article>
		{/each}
	</div>

	{#if data.entries.length === 0}
		<p class="py-16 text-center text-base-content/50">Nothing here yet — be the first to share.</p>
	{/if}
</main>

<style>
	.dots {
		background-color: var(--color-base-200);
		background-image: radial-gradient(
			color-mix(in oklch, var(--color-base-content) 18%, transparent) 1px,
			transparent 1px
		);
		background-size: 18px 18px;
	}
</style>
