import { useMemo } from 'react'
import { useLocation, useMatches } from 'react-router'
import type { BreadcrumbItem } from '../types'

/**
 * Returns an auto-generated breadcrumb trail based on the current route
 * and the `meta.title` fields in your route config.
 *
 * Breadcrumbs are built from React Router's matched routes, so they reflect
 * the full nested path (layout → child → grandchild).
 *
 * @example
 * ```tsx
 * const breadcrumbs = useBreadcrumbs()
 * // [
 * //   { label: 'Dashboard', path: '/dashboard', isActive: false },
 * //   { label: 'Users',     path: '/dashboard/users', isActive: true },
 * // ]
 *
 * return (
 *   <nav>
 *     {breadcrumbs.map(bc => (
 *       <span key={bc.path} aria-current={bc.isActive ? 'page' : undefined}>
 *         {bc.label}
 *       </span>
 *     ))}
 *   </nav>
 * )
 * ```
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const matches = useMatches()
  const location = useLocation()

  return useMemo(() => {
    const crumbs: BreadcrumbItem[] = []

    for (const match of matches) {
      // Skip layout-only segments (no path or index only)
      if (!match.pathname || match.pathname === '/') {
        // Still include root if it has a title
        const handle = match.handle as any
        const title = handle?.meta?.title ?? handle?.title
        if (title) {
          crumbs.push({
            label: title,
            path: '/',
            isActive: match.pathname === location.pathname,
          })
        }
        continue
      }

      const handle = match.handle as any
      const title: string =
        handle?.meta?.title ??
        handle?.title ??
        toTitleCase(match.pathname.split('/').pop() ?? '')

      if (title) {
        crumbs.push({
          label: title,
          path: match.pathname,
          isActive: match.pathname === location.pathname,
        })
      }
    }

    return crumbs
  }, [matches, location.pathname])
}

function toTitleCase(str: string): string {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
