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

<div class="grid grid-cols-2 gap-3 rounded-box border border-base-300 bg-base-200/50 p-5 md:grid-cols-4">
	<button data-viv="@pop" data-viv-on="click" class="btn border-base-300 bg-base-100 font-mono text-xs font-normal">
		click me
	</button>
	<div
		data-viv="@sh-x"
		data-viv-on="hover"
		class="flex items-center justify-center rounded-field border border-base-300 bg-base-100 px-3 py-2.5 font-mono text-xs"
	>
		hover me
	</div>
	<input
		data-viv="@bn"
		data-viv-on="focus"
		class="input input-sm h-auto border-base-300 bg-base-100 py-2.5 font-mono text-xs"
		placeholder="focus me"
	/>
	<div
		data-viv="@dr"
		data-viv-on="appearing"
		data-viv-repeat-scroll
		class="flex items-center justify-center rounded-field border border-base-300 bg-base-100 px-3 py-2.5 font-mono text-xs"
	>
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
	entrances appear immediately, exits still hide. No content is ever lost behind a paused entrance
	animation.
</p>
