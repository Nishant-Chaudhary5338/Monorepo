import { useEffect, useMemo } from 'react'
import { createBrowserRouter, Outlet, RouterProvider as RRRouterProvider } from 'react-router'
import { AuthProvider } from './context/auth-context'
import { ConfigProvider } from './context/config-context'
import { NavigationGuard } from './components/navigation-guard'
import { buildRoutes } from './build-routes'
import type { RouterConfig, RouterInstance } from './types'

interface RouterProviderProps {
  router: RouterInstance
}

/**
 * Root shell rendered inside the RR7 router context.
 * Provides ConfigContext + AuthContext + NavigationGuard to the whole tree.
 * Must be the `element` of the root layout route so hooks like
 * useLocation / useNavigate are available inside it.
 */
function RouterShell({ config }: { config: RouterConfig }) {
  return (
    <ConfigProvider config={config}>
      <AuthProvider config={config.auth}>
        <NavigationGuard>
          <Outlet />
        </NavigationGuard>
      </AuthProvider>
    </ConfigProvider>
  )
}

/**
 * Root component. Drop this in your App.tsx — it renders everything.
 *
 * @example
 * ```tsx
 * // App.tsx
 * import { RouterProvider } from '@repo/router'
 * import { router } from './routes.config'
 *
 * export default function App() {
 *   return <RouterProvider router={router} />
 * }
 * ```
 */
export function RouterProvider({ router }: RouterProviderProps) {
  const config = router._config

  const rrRouter = useMemo(() => {
    const childRoutes = buildRoutes(config.routes, config)

    return createBrowserRouter([
      {
        // Root layout route — provides all contexts and the navigation guard.
        // No `path` here so it doesn't consume a path segment.
        element: <RouterShell config={config} />,
        children: childRoutes,
      },
    ])
    // Rebuild on HMR when config object reference changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  // Fire plugin onMount once on first render
  useEffect(() => {
    config.plugins?.forEach(p => p.onMount?.(config))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <RRRouterProvider router={rrRouter} />
}
