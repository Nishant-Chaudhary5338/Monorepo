# Monorepo

A production-grade Turborepo containing 15 apps (13 web frontends + 2 servers), 9 shared packages, and 30 custom MCP dev-tool servers — all wired together with strict TypeScript, a shared design system, and a unified build pipeline.

**Stack:** pnpm 8 · Turbo 2.x · React 19 · TypeScript strict · ESM-first · Vite · tsup

---

## Architecture

```
apps/
  web/            13 frontend apps (portfolios, AI tools, dashboards, decks, hotel site)
  jobs-bot/       Agentic job-application bot — Claude + Playwright + SQLite
  mcp-demo-server/ Express REST API proxy for MCP tool invocation
packages/         9 shared workspace packages (UI system, libraries, configs)
tools/            30 custom MCP servers for automated component and code tooling
```

**Key architectural decisions:**

- All reusable UI lives in `@repo/ui` — 50+ Radix + Tailwind components, Storybook on port 6006. Apps consume it via workspace refs, never duplicating.
- All shared logic lives in `@repo/utils` — API helpers, validation, hooks, auth, date, storage.
- Libraries (`@repo/dashcraft`, `@repo/present`) use `tsup` → ESM `dist/`. Apps use Vite. Each layer has one job.
- TypeScript strict mode across every package. No `any`. Zod at every system boundary.
- The 30 MCP servers automate the repetitive layer — scaffolding, linting, render profiling, test generation — so engineering time goes to product work.

---

## Applications

| App                       | Purpose                               | Key tech                                                            |
| ------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| `ai-builder`              | Prompt → live dashboard UI generator  | OpenAI SDK · Monaco Editor · JSON diff-patching · `@repo/dashcraft` |
| `jobs-bot`                | Agentic job-application pipeline      | Claude (Anthropic) · Playwright · SQLite · 4 CV templates           |
| `nishant-portfolio`       | Personal 3D portfolio                 | Three.js · GSAP · postprocessing                                    |
| `nidhi-portfolio`         | 3D portfolio                          | Three.js/Fiber · GSAP · Tailwind                                    |
| `nivanta-website`         | Luxury hotel website                  | Framer Motion · React Hook Form · Zod · Resend                      |
| `award-winning-website`   | GSAP animation showcase               | GSAP · React 19                                                     |
| `mcp-demo`                | MCP tool showcase frontend            | Zustand · Vite                                                      |
| `mcp-demo-server`         | REST API proxy for MCP tools          | Express · TypeScript                                                |
| `mcp-talk`                | MCP explainer slide deck              | `@repo/present` · Vite                                              |
| `hls-monitor`             | Multi-stream HLS/HEVC monitor         | `@repo/hls-player` · Zustand · Playwright                           |
| `manu-portfolio`          | 3D portfolio                          | Three.js · GSAP                                                     |
| `briar-frontend`          | Enterprise data management            | Azure MSAL · CoreUI · Excel export                                  |
| `safex-lms`               | Learning management system            | Firebase · Google Auth · YouTube API                                |
| `safex-calendar`          | Interactive calendar                  | Audio player · Tailwind                                             |
| `web-app-1` / `-2` / `-3` | Routing / charts / presentation demos | React Router v7 · Nivo · `@repo/present`                            |
| `web-app-4`               | Legacy CRA e-commerce (a11y test bed) | React 18 · Create React App                                         |

---

## Shared Packages

| Package                   | What it provides                                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `@repo/ui`                | 50+ Radix + Tailwind components — Button, Dialog, Table, Form, and more. Storybook docs included.                            |
| `@repo/dashcraft`         | Headless React dashboard library. Composable cards, widgets, HTTP client, Zustand store. Zero opinion on styling.            |
| `@repo/present`           | React presentation library with Prezi-style spatial navigation, fullscreen mode, gestures, themes, and animation primitives. |
| `@repo/hls-player`        | Headless HLS/HEVC video-player library — adaptive tiers, segment logging, and playback analytics.                            |
| `@repo/utils`             | API helpers, form validation, auth utilities, date formatting, pagination, local storage hooks.                              |
| `@repo/router`            | Config-driven React Router v7 wrapper. Declare routes as data, not JSX.                                                      |
| `@repo/tailwind-config`   | Shared Tailwind CSS config and PostCSS setup — one source of truth for design tokens.                                        |
| `@repo/typescript-config` | Shared `tsconfig` base templates — strict, bundler-optimised, and ESM-first.                                                 |
| `@repo/eslint-config`     | Shared ESLint + TypeScript + Prettier rules across all apps and packages.                                                    |

---

## MCP Dev-Tool Servers (`/tools`)

30 Model Context Protocol servers that automate the development workflow. Each server exposes tools Claude Code or any MCP client can invoke.

**Component development**
`component-factory` — scaffold a new `@repo/ui` component from a description  
`component-reviewer` — audit TypeScript errors, test coverage, and accessibility  
`component-improver` — add variants, Storybook stories, and tests to an existing component  
`storybook-generator` — generate Storybook stories for any component

**Code quality**
`typescript-enforcer` — scan and fix TypeScript violations across a path  
`accessibility-checker` — WCAG compliance audit  
`generate-tests` — generate Vitest + RTL unit and integration tests  
`fix-failing-tests` — diagnose and repair broken test suites  
`render-analyzer` — React render performance profiling  
`lighthouse-runner` — Web Vitals and Lighthouse audit  
`code-modernizer` — convert JS → TS, generate types, optimise state

**Monorepo management**
`monorepo-manager` — workspace operations and dependency graph visualisation  
`dep-auditor` — vulnerability scanning and dependency analysis  
`refactor-executor` — execute planned refactors across the codebase

**WebdriverIO**
`wdio-scaffolder` — generate WebdriverIO + TypeScript projects, page objects, specs, and configs  
`wdio-analyzer` — score selector robustness, detect anti-patterns, audit POM coverage  
`wdio-runner` — live browser automation: screenshots, selector extraction, smoke tests, Web Vitals

Build a tool before invoking it:

```sh
pnpm --filter <tool-name> build
```

---

## Quick Start

```sh
pnpm install

pnpm dev                        # start all apps in parallel
pnpm build                      # build all packages + apps

pnpm --filter ai-builder dev    # start one app
pnpm --filter @repo/ui dev      # start one package (Storybook)
```

> `--filter` uses the `name` field in `package.json`, not the directory path.

| Command        | What it does                     |
| -------------- | -------------------------------- |
| `pnpm format`  | Prettier across all TS/TSX/MD    |
| `pnpm scan`    | Run all component analysis tools |
| `pnpm scan:ui` | Scan `@repo/ui` components only  |
