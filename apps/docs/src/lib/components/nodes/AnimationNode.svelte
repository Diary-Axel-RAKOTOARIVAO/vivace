<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { PRESETS } from 'vivace';
	import { playground } from '$lib/stores/playground.svelte';

	let { id, data }: NodeProps = $props();

	// svelte-ignore state_referenced_locally -- the picker's choice is only the starting value
	const initial = typeof data.initialToken === 'string' ? data.initialToken : '@fd';

	let presetKey = $state(PRESETS.find((p) => p.variants.includes(initial))?.key ?? '@fd');
	let token = $state(initial);

	const preset = $derived(PRESETS.find((p) => p.key === presetKey) ?? PRESETS[0]);

	// Reset the variant when the preset family changes.
	$effect(() => {
		if (!preset.variants.includes(token)) token = preset.variants[0];
	});

	$effect(() => {
		playground.setConfig(id, { kind: 'animation', token });
		return () => playground.removeConfig(id);
	});
</script>

<div class="viv-node animation">
	<header>
		🎬 Animation
		<button class="remove nodrag" aria-label="Remove node" onclick={() => playground.remove(id)}>
			✕
		</button>
	</header>
	<select bind:value={presetKey} class="nodrag">
		{#each PRESETS as p (p.key)}
			<option value={p.key}>{p.key} — {p.name}</option>
		{/each}
	</select>
	{#if preset.variants.length > 1}
		<select bind:value={token} class="nodrag">
			{#each preset.variants as v (v)}
				<option value={v}>{v}</option>
			{/each}
		</select>
	{/if}
	<p>{preset.description}</p>
	<Handle type="target" position={Position.Left} />
	<Handle type="source" position={Position.Right} />
</div>

<style>
	.animation header {
		color: #a78bfa;
	}
</style>
