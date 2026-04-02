import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router'
import type { RouteObject } from 'react-router'
import { GuardWrapper } from './components/guard-wrapper'
import { RoleView } from './components/role-view'
import { RouteWrapper } from './components/route-wrapper'
import { createLoader } from './loaders/create-loader'
import type { RouterConfig, RouteConfig } from './types'

/**
 * Converts our RouteConfig[] into React Router v7 RouteObject[].
 *
 * Handles:
 * - Lazy component loading (React.lazy)
 * - Nested layouts with Outlet
 * - Auth/role/permission guards
 * - Data loaders
 * - Static redirects
 * - Not found (catch-all)
 * - roleViews (per-role component)
 */
export function buildRoutes(
  routes: RouteConfig[],
  config: RouterConfig
): RouteObject[] {
  const built = routes.map(route => buildRoute(route, config))

  // Append catch-all not-found route at the end
  built.push({
    path: '*',
    element: (
      <>{config.fallback?.notFound ?? <DefaultNotFound />}</>
    ),
  })

  return built
}

function buildRoute(route: RouteConfig, config: RouterConfig): RouteObject {
  // ── Static redirect ─────────────────────────────────────────────────────
  if (route.redirect) {
    return {
      path: route.path,
      index: route.index,
      element: <Navigate to={route.redirect} replace />,
    }
  }

  const loadingFallback: ReactNode = route.loading ?? config.fallback?.loading ?? null

  // ── Route element ────────────────────────────────────────────────────────
  let element: ReactNode

  if (route.roleViews) {
    // Multi-role view — resolved at runtime by RoleView
    element = (
      <GuardWrapper route={route}>
        <RouteWrapper route={route}>
          <RoleView route={route} />
        </RouteWrapper>
      </GuardWrapper>
    )
  } else if (route.component) {
    // Standard lazy component
    const LazyComponent = lazy(route.component)
    element = (
      <GuardWrapper route={route}>
        <RouteWrapper route={route}>
          <Suspense fallback={loadingFallback}>
            <LazyComponent />
          </Suspense>
        </RouteWrapper>
      </GuardWrapper>
    )
  } else if (route.layout || route.children) {
    // Layout-only node (has children, renders Outlet)
    const Layout = route.layout

    const inner = Layout ? (
      <Suspense fallback={loadingFallback}>
        <Layout>
          <Outlet />
        </Layout>
      </Suspense>
    ) : (
      <Outlet />
    )

    element = (
      <GuardWrapper route={route}>
        {inner}
      </GuardWrapper>
    )
  } else {
    element = null
  }

  // ── Error element ────────────────────────────────────────────────────────
  const errorElement: ReactNode =
    route.error ?? config.fallback?.error ?? <DefaultError />

  // ── Loader ───────────────────────────────────────────────────────────────
  const loader = route.loader ? createLoader(route.loader) : undefined

  // ── Children ─────────────────────────────────────────────────────────────
  const children = route.children
    ? route.children.map(child => buildRoute(child, config))
    : undefined

  return {
    path: route.path,
    index: route.index as any,
    element,
    errorElement: <>{errorElement}</>,
    loader,
    children,
  }
}

// ─── Default fallbacks (used when none are provided in config) ───────────────

function DefaultNotFound() {
  return (
    <div
      role="main"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        gap: '0.5rem',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 700, margin: 0 }}>404</h1>
      <p style={{ color: '#666' }}>Page not found</p>
      <a href="/" style={{ color: '#3b82f6' }}>Go home</a>
    </div>
  )
}

function DefaultError() {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        gap: '0.5rem',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Something went wrong</h1>
      <p style={{ color: '#666' }}>An unexpected error occurred. Please refresh the page.</p>
    </div>
  )
}
