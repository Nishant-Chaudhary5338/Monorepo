import type { LoaderFunctionArgs } from 'react-router'
import { authStore } from '../auth-store'
import type { LoaderConfig } from '../types'

/**
 * Converts a LoaderConfig into a React Router v7 loader function.
 * Runs outside React (no hooks), reads auth state from the module-level authStore.
 */
export function createLoader(loaderConfig: LoaderConfig) {
  return async ({ params: rawParams, request }: LoaderFunctionArgs): Promise<any> => {
    // RR7 params values can be undefined for optional segments — normalize to string
    const params: Record<string, string> = Object.fromEntries(
      Object.entries(rawParams).map(([k, v]) => [k, v ?? ''])
    )
    const user = authStore.user

    // Custom function loader — full control
    if (loaderConfig.fn) {
      return loaderConfig.fn({ params, user, request })
    }

    // URL-based GET loader
    if (loaderConfig.url) {
      const url = new URL(loaderConfig.url, window.location.origin)

      if (loaderConfig.params) {
        for (const [key, value] of Object.entries(loaderConfig.params)) {
          url.searchParams.set(key, value)
        }
      }

      const res = await fetch(url.toString(), {
        headers: loaderConfig.headers ?? {},
        signal: request.signal,
      })

      if (!res.ok) {
        throw new Error(`Loader fetch failed: ${res.status} ${res.statusText} — ${url.toString()}`)
      }

      return res.json()
    }

    return null
  }
}
