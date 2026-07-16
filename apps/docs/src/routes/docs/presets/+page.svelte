<script lang="ts">
	import Vivace, { PRESETS, MODIFIERS } from 'vivace-css';

	function replay(event: MouseEvent) {
		const card = event.currentTarget as HTMLElement;
		const box = card.querySelector<HTMLElement>('[data-viv]');
		if (box) Vivace.trigger(box);
	}
</script>

<svelte:head>
	<title>Preset gallery | Vivace</title>
</svelte:head>

<h1>Preset gallery</h1>

<p>
	Every animation key shipped in <code>vivace.css</code>. Click a card to replay it — each demo
	uses the first variant listed.
</p>

<div class="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
	{#each PRESETS as preset (preset.key)}
		<button
			class="group cursor-pointer overflow-hidden rounded-box border border-base-300 text-left transition-colors hover:border-base-content/40"
			onclick={replay}
		>
			<div
				class="flex h-28 items-center justify-center border-b border-base-200 bg-base-200/50"
			>
				<div data-viv={preset.variants[0]} class="h-12 w-12 rounded-field bg-primary"></div>
			</div>
			<div class="p-4">
				<div class="mb-1 flex items-center gap-2">
					<span class="token text-sm font-semibold">{preset.key}</span>
					<span class="text-sm font-semibold">{preset.name}</span>
					{#if preset.vivace}
						<span class="badge badge-accent badge-xs font-semibold uppercase">new</span>
					{/if}
					<iconify-icon
						icon="lucide:rotate-ccw"
						width="13"
						class="ml-auto text-base-content/30 group-hover:text-base-content/70"
					></iconify-icon>
				</div>
				<p class="!mb-2 text-[13px] text-base-content/65">{preset.description}</p>
				<div class="flex flex-wrap gap-1">
					{#each preset.variants as v (v)}
						<code class="text-[11px]">{v}</code>
					{/each}
				</div>
			</div>
		</button>
	{/each}
</div>

<h2>Modifiers</h2>

{#each MODIFIERS as mod (mod.key)}
	<div class="border-b border-base-200 py-3.5 last:border-0">
		<div class="mb-0.5 flex items-baseline gap-2">
			<span class="token text-sm font-semibold">{mod.key}</span>
			<span class="text-sm font-semibold">{mod.name}</span>
		</div>
		<p class="!mb-2 text-[13px] text-base-content/65">{mod.description}</p>
		<div class="flex flex-wrap gap-1">
			{#each mod.variants as v (v)}
				<code class="text-[11px]">{v}</code>
			{/each}
		</div>
	</div>
{/each}
