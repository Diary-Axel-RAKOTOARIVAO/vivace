<script lang="ts">
	import type { VivTrigger } from 'vivace';

	let {
		template,
		viv,
		on,
		count = 3
	}: { template: string; viv: string; on: VivTrigger; count?: number } = $props();
</script>

{#if template === 'hero'}
	<div
		data-viv={viv}
		data-viv-on={on}
		class="flex w-full max-w-xl flex-col items-center gap-3.5 rounded-box border border-base-300 bg-base-100 p-10 text-center shadow-sm"
	>
		<span class="badge badge-accent badge-sm font-semibold">new season</span>
		<h1 class="text-3xl font-extrabold tracking-tight">Music, in motion</h1>
		<p class="max-w-sm text-sm text-base-content/60">
			Compose entrances, springs and staggers straight in your markup — the engine handles the
			rest.
		</p>
		<div class="flex gap-2">
			<button class="btn btn-primary btn-sm">Get started</button>
			<button class="btn btn-ghost btn-sm border-base-300">Live demo</button>
		</div>
	</div>
{:else if template === 'list'}
	<ul
		data-viv={viv}
		data-viv-on={on}
		class="w-72 divide-y divide-base-200 rounded-box border border-base-300 bg-base-100 shadow-sm"
	>
		{#each Array(count), i (i)}
			<li class="flex items-center gap-3 p-3">
				<span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-base-300 text-xs font-bold">
					{String.fromCharCode(65 + i)}
				</span>
				<span class="flex-1">
					<span class="block h-2 w-3/4 rounded bg-base-300"></span>
					<span class="mt-1.5 block h-2 w-1/2 rounded bg-base-200"></span>
				</span>
				<iconify-icon icon="lucide:chevron-right" width="14" class="text-base-content/30"
				></iconify-icon>
			</li>
		{/each}
	</ul>
{:else if template === 'stats'}
	<div data-viv={viv} data-viv-on={on} class="flex flex-wrap justify-center gap-2.5">
		{#each Array(count), i (i)}
			<div class="w-32 rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
				<div class="text-[11px] font-semibold tracking-wide text-base-content/50 uppercase">
					{['Plays', 'Tempo', 'Encores', 'Fans', 'Shows', 'Cities'][i % 6]}
				</div>
				<div class="mt-1 text-2xl font-extrabold">{[128, 172, 3, '12k', 47, 19][i % 6]}</div>
				<div class="mt-1 h-1.5 w-full rounded bg-base-200">
					<div class="h-1.5 rounded bg-accent" style="width: {[70, 85, 30, 60, 45, 75][i % 6]}%"></div>
				</div>
			</div>
		{/each}
	</div>
{:else if template === 'nav'}
	<nav
		data-viv={viv}
		data-viv-on={on}
		class="flex w-full max-w-xl items-center gap-5 rounded-box border border-base-300 bg-base-100 px-5 py-3 shadow-sm"
	>
		<span class="font-extrabold tracking-tight">vivace<span class="text-accent">.</span></span>
		<span class="h-2 w-12 rounded bg-base-300"></span>
		<span class="h-2 w-12 rounded bg-base-300"></span>
		<span class="h-2 w-12 rounded bg-base-200"></span>
		<button class="btn btn-primary btn-xs ml-auto">Sign up</button>
	</nav>
{:else if template === 'toast'}
	<div
		data-viv={viv}
		data-viv-on={on}
		class="flex w-80 items-start gap-3 rounded-box border border-base-300 bg-base-100 p-4 shadow-md"
	>
		<span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-success/15 text-success">
			<iconify-icon icon="lucide:check" width="16"></iconify-icon>
		</span>
		<span class="flex-1">
			<span class="block text-sm font-semibold">Saved to setlist</span>
			<span class="block text-xs text-base-content/60">“Allegro” was added — undo?</span>
		</span>
		<button class="btn btn-ghost btn-xs btn-square" aria-label="Dismiss">
			<iconify-icon icon="lucide:x" width="13"></iconify-icon>
		</button>
	</div>
{:else}
	<!-- card (default) -->
	<div
		data-viv={viv}
		data-viv-on={on}
		class="card w-60 border border-base-300 bg-base-100 shadow-sm"
	>
		<figure class="grid h-28 place-items-center bg-base-300">
			<iconify-icon icon="lucide:image" width="26" class="text-base-content/35"></iconify-icon>
		</figure>
		<div class="card-body gap-1.5 p-4">
			<h3 class="card-title text-sm">Concert night</h3>
			<p class="text-xs text-base-content/60">Live strings, Friday 21:00. Doors open at 20:15.</p>
			<button class="btn btn-primary btn-xs mt-1 w-fit">Tickets</button>
		</div>
	</div>
{/if}
