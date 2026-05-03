---
title: "interactive-dashboard-library: The Headless Dashboard Framework I Built for Our Office"
description: "Plain static dashboards everywhere. I built a headless framework that made them interactive — drag, drop, resize, real-time config, responsive widget views. Now used in monitoring, analytics, and customer-facing apps."
slug: "headless-dashboard-library"
date: "2026-05-03"
lastUpdated: "2026-05-03"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a frontend engineer who built interactive-dashboard-library — a headless dashboard framework used across monitoring, analytics, and market-facing apps at his company."
tags: ["react", "typescript", "dashboard", "zustand", "headless-ui"]
---

# interactive-dashboard-library: The Headless Dashboard Framework I Built for Our Office

Nobody asked me to build this. I saw the problem, got tired of watching it compound, and decided to fix it properly.

That's the short version. The longer version is about what it took to build a framework that twelve teams now rely on, why the headless architecture decision turned out to be the right one, and the week-long debugging session that came down to a single commit.

> **Key Takeaways**
> - Every team across the office was rebuilding drag, drop, and resize from scratch. I built it once so nobody had to again.
> - "Headless" means the library owns interaction logic; each team keeps its own visual identity.
> - The killer feature is responsive widget views: widgets show summary numbers when small, charts at ~500px, full tables at ~800px.
> - The framework ships inside the monorepo AND as an internal GitHub package for teams outside it.
> - In production: 11 built-in widgets, 4 consuming apps, ~12 teams reached, ~9,000 lines of TypeScript.

[IMAGE: A dashboard canvas showing multiple widgets at different sizes - some small with summary numbers, some wide with charts, one full-width with a data table - search terms: "analytics dashboard widgets responsive layout"]

## The Problem: Static Dashboards, Everywhere, Forever

Walk into any team's codebase and you'd find a dashboard. Monitoring dashboards. Content analytics. QC pipelines. Incident tracking. Each one visually different, each one structurally identical: widgets sitting on a page, showing numbers, doing nothing when you tried to move them.

Static. All of them.

And behind every one of those dashboards, the same story: somebody had copied a drag-and-drop implementation from a previous project, patched in a resize library that didn't quite fit, built a custom localStorage hook to persist the layout, and called it done. Then the next team did the same thing. Different libraries, different APIs, incompatible widget contracts. No widget built in one project could be dropped into another.

[PERSONAL EXPERIENCE] I counted the implementations across the codebases I had access to. Four distinct drag-and-drop solutions. Three separate resize approaches. Five different ways to serialize dashboard state to storage. None of them talked to each other. The duplication wasn't just aesthetic: it was active maintenance debt. A bug found in one was silently alive in three others.

I built `interactive-dashboard-library` to fix that. One substrate, built properly, used everywhere.

[INTERNAL-LINK: why headless UI works at scale → component architecture principles]

## Why Headless? Because Teams Don't Give Up Their Identity

The first architectural decision was the most important. I could have built a component library: opinionated, styled, ship the widgets and the chrome together. Teams drop it in, they get something that looks good immediately, they customize around the edges.

That's the wrong call for an office context.

Every product team has a design system. Marketing dashboards use different typography than internal ops tools. Customer-facing apps have brand constraints that internal tooling doesn't. If I shipped an opinionated UI, I'd be asking twelve teams to either fight the styles or ignore the library.

So I went headless.

[UNIQUE INSIGHT] "Headless" in this context means one specific thing: I own the interaction logic and nothing else. Drag, drop, resize, state management, persistence, polling, widget-to-widget communication — all mine. Visual output — yours. Teams pass Tailwind classes to every surface. They keep their visual identity. They get the interactivity for free.

The API reflects this. You don't configure a visual theme. You configure behavior:

```typescript
interface WidgetRegistration {
  type: string
  label: string
  component: React.ComponentType<WidgetComponentProps>
  defaultSize: Size
  icon?: React.ComponentType
  settings?: React.ComponentType<WidgetSettingsProps>
  description?: string
  category?: string
  tags?: string[]
}
```

Register your component, define a default size, optionally provide a settings panel. Everything else — drag handles, resize handles, edit mode, view mode, persistence, polling — activates automatically. A team can register a custom widget in an afternoon and have it behave identically to the eleven built-in widgets.

That was the promise. The reception surprised me. Teams weren't just relieved — they were enthusiastic. Designers started proposing dashboard layouts they'd never have suggested before because they knew interactivity wasn't a dev-time negotiation anymore.

[INTERNAL-LINK: headless component patterns in React → headless UI deep dive]

## The Killer Feature: Widgets That Know Their Own Size

Here's the thing I'm most proud of, and it's not technically the hardest part to build.

Every widget has three views, and it switches between them based on how much space it occupies on the canvas.

When a widget is small — the user has resized it down to a compact tile — it shows the key number. The headline metric. Nothing else. When the widget grows to around 500px wide, the chart appears. Trend lines, historical data, visual context. When it hits around 800px, the full table renders alongside additional charts.

[ORIGINAL DATA] The same widget, three different information densities, selected automatically based on real-time size. A monitoring dashboard can have a wall of compact KPI tiles on the left side and one wide stream-health chart on the right. A manager reviewing the dashboard at a glance gets the summary numbers. A developer who needs detail resizes a widget and the detail is there.

Users also configure widgets in real time: pick the API endpoint, set the polling interval, delete widgets they don't need. One dashboard serves multiple stakeholders without anyone needing a custom build.

This is what turned `interactive-dashboard-library` from a useful DX improvement into something that actually changed how people used the dashboards they were building.

[IMAGE: Side-by-side comparison showing the same widget in three sizes - compact number tile, medium chart view, wide table view - search terms: "responsive widget dashboard resize layout"]

## The Technical Decisions That Held Up

### Zustand with `subscribeWithSelector`: Why Fine-Grained Subscriptions Matter

State is managed by Zustand with the `subscribeWithSelector` middleware, wrapped in React Context for dashboard-scoped isolation.

On a dashboard with thirty active widgets polling at different intervals, this is the difference between 60fps and visible jank. A widget that only cares about its own position doesn't re-render when an unrelated widget moves. `subscribeWithSelector` makes that possible: each widget subscribes to exactly the slice of state it needs and ignores everything else.

The full-store subscription approach I prototyped first was fine at five widgets. At twenty, it stuttered. At thirty, it was unusable. Fine-grained subscriptions fixed it completely.

### The Mode-Transition Bug: A Week to Find, One Commit to Fix

This one still gets to me.

The library has two modes: edit mode (drag handles visible, layout configurable) and view mode (widgets locked, real-time data updating). When a user toggles between them, the dashboard should feel seamless. Instead, every widget would jump — a sub-pixel position shift that the eye catches immediately.

I tried everything obvious. Forcing `transform: translate3d(0,0,0)` at the layout root. CSS `contain: layout`. Memoizing the layout calculations. Nothing worked because nothing was wrong with the calculations. The positions were correct before and after. The rendering pipeline was doing something different between the two modes.

The fix was empirical: at the moment of mode switch, capture every widget's actual DOM position with `getBoundingClientRect()`. Use those captured values as the animation start point. Let Framer Motion interpolate from "where the widget actually was on screen" to "where the widget mathematically should be." The layout never jumps because I never let it. The user sees a smooth transition that papers over a rendering inconsistency in the engine below.

A week to find. One commit to apply. That's the kind of problem that defines a library.

### Pluggable Persistence: One API, Any Storage Backend

Persistence defaults to `localStorage` but uses an adapter pattern:

```typescript
const [layout, setLayout] = usePersistence(
  'dashboard-key',
  defaultLayout,
  createPersistenceAdapter(localStorage) // or sessionStorage, or a backend adapter
)
```

Swap the adapter, nothing else changes. One consuming app persists to a backend API. Another uses localStorage. A third uses URL state for shareable layouts — users can send a link and the recipient sees the exact dashboard configuration. All three use the same library. The persistence choice is the only variable.

[INTERNAL-LINK: state persistence patterns in React applications → localStorage vs backend state]

### The Event Bus: Signals Between Independent Widgets

When a filter widget needs to tell a chart widget to refetch with a new date range, you have two options: push that communication through a shared store, or use an event bus.

```typescript
// Filter widget emits
const { emit } = useWidgetEvents(widgetId)
emit('filterChange', { dateRange: selectedRange })

// Chart widget listens
useWidgetEvents(chartWidgetId, {
  filterChange: ({ dateRange }) => refetch(dateRange)
})
```

I chose the event bus deliberately. Stores are good for state that needs to be inspectable and persistent. Events are good for transient signals between independent components. Mixing them for cross-widget communication creates a store that's half-state, half-message-queue — and nobody understands it six months later.

### `useWidgetData`: One Hook, Full Data Lifecycle

Each widget fetches its own data through a single hook:

```typescript
const { data, loading, error } = useWidgetData<StreamMetrics>({
  endpoint: '/api/stream/metrics',
  pollingInterval: 5000,
  cacheEnabled: true,
  cacheDuration: 30,
})
```

The hook handles AbortController cleanup on unmount, cache invalidation, loading and error states, and configurable polling. A monitoring widget polling every 5 seconds and a KPI widget polling every 60 seconds coexist on the same dashboard without any coordination overhead. They're independent. They just work.

[CHART: Timeline chart showing polling intervals across 30 widgets on one dashboard - data: 5s, 10s, 15s, 30s, 60s intervals - source: interactive-dashboard-library internal metrics]

## Distribution: Inside and Outside the Monorepo

The library lives inside the React monorepo as a workspace package, available to any app in the repo with a single package.json entry. But some teams work in separate repositories — older codebases, different tech stacks at the edges.

For those teams, I published `interactive-dashboard-library` as an internal GitHub package. I also wrote documentation on the company's internal GitHub: integration guides, API references, the AI-native schema docs, full example apps. Teams outside the monorepo install it the same way they'd install any npm package. They get the same API, the same widgets, the same hooks.

The documentation investment paid off faster than I expected. Teams I'd never spoken to were filing feature requests within two weeks of the internal publish.

[INTERNAL-LINK: monorepo package distribution patterns → workspace package publishing]

## Adoption and What Changed

Four apps in production. About twelve teams reached. Monitoring dashboards, analytics tools, internal ops apps, and two customer-facing products.

The DX change was immediate: teams stopped rebuilding drag, drop, resize, and persistence. Those conversations just stopped happening. What replaced them were conversations about the actual product — what data to show, how to structure the widget hierarchy, which built-in widget to extend versus building custom.

[PERSONAL EXPERIENCE] The UX change took a few weeks to fully show up. Once teams shipped interactive dashboards to real users, the feedback loop closed quickly. Users resized widgets. They bookmarked shareable layouts. They spent more time in dashboards they'd previously visited to check one number and leave. The interactivity changed how people actually used the tools.

Designer creativity increased in a way I hadn't predicted. Before, designers proposed static layouts because they knew interactivity was a negotiation with dev time. After, they proposed layouts that assumed interactivity, because it was free. That shift in what felt possible was the outcome I hadn't explicitly planned for.

## The Numbers

| Metric | Value |
|---|---|
| Built-in widgets | 11 |
| Consuming apps in production | 4 |
| Product teams reached | ~12 |
| Source files | 90 |
| Lines of TypeScript | ~9,000 |
| Custom hooks | 10 |
| Test files | 17 |
| Documentation files | 9 |

## What I'd Tell Someone Building This

The headless decision was right, but it required discipline to maintain. Every time I was tempted to ship a styled default, I asked: will twelve teams with twelve design systems all be okay with this choice? Usually the answer was no, and I'd pull the style back into a CSS custom property or a className prop.

The responsive widget views were the hardest feature to spec and the easiest to explain to users. The implementation is straightforward — track the widget's rendered width, switch views at breakpoints. The hard part was deciding what each tier should show. That required conversations with actual dashboard users, not engineers.

The mode-transition bug took a week because I was looking for a logical error in code that had no logical errors. The DOM was doing something physically inconsistent between two render modes. Once I accepted that the code was correct and the rendering pipeline was the variable, the empirical fix became obvious.

Nobody asked me to build this. But once it existed, I couldn't imagine how we'd functioned without it.

[INTERNAL-LINK: more personal projects and technical deep dives → writing section]
