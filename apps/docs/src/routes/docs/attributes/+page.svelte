<svelte:head>
	<title>Attributes — Vivace</title>
</svelte:head>

<h1>Attributes</h1>

<h2><code>data-viv</code> — the composition</h2>

<p>
	A composition is a list of tokens joined with <code>|</code>. <strong>Keys</strong> (prefix
	<code>@</code>) are animations; <strong>modifiers</strong> (prefix <code>_</code>) tune timing,
	intensity and targeting. Keys and modifiers stack freely:
</p>

<pre><code>{`data-viv="@fd|@sl-y|_ease-out-back|_delay-2"`}</code></pre>

<h3>Variant grammar</h3>

<table>
	<thead>
		<tr><th>Suffix</th><th>Meaning</th><th>Example</th></tr>
	</thead>
	<tbody>
		<tr><td><code>-x / -y / -z</code></td><td>axis</td><td><code>@sl-x</code>, <code>@rt-z</code></td></tr>
		<tr><td><code>-i</code></td><td>enter variant</td><td><code>@sc-i</code> grows in</td></tr>
		<tr><td><code>-o</code></td><td>exit variant</td><td><code>@fd-o</code> fades out</td></tr>
		<tr><td><code>!</code></td><td>invert direction</td><td><code>@sl-y!</code> slides from below</td></tr>
	</tbody>
</table>

<h2>Friendly tuning attributes</h2>

<p>
	For one-off tweaks you don't need modifier tokens — dedicated attributes map onto the underlying
	CSS custom properties:
</p>

<table>
	<thead>
		<tr><th>Attribute</th><th>Maps to</th><th>Example</th></tr>
	</thead>
	<tbody>
		<tr><td><code>data-viv-duration</code></td><td><code>--AD</code></td><td><code>600ms</code>, <code>0.6s</code>, <code>0.6</code></td></tr>
		<tr><td><code>data-viv-delay</code></td><td><code>--ADL</code></td><td><code>0.2</code>, <code>200ms</code></td></tr>
		<tr><td><code>data-viv-ease</code></td><td><code>--AE</code></td><td><code>out-back</code>, <code>linear</code>, any <code>cubic-bezier()</code></td></tr>
		<tr><td><code>data-viv-repeat</code></td><td><code>--AC</code></td><td><code>3</code>, <code>infinite</code></td></tr>
	</tbody>
</table>

<h2>Raw custom properties</h2>

<p>
	Everything above compiles down to CSS custom properties, and you can always set them inline for
	full control:
</p>

<pre><code>{`<div data-viv="@sl-y" style="--AD: 1.2; --AL: 2; --AE: var(--Aout-expo)">`}</code></pre>

<table>
	<thead>
		<tr><th>Property</th><th>Role</th><th>Default</th></tr>
	</thead>
	<tbody>
		<tr><td><code>--AD</code></td><td>duration base (seconds)</td><td><code>0.5</code></td></tr>
		<tr><td><code>--AS</code></td><td>speed multiplier</td><td><code>1</code></td></tr>
		<tr><td><code>--AE</code></td><td>easing</td><td><code>ease</code></td></tr>
		<tr><td><code>--AC</code></td><td>iteration count</td><td><code>1</code></td></tr>
		<tr><td><code>--ADL</code></td><td>delay</td><td><code>0s</code></td></tr>
		<tr><td><code>--AL</code></td><td>intensity level — scales distances, angles, springs</td><td><code>1</code></td></tr>
		<tr><td><code>--AOXY</code></td><td>transform origin</td><td><code>50% 50%</code></td></tr>
	</tbody>
</table>

<h2>Engine-managed attributes</h2>

<p>
	The engine writes <code>data-viv-state</code> (<code>idle</code> → armed and hidden,
	<code>play</code> → running/finished) and reads <code>data-viv-paused</code> to freeze playback.
	You normally never touch these — use the <a href="/docs/triggers">API</a> instead.
</p>
