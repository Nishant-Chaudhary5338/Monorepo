/**
 * GestureRecognizer — Low-level pointer state machine
 *
 * Tracks pointer events and produces gesture state updates.
 * Pure logic — no React dependency.
 */

import { VelocityTracker2D } from "../core/math";

/** Gesture types */
export type GestureType = "swipe" | "drag" | "pinch" | "longpress" | null;

/** Pointer state */
export interface PointerState {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
}

/** Gesture result emitted after processing */
export interface GestureResult {
  type: GestureType;
  dx: number;
  dy: number;
  velocity: { x: number; y: number };
  scale: number;
  rotation: number;
  elapsed: number;
  isActive: boolean;
}

/** Configuration */
export interface RecognizerConfig {
  swipeThreshold: number;
  velocityThreshold: number;
  longPressDelay: number;
  preventDefault: boolean;
}

const DEFAULT_CONFIG: RecognizerConfig = {
  swipeThreshold: 50,
  velocityThreshold: 0.3,
  longPressDelay: 500,
  preventDefault: true,
};

export class GestureRecognizer {
  private pointers = new Map<number, PointerState>();
  private velocity = new VelocityTracker2D(5, 100);
  private config: RecognizerConfig;
  private initialDistance = 0;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private gestureType: GestureType = null;

  constructor(config: Partial<RecognizerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Handle pointer down */
  pointerDown(event: PointerEvent): GestureResult | null {
    const pointer: PointerState = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      startTime: event.timeStamp,
    };

    this.pointers.set(event.pointerId, pointer);
    this.velocity.reset();

    if (this.pointers.size === 1) {
      // Start long press timer
      this.longPressTimer = setTimeout(() => {
        if (this.pointers.size === 1 && this.gestureType === null) {
          this.gestureType = "longpress";
        }
      }, this.config.longPressDelay);
    }

    if (this.pointers.size === 2) {
      // Calculate initial pinch distance
      const pointers = Array.from(this.pointers.values());
      this.initialDistance = this.getDistance(pointers[0]!, pointers[1]!);
      this.clearLongPress();
    }

    return this.getResult(event);
  }

  /** Handle pointer move */
  pointerMove(event: PointerEvent): GestureResult | null {
    const pointer = this.pointers.get(event.pointerId);
    if (!pointer) return null;

    pointer.currentX = event.clientX;
    pointer.currentY = event.clientY;

    const dx = pointer.currentX - pointer.startX;
    const dy = pointer.currentY - pointer.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.velocity.push(pointer.currentX, pointer.currentY, event.timeStamp);

    // Determine gesture type
    if (this.gestureType === null && distance > 10) {
      this.clearLongPress();

      if (this.pointers.size === 2) {
        this.gestureType = "pinch";
      } else {
        this.gestureType = "drag";
      }
    }

    return this.getResult(event);
  }

  /** Handle pointer up */
  pointerUp(event: PointerEvent): GestureResult | null {
    this.pointers.delete(event.pointerId);
    this.clearLongPress();

    // Check for swipe on pointer up
    if (this.gestureType === "drag" || this.gestureType === null) {
      const vel = this.velocity.getVelocity();
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

      if (speed > this.config.velocityThreshold) {
        this.gestureType = "swipe";
      }
    }

    const result = this.getResult(event);

    // Reset state
    if (this.pointers.size === 0) {
      this.gestureType = null;
      this.velocity.reset();
    }

    return result;
  }

  /** Handle pointer cancel */
  pointerCancel(event: PointerEvent): GestureResult | null {
    this.pointers.delete(event.pointerId);
    this.clearLongPress();

    if (this.pointers.size === 0) {
      this.gestureType = null;
      this.velocity.reset();
    }

    return { ...this.getResult(event), isActive: false };
  }

  /** Get current gesture result */
  private getResult(event: PointerEvent): GestureResult {
    const pointers = Array.from(this.pointers.values());
    const first = pointers[0];

    const dx = first ? first.currentX - first.startX : 0;
    const dy = first ? first.currentY - first.startY : 0;
    const elapsed = first ? event.timeStamp - first.startTime : 0;

    let scale = 1;
    let rotation = 0;

    if (this.pointers.size === 2 && this.initialDistance > 0) {
      const currentDistance = this.getDistance(pointers[0]!, pointers[1]!);
      scale = currentDistance / this.initialDistance;
      rotation = this.getAngle(pointers[0]!, pointers[1]!);
    }

    return {
      type: this.gestureType,
      dx,
      dy,
      velocity: this.velocity.getVelocity(),
      scale,
      rotation,
      elapsed,
      isActive: this.pointers.size > 0,
    };
  }

  /** Distance between two pointers */
  private getDistance(a: PointerState, b: PointerState): number {
    const dx = a.currentX - b.currentX;
    const dy = a.currentY - b.currentY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** Angle between two pointers in degrees */
  private getAngle(a: PointerState, b: PointerState): number {
    const dx = b.currentX - a.currentX;
    const dy = b.currentY - a.currentY;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  /** Clear long press timer */
  private clearLongPress(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  /** Reset all state */
  reset(): void {
    this.pointers.clear();
    this.velocity.reset();
    this.gestureType = null;
    this.initialDistance = 0;
    this.clearLongPress();
  }

  /** Destroy the recognizer */
  destroy(): void {
    this.reset();
  }
}