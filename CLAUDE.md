# Nishant's Turborepo

pnpm 8.15.6 · Turbo 2.x · TypeScript strict · ESM-first

## Quick Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start all apps in parallel |
| `pnpm build` | Build all packages + apps |
| `pnpm --filter <name> dev` | Start one app or package |
| `pnpm --filter <name> build` | Build one package |
| `pnpm format` | Prettier across all TS/TSX/MD |
| `pnpm scan` | Run all component analysis tools |
| `pnpm scan:ui` | Scan @repo/ui components only |

> Filter uses the `name` field in `package.json`, not the directory path.

---

## Directory Structure

```
apps/
  jobs-bot/           Agentic job application bot (Claude + Playwright + SQLite)
  mcp-demo-server/    Express REST API server for MCP tool demos (port 3001)
  web/                12 frontend apps (see Apps table below)
packages/             8 shared workspace packages
tools/                28 MCP servers + CLI wrappers
memory.json           Persistent knowledge graph (shared with Cline)
```

---

## Apps

| App | Port | Framework | Purpose |
|---|---|---|---|
| `web-app-1` | 5173 | React 19 + RR7 | React Router v7 demo, React Hook Form, Zod |
| `web-app-2` | 5173 | React 19 + Vite | Charts (Nivo, Recharts), dashcraft library |
| `web-app-3` | 5173 | React 19 + Vite | Framer Motion animations, present library |
| `web-app-4` | 5173 | React 18 + CRA | Legacy CRA app — do not migrate without discussion |
| `ai-builder` | 5174 | React 19 + Vite | Prompt → UI builder, Monaco Editor, OpenAI SDK |
| `mcp-demo` | 5175 | React 19 + Vite | MCP tool showcase frontend, Zustand state |
| `nidhi-portfolio` | 5180 | React 19 + Vite | 3D portfolio, Three.js/Fiber, GSAP, Tailwind |
| `nishant-portfolio` | 5173 | React 19 + Vite | 3D portfolio, Three.js, GSAP, postprocessing |
| `award-winning-website` | 5173 | React 19 + Vite | GSAP animation showcase |
| `briar-frontend` | 5173 | React 18 + Vite | Azure MSAL auth, CoreUI, data tables, Excel export |
| `safex-calendar` | 5173 | React 18 + Vite | Audio player, lazy image loading, Tailwind |
| `safex-lms` | 5173 | React 18 + Vite | Firebase, Google auth, YouTube embeds, scraping |
| `jobs-bot` | — | Node + Playwright | Claude vision + form filling, 4 CV variants, SQLite |
| `mcp-demo-server` | 3001 | Express + TS | REST proxy for all MCP tool servers |

---

## Packages

| Package | Import | Purpose |
|---|---|---|
| `@repo/ui` | `@repo/ui` | 50+ Radix + Tailwind components · Storybook on port 6006 |
| `@repo/utils` | `@repo/utils` | API, validation, hooks, search, pagination, auth, date, storage |
| `@repo/dashcraft` | `@repo/dashcraft` | Headless dashboard — cards, widgets, HTTP client, store |
| `@repo/present` | `@repo/present` | Presentation library — core, state, animation, gestures, themes |
| `@repo/router` | `@repo/router` | Config-driven React Router v7 wrapper |
| `@repo/tailwind-config` | (CSS import) | Shared Tailwind CSS config + PostCSS setup |
| `@repo/typescript-config` | (tsconfig extends) | Shared tsconfig base templates |
| `@repo/eslint-config` | (eslint extends) | Shared ESLint + TypeScript + Prettier rules |

---

## MCP Tools in /tools

### Component Development

| Tool | When to reach for it |
|---|---|
| `component-factory` | Scaffold a new @repo/ui component from scratch |
| `component-fixer` | Fix broken imports, resolve missing dependencies |
| `component-improver` | Add variants, Storybook stories, comprehensive tests |
| `component-reviewer` | Audit TypeScript errors, test coverage gaps, a11y |
| `storybook-generator` | Auto-generate Storybook stories for existing components |

### Code Quality & Modernisation

| Tool | When to reach for it |
|---|---|
| `code-modernizer` | Convert JS → TS, generate types, optimise state |
| `typescript-enforcer` | Scan and enforce TypeScript rules across a path |
| `accessibility-checker` | WCAG compliance audit |
| `generate-tests` | Auto-generate Vitest unit + integration tests |
| `fix-failing-tests` | Debug and repair broken test suites |
| `test-gap-analyzer` | Find untested code paths |
| `render-analyzer` | React render performance profiling |
| `performance-audit` | Runtime performance analysis |
| `lighthouse-runner` | Web Vitals / Lighthouse audit |
| `enforce-design-tokens` | CSS design token linting |
| `quality-pipeline` | Integrated QA — runs multiple tools in sequence |
| `analyze-ui-design` | Visual design analysis |

### Monorepo Management

| Tool | When to reach for it |
|---|---|
| `monorepo-manager` | Workspace operations, dependency graph visualisation |
| `dep-auditor` | Vulnerability scanning, dependency analysis |
| `legacy-analyzer` | Identify tech debt and deprecated patterns |
| `refactor-executor` | Execute a planned refactor across the codebase |
| `config-manager` | Manage workspace-level configs |

### Utilities

| Tool | When to reach for it |
|---|---|
| `json-viewer` | Visualise JSON data in browser |
| `docs` | Generate documentation for a package or module |
| `utils-scaffolder` | Scaffold new utility functions in @repo/utils |
| `mcp-tool-improviser` | Meta — analyse and improve other MCP tools |

---

## Architecture Patterns

- **Workspace refs** — `"@repo/ui": "workspace:*"` — always pinned to local, never published
- **Filter syntax** — `pnpm --filter <package-name>` — use the exact `name` in package.json, not the directory
- **Package builds** — Libraries use `tsup` outputting ESM to `dist/`. Apps use Vite.
- **MCP servers** — Each tool in `tools/` compiles to `build/`. Run `pnpm --filter <tool-name> build` before invoking via MCP.
- **Shared UI** — All reusable components belong in `@repo/ui`. Never duplicate across apps.
- **Shared logic** — All reusable helpers belong in `@repo/utils`. Never copy-paste across apps.
- **Shared configs** — All apps extend `@repo/eslint-config`, `@repo/typescript-config`, `@repo/tailwind-config`.

---

## Memory MCP

`memory.json` at repo root is a persistent knowledge graph shared between Claude Code and Cline.

```
search_nodes      — search before starting a feature (find existing context)
open_nodes        — read specific named entities
create_entities   — document new components, tools, decisions
add_observations  — append new facts to existing entities
create_relations  — link entities (e.g. "web-app-1 uses @repo/router")
```

Workflow: `search_nodes` before starting → work → `add_observations` or `create_entities` after finishing.

---

## Skills

| Task | Invoke |
|---|---|
| Build a UI page / component / portfolio section | `/frontend-design` |
| Test a web app with Playwright | `/webapp-testing` |
| Work on jobs-bot or any Anthropic SDK feature | `/claude-api` |
| Build or improve a tool in /tools | `/mcp-builder` |
| Create a new Claude Code skill for this project | `/skill-creator` |
| Build an HTML prototype or demo artifact | `/web-artifacts-builder` |
| Style a portfolio / dashboard with a cohesive theme | `/theme-factory` |
| GSAP / Three.js / generative or algorithmic animation | `/algorithmic-art` |
| Export a design asset as PNG or PDF | `/canvas-design` |
| Write a package README or tool documentation | `/doc-coauthoring` |

---

## Engineering Standards

### Size Limits
- Component files: ≤ 300 lines — split into sub-components if larger
- Functions and hooks: ≤ 50 lines — extract helpers when longer
- Files: ≤ 200 lines preferred · 400 hard limit
- One component or one hook per file

### TypeScript
- Strict mode always — never loosen tsconfig settings
- No `any` — use `unknown` + type narrowing
- Explicit return types on all exported functions
- Zod at every system boundary (API responses, form input, env vars)
- Type aliases over interfaces for union/intersection types
- Co-locate types with the code that uses them

### Tailwind CSS
- Class order: display → position → size → spacing → color → typography → border → shadow → state → animation
- No arbitrary values (`[347px]`, `[#abc]`) — extend `tailwind.config` instead
- Use `@repo/tailwind-config` tokens only — never hardcode colors or spacing values
- Extract className strings with > 5 classes to a `cn()` constant

### Clean Code
- Name functions and variables by what they return or do — not how they work
- Zero comments that restate the code — comment only hidden constraints or non-obvious WHY
- No committed TODO/FIXME — fix it now or track it externally
- Early returns over nested conditionals — max nesting depth: 3
- Named constants over magic numbers
- Flat data structures over deeply nested objects

### SOLID
- **S** — one component / function / module does exactly one thing
- **O** — extend via props or composition; never modify shared packages for a single use-case
- **L** — components and hooks substitutable by others with the same interface
- **I** — narrow prop interfaces; no "god props" objects with 15+ fields
- **D** — accept dependencies via props / context / injection; no module-level singletons

### DRY
- Repeated UI (≥ 2 uses) → extract to `@repo/ui`
- Repeated logic (≥ 2 uses) → extract to `@repo/utils`
- Repeated types → extract to a shared types file
- Never copy-paste between apps — always make it a package

### Modularity
- Co-locate: `Name.tsx` · `Name.test.tsx` · `Name.types.ts` in the same folder
- Each package and tool exposes a single `index.ts` barrel export
- Internal helpers prefixed `_` or kept in an `/internal/` subdirectory
- Circular imports are a design bug — fix the abstraction, never work around

### React Patterns
- Composition over prop drilling beyond 2 levels → Context or Zustand
- Custom hooks for stateful logic > 10 lines — extract from components
- `memo` / `useMemo` / `useCallback` only when a profiler confirms a problem
- List keys must be stable entity IDs — never array index
- No `useEffect` for derived state — compute inline or `useMemo`

### Docs
- No multi-line JSDoc blocks — one-line comment max, only when non-obvious
- Living docs = Storybook stories for `@repo/ui` components
- `README.md` at package level only — purpose, exports, one quick example, max 30 lines
- Architecture decisions → `memory.json`, not inline code comments

### Testing
- Test behaviour (what the user sees) — not implementation (internal state)
- Co-located test files: `Name.test.tsx` next to `Name.tsx`
- Vitest + React Testing Library — no Enzyme
- Mock only at system boundaries (fetch, localStorage) — never mock internal modules
- One scenario per `it` block — split rather than stacking multiple assertions
