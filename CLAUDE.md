# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development (from root)
pnpm dev              # Start all dev servers
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm build:registry   # Rebuild registry JSON files (run after adding/editing any registry effect)

# Docs app (from apps/docs)
pnpm dev              # Start docs dev server at localhost:3000

# CLI testing (from root)
node packages/cli/src/index.js --help
node packages/cli/src/index.js list
node packages/cli/src/index.js init -y
node packages/cli/src/index.js add blur-text --dry-run
```

## Architecture

pnpm monorepo with Turborepo:
- **`apps/docs`** — Next.js documentation site (React 19, Tailwind CSS 4, JS only, no TypeScript)
- **`packages/cli`** — `npx hyperiux` CLI tool
- **`registry/effects`** — Source components, organized by category folder

### Registry System

The registry is the core distribution mechanism (shadcn-style). Source lives in `registry/effects/<category>/<name>/`. The build script (`apps/docs/scripts/build-registry.js`) reads every folder and emits:
- `apps/docs/public/r/<name>.json` — full effect with embedded file contents
- `apps/docs/public/r/index.json` — flat index of all effects

The CLI fetches from `https://hyperiux.dev/r` in production but auto-detects `apps/docs/public/r/` when run from the monorepo root.

**Every registry effect folder must have:**
- `<name>.jsx` — component with `"use client"` and a **named export** (not default). Multi-file entries use relative imports between files in the same folder.
- `registry.json` — metadata

**registry.json schema:**
```json
{
  "name": "effect-name",
  "type": "registry:component",
  "title": "Display Name",
  "description": "...",
  "category": "scroll|cursor|backgrounds|transitions|text|buttons|carousels|components|navigation|loaders|webgl|others",
  "dependencies": ["gsap"],
  "registryDependencies": [],
  "previewUrl": "/demo-route",
  "order": 1
}
```

`order` (optional, default 99) controls sort position within the category. `registryDependencies` lists other Hyperiux effects the CLI should install automatically.

**Category display order** is controlled by the `CATEGORY_ORDER` array at the top of `apps/docs/scripts/build-registry.js`. Add new categories there.

### Adding a New Effect — Checklist

1. `mkdir -p registry/effects/<category>/<effect-name>/`
2. Create `<effect-name>.jsx` with named export `export function EffectName`
3. Create `registry.json`
4. Run `pnpm build:registry`
5. Optionally add a props config entry in `apps/docs/src/lib/effect-configs.js` so the detail page renders an interactive props panel

### Docs App Architecture

**Routing:**
- `/effects` — listing page (`vault-content.jsx` + `EffectCardNew`) — reads `public/r/index.json` at build time
- `/effects/[slug]` — detail page (`effect-detail.jsx`) — reads `public/r/<slug>.json` via `apps/docs/src/lib/registry.js`
- `/effects/[slug]/preview` — fullscreen iframe preview
- Demo pages live at their own routes (e.g. `/hover-slider`, `/carousels/clippath-slider`) — these are **not** distributed via CLI

**Key lib files:**
- `apps/docs/src/lib/registry.js` — `getEffectBySlug`, `getRegistryIndex`, `getAllEffectSlugs`, `getEffectsByCategory` — all read from `public/r/` at build time (SSG)
- `apps/docs/src/lib/effect-configs.js` — per-effect prop definitions (`props`, `defaults`, `note`) rendered as an interactive panel on the detail page

**Performance conventions:**
- `EffectCardNew` lazy-loads video: `videoSrc` state starts `null`, set on first hover only
- `<Image>` uses `fill` + `sizes` prop; pass `priority={true}` for above-the-fold cards (first 4)
- Demo-specific fonts: `next/font/google` in the demo page, not in global layout
- Assets for demos: `apps/docs/public/assets/demo/<demo-name>/`

### Animation Library Conventions

- **Framer Motion** (`motion/react`) — simple entrance/exit animations, button effects
- **GSAP** — scroll-driven animations (`ScrollTrigger`), complex sequences, canvas ticker loops (`gsap.ticker.add`)
- **GSAP SplitText** — import from `gsap/dist/SplitText` (paid plugin bundled in project)
- **Lenis** (`lenis/react`) — smooth scroll; wrap pages with `<ReactLenis root>` in the demo page

### Three.js / WebGL Patterns

- Raw Three.js: store renderer/texture/RAF refs, clean up in `useEffect` return
- R3F (`@react-three/fiber`): use `@react-three/drei` helpers, `@react-three/postprocessing` for post-FX
- Reset `hasInit.current = false` in cleanup for React Strict Mode double-invoke safety
- Multi-file WebGL effects (e.g. `601-hero`, `milkyway`): all helper files go in the same registry folder with relative imports (`./room-model`)
- `OffscreenCanvas` for Canvas 2D double-buffering (e.g. `gooey-counter`)

### Sentry

Configured via `withSentryConfig` in `apps/docs/next.config.mjs`. Config files: `sentry.client.config.js`, `sentry.server.config.js`, `sentry.edge.config.js`, `src/instrumentation.js`. Source map upload is skipped unless `NEXT_PUBLIC_SENTRY_DSN` is set.
