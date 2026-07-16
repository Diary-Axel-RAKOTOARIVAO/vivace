# Vivace

> **vivace** *(music)* — lively, up-tempo.

Attribute-driven CSS animations with a tiny, dependency-free trigger engine.

```html
<div data-viv="@fd @sl-y_ease-out-back" data-viv-on="appearing">
  Fades in while sliding up, when scrolled into view.
</div>
```

This is a Bun-workspaces monorepo:

| Package | What |
| --- | --- |
| [`packages/vivace`](packages/vivace) | The library — TypeScript engine + SCSS-generated CSS, published to npm |
| [`apps/docs`](apps/docs) | SvelteKit docs site with a node-based playground for composing animations |

## Development

```sh
bun install

bun run build       # build the library (CSS + ESM/CJS + types)
bun run test        # library unit tests
bun run docs:dev    # docs site + playground on http://localhost:5173
bun run lint        # biome
```

## Deploying the docs (Cloudflare Workers + D1)

The docs app ships the community gallery on D1. First deploy:

```sh
cd apps/docs
bunx wrangler d1 create vivace-gallery         # paste the id into wrangler.jsonc
bunx wrangler d1 migrations apply vivace-gallery --remote
bun run build && bunx wrangler deploy
```

Local dev needs no account — `bun run dev` emulates the binding, seeded via
`bunx wrangler d1 migrations apply vivace-gallery --local`.

## Releasing

Versioning goes through [Changesets](https://github.com/changesets/changesets):

```sh
bun run changeset   # record a change
bun run version     # bump versions + changelog
bun run release     # build + publish
```

## Credits

The keyframe DSL is inspired by (and ports the preset system of)
[A.css](https://github.com/w4u-public/A.css), rebuilt on SCSS with a proper
JS trigger engine, normalized grammar and new animation keys.
