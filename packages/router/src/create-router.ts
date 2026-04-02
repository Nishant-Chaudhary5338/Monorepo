import type { RouterConfig, RouterInstance } from './types'

let _idCounter = 0

/**
 * Creates a router instance from a config object.
 *
 * @example
 * ```tsx
 * export const router = createRouter({
 *   auth: {
 *     check: () => Boolean(localStorage.getItem('token')),
 *     user: () => JSON.parse(localStorage.getItem('user') ?? 'null'),
 *   },
 *   fallback: { loading: <Spinner />, notFound: <NotFound /> },
 *   routes: [
 *     { path: '/', component: () => import('./pages/Home') },
 *     { path: '/dashboard', type: 'protected', component: () => import('./pages/Dashboard') },
 *   ],
 * })
 * ```
 */
export function createRouter(config: RouterConfig): RouterInstance {
  return {
    _id: `router-${++_idCounter}`,
    _config: config,
  }
}
