<script lang="ts">
	const heroAttr = '@fd|@sl-y|_ease-out-expo';
</script>

<svelte:head>
	<title>Vivace — animate with attributes</title>
	<meta
		name="description"
		content="Attribute-driven CSS animations with a tiny trigger engine. No keyframes, no wrappers."
	/>
</svelte:head>

<main>
	<section class="hero">
		<h1 data-viv="@bl|_speed-down" class="gradient-text">Vivace</h1>
		<p class="tagline" data-viv="@fd|@sl-y|_ease-out-expo|_delay-3">
			Animations you compose in HTML. A trigger engine you never think about.
		</p>
		<pre data-viv="@fd|@sl-y|_ease-out-expo|_delay-5"><code
				>&lt;div data-viv="{heroAttr}" data-viv-on="appearing"&gt;</code
			></pre>
		<div class="cta" data-viv="@fd|_delay-6">
			<a class="btn primary" href="/playground">Open the playground</a>
			<a class="btn" href="/docs">Read the docs</a>
		</div>
	</section>

	<section class="features" data-viv="@fd|@sl-y|_child-ascend" data-viv-on="appearing">
		<article>
			<h3>🎼 Declarative</h3>
			<p>
				Compose fades, springs, spirals and staggers straight in your markup:
				<code>@fd|@sl-y|_ease-out-back</code>. No keyframes to write.
			</p>
		</article>
		<article>
			<h3>⚡ Real triggers</h3>
			<p>
				<code>load</code>, <code>appearing</code>, <code>hover</code>, <code>click</code>,
				<code>focus</code> — one shared IntersectionObserver, delegated listeners, zero per-element
				overhead.
			</p>
		</article>
		<article>
			<h3>🪶 Tiny & framework-agnostic</h3>
			<p>
				Zero dependencies. Works in plain HTML, React, Svelte, Vue — dynamically mounted elements
				register themselves.
			</p>
		</article>
	</section>

	<section class="demo-strip" data-viv="@fd" data-viv-on="appearing">
		<h2>Fourteen keys, endless compositions</h2>
		<div class="chips">
			<span data-viv="@pop|_delay-1" data-viv-on="appearing">@pop</span>
			<span data-viv="@dr|_delay-2" data-viv-on="appearing">@dr</span>
			<span data-viv="@sw|_delay-3" data-viv-on="appearing">@sw</span>
			<span data-viv="@bl|_delay-4" data-viv-on="appearing">@bl</span>
			<span data-viv="@bn|_delay-5" data-viv-on="appearing">@bn</span>
			<span data-viv="@sp-i|_delay-6" data-viv-on="appearing">@sp</span>
		</div>
		<p class="hint">Hover any chip to replay it — that's <code>data-viv-on="hover"</code> energy.</p>
	</section>
</main>

<style>
	main {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 1.5rem 6rem;
	}

	.hero {
		text-align: center;
		padding: 7rem 0 5rem;
	}

	.hero h1 {
		font-size: clamp(3.5rem, 10vw, 6.5rem);
		margin: 0;
		letter-spacing: -0.04em;
	}

	.tagline {
		font-size: 1.3rem;
		color: var(--text-dim);
		max-width: 34em;
		margin: 1rem auto 2rem;
	}

	.hero pre {
		display: inline-block;
		text-align: left;
		margin-bottom: 2rem;
	}

	.cta {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.25rem;
		padding: 3rem 0;
	}

	.features article {
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1.5rem;
	}

	.features h3 {
		margin-top: 0;
	}

	.features p {
		color: var(--text-dim);
		margin-bottom: 0;
	}

	.demo-strip {
		text-align: center;
		padding: 4rem 0 2rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		margin: 2rem 0 1rem;
	}

	.chips span {
		display: inline-block;
		padding: 0.6rem 1.2rem;
		border-radius: 999px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		font-family: var(--mono);
		color: var(--accent-2);
	}

	.hint {
		color: var(--text-dim);
		font-size: 0.9rem;
	}
</style>
