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
- **apps/docs**: Next.js 16 documentation site
- **packages/cli**: Hyperiux CLI tool (`npx hyperiux`)
- **registry/effects**: Source components for the registry

### Monorepo Structure

```
hyperiux-ui/
├── apps/
│   └── docs/                    # Documentation website
│       ├── src/app/             # Next.js App Router pages
│       ├── public/r/            # Built registry JSON files
│       └── scripts/             # Build scripts
│
├── packages/
│   └── cli/                     # CLI package (hyperiux)
│       └── src/
│           ├── commands/        # init, add, list commands
│           └── utils/           # registry, config, package-manager
│
├── registry/                    # Component source files
│   └── effects/
│       ├── text/                # blur-text, text-reveal
│       ├── backgrounds/         # aurora
│       ├── scroll/              # smooth-scroll
│       └── buttons/             # magnetic-button
│
├── pnpm-workspace.yaml
└── turbo.json
```

### Docs App (apps/docs)

- **Next.js 16** with React 19 and App Router
- **Tailwind CSS 4** via PostCSS plugin
- **JavaScript** (not TypeScript)
- Path alias `@/*` maps to `./src/*`

### CLI Package (packages/cli)

- **Commander.js** for command parsing
- **Prompts** for interactive prompts
- **Chalk** + **Ora** for colorized output and spinners
- ES Modules (`"type": "module"`)

### Registry System

Components are stored in `registry/effects/` with:
- Component file (`.jsx`)
- Registry metadata (`registry.json`)

Build script generates JSON files in `apps/docs/public/r/`:
- Individual component JSON (`blur-text.json`)
- Index file (`index.json`)

### Adding New Effects

1. Create directory in `registry/effects/<category>/<effect-name>/`
2. Add component file (`<effect-name>.jsx`)
3. Add registry metadata (`registry.json`)
4. Run `pnpm build:registry` to generate JSON

### Key Conventions

- All components are client components (`"use client"`)
- Animation libraries: Framer Motion (primary) or GSAP (scroll/complex)
- Effects export named components (not default exports)
- Registry dependencies handled automatically by CLI
