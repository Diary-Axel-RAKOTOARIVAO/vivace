# vivace

## 0.2.0

### Minor Changes

- c494f14: Four new animation keys, exit animations, lifecycle events and a runtime plugin API.

  - New keys: `@sq` squash & stretch, `@hb` heartbeat, `@wv` wave, `@gl` glow (18 total)
  - `Vivace.out(el)` plays the `data-viv-out` composition (default `@fd-o`) and resolves when it finishes — remove elements without a flash
  - Bubbling lifecycle events: `vivace:play`, `vivace:out`, `vivace:end`
  - `Vivace.defineKey(token, def)` registers runtime animation keys; `Vivace.defineTrigger(name, setup)` registers custom `data-viv-on` triggers with teardown support

- 37e898b: Initial release: attribute-driven CSS animation library with a trigger engine.

  - SCSS-generated keyframe system ported from A.css (`@fd`, `@sl`, `@rt`, `@sc`, `@sp`, `@vb`, `@pr`, `@bn`, `@sh`, `@fl`) plus four new keys: `@bl` blur, `@sw` swing, `@pop` pop, `@dr` drop
  - Trigger engine: `load`, `appearing` (shared IntersectionObserver), `hover`, `click`, `focus` — all delegated, zero per-element listeners
  - MutationObserver auto-registration for SPA-mounted elements
  - Public API: `init`, `trigger`, `play`, `pause`, `destroy`
  - `prefers-reduced-motion` support
