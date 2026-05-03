---
title: "Turborepo at team scale: cache invalidation patterns I wish I'd known"
description: "What happens when a shared package changes and twelve apps need to rebuild — and only some of them should. The mental model for Turbo's task graph that makes cache invalidation predictable."
slug: "turborepo-cache-invalidation-patterns"
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?fm=jpg&q=80&w=1200&h=630&fit=crop"
coverImageAlt: "Server infrastructure with interconnected cables and glowing lights representing a distributed build pipeline"
ogImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?fm=jpg&q=80&w=1200&h=630&fit=crop"
date: "2026-05-03"
lastUpdated: "2026-05-03"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a Senior Frontend Engineer at Samsung Electronics, building micro-frontend platforms, MCP tooling, and AI-assisted developer systems across a Turborepo monorepo with 14 apps, 8 shared packages, and 28 MCP servers."
tags: ["turborepo", "monorepo", "react", "build-systems", "developer-experience"]
---

# Turborepo at team scale: cache invalidation patterns I wish I'd known

This started with a Slack message from a teammate: *"Why did my PR rebuild all 12 apps? I only changed a comment in `@repo/utils`."*

Good question. That was the moment I realized we understood Turborepo well enough to set it up, but not well enough to reason about it. There's a gap between "turbo works" and "turbo works predictably," and that gap lives almost entirely in cache invalidation.

Here's the mental model that closed it for me.

---

## The task graph is not the dependency graph

This is the first thing I got wrong. I assumed Turbo's task graph mirrored the npm dependency graph. It doesn't — it's derived from it, but they're different things.

Turbo builds a **task graph**: nodes are `(package, task)` pairs, and edges are the `dependsOn` relationships you declare in `turbo.json`. The npm dependency graph tells you which packages import which. The task graph tells you which tasks must complete before other tasks can start.

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

The `^` prefix is the key. `"^build"` means *run the `build` task in all my upstream dependencies first*. Without it, `"build"` means *run the `build` task in this same package first* — a self-referential dependency that rarely makes sense for build tasks, but is exactly right for `test` depending on `build`.

So when `@repo/ui` changes, Turbo doesn't ask "which packages import `@repo/ui`?" It asks: "which `build` tasks depend on the output of `@repo/ui`'s `build` task?" That's a narrower question. The answer only includes packages that declared `"^build"` as a dependency — not every package that lists `@repo/ui` in its `package.json`.

The distinction matters because `peerDependencies` and `devDependencies` don't create task graph edges by default. A Storybook package that dev-depends on `@repo/ui` won't trigger a rebuild unless Turbo can trace a `dependsOn` path to it.

---

## What actually goes into a cache key

A cache hit means Turbo found an entry where every input matched. That entry is keyed on four things:

1. **File hashes** — the content of every file matched by `inputs` (default: all files in the package directory)
2. **Dependency task outputs** — the hash of what each `dependsOn` task produced
3. **Environment variables** — everything listed in `env` or `globalEnv`
4. **Task configuration** — the relevant section of `turbo.json` itself

Change any of these and the cache misses.

The footgun is `inputs`. By default, Turbo hashes *all files* in a package directory. Changing a test file, a README, or a `.stories.tsx` file invalidates the build cache — even if the compiled output is byte-for-byte identical. For a package like `@repo/ui` with 50 components and 79 test files, this produces a constant stream of spurious invalidations.

The fix is explicit `inputs` scoping:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "package.json", "tsconfig.json"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": [],
      "inputs": ["src/**", "**/*.test.tsx", "vitest.config.ts"],
      "outputs": []
    }
  }
}
```

Now a change to `Button.test.tsx` invalidates the `test` cache but not the `build` cache. If the compiled output of `@repo/ui` didn't change, every downstream app stays green.

After scoping inputs in our monorepo, we went from 14 apps rebuilding on every `@repo/ui` commit to an average of 3. The other 11 got cache hits because the specific build inputs — the `dist/` artifacts from `@repo/ui` — were unchanged.

---

## The `outputs` field is not optional

If you don't declare `outputs`, Turbo can't cache task artifacts. It'll run the task, but it won't store results for downstream tasks to depend on — and it can't restore them on a cache hit.

For every task that produces files, declare them explicitly:

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

`outputs: []` is valid and useful. It tells Turbo the task produces no files, but the exit code is still cached. A lint pass that exits 0 won't re-run unless inputs change. A lint pass that exits non-zero doesn't get cached at all — Turbo won't serve you a cached failure.

---

## How `--filter` changes what runs

When I want to understand the blast radius of a change before pushing, I reach for the `[HEAD^1]` filter syntax:

```bash
# See what tasks would run, without actually running them
turbo build --filter=...[HEAD^1] --dry-run
```

The `...` prefix means "and everything that depends on this." So `--filter=@repo/ui...` runs the build for `@repo/ui` and every package that transitively depends on it. The `[HEAD^1]` variant scopes it to packages with changes since the last commit.

Three patterns I use constantly:

```bash
# Changed packages plus all their downstream dependents
turbo build --filter=...[HEAD^1]

# A single package in isolation, ignoring its dependents
turbo build --filter=@repo/ui

# Only apps (not libraries) affected by recent changes
turbo build --filter=./apps/...[HEAD^1]
```

The `--dry-run` output is the best debugging tool in Turbo's kit. It shows you the exact task graph it would execute, which tasks would hit the cache, and which would run fresh. I run it before every CI push that touches a shared package.

---

## The env var trap

Environment variables are the silent cache poisoners.

If an app reads `VITE_API_URL` at build time and Turbo doesn't know about it, you get two failure modes running in parallel:

1. **False cache hits** — Turbo serves a cached build that was compiled against a different `VITE_API_URL`
2. **False cache misses** — A `.env.local` change that Turbo doesn't track forces a full rebuild of everything

Declare env vars explicitly:

```json
{
  "globalEnv": ["NODE_ENV", "CI"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "env": ["VITE_API_URL", "VITE_AUTH_DOMAIN"],
      "outputs": ["dist/**"]
    }
  }
}
```

`globalEnv` variables affect all task cache keys. `env` on a specific task only affects that task. Undeclared env vars are invisible to Turbo — it won't include them in the hash.

We had a two-week incident where staging builds were intermittently serving production API responses. Root cause: `VITE_API_URL` wasn't declared in `env`, so both staging and production builds shared an identical cache key. Turbo was handing out production artifacts to staging deploys.

Declaring env vars didn't just fix the bug — it made the cache semantics visible. Now when a build behaves unexpectedly in a specific environment, the first question is whether the relevant env vars are declared.

---

## Remote caching and the determinism requirement

Local caching helps individuals. Remote caching helps teams — every cache entry is shared across machines, so a build that ran in CI is a hit on a teammate's laptop.

```bash
npx turbo login
npx turbo link
```

What remote caching exposes immediately: non-deterministic build outputs. One of our packages was embedding `new Date()` into its bundle as a build timestamp. Every build produced a different hash, so the remote cache was always a miss for that package — across every machine, forever.

Fixing it (switching to a build timestamp derived from `git log --format="%ct" -1`) made that package's builds shareable for the first time. Remote cache hit rate jumped from ~40% to ~85% for that package within a week.

Non-determinism in outputs is the enemy of cache hit rates. If your numbers are lower than expected, look for timestamps, random IDs, or absolute file paths embedded in build artifacts.

---

## The mental model, distilled

Cache invalidation in Turborepo is predictable once you hold this chain in your head:

**File changes → input hash changes → cache miss → task runs → output hash changes → downstream tasks miss → those tasks run**

Every step is deterministic. The unpredictability comes from not knowing which files are `inputs`, which env vars are inputs, and which tasks are downstream. Make those explicit — through `inputs`, `env`, and `dependsOn` — and the behavior stops surprising you.

---

## What I'd change about our initial setup

Three things I'd do from day one:

**Scope `inputs` immediately.** Don't wait until you're debugging spurious invalidations. Add `inputs` fields at setup time: `["src/**", "package.json", "tsconfig.json"]`. Test files go in test task inputs only.

**Audit env vars before enabling remote caching.** Run `turbo build --summarize` and read the environment section. Any `VITE_*`, `NEXT_PUBLIC_*`, or build-time config that isn't in `env` is a latent bug.

**Use `--dry-run` in code review.** Before merging a PR that touches a shared package, run `turbo build --filter=...[HEAD^1] --dry-run` and paste the output in the PR description. It makes the rebuild scope visible to every reviewer — and it takes about five seconds.

The Turborepo docs are excellent at teaching the API. The mental model — the task graph, the four inputs to every cache key, the output propagation chain — has to be built through production use. These are the patterns I wish someone had handed me on day one.
