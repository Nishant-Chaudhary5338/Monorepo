/**
 * useScroll — Scroll progress tracking hook
 *
 * Tracks scroll position and returns progress (0-1) and raw scroll values.
 */

import { useEffect, useRef, useState } from "react";

/** Scroll state returned by useScroll */
export interface ScrollState {
  /** Scroll progress from 0 to 1 */
  progress: number;
  /** Raw scroll Y position in pixels */
  scrollY: number;
  /** Raw scroll X position in pixels */
  scrollX: number;
  /** Viewport height */
  viewportHeight: number;
  /** Total scrollable height */
  scrollHeight: number;
}

/** Configuration for useScroll */
export interface ScrollConfig {
  /** Target element to track (defaults to window) */
  target?: React.RefObject<HTMLElement | null>;
  /** Throttle delay in ms (default: 16) */
  throttle?: number;
  /** Enabled state (default: true) */
  enabled?: boolean;
}

/**
 * useScroll — Track scroll progress
 *
 * @param config — Optional configuration
 * @returns Scroll state with progress, scrollY, scrollX, etc.
 */
export function useScroll(config: ScrollConfig = {}): ScrollState {
  const { target, throttle = 16, enabled = true } = config;
  const [state, setState] = useState<ScrollState>({
    progress: 0,
    scrollY: 0,
    scrollX: 0,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    scrollHeight: typeof document !== "undefined" ? document.documentElement.scrollHeight : 0,
  });

  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const updateScroll = () => {
      const element = target?.current;
      let scrollY: number;
      let scrollX: number;
      let viewportHeight: number;
      let scrollHeight: number;

      if (element) {
        scrollY = element.scrollTop;
        scrollX = element.scrollLeft;
        viewportHeight = element.clientHeight;
        scrollHeight = element.scrollHeight;
      } else {
        scrollY = window.scrollY;
        scrollX = window.scrollX;
        viewportHeight = window.innerHeight;
        scrollHeight = document.documentElement.scrollHeight;
      }

      const maxScroll = scrollHeight - viewportHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      setState({
        progress: Math.min(1, Math.max(0, progress)),
        scrollY,
        scrollX,
        viewportHeight,
        scrollHeight,
      });
    };

    const handleScroll = () => {
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;
        updateScroll();
      }, throttle);

      // Immediate update for smooth tracking
      updateScroll();
    };

    const scrollTarget = target?.current ?? window;
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    // Initial update
    updateScroll();

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [target, throttle, enabled]);

  return state;
}