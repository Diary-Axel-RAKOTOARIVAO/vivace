<script lang="ts">
	let {
		playing,
		onplay,
		onpause
	}: { playing: boolean; onplay: () => void; onpause: () => void } = $props();
</script>

<button
	class="play-pause"
	aria-label={playing ? 'Pause animation' : 'Play animation'}
	onclick={() => (playing ? onpause() : onplay())}
>
	{playing ? '⏸' : '▶'}
</button>

<style>
	.play-pause {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--border);
		background: var(--bg-card);
		color: var(--text);
		font-size: 0.9rem;
		cursor: pointer;
		display: grid;
		place-items: center;
		transition: border-color 0.15s ease;
	}

	.play-pause:hover {
		border-color: var(--accent);
	}
</style>
