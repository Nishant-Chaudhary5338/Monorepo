
# Headless Dashboard Library

## The problem

Across a multi-team operations platform, dashboards are the default output of every team. Monitoring dashboards. Content analytics. QC pipelines. Incident tracking. Each one is different in data but identical in structure: widgets arranged on a canvas, some updating in real time, some user-customizable, all needing to survive a page refresh.

Each team was building its own from scratch. Different drag-drop libraries. Different resize implementations. Different persistence approaches. Different widget APIs that couldn't share state or communicate. The cost was duplication; the risk was drift.

I built the substrate once.

## What I built

A headless dashboard composition framework. Not a UI kit, not a charting library — the layer underneath that handles layout, drag-and-drop, resize, widget registration, state management, persistence, data fetching, and widget-to-widget communication. Product teams bring their data and their domain logic. The library handles everything structural.

It ships as a workspace package with 90 source files, ~9,000 lines of TypeScript, 17 test files covering all major subsystems, and 10 custom hooks covering every surface of the dashboard lifecycle.

## Architecture

The core architectural decision was free-position layout — absolute positioning, not CSS Grid. Grid systems constrain widget placement to rows and columns. Absolute positioning lets widgets go anywhere, resize to any dimension, and overlap if the user chooses. For operations dashboards where widget size communicates priority, that freedom matters.

State is managed by Zustand with `subscribeWithSelector` middleware, wrapped in React Context for dashboard-scoped access. Fine-grained subscriptions mean a widget that only cares about its own position doesn't re-render when an unrelated widget moves. On a dashboard with thirty active widgets polling at different intervals, this is the difference between sixty frames per second and visible jank.

### The mode-transition story

The trickiest state problem turned out to be mode transition — switching between edit mode (drag handles visible, widgets resizable, layout configurable) and view mode (widgets locked, real-time data updating). Every time a user toggled, the layout jumped. The DOM would recalculate positions slightly differently between the two render modes — sub-pixel differences in how `position: absolute` interacted with the parent container's transforms — and the eye caught it instantly.

The naive fixes didn't work. Forcing `transform: translate3d(0,0,0)` at the layout root had no effect. CSS `contain: layout` made it worse. Memoizing the layout calculations didn't help because the calculations weren't the problem — the rendering pipeline was.

The fix was empirical: capture every widget's actual DOM position (`getBoundingClientRect()`) at the moment of mode switch, use those captured values as the starting point for the transition animation, and let Framer Motion interpolate from "where the widget actually was" to "where the widget should be." The layout never jumps because we never let it. The user sees a smooth transition that papers over a rendering inconsistency in the engine below.

It's the kind of fix that takes a week to find and a single commit to apply.

## Drag-and-drop and resize

Drag-and-drop uses dnd-kit with a pointer sensor and a 3-pixel activation constraint — enough to prevent accidental drags while keeping the interaction responsive on touch. Resize uses re-resizable with per-widget min/max constraints and configurable handle directions.

Persistence defaults to `localStorage` but uses a pluggable adapter pattern:

```typescript
const [layout, setLayout] = usePersistence(
  'dashboard-key',
  defaultLayout,
  createPersistenceAdapter(localStorage) // or sessionStorage, or a backend adapter
)
```

Any consuming app swaps the storage backend without changing anything else. One consuming app persists to a backend API. Another uses localStorage. A third uses URL state for shareable layouts. All three use the same library; the persistence story is the only thing that varies.

## The widget system

Eleven built-in widgets: seven Recharts chart types (bar, line, area, pie, scatter, radar, radial bar), three Nivo chart types (heatmap, treemap, sunburst), and a KPI widget with trend indicators and currency formatting.

Every widget — built-in or custom — implements the same contract:

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

Teams register custom widgets alongside built-ins:

```typescript
widgetRegistry.register({
  type: 'stream-health',
  label: 'Stream Health Monitor',
  component: StreamHealthWidget,
  defaultSize: { width: 400, height: 300 },
  settings: StreamHealthSettings,
  category: 'monitoring',
})
```

A custom widget registered this way gets drag-drop, resize, settings panel, edit/view mode, and persistence for free. The team only writes the widget's data logic and render output. Across the 4 consuming apps, teams have registered dozens of custom widgets on top of the eleven built-ins — proof that the contract is genuinely open, not just nominally extensible.

## Data integration

Each widget polls its own data source via `useWidgetData`:

```typescript
const { data, loading, error } = useWidgetData<StreamMetrics>({
  endpoint: '/api/stream/metrics',
  pollingInterval: 5000,
  cacheEnabled: true,
  cacheDuration: 30,
})
```

The hook handles request cancellation (AbortController), cache invalidation, loading and error states, and polling with configurable intervals. A monitoring widget polling every 5 seconds and a KPI widget polling every 60 seconds coexist on the same dashboard without coordination overhead.

For widgets that need to communicate — a filter widget that should affect a chart widget — the event bus handles it:

```typescript
// Filter widget
const { emit } = useWidgetEvents(widgetId)
emit('filterChange', { dateRange: selectedRange })

// Chart widget
useWidgetEvents(chartWidgetId, {
  filterChange: ({ dateRange }) => refetch(dateRange)
})
```

The decision to ship an event bus instead of forcing every cross-widget interaction through a shared store was deliberate. Stores are good for state that needs to be inspectable; events are good for signals between independent components. Mixing them is the path to dashboards no one understands six months later.

## AI-native design

The library was designed from the start to be LLM-output-compatible. `docs/08-AGENTIC-AI.md` is a dedicated integration guide: JSON-serializable `DashboardSchema` and `WidgetSchema` types, factory functions, and four template presets (analytics, monitoring, sales, executive).

The schema design means an LLM can output a flat JSON object describing a dashboard and get a live, interactive, draggable result:

```typescript
const dashboard = createFromTemplate('monitoring', {
  title: 'Stream Health',
  widgets: [
    createWidget('stream-health', { pollingInterval: 5000 }),
    createWidget('kpi', { value: '99.98%', label: 'Uptime', trend: 'up' }),
  ]
})
```

An AI-powered dashboard builder consuming this library takes a natural language description, generates the schema, and renders a fully functional dashboard. The library's type system and factory functions make generated code valid by construction: if the types compile, the dashboard works.

All hooks ship with full JSDoc `@example` blocks. `useWidgetEvents`, `usePersistence`, and `useWidgetData` each document a complete usage pattern that AI coding tools surface inline. Teams writing their first custom widget get correct code on the first try, more often than not.

## Numbers

| Metric | Value |
|--------|-------|
| Built-in widgets | 11 |
| Consuming apps in production | 4 |
| Product teams reached | ~12 |
| Source files | 90 |
| Lines of TypeScript | ~9,000 |
| Type definition lines | ~800 |
| Custom hooks | 10 |
| Test files | 17 |
| Documentation files | 9 |

## What made it work

The library worked because it solved the structural problem once. Teams could focus on data — what to query, what to compute, what to display — and ignore everything below. The architectural decisions that earned their keep: free-position layout (not grid), a Zustand store with fine-grained subscriptions (not Redux), a widget contract small enough to onboard a custom widget in an afternoon, and a mode-transition fix that papers over a rendering inconsistency the user should never see.

Eleven widgets shipped from the library. Many more were built by consuming teams on top of the same contract — which is the proof that mattered.
