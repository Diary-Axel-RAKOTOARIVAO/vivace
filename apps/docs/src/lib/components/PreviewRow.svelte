<script lang="ts">
	import Vivace from 'vivace';
	import type { Experiment } from '$lib/stores/playground.svelte';
	import { playground } from '$lib/stores/playground.svelte';
	import PlayPauseButton from './PlayPauseButton.svelte';

	let { experiment }: { experiment: Experiment } = $props();

	let subject = $state<HTMLElement>();

	function play() {
		if (!subject) return;
		Vivace.play(subject);
		experiment.playing = true;
	}

	function pause() {
		if (!subject) return;
		Vivace.pause(subject);
		experiment.playing = false;
	}

	function replay() {
		if (!subject) return;
		Vivace.trigger(subject);
		experiment.playing = true;
	}
</script>

<div
	class="grid grid-cols-1 items-center gap-4 rounded-box border border-base-300 p-3 sm:grid-cols-[9rem_1fr_auto]"
>
	<div
		class="flex h-20 items-center justify-center overflow-hidden rounded-field bg-base-200/60"
	>
		{#if experiment.viv.includes('_child')}
			<div
				bind:this={subject}
				data-viv={experiment.viv}
				data-viv-on={experiment.on}
				class="flex gap-1"
			>
				<i class="h-10 w-3.5 rounded-sm bg-primary"></i>
				<i class="h-10 w-3.5 rounded-sm bg-primary"></i>
				<i class="h-10 w-3.5 rounded-sm bg-primary"></i>
			</div>
		{:else}
			<div
				bind:this={subject}
				data-viv={experiment.viv}
				data-viv-on={experiment.on}
				class="h-10 w-10 rounded-field bg-primary"
			></div>
		{/if}
	</div>
	<code
		class="overflow-x-auto whitespace-nowrap bg-transparent p-0 text-xs text-base-content/80"
		>data-viv="{experiment.viv}"{experiment.on !== 'load'
			? ` data-viv-on="${experiment.on}"`
			: ''}</code
	>
	<div class="flex gap-1.5">
		<PlayPauseButton playing={experiment.playing} onplay={play} onpause={pause} />
		<button class="btn btn-square btn-sm border-base-300" title="Replay" aria-label="Replay" onclick={replay}>
			<iconify-icon icon="lucide:rotate-ccw" width="15"></iconify-icon>
		</button>
		<button
			class="btn btn-square btn-sm border-base-300"
			title="Remove"
			aria-label="Remove experiment"
			onclick={() => playground.removeExperiment(experiment.id)}
		>
			<iconify-icon icon="lucide:x" width="15"></iconify-icon>
		</button>
	</div>
</div>
