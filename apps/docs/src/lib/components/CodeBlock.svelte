<script lang="ts">
	import { highlight } from '$lib/shiki';

	let { code, lang = 'text' }: { code: string; lang?: string } = $props();

	let html = $state('');
	let copied = $state(false);

	const LABELS: Record<string, string> = {
		shellscript: 'sh',
		typescript: 'ts',
		javascript: 'js'
	};

	$effect(() => {
		let alive = true;
		highlight(code, lang).then((out) => {
			if (alive) html = out;
		});
		return () => {
			alive = false;
		};
	});

	async function copy() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<div
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
