import {
  Component,
  useEffect,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { useLoaderData, useRevalidator } from 'react-router'
import { useConfig } from '../context/config-context'
import type { RouteConfig } from '../types'

// ─── Error Boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  error: Error | null
}

interface ErrorBoundaryProps {
  fallback: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
  children: ReactNode
}

class RouteErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}

// ─── Polling wrapper ─────────────────────────────────────────────────────────

function PollingRevalidator({ intervalMs }: { intervalMs: number }) {
  const revalidator = useRevalidator()

  useEffect(() => {
    const id = setInterval(() => {
      if (revalidator.state === 'idle') {
        revalidator.revalidate()
      }
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, revalidator])

  return null
}

// ─── Data wrapper (emptyWhen) ────────────────────────────────────────────────

function DataStateWrapper({
  route,
  emptyFallback,
  children,
}: {
  route: RouteConfig
  emptyFallback: ReactNode
  children: ReactNode
}) {
  const data = useLoaderData()

  if (route.emptyWhen?.(data)) {
    return <>{route.empty ?? emptyFallback}</>
  }

  return <>{children}</>
}

// ─── Main RouteWrapper ───────────────────────────────────────────────────────

interface RouteWrapperProps {
  route: RouteConfig
  children: ReactNode
}

/**
 * Wraps every route component with:
 * 1. Error boundary (catches render + loader errors)
 * 2. emptyWhen data check (shows empty state when loader returns empty data)
 * 3. Polling revalidator (if loader.polling is set)
 */
export function RouteWrapper({ route, children }: RouteWrapperProps) {
  const config = useConfig()

  const errorFallback = route.error ?? config.fallback?.error ?? (
    <div role="alert" style={{ padding: '1rem', color: 'red' }}>
      Something went wrong. Please try again.
    </div>
  )

  const emptyFallback = config.fallback?.empty ?? (
    <div style={{ padding: '1rem', opacity: 0.5 }}>No data found.</div>
  )

  const handleError = (error: Error) => {
    config.hooks?.onError?.(error, route)
    config.plugins?.forEach(p => p.onError?.(error, route))
  }

  const inner =
    route.loader?.url || route.loader?.fn ? (
      <DataStateWrapper route={route} emptyFallback={emptyFallback}>
        {children}
      </DataStateWrapper>
    ) : (
      <>{children}</>
    )

  return (
    <RouteErrorBoundary fallback={errorFallback} onError={handleError}>
      {route.loader?.polling && (
        <PollingRevalidator intervalMs={route.loader.polling} />
      )}
      {inner}
    </RouteErrorBoundary>
  )
}
