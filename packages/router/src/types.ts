import type { ComponentType, ReactNode } from 'react'

// ─── Primitive helpers ──────────────────────────────────────────────────────

/** A function that returns a dynamic import — used for code-split page components */
export type LazyFactory = () => Promise<{ default: ComponentType<any> }>

/** A layout component that renders its children + an <Outlet /> */
export type LayoutComponent = ComponentType<{ children?: ReactNode }>

/** Guard function — return string to redirect, false to block, void/true to allow */
export type GuardFn = (ctx: {
  params: Record<string, string>
  user: any
  location: { pathname: string; search: string; hash: string }
}) => Promise<string | boolean | void> | string | boolean | void

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface AuthConfig {
  /** Called to determine if the user is authenticated. Can be async. */
  check: () => boolean | Promise<boolean>
  /** Returns the current user object. Can be async. */
  user: () => any | Promise<any>
  /** Where to redirect unauthenticated users. Default: '/login' */
  redirectTo?: string
  /** Where to redirect users who lack required roles/permissions. Default: '/403' */
  unauthorizedRedirect?: string
}

// ─── Fallback states ────────────────────────────────────────────────────────

export interface FallbackConfig {
  /** Shown during auth check + lazy component load */
  loading?: ReactNode
  /** Shown when a loader or component throws an error */
  error?: ReactNode
  /** Shown for unmatched routes (404) */
  notFound?: ReactNode
  /** Shown when emptyWhen(data) === true */
  empty?: ReactNode
  /** Shown when role/permission check fails */
  unauthorized?: ReactNode
}

// ─── Navigation hooks ───────────────────────────────────────────────────────

export interface HooksConfig {
  /**
   * Called before every navigation.
   * - Return `false` → navigate back
   * - Return `string` → redirect to that path
   * - Return `void`/`true` → allow
   */
  beforeEach?: (
    to: RouteMatch,
    from: RouteMatch | null,
    user: any
  ) => Promise<boolean | string | void> | boolean | string | void

  /** Called after every navigation. Good for analytics, document title, etc. */
  afterEach?: (to: RouteMatch, from: RouteMatch | null) => void

  /** Global error handler called when a route component or loader throws. */
  onError?: (error: Error, route: RouteConfig) => void
}

// ─── Data loader ────────────────────────────────────────────────────────────

export interface LoaderConfig {
  /** GET fetch URL. Receives optional `params` as query string. */
  url?: string
  /** Custom async loader function. Overrides `url`. */
  fn?: (ctx: {
    params: Record<string, string>
    user: any
    request: Request
  }) => Promise<any>
  /** Query string params appended to `url`. */
  params?: Record<string, string>
  /** Request headers. */
  headers?: Record<string, string>
  /** Re-fetch interval in ms. Uses RR7 revalidator. */
  polling?: number
}

// ─── Route config ───────────────────────────────────────────────────────────

export interface RouteConfig {
  // ── Routing ──
  /** URL path segment. Supports :param and * wildcards. */
  path?: string
  /** Marks this as the default index child (renders at parent path). */
  index?: boolean
  /** Static redirect — navigates to this path immediately. */
  redirect?: string
  /** Redirect authenticated users to this path (use with type: 'guest'). */
  redirectIfAuth?: string

  // ── Access control ──
  /**
   * - `'public'` (default) — accessible always
   * - `'protected'` — requires authentication
   * - `'guest'` — only accessible when NOT authenticated
   */
  type?: 'public' | 'protected' | 'guest'
  /**
   * Required roles. User object must have `role: string` or `roles: string[]`.
   * ANY matching role grants access.
   */
  roles?: string[]
  /**
   * Required permissions. User object must have `permissions: string[]`.
   * ALL listed permissions must be present.
   */
  permissions?: string[]
  /** Custom async guard — runs after auth/role checks. */
  guard?: GuardFn

  // ── Components ──
  /** Lazy page component. Always pass as `() => import('./Page')`. */
  component?: LazyFactory
  /**
   * Layout wrapping all children. Pass a direct ComponentType.
   * The layout must render `<Outlet />` where children appear.
   * For lazy layouts, use `React.lazy(() => import('./Layout'))` before passing.
   */
  layout?: LayoutComponent
  /**
   * Per-role component map. Renders the component matching the user's role.
   * Each value is a LazyFactory: `() => import('./AdminView')`
   */
  roleViews?: Record<string, LazyFactory>
  /** Rendered when no role matches in `roleViews`. */
  fallbackView?: LazyFactory

  // ── Children ──
  children?: RouteConfig[]

  // ── Data ──
  loader?: LoaderConfig
  /** Show empty fallback when this returns true for loader data. */
  emptyWhen?: (data: any) => boolean

  // ── State overrides (override globals from FallbackConfig) ──
  loading?: ReactNode
  error?: ReactNode
  empty?: ReactNode
  unauthorized?: ReactNode

  // ── Metadata ──
  meta?: {
    title?: string
    description?: string
    [key: string]: any
  }
}

// ─── Plugin ─────────────────────────────────────────────────────────────────

export interface RouterPlugin {
  name: string
  /** Called once when the RouterProvider mounts. */
  onMount?: (config: RouterConfig) => void
  /** Called on every navigation. */
  onRouteChange?: (to: RouteMatch, from: RouteMatch | null) => void
  /** Called when a route component or loader throws. */
  onError?: (error: Error, route?: RouteConfig) => void
}

// ─── Top-level config ────────────────────────────────────────────────────────

export interface RouterConfig {
  auth?: AuthConfig
  fallback?: FallbackConfig
  hooks?: HooksConfig
  routes: RouteConfig[]
  plugins?: RouterPlugin[]
}

// ─── Runtime types ───────────────────────────────────────────────────────────

export interface RouterInstance {
  /** Unique ID for this router instance. */
  _id: string
  /** The original config passed to createRouter(). */
  _config: RouterConfig
}

export interface AuthState {
  isAuthenticated: boolean
  user: any
  isLoading: boolean
  refresh: () => Promise<void>
}

export interface RouteMatch {
  path: string
  params: Record<string, string>
  meta?: Record<string, any>
}

export interface BreadcrumbItem {
  label: string
  path: string
  isActive: boolean
}

export interface UseRouterResult {
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void
  params: Record<string, string>
  query: URLSearchParams
  location: { pathname: string; search: string; hash: string; state: any }
  pathname: string
}

export interface UseRouteDataResult<T = any> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}
