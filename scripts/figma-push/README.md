# scripts/figma-push — Code → Figma sync

This folder pushes illog's design tokens from code into Figma Variables. Two pieces:

| File                                   | Role                                                                                                                                                                                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`export-tokens.ts`](export-tokens.ts) | Reads `packages/themes/src/tokens/**` and writes [`tokens.dtcg.json`](tokens.dtcg.json) in the W3C [Design Tokens Community Group](https://design-tokens.github.io/community-group/format/) format. Run via `pnpm figma:export-tokens`. |
| [`plugin/`](plugin)                    | A small Figma plugin that imports `tokens.dtcg.json` and creates / updates Figma Variables collections matching it.                                                                                                                     |
| [`tokens.dtcg.json`](tokens.dtcg.json) | The exported file. Committed so Figma users can grab the latest snapshot without running the script.                                                                                                                                    |

## Why DTCG

Tokens Studio Pro ($9/seat) and Style Dictionary both produce DTCG-formatted JSON natively. By committing to the standard now we keep the option to switch tools later at near-zero migration cost.

## Why our own Figma plugin

Tokens Studio's free tier does not include the JSON-to-Variables import we need; the paid tier does, but at $9/user/month. The plugin in this folder is ~50 lines and does exactly the import we need — nothing more.

## Daily workflow

1. **Code-side change.** A developer edits `packages/themes/src/tokens/<category>/<name>.ts`.
2. **Run the export.** `pnpm figma:export-tokens` regenerates `tokens.dtcg.json`.
3. **Commit.** The diff in `tokens.dtcg.json` is the changelog the design team can read.
4. **Designer side.** A designer opens the Figma file, runs the **illog Tokens Sync** plugin (built from this folder), and selects `tokens.dtcg.json`. The plugin upserts the matching Figma Variables collection.

## Plugin development

```bash
cd scripts/figma-push/plugin
pnpm install
pnpm build       # tsc → code.js (Figma plugin entry)
```

Then in Figma desktop: Plugins → Development → Import plugin from manifest → pick `scripts/figma-push/plugin/manifest.json`.

The plugin uses Figma's `figma.variables.*` API and the `READ_WRITE_VARIABLES` capability declared in `manifest.json`.

## Limits

- **Modes**: today the plugin imports a single mode per collection (semantic colors are flat). Multi-mode (light/dark) support is a follow-up.
- **Aliases**: the plugin handles flat token references (`{color.semantic.surface.default}`) but not nested aliases through more than one indirection level.
- **Deletion**: the plugin upserts but does not delete tokens that disappeared from JSON, to avoid surprising designers. Manual cleanup until v2.
