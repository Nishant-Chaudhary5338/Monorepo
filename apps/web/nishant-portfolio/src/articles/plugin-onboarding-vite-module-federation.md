---
title: "Rebuilding Samsung TV Plus's Frontend: Plugin-Based MFE with Vite Module Federation"
description: "My manager's brief: make it plugin-based, isolated — adding a plugin shouldn't touch what's running, and a feature change shouldn't trigger full regression. Here's the architecture that delivered it."
slug: "plugin-onboarding-vite-module-federation"
coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=jpg&q=80&w=1200&h=630&fit=crop"
coverImageAlt: "iMac monitor displaying a design system with component library panels open"
ogImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=jpg&q=80&w=1200&h=630&fit=crop"
date: "2026-05-03"
lastUpdated: "2026-05-03"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a frontend engineer at Samsung Electronics. He redesigned the Samsung TV Plus frontend architecture with plugin-based Vite Module Federation, delivering isolated deployments and provable regression scope for the platform team."
tags: ["micro-frontends", "vite", "module-federation", "samsung", "frontend-platform", "architecture"]
---

My manager's brief was specific. Samsung TV Plus needed a plugin-based frontend architecture — "Figma jaisa," he said. Like how Figma's plugin system works. Adding a new plugin should not affect anything already running. Adding a feature to an existing plugin should not force full regression testing on that plugin or any other. Those two requirements defined the entire design.

This is the architecture I built in response to that brief. It's a production frontend for Samsung TV Plus, not a side project. The constraints were real, the deployment targets were real, and the QA team's time was real. Every decision here traces back to one of those two requirements.

[INTERNAL-LINK: micro-frontend architecture patterns -> pillar article on React application architecture and scale]

---

> **Key Takeaways**
> - The shell loads plugins at runtime from a registry, so adding a new plugin never requires a shell rebuild or config change.
> - Content-MD5 with hash normalization proves exactly which routes changed after any build, satisfying the "no full regression" requirement directly.
> - The `singleton: true, requiredVersion: false, eager: true` trio for shared React is non-negotiable across all remotes.
> - Auth state crosses the federation boundary via `globalThis.__tvplus_auth`, not React context.
> - In 2024, 58% of JavaScript developers used zero monorepo tools ([State of JS 2024](https://2024.stateofjs.com/en-US/libraries/monorepo_tools/)) — most teams hit the runtime-splitting problem without a framework for it.

---

## 1. What the manager's requirements actually meant

The two requirements sound simple until you try to satisfy them honestly. "Adding a plugin shouldn't touch what's running" means the shell's build config cannot reference any specific plugin at build time — full stop. If the shell needs a rebuild every time a plugin is added, you've already violated the requirement.

"A feature change shouldn't trigger full regression" is harder. It's easy to say "our system is isolated." It's another thing to prove which files changed and which didn't, with evidence QA can act on. That proof is what I spent the most time on, and I'll cover it in full in section 4.

Both requirements pointed to the same architecture: a runtime plugin registry, independently built remotes, and a hash-based change-detection system. The specific tool was **Vite Module Federation**, using `@originjs/vite-plugin-federation` v1.4.1. The shell and all the plugin remotes were already on Vite + React 19. Switching the host build system to fit the MFE story would have been the tail wagging the dog.

In 2024, 58% of JavaScript developers reported using zero dedicated monorepo tools ([State of JavaScript Survey 2024](https://2024.stateofjs.com/en-US/libraries/monorepo_tools/)). Most teams hit the runtime-splitting problem without any shared framework for it. This architecture is the framework I built for TV Plus.

> **Citation Capsule:** In 2024, 58% of JS developers used zero dedicated monorepo tools ([State of JS Survey 2024](https://2024.stateofjs.com/en-US/libraries/monorepo_tools/)). A plugin-based MFE architecture with a runtime registry and content-MD5 change detection solves both isolation and regression scope — the two requirements that drove the Samsung TV Plus frontend redesign.

[INTERNAL-LINK: when to split a frontend monolith -> supporting article on monolith-to-MFE migration decisions]

---

## 2. Why Vite Module Federation?

[UNIQUE INSIGHT] The `@originjs/vite-plugin-federation` vs `@module-federation/vite` question comes up immediately for any Vite-based MFE. In 2025, TypeScript became the top language on GitHub by contributor count, with 66% year-over-year growth ([GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)). Both libraries ship strong TypeScript types now. The operational maturity gap matters more than the TypeScript story.

Most production MFE deployments in 2024 and earlier defaulted to Webpack 5's Module Federation plugin. It's mature, well-documented, and battle-tested. If you're already on Webpack, you should probably stay there.

The TV Plus shell and all plugin remotes were already on Vite. Switching the host build to Webpack would have been a sidetrack. In Vite-land, two real options exist:

| Library | Status | Best for |
|---|---|---|
| `@originjs/vite-plugin-federation` | Community, mature, broad compat | Teams on Vite who need MF now |
| `@module-federation/vite` | Official, newer, better SSR story | Greenfield or teams who can wait for ecosystem catch-up |

I shipped on `@originjs/vite-plugin-federation` v1.4.1. At the time of that decision, the official `@module-federation/vite` package was still maturing — fewer production case studies, some integration friction with the Vite plugins already running. The origin.js package was the boring, debuggable choice. It still is for most teams not doing SSR.

> *If you're on Next.js App Router, the picture is different. `@module-federation/nextjs-mf` exists, but the host wiring is its own thing. The architecture below mostly translates; the build config doesn't.*

[INTERNAL-LINK: Webpack vs Vite build performance -> supporting article on migrating from Webpack to Vite]

---

## 3. The architecture: shell, registry, and plugin remotes

Three components, in plain English:

**The shell.** A Vite + React app running on port 3000. It owns auth, top-level routing, the design system, and user session. It knows nothing about specific plugins at build time. At startup, it fetches the plugin registry, then dynamically imports each plugin's `remoteEntry.js` on demand.

**Plugin remotes.** Four independently built apps — each a full Vite + React application with its own internal routing, data fetching, and state. In production they're mounted by the shell. In standalone dev they run fine on their own.

**The registry.** A JSON document listing live plugins, their `remoteEntry.js` URLs, required roles, and enabled/disabled state. This is the keystone of the whole architecture. The shell references nothing specific at build time — the registry is the entire source of truth for what exists and where it lives.

The request flow:

```
┌──────────────┐  1. fetch registry   ┌───────────────────┐
│    Shell     │ ──────────────────►  │  Registry          │
│   (host)     │                      │  (Express API dev, │
│    :3000     │ ◄── 2. plugin list ── │   static JSON prod)│
└──────┬───────┘                      └───────────────────┘
       │
       │ 3. dynamic import (on click / role check)
       ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Plugin A  │  │   Plugin B  │  │   Plugin C  │  │   Plugin D  │
│ remoteEntry │  │ remoteEntry │  │ remoteEntry │  │ remoteEntry │
│    :3001    │  │    :3002    │  │    :3003    │  │    :3004    │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

A user hits the shell. It fetches the registry, filters plugins by the user's role, and renders a card grid. When the user clicks a plugin card, the shell calls `__federation_method_setRemote` with that plugin's `remoteEntry.js` URL, initializes it, and mounts the exposed `App` component full-screen. The shell chrome disappears; the plugin takes over completely.

The shell never knows, at build time, that any specific plugin exists. That last sentence is the architecture. Everything else is plumbing.

### The shell's vite.config

```ts
// apps/shell/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'shell',
      remotes: {},  // starts empty — plugins registered at runtime, not build time
      shared: {
        react:             { singleton: true, requiredVersion: false, eager: true },
        'react-dom':       { singleton: true, requiredVersion: false, eager: true },
        'react/jsx-runtime': { singleton: true, requiredVersion: false, eager: true },
        '@repo/auth':      { singleton: true, requiredVersion: false, eager: true },
      },
    }),
  ],
  server:  { port: 3000, cors: true },
  preview: { port: 3000, cors: true },
  build: { target: 'esnext', minify: false, cssCodeSplit: false },
});
```

`remotes: {}` is intentional. The shell declares no remotes at build time. It calls `__federation_method_setRemote(id, { url, format: 'esm', from: 'vite' })` at runtime once it has the registry. This is what satisfies requirement one directly: adding a new plugin is a registry change, not a shell change.

### A plugin's vite.config

```ts
// apps/cms/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: 'http://localhost:3003/',  // must match where the plugin is served from
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'cms',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: {
        react:               { singleton: true, requiredVersion: false, eager: true },
        'react-dom':         { singleton: true, requiredVersion: false, eager: true },
        'react/jsx-runtime': { singleton: true, requiredVersion: false, eager: true },
        'react-router-dom':  { singleton: true, requiredVersion: false },
      },
    }),
  ],
  server:  { port: 3003, cors: true },
  preview: { port: 3003, cors: true },
  build: { target: 'esnext', minify: false, cssCodeSplit: false },
});
```

All four domain plugins follow this identical pattern. Each exposes exactly one entry point, `'./App': './src/App.tsx'`, which handles its own internal routing via `react-router-dom`. The shell never cares about a plugin's routes; it just mounts `App`.

### The registry

The registry is the only mutable piece in the system. In dev, the internal dev platform's Express server reads and writes `devtools/data/registry.json`. In production, the shell fetches its own static copy from `public/registry.json` as a fallback:

```typescript
// Shell registry loading — two-tier, no hard crash
fetch('http://localhost:5001/api/registry')
  .catch(() => fetch('/registry.json'))
  .then(r => r.json())
  .then((data: AppEntry[]) => setRegistry(data))
  .catch(err => console.error('Failed to load registry:', err));
```

```json
[
  {
    "id": "cms",
    "label": "Content Management System",
    "url": "http://localhost:3003/assets/remoteEntry.js",
    "requiredRoles": ["admin", "editor", "viewer"],
    "disabled": false
  }
]
```

The `requiredRoles` field is filtered on the client using the current user's role from `@repo/auth`:

```typescript
const visibleApps = registry.filter(app =>
  !app.disabled &&
  (!app.requiredRoles?.length || app.requiredRoles.includes(user.role))
);
```

Changing a plugin's URL in the registry instantly redirects the shell to a different build of that plugin. Zero downtime, no shell redeploy.

### The Auth Bridge

The `@repo/auth` package is declared `singleton: true` in the shell's shared config. In practice, React context trees don't connect across the federation boundary. The fix is a `globalThis` bridge.

When the shell's `AuthProvider` initializes, it writes the current session to `globalThis.__tvplus_auth`. Plugins bundle their own copy of `@repo/auth`, but `useAuth()` reads from `globalThis.__tvplus_auth` first. One login, one session, no duplicated auth state, no mysterious `useContext` returning `undefined`.

```typescript
// packages/auth/src/index.ts — the bridge read
export function useAuth(): AuthState {
  // federation context trees don't connect — read from globalThis bridge
  return (globalThis as any).__tvplus_auth ?? defaultState;
}

// shell/src/AuthProvider.tsx — the bridge write
useEffect(() => {
  (globalThis as any).__tvplus_auth = { user, token, login, logout, hasRole };
}, [user, token]);
```

> **Citation Capsule:** The registry pattern — a mutable JSON document listing live plugins, their `remoteEntry.js` URLs, required roles, and enabled/disabled state — is the keystone of the whole architecture. Changing a plugin's URL in the registry instantly redirects the shell to a different build. Zero downtime, no shell redeploy. Combined with a `globalThis` auth bridge (`globalThis.__tvplus_auth`), plugins share auth state without connecting React context trees across the federation boundary.

[INTERNAL-LINK: React context patterns across module boundaries -> supporting article on React context and module federation]

![Two monitors displaying React source code in VS Code with the React logo in a browser tab](https://images.unsplash.com/photo-1633356122544-f134324a6cee?fm=jpg&q=80&w=1200&h=630&fit=crop)

---

## 4. How I proved isolation: the chunk-hash system

This section is the direct answer to my manager's second requirement — "a feature change shouldn't trigger full regression." Saying "the system is isolated" is not enough. QA needs to know exactly what changed and exactly what didn't. That requires evidence, not trust.

[ORIGINAL DATA] The chunk-hash comparison system produces that evidence. Here's how it works.

### Why Vite's filename hashes aren't enough

Vite gives every output chunk a content-hash suffix: `Dashboard-Xq55Gds7.js`. If the file changes, the hash changes. That sounds sufficient, but it's not. Vite's hash reflects the content of the chunk including the URLs it imports from other chunks. If chunk B changes its hash, every chunk that imports B will now import a different filename — its content changes even if its logic is identical.

This is hash chaining: one change propagates a new hash through the entire import graph, including chunks that didn't change at all. Comparing builds by filename hashes alone will show false positives everywhere.

### The content-MD5 approach

The system snapshots and compares builds using this algorithm:

1. **Before a change** — read every `.js` file in `dist/assets/`, compute MD5 of file content, store `{ normalizedName -> MD5 }`.
2. **Build** — make the change, rebuild.
3. **After the change** — same process.
4. **Compare** — match old and new by logical name (filename with hash stripped), diff the MD5s.

The normalization step is where hash chaining gets neutralized. Before computing MD5, I strip all 8-character Vite hash suffixes from the file content with a regex:

```js
// devtools/server.js — hash normalization
const normalized = raw.replace(/-[A-Za-z0-9_-]{8}\.(js|css)/g, '.$1');
// "react-router-dom-BMk89lC8.js" → "react-router-dom.js"
// "react-router-dom-C--zgmsd.js" → "react-router-dom.js"  (same after normalization)
```

After stripping hashes from content, a chunk whose own logic didn't change produces the same MD5 even if one of its dependencies got a new hash. The comparison now tells you what actually changed, not what hash propagation touched.

### What this proves to QA

Add one route to a domain plugin:

```
1 Added    → Analytics-[hash].js          (new route chunk)
2 Modified → App-[hash].js, remoteEntry.js (entry updated — expected)
N Unchanged → Dashboard, Alerts, Incidents, Services, Settings
```

The unchanged routes need zero re-testing. Every route file that didn't change is byte-for-byte identical, proven by content-MD5. QA gets a list of exactly what to test — not a request to test everything.

Add a brand new plugin to the platform:

```
Plugin A (domain remote) → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
Plugin B (domain remote) → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
Plugin C (domain remote) → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
New Plugin               → 14 Added (all new — expected for a new plugin)
```

Existing plugin remotes require zero re-testing when a new plugin is added. That's the isolation guarantee, made verifiable. This is the answer to my manager's second requirement, in evidence form.

<figure>
<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Horizontal bar chart showing MFE build isolation results: 1 chunk added, 2 modified, 7 unchanged after adding one route">
  <rect width="560" height="300" fill="#0f1117" rx="12"/>
  <text x="28" y="36" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#ffffff">MFE Build Isolation — Adding One Route</text>
  <text x="28" y="56" font-family="system-ui, sans-serif" font-size="11" fill="#6b7280">Content-MD5 comparison after adding one route to a plugin</text>
  <!-- Added -->
  <text x="28" y="95" font-family="system-ui, sans-serif" font-size="12" fill="#d1d5db">Added</text>
  <rect x="28" y="103" width="47" height="24" fill="#3b82f6" rx="3"/>
  <text x="82" y="120" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#3b82f6">1 chunk</text>
  <text x="160" y="120" font-family="system-ui, sans-serif" font-size="11" fill="#6b7280">(new route)</text>
  <!-- Modified -->
  <text x="28" y="153" font-family="system-ui, sans-serif" font-size="12" fill="#d1d5db">Modified</text>
  <rect x="28" y="161" width="94" height="24" fill="#3b82f6" rx="3" opacity="0.7"/>
  <text x="130" y="178" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#3b82f6">2 chunks</text>
  <text x="210" y="178" font-family="system-ui, sans-serif" font-size="11" fill="#6b7280">(App entry + remoteEntry.js — expected)</text>
  <!-- Unchanged -->
  <text x="28" y="211" font-family="system-ui, sans-serif" font-size="12" fill="#d1d5db">Unchanged</text>
  <rect x="28" y="219" width="329" height="24" fill="#374151" rx="3"/>
  <text x="365" y="236" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#9ca3af">7 chunks</text>
  <text x="436" y="236" font-family="system-ui, sans-serif" font-size="11" fill="#6b7280">(zero re-testing needed)</text>
  <text x="28" y="282" font-family="system-ui, sans-serif" font-size="10" fill="#4b5563">Source: TV Plus MFE build comparison tooling, content-MD5 with hash normalization</text>
</svg>
<figcaption>Content-MD5 comparison after adding one route to a plugin. Unchanged chunks are byte-for-byte identical — they require zero re-testing.</figcaption>
</figure>

> **Citation Capsule:** The chunk-hash comparison system strips 8-character Vite hash suffixes from file content before computing MD5 — neutralizing hash chaining, where one changed dependency rotates hashes across unrelated chunks. After normalization, adding one route to a plugin produces 1 added chunk, 2 modified chunks, and 7 unchanged chunks. The 7 unchanged routes require zero re-testing. That's the isolation guarantee, made verifiable.

[INTERNAL-LINK: Vite build optimization and chunking strategies -> supporting article on Vite chunk splitting and caching]

---

## 5. The internal dev platform for the team

[PERSONAL EXPERIENCE] Alongside the main shell, I built a companion internal dev platform for the TV Plus team — an Express API on port 5001 backed by a React web UI. Its job is to make onboarding new plugins and managing the registry a point-and-click operation for engineers who aren't deeply familiar with the MFE internals.

The "New Plugin" flow: fill in an id, label, port, accent color, and initial routes, then click Create. Under the hood, `POST /api/scaffold` creates the workspace, runs `pnpm install`, builds with Vite, starts `vite preview`, and registers the plugin in `registry.json`. The shell polls `/api/revision` every 3 seconds and reloads the plugin grid when the build completes. From form submission to plugin rendering in the shell: under one minute.

The platform also covers route management, a build-and-compare UI that runs the chunk-hash comparison from section 4 without the CLI, registry CRUD, access control, deploy versioning with snapshot rollback, and a Lighthouse runner per plugin.

The full story of how the dev platform was designed and built is in a separate article. Part 2 of this series covers the AI-assisted dev platform in full.

### The generated vite.config.ts

Every scaffolded plugin gets a correct vite.config out of the box:

```ts
// apps/<new-plugin>/vite.config.ts (generated)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: 'http://localhost:<assigned-port>/',
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: '<plugin-id>',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        react:               { singleton: true, requiredVersion: false, eager: true },
        'react-dom':         { singleton: true, requiredVersion: false, eager: true },
        'react/jsx-runtime': { singleton: true, requiredVersion: false, eager: true },
        'react-router-dom':  { singleton: true, requiredVersion: false },
      },
    }),
  ],
  server:  { port: <assigned-port>, cors: true },
  preview: { port: <assigned-port>, cors: true },
  build: { target: 'esnext', minify: false, cssCodeSplit: false },
});
```

The `singleton: true` + `requiredVersion: false` + `eager: true` trio is non-negotiable. Every plugin gets this in the scaffold. Section 6 explains why.

### In production: what the CI/CD layer adds

On every push to a plugin repo, GitHub Actions builds the plugin and uploads output to S3 with immutable cache headers:

```yaml
- run: pnpm build
- name: Upload to S3
  run: |
    aws s3 sync ./dist \
      s3://${{ vars.PLUGIN_BUCKET }}/<plugin-id>/${{ github.sha }}/ \
      --cache-control "public, max-age=31536000, immutable"
```

Activation is a single PATCH to the registry service:

```bash
curl -X PATCH $REGISTRY_URL/plugins/<id> \
  -d '{ "url": "https://cdn.example.com/<id>/${{ github.sha }}/assets/remoteEntry.js" }'
```

Rollback is the same PATCH pointing at a previous SHA. Sub-minute recovery, no shell redeploy.

> **Citation Capsule:** The internal dev platform scaffolds a new plugin end-to-end: it creates the workspace, runs `pnpm install`, builds with Vite, starts `vite preview`, and registers the plugin in the registry — all from a single form submission. The shell polls `/api/revision` every 3 seconds and reloads when the build completes. From form submission to plugin rendering in the shell: under one minute, zero terminal commands required from the engineer.

[INTERNAL-LINK: CI/CD patterns for micro-frontend deployments -> supporting article on S3 immutable deployments and registry-based activation]

---

## 6. The five things that almost broke the platform

Now the part you can't write before you've shipped it.

[PERSONAL EXPERIENCE] Every one of these failures surfaced in the TV Plus environment. None are obvious from the documentation. All are fixable in under an hour once you know what to look for.

### a) React fragmentation — and why `requiredVersion: false` is the fix

The day the second domain plugin was onboarded, two copies of React appeared in the page. Hooks broke in baffling ways — `useContext` returning `undefined` for contexts that were definitely provided.

The cause: without `singleton: true`, the federation runtime instantiates separate copies of React if it can't reconcile version ranges between shell and remote. Adding `singleton: true` alone isn't always enough. The combination that actually works is:

```ts
// Works — one React, no conflicts
shared: {
  react: { singleton: true, requiredVersion: false, eager: true },
}
```

`requiredVersion: false` tells the federation runtime to skip version negotiation entirely and use whatever the host provides. `eager: true` makes the shared module available synchronously before any remote initializes. Both matter. Using `requiredVersion: '^19.2.0'` instead of `false` sounds more correct but causes version-mismatch errors the moment any remote's lockfile diverges by a patch version.

The corollary: pin React in lockfiles across the platform, not in `requiredVersion`. CI enforces the pin; federation just trusts it.

### b) The `vite preview` requirement

This one cost half a day on the first setup. `@originjs/vite-plugin-federation` requires built artifacts for remotes. You cannot run a remote in `vite dev` mode and have the shell consume it — the module protocol is different.

The correct dev setup:

```
pnpm build:mfe         # build all remote plugins first (required)
pnpm preview:remotes   # start remotes in vite preview (built artifacts)
pnpm dev:shell         # start shell in vite dev (hot reload works here)
```

The shell gets full hot reload. The remotes don't — you rebuild with `pnpm --filter <id> build` when plugin code changes, and the shell's revision poller detects the new build and reloads. It's not HMR, but it's a 3-5 second round-trip from saving a file to seeing the change. Workable.

The trap is trying to run `vite dev` on a plugin and expecting the shell to pick it up. It silently fails or produces a "not a module" error pointing you in the wrong direction. Document this on day one.

### c) CSS leaking — solved by a single shared stylesheet

Tailwind preflight in the shell, Tailwind preflight in plugin A, Tailwind preflight in plugin B. Three sets of `* { box-sizing: border-box }` stomping on each other. A `<button>` styled correctly in isolation renders with someone else's reset in production.

The fix: one shared stylesheet from `@repo/shared-ui/src/styles.css` — shadcn/ui "New York" design tokens, CSS variables, the Tailwind `@theme inline` block — and all apps extend from it:

```css
/* packages/shared-ui/src/styles.css */
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    /* ... all design tokens */
  }
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-primary: hsl(var(--primary));
  /* ... mapped to Tailwind */
}
```

Plugins don't ship their own Tailwind preflight. They inherit the shell's. Design system components all render consistently across plugins because they pull from the same token layer.

### d) Dev-mode CORS

Plugin on `localhost:3003`, shell on `localhost:3000`. Shell tries to load `remoteEntry.js` from the plugin server. Browser blocks it. One line in every vite.config fixes this:

```ts
server:  { port: 3003, cors: true },
preview: { port: 3003, cors: true },
```

This came up again in staging when the shell was on a real domain and plugins were on localhost-equivalent CDN paths. The infrastructure fix is `Access-Control-Allow-Origin` headers on the plugin origin covering the shell's domain. Treat this as a checklist item when promoting from local to any shared environment.

### e) The `base` URL and what happens when you forget it

Every plugin vite.config has a `base` field:

```ts
base: 'http://localhost:3003/',
```

Without this, Vite generates relative import paths in the plugin's chunks. When the shell loads the plugin's `remoteEntry.js` and that file tries to import `./Dashboard-Xq55Gds7.js` using a relative path, it resolves against `localhost:3000` — not `localhost:3003` where the chunk actually lives. Everything fails silently or with a confusing "module not found" error.

`base` must match wherever the plugin is actually served. In production this becomes the CDN origin: `base: 'https://cdn.example.com/plugin-cms/'`. It's a build-time decision, not a runtime one, which means you need a separate build per environment if CDN paths differ. Account for this in the CI config early.

> **Citation Capsule:** Five failure modes surface consistently when shipping Vite Module Federation in a multi-team environment: React fragmentation from missing `singleton: true` with `requiredVersion: false`; Vite dev-mode incompatibility with federation (use `vite preview` for remotes); CSS bleed from multiple Tailwind preflight resets; dev-mode CORS on cross-origin remote URLs; and incorrect `base` URL causing relative asset paths to resolve against the shell's origin. None are obvious from the documentation. All are fixable in under an hour once you know what to look for.

![Designer's desk with color swatches and an iPad showing interface sketches](https://images.unsplash.com/photo-1561070791-2526d30994b5?fm=jpg&q=80&w=1200&h=630&fit=crop)

[INTERNAL-LINK: Tailwind CSS in micro-frontend architectures -> supporting article on shared design systems across MFE remotes]

---

## 7. What this architecture unlocks (and what it costs)

Three things become possible that weren't before:

**Plugin remotes ship on their own cadences.** No release train. A plugin team can deploy a one-line copy fix without waiting for the team migrating their state library. Coordination cost on individual changes drops to near zero.

**New plugins onboard in under a minute.** The architectural reason this is possible: the shell knows nothing about specific plugins at build time. Adding one is a registry change, not a shell change.

**Isolation is verifiable.** The chunk-hash comparison from section 4 turns "trust the build system" into "here are the diffs, here's what changed, here's what didn't." QA scope shrinks from "everything" to "the plugin that changed." This is the answer my manager needed, in a form the QA team could act on.

What gets harder, because nothing is free:

- **Observability complexity.** Source maps become per-plugin, per-version. A Sentry stack trace needs additional context to resolve to "this came from `plugin-cms`, build a4f9c2." Build tooling for this from day one.
- **Shell deploys become higher-stakes.** When the shell changes something that touches the plugin contract — the auth context shape, the navigation bridge — it affects every plugin simultaneously. Shell changes are rarer than plugin changes but need more review rigor.
- **The platform layer becomes real ongoing work.** Registry operations, dev platform maintenance, design system versioning. A two-person platform team can support ten product engineers well. One person can't. Account for this before you start.
- **The `base` URL problem multiplies.** Every plugin has an environment-specific build. Your CI needs to know what CDN path each plugin lands on. Solvable, not free.

---

## Frequently Asked Questions

### Can plugins share state across the federation boundary?

Share as little as possible. Auth context works via the `globalThis` bridge pattern — the shell writes session state to `globalThis.__tvplus_auth` and plugins read from it directly. For other shared state (Redux, Zustand, Jotai), don't try to cross the boundary. State coupling between plugins is a sign the boundary is in the wrong place.

[INTERNAL-LINK: React state management across micro-frontends -> detailed article on cross-boundary state patterns]

### Does this work if plugins live in separate Git repositories?

Yes. The shell only needs a plugin's `remoteEntry.js` URL in the registry. Where that URL is built from — a monorepo, a separate repo, a third-party CDN — doesn't matter to the shell. In production, CI builds the plugin, uploads to S3, and patches the registry URL. The shell picks it up on the next registry fetch.

[INTERNAL-LINK: multi-repo CI/CD for micro-frontends -> supporting article on S3 deploy pipelines for MFE]

### Why `vite preview` instead of `vite dev` for remotes?

`@originjs/vite-plugin-federation` requires built artifacts for remotes. Vite dev mode serves files through a different module protocol that federation can't consume. Build the remotes first, then run them with `vite preview`. The shell can still use `vite dev` with full hot reload — only the remotes need to be pre-built.

[INTERNAL-LINK: Vite dev vs preview mode explained -> supporting article on Vite module protocols]

### How do you handle plugin versioning and rollback in production?

Each plugin build uploads to an immutable S3 path keyed by git SHA. The registry stores the current active URL. Rollback is a single PATCH to the registry pointing at the previous SHA's URL — no shell redeploy, no forced client refresh. Users on the old version keep it until their next page load. Recovery is sub-minute.

[INTERNAL-LINK: zero-downtime frontend deploys -> supporting article on immutable CDN deployments and registry switching]

---

The two requirements my manager gave me — isolation and provable regression scope — turned out to be the same problem approached from two directions. The registry solves isolation. The chunk-hash system solves proof. Get both right and the rest of the architecture follows.

If you've built or are building a Vite Module Federation platform and disagree with any of this — especially the `@originjs` vs `@module-federation/vite` call, the `requiredVersion: false` approach, or whether the registry-as-JSON-file scales past a dozen plugins — I'd genuinely like to hear it.

— Nishant

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": "Rebuilding Samsung TV Plus's Frontend: Plugin-Based MFE with Vite Module Federation",
      "description": "My manager's brief: make it plugin-based, isolated — adding a plugin shouldn't touch what's running, and a feature change shouldn't trigger full regression. Here's the architecture that delivered it.",
      "datePublished": "2026-05-03",
      "dateModified": "2026-05-03",
      "author": {
        "@type": "Person",
        "name": "Nishant Chaudhary"
      },
      "image": "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=jpg&q=80&w=1200&h=630&fit=crop",
      "keywords": ["micro-frontends", "Vite", "Module Federation", "Samsung TV Plus", "frontend architecture", "plugin-based architecture"]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can plugins share state across the federation boundary?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Share as little as possible. Auth context works via a globalThis bridge — the shell writes session state to globalThis.__tvplus_auth and plugins read from it. For other shared state like Redux or Zustand, don't cross the boundary. State coupling between plugins means the boundary is in the wrong place."
          }
        },
        {
          "@type": "Question",
          "name": "Does Vite Module Federation work if plugins live in separate Git repositories?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The shell only needs a plugin's remoteEntry.js URL in the registry. Where that URL is built from — a monorepo, separate repo, or third-party CDN — doesn't matter. In production, CI builds the plugin, uploads to S3, and patches the registry URL. The shell picks it up on the next registry fetch."
          }
        },
        {
          "@type": "Question",
          "name": "Why use vite preview instead of vite dev for remotes in Module Federation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "@originjs/vite-plugin-federation requires built artifacts for remotes. Vite dev mode uses a different module protocol that federation can't consume. Build remotes first, then run with vite preview. The shell can still use vite dev with full hot reload."
          }
        },
        {
          "@type": "Question",
          "name": "How do you handle plugin versioning and rollback in production?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Each plugin build uploads to an immutable S3 path keyed by git SHA. The registry stores the current active URL. Rollback is a single PATCH to the registry pointing at the previous SHA — no shell redeploy, no forced refresh. Users on the old version keep it until their next page load."
          }
        }
      ]
    }
  ]
}
</script>
