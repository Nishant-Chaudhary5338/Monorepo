/**
 * usePinch — Pinch-to-zoom hook
 *
 * Detects pinch gestures and provides scale, rotation, and center point.
 */

import { useCallback, useRef, useEffect, useState } from "react";

/** Pinch state */
export interface PinchState {
  /** Whether currently pinching */
  isPinching: boolean;
  /** Current scale factor (1 = no zoom) */
  scale: number;
  /** Current rotation in degrees */
  rotation: number;
  /** Center point between fingers */
  center: { x: number; y: number };
  /** Velocity of scale change */
  scaleVelocity: number;
}

/** Pinch configuration */
export interface PinchConfig {
  /** Minimum scale allowed */
  minScale: number;
  /** Maximum scale allowed */
  maxScale: number;
  /** Sensitivity multiplier for scale */
  sensitivity: number;
  /** Whether to prevent default */
  preventDefault: boolean;
  /** Whether to stop propagation */
  stopPropagation: boolean;
  /** Enable rotation tracking */
  enableRotation: boolean;
}

/** Pinch callbacks */
export interface PinchCallbacks {
  onPinchStart?: (state: PinchState) => void;
  onPinch?: (state: PinchState) => void;
  onPinchEnd?: (state: PinchState) => void;
  onScaleChange?: (scale: number) => void;
  onRotationChange?: (rotation: number) => void;
}

const DEFAULT_CONFIG: PinchConfig = {
  minScale: 0.5,
  maxScale: 3,
  sensitivity: 1,
  preventDefault: true,
  stopPropagation: false,
  enableRotation: false,
};

/**
 * Calculate distance between two touch points
 */
function getDistance(
  p1: { clientX: number; clientY: number },
  p2: { clientX: number; clientY: number },
): number {
  const dx = p2.clientX - p1.clientX;
  const dy = p2.clientY - p1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two touch points in degrees
 */
function getAngle(
  p1: { clientX: number; clientY: number },
  p2: { clientX: number; clientY: number },
): number {
  const dx = p2.clientX - p1.clientX;
  const dy = p2.clientY - p1.clientY;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/**
 * Calculate center point between two touches
 */
function getCenter(
  p1: { clientX: number; clientY: number },
  p2: { clientX: number; clientY: number },
): { x: number; y: number } {
  return {
    x: (p1.clientX + p2.clientX) / 2,
    y: (p1.clientY + p2.clientY) / 2,
  };
}

/**
 * usePinch — Hook for pinch-to-zoom gestures
 */
export function usePinch(
  callbacks: PinchCallbacks,
  config: Partial<PinchConfig> = {},
): {
  /** Ref to attach to the element */
  ref: React.RefObject<HTMLElement | null>;
  /** Current pinch state */
  state: PinchState;
  /** Set scale programmatically */
  setScale: (scale: number) => void;
  /** Reset to initial state */
  reset: () => void;
} {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const elementRef = useRef<HTMLElement | null>(null);
  const initialDistance = useRef(0);
  const initialAngle = useRef(0);
  const initialScale = useRef(1);
  const isPinching = useRef(false);
  const prevScale = useRef(1);
  const prevTime = useRef(0);

  const [state, setState] = useState<PinchState>({
    isPinching: false,
    scale: 1,
    rotation: 0,
    center: { x: 0, y: 0 },
    scaleVelocity: 0,
  });

  const clampScale = useCallback(
    (scale: number): number => {
      return Math.min(
        Math.max(scale, mergedConfig.minScale),
        mergedConfig.maxScale,
      );
    },
    [mergedConfig],
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length < 2) return;

      const touch1 = event.touches[0]!;
      const touch2 = event.touches[1]!;

      isPinching.current = true;
      initialDistance.current = getDistance(touch1, touch2);
      initialAngle.current = getAngle(touch1, touch2);
      initialScale.current = state.scale;
      prevScale.current = state.scale;
      prevTime.current = event.timeStamp;

      const center = getCenter(touch1, touch2);

      setState((prev) => ({
        ...prev,
        isPinching: true,
        center,
      }));

      if (mergedConfig.preventDefault) {
        event.preventDefault();
      }
      if (mergedConfig.stopPropagation) {
        event.stopPropagation();
      }

      callbacks.onPinchStart?.({
        isPinching: true,
        scale: state.scale,
        rotation: state.rotation,
        center,
        scaleVelocity: 0,
      });
    },
    [callbacks, mergedConfig, state.scale, state.rotation],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!isPinching.current || event.touches.length < 2) return;

      const touch1 = event.touches[0]!;
      const touch2 = event.touches[1]!;

      const currentDistance = getDistance(touch1, touch2);
      const currentAngle = getAngle(touch1, touch2);
      const center = getCenter(touch1, touch2);

      // Calculate scale
      const scaleFactor =
        (currentDistance / initialDistance.current) * mergedConfig.sensitivity;
      const newScale = clampScale(initialScale.current * scaleFactor);

      // Calculate rotation
      let rotation = state.rotation;
      if (mergedConfig.enableRotation) {
        rotation = currentAngle - initialAngle.current;
      }

      // Calculate scale velocity
      const now = event.timeStamp;
      const dt = now - prevTime.current;
      const scaleVelocity =
        dt > 0 ? (newScale - prevScale.current) / dt : 0;

      prevScale.current = newScale;
      prevTime.current = now;

      setState((prev) => ({
        ...prev,
        scale: newScale,
        rotation,
        center,
        scaleVelocity,
      }));

      if (mergedConfig.preventDefault) {
        event.preventDefault();
      }

      callbacks.onPinch?.({
        isPinching: true,
        scale: newScale,
        rotation,
        center,
        scaleVelocity,
      });

      callbacks.onScaleChange?.(newScale);
      if (mergedConfig.enableRotation) {
        callbacks.onRotationChange?.(rotation);
      }
    },
    [callbacks, mergedConfig, clampScale, state.rotation],
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!isPinching.current) return;

      // Only end if fewer than 2 touches remain
      if (event.touches.length < 2) {
        isPinching.current = false;

        setState((prev) => ({
          ...prev,
          isPinching: false,
          scaleVelocity: 0,
        }));

        callbacks.onPinchEnd?.({
          isPinching: false,
          scale: state.scale,
          rotation: state.rotation,
          center: state.center,
          scaleVelocity: 0,
        });
      }
    },
    [callbacks, state.scale, state.rotation, state.center],
  );

  const handleTouchCancel = useCallback(() => {
    isPinching.current = false;
    setState((prev) => ({
      ...prev,
      isPinching: false,
      scaleVelocity: 0,
    }));
  }, []);

  const setScale = useCallback(
    (scale: number) => {
      const clamped = clampScale(scale);
      setState((prev) => ({
        ...prev,
        scale: clamped,
      }));
      callbacks.onScaleChange?.(clamped);
    },
    [clampScale, callbacks],
  );

  const reset = useCallback(() => {
    initialDistance.current = 0;
    initialAngle.current = 0;
    initialScale.current = 1;
    prevScale.current = 1;
    isPinching.current = false;
    setState({
      isPinching: false,
      scale: 1,
      rotation: 0,
      center: { x: 0, y: 0 },
      scaleVelocity: 0,
    });
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, {
      passive: !mergedConfig.preventDefault,
    });
    element.addEventListener("touchmove", handleTouchMove, {
      passive: !mergedConfig.preventDefault,
    });
    element.addEventListener("touchend", handleTouchEnd);
    element.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    mergedConfig.preventDefault,
  ]);

  return {
    ref: elementRef,
    state,
    setScale,
    reset,
  };
}