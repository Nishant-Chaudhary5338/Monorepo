import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createAutoplayPlugin } from "./autoplay";

describe("createAutoplayPlugin", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a plugin with correct name", () => {
    const plugin = createAutoplayPlugin();
    expect(plugin.config.name).toBe("autoplay");
    expect(plugin.config.version).toBe("1.0.0");
  });

  it("does not auto-start by default", () => {
    const dispatch = vi.fn();
    const plugin = createAutoplayPlugin();
    plugin.hooks.onRegister?.({
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch,
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    });
    vi.advanceTimersByTime(6000);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("auto-starts when autoStart is true", () => {
    const dispatch = vi.fn();
    const plugin = createAutoplayPlugin({ autoStart: true, delay: 1000 });
    plugin.hooks.onRegister?.({
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch,
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    });
    vi.advanceTimersByTime(1000);
    expect(dispatch).toHaveBeenCalled();
  });

  it("stops on unregister", () => {
    const dispatch = vi.fn();
    const plugin = createAutoplayPlugin({ autoStart: true, delay: 1000 });
    const context = {
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch,
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    };
    plugin.hooks.onRegister?.(context);
    plugin.hooks.onUnregister?.();
    dispatch.mockClear();
    vi.advanceTimersByTime(2000);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("stops on deck:overview event", () => {
    const dispatch = vi.fn();
    const plugin = createAutoplayPlugin({ autoStart: true, delay: 1000 });
    const context = {
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch,
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    };
    plugin.hooks.onRegister?.(context);
    plugin.hooks.onEvent?.({
      type: "deck:overview",
      slideIndex: 0,
      fragmentIndex: 0,
      direction: "forward",
      timestamp: Date.now(),
    });
    dispatch.mockClear();
    vi.advanceTimersByTime(2000);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("respects custom delay", () => {
    const dispatch = vi.fn();
    const plugin = createAutoplayPlugin({ autoStart: true, delay: 5000 });
    plugin.hooks.onRegister?.({
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch,
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    });
    vi.advanceTimersByTime(4999);
    expect(dispatch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(dispatch).toHaveBeenCalled();
  });
});
