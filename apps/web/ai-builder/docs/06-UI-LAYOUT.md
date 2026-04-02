# UI Layout

---

## Overall Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (fixed top, 48px)                                        │
│ [⚡ AI Builder]  [v1] [v2] [v3+]  ────────  [Edit] [Export ▼]  │
├─────────────────────────────────────────────────────────────────┤
│         │                                    │                  │
│  LEFT   │         CENTER CANVAS              │  RIGHT PANEL     │
│  PANEL  │         (scrollable)               │  (collapsible)   │
│ 240px   │                                    │  360px           │
│(collap) │    <DashboardFromSchema>            │                  │
│         │                                    │  [JSON] [Code]   │
│ Version │    DashboardCard × N               │                  │
│ History │    (drag/resize in edit mode)       │  Monaco editor   │
│         │                                    │  or              │
│ Prompt  │                                    │  shiki preview   │
│ History │                                    │                  │
│         │                                    │                  │
├─────────────────────────────────────────────────────────────────┤
│ PROMPT BAR (fixed bottom, 80px)                                 │
│ [Ollama ●] [Describe your UI or request a change...     ] [↑]  │
│            [streaming: generating widget 3 of 5...]             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Panel Responsibilities

### Header (48px fixed)
- App logo + name
- Version tabs: `v1`, `v2`, `v3` — click to switch active version
- `+ Version` button (creates new from current)
- Spacer
- `Edit Layout` toggle button (calls `toggleEditMode()`)
- `Export ▼` dropdown: "Download JSON", "Export React Code"

### Left Panel (240px, collapsible)
- **Version History** section
  - Lists all versions: label, timestamp, prompt snippet
  - Click to activate
  - Rename (double-click label)
  - Delete version (with confirmation)
- **Prompt History** section
  - Last 10 prompts with timestamps
  - Click to re-run a prompt

### Center Canvas (flex-1, scrollable)
- Full canvas area
- Renders `<DashboardFromSchema>`
- In edit mode: dashcraft shows drag handles, resize corners, delete buttons, settings gears
- In view mode: clean rendered UI, no chrome
- Empty state: "Type a prompt to generate your UI" with animated placeholder

### Right Panel (360px, collapsible, two tabs)
- **JSON tab**: Monaco editor showing current `AIDashboardSchema`
  - Changes sync back to the canvas in real-time (debounced 500ms)
  - Error highlights for invalid JSON
  - Format button (prettify)
- **Code tab**: shiki-rendered React code preview
  - Shows what the MCP export would generate
  - Copy to clipboard button
  - "Export via MCP" button

### Prompt Bar (80px fixed bottom)
- Ollama status indicator: green dot = running, red = offline
- Text input: "Describe your UI or request a change..."
- Mode indicator: "Create" (no schema yet) vs "Update" (schema exists → diff mode)
- Submit button (or Enter)
- Streaming status line: "Generating... widget 3 of 5" or "Applying 2 patches..."

---

## Component File Map

```
src/components/
├── layout/
│   ├── Header.tsx
│   ├── LeftPanel.tsx
│   └── RightPanel.tsx
├── canvas/
│   ├── DashboardFromSchema.tsx     # bridge: schema → dashcraft
│   ├── WidgetRenderer.tsx          # type → @repo/ui component
│   ├── CanvasArea.tsx              # scroll container + empty state
│   └── EditModeButton.tsx          # calls useDashboard().toggleEditMode()
├── prompt/
│   ├── PromptBar.tsx               # fixed bottom bar
│   ├── OllamaStatus.tsx            # green/red dot
│   └── StreamingStatus.tsx         # "generating widget 3 of 5"
├── versions/
│   ├── VersionSidebar.tsx          # list of versions
│   ├── VersionTab.tsx              # single tab in header
│   └── VersionList.tsx             # sidebar list item
├── panels/
│   ├── JSONPanel.tsx               # Monaco editor
│   └── ExportPanel.tsx             # shiki + export actions
└── ui/
    └── EmptyCanvas.tsx             # empty state illustration
```

---

## Interaction States

### State Machine (simplified)

```
IDLE (no schema)
  → user types prompt → GENERATING (create mode)
  → LLM streams JSON → RENDERING
  → schema valid → READY (has schema)

READY
  → user edits canvas (drag/resize) → READY (dashcraft handles silently)
  → user edits JSON in Monaco → SYNCING → READY
  → user types prompt → GENERATING (diff mode)
  → LLM streams patches → PATCHING → READY
  → user switches version → READY (new schema loaded)
  → user clicks Export → EXPORTING
```

---

## Tailwind Classes & Design Tokens

Use `@repo/tailwind-config` shared tokens throughout:

```
bg-background          → main canvas background
bg-card                → panel backgrounds
border-border          → panel dividers
text-foreground        → primary text
text-muted-foreground  → secondary/label text
ring-ring              → focus rings
```

The builder should respect dark mode automatically via `@repo/tailwind-config`'s `.dark` class setup.

---

## react-resizable-panels Setup

```tsx
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

<PanelGroup direction="horizontal" className="h-full">
  <Panel defaultSize={18} minSize={0} collapsible>
    <LeftPanel />
  </Panel>
  <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />
  <Panel minSize={40}>
    <CanvasArea />
  </Panel>
  <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />
  <Panel defaultSize={28} minSize={0} collapsible>
    <RightPanel />
  </Panel>
</PanelGroup>
```
