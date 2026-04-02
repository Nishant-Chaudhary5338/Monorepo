import type { RouteMatch } from '../types'
import type { RouterPlugin } from './types'

export interface AnalyticsPluginOptions {
  /**
   * Called on every route change with the current route info.
   *
   * @example
   * ```ts
   * analyticsPlugin({
   *   track: (route) => {
   *     gtag('event', 'page_view', { page_path: route.path })
   *     // or: analytics.page(route.path, route.meta)
   *   }
   * })
   * ```
   */
  track: (route: RouteMatch) => void
}

/**
 * Fires a tracking call on every navigation.
 *
 * @example
 * ```ts
 * plugins: [
 *   analyticsPlugin({ track: (route) => analytics.page(route.path) }),
 * ]
 * ```
 */
export function analyticsPlugin(options: AnalyticsPluginOptions): RouterPlugin {
  return {
    name: 'analytics',
    onRouteChange(to) {
      options.track(to)
    },
  }
}
