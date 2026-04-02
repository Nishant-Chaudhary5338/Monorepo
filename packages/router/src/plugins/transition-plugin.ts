import type { RouterPlugin } from './types'

export type TransitionAnimation = 'fade' | 'slide-left' | 'slide-right' | 'none'

export interface TransitionPluginOptions {
  /** Animation style. Default: 'fade' */
  animation?: TransitionAnimation
  /** Duration in ms. Default: 200 */
  duration?: number
  /** CSS class applied to `document.documentElement` during transitions */
  className?: string
}

/**
 * Adds a CSS class to `<html>` during route transitions so you can animate
 * page changes with CSS.
 *
 * Add to your global CSS:
 * ```css
 * html.route-transitioning { opacity: 0; transition: opacity 200ms ease; }
 * html { opacity: 1; transition: opacity 200ms ease; }
 * ```
 *
 * @example
 * ```ts
 * plugins: [
 *   transitionPlugin({ animation: 'fade', duration: 150 }),
 * ]
 * ```
 */
export function transitionPlugin(options: TransitionPluginOptions = {}): RouterPlugin {
  const { duration = 200, className = 'route-transitioning' } = options

  return {
    name: 'transition',
    onMount() {
      // Inject default transition styles if no custom className is provided
      if (className === 'route-transitioning') {
        const style = document.createElement('style')
        style.setAttribute('data-repo-router-transition', '')
        style.textContent = `
          html { transition: opacity ${duration}ms ease; }
          html.route-transitioning { opacity: 0; }
        `
        document.head.appendChild(style)
      }
    },
    onRouteChange() {
      document.documentElement.classList.add(className)
      setTimeout(() => {
        document.documentElement.classList.remove(className)
      }, duration)
    },
  }
}
