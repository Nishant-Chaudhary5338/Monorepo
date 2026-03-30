import React, { lazy, Suspense, type ComponentType } from 'react';

export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: { fallback?: React.ReactNode } = {}
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return React.createElement(
      Suspense,
      { fallback: options.fallback ?? null },
      React.createElement(LazyComponent, props)
    );
  };
}
