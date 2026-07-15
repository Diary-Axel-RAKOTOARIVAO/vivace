<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const sections = [
		{ href: '/docs', label: 'Getting started' },
		{ href: '/docs/attributes', label: 'Attributes' },
		{ href: '/docs/triggers', label: 'Triggers' },
		{ href: '/docs/presets', label: 'Preset gallery' }
	];
</script>

<div class="docs">
	<aside>
		<nav>
			{#each sections as s (s.href)}
				<a href={s.href} class:active={page.url.pathname === s.href}>{s.label}</a>
			{/each}
		</nav>
	</aside>
	<article>
		{@render children()}
	</article>
</div>

<style>
	.docs {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 3rem;
		max-width: 1080px;
		margin: 0 auto;
		padding: 2rem 1.5rem 6rem;
	}

	aside nav {
		position: sticky;
		top: 5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	aside a {
		color: var(--text-dim);
		padding: 0.4rem 0.75rem;
		border-radius: 8px;
		font-weight: 500;
	}

	aside a:hover {
		color: var(--text);
		text-decoration: none;
		background: var(--bg-raised);
	}

	aside a.active {
		color: var(--accent);
		background: var(--bg-raised);
	}

	article {
		min-width: 0;
	}

	@media (max-width: 720px) {
		.docs {
			grid-template-columns: 1fr;
		}

		aside nav {
			position: static;
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>
