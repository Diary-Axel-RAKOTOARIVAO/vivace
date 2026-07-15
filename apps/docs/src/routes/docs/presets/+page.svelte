<script lang="ts">
	import Vivace, { PRESETS, MODIFIERS } from 'vivace';

	function replay(event: MouseEvent) {
		const card = event.currentTarget as HTMLElement;
		const box = card.querySelector<HTMLElement>('[data-viv]');
		if (box) Vivace.trigger(box);
	}
</script>

<svelte:head>
	<title>Preset gallery — Vivace</title>
</svelte:head>

<h1>Preset gallery</h1>

<p>
	Every animation key shipped in <code>vivace.css</code>. Click a card to replay it — each demo
	uses the first variant listed.
</p>

<div class="gallery">
	{#each PRESETS as preset (preset.key)}
		<button class="card" onclick={replay}>
			<div class="stage">
				<div data-viv={preset.variants[0]} class="subject"></div>
			</div>
			<div class="meta">
				<h3>
					<code>{preset.key}</code>
					{preset.name}
					{#if preset.vivace}<span class="badge">new</span>{/if}
				</h3>
				<p>{preset.description}</p>
				<div class="variants">
					{#each preset.variants as v (v)}
						<code>{v}</code>
					{/each}
				</div>
			</div>
		</button>
	{/each}
</div>

<h2>Modifiers</h2>

<div class="modifiers">
	{#each MODIFIERS as mod (mod.key)}
		<section>
			<h3><code>{mod.key}</code> {mod.name}</h3>
			<p>{mod.description}</p>
			<div class="variants">
				{#each mod.variants as v (v)}
					<code>{v}</code>
				{/each}
			</div>
		</section>
	{/each}
</div>

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.25rem;
		margin: 2rem 0 3rem;
	}

	.card {
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0;
		overflow: hidden;
		cursor: pointer;
		text-align: left;
		color: inherit;
		font: inherit;
		transition: border-color 0.15s ease;
	}

	.card:hover {
		border-color: var(--accent);
	}

	.stage {
		height: 130px;
		display: grid;
		place-items: center;
		background:
			radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%),
			var(--bg-card);
		overflow: hidden;
	}

	.subject {
		width: 56px;
		height: 56px;
		border-radius: 14px;
		background: var(--accent-grad);
	}

	.meta {
		padding: 1rem 1.25rem 1.25rem;
	}

	.meta h3 {
		margin: 0 0 0.35rem;
		font-size: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.meta p {
		margin: 0 0 0.75rem;
		color: var(--text-dim);
		font-size: 0.88rem;
	}

	.badge {
		background: var(--accent-grad);
		color: #fff;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		padding: 0.15em 0.6em;
		border-radius: 999px;
	}

	.variants {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.variants code {
		font-size: 0.75rem;
	}

	.modifiers section {
		border-bottom: 1px solid var(--border);
		padding: 1rem 0;
	}

	.modifiers h3 {
		margin: 0 0 0.25rem;
	}

	.modifiers p {
		margin: 0 0 0.6rem;
		color: var(--text-dim);
	}
</style>
