# Figma MCP — Setup Guide

This project is wired to use the **official Figma Dev Mode MCP server** (local, free with any Figma seat that has Dev Mode — including the student plan). AI agents like Claude Code can then pull Figma frames directly into the editor and generate illog-compliant React code.

## One-time setup (per machine)

1. **Install the Figma desktop app.** The Dev Mode MCP server only runs inside the desktop app, not the browser.
2. **Enable Dev Mode** for any file. Toggle the Dev Mode switch in the top-right.
3. **Turn on the MCP server**: Figma menu → Preferences → check **"Enable Dev Mode MCP Server"**. The server starts on `http://127.0.0.1:3845/sse` and stays on whenever the desktop app is running.
4. **Restart Claude Code** in this project. The `.mcp.json` at the repo root registers the `figma-dev-mode` server, and Claude Code will pick it up on the next launch.
5. Verify in Claude Code: ask "list available Figma MCP tools" — you should see `get_code`, `get_variable_defs`, `get_image`, and friends.

## How to use day-to-day

### Design → code

1. In Figma, select a frame (or a single component instance).
2. **Right-click → Copy link to selection** (or use `⌘L`).
3. In Claude Code, paste: `Implement this frame using @illog/ui and @illog/themes tokens only: <paste link>`.
4. Claude will fetch the frame via MCP, read `llms-full.txt` for the component catalog and `CLAUDE.md` for rules, and return TSX that imports from `@illog/ui`.

Because `CLAUDE.md` and `packages/ui/CLAUDE.md` forbid raw values and new primitives, the output reuses existing components. If the frame uses a pattern with no matching component, Claude will flag it rather than invent one.

### Code → design

Two pieces:

- **Tokens** — automated via [`scripts/figma-push/export-tokens.ts`](../scripts/figma-push/export-tokens.ts) and the small Figma plugin in [`scripts/figma-push/plugin/`](../scripts/figma-push/plugin/). The script reads `packages/themes/src/tokens/**` and writes `tokens.dtcg.json` (W3C DTCG format). The plugin imports that JSON into Figma Variables.
- **Components** — designers manually mirror `services/storybook` examples into the Figma library, using `services/web/public/llms-full.txt` as the authoritative spec.

When Figma Code Connect lands here (a future pass), Dev Mode will show the actual `@illog/ui` import snippets next to each Figma component.

## Troubleshooting

- **"No Figma tools available"**: the desktop app isn't running or the MCP server isn't enabled. Re-check Preferences.
- **CORS/401 errors**: the MCP server is localhost-only. If you're in a container/remote VM, forward port 3845 to the host running Figma.
- **Stale results**: Figma caches by node ID. If you updated the frame and Claude still sees the old version, re-copy the link (Figma bumps a cache-buster in the URL).

## Fallback: headless / CI — `figma-developer-mcp` (community)

The official MCP requires Figma desktop running locally, which doesn't work in CI or on a server. For those cases use the community REST-API-based MCP:

1. Create a Figma personal access token at <https://www.figma.com/developers/api#access-tokens>.
2. Export it: `export FIGMA_ACCESS_TOKEN=...`.
3. Add a second entry to `.mcp.json` (only on the machine that needs it — don't commit the token):

```jsonc
{
  "mcpServers": {
    "figma-dev-mode": { "type": "sse", "url": "http://127.0.0.1:3845/sse" },
    "figma-rest": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=${FIGMA_ACCESS_TOKEN}"]
    }
  }
}
```

The REST version doesn't need the desktop app but loses some Dev Mode features (notably Code Connect resolution and image rendering).
