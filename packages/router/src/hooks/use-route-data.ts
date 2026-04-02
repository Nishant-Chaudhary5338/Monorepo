import { useLoaderData, useNavigation, useRevalidator } from 'react-router'
import type { UseRouteDataResult } from '../types'

/**
 * Returns data from the current route's loader, plus loading state and a
 * manual refetch trigger.
 *
 * Must be used inside a route that has a `loader` configured.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useRouteData<User[]>()
 *
 * if (isLoading) return <Spinner />
 * if (error) return <ErrorMessage />
 *
 * return <UserList users={data ?? []} />
 * ```
 */
export function useRouteData<T = any>(): UseRouteDataResult<T> {
  const data = useLoaderData() as T | null
  const navigation = useNavigation()
  const revalidator = useRevalidator()

  const isLoading =
    navigation.state === 'loading' || revalidator.state === 'loading'

  return {
    data: data ?? null,
    isLoading,
    error: null, // Errors are handled by RouteWrapper's error boundary
    refetch: () => revalidator.revalidate(),
  }
}
