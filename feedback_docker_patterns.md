---
name: Docker + pnpm Monorepo Patterns
description: Lessons learned from debugging Docker setup for this pnpm Turborepo — what works and what breaks
type: feedback
---

## Don't share node_modules volumes across services in docker-compose

**Rule:** Never mount a single named volume at `/app/node_modules` when multiple services share the same compose file and each was built with its own pruned monorepo.

**Why:** pnpm uses a virtual store (`/app/node_modules/.pnpm/`) with symlinks. App-level node_modules contain symlinks into the root `.pnpm` store. When you mount one named volume at `/app/node_modules` across 6 services, the first container to initialize the volume "wins" — all others get incompatible modules. Even per-app volumes break because the symlinks inside point to paths covered by a different (shared) volume.

**How to apply:** Only mount source files (`src/`, `index.html`) for HMR in dev. Let node_modules stay inside the container image. Remove all `node_modules:` entries from docker-compose volumes.

---

## PNPM_HOME must be explicitly set before pnpm add -g

**Rule:** Always set `ENV PNPM_HOME="/root/.local/share/pnpm"` and `ENV PATH="$PNPM_HOME:$PATH"` BEFORE `RUN pnpm add -g turbo`.

**Why:** Without it, globally installed binaries are placed in `~/.local/share/pnpm` but that path is not on PATH. Running `turbo prune` in the next layer fails with "command not found".

**How to apply:** Place these two ENV lines immediately after corepack setup in every Dockerfile base stage.

---

## pnpm dual-instance type conflicts require @types/node version alignment

**Rule:** All apps/packages in the monorepo should use the same `@types/node` major version.

**Why:** pnpm creates separate virtual store entries per peer dependency combination. `vite@6.4.1_@types+node@24` and `vite@6.4.1_@types+node@22` are treated as different packages by TypeScript, making `Plugin<any>` from one incompatible with `Plugin<any>` from the other. This causes TS2769 "no overload matches" when a plugin (e.g., @vitejs/plugin-react) resolves to a different vite instance than the config file.

**How to apply:** Standardize `@types/node` across ALL apps/packages to `^24.x.x`. Check for mismatches when TypeScript type errors involve `"Two different types with this name exist, but they are unrelated"`.

---

## turbo prune uses package.json "name", not directory name

**Rule:** Always use the `name` field from `package.json` in `turbo prune <name>` and `--filter=<name>`, not the directory name.

**Why:** `turbo prune 3d-portfolio --docker` fails with "package not found" because the package name is `three-d-portfolio-2025`. Directory names and package names can differ.

**How to apply:** Before writing any Dockerfile, confirm the package name with `cat apps/web/<dir>/package.json | grep '"name"'`.

---

## node:20-alpine requires libc6-compat

**Rule:** Always add `RUN apk add --no-cache libc6-compat` when using `node:20-alpine` (or any alpine node image).

**Why:** Some Node.js native bindings and certain npm scripts require glibc. Alpine uses musl libc. `libc6-compat` provides the compatibility shim.

**How to apply:** Place it as the first RUN after FROM in the base stage. It's safe to include even if not strictly needed.