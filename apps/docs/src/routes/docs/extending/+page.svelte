<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const defineKey = `import Vivace from 'vivace-css'

// '@wb' — a little wobble, usable immediately in any data-viv
Vivace.defineKey('@wb', {
  keyframe: 10,        // 2 = simple in/out, 10 = spring/oscillation
  duration: 0.9,       // --AD base seconds
  vars: {
    '--ARZ1': '8deg',
    '--ARZ3': '-6deg',
    '--ARZ5': '3deg',
    '--ARZ7': '-1.5deg'
  }
})`;

	const defineTrigger = `import Vivace from 'vivace-css'

// data-viv-on="longpress"
Vivace.defineTrigger('longpress', (el, fire) => {
  let timer: ReturnType<typeof setTimeout>
  const down = () => { timer = setTimeout(fire, 500) }
  const up = () => clearTimeout(timer)

  el.addEventListener('pointerdown', down)
  el.addEventListener('pointerup', up)
  return () => {
    el.removeEventListener('pointerdown', down)
    el.removeEventListener('pointerup', up)
  }
})`;

	const scssKey = `// keys/_wobble.scss
@use '../config' as c;
@use '../mixins' as m;

@include m.key('@wb') {
  --AN: #{c.$kf-10};
  @for $i from 0 through 9 {
    --ARZ#{$i}: calc(#{m.alt($i) * 20deg} * var(--ASP#{$i}));
  }
}`;

	const events = `el.addEventListener('vivace:end', () => {
  // bubbles — listen on the element, a container, or document
})`;

	const out = `import Vivace from 'vivace-css'

// <div data-viv="@dr" data-viv-out="@fd-o @sl-y-o">…</div>
await Vivace.out(toast)   // plays the exit, resolves when done
toast.remove()            // fill-mode kept it hidden — no flash`;
</script>

<svelte:head>
	<title>Extending — Vivace</title>
</svelte:head>

<h1>Extending</h1>

<p>
	Vivace's keys and triggers are both open sets. Everything below composes with the shipped
	grammar — custom keys take modifiers, custom triggers work on any composition.
</p>

<h2>Exit animations</h2>

<p>
	Entrances are declarative, but leaving the DOM needs a promise: play the exit, <em>then</em>
	remove the element. Declare the exit composition in <code>data-viv-out</code> (default
	<code>@fd-o</code>) and await <code>Vivace.out()</code>:
</p>

<CodeBlock lang="typescript" code={out} />

<h2>Lifecycle events</h2>

<p>Animated elements dispatch bubbling events you can hook anywhere:</p>

<table>
	<thead>
		<tr><th>Event</th><th>Fires</th></tr>
	</thead>
	<tbody>
		<tr><td><code>vivace:play</code></td><td>when an animation is (re)started</td></tr>
		<tr><td><code>vivace:out</code></td><td>when an exit composition starts</td></tr>
		<tr><td><code>vivace:end</code></td><td>when an animation finishes</td></tr>
	</tbody>
</table>

<CodeBlock lang="typescript" code={events} />

<h2>Custom keys at runtime</h2>

<p>
	<code>defineKey()</code> registers a new <code>@key</code> without touching SCSS. You fill the
	same custom-property slots the shipped keys use — <code>--ATX0..10</code> /
	<code>--ATY*</code> translate, <code>--ASX*</code>/<code>--ASY*</code> scale,
	<code>--ARX/Y/Z*</code> rotate, <code>--AOP0/1</code> opacity, <code>--AF0/1</code> filter:
</p>

<CodeBlock lang="typescript" code={defineKey} />

<Callout kind="tip">
	<p>
		Scale amplitudes with the spring table (<code>var(--ASP0)</code>…<code>var(--ASP9)</code>)
		and the intensity level (<code>var(--AL)</code>) so <code>_lv-*</code> modifiers keep working
		on your key.
	</p>
</Callout>

<h2>Custom triggers</h2>

<p>
	<code>defineTrigger()</code> adds a new <code>data-viv-on</code> value. The setup runs once per
	element; call <code>fire()</code> whenever the animation should play, and return a teardown for
	<code>Vivace.destroy()</code>:
</p>

<CodeBlock lang="typescript" code={defineTrigger} />

<Callout kind="note">
	<p>Register triggers before <code>Vivace.init()</code> so elements parsed on load pick them up.</p>
</Callout>

<h2>Keys as SCSS plugins</h2>

<p>
	For keys you ship with your bundle, write an SCSS plugin instead — one file in
	<code>keys/</code>, one <code>@use</code> line, and the engine needs zero registration:
</p>

<CodeBlock lang="scss" code={scssKey} />

<p>
	Custom bundles work the same way: write your own entry that <code>@use</code>s
	<code>keyframes</code>, <code>base</code> and only the key/modifier plugins you want.
</p>
