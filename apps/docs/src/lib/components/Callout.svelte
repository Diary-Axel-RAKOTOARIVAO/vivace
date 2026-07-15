<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		kind = 'tip',
		children
	}: { kind?: 'tip' | 'note' | 'warn'; children: Snippet } = $props();

	const STYLES = {
		tip: { icon: 'lucide:lightbulb', ring: 'border-success/30 bg-success/8', tint: 'text-success' },
		note: { icon: 'lucide:info', ring: 'border-info/30 bg-info/8', tint: 'text-info' },
		warn: {
			icon: 'lucide:triangle-alert',
			ring: 'border-warning/40 bg-warning/10',
			tint: 'text-warning'
		}
	} as const;

	const style = $derived(STYLES[kind]);
</script>

<div class="my-4 flex gap-3 rounded-box border p-4 {style.ring}">
	<iconify-icon icon={style.icon} width="17" class="mt-0.5 shrink-0 {style.tint}"></iconify-icon>
	<div class="callout-body min-w-0 text-[13.5px] leading-relaxed">
		{@render children()}
	</div>
</div>

<style>
	.callout-body :global(p) {
		margin-bottom: 0;
	}

	.callout-body :global(code) {
		background: color-mix(in oklch, var(--color-base-content) 8%, transparent);
	}
</style>
