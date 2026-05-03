---
title: "interactive-dashboard-library: The Headless Dashboard Framework I Built for Our React Monorepo"
description: "I built interactive-dashboard-library from scratch — a headless React dashboard framework with drag, resize, responsive widget views, and pluggable persistence. Here's the full technical story."
slug: "headless-dashboard-library"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=80&w=1200&h=630&fit=crop"
coverImageAlt: "Multiple data dashboards displayed on screens showing charts, KPIs, and analytics panels"
ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=80&w=1200&h=630&fit=crop"
date: "2026-05-03"
lastUpdated: "2026-05-03"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a frontend engineer who built interactive-dashboard-library — a headless dashboard framework used across monitoring, analytics, and market-facing apps. He specialises in React, TypeScript, and developer tooling."
tags: ["react", "typescript", "monorepo", "dashboard", "zustand"]
---

Nobody asked me to build this. I noticed that every app in the office had plain, static, boring dashboards, and I decided to fix it.

Every team was using a different chart library with no standardisation across the codebase. Every team was rebuilding drag, drop, resize, and layout persistence from scratch — each time, independently, incompatibly. I saw the same structural problem wearing different clothes in every corner of the product. So I built `interactive-dashboard-library`: a headless UI framework that centralises all the complex interaction logic so teams can focus on their actual product. This is the full technical account of why it was hard, what the key decisions were, and what made them work.

> **Key Takeaways**
> - Headless design means teams own the visual layer; the library owns drag, resize, state, and persistence.
> - Responsive widget breakpoints (small, ~500px, ~800px) let one widget serve multiple stakeholders at different data densities.
> - Zustand usage grew from 28% to 41% among React developers in one year ([State of React 2024](https://2024.stateofreact.com/en-US/libraries/state-management/)).
> - A pluggable persistence adapter supports localStorage, URL state for shareable dashboards, and backend API — same library, adapter differs.
> - Published as an internal GitHub package so teams outside the monorepo can install it too.

## What Made the Old Setup Unsustainable

The problem wasn't duplication alone — it was compounding incompatibility. In 2025, GitClear found that copy-pasted code grew from 8.3% to 12.3% of all changed lines between 2021 and 2024, analyzed across 211 million lines of code ([GitClear "AI Copilot Code Quality: 2025 Data"](https://www.gitclear.com/ai_assistant_code_quality_2025_research), February 2025). Each team that forks a pattern diverges from it, and those divergences accumulate into systems that can't talk to each other.

Each team reinventing drag, resize, and persistence is expensive. But that's not the main problem. The main problem is that independently built implementations can't interoperate. A widget from one app runs a different event model than one from another. Saved layouts use different JSON shapes and can't be shared. A drag bug discovered in one codebase exists identically in three others and won't get fixed in any of them except by accident.

[PERSONAL EXPERIENCE] The apps I was looking at spanned monitoring dashboards, content analytics, QC pipelines, and incident tracking — plus customer-facing product dashboards. Different data, identical structural requirements. Every team was building the same thing under different constraints and arriving at subtly incompatible solutions. The irony wasn't subtle once you saw it clearly.

What makes this pattern so persistent? It's because each team's dashboard feels unique from the inside. The monitoring team's needs seem different from the analytics team's. They are different at the data layer. At the structural layer — drag, resize, layout, polling, persistence — they're the same problem wearing different clothes every time.

![Developer hands typing code on a laptop with multiple browser tabs showing interactive UI components](https://images.unsplash.com/photo-1555099962-4199c345e5dd?fm=jpg&q=80&w=1200&h=630&fit=crop)

> **Citation Capsule:** In 2018, Stripe's "Developer Coefficient" report found that developers spend 42% of their working time on technical debt and bad code, representing approximately $85 billion per year in lost productivity globally ([Stripe, 2018](https://stripe.com/files/reports/the-developer-coefficient.pdf)). At monorepo scale, duplicated dashboard infrastructure is one of the most predictable sources of that waste. Multiple teams building the same structural layer independently isn't a product investment — it's scheduled debt accumulation.

<!-- [INTERNAL-LINK: shared packages in a pnpm monorepo → pillar on monorepo architecture] -->

## The Headless Architecture Decision

The right answer is: the library owns interaction and state; consuming teams own layout and data. That single boundary determines everything downstream — flexibility, brittleness, and how many teams can adopt it without friction.

The most important decision wasn't which drag library to use. It was whether the library would own the layout or just the interaction. Headless means the `Dashboard` component is a state provider, not a layout container. It wraps children with React Context and exposes actions. It doesn't touch DOM layout. The developer brings whatever CSS their product requires — grid, flex, absolute, whatever their design calls for. The library handles drag, resize, settings, persistence, and state. Those concerns are permanently separated.

There are three API levels. Level 1 is `DashboardCard` — a headless wrapper for any React component. It brings drag, resize, settings, and mode switching. You provide the content. Level 2 is pre-built widgets: `DashboardCard` plus a chart library — `RechartsWidget`, `KPIWidget`, `NivoWidget`. That's the convenience layer. Level 3 is direct usage: a chart library inside `DashboardCard` with full control over every prop.

In April 2025, WebAIM found that 94.8% of the top 1 million homepages have at least one WCAG 2 failure, averaging 51 accessibility errors per homepage ([WebAIM Million Report](https://webaim.org/projects/million/2025), April 2025). Accessibility was non-negotiable from the start. Every interactive element — the settings popover, polling interval slider, delete confirmation dialog, drag handles — is built on Radix UI primitives. Accessible behavior by default, not by audit.

In 2025, TypeScript became the number-one most used language on GitHub by contributor count, with 66% year-over-year contributor growth ([GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)). The `WidgetRegistration` contract reflects that: strict types, a small surface, and nothing optional that shouldn't be. The interface is intentionally narrow.

![Dark server rack with blinking blue LEDs representing distributed state and data flow architecture](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?fm=jpg&q=80&w=1200&h=630&fit=crop)

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

A team registers a custom widget alongside the eleven built-ins and immediately gets drag-drop, resize, settings panel, edit/view mode, and persistence — for free. They only write the data logic and render output. The contract is the guarantee: small enough to learn in an afternoon, strict enough to catch mistakes at compile time.

<figure>
<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="interactive-dashboard-library five-layer architecture diagram showing Persistence, State, Interaction, Widget, and AI layers from bottom to top">
  <rect width="560" height="320" rx="12" style="fill:var(--bg-secondary);stroke:var(--border-color)" stroke-width="1"/>
  <text x="280" y="28" font-size="14" font-family="system-ui,sans-serif" text-anchor="middle" font-weight="600" style="fill:var(--text-primary)">interactive-dashboard-library: Five-Layer Architecture</text>
  <!-- Layer 1: Persistence (bottom) -->
  <rect x="40" y="266" width="480" height="38" rx="4" fill="#1e3a5f"/>
  <text x="50" y="290" font-size="12" font-family="system-ui,sans-serif" font-weight="600" fill="#ffffff">Persistence Layer</text>
  <text x="210" y="290" font-size="11" font-family="system-ui,sans-serif" style="fill:var(--text-muted)">localStorage / sessionStorage / custom adapter</text>
  <!-- Layer 2: State -->
  <rect x="40" y="220" width="480" height="38" rx="4" fill="#1e4d8c"/>
  <text x="50" y="244" font-size="12" font-family="system-ui,sans-serif" font-weight="600" fill="#ffffff">State Layer</text>
  <text x="210" y="244" font-size="11" font-family="system-ui,sans-serif" style="fill:var(--text-muted)">Zustand + subscribeWithSelector + React Context</text>
  <!-- Layer 3: Interaction -->
  <rect x="40" y="174" width="480" height="38" rx="4" fill="#2563eb"/>
  <text x="50" y="198" font-size="12" font-family="system-ui,sans-serif" font-weight="600" fill="#ffffff">Interaction Layer</text>
  <text x="210" y="198" font-size="11" font-family="system-ui,sans-serif" style="fill:var(--text-muted)">dnd-kit drag + re-resizable + framer-motion</text>
  <!-- Layer 4: Widget -->
  <rect x="40" y="128" width="480" height="38" rx="4" fill="#3b82f6"/>
  <text x="50" y="152" font-size="12" font-family="system-ui,sans-serif" font-weight="600" fill="#ffffff">Widget Layer</text>
  <text x="210" y="152" font-size="11" font-family="system-ui,sans-serif" style="fill:var(--text-muted)">11 built-in widgets + custom registry + responsive views</text>
  <!-- Layer 5: AI (top) -->
  <rect x="40" y="82" width="480" height="38" rx="4" fill="#60a5fa"/>
  <text x="50" y="106" font-size="12" font-family="system-ui,sans-serif" font-weight="600" fill="#ffffff">AI Layer</text>
  <text x="210" y="106" font-size="11" font-family="system-ui,sans-serif" fill="#ffffff">JSON schema + factory functions + 4 templates</text>
  <!-- Arrow indicators -->
  <text x="22" y="110" font-size="18" font-family="system-ui,sans-serif" style="fill:var(--text-muted)">&#8593;</text>
  <text x="22" y="290" font-size="18" font-family="system-ui,sans-serif" style="fill:var(--text-muted)">&#8595;</text>
</svg>
<figcaption>interactive-dashboard-library's five-layer architecture — each layer is independently replaceable</figcaption>
</figure>

> **Citation Capsule:** TypeScript became GitHub's number-one language by contributor count in 2025, with 66% year-over-year growth ([GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)). The `WidgetRegistration` contract — small and strict by design — is the boundary between library concerns (interaction, state, persistence) and product concerns (data, display, domain logic). Small contracts compose; large ones leak.

<!-- [INTERNAL-LINK: headless UI patterns with Radix → supporting article] -->

## How Does Responsive Widget Sizing Work?

Responsive widget breakpoints are one of the features I'm most pleased with. Each widget has three distinct view states based on how large the user has resized it — not the viewport, but the widget itself. One dashboard can serve multiple stakeholders without building separate dashboards.

At its initial or compact size, a widget shows only key details: summary numbers, a status indicator, a single KPI. At around 500px width, charts and trends appear. The user gets a sparkline or bar chart alongside the headline numbers. At around 800px width, the widget expands to full tables, additional charts, and the complete data picture.

[ORIGINAL DATA] This breakpoint system was the feature that made designers think differently about dashboard layouts. Before the library existed, designers had no reason to design interactive, resizable dashboards — the engineering cost was prohibitive every time. Once the framework existed, they started proposing layouts that take advantage of the resize behavior as a first-class design tool.

Why does this matter beyond aesthetics? Consider a monitoring dashboard showing incident data. A senior engineer might expand a widget to full table view for a deep investigation. A manager scanning the same dashboard leaves the same widget at compact view for a quick status check. Same widget, same data endpoint, entirely different information density — controlled entirely by the user's resize behavior. No configuration required. No separate dashboard variants to maintain.

Users can also delete unwanted widgets entirely and configure each widget in real time. The settings panel lets users choose the data endpoint and set the polling interval without leaving the dashboard. That means one dashboard template can serve a monitoring use case and an analytics use case just by pointing widgets at different endpoints.

<!-- [INTERNAL-LINK: widget breakpoint patterns in React → supporting article on container queries] -->

## Zustand State Management: The React Dashboard Problem Nobody Talks About

Free-position layout and fine-grained subscriptions are the two decisions that separate a dashboard library that performs from one that janks. Here's what each solves and why the obvious alternatives fail.

Grid systems like `react-grid-layout` and CSS Grid snap widgets to rows and columns. For content dashboards that's fine. For operations dashboards, widget size communicates priority — a large chart signals importance, not just available space. Free-position absolute layout lets widgets go anywhere, resize to any dimension, and overlap if the user chooses. The tradeoff is that you own collision detection. I chose freedom over guard rails.

How do you keep thirty independently polling widgets from wrecking the frame rate? The answer is Zustand's `subscribeWithSelector` middleware. A widget subscribes only to its own slice of store state. When an unrelated widget updates its position, no re-render fires elsewhere. On a dashboard with thirty active widgets polling at different intervals, this is the decision that keeps the frame rate at 60fps.

In 2024, Zustand usage grew from 28% to 41% among React developers in a single year, with the highest positivity score of any dedicated state management library ([State of React 2024](https://2024.stateofreact.com/en-US/libraries/state-management/)). The growth reflects exactly this pattern: fine-grained subscriptions without the boilerplate of Redux or the rigidity of Context-only solutions.

<figure>
<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bar chart comparing re-renders per poll cycle: 30 without subscribeWithSelector versus 1 with subscribeWithSelector">
  <rect width="560" height="320" rx="12" style="fill:var(--bg-secondary);stroke:var(--border-color)" stroke-width="1"/>
  <text x="280" y="28" font-size="13" font-family="system-ui,sans-serif" text-anchor="middle" font-weight="600" style="fill:var(--text-primary)">Fine-grained subscriptions eliminate render cascades</text>
  <!-- Y-axis label (rotated) -->
  <text x="18" y="200" font-size="10" font-family="system-ui,sans-serif" text-anchor="middle" transform="rotate(-90,18,200)" style="fill:var(--text-muted)">Re-renders per poll cycle</text>
  <!-- Y-axis ticks -->
  <line x1="55" y1="270" x2="55" y2="45" style="stroke:var(--border-color)" stroke-width="1"/>
  <text x="48" y="274" font-size="10" font-family="system-ui,sans-serif" text-anchor="end" style="fill:var(--text-muted)">0</text>
  <text x="48" y="200" font-size="10" font-family="system-ui,sans-serif" text-anchor="end" style="fill:var(--text-muted)">15</text>
  <text x="48" y="50" font-size="10" font-family="system-ui,sans-serif" text-anchor="end" style="fill:var(--text-muted)">30</text>
  <!-- Baseline -->
  <line x1="55" y1="270" x2="500" y2="270" style="stroke:var(--border-color)" stroke-width="1"/>
  <!-- Bar 1: Without subscribeWithSelector - 30 re-renders -->
  <rect x="140" y="40" width="120" height="230" rx="4" fill="#f97316"/>
  <text x="200" y="32" font-size="13" font-family="system-ui,sans-serif" text-anchor="middle" font-weight="700" style="fill:var(--text-primary)">30</text>
  <text x="200" y="288" font-size="10" font-family="system-ui,sans-serif" text-anchor="middle" style="fill:var(--text-muted)">Without</text>
  <text x="200" y="300" font-size="10" font-family="system-ui,sans-serif" text-anchor="middle" style="fill:var(--text-muted)">subscribeWithSelector</text>
  <!-- Bar 2: With subscribeWithSelector - 1 re-render -->
  <rect x="300" y="262" width="120" height="8" rx="2" fill="#3b82f6"/>
  <text x="360" y="254" font-size="13" font-family="system-ui,sans-serif" text-anchor="middle" font-weight="700" style="fill:var(--text-primary)">1</text>
  <text x="360" y="288" font-size="10" font-family="system-ui,sans-serif" text-anchor="middle" style="fill:var(--text-muted)">With</text>
  <text x="360" y="300" font-size="10" font-family="system-ui,sans-serif" text-anchor="middle" style="fill:var(--text-muted)">subscribeWithSelector</text>
</svg>
<figcaption>On a dashboard with 30 active widgets at mixed polling intervals, subscribeWithSelector reduces cascading re-renders from 30 to 1 per poll cycle</figcaption>
</figure>

The trickiest state problem turned out to be mode transition — switching between edit mode (drag handles visible, widgets resizable) and view mode (widgets locked, real-time data updating). Every toggle caused a layout jump. The DOM recalculated positions slightly differently between the two render modes. Sub-pixel differences in how `position: absolute` interacted with the parent container's transforms. The eye caught it instantly.

The naive fixes didn't work. Forcing `transform: translate3d(0,0,0)` at the layout root had no effect. CSS `contain: layout` made it worse. Memoizing the layout calculations didn't help because the calculations weren't the problem — the rendering pipeline was.

```typescript
// Capture actual DOM positions at the moment of mode switch
const capturedPositions = widgets.map(w => ({
  id: w.id,
  rect: document.getElementById(w.id)?.getBoundingClientRect()
}))
// Use captured values as Framer Motion animation start point
// Let it interpolate to "where widget should be"
// The layout never jumps because we never let it
```

The fix: capture every widget's actual DOM position via `getBoundingClientRect()` at the exact moment of mode switch. Use those captured values as the Framer Motion transition's starting point. Let it interpolate from "where the widget actually was" to "where the widget should be." The layout never jumps because I never let it.

It's the kind of fix that takes a week to find and a single commit to apply.

[PERSONAL EXPERIENCE] The lesson here is that the difference between a library that ships and a library that ships right is the willingness to sit with hard bugs long enough to understand what's actually happening. The first instinct — memoize, force hardware acceleration, add CSS containment — is almost always wrong. The right fix comes after you stop guessing and start measuring.

> **Citation Capsule:** Zustand's `subscribeWithSelector` pattern and the mode-transition fix are two instances of the same principle: match the tool to the layer of the problem. Global state for inspectable data, DOM measurements for rendering truth, and animation for the bridge between the two. Fine-grained subscriptions ([State of React 2024](https://2024.stateofreact.com/en-US/libraries/state-management/)) aren't just a performance optimization — they're an architectural boundary.

<!-- [INTERNAL-LINK: Zustand subscribeWithSelector patterns → supporting article] -->

## How Does Data Integration Work Without Coordination Overhead?

Each widget is an independent data consumer. There's no central data fetcher, no Redux saga, no global query cache that all widgets must register with. Each widget polls its own source at its own interval, and the library handles everything below that contract.

`useWidgetData` handles `AbortController` cancellation on unmount or interval change, configurable cache, loading and error states, and polling at any interval. A monitoring widget polling every 5 seconds and a KPI widget polling every 60 seconds coexist on the same dashboard with no coordination code between them. They don't know about each other.

```typescript
const { data, loading, error } = useWidgetData<StreamMetrics>({
  endpoint: '/api/stream/metrics',
  pollingInterval: 5000,
  cacheEnabled: true,
  cacheDuration: 30,
})
```

Widget-to-widget communication is handled by an event bus rather than shared store state. Why? Stores are good for state that needs to be inspectable and time-travel debuggable. Events are good for fire-and-forget signals between independent components.

```typescript
// Filter widget emits a signal
const { emit } = useWidgetEvents(widgetId)
emit('filterChange', { dateRange: selectedRange })

// Chart widget listens and reacts
useWidgetEvents(chartWidgetId, {
  filterChange: ({ dateRange }) => refetch(dateRange)
})
```

A date-range filter change that triggers a chart refetch doesn't need to live in global state forever. Mixing the two produces dashboards where every state change is globally visible and nobody knows which components actually care. The event bus keeps communication local. The store keeps state inspectable. Neither bleeds into the other's domain.

Persistence follows the same principle. The library owns the mechanism. The team owns the policy.

```typescript
const [layout, setLayout] = usePersistence(
  'dashboard-key',
  defaultLayout,
  createPersistenceAdapter(localStorage) // or sessionStorage, or a backend adapter
)
```

[PERSONAL EXPERIENCE] One consuming app persists layouts to a backend API so dashboards survive device changes. Another uses localStorage for speed. A third uses URL state so users can share specific dashboard configurations as links. All three use the same library. Only the adapter argument differs. That's what a good abstraction boundary looks like in practice.

> **Citation Capsule:** The pluggable persistence adapter and the event bus are two instances of the same design principle: the library owns the mechanism, not the policy. Teams configure the behavior they need without touching library source code. This pattern generalizes — any shared library that forces a specific storage or communication strategy is trading short-term convenience for long-term inflexibility.

<!-- [INTERNAL-LINK: React polling and data fetching patterns → supporting article] -->

## Distribution: Inside the Monorepo and Beyond

I built `interactive-dashboard-library` to work in two contexts simultaneously. Inside the monorepo it's consumed as a workspace package — the same pattern used for all shared packages. Outside the monorepo, teams install it from an internal GitHub package registry.

The internal GitHub package route was a deliberate choice. Not every team at the office works inside the same monorepo. Some teams have their own separate repos and their own frontend setups. Publishing to the internal registry meant those teams could adopt the library too, without any codebase restructuring. It runs in monitoring dashboards, analytics dashboards, internal tooling apps, and customer-facing product dashboards.

Writing and publishing internal documentation on the company GitHub was part of the same initiative. I didn't just build the library and stop there. I wanted teams to be able to self-serve — understand the API, understand the architecture decisions, and adopt it without needing to sit with me for an hour. The docs followed the same principle as the code: simple flags, narrow interfaces, real examples.

The reception was better than I expected. Teams were receptive, and a few were genuinely surprised that something like this already existed. Designers reacted differently too. Once they knew the framework was there and understood what it could do, they started proposing interactive dashboard designs they'd never have proposed before. The engineering cost of drag, resize, and responsive widget views was now zero for them to spec against. That shift in designer confidence was one of the outcomes I hadn't predicted.

<!-- [INTERNAL-LINK: publishing internal npm packages via GitHub registry → supporting article] -->

## Built to Be AI-Native, Not Just Human-Readable

Most dashboard libraries are built for human developers. `interactive-dashboard-library` was designed from the start to be a valid LLM output target. That's a different design constraint — and it changes decisions you'd otherwise never think about.

`DashboardSchema` and `WidgetSchema` are fully JSON-serializable. There are no React nodes in config objects, no functions that can't round-trip through JSON. An LLM outputs a flat JSON object describing a dashboard and gets a live, interactive, draggable result. The schema is the contract between the model and the runtime.

```typescript
const dashboard = createFromTemplate('monitoring', {
  title: 'Stream Health',
  widgets: [
    createWidget('stream-health', { pollingInterval: 5000 }),
    createWidget('kpi', { value: '99.98%', label: 'Uptime', trend: 'up' }),
  ]
})
```

If the types compile, the dashboard works.

Four template presets ship with the library: analytics, monitoring, sales, and executive. An AI tool can request a template by name and get sensible defaults — layout, widget types, polling intervals — without knowing every configurable property. The factory functions fill the gaps. The templates aren't just convenience; they're the default vocabulary an LLM can use correctly on the first attempt.

In 2025, 80% of developers use AI tools in their development workflow, with 50.6% using them daily ([Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)). Libraries that structure their documentation for programmatic consumption aren't chasing a trend. They're building for the way most developers already work.

![Abstract AI neural network visualization with glowing nodes and connections on dark background](https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=jpg&q=80&w=1200&h=630&fit=crop)

[UNIQUE INSIGHT] Every hook ships with full JSDoc `@example` blocks. Not for a docs site. For AI coding tools that surface these examples inline when a developer types `useWidgetData`. Teams writing their first custom widget get correct, idiomatic code on the first try, more often than not. Documentation structured for programmatic extraction is the next competitive edge for any shared library. Most teams are still writing docs for humans browsing a site, and missing the developer who never opens a browser tab.

The same library that teams use in their products has a layer of MCP tools alongside it: `component:generate`, `component:fix`, `component:improve`, `component:review`. These tools use the library's own type system and documentation as the source of truth. The AI tooling and the human tooling share one source of truth. There's no documentation drift, no stale examples, no "the docs say X but the types say Y."

> **Citation Capsule:** When an LLM's output is guaranteed valid by the type system, the integration surface is structurally correct by construction. The library's JSON schemas aren't just configuration objects — they're the API surface for AI-generated dashboards ([Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)). A fully serializable schema with factory defaults is how you make AI-assisted development reliable rather than probabilistic.

<!-- [INTERNAL-LINK: AI-native documentation patterns → future article on AI-friendly library design] -->

---

**By the Numbers**

[ORIGINAL DATA] — First-party production metrics from `interactive-dashboard-library` across consuming apps and multiple product teams.

| Metric | Value |
|--------|-------|
| Built-in widgets | 11 |
| Consuming apps (production) | 4+ |
| Widget breakpoint views per widget | 3 (compact, ~500px, ~800px) |
| Source files | 90 |
| Lines of TypeScript | ~9,000 |
| Type definition lines | ~800 |
| Custom hooks | 10 |
| Test files | 17 |
| Documentation files | 9 |

---

## Frequently Asked Questions

### Why Free-Position Layout Instead of a Grid System Like react-grid-layout?

Grid systems snap widgets to rows and columns. For operations dashboards, widget size communicates priority — a large chart signals importance, not just available space. Free-position absolute layout lets widgets go anywhere, resize to any dimension, and overlap if the user chooses. The tradeoff is that you own collision detection. I chose freedom over guard rails.

### How Do Multiple Widgets Polling at Different Intervals Avoid Render Cascades?

Zustand's `subscribeWithSelector` middleware enables fine-grained subscriptions. A widget subscribes only to its own slice of state. When an unrelated widget updates, it doesn't trigger a re-render elsewhere. On a dashboard with thirty active widgets at different polling intervals, this is the architectural decision that keeps the frame rate at 60fps instead of visible jank.

### Can Teams Replace the Persistence Layer Without Forking the Library?

Yes — `usePersistence` accepts a `PersistenceAdapter` interface. Pass `createPersistenceAdapter(localStorage)`, `sessionStorage`, or any object that implements `get`/`set`/`remove`. One consuming app in production persists layouts to a backend API. Another uses URL state for shareable dashboard links. The adapter pattern means storage is a configuration decision, not an architectural one.

### How Does the Widget Event Bus Differ From Putting Everything in the Zustand Store?

Stores are for state that needs to be inspectable and time-travel debuggable. Events are for fire-and-forget signals between independent components — a filter change that triggers a chart refetch doesn't need to live in global state. Mixing the two produces dashboards where every state change is globally visible but nobody knows which components actually care.

### How Do Responsive Widget Breakpoints Work in Practice?

Each widget observes its own rendered width and switches view state at defined thresholds. At compact size it shows summary numbers. At around 500px it adds charts and trends. At around 800px it shows full tables and additional data. Users control these sizes by resizing the widget. The same widget can serve a manager wanting a quick status and an engineer wanting the full detail — simultaneously, on the same dashboard.

---

The library works because it solved the structural layer once. Product teams focus on data — what to query, what to compute, what to display — and nothing below that. The architectural decisions that earned their keep: free-position layout, responsive widget breakpoints, fine-grained Zustand subscriptions, a widget contract small enough to register a custom widget in an afternoon, and a mode-transition fix that papers over a rendering inconsistency the user should never see.

Eleven widgets shipped from the library. Many more were built by consuming teams on top of the same contract. Designers started thinking about interactive dashboards differently. Teams stopped rebuilding the structural layer for the first time. That adoption is the proof that matters — not the line count, not the test coverage, not the architecture diagram. In 2025, 80% of developers use AI tools daily ([Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)). Libraries structured for both human and programmatic consumption are the ones those developers reach for first.

The teams that will build fastest aren't the ones with the best individual engineers. They're the ones that invested in the shared substrate those engineers build on top of. Libraries, not individuals, compound.

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "interactive-dashboard-library: The Headless Dashboard Framework I Built for Our React Monorepo",
  "description": "A practitioner's account of building interactive-dashboard-library — a headless React dashboard framework with drag, resize, responsive widget breakpoints, and pluggable persistence, published as an internal GitHub package for use across monitoring, analytics, and market-facing apps.",
  "author": {
    "@type": "Person",
    "name": "Nishant Chaudhary"
  },
  "datePublished": "2026-05-03",
  "dateModified": "2026-05-03",
  "keywords": ["react", "typescript", "monorepo", "dashboard", "zustand", "headless ui", "drag and drop", "interactive-dashboard-library"],
  "articleSection": "Engineering",
  "inLanguage": "en-US"
}
</script>
