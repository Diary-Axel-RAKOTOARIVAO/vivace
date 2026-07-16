<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	const layout = `<!-- src/routes/+layout.svelte -->
<script>
  import Vivace from 'vivace-css'
  import 'vivace-css/vivace.css'

  let { children } = $props()

  $effect(() => {
    Vivace.init()
    return () => Vivace.destroy()
  })
<\/script>

{@render children()}`;

	const markup = `<h1 data-viv="@fd @sl-y_ease-out-expo">Hello</h1>

<ul data-viv="@fd_child-ascend" data-viv-on="appearing">
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>`;

	const programmatic = `<script>
  import Vivace from 'vivace-css'

  let box
<\/script>

<div bind:this={box} data-viv="@pop">…</div>
<button onclick={() => Vivace.trigger(box)}>replay</button>`;
</script>

<svelte:head>
	<title>Svelte — Vivace</title>
</svelte:head>

<h1>Svelte / SvelteKit</h1>

<p>
	Initialize once in your root layout inside an <code>$effect</code> — it only runs in the
	browser, and the cleanup handles hot reloads and teardown. This site is built exactly this way.
</p>

<CodeBlock lang="svelte" code={layout} />

<p>Then annotate any element, in any component:</p>

<CodeBlock lang="svelte" code={markup} />

<h2>Route changes & dynamic content</h2>

<p>
	Client-side navigation mounts new DOM — the MutationObserver registers it automatically, so
	<code>data-viv-on="load"</code> elements animate on every page you navigate to, and
	<code>appearing</code> elements arm themselves. No per-page code.
</p>

<h2>SSR</h2>

<p>
	The module is SSR-safe: importing it on the server is a no-op (every API call guards on
	<code>document</code>). Import the CSS in the layout so server-rendered pages ship the styles
	with the first paint.
</p>

<h2>Programmatic control</h2>

<CodeBlock lang="svelte" code={programmatic} />
