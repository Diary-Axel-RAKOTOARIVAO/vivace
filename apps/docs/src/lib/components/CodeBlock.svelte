<script lang="ts">
	import { highlight } from '$lib/shiki';

	let { code, lang = 'text' }: { code: string; lang?: string } = $props();

	let html = $state('');
	let copied = $state(false);
	let root = $state<HTMLElement>();

	const LABELS: Record<string, string> = {
		shellscript: 'sh',
		typescript: 'ts',
		javascript: 'js'
	};

	// Highlight only when the block approaches the viewport, and off the
	// critical path (idle callback) — grammar compilation is the single
	// biggest main-thread cost on page load otherwise.
	$effect(() => {
		if (!root) return;
		let alive = true;

		const run = () => {
			const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1));
			idle(() => {
				if (!alive) return;
				highlight(code, lang).then((out) => {
					if (alive) html = out;
				});
			});
		};

		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					io.disconnect();
					run();
				}
			},
			{ rootMargin: '400px' }
		);
		io.observe(root);

		return () => {
			alive = false;
			io.disconnect();
		};
	});

	async function copy() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<div
	bind:this={root}
	class="codeblock group relative my-4 overflow-hidden rounded-box border border-base-300 bg-base-200/60"
>
	<div class="flex items-center justify-between border-b border-base-200 px-4 py-1.5">
		<span class="font-mono text-[11px] tracking-wide text-base-content/45">
			{LABELS[lang] ?? lang}
		</span>
		<button
			class="btn btn-ghost btn-xs gap-1 text-base-content/45 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
			aria-label="Copy code"
			onclick={copy}
		>
			<iconify-icon icon={copied ? 'lucide:check' : 'lucide:copy'} width="12"></iconify-icon>
			{copied ? 'copied' : 'copy'}
		</button>
	</div>
	<div class="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed">
		{#if html}
			{@html html}
		{:else}
			<pre class="!m-0 !border-0 !bg-transparent !p-0 !text-[13px]"><code>{code}</code></pre>
		{/if}
	</div>
</div>

<style>
	.codeblock :global(pre.shiki) {
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent !important;
		font-size: inherit;
		line-height: inherit;
	}

	.codeblock :global(pre.shiki code) {
		background: transparent;
		border: 0;
		padding: 0;
		font-size: inherit;
	}
</style>
