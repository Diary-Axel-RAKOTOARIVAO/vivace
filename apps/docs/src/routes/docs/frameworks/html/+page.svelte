<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import InstallTabs from '$lib/components/InstallTabs.svelte';
	const cdn = `<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="https://esm.sh/vivace/dist/vivace.min.css" />
  </head>
  <body>
    <h1 data-viv="@fd @sl-y_ease-out-expo">Hello</h1>

    <section data-viv="@fd_child-ascend" data-viv-on="appearing">
      <p>Staggered</p>
      <p>one after</p>
      <p>another.</p>
    </section>

    <script type="module">
      import Vivace from 'https://esm.sh/vivace'
      Vivace.init()
    <\/script>
  </body>
</html>`;

	const bundler = `// main.js
import Vivace from 'vivace'
import 'vivace/vivace.css'

Vivace.init()`;
</script>

<svelte:head>
	<title>Plain HTML — Vivace</title>
</svelte:head>

<h1>Plain HTML</h1>

<p>
	No build step required — load the stylesheet and the ESM module from a CDN and call
	<code>init()</code>. Module scripts are deferred, so the DOM is ready when it runs.
</p>

<CodeBlock lang="html" code={cdn} />

<h2>With a bundler (no framework)</h2>

<div class="not-prose my-4">
	<InstallTabs />
</div>

<CodeBlock lang="javascript" code={bundler} />

<h2>Dynamic content</h2>

<p>
	Anything you add later — <code>innerHTML</code>, <code>appendChild</code>, HTMX swaps, Turbo
	frames — is registered automatically by the engine's MutationObserver. There is nothing to
	re-run after a partial page update.
</p>

<h2>Scoping</h2>

<p>
	<code>Vivace.init()</code> watches <code>document.body</code>. Pass an element to restrict
	scanning and observation to a subtree:
</p>

<CodeBlock lang="javascript" code={`Vivace.init(document.querySelector('#app'))`} />
