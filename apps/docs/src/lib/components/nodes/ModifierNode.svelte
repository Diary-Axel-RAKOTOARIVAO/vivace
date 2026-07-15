<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { MODIFIERS } from 'vivace';
	import { playground } from '$lib/stores/playground.svelte';

	let { id, data }: NodeProps = $props();

	// svelte-ignore state_referenced_locally -- the picker's choice is only the starting value
	const initial = typeof data.initialToken === 'string' ? data.initialToken : '_ease-out-back';

	let groupKey = $state(MODIFIERS.find((m) => m.variants.includes(initial))?.key ?? '_ease');
	let token = $state(initial);

	const group = $derived(MODIFIERS.find((m) => m.key === groupKey) ?? MODIFIERS[0]);

	$effect(() => {
		if (!group.variants.includes(token)) token = group.variants[0];
	});

	$effect(() => {
		playground.setConfig(id, { kind: 'modifier', token });
		return () => playground.removeConfig(id);
	});
</script>

<div class="viv-node modifier">
	<header>
		🎛 Modifier
		<button class="remove nodrag" aria-label="Remove node" onclick={() => playground.remove(id)}>
			✕
		</button>
	</header>
	<select bind:value={groupKey} class="nodrag">
		{#each MODIFIERS as m (m.key)}
			<option value={m.key}>{m.key} — {m.name}</option>
		{/each}
	</select>
	<select bind:value={token} class="nodrag">
		{#each group.variants as v (v)}
			<option value={v}>{v}</option>
		{/each}
	</select>
	<p>{group.description}</p>
	<Handle type="target" position={Position.Left} />
	<Handle type="source" position={Position.Right} />
</div>

<style>
	.modifier header {
		color: #34d399;
	}
</style>
