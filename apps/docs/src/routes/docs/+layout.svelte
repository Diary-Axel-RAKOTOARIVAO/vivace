<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const sections = [
		{
			label: 'Guide',
			items: [
				{ href: '/docs', label: 'Getting started' },
				{ href: '/docs/attributes', label: 'Attributes' },
				{ href: '/docs/triggers', label: 'Triggers' },
				{ href: '/docs/presets', label: 'Preset gallery' }
			]
		},
		{
			label: 'Frameworks',
			items: [
				{ href: '/docs/frameworks/html', label: 'Plain HTML' },
				{ href: '/docs/frameworks/svelte', label: 'Svelte' },
				{ href: '/docs/frameworks/react', label: 'React' },
				{ href: '/docs/frameworks/vue', label: 'Vue' }
			]
		}
	];
</script>

<div class="mx-auto grid max-w-5xl gap-10 px-5 py-10 md:grid-cols-[13rem_1fr]">
	<aside>
		<nav class="md:sticky md:top-20">
			{#each sections as section (section.label)}
				<div class="mb-5">
					<div class="mb-1.5 text-xs font-semibold tracking-wider text-base-content/50 uppercase">
						{section.label}
					</div>
					<ul class="menu w-full gap-0.5 p-0">
						{#each section.items as item (item.href)}
							<li>
								<a
									href={item.href}
									class="rounded-field px-3 py-1.5"
									class:menu-active={page.url.pathname === item.href}
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</aside>
	<article class="doc min-w-0">
		{@render children()}
	</article>
</div>
