
Frontend teams that outgrow their monolith all hit the same wall. One repo, one build, one deploy. The slowest team sets the cadence for everyone. Code review queues stretch into days because every PR touches code the reviewer doesn't have full context on. Splitting at the repo level doesn't help — you still need one shell, one design system, one auth flow.

I spent eight months building a Vite Module Federation platform to solve this — a shell, four plugin remotes, a registry, and a DevTools layer that scaffolds new plugins through a web form. By the end, scaffolding a new plugin and watching it render in the shell took under a minute. The interesting part isn't the headline number. It's everything that had to be true for the number to be honest.

This post is about the architecture: how to build a plugin-based micro-frontend platform on **Vite Module Federation** that doesn't require a Ph.D. in build tooling to maintain. Most MFE posts stop at "here's how to wire up Module Federation." This one is about what happens *after* — the registry service, the shared-dependency war, the `vite preview` surprise, and the chunk-hash trick that lets you prove exactly which routes were affected by any given change.

It's the architecture I'd build again tomorrow.

---

## 1. The problem we were actually solving

If you've been on a frontend team that's outgrown its monolith, you know the shape of this:

- One repo, one build, one deploy. Multiple teams.
- Blast radius is total — every change risks every product surface. Someone's typo in a feature flag config takes down checkout.
- The slowest team in the system sets the cadence for everyone. Shipping a one-line copy fix waits for the team migrating their state library.
- Code review queues stretch into days because every PR touches a codebase the reviewer doesn't have full context on.

The first instinct is "just split the repos." It doesn't work. You still need one shell, one design system, one auth flow, one analytics pipeline, one place to render the navigation. Splitting at the repo level without splitting at the *runtime* level just gives you all the coordination overhead of a monolith with all the integration overhead of microservices.

The actual fix is splitting the runtime. That's micro-frontends. Each product surface becomes an independently built, independently deployed bundle that the shell loads at runtime. Teams own their bundles end to end. The platform team owns the shell, the contracts between shell and bundles, and the infrastructure that holds it together.

The hard part isn't the concept. It's making it boring enough that engineers stop noticing it exists.

## 2. Why Vite Module Federation specifically

Most production MFE deployments in 2024 and earlier defaulted to **Webpack 5's Module Federation plugin**. It's mature, well-documented, and Zack Jackson — the original author — has been refining it for years. If you're already on Webpack, you should probably use it.

We weren't. Our shell and most of our plugins were already on Vite + React 19. Switching the host build system to fit the MFE story would have been the tail wagging the dog.

In Vite-land, there are two real options for Module Federation:

| Library | Status | Best for |
|---|---|---|
| `@originjs/vite-plugin-federation` | Community, mature, broad compat | Teams already on Vite who need MF *now* |
| `@module-federation/vite` | Official, newer, better SSR story | Greenfield or teams who can wait for ecosystem catch-up |

We shipped on **`@originjs/vite-plugin-federation` v1.4.1**. At the time we made the call, the official `@module-federation/vite` package was still maturing — fewer production case studies, some integration friction with the Vite plugins we were already running. The origin.js package was the boring, debuggable choice. It still is for most teams not doing SSR.

> **Aside.** *If you're on Next.js App Router, the picture is different — `@module-federation/nextjs-mf` exists, but the host wiring is its own thing. The architecture below mostly translates, but the build config doesn't.*

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

All four plugins follow this identical pattern. Each exposes exactly one entry point — `'./App': './src/App.tsx'` — which handles its own internal routing via `react-router-dom`. The shell never cares about a plugin's routes; it just mounts `App`.

### The registry

The registry is the only mutable piece in the system. In dev, our DevTools Express server reads and writes `devtools/data/registry.json`. In production, the shell fetches its own static copy from `public/registry.json` as a fallback:

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

`@repo/auth` is declared `singleton: true` in the shell's shared config. That means the auth context — the `useAuth()` hook, the current user object — is the shell's instance, reused by every plugin that calls it. Plugins don't get their own auth; they share the shell's. This is deliberate: one login, one session, everywhere.

The registry is the only thing you change to add, remove, enable, disable, or redirect a plugin. Changing a plugin's URL in the registry instantly redirects the shell to a different build of that plugin — zero downtime, no shell redeploy.

## 4. Proving isolation: the chunk hash story

This is the part of the architecture I'm most proud of, and the part the articles I read didn't cover at all.

The promise of plugin-based MFEs is isolation: changing plugin A should have zero effect on plugins B, C, and D. QA should be able to sign off on plugin A's build and ignore the rest. That promise is easy to state and hard to verify — until you instrument it.

### Why Vite's filename hashes aren't enough

Vite gives every output chunk a content-hash suffix: `Dashboard-Xq55Gds7.js`. If the file changes, the hash changes. Simple, right?

Not quite. Vite's hash reflects the *content* of the chunk including the URLs it imports from other chunks. If chunk B changes its hash, every chunk that imports B will now import a different filename — and its content changes even if its logic is identical. This is **hash chaining**: one change propagates a new hash through the entire import graph, even into chunks that didn't change at all.

So you can't compare builds by filename hashes alone. You need content-level comparison.

### The content-MD5 approach

Our DevTools server snapshots and compares builds using this algorithm:

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

Add one route to the monitoring plugin:

```
1 Added    → Analytics-[hash].js          (new route chunk)
2 Modified → App-[hash].js, remoteEntry.js (entry updated — expected)
N Unchanged → Dashboard, Alerts, Incidents, Services, Settings
```

The unchanged routes need zero re-testing. Every route file that didn't change is byte-for-byte identical, proven by content-MD5.

Add a brand new plugin to the platform:

```
Plugin A (monitoring) → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
Plugin B (QC)         → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
Plugin C (content)    → 0 Added  0 Modified  0 Deleted  N Unchanged  ✓ Isolated
New Plugin            → 14 Added (all new — expected for a new plugin)
```

Existing plugins require zero re-testing when a new plugin is added. That's the isolation guarantee, made verifiable.

## 5. The onboarding pipeline

This is the part that earns the headline. The flow an engineer hits, from zero to a new plugin in the shell:

### In the POC: the DevTools UI

We built a companion DevTools application alongside the platform — an Express API on port 5001 backed by a React web UI. The "New Plugin" flow is entirely point-and-click:

1. Open DevTools at `localhost:5173`
2. Fill in the New Plugin form: id, label, port, accent color, initial routes
3. Click Create

Under the hood, `POST /api/scaffold` runs on the server:
- Creates `apps/<id>/` with a fully-wired `vite.config.ts`, `package.json`, `App.tsx`, and route stubs
- Runs `pnpm install` for the new workspace member
- Runs `pnpm --filter <id> build` automatically
- Registers the plugin in `devtools/data/registry.json`

The shell polls `/api/revision` every 3 seconds. When the DevTools server finishes a build, it increments the revision counter. The shell detects the change and reloads. The new plugin appears in the card grid without the engineer touching a terminal.

From form submission to the plugin rendering in the shell: under a minute.

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

The DevTools approach works for a team all running locally. In production, this becomes a proper pipeline:

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

## 6. The five things that almost broke us

Now the part you can't write before you've shipped it.

### a) React fragmentation — and why `requiredVersion: false` is the fix

The day we onboarded our second plugin, we got two copies of React in the page. Hooks broke in baffling ways — `useContext` returning `undefined` for contexts that were definitely provided.

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

This one cost us half a day on the first setup. `@originjs/vite-plugin-federation` requires built artifacts for remotes. You cannot run a remote in `vite dev` mode and have the shell consume it — the module protocol is different.

The correct dev setup:

```
pnpm build:mfe      # build all remote plugins first (required)
pnpm preview:remotes   # start remotes in vite preview (built artifacts)
pnpm dev:shell      # start shell in vite dev (hot reload works here)
```

The shell benefits from full hot reload. The remotes don't — you rebuild them with `pnpm --filter <id> build` when you change plugin code, then the shell's revision poller detects the new build and reloads. It's not HMR, but it's a 3–5 second round-trip from saving a file to seeing the change, which is workable.

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

## 7. What this architecture unlocks (and what it costs)

Three things become possible that weren't before:

**Plugins ship on their own cadences.** No release train. A plugin team can deploy a one-line copy fix without waiting for the team migrating their state library. Coordination cost on individual changes drops to near zero.

**New plugins onboard in under a minute.** From the scaffold form to the plugin rendering in the shell. The architectural reason this is possible is that the shell knows nothing about specific plugins at build time — adding one is a registry change, not a shell change.

**Isolation is verifiable.** The chunk-hash comparison from section 4 turns "trust the build system" into "here are the diffs, here's what changed, here's what didn't." QA scope shrinks from "everything" to "the plugin that changed."

What gets worse, because nothing is free:

- **Observability complexity.** Source maps become per-plugin, per-version. A Sentry stack trace needs additional context to resolve to "this came from `plugin-cms`, build a4f9c2." Build tooling for this from day one.
- **Shell deploys become higher-stakes.** When the shell changes something that touches the plugin contract — the auth context shape, the navigation bridge — it affects every plugin simultaneously. Shell changes are rarer than plugin changes but need more review rigor.
- **The platform layer becomes real ongoing work.** Registry operations, DevTools maintenance, design system versioning. A two-person platform team can support ten product engineers well. One person can't. Account for this load before you start.
- **The `base` URL problem multiplies.** Every plugin has an environment-specific build. Your CI needs to know what CDN path each plugin lands on. Solvable, not free.

## 8. What I'd do differently

A few things, with the benefit of having shipped it:

**Build the registry and DevTools first, not last.** Everything in this post bends back to the registry — the source of truth for what plugins exist and where they live. We hand-rolled it after the first three plugins were already running with hardcoded URLs in three different config files across two repos, plus a switch statement in the shell. Migrating later was painful for two weeks: every plugin had to be rebuilt with the new dynamic-loading pattern, every developer had to relearn the workflow, and the temptation to keep the hardcoded shortcuts "just for this one thing" was constant. The DevTools UI for scaffold, build, and compare came later still. Start with the registry service on day one. Build the DevTools before the third plugin.

**Pick `@module-federation/vite` from day one if you're greenfield.** The official package has matured since we made our call. The `@originjs` plugin is still the right choice for many teams, but the gap has narrowed. If you're starting today with no existing Vite config investment, the official package is worth evaluating, especially for SSR.

**Don't try to share state libraries across the federation boundary.** Sharing Redux, Zustand, or Jotai stores between the shell and plugins is the moment this architecture starts to hurt. Share the design system, share the auth context, share the utility types. Let plugins own their state. State coupling between plugins is a design smell that means you've drawn the boundary in the wrong place.

**Instrument the isolation guarantee early.** The chunk-hash comparison system (section 4) was the thing that made this architecture real to skeptical stakeholders. "Unchanged" chunks with matching MD5s is a far more persuasive answer to "how do we know plugin B wasn't affected?" than "trust the build system." Build the comparison tooling before you need to defend the architecture in a post-incident review.

**Treat the `base` URL as a first-class deployment concern.** It's easy to miss in local dev where everything is localhost. It becomes the thing that breaks your first staging deploy. Add it to your plugin scaffolding template, document it explicitly, and build your CI pipeline with multi-environment `base` resolution from the start.

---

If you've built or are building a Vite Module Federation platform and disagree with any of this — especially the `@originjs` vs `@module-federation/vite` call, the `requiredVersion: false` approach, or whether the registry-as-JSON-file scales past a dozen plugins — I'd genuinely like to hear it. The corners of frontend infrastructure that aren't well-documented are the ones I most want to learn from.

— Nishant
