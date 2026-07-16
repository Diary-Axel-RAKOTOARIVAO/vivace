import { MODIFIERS, PRESETS, TRIGGER_OPTIONS } from 'vivace';

/**
 * One-file markdown documentation for AI agents (llms.txt convention).
 * Keys, modifiers and triggers are generated from the library's own
 * metadata so this never drifts from the shipped presets.
 */
export function buildLlmsDoc(): string {
	const keys = PRESETS.map(
		(p) =>
			`### \`${p.key}\` — ${p.name}${p.vivace ? ' *(Vivace original)*' : ''}\n\n` +
			`${p.description}\n\n` +
			`Variants: ${p.variants.map((v) => `\`${v}\``).join(', ')}`
	).join('\n\n');

	const modifiers = MODIFIERS.map(
		(m) =>
			`### \`${m.key}\` — ${m.name}\n\n${m.description}\n\n` +
			`Variants: ${m.variants.map((v) => `\`${v}\``).join(', ')}`
	).join('\n\n');

	const triggers = TRIGGER_OPTIONS.map((t) => `- \`${t.value}\` — ${t.description}`).join('\n');

	return `# Vivace — attribute-driven CSS animations

> Vivace is a zero-dependency CSS animation library (under 7 kB gzipped,
> CSS + JS) controlled entirely through \`data-viv\` attributes. A tiny
> TypeScript engine handles WHEN animations fire (scroll, hover, click,
> focus, mount); generated CSS handles HOW. It works in plain HTML and in
> every framework (React, Svelte, Vue, …) because it only reads attributes
> — there are no wrapper components.

This file is the complete documentation as one markdown document, intended
for AI agents and LLMs. Human-readable docs: https://usevivace.dev/docs
Package: \`vivace\` on npm. License: MIT.

## Instructions for AI agents

When asked to add animations to a project using Vivace:

1. Install \`vivace\` (bun/npm/pnpm/yarn), then initialize ONCE at the app
   root — never per component:

   \`\`\`ts
   import Vivace from 'vivace'
   import 'vivace/vivace.css'
   Vivace.init()
   \`\`\`

   In SSR frameworks run \`init()\` client-side only (SvelteKit: \`$effect\`
   in the root layout; React/Next: \`useEffect\` in a client component; Vue:
   \`onMounted\`). The module itself is SSR-safe to import. Return
   \`Vivace.destroy()\` from the lifecycle cleanup.

2. Animate by writing attributes — do NOT write @keyframes, wrapper
   components, or JS animation code:

   \`\`\`html
   <div data-viv="@fd @sl-y_ease-out-back" data-viv-on="appearing">…</div>
   \`\`\`

3. Elements mounted later (SPA route changes, v-if, conditional rendering)
   register automatically via MutationObserver — no extra calls.

4. Composition notation rules (IMPORTANT):
   - Keys start with \`@\` (animations); modifiers start with \`_\` (tuning).
   - Modifiers concatenate directly onto the key they tune, no separator:
     \`@sl-y_ease-out-back_delay-2\`.
   - Separate keys are space-separated: \`@fd @sl-y_ease-out-back\`.
   - Never write \`@fd@fd\` (missing space) or use \`|\` separators.
   - Variant grammar: \`-x/-y/-z\` axis, \`-i\` enter, \`-o\` exit, trailing
     \`!\` inverts direction: \`@sl-y!\` slides from below.
   - CSS matching is substring-based; the notation above is canonical.

5. For lists/grids, put ONE \`data-viv\` with a \`_child-*\` modifier on the
   PARENT; its direct children animate staggered:
   \`<ul data-viv="@fd_child-ascend @sl-y" data-viv-on="appearing">\`

6. Respect reduced motion: nothing to do — \`prefers-reduced-motion\` support
   is built in (animations collapse to an instant snap; content never hides).

## Attributes

| Attribute | Purpose |
| --- | --- |
| \`data-viv\` | The composition: keys + modifiers (see notation rules) |
| \`data-viv-on\` | Trigger: \`load\` (default), \`appearing\`, \`hover\`, \`click\`, \`focus\` |
| \`data-viv-out\` | Exit composition played by \`Vivace.out()\` (default \`@fd-o\`) |
| \`data-viv-repeat-scroll\` | With \`appearing\`: re-arm every time it leaves the viewport |
| \`data-viv-duration\` | Duration (\`600ms\`, \`0.6s\` or \`0.6\`) → \`--AD\` |
| \`data-viv-delay\` | Start delay → \`--ADL\` |
| \`data-viv-ease\` | Easing: keyword, \`cubic-bezier()\`, or named curve (\`out-back\`, \`in-expo\`, \`circ\`, …) → \`--AE\` |
| \`data-viv-repeat\` | Iteration count (number or \`infinite\`) → \`--AC\` |

Raw CSS custom properties (inline style) for full control: \`--AD\` duration
base (s), \`--AS\` speed multiplier, \`--AE\` easing, \`--AC\` count, \`--ADL\`
delay, \`--AL\` intensity level (scales distances/angles/springs), \`--AOXY\`
transform origin.

## Triggers

${triggers}

All triggers are delegated (one shared IntersectionObserver, one listener
set on the document) — per-element cost is zero.

## Animation keys (${PRESETS.length})

${keys}

Keys compose freely in one attribute: \`@fd @sl-y\` fades while sliding;
\`@bn @sl-x\` slides in with a bounce landing.

## Modifiers (${MODIFIERS.length} groups)

${modifiers}

## JavaScript API

\`\`\`ts
Vivace.init(root?)                 // scan + arm; idempotent; default document.body
Vivace.trigger(el)                 // fire or restart, regardless of trigger type
Vivace.play(el)                    // unpause, or fire if it never ran
Vivace.pause(el)                   // freeze in place
await Vivace.out(el)               // play data-viv-out, resolve when finished
Vivace.defineKey(token, def)       // runtime key: {keyframe: 2|10, duration?, vars}
Vivace.defineTrigger(name, setup)  // custom data-viv-on; setup(el, fire) => teardown
Vivace.destroy()                   // remove all listeners/observers
\`\`\`

Exit pattern (toasts, modals, list removal):

\`\`\`ts
// <div data-viv="@dr" data-viv-out="@fd-o @sl-y-o">
await Vivace.out(el)  // fill-mode keeps it hidden afterwards
el.remove()           // no flash
\`\`\`

Lifecycle events (bubbling CustomEvents on animated elements):
\`vivace:play\`, \`vivace:out\`, \`vivace:end\`.

Custom key example:

\`\`\`ts
Vivace.defineKey('@wb', {
  keyframe: 10, // 2 = simple in/out slots, 10 = spring/oscillation slots
  vars: { '--ARZ1': '8deg', '--ARZ3': '-6deg', '--ARZ5': '3deg' }
})
\`\`\`

Slot vocabulary for defineKey / SCSS keys: \`--ATX0..10\`/\`--ATY*\` translate,
\`--ASX*\`/\`--ASY*\` scale, \`--ARX/Y/Z*\` rotate, \`--AOP0/1\` opacity,
\`--AF0/1\` filter. Scale amplitudes by \`var(--ASPn)\` (spring table) and
\`var(--AL)\` so \`_lv-*\` modifiers keep working.

## SCSS source

\`vivace/scss\` exposes the source with a plugin-per-file layout: one file
per key in \`keys/\`, per modifier group in \`modifiers/\`. Configure via
\`@use 'vivace/scss' with ($child-count: 20)\`. Custom bundles: write an
entry that @uses \`keyframes\`, \`base\` and only the plugins you want.

## Links

- Docs: https://usevivace.dev/docs
- Playground (compose visually, copy the attribute): https://usevivace.dev/playground
- Community gallery: https://usevivace.dev/gallery
- Repository: https://github.com/aureon-it/vivace
`;
}
