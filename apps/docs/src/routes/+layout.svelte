<script lang="ts">
	import '../app.css';
	import 'vivace/vivace.css';
	import Vivace from 'vivace';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	$effect(() => {
		// Client-only: registers the <iconify-icon> web component.
		import('iconify-icon');
		Vivace.init();
		return () => Vivace.destroy();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-base-100 text-base-content">
	<header class="border-b border-base-300 sticky top-0 z-50 bg-base-100/90 backdrop-blur">
		<nav class="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
			<a href="/" class="text-lg font-extrabold tracking-tight">
				vivace<span class="text-accent">.</span>
			</a>
			<div class="flex items-center gap-1">
				<a href="/docs" class="btn btn-ghost btn-sm font-medium">Docs</a>
				<a href="/playground" class="btn btn-ghost btn-sm font-medium">Playground</a>
				<a
					href="https://github.com/aureon-it/vivace"
					class="btn btn-ghost btn-sm btn-square"
					aria-label="GitHub"
				>
					<iconify-icon icon="simple-icons:github" width="18"></iconify-icon>
				</a>
			</div>
		</nav>
	</header>

	{@render children()}

	<footer class="border-t border-base-300 mt-16">
		<div
			class="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 text-sm text-base-content/60"
		>
			<span>MIT — keyframe DSL inspired by A.css</span>
			<span class="font-mono text-xs">bun add vivace</span>
		</div>
	</footer>
</div>
