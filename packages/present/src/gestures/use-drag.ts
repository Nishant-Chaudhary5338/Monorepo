/**
 * useDrag — Drag-to-navigate hook with constraints
 *
 * Supports constrained dragging with momentum and snap points.
 */

import { useCallback, useRef, useEffect, useState } from "react";
import { VelocityTracker2D } from "../core/math";

/** Drag state */
export interface DragState {
  /** Whether currently dragging */
  isDragging: boolean;
  /** Current x position */
  x: number;
  /** Current y position */
  y: number;
  /** Offset from start position */
  offset: { x: number; y: number };
  /** Current velocity */
  velocity: { x: number; y: number };
}

/** Drag constraints */
export interface DragConstraints {
  /** Minimum x position */
  left?: number;
  /** Maximum x position */
  right?: number;
  /** Minimum y position */
  top?: number;
  /** Maximum y position */
  bottom?: number;
}

/** Snap point configuration */
export interface SnapPoint {
  x: number;
  y: number;
}

/** Drag configuration */
export interface DragConfig {
  /** Constraints for dragging */
  constraints?: DragConstraints;
  /** Snap points */
  snapPoints?: SnapPoint[];
  /** Elasticity when outside constraints (0-1) */
  elasticity: number;
  /** Momentum decay factor (0-1) */
  momentumDecay: number;
  /** Whether to prevent default */
  preventDefault: boolean;
  /** Whether to stop propagation */
  stopPropagation: boolean;
  /** Axis constraint */
  axis: "x" | "y" | "free";
  /** Minimum distance to start drag (px) */
  threshold: number;
}

/** Drag callbacks */
export interface DragCallbacks {
  onDragStart?: (state: DragState) => void;
  onDrag?: (state: DragState) => void;
  onDragEnd?: (state: DragState) => void;
  onSnap?: (point: SnapPoint, index: number) => void;
}

const DEFAULT_CONFIG: DragConfig = {
  elasticity: 0.5,
  momentumDecay: 0.95,
  preventDefault: true,
  stopPropagation: false,
  axis: "free",
  threshold: 0,
};

/**
 * useDrag — Hook for drag-to-navigate gestures
 */
export function useDrag(
  callbacks: DragCallbacks,
  config: Partial<DragConfig> = {},
): {
  /** Ref to attach to the element */
  ref: React.RefObject<HTMLElement | null>;
  /** Current drag state */
  state: DragState;
  /** Start dragging programmatically */
  startDrag: (x: number, y: number) => void;
  /** Stop dragging programmatically */
  stopDrag: () => void;
  /** Set position programmatically */
  setPosition: (x: number, y: number) => void;
} {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const elementRef = useRef<HTMLElement | null>(null);
  const velocity = useRef(new VelocityTracker2D(5, 100));
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const momentumId = useRef<number | null>(null);

  const [state, setState] = useState<DragState>({
    isDragging: false,
    x: 0,
    y: 0,
    offset: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  });

  const applyConstraints = useCallback(
    (x: number, y: number): { x: number; y: number } => {
      const { constraints, elasticity } = mergedConfig;
      if (!constraints) return { x, y };

      let constrainedX = x;
      let constrainedY = y;

      if (constraints.left !== undefined && x < constraints.left) {
        const overshoot = constraints.left - x;
        constrainedX = constraints.left - overshoot * elasticity;
      }
      if (constraints.right !== undefined && x > constraints.right) {
        const overshoot = x - constraints.right;
        constrainedX = constraints.right + overshoot * elasticity;
      }
      if (constraints.top !== undefined && y < constraints.top) {
        const overshoot = constraints.top - y;
        constrainedY = constraints.top - overshoot * elasticity;
      }
      if (constraints.bottom !== undefined && y > constraints.bottom) {
        const overshoot = y - constraints.bottom;
        constrainedY = constraints.bottom + overshoot * elasticity;
      }

      return { x: constrainedX, y: constrainedY };
    },
    [mergedConfig],
  );

  const findNearestSnapPoint = useCallback(
    (x: number, y: number): { point: SnapPoint; index: number } | null => {
      const { snapPoints } = mergedConfig;
      if (!snapPoints || snapPoints.length === 0) return null;

      let nearest = snapPoints[0]!;
      let nearestIndex = 0;
      let minDistance = Infinity;

      snapPoints.forEach((point, index) => {
        const distance = Math.sqrt(
          (point.x - x) ** 2 + (point.y - y) ** 2,
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = point;
          nearestIndex = index;
        }
      });

      return { point: nearest, index: nearestIndex };
    },
    [mergedConfig],
  );

  const snapToPoint = useCallback(
    (point: SnapPoint, index: number) => {
      currentPos.current = { x: point.x, y: point.y };
      setState((prev) => ({
        ...prev,
        x: point.x,
        y: point.y,
        offset: {
          x: point.x - startPos.current.x,
          y: point.y - startPos.current.y,
        },
      }));
      callbacks.onSnap?.(point, index);
    },
    [callbacks],
  );

  const applyMomentum = useCallback(() => {
    const vel = velocity.current.getVelocity();
    let vx = vel.x * 16; // Convert to px per frame
    let vy = vel.y * 16;

    const decay = mergedConfig.momentumDecay;
    const elasticity = mergedConfig.elasticity;

    const step = () => {
      if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
        // Check for snap points
        const snap = findNearestSnapPoint(
          currentPos.current.x,
          currentPos.current.y,
        );
        if (snap) {
          snapToPoint(snap.point, snap.index);
        }
        return;
      }

      let newX = currentPos.current.x + vx;
      let newY = currentPos.current.y + vy;

      // Apply constraints
      const constrained = applyConstraints(newX, newY);
      newX = constrained.x;
      newY = constrained.y;

      // Bounce off constraints
      if (mergedConfig.constraints) {
        const { left, right, top, bottom } = mergedConfig.constraints;
        if (left !== undefined && newX < left) {
          newX = left;
          vx = -vx * elasticity;
        }
        if (right !== undefined && newX > right) {
          newX = right;
          vx = -vx * elasticity;
        }
        if (top !== undefined && newY < top) {
          newY = top;
          vy = -vy * elasticity;
        }
        if (bottom !== undefined && newY > bottom) {
          newY = bottom;
          vy = -vy * elasticity;
        }
      }

      currentPos.current = { x: newX, y: newY };
      setState((prev) => ({
        ...prev,
        x: newX,
        y: newY,
        offset: {
          x: newX - startPos.current.x,
          y: newY - startPos.current.y,
        },
      }));

      vx *= decay;
      vy *= decay;

      momentumId.current = requestAnimationFrame(step);
    };

    momentumId.current = requestAnimationFrame(step);
  }, [mergedConfig, applyConstraints, findNearestSnapPoint, snapToPoint]);

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (momentumId.current) {
        cancelAnimationFrame(momentumId.current);
        momentumId.current = null;
      }

      isDragging.current = true;
      startPos.current = { x: event.clientX, y: event.clientY };
      currentPos.current = { x: event.clientX, y: event.clientY };
      velocity.current.reset();
      velocity.current.push(event.clientX, event.clientY, event.timeStamp);

      setState((prev) => ({
        ...prev,
        isDragging: true,
      }));

      if (mergedConfig.preventDefault) {
        event.preventDefault();
      }
      if (mergedConfig.stopPropagation) {
        event.stopPropagation();
      }

      callbacks.onDragStart?.({
        isDragging: true,
        x: event.clientX,
        y: event.clientY,
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
      });
    },
    [callbacks, mergedConfig],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging.current) return;

      velocity.current.push(event.clientX, event.clientY, event.timeStamp);

      let newX = event.clientX;
      let newY = event.clientY;

      // Apply axis constraint
      if (mergedConfig.axis === "x") {
        newY = startPos.current.y;
      } else if (mergedConfig.axis === "y") {
        newX = startPos.current.x;
      }

      // Apply constraints
      const constrained = applyConstraints(newX, newY);
      currentPos.current = { x: constrained.x, y: constrained.y };

      const vel = velocity.current.getVelocity();

      setState((prev) => ({
        ...prev,
        x: constrained.x,
        y: constrained.y,
        offset: {
          x: constrained.x - startPos.current.x,
          y: constrained.y - startPos.current.y,
        },
        velocity: vel,
      }));

      if (mergedConfig.preventDefault) {
        event.preventDefault();
      }

      callbacks.onDrag?.({
        isDragging: true,
        x: constrained.x,
        y: constrained.y,
        offset: {
          x: constrained.x - startPos.current.x,
          y: constrained.y - startPos.current.y,
        },
        velocity: vel,
      });
    },
    [callbacks, mergedConfig, applyConstraints],
  );

  const handlePointerUp = useCallback(
    (_event: PointerEvent) => {
      if (!isDragging.current) return;

      isDragging.current = false;
      const vel = velocity.current.getVelocity();

      setState((prev) => ({
        ...prev,
        isDragging: false,
        velocity: vel,
      }));

      const finalState: DragState = {
        isDragging: false,
        x: currentPos.current.x,
        y: currentPos.current.y,
        offset: {
          x: currentPos.current.x - startPos.current.x,
          y: currentPos.current.y - startPos.current.y,
        },
        velocity: vel,
      };

      callbacks.onDragEnd?.(finalState);

      // Apply momentum if velocity is significant
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      if (speed > 0.1) {
        applyMomentum();
      } else {
        // Check for snap points
        const snap = findNearestSnapPoint(
          currentPos.current.x,
          currentPos.current.y,
        );
        if (snap) {
          snapToPoint(snap.point, snap.index);
        }
      }

      velocity.current.reset();
    },
    [callbacks, applyMomentum, findNearestSnapPoint, snapToPoint],
  );

  const handlePointerCancel = useCallback(() => {
    isDragging.current = false;
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = null;
    }
    velocity.current.reset();
  }, []);

  const startDrag = useCallback((x: number, y: number) => {
    startPos.current = { x, y };
    currentPos.current = { x, y };
    isDragging.current = true;
    setState({
      isDragging: true,
      x,
      y,
      offset: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
    });
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = null;
    }
    setState((prev) => ({
      ...prev,
      isDragging: false,
    }));
  }, []);

  const setPosition = useCallback((x: number, y: number) => {
    currentPos.current = { x, y };
    setState((prev) => ({
      ...prev,
      x,
      y,
      offset: {
        x: x - startPos.current.x,
        y: y - startPos.current.y,
      },
    }));
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
      if (momentumId.current) {
        cancelAnimationFrame(momentumId.current);
      }
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel]);

  return {
    ref: elementRef,
    state,
    startDrag,
    stopDrag,
    setPosition,
  };
}