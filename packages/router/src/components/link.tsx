import { forwardRef, useEffect, type AnchorHTMLAttributes } from 'react'
import {
  useHref,
  useLinkClickHandler,
  useMatch,
  useResolvedPath,
} from 'react-router'

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  /**
   * - `'hover'`  — prefetch (trigger lazy load) when user hovers
   * - `'render'` — prefetch immediately when this link renders
   * - `'none'`   — no prefetch (default)
   */
  prefetch?: 'hover' | 'render' | 'none'
  /** Class added when this link's route is active. */
  activeClass?: string
  /** Only apply activeClass on an exact path match (default: true). */
  exactActive?: boolean
  replace?: boolean
  state?: any
}

/**
 * Enhanced <Link> built on top of React Router's Link.
 *
 * @example
 * ```tsx
 * <Link to="/dashboard" activeClass="text-blue-600" prefetch="hover">
 *   Dashboard
 * </Link>
 * ```
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    to,
    prefetch = 'none',
    activeClass,
    exactActive = true,
    replace,
    state,
    className,
    children,
    onMouseEnter,
    ...rest
  },
  ref
) {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: exactActive })
  const href = useHref(to)
  const handleClick = useLinkClickHandler(to, { replace, state })

  const isActive = Boolean(match)
  const combinedClass = [className, isActive && activeClass]
    .filter(Boolean)
    .join(' ') || undefined

  // Prefetch on render — eagerly trigger the lazy import
  useEffect(() => {
    if (prefetch !== 'render') return
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [prefetch, href])

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onMouseEnter?.(e)
    if (prefetch === 'hover') {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    }
  }

  return (
    <a
      ref={ref}
      href={href}
      className={combinedClass}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  )
})

Link.displayName = 'Link'
