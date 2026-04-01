---
name: Docker Setup State
description: Complete Docker setup for the Turborepo monorepo — what's working, what's not, and exactly why
type: project
---

## Architecture

Turborepo monorepo at `/Users/nishantchaudhary/Desktop/my-turborepo`
- Package manager: `pnpm@8.15.6`
- Turbo: `^2.8.20`
- 6 apps in `apps/web/`: web-app-1, web-app-2, web-app-3, web-app-4, 3d-portfolio, award-winning-website
- packages/ui, dashcraft, present, utils, eslint-config, tailwind-config, typescript-config
- tools/ (30+ MCP tools) — NEVER dockerized

## Correct Package Names for turbo prune

| Directory | package.json "name" |
|---|---|
| apps/web/web-app-1 | web-app-1 |
| apps/web/web-app-2 | web-app-2 |
| apps/web/web-app-3 | web-app-3 |
| apps/web/web-app-4 | web-app-4 |
| apps/web/3d-portfolio | three-d-portfolio-2025 |
| apps/web/award-winning-website | award-winning-website |

## Dockerfile Pattern (all apps)

4-stage build: `base → pruner → installer → builder → runner (nginx:alpine)`
- Base: `node:20-alpine` + `libc6-compat` + `pnpm@8.15.6` via corepack + `turbo@2` globally
- Pruner: `turbo prune <name> --docker` → produces `out/json/` and `out/full/`
- Installer: `COPY out/json/` + `pnpm install --frozen-lockfile` with BuildKit cache mount
- Builder: `COPY out/full/` + `pnpm turbo build --filter=<name>`
- Runner: `nginx:alpine` + copy `dist/` only

**PNPM_HOME must be set or globally installed turbo won't be on PATH:**
```
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
```

## web-app-4 Special Case (Create React App)

- Uses `react-scripts@5.0.1`, NOT Vite
- NO `dev` script — uses `start` script
- Port: 3000 (NOT 5173)
- Docker: `ENV HOST=0.0.0.0` + `CMD ["pnpm", "start"]` + `EXPOSE 3000`
- Production output: `build/` NOT `dist/`
- docker-compose port: `3004:3000`
- Add `ENV CI=false` in builder stage to prevent warnings-as-errors

## Dev compose vs Prod compose

- `docker-compose.yml` = dev mode (Vite HMR), mounts `src/` and `index.html` volumes
- `docker-compose.prod.yml` = production (nginx:alpine, port 80)
- DO NOT share `node_modules` volumes across services — pnpm virtual store symlinks break

## Production Image Sizes (actual measurements, 2026-03-31)

| App | Prod Image Size | Status |
|---|---|---|
| web-app-4 (CRA) | 92.5 MB | ✅ Works |
| 3d-portfolio | 118 MB | ✅ Works |
| award-winning-website | 197 MB | ✅ Works (after fix) |
| web-app-1 | blocked | ❌ @repo/ui TS errors |
| web-app-2 | blocked | ❌ @repo/ui TS errors |
| web-app-3 | blocked | ❌ OOM + @repo/present |

All well under 150–200 MB target (vs old dev images at 800MB–1.3GB).

**Why:** old dev images = entire node:20-slim + all devDeps. New prod = nginx:alpine (~11MB) + dist only.

## Fixes Applied in This Session

1. Added `ENV PNPM_HOME` + `ENV PATH` to all 9 Dockerfiles missing it
2. Fixed `3d-portfolio` Dockerfiles: `turbo prune 3d-portfolio` → `turbo prune three-d-portfolio-2025`
3. Fixed `web-app-4` dev: added `ENV HOST=0.0.0.0`, changed CMD to `pnpm start`, changed EXPOSE to 3000
4. Fixed `web-app-4` prod: copy from `build/` not `dist/`
5. Fixed docker-compose port for web-app-4: `3004:5173` → `3004:3000`
6. Removed shared `root-node-modules` and per-app `node_modules` volumes from dev compose — pnpm virtual store symlinks can't be shared across container boundaries
7. Switched all Dockerfiles from `node:20-slim` to `node:20-alpine` (saves ~150 MB per intermediate layer)
8. Added `RUN apk add --no-cache libc6-compat` to all alpine Dockerfiles
9. Added `# syntax=docker/dockerfile:1` + BuildKit cache mounts for pnpm store
10. Enhanced nginx: gzip, immutable cache headers for hashed assets, security headers
11. Added `docker-compose.prod.yml`
12. Fixed award-winning-website: `@types/node: ^22` → `^24` (dual vite instance type conflict)
13. Bumped `@vitejs/plugin-react: ^4.3.3` → `^4.3.4` in award-winning-website

## Open Issues (code-level, not Docker)

### web-app-1, web-app-2, web-app-3 prod build fails
`pnpm turbo build --filter=web-app-X` → builds @repo/ui first → @repo/ui tsc fails
Root cause: `packages/ui` has dozens of unused imports (TS6133 `noUnusedLocals: true`)
Files affected: AspectRatio, Badge, Calendar, ContextMenu, Dialog, Drawer, etc.
Fix needed: remove unused imports in packages/ui OR set `noUnusedLocals: false` in @repo/ui tsconfig

### web-app-3 prod OOM during build
`@repo/present` uses `tsup` which consumes ~1.5GB RAM during build
Docker Desktop only has 3.828 GB total memory — building 2+ apps in parallel triggers OOM
Fix: increase Docker Desktop memory to 8GB+ OR build web-app-3 alone: `docker compose -f docker-compose.prod.yml build web-app-3`

**Why:** **How to apply:** When building prod images for web-app-1/2/3, fix @repo/ui TypeScript errors first, then build one at a time if OOM occurs.