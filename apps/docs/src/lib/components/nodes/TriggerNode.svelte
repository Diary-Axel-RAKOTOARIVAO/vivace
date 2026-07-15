<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { TRIGGER_OPTIONS, type VivTrigger } from 'vivace';
	import { playground } from '$lib/stores/playground.svelte';

	let { id }: NodeProps = $props();

	let value = $state<VivTrigger>('appearing');

	$effect(() => {
		playground.setConfig(id, { kind: 'trigger', value });
		return () => playground.removeConfig(id);
	});

	const selected = $derived(TRIGGER_OPTIONS.find((t) => t.value === value));
</script>

<div class="viv-node trigger">
	<header>⚡ Trigger</header>
	<select bind:value class="nodrag">
		{#each TRIGGER_OPTIONS as option (option.value)}
			<option value={option.value}>{option.value}</option>
		{/each}
	</select>
	<p>{selected?.description}</p>
	<Handle type="source" position={Position.Right} />
</div>

<style>
	.trigger header {
		color: #fbbf24;
	}
</style>
