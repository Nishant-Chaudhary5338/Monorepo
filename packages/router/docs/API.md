# @repo/router — API Reference

## `createRouter(config)`

Creates a router instance from a config object.

```typescript
import { createRouter } from '@repo/router'

const router = createRouter({
  auth?: AuthConfig,
  fallback?: FallbackConfig,
  hooks?: HooksConfig,
  routes: RouteConfig[],
  plugins?: RouterPlugin[],
})
```

---

## `<RouterProvider router={router} />`

Root component. Renders all contexts and the RR7 router.

```tsx
<RouterProvider router={router} />
```

---

## `AuthConfig`

```typescript
interface AuthConfig {
  check: () => boolean | Promise<boolean>       // Is user authenticated?
  user: () => any | Promise<any>                // Get current user object
  redirectTo?: string                            // Default: '/login'
  unauthorizedRedirect?: string                  // Default: '/403'
}
```

User object shape (flexible — use what you have):
```typescript
{
  role?: string              // single role
  roles?: string[]           // multiple roles (preferred)
  permissions?: string[]     // permission strings
}
```

---

## `FallbackConfig`

```typescript
interface FallbackConfig {
  loading?: ReactNode       // Shown during auth check + lazy load
  error?: ReactNode         // Shown when a loader or component throws
  notFound?: ReactNode      // Shown for unmatched routes (404)
  empty?: ReactNode         // Shown when emptyWhen(data) === true
  unauthorized?: ReactNode  // Shown when role/permission fails
}
```

---

## `HooksConfig`

```typescript
interface HooksConfig {
  beforeEach?: (
    to: RouteMatch,
    from: RouteMatch | null,
    user: any
  ) => Promise<boolean | string | void> | boolean | string | void
  // false → navigate back | string → redirect | void/true → allow

  afterEach?: (to: RouteMatch, from: RouteMatch | null) => void
  // Runs after every navigation (analytics, title updates, etc.)

  onError?: (error: Error, route: RouteConfig) => void
  // Global error handler
}
```

---

## `RouteConfig`

```typescript
interface RouteConfig {
  // Routing
  path?: string
  index?: boolean
  redirect?: string
  redirectIfAuth?: string          // guest routes only

  // Access control
  type?: 'public' | 'protected' | 'guest'
  roles?: string[]
  permissions?: string[]
  guard?: GuardFn

  // Components
  component?: LazyFactory          // () => import('./Page')
  layout?: ComponentType           // Direct component, renders <Outlet />
  roleViews?: Record<string, LazyFactory>
  fallbackView?: LazyFactory       // Used when no role matches in roleViews

  // Children
  children?: RouteConfig[]

  // Data loading
  loader?: LoaderConfig

  // States (override globals)
  loading?: ReactNode
  error?: ReactNode
  empty?: ReactNode
  unauthorized?: ReactNode
  emptyWhen?: (data: any) => boolean

  // Metadata
  meta?: { title?: string; description?: string; [key: string]: any }
}
```

---

## `LoaderConfig`

```typescript
interface LoaderConfig {
  url?: string                    // GET fetch URL
  fn?: LoaderFn                   // Custom async function
  params?: Record<string, string> // Query string params (url mode)
  headers?: Record<string, string>// Request headers (url mode)
  polling?: number                // Re-fetch interval in ms
}

type LoaderFn = (ctx: {
  params: Record<string, string>
  user: any
  request: Request
}) => Promise<any>
```

---

## Hooks

### `useRouter()`

```typescript
const {
  navigate,     // (to: string, options?: NavigateOptions) => void
  params,       // Record<string, string> — URL params (:id, etc.)
  query,        // URLSearchParams
  location,     // Location object
  pathname,     // string
} = useRouter()
```

### `useRouteData<T>()`

```typescript
const {
  data,         // T | null — data returned by the route's loader
  isLoading,    // boolean
  error,        // Error | null
  refetch,      // () => void — manually trigger revalidation
} = useRouteData<T>()
```

### `useAuth()`

```typescript
const {
  isAuthenticated,    // boolean
  user,               // any — user object from auth.user()
  isLoading,          // boolean — true during initial auth check
  hasRole,            // (role: string | string[]) => boolean
  hasPermission,      // (permission: string | string[]) => boolean
  hasAnyRole,         // (roles: string[]) => boolean
  refresh,            // () => Promise<void> — re-run auth.check()
} = useAuth()
```

### `useBreadcrumbs()`

```typescript
const breadcrumbs: BreadcrumbItem[] = useBreadcrumbs()

interface BreadcrumbItem {
  label: string     // from meta.title or path segment
  path: string      // full path to this route
  isActive: boolean // true for the current route
}
```

---

## Components

### `<Link>`

```tsx
<Link
  to="/dashboard"
  prefetch="hover"        // 'hover' | 'render' | 'none' (default: 'none')
  activeClass="active"    // className when route is active
  exactActive             // only active on exact match
  className="..."
>
  Dashboard
</Link>
```

### `<Guard>`

Conditionally render children based on auth/role/permissions.

```tsx
<Guard roles={['admin', 'manager']} fallback={<UpgradePrompt />}>
  <DeleteButton />
</Guard>

<Guard permissions={['billing.write']}>
  <PlanUpgrade />
</Guard>

<Guard authenticated fallback={<LoginPrompt />}>
  <UserMenu />
</Guard>
```

---

## Plugins

### `analyticsPlugin(options)`

```typescript
import { analyticsPlugin } from '@repo/router'

analyticsPlugin({
  track: (route: RouteMatch) => {
    analytics.page(route.path, route.meta)
  },
})
```

### `transitionPlugin(options)`

```typescript
import { transitionPlugin } from '@repo/router'

transitionPlugin({
  animation: 'fade',  // 'fade' | 'slide' | 'none'
  duration: 200,      // ms
})
```

### Custom Plugin

```typescript
import type { RouterPlugin } from '@repo/router'

const myPlugin: RouterPlugin = {
  name: 'my-plugin',
  onMount(config) { /* called once when router mounts */ },
  onRouteChange(to, from) { /* called on every navigation */ },
  onError(error, route) { /* called on route errors */ },
}
```

---

## Type Exports

```typescript
import type {
  RouterConfig,
  RouteConfig,
  AuthConfig,
  FallbackConfig,
  HooksConfig,
  LoaderConfig,
  RouterPlugin,
  RouterInstance,
  RouteMatch,
  BreadcrumbItem,
  LazyFactory,
  GuardFn,
} from '@repo/router'
```
