# Development Phases

Each phase is independently shippable and testable. Do not start the next phase until the current one works end-to-end.

---

## Phase 1 — App Scaffold + Canvas Shell
**Goal:** The app boots, the 3-panel layout renders, and dashcraft widgets display from a hardcoded schema.

### Files to create
```
apps/web/ai-builder/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── postcss.config.mjs
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── schema.ts                  # AIDashboardSchema, DiffPatch, Version, WidgetType
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── DashboardFromSchema.tsx
│   │   │   ├── WidgetRenderer.tsx
│   │   │   └── CanvasArea.tsx
│   │   └── ui/
│   │       └── EmptyCanvas.tsx
│   └── pages/
│       └── Builder.tsx                # 3-panel layout with hardcoded schema
```

### Acceptance criteria
- [ ] `pnpm dev --filter=ai-builder` starts on port 5174
- [ ] 3-panel layout renders (left / center / right)
- [ ] Hardcoded `AIDashboardSchema` with 3 widgets renders on canvas
- [ ] Dashcraft edit mode toggle works (drag handles appear)
- [ ] Drag and resize work on the canvas

---

## Phase 2 — AI Generation (Create Mode)
**Goal:** User types a prompt, Ollama generates a schema, it renders on the canvas.

### Files to create/modify
```
src/
├── ai/
│   ├── ollamaClient.ts              # OpenAI SDK → localhost:11434
│   ├── prompts.ts                   # SYSTEM_PROMPT_CREATE, SYSTEM_PROMPT_DIFF
│   └── schemaParser.ts              # streaming JSON accumulator
├── lib/
│   └── validateSchema.ts            # schema validation + sanitization
├── components/
│   ├── prompt/
│   │   ├── PromptBar.tsx
│   │   ├── OllamaStatus.tsx
│   │   └── StreamingStatus.tsx
│   └── canvas/
│       └── CanvasArea.tsx           # update: show streaming state
```

### Acceptance criteria
- [ ] `ollama serve` → green dot in prompt bar
- [ ] Ollama offline → red dot + "Start Ollama" message
- [ ] Typing prompt + Enter → LLM call starts, streaming status shows
- [ ] Valid JSON schema received → widgets render on canvas
- [ ] Invalid JSON → error toast, raw output shown in right panel
- [ ] Test with: "Create a sales dashboard with revenue KPI and bar chart"

---

## Phase 3 — Builder Store + Versioning
**Goal:** Every AI generation creates a version. User can switch between v1, v2, v3.

### Files to create/modify
```
src/
├── stores/
│   └── builderStore.ts              # Zustand: versions[], activeVersionId, promptHistory
├── lib/
│   └── localStorage.ts              # SyncAdapter, localStorageAdapter
├── components/
│   ├── layout/
│   │   └── Header.tsx               # version tabs
│   └── versions/
│       ├── VersionSidebar.tsx
│       ├── VersionTab.tsx
│       └── VersionList.tsx
```

### Acceptance criteria
- [ ] First generation creates `v1`
- [ ] Second generation creates `v2`
- [ ] Clicking v1 tab restores v1 schema AND its drag layout
- [ ] Versions persist across page refresh (localStorage)
- [ ] Version label is editable (double-click)
- [ ] Delete version works (with confirmation)

---

## Phase 4 — Diff Updates (Patch Mode)
**Goal:** If a schema exists, follow-up prompts generate DiffPatch[] and patch the canvas in-place.

### Files to create/modify
```
src/
├── ai/
│   ├── diffPatcher.ts               # applyPatches(), findNode(), deepMerge()
│   └── ollamaClient.ts              # update: add generateDiff() function
├── components/
│   └── prompt/
│       └── PromptBar.tsx            # update: show "Update" mode indicator
```

### Acceptance criteria
- [ ] With existing schema: prompt triggers diff mode (not full regeneration)
- [ ] Diff response patches only the changed nodes
- [ ] Non-patched widgets do NOT re-render (check React DevTools)
- [ ] New version created from diff (v2 has `diff` field set)
- [ ] Test: "Make the revenue card green" → only that card updates

---

## Phase 5 — JSON Panel + Bidirectional Sync
**Goal:** Monaco editor shows current schema. Edits in Monaco update the canvas.

### Files to create/modify
```
src/
├── components/
│   └── panels/
│       └── JSONPanel.tsx            # Monaco editor + schema sync
```

### Acceptance criteria
- [ ] Right panel JSON tab shows current `AIDashboardSchema` formatted
- [ ] Editing valid JSON in Monaco updates canvas after 500ms debounce
- [ ] Invalid JSON shows error but doesn't crash the canvas
- [ ] Switching versions updates the JSON panel
- [ ] Canvas drag/resize updates the JSON panel (position sync)

---

## Phase 6 — Export
**Goal:** User can download JSON config and preview React code.

### Files to create/modify
```
src/
├── lib/
│   └── codeGen.ts                   # schema → React JSX string (basic)
├── components/
│   ├── panels/
│   │   └── ExportPanel.tsx          # shiki preview + download buttons
│   └── layout/
│       └── Header.tsx               # update: Export dropdown
```

### Export actions
1. **Download JSON** → `Blob` download of `AIDashboardSchema` JSON
2. **Copy JSON** → clipboard
3. **Preview React Code** → shiki-rendered JSX in right panel
4. **Export via MCP** → invokes MCP tool (see `08-EXPORT-MCP.md`)

### Acceptance criteria
- [ ] "Download JSON" downloads valid JSON file
- [ ] "Copy JSON" copies to clipboard with success toast
- [ ] Code tab shows shiki-highlighted React code
- [ ] Generated code imports from `@repo/ui` and `@repo/dashcraft`

---

## Phase 7 — Polish + Edge Cases
**Goal:** Production-ready UX.

### Tasks
- [ ] Empty canvas state with prompt suggestions
- [ ] Skeleton loading while LLM streams
- [ ] Keyboard shortcuts: `Cmd+Enter` = submit prompt, `Cmd+E` = toggle edit mode
- [ ] Left panel collapse/expand animation
- [ ] Right panel collapse/expand animation
- [ ] Toast notifications (use `@repo/ui` Sonner)
- [ ] Mobile: disable builder on <768px with message
- [ ] Error boundary around canvas
- [ ] "Reset canvas" button
- [ ] Widget count indicator in header

---

## Phase 8 (Future) — Widget Palette + Drag From Sidebar
**Goal:** User can drag `@repo/ui` components from a left palette onto the canvas.

### Notes
- Requires dashcraft `addWidget()` integration
- Palette groups components by category (Layout, Data, Charts, Forms)
- Drag from sidebar → drop on canvas → widget appears at drop position
- Triggers a new version

---

## Phase 9 (Future) — Server Sync
**Goal:** Implement the `SyncAdapter` with a real backend.

### Notes
- New app: `apps/api/builder-api` (Hono or Fastify)
- `POST /versions` — save
- `GET /versions` — load
- `serverAdapter` in `lib/localStorage.ts` that calls this API
- Auth with existing `@repo/router` auth system

---

## Session Notes

Track per-session progress here. Update as work happens.

### Session 1 (2026-04-01)
- Completed research: dashcraft architecture, monorepo structure, tech stack decisions
- Created all docs (phases 00–08)
- Model confirmed: llama3.2:3b (8GB MacBook Air)
- Completed Phase 1 fully — app scaffold, canvas bridge, 3-panel layout, all components
- Dev server running at http://localhost:5174
- Fixed @repo/ui: created packages/ui/src/index.ts barrel + updated package.json exports to ./dist/src/index.js
- Next: Phase 2 — Ollama client + AI generation

### Phase 1 file list (created)
```
apps/web/ai-builder/
├── package.json, vite.config.ts, tsconfig*.json, postcss.config.js, index.html, eslint.config.js
├── public/favicon.svg
└── src/
    ├── main.tsx, App.tsx, index.css
    ├── types/schema.ts
    ├── stores/builderStore.ts
    ├── pages/Builder.tsx
    └── components/
        ├── canvas/DashboardFromSchema.tsx, WidgetRenderer.tsx, CanvasArea.tsx
        ├── layout/Header.tsx
        ├── prompt/PromptBar.tsx
        ├── versions/VersionSidebar.tsx
        └── panels/JSONPanel.tsx
```

### Session 2
- [ ] (fill in when starting)
