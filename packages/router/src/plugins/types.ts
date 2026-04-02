import type { RouterConfig, RouteConfig, RouteMatch } from '../types'

export interface RouterPlugin {
  name: string
  onMount?: (config: RouterConfig) => void
  onRouteChange?: (to: RouteMatch, from: RouteMatch | null) => void
  onError?: (error: Error, route?: RouteConfig) => void
}
