---
'vivace': minor
---

Four new animation keys, exit animations, lifecycle events and a runtime plugin API.

- New keys: `@sq` squash & stretch, `@hb` heartbeat, `@wv` wave, `@gl` glow (18 total)
- `Vivace.out(el)` plays the `data-viv-out` composition (default `@fd-o`) and resolves when it finishes — remove elements without a flash
- Bubbling lifecycle events: `vivace:play`, `vivace:out`, `vivace:end`
- `Vivace.defineKey(token, def)` registers runtime animation keys; `Vivace.defineTrigger(name, setup)` registers custom `data-viv-on` triggers with teardown support
