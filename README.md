# Nishant's Turborepo

Personal monorepo — pnpm 8.15.6 · Turbo 2.x · TypeScript strict · ESM-first

## Quick Start

```sh
pnpm install
pnpm dev          # start all apps in parallel
pnpm build        # build all packages + apps
```

Filter to a single app or package:

```sh
pnpm --filter <name> dev
pnpm --filter <name> build
```

> Filter uses the `name` field in `package.json`, not the directory path.

---

## Apps

| App | Package name | Port | Purpose |
|---|---|---|---|
| `nishant-portfolio` | `three-d-portfolio-2025` | 5173 | Personal portfolio — 3D (Three.js/Fiber), GSAP, editorial design |
| `nidhi-portfolio` | `nidhi-portfolio` | 5180 | Nidhi's portfolio — Playfair Display, alternating case-study rows |
| `ai-builder` | `ai-builder` | 5174 | Prompt → UI builder, Monaco Editor, OpenAI SDK |
| `mcp-demo` | `mcp-demo` | 5175 | MCP tool showcase frontend, Zustand state |
| `mcp-demo-server` | `mcp-demo-server` | 3001 | Express REST API proxy for MCP tools |
| `web-app-1` | `web-app-1` | 5173 | React Router v7 demo, React Hook Form, Zod |
| `web-app-2` | `web-app-2` | 5173 | Charts (Nivo, Recharts), dashcraft library |
| `web-app-3` | `web-app-3` | 5173 | Framer Motion animations, present library |
| `web-app-4` | `web-app-4` | 5173 | Legacy CRA app — do not migrate without discussion |
| `award-winning-website` | `award-winning-website` | 5173 | GSAP animation showcase |
| `briar-frontend` | `briar-frontend` | 5173 | Azure MSAL auth, CoreUI, data tables |
| `safex-calendar` | `safex-calendar` | 5173 | Audio player, Tailwind |
| `safex-lms` | `safex-lms` | 5173 | Firebase, Google auth, YouTube embeds |
| `jobs-bot` | `jobs-bot` | — | Claude vision + Playwright, agentic job applications |

---

## Packages

| Package | Import alias | Purpose |
|---|---|---|
| `@repo/ui` | `@repo/ui` | 50+ Radix + Tailwind components · Storybook port 6006 |
| `@repo/utils` | `@repo/utils` | API, validation, hooks, auth, date, storage helpers |
| `@repo/dashcraft` | `@repo/dashcraft` | Headless dashboard — cards, widgets, HTTP client, store |
| `@repo/present` | `@repo/present` | Presentation library — core, state, animation, gestures |
| `@repo/router` | `@repo/router` | Config-driven React Router v7 wrapper |
| `@repo/tailwind-config` | (CSS import) | Shared Tailwind CSS config + PostCSS setup |
| `@repo/typescript-config` | (tsconfig extends) | Shared tsconfig base templates |
| `@repo/eslint-config` | (eslint extends) | Shared ESLint + TypeScript + Prettier rules |

---

## MCP Tools (`/tools`)

28 Model Context Protocol servers for component development, code quality, and monorepo management.

**Component development:** `component-factory` · `component-fixer` · `component-improver` · `component-reviewer` · `storybook-generator`

**Code quality:** `code-modernizer` · `typescript-enforcer` · `accessibility-checker` · `generate-tests` · `fix-failing-tests` · `render-analyzer` · `performance-audit` · `lighthouse-runner` · `quality-pipeline`

**Monorepo:** `monorepo-manager` · `dep-auditor` · `legacy-analyzer` · `refactor-executor` · `config-manager`

**Utilities:** `json-viewer` · `docs` · `utils-scaffolder` · `mcp-tool-improviser`

Build a tool before invoking:

```sh
pnpm --filter <tool-name> build
```

---

## Architecture

- **Workspace refs** — `"@repo/ui": "workspace:*"` — always local, never published
- **Builds** — Libraries use `tsup` → ESM `dist/`. Apps use Vite.
- **Shared configs** — All apps extend `@repo/eslint-config`, `@repo/typescript-config`, `@repo/tailwind-config`
- **Memory** — `memory.json` at repo root is a shared knowledge graph used by Claude Code and Cline

---

## Tooling

| Command | What it does |
|---|---|
| `pnpm format` | Prettier across all TS/TSX/MD |
| `pnpm scan` | Run all component analysis tools |
| `pnpm scan:ui` | Scan `@repo/ui` components only |
