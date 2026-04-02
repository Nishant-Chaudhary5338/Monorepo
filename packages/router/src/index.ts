// ─── Core ────────────────────────────────────────────────────────────────────
export { createRouter } from './create-router'
export { RouterProvider } from './router-provider'

// ─── Components ──────────────────────────────────────────────────────────────
export { Link } from './components/link'
export { Guard } from './components/guard'
export type { LinkProps } from './components/link'
export type { GuardProps } from './components/guard'

// Re-export Outlet from react-router so consumers don't need to install it separately
export { Outlet } from 'react-router'

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useRouter } from './hooks/use-router'
export { useRouteData } from './hooks/use-route-data'
export { useAuth } from './hooks/use-auth'
export { useBreadcrumbs } from './hooks/use-breadcrumbs'
export type { UseAuthResult } from './hooks/use-auth'

// ─── Plugins ─────────────────────────────────────────────────────────────────
export { analyticsPlugin } from './plugins/analytics-plugin'
export { transitionPlugin } from './plugins/transition-plugin'
export type { AnalyticsPluginOptions } from './plugins/analytics-plugin'
export type { TransitionPluginOptions, TransitionAnimation } from './plugins/transition-plugin'

// ─── Types ───────────────────────────────────────────────────────────────────
export type {
  // Config
  RouterConfig,
  RouteConfig,
  AuthConfig,
  FallbackConfig,
  HooksConfig,
  LoaderConfig,
  RouterPlugin,
  // Runtime
  RouterInstance,
  AuthState,
  RouteMatch,
  BreadcrumbItem,
  UseRouterResult,
  UseRouteDataResult,
  // Primitives
  LazyFactory,
  LayoutComponent,
  GuardFn,
} from './types'
