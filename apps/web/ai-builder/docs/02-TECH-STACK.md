# Tech Stack

---

## Runtime Environment

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 19.2.4 | Matches monorepo |
| Language | TypeScript ~5.9.3 strict | Matches monorepo |
| Bundler | Vite 8.0.1 | Matches monorepo |
| Styling | Tailwind CSS 4.1.5 | Matches monorepo; use `@repo/tailwind-config` shared tokens |
| Package manager | pnpm@8.15.6 | Workspace package |

---

## AI / LLM Layer

| Concern | Choice | Reason |
|---|---|---|
| Local LLM runtime | **Ollama** | Runs on macOS, free, no API key |
| Model | **llama3.2:3b** | Only viable on 8GB RAM MacBook Air (~2GB loaded) |
| LLM client | **`openai` npm package** | Ollama exposes OpenAI-compatible API at `localhost:11434/v1` |
| Streaming | `stream: true` via openai SDK | Real-time token streaming as JSON builds |

### Ollama setup (once, before dev)
```bash
brew install ollama
ollama pull llama3.2:3b
ollama serve          # starts on localhost:11434
```

### llama3.2:3b constraints to keep in mind
- Context window: 128k tokens (fine for our schemas)
- JSON mode: use `response_format: { type: "json_object" }` to force valid JSON output
- Temperature: `0.1` for schema generation (deterministic), `0.3` for diff patches
- Max tokens: set `max_tokens: 2048` to prevent runaway generation
- It will occasionally hallucinate component types — the `WidgetRenderer` must have a safe fallback

---

## Canvas Engine

| Concern | Choice | Reason |
|---|---|---|
| Dashboard canvas | **`@repo/dashcraft`** | Already in monorepo; drag/resize/delete/settings/persistence all built-in |
| Drag/drop | via dashcraft (`@dnd-kit/core`) | No separate install needed |
| Resize | via dashcraft (`re-resizable`) | No separate install needed |
| Widget settings | via dashcraft (`SettingsPanel`) | Color, opacity, polling, custom fields — all built |
| State (canvas) | via dashcraft (`zustand` store) | `useDashboardStore` owns all widget state |

---

## Builder Shell

| Concern | Choice | Reason |
|---|---|---|
| Panel layout | **`react-resizable-panels`** | Collapsible left/right panels, resize handles |
| Builder state | **`zustand`** (already in dashcraft deps) | Version history, prompts, streaming state |
| JSON editor | **`@monaco-editor/react`** | VS Code quality, JSON schema validation, diff markers |
| Code syntax highlight | **`shiki`** | Static syntax highlighting for export preview (lighter than Monaco) |
| Icons | `lucide-react` (via `@repo/ui`) | Already available |

---

## Export

| Concern | Choice | Reason |
|---|---|---|
| React code gen | **MCP tools** (`tools/` in monorepo) | AI-assisted codegen, picks right `@repo/ui` imports |
| JSON export | `JSON.stringify` + `Blob` download | Trivial, no library needed |
| Code preview | `shiki` | Lightweight, accurate highlighting |

---

## NOT Used (and why)

| Library | Rejected because |
|---|---|
| `react-dnd` | Dashcraft already uses @dnd-kit |
| `framer-motion` | Dashcraft already includes it |
| `@tanstack/react-query` | No server fetching in v1 |
| `react-beautiful-dnd` | Archived, superseded by @dnd-kit |
| Redux Toolkit | Overkill; zustand is sufficient |
| `Jotai` | No advantage over zustand for this use case |
| `react-grid-layout` | Dashcraft's layout system is sufficient |
| Custom canvas engine | Dashcraft eliminates the need entirely |

---

## Full Dependency List for package.json

### dependencies
```json
{
  "@repo/dashcraft": "workspace:*",
  "@repo/ui": "workspace:*",
  "@repo/router": "workspace:^",
  "openai": "^4.x",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-resizable-panels": "^2.x",
  "zustand": "^5.0.0",
  "@monaco-editor/react": "^4.x",
  "shiki": "^1.x"
}
```

### devDependencies
```json
{
  "@repo/eslint-config": "workspace:*",
  "@repo/tailwind-config": "workspace:*",
  "@repo/typescript-config": "workspace:*",
  "@tailwindcss/postcss": "^4.1.5",
  "@types/node": "^24.x",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^6.0.1",
  "eslint": "^9.39.4",
  "postcss": "^8.5.3",
  "tailwindcss": "^4.1.5",
  "typescript": "~5.9.3",
  "vite": "^8.0.1"
}
```
