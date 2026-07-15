<script lang="ts">
	import '../app.css';
	import 'vivace/vivace.css';
	import Vivace from 'vivace';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	$effect(() => {
		Vivace.init();
		return () => Vivace.destroy();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/" class="brand gradient-text">Vivace</a>
	<div class="links">
		<a href="/docs">Docs</a>
		<a href="/playground">Playground</a>
	</div>
</nav>

{@render children()}

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 2rem;
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		background: color-mix(in srgb, var(--bg) 85%, transparent);
		backdrop-filter: blur(12px);
		z-index: 50;
	}

	.brand {
		font-size: 1.35rem;
		font-weight: 800;
		letter-spacing: -0.02em;
	}

	.brand:hover {
		text-decoration: none;
	}

	.links {
		display: flex;
		gap: 1.5rem;
	}

	.links a {
		color: var(--text-dim);
		font-weight: 500;
	}

	.links a:hover {
		color: var(--text);
		text-decoration: none;
	}
</style>
