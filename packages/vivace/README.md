# Vivace

Attribute-driven CSS animations with a tiny, dependency-free trigger engine.
Compose animations directly in your HTML — no keyframes to write, no wrapper
components, works in plain HTML, React, Svelte, Vue, anything that renders DOM.

```html
<div data-viv="@fd @sl-y_ease-out-back" data-viv-on="appearing">
  Fades and slides up when scrolled into view.
</div>
```

## Install

```sh
bun add vivace   # or npm / pnpm / yarn
```

```ts
import Vivace from 'vivace'
import 'vivace/vivace.css'

Vivace.init()
```

That's it. Every `[data-viv]` element on the page — including ones mounted
later by your framework — is picked up automatically.

## The grammar

`data-viv` holds a composition of **keys** (animations, prefixed `@`) and
**modifiers** (tuning, prefixed `_`). Modifiers concatenate straight onto
their key (the `_` delimits them); separate keys are space-separated —
`"@fd @sl-y_ease-out-back"`:

```html
<button data-viv="@pop_ease-out-back" data-viv-on="click">Pop!</button>
```

### Keys

| Key | Animation | Variants |
| --- | --- | --- |
| `@fd` | Fade | `@fd` in, `@fd-o` out |
| `@sl` | Slide | `@sl-x`, `@sl-y`, `-o` out, `!` flip direction |
| `@rt` | Rotate | `@rt-x/y/z` full spin, `-i`/`-o` 90° fold, `!` flip |
| `@sc` | Scale | `@sc-i` grow in, `@sc-o` shrink out, per-axis `-x`/`-y`, `!` from 2x |
| `@sp` | Spiral | `@sp-i`, `@sp-o`, `!` flip |
| `@vb` | Vibrate | `@vb` |
| `@pr` | Perspective | `@pr-i`, `@pr-o` fly along Z, `!` flip, `-up/-down` distance |
| `@bn` | Bounce | `@bn` both axes, `@bn-x`, `@bn-y`, `!` invert |
| `@sh` | Shake | `@sh-x`, `@sh-y`, `!` invert |
| `@fl` | Flick | `@fl-x/y/z` spring settle, `-o` fold away |
| `@bl` | Blur | soft-focus fade in, `@bl-o` out — *new in Vivace* |
| `@sw` | Swing | pendulum from the top edge, `!` flip — *new in Vivace* |
| `@pop` | Pop | elastic scale-in punch — *new in Vivace* |
| `@dr` | Drop | fall in and bounce on landing, `!` rise — *new in Vivace* |

Keys compose: `@fd @sl-y` fades while sliding. `@bn @sl-x` slides in with a
bounce landing.

### Modifiers

- `_ease-*` — `lin`, `in`, `out`, `in-out`, `circ`, `back`, `expo` (+ `in-`/`out-` forms)
- `_delay-1` … `_delay-8` — start delay in 0.1s steps
- `_speed-up[+++]` / `_speed-down[+++]` — faster / slower
- `_lv-up[+++]` / `_lv-down[+++]` — intensity (distances, angles, spring size)
- `_origin-t/r/b/l/lt/rt/rb/lb` — transform origin
- `_repeat[-2..5]` — iteration count (bare = infinite)
- `_alt`, `_alt-rev`, `_rev` — playback direction
- `_child-ascend` / `_child-descend` / `_child-odd` / `_child-even` — animate
  direct children with a stagger instead of the element itself

### Triggers

`data-viv-on` decides *when* the composition fires:

| Trigger | Fires |
| --- | --- |
| `load` *(default)* | on mount |
| `appearing` | when scrolled into view (one shared `IntersectionObserver`); add `data-viv-repeat-scroll` to replay every time |
| `hover` | on pointer enter (delegated, no per-element listeners) |
| `click` | on click/tap (delegated) |
| `focus` | on focus — great for form fields |

### Fine tuning without CSS

```html
<div data-viv="@sl-y" data-viv-duration="600ms" data-viv-delay="0.2" data-viv-ease="out-expo" data-viv-repeat="2">
```

Or drop down to the raw custom properties in `style` (`--AD` duration,
`--AE` easing, `--AL` intensity, …) for full control.

## API

```ts
Vivace.init(root?)     // scan + arm; idempotent, defaults to document.body
Vivace.trigger(el)     // fire (or restart) regardless of trigger type
Vivace.play(el)        // unpause, or fire if it never ran
Vivace.pause(el)       // freeze in place
Vivace.destroy()       // tear down observers/listeners (SPA cleanup)
```

## SCSS

The shipped `vivace.css` is compiled from SCSS with a plugin-per-file layout
(inherited from A.css): every key lives in `src/styles/keys/`, every modifier
group in `src/styles/modifiers/`.

Consuming the source lets you re-configure the attribute name, spring table,
stagger size and more:

```scss
@use 'vivace/scss' with ($child-count: 20);
```

**Custom bundles** — write your own entry with only the plugins you want:

```scss
@use 'vivace/src/styles/keyframes';
@use 'vivace/src/styles/base';
@use 'vivace/src/styles/keys/fade';
@use 'vivace/src/styles/keys/slide';
@use 'vivace/src/styles/modifiers/easing';
```

**Adding an animation key** — drop a file in `keys/` that fills variable
slots (pick the 2-step or 10-step keyframe), add one `@use` line to
`keys/_index.scss`, done. The engine picks it up with zero JS changes:

```scss
// keys/_wobble.scss
@use '../config' as c;
@use '../mixins' as m;

@include m.key('@wb') {
  --AN: #{c.$kf-10};
  @for $i from 0 through 9 {
    --ARZ#{$i}: calc(#{m.alt($i) * 20deg} * var(--ASP#{$i}));
  }
}
```

## Accessibility

`prefers-reduced-motion: reduce` collapses every animation to an instant
snap — content is never hidden from users who opt out of motion.

## Docs & playground

Full documentation and the interactive composer live in the
[docs app](../../apps/docs) — `bun run docs:dev` from the repo root.
