# Architecture

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ai-builder app                              │
│                                                                     │
│  ┌──────────────┐    ┌─────────────────┐    ┌───────────────────┐  │
│  │  Prompt Bar  │    │    Canvas        │    │  Right Panel      │  │
│  │  (bottom)    │    │  (center)        │    │  JSON / Export    │  │
│  └──────┬───────┘    └────────┬────────┘    └───────────────────┘  │
│         │                     │                                     │
│         ▼                     ▼                                     │
│  ┌─────────────┐    ┌─────────────────────────────────────────┐    │
│  │  AI Layer   │    │           @repo/dashcraft                │    │
│  │  (Ollama)   │───▶│  Dashboard > DashboardCard × N          │    │
│  └─────────────┘    │  (drag / resize / delete / settings)    │    │
│         │           └─────────────────────────────────────────┘    │
│         │ DashboardSchema JSON         │                            │
│         ▼                             ▼                            │
│  ┌─────────────┐    ┌─────────────────────────────────────────┐    │
│  │  Builder    │    │         WidgetRenderer                  │    │
│  │  Store      │    │  type string → @repo/ui component       │    │
│  │  (Zustand)  │    └─────────────────────────────────────────┘    │
│  │  versions[] │                                                    │
│  └─────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow — Initial Generation

```
1. User types: "Create a sales dashboard with KPIs and a bar chart"
        │
        ▼
2. ollamaClient.generate(prompt, mode: 'create')
   POST http://localhost:11434/v1/chat/completions
   model: llama3.2:3b
   stream: true
        │
        ▼
3. LLM streams DashboardSchema JSON:
   {
     "title": "Sales Dashboard",
     "layout": "grid",
     "columns": 3,
     "widgets": [
       { "id": "kpi-1", "type": "kpi", "title": "Revenue", ... },
       { "id": "chart-1", "type": "bar", "title": "Monthly Sales", ... }
     ]
   }
        │
        ▼
4. builderStore.setActiveSchema(schema)
   builderStore.addVersion({ id: 'v1', schema, prompt, timestamp })
        │
        ▼
5. <DashboardFromSchema schema={schema} />
   walks widgets[] → wraps each in <DashboardCard> → <WidgetRenderer>
        │
        ▼
6. Live editable UI rendered on canvas
```

---

## Data Flow — Diff Update (follow-up prompt)

```
1. User types: "Make the revenue card blue and add a CTA button to the chart"
        │
        ▼
2. ollamaClient.generate(prompt, mode: 'diff', currentSchema)
   System prompt includes: current schema JSON + available node IDs
        │
        ▼
3. LLM returns DiffPatch[]:
   [
     { "nodeId": "kpi-1", "op": "update", "payload": { "settings": { "highlightColor": "#3b82f6" } } },
     { "nodeId": "chart-1", "op": "add",   "payload": { "type": "Button", "props": { "label": "View Details" } } }
   ]
        │
        ▼
4. diffPatcher.apply(currentSchema, patches) → new schema
        │
        ▼
5. builderStore.setActiveSchema(newSchema)
   builderStore.addVersion({ id: 'v2', schema: newSchema, prompt, diff: patches })
        │
        ▼
6. Only patched DashboardCards re-render (Zustand fine-grained subscriptions)
```

---

## Component Tree

```
<App>
  └── <Builder>                          # full-screen layout manager
        ├── <Header>                     # app logo, version tabs, edit toggle, export btn
        ├── <PanelGroup direction="horizontal">   # react-resizable-panels
        │     ├── <Panel> (left, collapsible)
        │     │     └── <VersionSidebar>          # v1, v2, v3 switcher + prompt history
        │     ├── <Panel> (center, main)
        │     │     └── <CanvasArea>              # scrollable canvas wrapper
        │     │           └── <DashboardFromSchema schema={activeSchema}>
        │     │                 └── <Dashboard persistenceKey={activeVersion.id}>
        │     │                       └── <DashboardCard × N>
        │     │                             └── <WidgetRenderer type={widget.type} />
        │     └── <Panel> (right, collapsible)
        │           ├── <JSONPanel>               # Monaco editor ↔ schema sync
        │           └── <ExportPanel>             # shiki preview + export actions
        └── <PromptBar>                  # fixed bottom — prompt input + streaming status
```

---

## State Architecture

### Two separate state domains

**1. Dashcraft store** (`useDashboardStore` from `@repo/dashcraft`)
- Owns: widget positions, sizes, edit mode, z-index, settings per widget
- Mutated by: user drag/resize/delete/settings actions
- Persisted: localStorage (keyed by version id)

**2. Builder store** (`builderStore.ts` — our own Zustand)
- Owns: versions[], activeVersionId, promptHistory, isGenerating, streamingStatus
- Mutated by: AI responses, version switches, prompt submissions
- Persisted: localStorage via `useVersionSync` hook

### Sync rule
When the user switches versions, the canvas re-mounts `<DashboardFromSchema>` with a new `persistenceKey` — dashcraft loads that version's saved layout from localStorage automatically.

---

## Module Boundaries

```
apps/web/ai-builder/src/
├── ai/           — Ollama client, prompts, diff patcher (pure TS, no React)
├── stores/       — Builder Zustand store (versions, prompts, streaming state)
├── components/   — React components (canvas bridge, panels, prompt bar)
├── pages/        — Builder.tsx (layout wiring)
├── types/        — Shared TypeScript types (extends dashcraft types)
└── lib/          — Utilities (localStorage adapter, schema validators)
```
