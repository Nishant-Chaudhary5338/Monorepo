# MCP Tools Demo — Build Plan

> Saved here so the plan survives across sessions.
> Last updated: 2026-04-10

## What We're Building

A two-app demo for showcasing 24+ custom MCP tools in a job interview.

```
apps/mcp-demo-server/   ← Express HTTP→MCP bridge  (port 3001)  ← YOU ARE HERE
apps/web/mcp-demo/      ← React demo frontend       (port 5175)  ← TODO
```

## Status

- [x] `apps/mcp-demo-server/` — fully scaffolded and installed
  - `src/index.ts` — Express server with CORS
  - `src/mcp-client.ts` — spawns MCP stdio servers via JSON-RPC
  - `src/tools-registry.ts` — all 24+ tools with categories and metadata
  - `src/routes/tools.ts` — GET /api/tools
  - `src/routes/call.ts` — POST /api/call
  - `src/routes/parallel.ts` — POST /api/parallel
- [ ] Wire up `dep-auditor` registerTools() + rebuild
- [ ] Wire up `monorepo-manager` registerTools() + rebuild
- [ ] Create sample files in `apps/web/mcp-demo/sample/`
  - `LegacyWidget.js` — bad JS file (for code-modernizer demo)
  - `MessyComponent.tsx` — bad TS file (for typescript-enforcer demo)
- [ ] `apps/web/mcp-demo/` — React frontend (port 5175)
  - App.tsx with Demo | Gallery tabs
  - DemoPage.tsx — 3-column layout, workflow stepper
  - GalleryPage.tsx — all 24+ tools in filterable grid
  - Components: ToolCallCard, ParallelGrid, CodePanel, WorkflowStepper, ToolsGallery
  - Zustand store for tool call state
  - API client (fetch wrapper for backend)

## Starting the apps

```bash
# Terminal 1 — backend
pnpm --filter mcp-demo-server dev

# Terminal 2 — frontend
pnpm --filter mcp-demo dev
```

## Demo Workflow Story

1. Show `LegacyWidget.js` source (old JS, no types)
2. **Convert to TS** → `code-modernizer` / `convert-to-typescript` (dryRun mode)
3. **Enforce TS rules** → `typescript-enforcer` / `scan_file` on `MessyComponent.tsx`
4. **Generate clean component** → `component-factory` / `generate_component` (new Button)
5. **Folder scan** → `typescript-enforcer` / `scan_directory` on `packages/ui/components`
6. **Run all parallel** → Steps 2–4 simultaneously, ParallelGrid shows 3 cards animating

## Key Architecture Decisions

- **component-factory** = CREATE new components only (not for reviewing existing files)
- **code-modernizer** = convert JS → TS (file extension + syntax + best practices)
- **typescript-enforcer** = enforce TS rules on already-TypeScript files
- All MCP servers run as **stdio child processes** (spawned by MCPClient class)
- Backend uses **Promise.all** for true parallel execution in `/api/parallel`

## API Reference

```
GET  /api/tools
→ { total, categories: [{ category, tools: ToolEntry[] }], all: ToolEntry[] }

POST /api/call
← { server: string, tool: string, args: object }
→ { success: boolean, result: unknown, duration: number }

POST /api/parallel
← { calls: [{ id, server, tool, args }] }
→ { results: [{ id, success, result, duration }] }
```

## Frontend File Structure (TODO)

```
apps/web/mcp-demo/
├── package.json                ← @repo/ui, react, lucide-react, zustand, vite@port5175
├── vite.config.ts
├── index.html
├── sample/
│   ├── LegacyWidget.js         ← bad JS — for code-modernizer demo
│   └── MessyComponent.tsx      ← bad TS — for typescript-enforcer demo
└── src/
    ├── main.tsx
    ├── index.css               ← @import tailwindcss + @repo/ui/dist/index.css
    ├── App.tsx                 ← Demo | Gallery tab switcher
    ├── api/client.ts           ← fetch wrappers for 3001 backend
    ├── store/demoStore.ts      ← Zustand: toolCalls[], status, results
    ├── pages/
    │   ├── DemoPage.tsx        ← 3-col: stepper | tool cards | code panel
    │   └── GalleryPage.tsx     ← filterable grid of all tools
    └── components/
        ├── ToolCallCard.tsx    ← status chip + duration + collapsible JSON
        ├── ParallelGrid.tsx    ← 2×2 grid of ToolCallCards
        ├── CodePanel.tsx       ← syntax-highlighted before/after
        ├── WorkflowStepper.tsx ← clickable step list on left
        └── ToolsGallery.tsx    ← card grid with category filter bar
```

## Interview Talking Points

- "24 custom MCP tools — each is an independent server communicating over stdio via JSON-RPC"
- "The parallel execution: each tool spawns its own process — isolated, stateless, composable"
- "Adding a new tool: 30 lines — extend McpServerBase, implement registerTools()"
- "dep-auditor and monorepo-manager were already built, just not registered — I wired them up"
- "The code-modernizer handles the full JS→TS migration pipeline: renames extensions, adds types, converts propTypes to interfaces"
