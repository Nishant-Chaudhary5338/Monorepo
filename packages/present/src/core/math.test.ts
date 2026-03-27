import { describe, it, expect } from "vitest";
import {
  lerp,
  clamp,
  mapRange,
  roundTo,
  approximately,
  springSolver,
  VelocityTracker,
  VelocityTracker2D,
  degToRad,
  radToDeg,
  distance,
  midpoint,
  smoothStep,
  easeInOutCubic,
} from "./math";

describe("lerp", () => {
  it("interpolates between two values", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it("handles negative values", () => {
    expect(lerp(-10, 10, 0.5)).toBe(0);
    expect(lerp(-50, -10, 0.5)).toBe(-30);
  });

  it("extrapolates beyond bounds", () => {
    expect(lerp(0, 10, 2)).toBe(20);
    expect(lerp(0, 10, -1)).toBe(-10);
  });
});

describe("clamp", () => {
  it("returns value when within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles equal bounds", () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});

describe("mapRange", () => {
  it("maps value from one range to another", () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
  });

  it("maps boundary values", () => {
    expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
    expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
  });

  it("extrapolates outside input range", () => {
    expect(mapRange(15, 0, 10, 0, 100)).toBe(150);
  });
});

describe("roundTo", () => {
  it("rounds to specified decimal places", () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(3.14159, 4)).toBe(3.1416);
  });

  it("rounds to zero decimals", () => {
    expect(roundTo(3.7, 0)).toBe(4);
    expect(roundTo(3.2, 0)).toBe(3);
  });
});

describe("approximately", () => {
  it("returns true for close values", () => {
    expect(approximately(1.0, 1.0005)).toBe(true);
  });

  it("returns false for distant values", () => {
    expect(approximately(1.0, 2.0)).toBe(false);
  });

  it("respects custom epsilon", () => {
    expect(approximately(1.0, 1.1, 0.05)).toBe(false);
    expect(approximately(1.0, 1.01, 0.05)).toBe(true);
  });
});

describe("springSolver", () => {
  it("settles at target when at rest", () => {
    const result = springSolver({
      current: 100, target: 100, velocity: 0,
      stiffness: 170, damping: 26, mass: 1, deltaSeconds: 0.016,
    });
    expect(result.isSettled).toBe(true);
    expect(result.position).toBe(100);
    expect(result.velocity).toBe(0);
  });

  it("moves toward target from offset position", () => {
    const result = springSolver({
      current: 0, target: 100, velocity: 0,
      stiffness: 170, damping: 26, mass: 1, deltaSeconds: 0.016,
    });
    expect(result.position).toBeGreaterThan(0);
    expect(result.isSettled).toBe(false);
  });

  it("converges after many steps", () => {
    let pos = 0, vel = 0;
    const target = 100;
    for (let i = 0; i < 500; i++) {
      const result = springSolver({
        current: pos, target, velocity: vel,
        stiffness: 170, damping: 26, mass: 1, deltaSeconds: 0.016,
      });
      pos = result.position;
      vel = result.velocity;
      if (result.isSettled) break;
    }
    expect(pos).toBe(target);
    expect(vel).toBe(0);
  });

  it("handles zero displacement with velocity", () => {
    const result = springSolver({
      current: 50, target: 50, velocity: 10,
      stiffness: 100, damping: 10, mass: 1, deltaSeconds: 0.016,
    });
    expect(result.velocity).not.toBe(0);
  });
});

describe("VelocityTracker", () => {
  it("returns 0 with insufficient samples", () => {
    const tracker = new VelocityTracker();
    expect(tracker.getVelocity()).toBe(0);
    tracker.push(10, 100);
    expect(tracker.getVelocity()).toBe(0);
  });

  it("calculates velocity from samples", () => {
    const tracker = new VelocityTracker();
    tracker.push(0, 0);
    tracker.push(100, 100);
    expect(tracker.getVelocity()).toBe(1);
  });

  it("resets to empty state", () => {
    const tracker = new VelocityTracker();
    tracker.push(10, 100);
    tracker.push(20, 200);
    tracker.reset();
    expect(tracker.getVelocity()).toBe(0);
  });
});

describe("VelocityTracker2D", () => {
  it("tracks 2D velocity", () => {
    const tracker = new VelocityTracker2D();
    tracker.push(0, 0, 0);
    tracker.push(100, 50, 100);
    const vel = tracker.getVelocity();
    expect(vel.x).toBe(1);
    expect(vel.y).toBe(0.5);
  });

  it("calculates speed", () => {
    const tracker = new VelocityTracker2D();
    tracker.push(0, 0, 0);
    tracker.push(3, 4, 1);
    expect(tracker.getSpeed()).toBe(5);
  });

  it("resets both trackers", () => {
    const tracker = new VelocityTracker2D();
    tracker.push(10, 20, 100);
    tracker.push(20, 30, 200);
    tracker.reset();
    expect(tracker.getVelocity()).toEqual({ x: 0, y: 0 });
  });
});

describe("degToRad", () => {
  it("converts degrees to radians", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
    expect(degToRad(0)).toBe(0);
  });
});

describe("radToDeg", () => {
  it("converts radians to degrees", () => {
    expect(radToDeg(Math.PI)).toBeCloseTo(180);
    expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
    expect(radToDeg(0)).toBe(0);
  });
});

describe("distance", () => {
  it("calculates Euclidean distance", () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
    expect(distance(0, 0, 0, 0)).toBe(0);
  });

  it("handles negative coordinates", () => {
    expect(distance(-3, -4, 0, 0)).toBe(5);
  });
});

describe("midpoint", () => {
  it("calculates midpoint", () => {
    expect(midpoint(0, 0, 10, 10)).toEqual({ x: 5, y: 5 });
    expect(midpoint(0, 0, 0, 0)).toEqual({ x: 0, y: 0 });
  });

  it("handles negative coordinates", () => {
    expect(midpoint(-10, -10, 10, 10)).toEqual({ x: 0, y: 0 });
  });
});

describe("smoothStep", () => {
  it("returns 0 at edge0", () => {
    expect(smoothStep(0, 1, 0)).toBe(0);
  });

  it("returns 1 at edge1", () => {
    expect(smoothStep(0, 1, 1)).toBe(1);
  });

  it("returns 0.5 at midpoint", () => {
    expect(smoothStep(0, 1, 0.5)).toBe(0.5);
  });

  it("clamps below edge0", () => {
    expect(smoothStep(0, 1, -1)).toBe(0);
  });

  it("clamps above edge1", () => {
    expect(smoothStep(0, 1, 2)).toBe(1);
  });
});

describe("easeInOutCubic", () => {
  it("returns 0 at t=0", () => {
    expect(easeInOutCubic(0)).toBe(0);
  });

  it("returns 1 at t=1", () => {
    expect(easeInOutCubic(1)).toBeCloseTo(1);
  });

  it("returns 0.5 at t=0.5", () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });
});
