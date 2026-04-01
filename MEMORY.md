# MEMORY.md — Project Context (Quick Reference)

## Monorepo Structure
- Turborepo at `/Users/nishantchaudhary/Desktop/my-turborepo`
- Package manager: `pnpm@8.15.6`, Turbo: `^2.8.20`
- Root name: `with-vite`
- 6 apps in `apps/web/`, 7 packages in `packages/`, 30+ MCP tools in `tools/`
- `pnpm-workspace.yaml`: `apps/*`, `apps/web/*`, `packages/*`, `tools/*`

## Critical Naming Gotcha
- `apps/web/3d-portfolio` → package name is `three-d-portfolio-2025` (NOT `3d-portfolio`)
- Always use `package.json` `name` field for `turbo --filter` and `turbo prune`

## Docker Setup (prod images working)
- 4-stage Dockerfile: base → pruner → installer → builder → runner (nginx:alpine)
- 3 working prod images: web-app-4 (92.5 MB), 3d-portfolio (118 MB), award-winning-website (197 MB)
- Dev compose: `docker-compose.yml` (Vite HMR), Prod compose: `docker-compose.prod.yml` (nginx:alpine)
- All Dockerfiles use `node:20-alpine` + `libc6-compat` + BuildKit cache mounts
- PNPM_HOME must be set before `pnpm add -g turbo`

## Docker Patterns (lessons learned)
- NEVER share `node_modules` volumes across services — pnpm virtual store symlinks break
- `@types/node` must be aligned across all apps/packages (standardize to `^24.x.x`)
- `node:20-alpine` always needs `libc6-compat`

## Remaining Code Issues (not Docker)

### web-app-1, web-app-2, web-app-3 prod build fails
- `packages/ui` has dozens of unused imports (TS6133, `noUnusedLocals: true`)
- Files affected: AspectRatio, Badge, Calendar, ContextMenu, Dialog, Drawer, etc.
- Fix: remove unused imports in `packages/ui/components/` OR set `noUnusedLocals: false` in `packages/ui/tsconfig.json`

### web-app-3 OOM during build
- `@repo/present` uses `tsup` which consumes ~1.5 GB RAM
- Docker Desktop at 3.828 GB total — parallel builds trigger OOM
- Fix: increase Docker Desktop memory to 8 GB+ OR build web-app-3 alone

## Key Files
- Docker configs: `docker-compose.yml`, `docker-compose.prod.yml`
- Project docs: `project_docker_setup.md`, `project_monorepo_structure.md`, `feedback_docker_patterns.md`
- Rules: `.clinerules`