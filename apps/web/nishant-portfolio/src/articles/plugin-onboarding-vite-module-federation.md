---
title: "Plugin Onboarding in Under 60 Seconds: Building a Vite Module Federation Platform"
description: "Shell, four remotes, a registry, an AI-assisted dev platform. How I built a Vite MFE architecture where adding a plugin takes under a minute and isolation is proven by content-MD5."
slug: "plugin-onboarding-vite-module-federation"
coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=jpg&q=80&w=1200&h=630&fit=crop"
coverImageAlt: "iMac monitor displaying a design system with component library panels open"
ogImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=jpg&q=80&w=1200&h=630&fit=crop"
date: "2026-05-03"
lastUpdated: "2026-05-03"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a senior frontend engineer specialising in React micro-frontends, Vite build tooling, and AI-native developer platforms. He built the MFE platform described in this post as a standalone POC."
tags: ["micro-frontends", "vite", "module-federation", "frontend-platform", "architecture", "react"]
---

Frontend teams that outgrow their monolith all hit the same wall. One repo, one build, one deploy. The slowest team sets the cadence for everyone. Code review queues stretch into days because every PR touches code the reviewer doesn't have full context on. Splitting at the repo level doesn't help — you still need one shell, one design system, one auth flow.

I built this as a POC: a Vite Module Federation platform with a shell, four plugin remotes, a registry, and an AI-assisted dev platform that scaffolds new plugins through a web form. By the end, scaffolding a new plugin and watching it render in the shell took under a minute. The interesting part isn't the headline number. It's everything that had to be true for that number to be honest.

This post is about the architecture: how to build a plugin-based micro-frontend platform on **Vite Module Federation** that doesn't require a Ph.D. in build tooling to maintain. Most MFE posts stop at "here's how to wire up Module Federation." This one is about what happens *after* — the registry service, the shared-dependency war, the `vite preview` surprise, and the chunk-hash trick that lets you prove exactly which routes were affected by any given change.

It's the architecture I'd build again tomorrow.

---

> **Key Takeaways**
> - Vite Module Federation with a runtime registry lets you add a new plugin without touching the shell's build config.
> - Content-MD5 comparison with hash normalization proves which chunks actually changed — unchanged routes need zero re-testing.
> - In 2024, 58% of JS developers used zero monorepo tools ([State of JS 2024](https://2024.stateofjs.com/en-US/libraries/monorepo_tools/)) — this architecture fills that gap.
> - The `singleton: true, requiredVersion: false, eager: true` trio is non-negotiable for shared React across remotes.
> - An AI-assisted dev platform reduces plugin scaffolding to a form submission and a 3-second shell reload.

[INTERNAL-LINK: micro-frontend architecture overview -> pillar article on React application architecture patterns]

---

## 1. The problem we were actually solving

In 2024, 58% of JavaScript developers reported using zero dedicated monorepo tools ([State of JavaScript Survey 2024](https://2024.stateofjs.com/en-US/libraries/monorepo_tools/)). Most frontend teams outgrowing a monolith reach for repo-splitting first. That solves the wrong problem. The actual fix is splitting the runtime.

If you've been on a frontend team that's outgrown its monolith, you know the shape of this:

- One repo, one build, one deploy. Multiple teams.
- Blast radius is total — every change risks every product surface. Someone's typo in a feature flag config takes down checkout.
- The slowest team in the system sets the cadence for everyone. Shipping a one-line copy fix waits for the team migrating their state library.
- Code review queues stretch into days because every PR touches a codebase the reviewer doesn't have full context on.

The first instinct is "just split the repos." It doesn't work. You still need one shell, one design system, one auth flow, one analytics pipeline, one place to render the navigation. Splitting at the repo level without splitting at the *runtime* level just gives you all the coordination overhead of a monolith with all the integration overhead of microservices.

The actual fix is splitting the runtime. That's micro-frontends. Each product surface becomes an independently built, independently deployed bundle that the shell loads at runtime. Teams own their bundles end to end. The platform team owns the shell, the contracts between shell and bundles, and the infrastructure that holds it together.

The hard part isn't the concept. It's making it boring enough that engineers stop noticing it exists.

> **Citation Capsule:** In 2024, 58% of JavaScript developers reported using zero dedicated monorepo tools ([State of JavaScript Survey 2024](https://2024.stateofjs.com/en-US/libraries/monorepo_tools/)). Most frontend teams outgrowing a monolith reach for repo-splitting first — which solves the wrong problem. The actual fix is splitting the runtime: independently built, independently deployed bundles the shell loads at runtime, with shared contracts owned by the platform team.

![Two monitors displaying React source code in VS Code with the React logo in a browser tab](https://images.unsplash.com/photo-1633356122544-f134324a6cee?fm=jpg&q=80&w=1200&h=630&fit=crop)

[INTERNAL-LINK: monolith to micro-frontend migration guide -> supporting article on when to split a frontend monolith]

---

## 2. Why Vite Module Federation specifically?

[UNIQUE INSIGHT] The `@originjs/vite-plugin-federation` vs `@module-federation/vite` choice is still the first question every team asks. In 2025, TypeScript became the number one language on GitHub by contributor count with 66% year-over-year growth ([GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)). Both libraries now ship strong TypeScript types, but the operational maturity gap between them matters more than the TS story.

Most production MFE deployments in 2024 and earlier defaulted to **Webpack 5's Module Federation plugin**. It's mature, well-documented, and Zack Jackson — the original author — has been refining it for years. If you're already on Webpack, you should probably use it.

The shell and most of the plugin remotes were already on Vite + React 19. Switching the host build system to fit the MFE story would have been the tail wagging the dog.

In Vite-land, there are two real options for Module Federation:

| Library | Status | Best for |
|---|---|---|
| `@originjs/vite-plugin-federation` | Community, mature, broad compat | Teams already on Vite who need MF *now* |
| `@module-federation/vite` | Official, newer, better SSR story | Greenfield or teams who can wait for ecosystem catch-up |

The POC shipped on **`@originjs/vite-plugin-federation` v1.4.1**. At the time of that call, the official `@module-federation/vite` package was still maturing — fewer production case studies, some integration friction with the Vite plugins already running. The origin.js package was the boring, debuggable choice. It still is for most teams not doing SSR.

> **Aside.** *If you're on Next.js App Router, the picture is different — `@module-federation/nextjs-mf` exists, but the host wiring is its own thing. The architecture below mostly translates, but the build config doesn't.*

<!-- TODO: link to Vite monorepo setup article -->

[INTERNAL-LINK: Webpack vs Vite build performance comparison -> supporting article on migration from Webpack to Vite]

---

## 3. Architecture, end to end

Three components, in plain English:

**The shell.** A Vite + React app running on port 3000. Owns auth, top-level routing, the design system, and user session. It knows nothing about specific plugins at build time. At startup, it fetches a plugin registry, then dynamically imports each plugin's `remoteEntry.js` on demand.

**Plugin remotes.** Four independently built apps — each a full Vite + React application with its own internal routing, own routes, own data fetching. In production they're mounted by the shell. In standalone dev they run fine on their own.

**The registry.** A JSON document listing live plugins, their `remoteEntry.js` URLs, required roles, and enabled/disabled state. This is the keystone of the whole architecture. We'll come back to why.

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

The shell never knows, at build time, that any specific plugin exists. The shell just knows how to mount whatever the registry tells it to mount. That last sentence is the architecture. Everything else is plumbing.

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

`remotes: {}` is intentional and important. The shell declares no remotes at build time. Instead it calls `__federation_method_setRemote(id, { url, format: 'esm', from: 'vite' })` at runtime once it has the registry. This is what makes the architecture dynamic — adding a new plugin to the platform doesn't require touching the shell config at all.

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

All four domain plugins follow this identical pattern. Each exposes exactly one entry point — `'./App': './src/App.tsx'` — which handles its own internal routing via `react-router-dom`. The shell never cares about a plugin's routes; it just mounts `App`.

### The registry

The registry is the only mutable piece in the system. In dev, the AI-assisted dev platform's Express server reads and writes `devtools/data/registry.json`. In production, the shell fetches its own static copy from `public/registry.json` as a fallback:

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

The `requiredRoles` field deserves a note. The shell filters this on the client using the current user's role from `@repo/auth`:

```typescript
const visibleApps = registry.filter(app =>
  !app.disabled &&
  (!app.requiredRoles?.length || app.requiredRoles.includes(user.role))
);
```

`@repo/auth` is declared `singleton: true` in the shell's shared config. That means the auth context, the `useAuth()` hook, and the current user object are the shell's instances, reused by every plugin that calls them. Plugins don't get their own auth; they share the shell's. This is deliberate: one login, one session, everywhere.

The registry is the only thing you change to add, remove, enable, disable, or redirect a plugin. Changing a plugin's URL in the registry instantly redirects the shell to a different build of that plugin. Zero downtime, no shell redeploy.

### The Auth Bridge

The `@repo/auth` package is declared `singleton: true` in the shell's shared config — so every plugin should reuse the shell's auth instance. In practice, the React context tree doesn't connect across the federation boundary. The fix is a `globalThis` bridge.

When the shell's `AuthProvider` initialises, it writes the current session to `globalThis.__tvplus_auth`. Plugins bundle their own copy of `@repo/auth`, but `useAuth()` reads from `globalThis.__tvplus_auth` first. This means auth works even when the context trees are completely separate. One login, one session, no duplicated auth state, no mysterious `useContext` returning `undefined`.

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

<!-- TODO: link to TypeScript module augmentation article -->

> **Citation Capsule:** The registry pattern — a mutable JSON document listing live plugins, their `remoteEntry.js` URLs, required roles, and enabled/disabled state — is the keystone of the whole architecture. Changing a plugin's URL in the registry instantly redirects the shell to a different build. Zero-downtime, no shell redeploy. Combined with a `globalThis` auth bridge, plugins share auth state without connecting React context trees across the federation boundary.

[INTERNAL-LINK: React context patterns across module boundaries -> supporting article on React context and federation]

---

## 4. Proving isolation: the chunk hash story

This is the part of the architecture I'm most proud of, and the part the articles I read didn't cover at all.

The promise of plugin-based MFEs is isolation: changing one domain plugin should have zero effect on the others. QA should be able to sign off on one plugin's build and ignore the rest. That promise is easy to state and hard to verify — until you instrument it.

### Why Vite's filename hashes aren't enough

Vite gives every output chunk a content-hash suffix: `Dashboard-Xq55Gds7.js`. If the file changes, the hash changes. Simple, right?

Not quite. Vite's hash reflects the *content* of the chunk including the URLs it imports from other chunks. If chunk B changes its hash, every chunk that imports B will now import a different filename — and its content changes even if its logic is identical. This is **hash chaining**: one change propagates a new hash through the entire import graph, even into chunks that didn't change at all.

So you can't compare builds by filename hashes alone. You need content-level comparison.

### The content-MD5 approach

The AI-assisted dev platform snapshots and compares builds using this algorithm:

1. **Before a change** — read every `.js` file in `dist/assets/`, compute MD5 of file *content*, store `{ normalizedName → MD5 }`.
2. **Build** — make the change, rebuild.
3. **After the change** — same process.
4. **Compare** — match old and new by logical name (filename with hash stripped), diff the MD5s.

The normalization step is where hash chaining gets neutralized. Before computing MD5, we strip all 8-character Vite hash suffixes from the file *content* with a regex:

```js
// devtools/server.js — hash normalization
const normalized = raw.replace(/-[A-Za-z0-9_-]{8}\.(js|css)/g, '.$1');
// "react-router-dom-BMk89lC8.js" → "react-router-dom.js"
// "react-router-dom-C--zgmsd.js" → "react-router-dom.js"  (same after normalization)
```

After stripping hashes from the content, a chunk whose own logic didn't change produces the same MD5 even if one of its dependencies got a new hash. The comparison now tells you what *actually* changed, not what the hash propagation touched.

### What this proves

[ORIGINAL DATA] Add one route to a domain plugin:

```
1 Added    → Analytics-[hash].js          (new route chunk)
2 Modified → App-[hash].js, remoteEntry.js (entry updated — expected)
N Unchanged → Dashboard, Alerts, Incidents, Services, Settings
```

The unchanged routes need zero re-testing. Every route file that didn't change is byte-for-byte identical, proven by content-MD5.

Add a brand new plugin to the platform:

```
Plugin A (domain remote) → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
Plugin B (domain remote) → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
Plugin C (domain remote) → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
New Plugin               → 14 Added (all new — expected for a new plugin)
```

Existing plugin remotes require zero re-testing when a new plugin is added. That's the isolation guarantee, made verifiable.

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
  <text x="28" y="282" font-family="system-ui, sans-serif" font-size="10" fill="#4b5563">Source: mfe-poc build comparison tooling, content-MD5 with hash normalization</text>
</svg>
<figcaption>Content-MD5 comparison after adding one route to a plugin. Unchanged chunks are byte-for-byte identical — they require zero re-testing.</figcaption>
</figure>

![Developer monitors lit in cyan and orange displaying colorful code at night](https://images.unsplash.com/photo-1754039984985-ef607d80113a?fm=jpg&q=80&w=1200&h=630&fit=crop)

> **Citation Capsule:** The chunk-hash comparison system strips 8-character Vite hash suffixes from file content before computing MD5 — neutralising hash chaining, where one changed dependency rotates hashes across unrelated chunks. After normalisation, adding one route to a plugin produces 1 added chunk, 2 modified chunks, and 7 unchanged chunks. The 7 unchanged routes need zero re-testing. That's the isolation guarantee, made verifiable rather than assumed.

[INTERNAL-LINK: Vite build optimization and chunking strategies -> supporting article on Vite chunk splitting and caching]

---

## 5. The onboarding pipeline

This is the part that earns the headline. The flow an engineer hits, from zero to a new plugin in the shell:

### In the POC: the AI-assisted dev platform UI

The POC includes a companion AI-assisted dev platform alongside the main shell — an Express API on port 5001 backed by a React web UI. The "New Plugin" flow is entirely point-and-click:

1. Open the AI-assisted dev platform at `localhost:5173`
2. Fill in the New Plugin form: id, label, port, accent color, initial routes
3. Click Create

Under the hood, `POST /api/scaffold` runs on the server:
- Creates `apps/<id>/` with a fully-wired `vite.config.ts`, `package.json`, `App.tsx`, and route stubs
- Runs `pnpm install` for the new workspace member
- Runs `pnpm --filter <id> build` automatically
- Registers the plugin in `devtools/data/registry.json`

#### What the AI-assisted dev platform actually covers

The scaffold form is just the entry point. The platform has eight capabilities built in:

- **Route manager** — add or remove routes to any existing plugin without touching its source directly
- **Code studio** — generates full Login, Form, and CRUD route stubs with AI-inferred field types from your description
- **Build & compare** — runs the chunk-hash comparison from section 4 through a UI, no CLI needed
- **Registry manager** — CRUD interface for the plugin registry: add, edit, disable, or delete plugin entries
- **Access control** — define roles and map them to plugin visibility rules
- **Deploy versioning** — snapshot built dist folders to `deploys/<plugin>/<version>/` for instant rollback
- **Lighthouse runner** — per-plugin Web Vitals audit from the same UI

This is what makes the "AI-assisted" label accurate: the platform generates idiomatic, wired-up code for common patterns. Engineers describe what they need; the platform produces the files.

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

The `singleton: true` + `requiredVersion: false` + `eager: true` trio is non-negotiable. Every plugin gets this in the scaffold. We'll cover why in section 6.

### In production: what the CI/CD layer adds

The AI-assisted dev platform approach works for a team all running locally. In production, this becomes a proper pipeline:

**Build and deploy** — on every push to a plugin repo, GitHub Actions builds the plugin and uploads the output to S3 with immutable cache headers:

```yaml
- run: pnpm build
- name: Upload to S3
  run: |
    aws s3 sync ./dist \
      s3://${{ vars.PLUGIN_BUCKET }}/<plugin-id>/${{ github.sha }}/ \
      --cache-control "public, max-age=31536000, immutable"
```

**Activate** — a single PATCH to the registry service updates the `url` field:

```bash
curl -X PATCH $REGISTRY_URL/plugins/<id> \
  -d '{ "url": "https://cdn.example.com/<id>/${{ github.sha }}/assets/remoteEntry.js" }'
```

**Rollback** — same PATCH, previous SHA. Sub-minute recovery, no shell redeploy.

The POC's manual `scripts/use-version.js` does this same thing locally:

```bash
node scripts/use-version.js sms v2   # point registry at v2
node scripts/use-version.js sms v1   # rollback to v1
```

It rewrites `registry.json` and prints the before/after URLs. Users already on the page continue with the old version until their next load. Zero forced refreshes.

#### The build script reads the registry

`dev-remotes.js` doesn't hardcode the list of apps to build. It reads `devtools/data/registry.json` at runtime. Every plugin that's registered gets built and previewed automatically. Adding a plugin to the registry means the next `pnpm dev` run picks it up — no config change in the build script required.

#### Shell revision polling

The shell polls `/api/revision` every 3 seconds. When the AI-assisted dev platform finishes a scaffold-build-preview cycle, it increments the revision counter. The shell detects the change and reloads the plugin grid. The engineer never touches a terminal — from form submission to the new plugin rendering in the shell takes under a minute. That's the number in the title. That's how it's honest.

> **Citation Capsule:** The AI-assisted dev platform scaffolds a new plugin end-to-end: it creates the workspace, runs `pnpm install`, builds with Vite, starts `vite preview`, and registers the plugin in the registry — all from a single form submission. The shell polls `/api/revision` every 3 seconds and reloads when the build completes. From form submission to plugin rendering in the shell: under one minute, zero terminal commands.

[INTERNAL-LINK: CI/CD patterns for micro-frontend deployments -> supporting article on S3 immutable deployments and registry-based activation]

---

## 6. The five things that almost broke us

Now the part you can't write before you've shipped it.

[PERSONAL EXPERIENCE] Every one of these failures surfaced in the POC environment. None are obvious from the documentation. All are fixable in under an hour once you know what to look for.

### a) React fragmentation — and why `requiredVersion: false` is the fix

The day we onboarded a second domain plugin, we got two copies of React in the page. Hooks broke in baffling ways — `useContext` returning `undefined` for contexts that were definitely provided.

The cause: without `singleton: true`, the federation runtime will instantiate separate copies of React if it can't reconcile version ranges between shell and remote. Adding `singleton: true` alone isn't always enough. The combination that actually works is:

```ts
// Works — one React, no conflicts
shared: {
  react: { singleton: true, requiredVersion: false, eager: true },
}
```

`requiredVersion: false` tells the federation runtime to skip version negotiation entirely and just use whatever the host provides. `eager: true` makes the shared module available synchronously before any remote initializes. Both matter. Using `requiredVersion: '^19.2.0'` instead of `false` sounds more correct but causes version-mismatch errors the moment any remote's lockfile diverges by a patch version.

The corollary: pin React in lockfiles across the platform, not in `requiredVersion`. Your CI enforces the pin; federation just trusts it.

### b) The `vite preview` requirement

This one cost half a day on the first setup. `@originjs/vite-plugin-federation` requires built artifacts for remotes. You cannot run a remote in `vite dev` mode and have the shell consume it — the module protocol is different.

The correct dev setup:

```
pnpm build:mfe      # build all remote plugins first (required)
pnpm preview:remotes   # start remotes in vite preview (built artifacts)
pnpm dev:shell      # start shell in vite dev (hot reload works here)
```

The shell benefits from full hot reload. The remotes don't — you rebuild them with `pnpm --filter <id> build` when you change plugin code, then the shell's revision poller detects the new build and reloads. It's not HMR, but it's a 3-5 second round-trip from saving a file to seeing the change, which is workable.

The trap is trying to run `vite dev` on a plugin and expecting the shell to pick it up. It silently fails or produces a "not a module" error that points you in the wrong direction. Document this on day one.

### c) CSS leaking — solved by a single shared stylesheet

Tailwind preflight in the shell, Tailwind preflight in plugin A, Tailwind preflight in plugin B. Three sets of `* { box-sizing: border-box }` stomping on each other. A `<button>` styled correctly in isolation renders with someone else's reset in production.

We solved this by making the design system the single source of CSS truth. All apps import one shared stylesheet from `@repo/shared-ui/src/styles.css` — shadcn/ui "New York" design tokens, CSS variables, the Tailwind `@theme inline` block — and extend from there:

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

Plugins don't ship their own Tailwind preflight. They inherit the shell's. The design system components in `@repo/shared-ui` — Button, Card, DataTable, Dialog, Form, and 15 others — all render consistently across plugins because they're pulling from the same token layer.

### d) Dev-mode CORS

Plugin on `localhost:3003`. Shell on `localhost:3000`. Shell tries to load `remoteEntry.js` from the plugin server. Browser blocks it.

The fix is one line in every vite.config:

```ts
server:  { port: 3003, cors: true },
preview: { port: 3003, cors: true },
```

This came up again in staging when the shell was deployed to a real domain and the plugins were still on localhost CDN-equivalent paths. The fix on the infrastructure side is CORS headers on the plugin origin — `Access-Control-Allow-Origin` covering the shell's domain. Treat this as a checklist item when promoting from local to any shared environment.

### e) The `base` URL and what happens when you forget it

Every plugin vite.config has a `base` field:

```ts
base: 'http://localhost:3003/',
```

Without this, Vite generates relative import paths in the plugin's chunks. When the shell (on port 3000) loads the plugin's `remoteEntry.js` and that file tries to import `./Dashboard-Xq55Gds7.js` using a relative path, it resolves against `localhost:3000` — not `localhost:3003` where the chunk actually lives. Everything fails silently or with a confusing "module not found" error.

`base` must match wherever the plugin is actually served. In production this becomes the CDN origin: `base: 'https://cdn.example.com/plugin-cms/'`. This is the URL you hardcode in the build. It's a build-time decision, not a runtime one, which means you need a separate build per environment if your CDN paths differ. Account for this in your CI config early.

> **Citation Capsule:** Five failure modes surface consistently when shipping Vite Module Federation in a multi-team environment: React fragmentation from missing `singleton: true` with `requiredVersion: false`, Vite dev-mode incompatibility with federation (use `vite preview` for remotes), CSS bleed from multiple Tailwind preflight resets, dev-mode CORS on cross-origin remote URLs, and incorrect `base` URL causing relative asset paths to resolve against the shell's origin. None are obvious from the documentation. All are fixable in under an hour once you know what to look for.

![Designer's desk with color swatches and an iPad showing interface sketches](https://images.unsplash.com/photo-1561070791-2526d30994b5?fm=jpg&q=80&w=1200&h=630&fit=crop)

<!-- TODO: link to @repo/ui article -->

[INTERNAL-LINK: Tailwind CSS in micro-frontend architectures -> supporting article on shared design systems across MFE remotes]

---

## 7. What this architecture unlocks (and what it costs)

Three things become possible that weren't before:

**Plugin remotes ship on their own cadences.** No release train. A plugin team can deploy a one-line copy fix without waiting for the team migrating their state library. Coordination cost on individual changes drops to near zero.

**New plugins onboard in under a minute.** From the scaffold form to the plugin rendering in the shell. The architectural reason this is possible: the shell knows nothing about specific plugins at build time — adding one is a registry change, not a shell change.

**Isolation is verifiable.** The chunk-hash comparison from section 4 turns "trust the build system" into "here are the diffs, here's what changed, here's what didn't." QA scope shrinks from "everything" to "the plugin that changed."

What gets worse, because nothing is free:

- **Observability complexity.** Source maps become per-plugin, per-version. A Sentry stack trace needs additional context to resolve to "this came from `plugin-cms`, build a4f9c2." Build tooling for this from day one.
- **Shell deploys become higher-stakes.** When the shell changes something that touches the plugin contract — the auth context shape, the navigation bridge — it affects every plugin simultaneously. Shell changes are rarer than plugin changes but need more review rigor.
- **The platform layer becomes real ongoing work.** Registry operations, AI-assisted dev platform maintenance, design system versioning. A two-person platform team can support ten product engineers well. One person can't. Account for this load before you start.
- **The `base` URL problem multiplies.** Every plugin has an environment-specific build. Your CI needs to know what CDN path each plugin lands on. Solvable, not free.

---

## 8. What I'd do differently

A few things, with the benefit of having shipped it:

**Build the registry and AI-assisted dev platform first, not last.** Everything in this post bends back to the registry — the source of truth for what plugins exist and where they live. We hand-rolled it after the first three domain plugins were already running with hardcoded URLs in three different config files across two repos, plus a switch statement in the shell. Migrating later was painful for two weeks: every plugin had to be rebuilt with the new dynamic-loading pattern, every developer had to relearn the workflow, and the temptation to keep the hardcoded shortcuts "just for this one thing" was constant. The scaffold, build, and compare UI came later still. Start with the registry service on day one. Build the platform before the third plugin.

**Pick `@module-federation/vite` from day one if you're greenfield.** The official package has matured since we made our call. The `@originjs` plugin is still the right choice for many teams, but the gap has narrowed. If you're starting today with no existing Vite config investment, the official package is worth evaluating, especially for SSR.

**Don't try to share state libraries across the federation boundary.** Sharing Redux, Zustand, or Jotai stores between the shell and plugins is the moment this architecture starts to hurt. Share the design system, share the auth context, share the utility types. Let plugins own their state. State coupling between plugins is a design smell that means you've drawn the boundary in the wrong place.

**Instrument the isolation guarantee early.** The chunk-hash comparison system (section 4) was the thing that made this architecture real to skeptical stakeholders. "Unchanged" chunks with matching MD5s is a far more persuasive answer to "how do we know plugin B wasn't affected?" than "trust the build system." Build the comparison tooling before you need to defend the architecture in a post-incident review.

**Treat the `base` URL as a first-class deployment concern.** It's easy to miss in local dev where everything is localhost. It becomes the thing that breaks your first staging deploy. Add it to your plugin scaffolding template, document it explicitly, and build your CI pipeline with multi-environment `base` resolution from the start.

---

## Frequently Asked Questions

### Can plugins share state across the federation boundary?

Share as little as possible. Auth context works via the `globalThis` bridge pattern — the shell writes session state to `globalThis.__tvplus_auth` and plugins read from it directly. For other shared state (Redux, Zustand, Jotai), don't try to cross the boundary. State coupling between plugins means the boundary is in the wrong place.

[INTERNAL-LINK: React state management across micro-frontends -> detailed article on cross-boundary state patterns]

### Does this work if plugins live in separate Git repositories?

Yes. The shell only needs a plugin's `remoteEntry.js` URL in the registry. Where that URL is built from — a monorepo, a separate repo, a third-party CDN — doesn't matter to the shell. In production, CI builds the plugin, uploads to S3, and patches the registry URL. The shell picks it up on the next registry fetch.

[INTERNAL-LINK: multi-repo CI/CD for micro-frontends -> supporting article on S3 deploy pipelines for MFE]

### Why `vite preview` instead of `vite dev` for remotes?

`@originjs/vite-plugin-federation` requires built artifacts for remotes. Vite dev mode serves files through a different module protocol that federation can't consume. Build the remotes first, then run them with `vite preview`. The shell can still use `vite dev` with full hot reload — only the remotes need to be pre-built.

[INTERNAL-LINK: Vite dev vs preview mode explained -> supporting article on Vite module protocols]

### How do you handle plugin versioning and rollback in production?

Each plugin build is uploaded to an immutable S3 path keyed by git SHA. The registry stores the current active URL. Rollback is a single PATCH to the registry pointing at the previous SHA's URL — no shell redeploy, no forced client refresh. Users on the old version keep it until their next page load.

[INTERNAL-LINK: zero-downtime frontend deploys -> supporting article on immutable CDN deployments and registry switching]

---

If you've built or are building a Vite Module Federation platform and disagree with any of this — especially the `@originjs` vs `@module-federation/vite` call, the `requiredVersion: false` approach, or whether the registry-as-JSON-file scales past a dozen plugins — I'd genuinely like to hear it. The corners of frontend infrastructure that aren't well-documented are the ones I most want to learn from.

— Nishant

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": "Plugin Onboarding in Under 60 Seconds: Building a Vite Module Federation Platform",
      "description": "Shell, four remotes, a registry, an AI-assisted dev platform. How I built a Vite MFE architecture where adding a plugin takes under a minute and isolation is proven by content-MD5.",
      "datePublished": "2026-05-03",
      "dateModified": "2026-05-03",
      "author": {
        "@type": "Person",
        "name": "Nishant Chaudhary"
      },
      "image": "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=jpg&q=80&w=1200&h=630&fit=crop",
      "keywords": ["micro-frontends", "Vite", "Module Federation", "React", "frontend architecture", "monorepo"]
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
