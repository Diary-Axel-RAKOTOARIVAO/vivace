<script lang="ts">
	import Vivace, { PRESETS } from 'vivace';

	let hero: HTMLElement;

	function replayHero() {
		for (const el of hero.querySelectorAll<HTMLElement>('[data-viv]')) {
			Vivace.trigger(el);
		}
	}
</script>

<svelte:head>
	<title>Vivace — animate with attributes</title>
	<meta
		name="description"
		content="Attribute-driven CSS animations with a tiny trigger engine. No keyframes, no wrapper components."
	/>
</svelte:head>

<main class="mx-auto max-w-5xl px-5">
	<!-- Hero -->
	<section class="grid items-center gap-10 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
		<div>
			<p class="mb-3 font-mono text-sm text-accent" data-viv="@fd">
				bun add vivace <span class="text-base-content/40">· 0 dependencies</span>
			</p>
			<h1
				class="text-4xl font-extrabold tracking-tight text-balance md:text-5xl"
				data-viv="@fd|@sl-y|_ease-out-expo"
			>
				Animate with attributes. Nothing else.
			</h1>
			<p class="mt-4 max-w-xl text-lg text-base-content/70" data-viv="@fd|_delay-2">
				Compose entrances, springs and staggers directly in your markup. A tiny engine handles
				<em>when</em> — scroll, hover, click, focus — and pure CSS handles <em>how</em>.
			</p>
			<div class="mt-7 flex gap-3" data-viv="@fd|_delay-3">
				<a href="/playground" class="btn btn-primary">
					<iconify-icon icon="lucide:play" width="16"></iconify-icon>
					Open playground
				</a>
				<a href="/docs" class="btn btn-ghost border-base-300">Read the docs</a>
			</div>
		</div>

		<div class="rounded-box border border-base-300 bg-base-200/50 p-5" bind:this={hero}>
			<pre class="!m-0 !border-0 !bg-transparent !p-0 text-[13px]"><code
					>&lt;div
  <span class="text-secondary">data-viv</span>=<span class="token"
						>"@fd|@sl-y|_ease-out-back"</span
					>
  <span class="text-secondary">data-viv-on</span>=<span class="token">"appearing"</span>
&gt;</code></pre>
			<div
				class="mt-4 flex h-28 items-center justify-center rounded-field border border-dashed border-base-300 bg-base-100"
			>
				<div
					data-viv="@fd|@sl-y|_ease-out-back"
					data-viv-on="appearing"
					class="flex h-14 w-14 items-center justify-center rounded-field bg-primary font-bold text-primary-content"
				>
					V
				</div>
			</div>
			<button class="btn btn-ghost btn-xs mt-3 gap-1.5 text-base-content/60" onclick={replayHero}>
				<iconify-icon icon="lucide:rotate-ccw" width="13"></iconify-icon>
				replay
			</button>
		</div>
	</section>

	<!-- Keys strip -->
	<section class="border-t border-base-300 py-12">
		<div class="mb-5 flex items-baseline justify-between">
			<h2 class="text-xl font-bold tracking-tight">Fourteen keys. Hover to feel them.</h2>
			<a href="/docs/presets" class="text-sm underline underline-offset-4">full gallery</a>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each PRESETS as preset (preset.key)}
				<span
					data-viv={preset.variants[0]}
					data-viv-on="hover"
					class="badge badge-lg cursor-default border-base-300 bg-base-100 font-mono text-[13px]"
				>
					{preset.key}
					<span class="text-base-content/45">{preset.name.toLowerCase()}</span>
				</span>
			{/each}
		</div>
	</section>

	<!-- Why -->
	<section class="grid gap-10 border-t border-base-300 py-12 md:grid-cols-3">
		<div>
			<iconify-icon icon="lucide:braces" width="22" class="text-accent"></iconify-icon>
			<h3 class="mt-3 mb-1.5 font-bold">Declarative grammar</h3>
			<p class="text-sm leading-relaxed text-base-content/70">
				<code>@sl-y</code> slides up, <code>!</code> flips it, <code>_lv-up</code> pushes harder.
				Tokens compose freely — no keyframes to write, ever.
			</p>
		</div>
		<div>
			<iconify-icon icon="lucide:mouse-pointer-click" width="22" class="text-accent"
			></iconify-icon>
			<h3 class="mt-3 mb-1.5 font-bold">Real triggers</h3>
			<p class="text-sm leading-relaxed text-base-content/70">
				<code>load</code>, <code>appearing</code>, <code>hover</code>, <code>click</code>,
				<code>focus</code>. One shared IntersectionObserver, delegated listeners, zero per-element
				overhead.
			</p>
		</div>
		<div>
			<iconify-icon icon="lucide:feather" width="22" class="text-accent"></iconify-icon>
			<h3 class="mt-3 mb-1.5 font-bold">Framework-agnostic</h3>
			<p class="text-sm leading-relaxed text-base-content/70">
				Plain HTML, React, Svelte, Vue — dynamically mounted elements register themselves. Zero
				runtime dependencies.
			</p>
		</div>
	</section>

	<!-- CTA -->
	<section
		class="my-6 flex flex-col items-center gap-4 rounded-box bg-base-200 px-6 py-12 text-center"
		data-viv="@fd|@sl-y"
		data-viv-on="appearing"
	>
		<h2 class="text-2xl font-extrabold tracking-tight">Compose one in ten seconds</h2>
		<p class="max-w-md text-base-content/70">
			Chain tokens in the playground, watch it live, copy the attribute out.
		</p>
		<a href="/playground" class="btn btn-primary">
			<iconify-icon icon="lucide:play" width="16"></iconify-icon>
			Try the playground
		</a>
	</section>
</main>
