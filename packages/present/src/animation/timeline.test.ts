import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Timeline, createTimeline } from "./timeline";

describe("Timeline", () => {
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

  it("creates empty timeline", () => {
    const tl = new Timeline();
    expect(tl.total).toBe(0);
    expect(tl.current).toBe(0);
    expect(tl.playing).toBe(false);
    expect(tl.paused).toBe(false);
  });

  it("supports method chaining", () => {
    const tl = new Timeline();
    const result = tl.label("start").callback("step1", () => {}).wait(100);
    expect(result).toBe(tl);
    expect(tl.total).toBe(3); // label + callback + wait
  });

  it("adds callback steps", () => {
    const tl = new Timeline();
    tl.callback("step1", () => {});
    expect(tl.total).toBe(1);
  });

  it("adds labels", () => {
    const tl = new Timeline();
    tl.label("start");
    expect(tl.labelNames).toContain("start");
  });

  it("adds group steps", () => {
    const tl = new Timeline();
    tl.group("parallel", [() => {}, () => {}]);
    expect(tl.total).toBe(1);
  });

  it("adds wait steps", () => {
    const tl = new Timeline();
    tl.wait(500);
    expect(tl.total).toBe(1);
  });

  it("clears all steps", () => {
    const tl = new Timeline();
    tl.label("a").callback("b", () => {}).wait(100);
    expect(tl.total).toBe(3);
    tl.clear();
    expect(tl.total).toBe(0);
    expect(tl.labelNames).toHaveLength(0);
  });

  it("can stop and reset", () => {
    const tl = new Timeline();
    tl.callback("step", () => {});
    tl.stop();
    expect(tl.playing).toBe(false);
    expect(tl.paused).toBe(false);
    expect(tl.current).toBe(0);
  });

  it("pause and resume", () => {
    const tl = new Timeline();
    tl.pause();
    expect(tl.paused).toBe(true);
    expect(tl.playing).toBe(false);
  });

  it("destroy clears everything", () => {
    const tl = new Timeline();
    tl.label("a").callback("b", () => {});
    tl.destroy();
    expect(tl.total).toBe(0);
    expect(tl.playing).toBe(false);
  });
});

describe("createTimeline", () => {
  it("creates a new Timeline instance", () => {
    const tl = createTimeline();
    expect(tl).toBeInstanceOf(Timeline);
  });

  it("accepts config options", () => {
    const onComplete = vi.fn();
    const tl = createTimeline({ onComplete, defaultDelay: 100 });
    expect(tl).toBeInstanceOf(Timeline);
  });
});
