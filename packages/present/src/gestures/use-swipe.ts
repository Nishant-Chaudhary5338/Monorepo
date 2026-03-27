/**
 * useSwipe — Swipe gesture hook with velocity & momentum
 *
 * Detects swipe gestures and provides velocity, direction, and momentum.
 */

import { useCallback, useRef, useEffect } from "react";
import { VelocityTracker2D } from "../core/math";

/** Swipe direction */
export type SwipeDirection = "left" | "right" | "up" | "down" | null;

/** Swipe event data */
export interface SwipeEvent {
  /** Horizontal distance traveled */
  dx: number;
  /** Vertical distance traveled */
  dy: number;
  /** Velocity in pixels per millisecond */
  velocity: { x: number; y: number };
  /** Swipe direction */
  direction: SwipeDirection;
  /** Whether the swipe was fast enough to trigger */
  isValid: boolean;
  /** Event that triggered the swipe end */
  nativeEvent: PointerEvent | null;
}

/** Swipe configuration */
export interface SwipeConfig {
  /** Minimum distance to trigger swipe (px) */
  threshold: number;
  /** Minimum velocity to trigger swipe (px/ms) */
  velocityThreshold: number;
  /** Maximum time for a swipe (ms) */
  maxTime: number;
  /** Whether to prevent default on pointer events */
  preventDefault: boolean;
  /** Whether to stop propagation */
  stopPropagation: boolean;
  /** Axis constraint */
  axis: "x" | "y" | "free";
}

/** Swipe callbacks */
export interface SwipeCallbacks {
  onSwipeStart?: (event: PointerEvent) => void;
  onSwipe?: (event: SwipeEvent) => void;
  onSwipeEnd?: (event: SwipeEvent) => void;
  onSwipeLeft?: (event: SwipeEvent) => void;
  onSwipeRight?: (event: SwipeEvent) => void;
  onSwipeUp?: (event: SwipeEvent) => void;
  onSwipeDown?: (event: SwipeEvent) => void;
}

const DEFAULT_CONFIG: SwipeConfig = {
  threshold: 50,
  velocityThreshold: 0.3,
  maxTime: 500,
  preventDefault: true,
  stopPropagation: false,
  axis: "free",
};

/**
 * useSwipe — Hook for swipe gesture detection
 */
export function useSwipe(
  callbacks: SwipeCallbacks,
  config: Partial<SwipeConfig> = {},
): {
  /** Ref to attach to the element */
  ref: React.RefObject<HTMLElement | null>;
  /** Whether a swipe is in progress */
  isSwiping: boolean;
} {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const elementRef = useRef<HTMLElement | null>(null);
  const isSwiping = useRef(false);
  const startTime = useRef(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const velocity = useRef(new VelocityTracker2D(5, 100));

  const getDirection = useCallback(
    (dx: number, dy: number): SwipeDirection => {
      if (mergedConfig.axis === "x") {
        return dx > 0 ? "right" : "left";
      }
      if (mergedConfig.axis === "y") {
        return dy > 0 ? "down" : "up";
      }

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx > absDy) {
        return dx > 0 ? "right" : "left";
      }
      return dy > 0 ? "down" : "up";
    },
    [mergedConfig.axis],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      isSwiping.current = true;
      startTime.current = event.timeStamp;
      startX.current = event.clientX;
      startY.current = event.clientY;
      velocity.current.reset();
      velocity.current.push(event.clientX, event.clientY, event.timeStamp);

      if (mergedConfig.preventDefault) {
        event.preventDefault();
      }
      if (mergedConfig.stopPropagation) {
        event.stopPropagation();
      }

      callbacks.onSwipeStart?.(event);
    },
    [callbacks, mergedConfig],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isSwiping.current) return;

      velocity.current.push(event.clientX, event.clientY, event.timeStamp);

      if (mergedConfig.preventDefault) {
        event.preventDefault();
      }
    },
    [mergedConfig],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      if (!isSwiping.current) return;

      const dx = event.clientX - startX.current;
      const dy = event.clientY - startY.current;
      const elapsed = event.timeStamp - startTime.current;
      const vel = velocity.current.getVelocity();
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      const direction = getDirection(dx, dy);

      // Check if swipe meets thresholds
      const distance =
        mergedConfig.axis === "x"
          ? Math.abs(dx)
          : mergedConfig.axis === "y"
            ? Math.abs(dy)
            : Math.sqrt(dx * dx + dy * dy);

      const isValid =
        distance >= mergedConfig.threshold &&
        speed >= mergedConfig.velocityThreshold &&
        elapsed <= mergedConfig.maxTime;

      const swipeEvent: SwipeEvent = {
        dx,
        dy,
        velocity: vel,
        direction,
        isValid,
        nativeEvent: event,
      };

      callbacks.onSwipe?.(swipeEvent);

      if (isValid) {
        callbacks.onSwipeEnd?.(swipeEvent);

        switch (direction) {
          case "left":
            callbacks.onSwipeLeft?.(swipeEvent);
            break;
          case "right":
            callbacks.onSwipeRight?.(swipeEvent);
            break;
          case "up":
            callbacks.onSwipeUp?.(swipeEvent);
            break;
          case "down":
            callbacks.onSwipeDown?.(swipeEvent);
            break;
        }
      }

      isSwiping.current = false;
      velocity.current.reset();
    },
    [callbacks, mergedConfig, getDirection],
  );

  const handlePointerCancel = useCallback(() => {
    isSwiping.current = false;
    velocity.current.reset();
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel]);

  return {
    ref: elementRef,
    isSwiping: isSwiping.current,
  };
}