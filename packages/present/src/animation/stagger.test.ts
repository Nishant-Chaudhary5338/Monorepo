import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateStaggerDelay, staggerAnimate, StaggerController, createStagger, springPresets } from "./stagger";

describe("calculateStaggerDelay", () => {
  const baseConfig = {
    staggerDelay: 50,
    startDelay: 0,
    direction: "forward" as const,
    spring: springPresets.default,
    priority: "normal" as const,
  };

  it("calculates forward stagger", () => {
    expect(calculateStaggerDelay(0, 5, baseConfig)).toBe(0);
    expect(calculateStaggerDelay(1, 5, baseConfig)).toBe(50);
    expect(calculateStaggerDelay(2, 5, baseConfig)).toBe(100);
  });

  it("calculates backward stagger", () => {
    const config = { ...baseConfig, direction: "backward" as const };
    expect(calculateStaggerDelay(0, 5, config)).toBe(200);
    expect(calculateStaggerDelay(4, 5, config)).toBe(0);
  });

  it("calculates center stagger", () => {
    const config = { ...baseConfig, direction: "center" as const };
    const d0 = calculateStaggerDelay(0, 5, config);
    const d2 = calculateStaggerDelay(2, 5, config);
    expect(d2).toBe(0); // center has 0 delay
    expect(d0).toBeGreaterThan(0); // edges have more delay
  });

  it("calculates edges stagger", () => {
    const config = { ...baseConfig, direction: "edges" as const };
    const d0 = calculateStaggerDelay(0, 5, config);
    const d2 = calculateStaggerDelay(2, 5, config);
    expect(d0).toBe(0); // edges have 0 delay
    expect(d2).toBeGreaterThan(0); // center has more delay
  });

  it("respects startDelay", () => {
    const config = { ...baseConfig, startDelay: 100 };
    expect(calculateStaggerDelay(0, 5, config)).toBe(100);
    expect(calculateStaggerDelay(1, 5, config)).toBe(150);
  });

  it("uses custom getDelay when provided", () => {
    const config = { ...baseConfig, getDelay: (i: number) => i * 100 };
    expect(calculateStaggerDelay(0, 5, config)).toBe(0);
    expect(calculateStaggerDelay(3, 5, config)).toBe(300);
  });
});

describe("staggerAnimate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number;
    });
    globalThis.cancelAnimationFrame = vi.fn((id: number) => { clearTimeout(id); });
    globalThis.performance = { ...globalThis.performance, now: vi.fn(() => Date.now()) };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns results for each child", () => {
    const results = staggerAnimate(3, () => {}, { from: 0, to: 1 });
    expect(results).toHaveLength(3);
    results.forEach((r, i) => {
      expect(r.index).toBe(i);
      expect(r.springId).toBeDefined();
      expect(r.delay).toBeGreaterThanOrEqual(0);
    });
  });

  it("increments delay for each child in forward direction", () => {
    const results = staggerAnimate(3, () => {}, { from: 0, to: 1 });
    expect(results[0]!.delay).toBeLessThan(results[2]!.delay);
  });
});

describe("StaggerController", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number;
    });
    globalThis.cancelAnimationFrame = vi.fn((id: number) => { clearTimeout(id); });
    globalThis.performance = { ...globalThis.performance, now: vi.fn(() => Date.now()) };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates controller with default config", () => {
    const controller = new StaggerController();
    expect(controller.animating).toBe(false);
  });

  it("tracks animating state", () => {
    const controller = new StaggerController();
    controller.start(3, () => {}, { from: 0, to: 1 });
    expect(controller.animating).toBe(true);
  });

  it("stops animation", () => {
    const controller = new StaggerController();
    controller.start(3, () => {}, { from: 0, to: 1 });
    controller.stop();
    expect(controller.animating).toBe(false);
  });

  it("updates config", () => {
    const controller = new StaggerController();
    controller.setConfig({ staggerDelay: 200 });
    // Should not throw
  });

  it("destroy stops animation", () => {
    const controller = new StaggerController();
    controller.start(3, () => {}, { from: 0, to: 1 });
    controller.destroy();
    expect(controller.animating).toBe(false);
  });
});

describe("createStagger", () => {
  it("creates a StaggerController", () => {
    const controller = createStagger();
    expect(controller).toBeInstanceOf(StaggerController);
  });
});
