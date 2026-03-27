import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FrameScheduler } from "./scheduler";

describe("FrameScheduler", () => {
  let scheduler: FrameScheduler;

  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame
    globalThis.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number;
    });
    globalThis.cancelAnimationFrame = vi.fn((id: number) => {
      clearTimeout(id);
    });
    globalThis.performance = { ...globalThis.performance, now: vi.fn(() => Date.now()) };
    scheduler = new FrameScheduler();
  });

  afterEach(() => {
    scheduler.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("schedule", () => {
    it("returns a task id", () => {
      const id = scheduler.schedule("normal", () => {});
      expect(id).toMatch(/^task_\d+$/);
    });

    it("auto-starts when a task is scheduled", () => {
      scheduler.schedule("normal", () => {});
      expect(scheduler.running).toBe(true);
    });
  });

  describe("cancel", () => {
    it("removes a task", () => {
      const id = scheduler.schedule("normal", () => {});
      expect(scheduler.size).toBe(1);
      scheduler.cancel(id);
      expect(scheduler.size).toBe(0);
    });

    it("auto-stops when no tasks remain", () => {
      const id = scheduler.schedule("normal", () => {});
      scheduler.cancel(id);
      expect(scheduler.running).toBe(false);
    });
  });

  describe("setEnabled", () => {
    it("disables and re-enables a task", () => {
      const callback = vi.fn();
      const id = scheduler.schedule("normal", callback);
      scheduler.setEnabled(id, false);
      // Task still exists but is disabled
      expect(scheduler.size).toBe(1);
      scheduler.setEnabled(id, true);
    });
  });

  describe("destroy", () => {
    it("stops scheduler and clears all tasks", () => {
      scheduler.schedule("normal", () => {});
      scheduler.schedule("high", () => {});
      scheduler.destroy();
      expect(scheduler.size).toBe(0);
      expect(scheduler.running).toBe(false);
    });
  });
});
