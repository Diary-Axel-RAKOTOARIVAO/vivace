<script lang="ts">
	let {
		playing,
		onplay,
		onpause
	}: { playing: boolean; onplay: () => void; onpause: () => void } = $props();
</script>

<button
	class="btn btn-square btn-sm border-base-300"
	aria-label={playing ? 'Pause animation' : 'Play animation'}
	onclick={() => (playing ? onpause() : onplay())}
>
	<iconify-icon icon={playing ? 'lucide:pause' : 'lucide:play'} width="15"></iconify-icon>
</button>
