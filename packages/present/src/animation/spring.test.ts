import { describe, it, expect } from "vitest";
import {
  createSpring,
  stepSpring,
  setSpringTarget,
  setSpringConfig,
  getSpringValue,
  isSpringSettled,
  springPresets,
} from "./spring";

describe("createSpring", () => {
  it("creates settled spring when no initial position given", () => {
    const spring = createSpring(100);
    expect(spring.position).toBe(100);
    expect(spring.velocity).toBe(0);
    expect(spring.target).toBe(100);
    expect(spring.isSettled).toBe(true);
  });

  it("creates active spring when initial position differs from target", () => {
    const spring = createSpring(100, springPresets.default, 0);
    expect(spring.position).toBe(0);
    expect(spring.target).toBe(100);
    expect(spring.isSettled).toBe(false);
  });

  it("accepts custom config", () => {
    const spring = createSpring(100, springPresets.gentle);
    expect(spring.config).toEqual(springPresets.gentle);
  });
});

describe("stepSpring", () => {
  it("does not move settled spring", () => {
    const spring = createSpring(100);
    const result = stepSpring(spring, 0.016);
    expect(result).toBe(spring);
  });

  it("moves active spring toward target", () => {
    const spring = createSpring(100, springPresets.default, 0);
    const result = stepSpring(spring, 0.016);
    expect(result.position).toBeGreaterThan(0);
    expect(result.isSettled).toBe(false);
  });

  it("converges to target after many steps", () => {
    let spring = createSpring(100, springPresets.default, 0);
    for (let i = 0; i < 500; i++) {
      spring = stepSpring(spring, 0.016);
      if (spring.isSettled) break;
    }
    expect(spring.position).toBe(100);
    expect(spring.isSettled).toBe(true);
  });
});

describe("setSpringTarget", () => {
  it("updates target", () => {
    const spring = createSpring(50);
    const result = setSpringTarget(spring, 200);
    expect(result.target).toBe(200);
  });

  it("maintains settled state when position matches new target", () => {
    const spring = createSpring(50);
    const result = setSpringTarget(spring, 50);
    expect(result.isSettled).toBe(true);
  });
});

describe("setSpringConfig", () => {
  it("merges partial config", () => {
    const spring = createSpring(100);
    const result = setSpringConfig(spring, { stiffness: 300 });
    expect(result.config.stiffness).toBe(300);
    expect(result.config.damping).toBe(spring.config.damping);
  });
});

describe("getSpringValue", () => {
  it("returns current position", () => {
    const spring = createSpring(100, springPresets.default, 42);
    expect(getSpringValue(spring)).toBe(42);
  });
});

describe("isSpringSettled", () => {
  it("returns settled state", () => {
    expect(isSpringSettled(createSpring(100))).toBe(true);
    expect(isSpringSettled(createSpring(100, springPresets.default, 0))).toBe(false);
  });
});

describe("springPresets", () => {
  it("has expected presets", () => {
    expect(springPresets.default).toBeDefined();
    expect(springPresets.gentle).toBeDefined();
    expect(springPresets.wobbly).toBeDefined();
    expect(springPresets.stiff).toBeDefined();
    expect(springPresets.slow).toBeDefined();
    expect(springPresets.molasses).toBeDefined();
  });

  it("presets have valid config shape", () => {
    for (const preset of Object.values(springPresets)) {
      expect(preset.stiffness).toBeGreaterThan(0);
      expect(preset.damping).toBeGreaterThan(0);
      expect(preset.mass).toBeGreaterThan(0);
    }
  });
});
