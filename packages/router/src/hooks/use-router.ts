import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import type { UseRouterResult } from '../types'

/**
 * Primary navigation hook. Combines navigate, params, query, and location
 * into a single ergonomic API.
 *
 * @example
 * ```tsx
 * const { navigate, params, query, pathname } = useRouter()
 *
 * // Navigate
 * navigate('/dashboard')
 * navigate('/users', { replace: true })
 * navigate('/profile', { state: { from: 'sidebar' } })
 *
 * // Read params (/users/:id)
 * const userId = params.id
 *
 * // Read query string (?tab=settings)
 * const tab = query.get('tab')
 * ```
 */
export function useRouter(): UseRouterResult {
  const navigate = useNavigate()
  const params = useParams() as Record<string, string>
  const location = useLocation()
  const [searchParams] = useSearchParams()

  return {
    navigate: (to, options) => navigate(to, options),
    params,
    query: searchParams,
    location: {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
    },
    pathname: location.pathname,
  }
}
