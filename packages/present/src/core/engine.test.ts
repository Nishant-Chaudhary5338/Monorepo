import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AnimationEngine, springPresets } from "./engine";

describe("AnimationEngine", () => {
  let engine: AnimationEngine;

  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number;
    });
    globalThis.cancelAnimationFrame = vi.fn((id: number) => {
      clearTimeout(id);
    });
    globalThis.performance = { ...globalThis.performance, now: vi.fn(() => Date.now()) };
    engine = new AnimationEngine();
  });

  afterEach(() => {
    engine.destroy();
    vi.useRealTimers();
  });

  describe("animateSpring", () => {
    it("returns a spring id", () => {
      const id = engine.animateSpring({
        from: 0,
        to: 100,
        onUpdate: () => {},
      });
      expect(id).toMatch(/^spring_\d+$/);
    });

    it("increments active count", () => {
      expect(engine.activeCount).toBe(0);
      engine.animateSpring({ from: 0, to: 100, onUpdate: () => {} });
      expect(engine.activeCount).toBe(1);
    });

    it("uses default config when none provided", () => {
      const onUpdate = vi.fn();
      engine.animateSpring({ from: 0, to: 100, onUpdate });
      expect(engine.activeCount).toBe(1);
    });

    it("uses custom config", () => {
      const onUpdate = vi.fn();
      engine.animateSpring({
        from: 0,
        to: 100,
        config: springPresets.gentle,
        onUpdate,
      });
      expect(engine.activeCount).toBe(1);
    });
  });

  describe("setSpringTarget", () => {
    it("updates target of active spring", () => {
      const id = engine.animateSpring({ from: 0, to: 100, onUpdate: () => {} });
      engine.setSpringTarget(id, 200);
      expect(engine.isActive(id)).toBe(true);
    });

    it("does nothing for unknown id", () => {
      engine.setSpringTarget("unknown", 200);
      // Should not throw
    });
  });

  describe("setSpringConfig", () => {
    it("updates config of active spring", () => {
      const id = engine.animateSpring({ from: 0, to: 100, onUpdate: () => {} });
      engine.setSpringConfig(id, { stiffness: 300 });
      expect(engine.isActive(id)).toBe(true);
    });
  });

  describe("stopSpring", () => {
    it("stops a spring and calls onComplete", () => {
      const onComplete = vi.fn();
      const id = engine.animateSpring({
        from: 0,
        to: 100,
        onUpdate: () => {},
        onComplete,
      });
      engine.stopSpring(id);
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(engine.isActive(id)).toBe(false);
      expect(engine.activeCount).toBe(0);
    });

    it("does nothing for unknown id", () => {
      engine.stopSpring("unknown");
      // Should not throw
    });
  });

  describe("stopAll", () => {
    it("stops all springs and calls onComplete for each", () => {
      const onComplete1 = vi.fn();
      const onComplete2 = vi.fn();
      engine.animateSpring({ from: 0, to: 100, onUpdate: () => {}, onComplete: onComplete1 });
      engine.animateSpring({ from: 0, to: 200, onUpdate: () => {}, onComplete: onComplete2 });
      engine.stopAll();
      expect(onComplete1).toHaveBeenCalledTimes(1);
      expect(onComplete2).toHaveBeenCalledTimes(1);
      expect(engine.activeCount).toBe(0);
    });
  });

  describe("isActive", () => {
    it("returns true for active spring", () => {
      const id = engine.animateSpring({ from: 0, to: 100, onUpdate: () => {} });
      expect(engine.isActive(id)).toBe(true);
    });

    it("returns false for stopped spring", () => {
      const id = engine.animateSpring({ from: 0, to: 100, onUpdate: () => {} });
      engine.stopSpring(id);
      expect(engine.isActive(id)).toBe(false);
    });
  });
});
