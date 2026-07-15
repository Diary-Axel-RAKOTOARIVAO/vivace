<script lang="ts">
	import Vivace from 'vivace';
	import type { Experiment } from '$lib/stores/playground.svelte';
	import { playground } from '$lib/stores/playground.svelte';
	import PlayPauseButton from './PlayPauseButton.svelte';

	let { experiment }: { experiment: Experiment } = $props();

	let subject: HTMLElement;

	function play() {
		Vivace.play(subject);
		experiment.playing = true;
	}

	function pause() {
		Vivace.pause(subject);
		experiment.playing = false;
	}

	function replay() {
		Vivace.trigger(subject);
		experiment.playing = true;
	}
</script>

<div class="row">
	<div class="stage">
		<div
			bind:this={subject}
			data-viv={experiment.viv}
			data-viv-on={experiment.on}
			class="subject"
			class:as-parent={experiment.viv.includes('_child')}
		>
			{#if experiment.viv.includes('_child')}<i></i><i></i><i></i>{/if}
		</div>
	</div>
	<code class="attr">data-viv="{experiment.viv}"{experiment.on !== 'load' ? ` data-viv-on="${experiment.on}"` : ''}</code>
	<div class="controls">
		<PlayPauseButton playing={experiment.playing} onplay={play} onpause={pause} />
		<button class="icon" title="Replay" aria-label="Replay" onclick={replay}>↺</button>
		<button
			class="icon"
			title="Remove"
			aria-label="Remove experiment"
			onclick={() => playground.removeExperiment(experiment.id)}>✕</button
		>
	</div>
</div>

<style>
	.row {
		display: grid;
		grid-template-columns: 160px 1fr auto;
		align-items: center;
		gap: 1.25rem;
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 0.75rem 1rem;
	}

	.stage {
		height: 90px;
		display: grid;
		place-items: center;
		background: var(--bg);
		border-radius: 8px;
		overflow: hidden;
	}

	.subject {
		width: 44px;
		height: 44px;
		border-radius: 11px;
		background: var(--accent-grad);
	}

	/* _child compositions animate children, so give the subject some */
	.subject.as-parent {
		background: none;
		display: flex;
		gap: 4px;
	}

	.subject.as-parent i {
		flex: 1;
		border-radius: 5px;
		background: var(--accent-grad);
	}

	.attr {
		background: none;
		border: none;
		color: var(--accent-2);
		overflow-x: auto;
		white-space: nowrap;
	}

	.controls {
		display: flex;
		gap: 0.5rem;
	}

	.icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--border);
		background: var(--bg-card);
		color: var(--text);
		cursor: pointer;
		display: grid;
		place-items: center;
		font-size: 1rem;
		transition: border-color 0.15s ease;
	}

	.icon:hover {
		border-color: var(--accent);
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
