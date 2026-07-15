<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { TRIGGER_OPTIONS } from 'vivace';
	import { playground } from '$lib/stores/playground.svelte';

	let { id }: NodeProps = $props();

	// Selection lives in the store so example/URL loading can drive it.
	$effect(() => {
		playground.setConfig(id, { kind: 'trigger', value: playground.triggerValue });
		return () => playground.removeConfig(id);
	});

	const selected = $derived(TRIGGER_OPTIONS.find((t) => t.value === playground.triggerValue));
</script>

<div class="viv-node trigger">
	<header>⚡ Trigger</header>
	<select bind:value={playground.triggerValue} class="nodrag">
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
