# @repo/router — Implementation Plan

## Overview

A config-driven, fully-typed routing system built on **React Router v7** (library mode) for React 19 + Vite apps. A single config object replaces all routing boilerplate.

---

## Goals

- **One config file** drives everything — no scattered route files
- **Production-grade** — auth guards, RBAC, loaders, error boundaries, code splitting
- **AI-friendly** — structured config is easy for agents to read, generate, and modify
- **Fully typed** — TypeScript inference on every config field
- **Extensible** — plugin system for analytics, transitions, maintenance mode, etc.

---

## Architecture

```
@repo/router
├── createRouter(config)          → RouterInstance (config wrapper)
├── <RouterProvider router={...}> → renders RR7 RouterProvider + all contexts
│   ├── ConfigContext             → holds full RouterConfig (auth, fallback, hooks, plugins)
│   ├── AuthContext               → runtime auth state (isAuthenticated, user, isLoading)
│   └── RR7 RouterProvider        → actual browser router
│       └── NavigationGuard       → runs beforeEach/afterEach hooks
│           └── Routes...
│               └── GuardWrapper  → per-route auth/role/permission check
│                   └── RouteWrapper → error boundary + suspense + emptyWhen + polling
│                       └── <Component /> (lazy loaded)
```

---

## File Structure

```
packages/router/
├── docs/
│   ├── PLAN.md                       ← this file
│   ├── API.md                        ← full API reference
│   └── USAGE.md                      ← copy-paste examples
├── src/
│   ├── index.ts                      ← public exports
│   ├── types.ts                      ← all TypeScript interfaces
│   ├── auth-store.ts                 ← module-level store for loaders (outside React)
│   ├── create-router.ts              ← createRouter() factory
│   ├── build-routes.tsx              ← config → RR7 RouteObject[] converter
│   ├── router-provider.tsx           ← <RouterProvider> main component
│   ├── context/
│   │   ├── config-context.tsx        ← RouterConfig React context
│   │   └── auth-context.tsx          ← runtime auth state context
│   ├── components/
│   │   ├── route-wrapper.tsx         ← error boundary + Suspense + emptyWhen + polling
│   │   ├── guard-wrapper.tsx         ← auth/role/permission + per-route guard fn
│   │   ├── role-view.tsx             ← renders different component per user role
│   │   ├── navigation-guard.tsx      ← beforeEach/afterEach hooks runner
│   │   ├── link.tsx                  ← enhanced <Link> with prefetch + active class
│   │   └── guard.tsx                 ← inline <Guard roles={[]}> component
│   ├── hooks/
│   │   ├── use-router.ts             ← navigate, params, query, location
│   │   ├── use-route-data.ts         ← loader data + refetch
│   │   ├── use-auth.ts               ← isAuthenticated, user, hasRole, hasPermission
│   │   └── use-breadcrumbs.ts        ← auto breadcrumbs from route tree + meta.title
│   ├── loaders/
│   │   └── create-loader.ts          ← converts LoaderConfig → RR7 loader function
│   └── plugins/
│       ├── types.ts                  ← RouterPlugin interface
│       ├── analytics-plugin.ts       ← analytics tracking plugin
│       └── transition-plugin.ts      ← route transition animation plugin
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## Key Design Decisions

### 1. Built on React Router v7 library mode
- No framework mode (no SSR, no file-based routing)
- Uses `createBrowserRouter` + `RouterProvider` from `react-router`
- All RR7 features available (loaders, actions, error elements, lazy routes)

### 2. Component types
- `component: () => import('./Page')` — always a lazy import factory, auto-wrapped with `React.lazy()`
- `layout: MyLayout` — always a direct `ComponentType` (use `React.lazy()` yourself if needed)
- `roleViews: { admin: () => import('./AdminView') }` — same as component, lazy factories

### 3. Auth state management
- `AuthContext` holds runtime auth state (isAuthenticated, user, isLoading)
- `authStore` (module-level) mirrors auth state for use inside RR7 loaders (outside React)
- Auth check on mount, re-checkable via `refresh()`

### 4. Guard execution order (per route)
1. Auth loading? → show `fallback.loading`
2. Guest route + authenticated? → redirect to `redirectIfAuth`
3. Protected route + not authenticated? → redirect to `auth.redirectTo`
4. `roles` check → show `unauthorized` or redirect to `auth.unauthorizedRedirect`
5. `permissions` check → same as roles
6. Custom `guard()` fn → redirect or allow

### 5. Data loaders
- `loader.url` → simple GET fetch with optional params + headers
- `loader.fn` → full control, receives `{ params, user }`
- `loader.polling` → `useRevalidator` interval inside `RouteWrapper`
- `emptyWhen(data)` → checked in `RouteWrapper`, shows `fallback.empty` if true
- Loader errors → caught by RR7 `errorElement` → shows `fallback.error`

### 6. Navigation hooks
- `hooks.beforeEach` — runs in `NavigationGuard` via `useEffect` on location change
  - Returns `false` → navigate back (cannot truly block in RR7 without `useBlocker`)
  - Returns `string` → redirect to that path
  - Returns `void/true` → allow
- `hooks.afterEach` — fires after every location change (analytics, title updates)
- `hooks.onError` — global error handler, also passed to plugins

### 7. Plugins
- Array of `RouterPlugin` objects with lifecycle methods
- Plugins receive route info and config
- Built-in: `analyticsPlugin()`, `transitionPlugin()`
- Custom plugins follow the `RouterPlugin` interface

### 8. Breadcrumbs
- Auto-built from route tree + `meta.title` at `createRouter` time
- Available via `useBreadcrumbs()` hook anywhere in the tree
- Returns `{ label, path, isActive }[]`

---

## Route Config Fields Reference

| Field | Type | Description |
|-------|------|-------------|
| `path` | `string` | URL path segment |
| `index` | `boolean` | Default child route |
| `type` | `'public' \| 'protected' \| 'guest'` | Access control type |
| `component` | `() => Promise<{default: ComponentType}>` | Lazy page component |
| `layout` | `ComponentType` | Wraps children, renders `<Outlet />` |
| `children` | `RouteConfig[]` | Nested routes |
| `roles` | `string[]` | Required user roles |
| `permissions` | `string[]` | Required user permissions |
| `roleViews` | `Record<string, LazyFactory>` | Per-role component map |
| `fallbackView` | `LazyFactory` | Shown when no role matches |
| `redirect` | `string` | Static redirect to path |
| `redirectIfAuth` | `string` | Redirect authenticated users (guest routes) |
| `meta` | `{ title, description, ...any }` | Route metadata |
| `loader` | `LoaderConfig` | Data loading config |
| `loading` | `ReactNode` | Per-route loading override |
| `error` | `ReactNode` | Per-route error override |
| `empty` | `ReactNode` | Per-route empty override |
| `unauthorized` | `ReactNode` | Per-route unauthorized override |
| `emptyWhen` | `(data) => boolean` | Show empty state when true |
| `guard` | `async ({ params, user, location }) => string\|false\|void` | Custom guard function |

---

## Public API

```typescript
// Core
export { createRouter } from './create-router'
export { RouterProvider } from './router-provider'

// Components
export { Link } from './components/link'
export { Guard } from './components/guard'
export { Outlet } from 'react-router'   // re-export

// Hooks
export { useRouter } from './hooks/use-router'
export { useRouteData } from './hooks/use-route-data'
export { useAuth } from './hooks/use-auth'
export { useBreadcrumbs } from './hooks/use-breadcrumbs'

// Plugins
export { analyticsPlugin } from './plugins/analytics-plugin'
export { transitionPlugin } from './plugins/transition-plugin'

// Types
export type { RouterConfig, RouteConfig, RouterPlugin, RouterInstance, ... } from './types'
```

---

## Usage in Apps

```tsx
// routes.config.tsx
import { createRouter } from '@repo/router'

export const router = createRouter({ auth: {...}, fallback: {...}, routes: [...] })

// App.tsx
import { RouterProvider } from '@repo/router'
import { router } from './routes.config'

export default function App() {
  return <RouterProvider router={router} />
}
```

---

## Integration Notes

- Add `@repo/router` to any app's `dependencies` in `package.json`
- React 19 + react-router v7 required
- `react-router` is a peer dependency — apps install it directly
- Tailwind/shadcn components used for built-in states (via `@repo/ui`)
