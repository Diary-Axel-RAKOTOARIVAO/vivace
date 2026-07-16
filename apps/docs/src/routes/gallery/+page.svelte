<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Vivace, { TRIGGER_OPTIONS } from 'vivace';
	import GithubUserCheck from '$lib/components/GithubUserCheck.svelte';
	import Subject from '$lib/components/Subject.svelte';
	import { SUBJECTS } from '$lib/subjects';

	let { data, form } = $props();

	let formOpen = $state(false);

	// Author must pass the GitHub check before the form can submit.
	let authorValue = $state('');
	let authorVerified = $state(false);

	// The modal previews exactly what will be published.
	let vivValue = $state('');
	let subjectValue = $state('card');
	let previewNonce = $state(0);

	$effect(() => {
		authorValue = prefill.author ?? '';
		authorVerified = false;
		vivValue = prefill.viv ?? '';
		subjectValue = prefill.subject ?? 'card';
	});

	// --- voting: per-browser identity + a GitHub name, no login ---
	let ghName = $state('');
	let ghPromptFor = $state<number | null>(null);
	let ghInput = $state('');
	let ghVerified = $state(false);
	let votedIds = $state<Set<number>>(new Set());
	let voteCounts = $state<Record<number, number>>({});

	onMount(() => {
		ghName = localStorage.getItem('vivace-gh') ?? '';
		try {
			votedIds = new Set(JSON.parse(localStorage.getItem('vivace-voted') ?? '[]'));
		} catch {
			votedIds = new Set();
		}
	});

	function voterId(): string {
		let v = localStorage.getItem('vivace-voter');
		if (!v) {
			v = crypto.randomUUID();
			localStorage.setItem('vivace-voter', v);
		}
		return v;
	}

	async function vote(entryId: number) {
		if (!data.live) return;
		if (!ghName) {
			ghInput = '';
			ghVerified = false;
			ghPromptFor = entryId;
			return;
		}
		const res = await fetch('/gallery/vote', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ id: entryId, voter: voterId(), gh: ghName })
		});
		if (!res.ok) return;
		const { voted, votes } = (await res.json()) as { voted: boolean; votes: number };
		voteCounts[entryId] = votes;
		const next = new Set(votedIds);
		if (voted) next.add(entryId);
		else next.delete(entryId);
		votedIds = next;
		localStorage.setItem('vivace-voted', JSON.stringify([...next]));
	}

	function saveGh() {
		const value = ghInput.trim();
		if (!value || !ghVerified) return;
		ghName = value;
		localStorage.setItem('vivace-gh', value);
		const id = ghPromptFor;
		ghPromptFor = null;
		if (id !== null) vote(id);
	}

	const pageCount = $derived(Math.max(1, Math.ceil(data.total / data.perPage)));

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
	</header>

	{#if form?.published}
		<div class="alert alert-success mb-6">
			<iconify-icon icon="lucide:party-popper" width="16"></iconify-icon>
			Published — thanks for sharing!
		</div>
	{/if}

	{#if formOpen}
		<div class="modal modal-open" role="dialog" aria-label="Share a composition">
			<form
				id="share-form"
				method="POST"
				action="?/submit"
				use:enhance={() =>
					async ({ update }) => {
						await update();
						formOpen = false;
					}}
				class="modal-box grid max-w-xl gap-3 md:grid-cols-2"
			>
				<h3 class="text-base font-bold md:col-span-2">Share this composition</h3>

				<!-- live preview of exactly what gets published -->
				<div class="relative md:col-span-2">
					<div
						class="dots flex h-44 items-center justify-center overflow-hidden rounded-field border border-base-300"
					>
						<div
							class="pointer-events-none flex shrink-0 justify-center"
							style="width: {fit(subjectValue).width}px; transform: scale({fit(subjectValue)
								.scale});"
						>
							{#key `${vivValue}|${subjectValue}|${previewNonce}`}
								<Subject template={subjectValue} viv={vivValue} on="load" count={3} />
							{/key}
						</div>
					</div>
					<button
						type="button"
						class="btn btn-square btn-sm absolute right-2 bottom-2 border-base-300 bg-base-100/95"
						title="Replay"
						aria-label="Replay preview"
						onclick={() => (previewNonce += 1)}
					>
						<iconify-icon icon="lucide:rotate-ccw" width="14"></iconify-icon>
					</button>
				</div>
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
			<div class="flex flex-col gap-1 text-sm font-medium">
				GitHub username
				<GithubUserCheck bind:value={authorValue} bind:verified={authorVerified} name="author" />
			</div>
			<label class="flex flex-col gap-1 text-sm font-medium md:col-span-2">
				<span class="flex items-baseline justify-between">
					Composition
					<a
						href="/playground?c={encodeURIComponent(vivValue)}"
						class="text-xs font-normal text-base-content/50 underline underline-offset-2"
					>
						edit in playground
					</a>
				</span>
				<input
					name="viv"
					required
					maxlength="200"
					class="input input-sm w-full font-mono"
					placeholder="@fd @sl-y_ease-out-back"
					bind:value={vivValue}
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
				<select name="subject" class="select select-sm w-full" bind:value={subjectValue}>
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
				<button
					class="btn btn-primary btn-sm"
					disabled={!data.live || !authorVerified}
					title={authorVerified ? '' : 'Verify your GitHub username first'}
				>
					Publish
				</button>
				<button type="button" class="btn btn-ghost btn-sm" onclick={() => (formOpen = false)}>
					Cancel
				</button>
			</div>
		</form>
			<button class="modal-backdrop" aria-label="Close" onclick={() => (formOpen = false)}
			></button>
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
		<!-- share tile: composing happens in the playground; its Publish
		     button brings people back here with the form prefilled -->
		<a
			href="/playground"
			class="flex min-h-64 flex-col items-center justify-center gap-3 rounded-box border-2 border-dashed border-base-300 text-base-content/45 transition-colors hover:border-base-content/35 hover:text-base-content/70"
		>
			<span class="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-current">
				<iconify-icon icon="lucide:plus" width="22"></iconify-icon>
			</span>
			<span class="text-sm font-semibold">Start composing</span>
			<span class="-mt-2 text-xs">in the playground, then hit publish</span>
		</a>
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
							class="btn btn-xs gap-1 {votedIds.has(entry.id)
								? 'btn-neutral'
								: 'btn-ghost text-base-content/60'}"
							title={data.live ? 'Upvote' : 'Voting unavailable'}
							disabled={!data.live}
							onclick={() => vote(entry.id)}
						>
							<iconify-icon icon="lucide:arrow-big-up" width="13"></iconify-icon>
							{voteCounts[entry.id] ?? entry.votes}
						</button>
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

	{#if pageCount > 1}
		<nav class="mt-10 flex justify-center" aria-label="Gallery pages">
			<div class="join">
				<a
					class="join-item btn btn-sm {data.page <= 1 ? 'btn-disabled' : ''}"
					href="?page={data.page - 1}"
					aria-label="Previous page"
				>
					<iconify-icon icon="lucide:chevron-left" width="14"></iconify-icon>
				</a>
				{#each Array(pageCount), i (i)}
					<a
						class="join-item btn btn-sm font-mono {data.page === i + 1 ? 'btn-active' : ''}"
						href="?page={i + 1}"
					>
						{i + 1}
					</a>
				{/each}
				<a
					class="join-item btn btn-sm {data.page >= pageCount ? 'btn-disabled' : ''}"
					href="?page={data.page + 1}"
					aria-label="Next page"
				>
					<iconify-icon icon="lucide:chevron-right" width="14"></iconify-icon>
				</a>
			</div>
		</nav>
	{/if}
</main>

{#if ghPromptFor !== null}
	<div class="modal modal-open" role="dialog" aria-label="GitHub username">
		<div class="modal-box max-w-sm">
			<h3 class="text-base font-bold">One-time: your GitHub username</h3>
			<p class="mt-2 text-sm text-base-content/65">
				Votes stay tied to this browser — the username just keeps things accountable. No login,
				nothing to verify.
			</p>
			<div class="mt-4">
				<GithubUserCheck bind:value={ghInput} bind:verified={ghVerified} name="gh" />
			</div>
			<div class="modal-action">
				<button class="btn btn-ghost btn-sm" onclick={() => (ghPromptFor = null)}>Cancel</button>
				<button class="btn btn-primary btn-sm" onclick={saveGh} disabled={!ghVerified}>
					Save & upvote
				</button>
			</div>
		</div>
		<button class="modal-backdrop" aria-label="Close" onclick={() => (ghPromptFor = null)}
		></button>
	</div>
{/if}

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
