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

	const flat = sections.flatMap((s) => s.items);
	const index = $derived(flat.findIndex((i) => i.href === page.url.pathname));
	const prev = $derived(index > 0 ? flat[index - 1] : null);
	const next = $derived(index >= 0 && index < flat.length - 1 ? flat[index + 1] : null);
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

		{#if prev || next}
			<nav class="mt-12 grid grid-cols-2 gap-3 border-t border-base-300 pt-6">
				{#if prev}
					<a
						href={prev.href}
						class="group rounded-box border border-base-300 p-3.5 no-underline! transition-colors hover:border-base-content/40"
					>
						<span class="flex items-center gap-1 text-xs text-base-content/50">
							<iconify-icon icon="lucide:arrow-left" width="12"></iconify-icon>
							Previous
						</span>
						<span class="mt-0.5 block text-sm font-semibold">{prev.label}</span>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if next}
					<a
						href={next.href}
						class="group rounded-box border border-base-300 p-3.5 text-right no-underline! transition-colors hover:border-base-content/40"
					>
						<span class="flex items-center justify-end gap-1 text-xs text-base-content/50">
							Next
							<iconify-icon icon="lucide:arrow-right" width="12"></iconify-icon>
						</span>
						<span class="mt-0.5 block text-sm font-semibold">{next.label}</span>
					</a>
				{/if}
			</nav>
		{/if}
	</article>
</div>
