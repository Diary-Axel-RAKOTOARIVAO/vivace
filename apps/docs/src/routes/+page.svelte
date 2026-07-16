<script lang="ts">
	import Vivace, { PRESETS } from 'vivace';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import InstallTabs from '$lib/components/InstallTabs.svelte';

	// Auto-cycling hero showcase — a new composition plays every few seconds.
	const SHOWCASE = [
		{ label: 'Gather', viv: '@pr-i_child-ascend_ease-out-back @fd @sc-i!', child: true },
		{ label: 'Pop', viv: '@pop_ease-out-back', child: false },
		{ label: 'Drop', viv: '@dr', child: false },
		{ label: 'Soft focus', viv: '@bl_speed-down @sl-y_ease-out-expo', child: false },
		{ label: 'Wave', viv: '@wv_child-ascend @fd', child: true },
		{ label: 'Squash', viv: '@sq_origin-b', child: false }
	];
	let showcaseIndex = $state(0);
	const showcase = $derived(SHOWCASE[showcaseIndex]!);

	$effect(() => {
		const timer = setInterval(() => {
			showcaseIndex = (showcaseIndex + 1) % SHOWCASE.length;
		}, 2800);
		return () => clearInterval(timer);
	});

	const stepInit = `import Vivace from 'vivace'
import 'vivace/vivace.css'

Vivace.init()`;

	const stepMarkup = `<ul data-viv="@fd_child-ascend @sl-y" data-viv-on="appearing">
  <li>Every list item</li>
  <li>slides up in</li>
  <li>sequence. That's it.</li>
</ul>`;

	const beyondCode = `// exits that wait for themselves
await Vivace.out(toast)   // plays data-viv-out, resolves when done
toast.remove()            // fill-mode kept it hidden — no flash

// your own keys and triggers
Vivace.defineKey('@wb', { keyframe: 10, vars: { '--ARZ1': '8deg' } })
Vivace.defineTrigger('longpress', (el, fire) => { /* … */ })`;

	// Composable examples strip
	const RECIPES = [
		{
			name: 'Entrance',
			viv: '@fd @sl-y_ease-out-expo',
			note: 'fade + slide, expo settle'
		},
		{
			name: 'Playful',
			viv: '@pop_ease-out-back',
			note: 'elastic pop with overshoot'
		},
		{
			name: 'Dramatic',
			viv: '@pr-i_ease-out-expo @fd @rt-y-i',
			note: 'flies in from deep Z, folding'
		}
	];

	function replayCard(event: MouseEvent) {
		const el = (event.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-viv]');
		if (el) Vivace.trigger(el);
	}

	const FRAMEWORKS = [
		{ icon: 'simple-icons:html5', name: 'HTML', href: '/docs/frameworks/html' },
		{ icon: 'simple-icons:svelte', name: 'Svelte', href: '/docs/frameworks/svelte' },
		{ icon: 'simple-icons:react', name: 'React', href: '/docs/frameworks/react' },
		{ icon: 'simple-icons:vuedotjs', name: 'Vue', href: '/docs/frameworks/vue' }
	];
</script>

<svelte:head>
	<title>Vivace — animate with attributes</title>
	<meta
		name="description"
		content="Attribute-driven CSS animations with a tiny trigger engine. 18 composable keys, 5 triggers, zero dependencies, under 7 kB gzipped."
	/>
</svelte:head>

<main>
	<!-- ============ Hero ============ -->
	<section class="dots border-b border-base-300">
		<div class="mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
			<div>
				<h1 class="text-4xl font-extrabold tracking-tight text-balance md:text-[3.4rem] md:leading-[1.05]">
					Animate with attributes.
					<span class="text-base-content/40">Nothing else.</span>
				</h1>
				<p class="mt-5 max-w-xl text-lg leading-relaxed text-base-content/70">
					Compose entrances, springs and staggers directly in your markup. A tiny engine handles
					<em>when</em> — scroll, hover, click, focus — and pure CSS handles <em>how</em>.
				</p>
				<div class="mt-7 flex flex-wrap gap-3">
					<a href="/playground" class="btn btn-primary">
						<iconify-icon icon="lucide:play" width="16"></iconify-icon>
						Open playground
					</a>
					<a href="/docs" class="btn bg-base-100 border-base-300">Read the docs</a>
				</div>
				<div class="mt-6 max-w-md">
					<InstallTabs />
				</div>
			</div>

			<!-- auto-cycling live demo -->
			<div class="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
				<div class="mb-3 flex items-center justify-between">
					<code class="token bg-transparent p-0 text-xs">"{showcase.viv}"</code>
				</div>
				<div class="flex h-44 items-center justify-center overflow-hidden rounded-field bg-base-200/70">
					{#key showcaseIndex}
						{#if showcase.child}
							<div data-viv={showcase.viv} class="flex gap-2">
								{#each [0, 1, 2] as i (i)}
									<div class="h-16 w-16 rounded-field bg-primary"></div>
								{/each}
							</div>
						{:else}
							<div
								data-viv={showcase.viv}
								class="flex h-20 w-20 items-center justify-center rounded-field bg-primary text-xl font-bold text-primary-content"
							>
								V
							</div>
						{/if}
					{/key}
				</div>
				<div class="mt-3 flex items-center justify-between">
					<div class="flex gap-1">
						{#each SHOWCASE as s, i (s.label)}
							<button
								class="h-1.5 rounded-full transition-all {i === showcaseIndex
									? 'w-5 bg-accent'
									: 'w-1.5 bg-base-300 hover:bg-base-content/30'}"
								aria-label="Show {s.label}"
								onclick={() => (showcaseIndex = i)}
							></button>
						{/each}
					</div>
					<span class="text-xs font-medium text-base-content/50">{showcase.label}</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ============ Stats band ============ -->
	<section class="border-b border-base-300 bg-base-100">
		<div class="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-base-200 px-5 md:grid-cols-4">
			{#each [['18', 'animation keys'], ['5', 'trigger types'], ['0', 'dependencies'], ['< 7 kB', 'gzipped, CSS + JS']] as [n, label] (label)}
				<div class="px-4 py-6 text-center">
					<div class="text-2xl font-extrabold tracking-tight">{n}</div>
					<div class="mt-0.5 text-xs text-base-content/55">{label}</div>
				</div>
			{/each}
		</div>
	</section>

	<div class="mx-auto max-w-5xl px-5">
		<!-- ============ Keys strip ============ -->
		<section class="py-16">
			<div class="mb-6 flex items-baseline justify-between">
				<h2 class="text-2xl font-extrabold tracking-tight">Eighteen keys. Hover to feel them.</h2>
				<a href="/docs/presets" class="text-sm underline underline-offset-4">full gallery</a>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each PRESETS as preset (preset.key)}
					<span
						data-viv={preset.variants[0]}
						data-viv-on="hover"
						class="badge badge-lg cursor-default border-base-300 bg-base-100 py-3.5 font-mono text-[13px]"
					>
						{preset.key}
						<span class="text-base-content/45">{preset.name.toLowerCase()}</span>
					</span>
				{/each}
			</div>
		</section>

		<!-- ============ How it works ============ -->
		<section class="border-t border-base-300 py-16">
			<h2 class="text-2xl font-extrabold tracking-tight">Two steps. No wrappers, no keyframes.</h2>
			<div class="mt-8 grid items-start gap-8 md:grid-cols-2">
				<div>
					<div class="mb-2 flex items-center gap-2.5">
						<span class="grid h-6 w-6 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-primary-content">1</span>
						<h3 class="font-bold">Initialize once</h3>
					</div>
					<p class="mb-3 text-sm text-base-content/65">
						One call at your app's root. A MutationObserver keeps watching, so anything your
						framework mounts later registers itself.
					</p>
					<CodeBlock lang="typescript" code={stepInit} />
				</div>
				<div>
					<div class="mb-2 flex items-center gap-2.5">
						<span class="grid h-6 w-6 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-primary-content">2</span>
						<h3 class="font-bold">Write attributes</h3>
					</div>
					<p class="mb-3 text-sm text-base-content/65">
						Keys (<code>@</code>) say what plays, modifiers (<code>_</code>) tune it,
						<code>data-viv-on</code> says when. Everything composes.
					</p>
					<CodeBlock lang="html" code={stepMarkup} />
				</div>
			</div>
			<div
				class="mt-2 rounded-box border border-base-300 bg-base-200/50 p-6"
				data-viv="@fd"
				data-viv-on="appearing"
			>
				<ul data-viv="@fd_child-ascend @sl-y" data-viv-on="appearing" class="space-y-2">
					<li class="rounded-field border border-base-300 bg-base-100 px-4 py-2.5 text-sm">Every list item</li>
					<li class="rounded-field border border-base-300 bg-base-100 px-4 py-2.5 text-sm">slides up in</li>
					<li class="rounded-field border border-base-300 bg-base-100 px-4 py-2.5 text-sm">sequence. That's it.</li>
				</ul>
			</div>
		</section>

		<!-- ============ Recipes ============ -->
		<section class="border-t border-base-300 py-16">
			<h2 class="text-2xl font-extrabold tracking-tight">Small grammar, endless compositions</h2>
			<p class="mt-2 max-w-2xl text-base-content/65">
				Keys stack in one attribute; modifiers concatenate onto the key they tune. Click a card to
				replay it, or open it in the playground.
			</p>
			<div class="mt-8 grid gap-4 md:grid-cols-3">
				{#each RECIPES as recipe (recipe.name)}
					<button
						class="group cursor-pointer overflow-hidden rounded-box border border-base-300 text-left transition-colors hover:border-base-content/40"
						onclick={replayCard}
					>
						<div class="dots flex h-36 items-center justify-center border-b border-base-200">
							<div data-viv={recipe.viv} data-viv-on="appearing" class="h-14 w-14 rounded-field bg-primary shadow-sm"></div>
						</div>
						<div class="p-4">
							<div class="flex items-center justify-between">
								<span class="text-sm font-bold">{recipe.name}</span>
								<a
									href="/playground?c={encodeURIComponent(recipe.viv)}"
									class="text-xs text-base-content/45 underline-offset-2 hover:underline"
									onclick={(e) => e.stopPropagation()}
								>
									remix
								</a>
							</div>
							<code class="token mt-1 block overflow-x-auto bg-transparent p-0 text-[11px] whitespace-nowrap">{recipe.viv}</code>
							<p class="mt-1.5 text-xs text-base-content/55">{recipe.note}</p>
						</div>
					</button>
				{/each}
			</div>
		</section>

		<!-- ============ Triggers ============ -->
		<section class="border-t border-base-300 py-16">
			<div class="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
				<div>
					<h2 class="text-2xl font-extrabold tracking-tight">Real triggers, zero listeners per element</h2>
					<p class="mt-3 text-base-content/65">
						<code>load</code>, <code>appearing</code>, <code>hover</code>, <code>click</code> and
						<code>focus</code> — one shared IntersectionObserver and a handful of delegated
						listeners for the whole page, no matter how many elements animate.
					</p>
					<a href="/docs/triggers" class="mt-4 inline-block text-sm underline underline-offset-4">
						trigger reference
					</a>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<button data-viv="@pop" data-viv-on="click" class="btn h-auto border-base-300 bg-base-100 py-4 font-mono text-xs font-normal">
						click me
					</button>
					<div
						data-viv="@sh-x"
						data-viv-on="hover"
						class="flex items-center justify-center rounded-field border border-base-300 bg-base-100 py-4 font-mono text-xs"
					>
						hover me
					</div>
					<input
						data-viv="@bn"
						data-viv-on="focus"
						class="input h-auto border-base-300 bg-base-100 py-4 text-center font-mono text-xs"
						placeholder="focus me"
					/>
					<div
						data-viv="@wv"
						data-viv-on="appearing"
						data-viv-repeat-scroll
						class="flex items-center justify-center rounded-field border border-base-300 bg-base-100 py-4 font-mono text-xs"
					>
						scrolled in
					</div>
				</div>
			</div>
		</section>

		<!-- ============ Beyond entrances ============ -->
		<section class="border-t border-base-300 py-16">
			<div class="grid items-start gap-10 md:grid-cols-2">
				<div>
					<h2 class="text-2xl font-extrabold tracking-tight">Beyond entrances</h2>
					<p class="mt-3 text-base-content/65">
						Exit animations that resolve as promises, bubbling lifecycle events
						(<code>vivace:play</code>, <code>vivace:end</code>), and a plugin API for your own
						keys and triggers — at runtime or as SCSS plugins.
					</p>
					<div class="mt-5 flex flex-col gap-2.5">
						{#each [['lucide:log-out', 'await Vivace.out(el) — remove without a flash'], ['lucide:radio', 'events for chaining logic off animations'], ['lucide:puzzle', 'defineKey / defineTrigger, one-file SCSS plugins'], ['lucide:accessibility', 'prefers-reduced-motion built in — content never hides']] as [icon, text] (text)}
							<div class="flex items-center gap-2.5 text-sm text-base-content/75">
								<iconify-icon {icon} width="16" class="shrink-0 text-accent"></iconify-icon>
								{text}
							</div>
						{/each}
					</div>
					<a href="/docs/extending" class="mt-5 inline-block text-sm underline underline-offset-4">
						extending vivace
					</a>
				</div>
				<CodeBlock lang="typescript" code={beyondCode} />
			</div>
		</section>

		<!-- ============ Frameworks ============ -->
		<section class="border-t border-base-300 py-16 text-center">
			<h2 class="text-2xl font-extrabold tracking-tight">Works where your markup lives</h2>
			<p class="mx-auto mt-2 max-w-xl text-base-content/65">
				Attributes pass through every renderer, and dynamically mounted elements register
				themselves. No wrapper components to import, ever.
			</p>
			<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
				{#each FRAMEWORKS as fw (fw.name)}
					<a
						href={fw.href}
						class="flex items-center gap-2.5 rounded-box border border-base-300 bg-base-100 px-5 py-3.5 font-medium transition-colors hover:border-base-content/40"
					>
						<iconify-icon icon={fw.icon} width="20" class="text-base-content/70"></iconify-icon>
						{fw.name}
					</a>
				{/each}
			</div>
		</section>

		<!-- ============ Gallery teaser + CTA ============ -->
		<section class="border-t border-base-300 py-16">
			<div
				class="dots flex flex-col items-center gap-5 rounded-box border border-base-300 px-6 py-14 text-center"
				data-viv="@fd @sl-y"
				data-viv-on="appearing"
			>
				<h2 class="text-3xl font-extrabold tracking-tight">Compose one in ten seconds</h2>
				<p class="max-w-md text-base-content/65">
					Chain tokens in the playground, watch it live on real page sections, copy the attribute
					out — or ship it to the <a href="/gallery" class="underline underline-offset-4">community gallery</a>.
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					<a href="/playground" class="btn btn-primary">
						<iconify-icon icon="lucide:play" width="16"></iconify-icon>
						Try the playground
					</a>
					<a href="/gallery" class="btn bg-base-100 border-base-300">
						<iconify-icon icon="lucide:images" width="16"></iconify-icon>
						Browse the gallery
					</a>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.dots {
		background-color: color-mix(in oklch, var(--color-base-200) 55%, var(--color-base-100));
		background-image: radial-gradient(
			color-mix(in oklch, var(--color-base-content) 14%, transparent) 1px,
			transparent 1px
		);
		background-size: 20px 20px;
	}
</style>
