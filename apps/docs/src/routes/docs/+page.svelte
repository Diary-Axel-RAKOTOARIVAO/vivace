<svelte:head>
	<title>Getting started — Vivace</title>
</svelte:head>

<h1>Getting started</h1>

<p>
	Vivace is an attribute-driven CSS animation library. You describe <em>what</em> plays in a
	<code>data-viv</code>
	attribute and <em>when</em> it plays in <code>data-viv-on</code> — a tiny TypeScript engine wires
	up the triggers, and pure CSS does the animating.
</p>

<h2>Install</h2>

<pre><code>bun add vivace   # or npm install vivace</code></pre>

<h2>Set up</h2>

<pre><code>{`import Vivace from 'vivace'
import 'vivace/vivace.css'

Vivace.init()`}</code></pre>

<p>
	<code>init()</code> scans the page for <code>[data-viv]</code> elements and keeps watching —
	anything your framework mounts later is registered automatically via a MutationObserver. Call
	<code>Vivace.destroy()</code> if you ever need to tear the engine down. Framework-specific
	wiring lives in the <a href="/docs/frameworks/html">Frameworks</a> section.
</p>

<h2>First animation</h2>

<pre><code>{`<div data-viv="@fd|@sl-y|_ease-out-back" data-viv-on="appearing">
  Fades in while sliding up, when scrolled into view.
</div>`}</code></pre>

<p>Live:</p>

<div
	class="flex justify-center rounded-box border border-base-300 bg-base-200/50 p-8 not-prose"
>
	<div
		data-viv="@fd|@sl-y|_ease-out-back"
		data-viv-on="appearing"
		class="rounded-field bg-primary px-6 py-3 font-semibold text-primary-content"
	>
		Fades in while sliding up
	</div>
</div>

<h2>Migrating from A.css</h2>

<p>Vivace keeps A.css's key/modifier grammar and custom-property system, with three changes:</p>

<ul>
	<li>The attribute is <code>data-viv</code> instead of <code>qwik-animate</code>.</li>
	<li>
		Triggers are explicit (<code>data-viv-on</code>) instead of relying on attribute swaps — the
		engine drives <code>data-viv-state</code> for you.
	</li>
	<li>
		Variant naming is normalized: enter is <code>-i</code>, exit is <code>-o</code>, and
		<code>!</code> inverts any variant (A.css mixed <code>-in!</code>/<code>-out!</code> forms).
	</li>
</ul>

<p>Continue with <a href="/docs/attributes">Attributes</a> for the full grammar.</p>
