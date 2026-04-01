---
name: Monorepo Structure
description: Key structural facts about the Turborepo monorepo — packages, apps, tooling, and naming quirks
type: project
---

## Root

- Name: `with-vite` (root package.json)
- Package manager: `pnpm@8.15.6`
- Turbo: `^2.8.20`
- pnpm lockfile version: 6.0
- pnpm-workspace.yaml includes: `apps/*`, `apps/web/*`, `packages/*`, `tools/*`

## Apps (apps/web/)

| Directory | package.json name | Bundler | Port | Notable deps |
|---|---|---|---|---|
| web-app-1 | web-app-1 | Vite 8 | 5173 | @repo/ui, react 19 |
| web-app-2 | web-app-2 | Vite 8 | 5173 | @repo/dashcraft, nivo, recharts, react 19 |
| web-app-3 | web-app-3 | Vite 8 | 5173 | @repo/present, react 19 |
| web-app-4 | web-app-4 | CRA (react-scripts 5) | 3000 | react 18, no workspace deps |
| 3d-portfolio | three-d-portfolio-2025 | Vite 6.2 | 5173 | three.js, @react-three/fiber, gsap |
| award-winning-website | award-winning-website | Vite 6 | 5173 | gsap, react-icons |

**Critical:** 3d-portfolio's package name is `three-d-portfolio-2025` not `3d-portfolio`. Always use the package.json `name` field for turbo --filter.

## Packages (packages/)

| Directory | package name | Build tool | Used by |
|---|---|---|---|
| ui | @repo/ui | tsc (+ tailwindcss styles) | web-app-1, web-app-2, web-app-3 |
| dashcraft | @repo/dashcraft | tsc | web-app-2 |
| present | @repo/present | tsup | web-app-3 |
| utils | @repo/utils | tsup | (utilities) |
| eslint-config | @repo/eslint-config | (config only) | all apps |
| tailwind-config | @repo/tailwind-config | (config only) | most apps |
| typescript-config | @repo/typescript-config | (config only) | all apps |

## Tools

- `tools/*` = 30+ MCP development tools
- NEVER dockerized
- Must remain local-only
- Registered as pnpm workspace packages (needed for workspace resolution)

## turbo.json Key Config

- `build.outputs: ["dist/**"]` — NOTE: web-app-4 (CRA) outputs to `build/` not `dist/`, turbo won't cache it but build still works
- `build.dependsOn: ["^build"]` — workspace packages are built before consuming apps
- `dev.cache: false, persistent: true`

**Why:** **How to apply:** Always double-check package names before using turbo --filter or turbo prune. The directory name ≠ package name for 3d-portfolio.