# illog — Project Guide for AI Coding Agents

This file is the entry point for any AI coding agent working in this repo. Read it before touching code. The deeper conventions for the design system live in [`packages/ui/CLAUDE.md`](packages/ui/CLAUDE.md) — required reading before any UI change.

## What this repo is

**illog** is a personal Electron desktop app for logging time + reflections, with a marketing/docs site and a Storybook for the design system. Single user (the author), single decision-maker (the author), but treated like a real product internally — design system, monorepo discipline, codegen pipeline.

## Monorepo layout

This is a **pnpm + Nx workspace** with `node-linker=hoisted` (`.npmrc`).

```
packages/
├── themes/            React-free design tokens (colors, size, typography, responsive)
├── ui/                React 19 component library — single source of truth for primitives
├── codeqa/            CLI for repo Q&A and AI commit messages
├── analytics/         Analytics helpers
├── arch-doc/          Architecture docs / generators
├── esbuld-config/     Shared esbuild config (typo intentional, do not rename)
└── vscode-extension/  VS Code extension for the project

services/
├── app/               Electron Forge + Vite app (the actual desktop app)
├── web/               Next.js marketing + docs site (publishes llms.txt)
└── storybook/         Storybook for @illog/ui

scripts/
└── figma-push/        Code → Figma sync (DTCG token export + Figma plugin)
```

## Hard rules — break these and the change fails review

1. **Never hardcode colors, spacing, radius, font sizes, font weights, blur, depth, or stroke values** in component code. Always reference tokens from `@illog/themes`. If a token does not exist, propose adding one — don't bypass.
2. **New UI primitives go in `packages/ui/src/components/<Name>/`**, never inside `services/app`. App code only composes existing primitives.
3. **No deep imports**. Use `import { X } from '@illog/ui'` — never `@illog/ui/src/...` or `@illog/ui/dist/...`.
4. **Vanilla Extract only** for styling: `@vanilla-extract/sprinkles`, `@vanilla-extract/recipes`, `@vanilla-extract/css`, `@vanilla-extract/dynamic`. No Tailwind. No CSS modules. No styled-components.
5. **Do not edit auto-generated files**. They include `packages/ui/src/core/tokens/generatedColors.ts`, `packages/ui/src/assets/icons/*`, `packages/ui/components.spec.json`, `services/web/public/llms-full.txt`. Regenerate via the documented script instead.
6. **Electron main is CJS**. Vite builds the main process with `lib.formats: ['cjs']`. Don't introduce ESM-only deps in `services/app/src/main/`. Several modules (`better-sqlite3`, `@google/genai`, `natural`, `string-similarity`) must remain external.
7. **Boolean props use `is` / `has` prefixes** (e.g. `isDisabled`, `hasError`). Variants use string union literals, never enums.
8. **Compound components** expose a `use<Name>Context` hook. See `Selector` (TagSelector / BadgeSelector / BasicSelector + their context hooks) for the canonical pattern.

## Build & test commands

| Goal                             | Command                                    |
| -------------------------------- | ------------------------------------------ |
| Install                          | `pnpm install`                             |
| Run the desktop app in dev       | `pnpm --filter @illog/app start`           |
| Build everything                 | `pnpm build` (Nx run-many)                 |
| Build only changed               | `pnpm build:affected`                      |
| Lint / typecheck / test affected | `pnpm affected`                            |
| Storybook                        | `pnpm --filter @illog/storybook storybook` |
| Web (Next.js) dev                | `pnpm --filter @illog/web dev`             |
| Regenerate AI context            | `pnpm gen:ai-context`                      |
| Export tokens to DTCG (Figma)    | `pnpm figma:export-tokens`                 |

## Auto-generated AI context artifacts

These are part of the codegen pipeline. **Do not hand-edit.**

- **`services/web/public/llms.txt`** — short, hand-curated index linking to docs. Hand-maintained.
- **`services/web/public/llms-full.txt`** — full Markdown spec of every component + token, intended to be loaded into AI context windows. Regenerated via `pnpm gen:ai-context`. Convention: <https://llmstxt.org>.
- **`packages/ui/components.spec.json`** — structured prop-type spec for every public component. Regenerated via `pnpm --filter @illog/ui gen:spec`.

## Figma integration

This repo is wired for Figma's official **Dev Mode MCP server** (free with any Dev Mode seat — including the student plan). See [`docs/figma-mcp-setup.md`](docs/figma-mcp-setup.md) for one-time setup. The server is registered in [`.mcp.json`](.mcp.json) at the repo root; Claude Code picks it up automatically.

For code → Figma direction: [`scripts/figma-push/`](scripts/figma-push) exports tokens to DTCG JSON and provides a small Figma plugin that imports them as Figma Variables.

## Discovery order when looking for a component

1. Check `packages/ui/src/index.ts` exports — if it exists, use it.
2. Check `services/web/public/llms.txt` for the user-facing summary, and `llms-full.txt` for the full prop spec.
3. Check `services/storybook/stories/UI/<Component>/` for usage examples.
4. Only if no existing primitive fits: propose adding one to `packages/ui`. Do not invent locally in `services/app`.

## Where the deeper UI rules live

[`packages/ui/CLAUDE.md`](packages/ui/CLAUDE.md) covers:

- Component folder layout (`Button.tsx`, `button.css.ts`, `types.ts`, `Button.test.tsx`)
- Compound component pattern + context hooks
- Sprinkles vs recipes decision
- Token reference categories
- Testing rules
- Quick checklist before committing
