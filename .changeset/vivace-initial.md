---
'vivace': minor
---

Initial release: attribute-driven CSS animation library with a trigger engine.

- SCSS-generated keyframe system ported from A.css (`@fd`, `@sl`, `@rt`, `@sc`, `@sp`, `@vb`, `@pr`, `@bn`, `@sh`, `@fl`) plus four new keys: `@bl` blur, `@sw` swing, `@pop` pop, `@dr` drop
- Trigger engine: `load`, `appearing` (shared IntersectionObserver), `hover`, `click`, `focus` — all delegated, zero per-element listeners
- MutationObserver auto-registration for SPA-mounted elements
- Public API: `init`, `trigger`, `play`, `pause`, `destroy`
- `prefers-reduced-motion` support
