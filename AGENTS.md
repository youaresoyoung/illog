# AGENTS.md

Pointer file for any AI coding agent (Claude Code, Cursor, Codex, OpenAI agents) working in this repo. The substance lives in `CLAUDE.md` files — read them.

## Read these in order

1. **[`CLAUDE.md`](CLAUDE.md)** — project layout, hard rules, build/test commands.
2. **[`packages/ui/CLAUDE.md`](packages/ui/CLAUDE.md)** — design system conventions. Required reading before touching any UI code.
3. **`services/web/public/llms-full.txt`** (when generated) — every component's full prop spec, intended for AI context windows.

## Three rules that will fail review if broken

1. Raw colors / spacing / radius / typography values are forbidden. Use `@illog/themes` tokens via `@illog/ui` sprinkles.
2. New UI primitives go in `packages/ui`, never in `services/app`. App code only composes existing primitives.
3. No deep imports from `@illog/ui/src/...`. Always import from the package root.

## Discovery order when looking for a component

1. Check `packages/ui/src/index.ts` exports — if it exists, use it.
2. Check `services/web/public/llms.txt` for the user-facing summary.
3. Check `services/storybook/stories/UI/<Component>/` for usage examples.
4. Only if no existing primitive fits: propose adding one to `packages/ui`, do not invent locally in `services/app`.
