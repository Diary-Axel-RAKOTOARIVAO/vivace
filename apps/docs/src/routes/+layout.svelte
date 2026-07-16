<script lang="ts">
	import '../app.css';
	import 'vivace-css/vivace.css';
	import Vivace from 'vivace-css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import profile from '$lib/assets/profil.webp';

	const AUTHOR = {
		name: 'Axel RAKOTOARIVAO',
		github: 'https://github.com/Dokja620',
		linkedin: 'https://www.linkedin.com/in/axel-rakotoarivao'
	};

	let { children } = $props();

	// The playground is a full-viewport app view — no footer there.
	const isPlayground = $derived(page.url.pathname.startsWith('/playground'));

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

<div class="flex min-h-screen flex-col bg-base-100 text-base-content">
	<header class="border-b border-base-300 sticky top-0 z-50 bg-base-100/90 backdrop-blur">
		<nav class="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
			<a href="/" class="text-lg font-extrabold tracking-tight">
				vivace<span class="text-accent">.</span>
			</a>
			<div class="flex items-center gap-1">
				<a href="/docs" class="btn btn-ghost btn-sm font-medium">Docs</a>
				<a href="/playground" class="btn btn-ghost btn-sm font-medium">Playground</a>
				<a href="/gallery" class="btn btn-ghost btn-sm font-medium">Gallery</a>
				<a
					href="https://github.com/Diary-Axel-RAKOTOARIVAO/vivace"
					class="btn btn-ghost btn-sm btn-square"
					aria-label="GitHub"
				>
					<iconify-icon icon="simple-icons:github" width="18"></iconify-icon>
				</a>
			</div>
		</nav>
	</header>

	<div class="flex-1">
		{@render children()}
	</div>

	{#if !isPlayground}
		<footer class="mt-16 border-t border-base-300">
			<div
				class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-5 py-8"
			>
				<div class="flex items-center gap-3.5">
					<img
						src={profile}
						alt="Portrait of {AUTHOR.name}"
						class="squircle h-12 w-12 object-cover" width="96" height="96" loading="lazy" decoding="async"
					/>
					<div>
						<div class="text-xs text-base-content/50">Created by</div>
						<div class="flex items-center gap-2">
							<span class="font-bold tracking-tight">{AUTHOR.name}</span>
							<a
								href={AUTHOR.github}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub profile"
								class="text-base-content/45 transition-colors hover:text-base-content"
							>
								<iconify-icon icon="simple-icons:github" width="15"></iconify-icon>
							</a>
							<a
								href={AUTHOR.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn profile"
								class="text-base-content/45 transition-colors hover:text-base-content"
							>
								<iconify-icon icon="simple-icons:linkedin" width="15"></iconify-icon>
							</a>
						</div>
					</div>
				</div>
				<div class="text-right text-sm text-base-content/60">
					<div>MIT — keyframe DSL inspired by A.css</div>
					<div class="mt-0.5 font-mono text-xs">bun add vivace-css</div>
				</div>
			</div>
		</footer>
	{/if}
</div>

<style>
	/* iOS-style superellipse mask */
	.squircle {
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0Z'/%3E%3C/svg%3E")
			center / 100% 100% no-repeat;
	}
</style>
