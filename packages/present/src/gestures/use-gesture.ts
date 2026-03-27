/**
 * useGesture — Unified gesture hook for presentations
 *
 * Combines swipe, drag, pinch, and long-press into a single hook.
 * Handles pointer events and emits gesture callbacks.
 */

import { useCallback, useEffect, useRef } from "react";
import { GestureRecognizer, type GestureResult } from "./recognizer";

/** Callback map for useGesture */
export interface GestureCallbacks {
  onSwipeLeft?: (result: GestureResult) => void;
  onSwipeRight?: (result: GestureResult) => void;
  onSwipeUp?: (result: GestureResult) => void;
  onSwipeDown?: (result: GestureResult) => void;
  onDrag?: (result: GestureResult) => void;
  onDragEnd?: (result: GestureResult) => void;
  onPinch?: (result: GestureResult) => void;
  onPinchEnd?: (result: GestureResult) => void;
  onLongPress?: (result: GestureResult) => void;
  onGestureStart?: (result: GestureResult) => void;
  onGestureEnd?: (result: GestureResult) => void;
}

/** Configuration for useGesture */
export interface GestureConfig {
  swipeThreshold?: number;
  velocityThreshold?: number;
  longPressDelay?: number;
  preventDefault?: boolean;
  enabled?: boolean;
}

/**
 * useGesture — Attach gesture recognition to a DOM element
 *
 * @param ref — React ref to the target element
 * @param callbacks — Gesture callbacks
 * @param config — Optional configuration
 */
export function useGesture(
  ref: React.RefObject<HTMLElement | null>,
  callbacks: GestureCallbacks,
  config: GestureConfig = {},
): void {
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const callbacksRef = useRef(callbacks);
  const configRef = useRef(config);

  // Keep refs updated without re-attaching listeners
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (!configRef.current.enabled !== false && configRef.current.preventDefault) {
      event.preventDefault();
    }

    if (!recognizerRef.current) {
      recognizerRef.current = new GestureRecognizer({
        swipeThreshold: configRef.current.swipeThreshold,
        velocityThreshold: configRef.current.velocityThreshold,
        longPressDelay: configRef.current.longPressDelay,
        preventDefault: configRef.current.preventDefault,
      });
    }

    const result = recognizerRef.current.pointerDown(event);
    if (result && callbacksRef.current.onGestureStart) {
      callbacksRef.current.onGestureStart(result);
    }
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!recognizerRef.current) return;
    recognizerRef.current.pointerMove(event);
  }, []);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (!recognizerRef.current) return;

    const result = recognizerRef.current.pointerUp(event);
    if (!result) return;

    const cb = callbacksRef.current;

    // Emit swipe callbacks
    if (result.type === "swipe") {
      const { velocity } = result;
      const absX = Math.abs(velocity.x);
      const absY = Math.abs(velocity.y);

      if (absX > absY) {
        if (velocity.x > 0) {
          cb.onSwipeRight?.(result);
        } else {
          cb.onSwipeLeft?.(result);
        }
      } else {
        if (velocity.y > 0) {
          cb.onSwipeDown?.(result);
        } else {
          cb.onSwipeUp?.(result);
        }
      }
    }

    // Emit drag end
    if (result.type === "drag") {
      cb.onDragEnd?.(result);
    }

    // Emit gesture end
    if (!result.isActive) {
      cb.onGestureEnd?.(result);
      recognizerRef.current.reset();
    }
  }, []);

  const handlePointerCancel = useCallback((event: PointerEvent) => {
    if (!recognizerRef.current) return;
    recognizerRef.current.pointerCancel(event);
  }, []);

  useEffect(() => {
    const element = ref.current;
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
      recognizerRef.current?.destroy();
      recognizerRef.current = null;
    };
  }, [ref, handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel]);
}