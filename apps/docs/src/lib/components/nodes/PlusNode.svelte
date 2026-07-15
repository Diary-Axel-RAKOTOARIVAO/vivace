<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { MODIFIERS, PRESETS } from 'vivace';
	import { playground } from '$lib/stores/playground.svelte';

	// Svelte Flow passes full node props; the plus node only renders itself.
	let { id: _id }: NodeProps = $props();

	let open = $state(false);

	function pick(kind: 'animation' | 'modifier', token: string) {
		playground.append(kind, token);
		open = false;
	}
</script>

<div class="plus-node nodrag">
	<button class="plus" class:open onclick={() => (open = !open)} aria-label="Add to chain">
		+
	</button>
	{#if open}
		<div class="picker">
			<span class="group">Animations</span>
			{#each PRESETS as preset (preset.key)}
				<button onclick={() => pick('animation', preset.variants[0])}>
					<code>{preset.key}</code>
					{preset.name}
					{#if preset.vivace}<em>new</em>{/if}
				</button>
			{/each}
			<span class="group">Modifiers</span>
			{#each MODIFIERS as mod (mod.key)}
				<button onclick={() => pick('modifier', mod.variants[0])}>
					<code>{mod.key}</code>
					{mod.name}
				</button>
			{/each}
		</div>
	{/if}
	<Handle type="target" position={Position.Left} />
</div>

<style>
	.plus-node {
		position: relative;
	}

	.plus {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		border: 1px dashed var(--accent);
		background: var(--bg-card);
		color: var(--accent);
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		display: grid;
		place-items: center;
		transition:
			transform 0.15s ease,
			background 0.15s ease;
	}

	.plus:hover {
		transform: scale(1.1);
	}

	.plus.open {
		background: var(--accent);
		color: #fff;
		transform: rotate(45deg);
	}

	.picker {
		position: absolute;
		top: 50px;
		left: 50%;
		transform: translateX(-50%);
		width: 230px;
		max-height: 280px;
		overflow-y: auto;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.4rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
		z-index: 20;
		box-shadow: 0 12px 32px rgb(0 0 0 / 0.45);
	}

	.group {
		color: var(--text-dim);
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.4rem 0.5rem 0.2rem;
		font-weight: 700;
	}

	.picker > button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		border-radius: 6px;
		padding: 0.35rem 0.5rem;
		color: var(--text);
		font-size: 0.82rem;
		cursor: pointer;
		text-align: left;
	}

	.picker > button:hover {
		background: var(--bg-raised);
	}

	.picker code {
		color: var(--accent-2);
		font-size: 0.75rem;
	}

	.picker em {
		margin-left: auto;
		font-style: normal;
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		background: var(--accent-grad);
		color: #fff;
		padding: 0.1em 0.5em;
		border-radius: 999px;
	}
</style>
