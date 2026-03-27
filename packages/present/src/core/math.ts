/**
 * Math utilities for animations and physics
 * Pure functions — no dependencies
 */

/** Linear interpolation between two values */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** Round to a specific number of decimal places */
export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Check if two numbers are approximately equal */
export function approximately(a: number, b: number, epsilon = 0.001): boolean {
  return Math.abs(a - b) < epsilon;
}

/** Spring solver — computes next position given spring physics parameters
 *
 * Uses the analytical damped harmonic oscillator solution:
 * x(t) = e^(-damping * t) * (A * cos(ωt) + B * sin(ωt))
 *
 * For real-time animation, we use a discrete approximation that's
 * stable and converges to the target.
 */
export function springSolver({
  current,
  target,
  velocity,
  stiffness,
  damping,
  mass,
  deltaSeconds,
}: {
  current: number;
  target: number;
  velocity: number;
  stiffness: number;
  damping: number;
  mass: number;
  deltaSeconds: number;
}): { position: number; velocity: number; isSettled: boolean } {
  // Force from spring (Hooke's law): F = -k * displacement
  const displacement = current - target;
  const springForce = -stiffness * displacement;

  // Damping force: F = -c * velocity
  const dampingForce = -damping * velocity;

  // Total acceleration: a = F / m
  const acceleration = (springForce + dampingForce) / mass;

  // Semi-implicit Euler integration (more stable than explicit Euler)
  const newVelocity = velocity + acceleration * deltaSeconds;
  const newPosition = current + newVelocity * deltaSeconds;

  // Check if settled (velocity and displacement are negligible)
  const isSettled =
    Math.abs(newVelocity) < 0.001 && Math.abs(newPosition - target) < 0.001;

  return {
    position: isSettled ? target : newPosition,
    velocity: isSettled ? 0 : newVelocity,
    isSettled,
  };
}

/** Velocity tracker — tracks velocity over a time window */
export class VelocityTracker {
  private samples: Array<{ value: number; timestamp: number }> = [];
  private maxSamples: number;
  private windowMs: number;

  constructor(maxSamples = 5, windowMs = 100) {
    this.maxSamples = maxSamples;
    this.windowMs = windowMs;
  }

  /** Add a sample */
  push(value: number, timestamp: number): void {
    this.samples.push({ value, timestamp });
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
    // Remove old samples outside the window
    const cutoff = timestamp - this.windowMs;
    this.samples = this.samples.filter((s) => s.timestamp >= cutoff);
  }

  /** Get current velocity (units per millisecond) */
  getVelocity(): number {
    if (this.samples.length < 2) return 0;

    const first = this.samples[0]!;
    const last = this.samples[this.samples.length - 1]!;
    const dt = last.timestamp - first.timestamp;

    if (dt === 0) return 0;

    return (last.value - first.value) / dt;
  }

  /** Reset the tracker */
  reset(): void {
    this.samples = [];
  }
}

/** 2D velocity tracker */
export class VelocityTracker2D {
  x: VelocityTracker;
  y: VelocityTracker;

  constructor(maxSamples = 5, windowMs = 100) {
    this.x = new VelocityTracker(maxSamples, windowMs);
    this.y = new VelocityTracker(maxSamples, windowMs);
  }

  push(x: number, y: number, timestamp: number): void {
    this.x.push(x, timestamp);
    this.y.push(y, timestamp);
  }

  getVelocity(): { x: number; y: number } {
    return { x: this.x.getVelocity(), y: this.y.getVelocity() };
  }

  getSpeed(): number {
    const v = this.getVelocity();
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  reset(): void {
    this.x.reset();
    this.y.reset();
  }
}

/** Degrees to radians */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Radians to degrees */
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/** Distance between two 2D points */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/** Midpoint between two 2D points */
export function midpoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { x: number; y: number } {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

/** Smooth step — Hermite interpolation */
export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Ease in-out cubic */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}