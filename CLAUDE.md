# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development (from root)
pnpm dev              # Start all dev servers
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm build:registry   # Rebuild registry JSON files

# Docs app (from apps/docs)
pnpm dev              # Start docs dev server at localhost:3000

# CLI testing (from root)
node packages/cli/src/index.js --help
node packages/cli/src/index.js list
node packages/cli/src/index.js init -y
node packages/cli/src/index.js add blur-text --dry-run
```

## Architecture

This is a pnpm monorepo with Turborepo, containing:
- **apps/docs**: Next.js 16 documentation site (React 19, Tailwind CSS 4, JavaScript)
- **packages/cli**: Hyperiux CLI tool (`npx hyperiux`)
- **registry/effects**: Source components organized by category

### Registry System

Components in `registry/effects/<category>/<name>/` contain:
- `<name>.jsx` - Component file with `"use client"` directive and named export
- `registry.json` - Metadata (name, title, description, category, dependencies)

Build script (`pnpm build:registry`) generates JSON files in `apps/docs/public/r/`:
- `<name>.json` - Individual effect with file contents embedded
- `index.json` - Index of all available effects

CLI fetches from `https://hyperiux.dev/r` in production, but auto-detects local `apps/docs/public/r/` when run from monorepo root.

### Adding New Effects

1. Create `registry/effects/<category>/<effect-name>/`
2. Add `<effect-name>.jsx` with named export component
3. Add `registry.json` with metadata
4. Run `pnpm build:registry`

### Registry Item Schema

```json
{
  "name": "effect-name",
  "type": "registry:component",
  "title": "Display Name",
  "description": "...",
  "category": "text|backgrounds|buttons|scroll|cursor|surfaces",
  "dependencies": ["framer-motion"],
  "registryDependencies": []
}
```

### Demo Pages vs Registry Effects

- **Registry effects** (`registry/effects/`): Installable components distributed via CLI
- **Demo pages** (`apps/docs/src/app/<demo-name>/`): Full-page showcases, not distributed
- **Showcase components** (`apps/docs/src/components/showcase/`): Complex demos used within pages

### Key Conventions

- Animation libraries: Framer Motion (primary) or GSAP (scroll/complex)
- `registryDependencies` in registry.json lists other effects this effect depends on (CLI installs them automatically)
- Demo-specific fonts: Import via `next/font/google` directly in the demo page, not in global layout
- Assets for demos: Place in `apps/docs/public/assets/demo/<demo-name>/`

### Three.js/WebGL Patterns

For scroll-based WebGL effects:
- Use GSAP ScrollTrigger with `scrub: true` for scroll-synced animations
- Store refs for cleanup: renderer, textures, animation frames
- Reset `hasInit.current = false` in cleanup for React Strict Mode compatibility
- Use `CanvasTexture` for SVGs (load as Image, draw to canvas, then create texture)
