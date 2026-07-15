<svelte:head>
	<title>Triggers — Vivace</title>
</svelte:head>

<h1>Triggers</h1>

<p>
	<code>data-viv-on</code> decides when a composition fires. This is Vivace's core upgrade over
	CSS-only animation libraries: one engine, shared observers, no per-element listeners.
</p>

<table>
	<thead>
		<tr><th>Trigger</th><th>Fires</th><th>Implementation</th></tr>
	</thead>
	<tbody>
		<tr>
			<td><code>load</code> <em>(default)</em></td>
			<td>as soon as the element is registered</td>
			<td>immediate; MutationObserver registers SPA-mounted elements</td>
		</tr>
		<tr>
			<td><code>appearing</code></td>
			<td>when the element enters the viewport</td>
			<td>one shared IntersectionObserver for the whole page</td>
		</tr>
		<tr>
			<td><code>hover</code></td>
			<td>on pointer enter</td>
			<td>single capture listener on the document</td>
		</tr>
		<tr>
			<td><code>click</code></td>
			<td>on click / tap</td>
			<td>event delegation</td>
		</tr>
		<tr>
			<td><code>focus</code></td>
			<td>when the element receives focus</td>
			<td><code>focusin</code> delegation — great for form fields</td>
		</tr>
	</tbody>
</table>

<h2>Try them</h2>

<div class="demo-grid">
	<button data-viv="@pop" data-viv-on="click" class="demo-box">click me</button>
	<div data-viv="@sh-x" data-viv-on="hover" class="demo-box">hover me</div>
	<input data-viv="@bn" data-viv-on="focus" class="demo-box" placeholder="focus me" />
	<div data-viv="@dr" data-viv-on="appearing" data-viv-repeat-scroll class="demo-box">
		scrolled in
	</div>
</div>

<h2>Replay on every scroll</h2>

<p>
	<code>appearing</code> fires once by default. Add <code>data-viv-repeat-scroll</code> and the
	element re-arms whenever it leaves the viewport:
</p>

<pre><code>{`<div data-viv="@sl-y" data-viv-on="appearing" data-viv-repeat-scroll>`}</code></pre>

<h2>Programmatic control</h2>

<pre><code>{`import Vivace from 'vivace'

Vivace.trigger(el)  // fire or restart, regardless of trigger type
Vivace.pause(el)    // freeze mid-animation
Vivace.play(el)     // unpause — or fire if it never ran
Vivace.destroy()    // remove all listeners and observers`}</code></pre>

<h2>Accessibility</h2>

<p>
	Under <code>prefers-reduced-motion: reduce</code>, every animation collapses to an instant snap:
	entrances appear immediately, exits still hide. No content is ever lost behind a paused
	entrance animation.
</p>

<style>
	.demo-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 2rem;
	}

	.demo-box {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1rem;
		text-align: center;
		color: var(--text);
		font-family: var(--mono);
		font-size: 0.9rem;
	}

	button.demo-box {
		cursor: pointer;
	}

	input.demo-box::placeholder {
		color: var(--text-dim);
	}
</style>
