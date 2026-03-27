import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAnalyticsPlugin } from "./analytics";

describe("createAnalyticsPlugin", () => {
  it("creates a plugin with correct name", () => {
    const plugin = createAnalyticsPlugin();
    expect(plugin.config.name).toBe("analytics");
    expect(plugin.config.version).toBe("1.0.0");
  });

  it("calls onTrack on session:start when registered", () => {
    const onTrack = vi.fn();
    const plugin = createAnalyticsPlugin({ onTrack });
    const context = {
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch: vi.fn(),
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    };
    plugin.hooks.onRegister?.(context);
    expect(onTrack).toHaveBeenCalledWith("session:start", expect.objectContaining({ sessionId: expect.any(String) }));
  });

  it("tracks slide:enter events", () => {
    const onTrack = vi.fn();
    const plugin = createAnalyticsPlugin({ onTrack, trackSlideViews: true });
    const context = {
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch: vi.fn(),
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    };
    plugin.hooks.onRegister?.(context);
    onTrack.mockClear();

    plugin.hooks.onEvent?.({
      type: "slide:enter",
      slideIndex: 2,
      fragmentIndex: 0,
      direction: "forward",
      timestamp: Date.now(),
    });
    expect(onTrack).toHaveBeenCalledWith("slide:enter", expect.objectContaining({ slideIndex: 2 }));
  });

  it("tracks session:end on unregister", () => {
    const onTrack = vi.fn();
    const plugin = createAnalyticsPlugin({ onTrack });
    const context = {
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch: vi.fn(),
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    };
    plugin.hooks.onRegister?.(context);
    onTrack.mockClear();
    plugin.hooks.onUnregister?.();
    expect(onTrack).toHaveBeenCalledWith("session:end", expect.objectContaining({
      slideViews: expect.any(Object),
      slideTimers: expect.any(Object),
    }));
  });

  it("respects trackSlideViews option", () => {
    const onTrack = vi.fn();
    const plugin = createAnalyticsPlugin({ onTrack, trackSlideViews: false });
    const context = {
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch: vi.fn(),
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    };
    plugin.hooks.onRegister?.(context);
    onTrack.mockClear();

    plugin.hooks.onEvent?.({
      type: "slide:enter",
      slideIndex: 1,
      fragmentIndex: 0,
      direction: "forward",
      timestamp: Date.now(),
    });
    const slideEnterCalls = onTrack.mock.calls.filter(c => c[0] === "slide:enter");
    expect(slideEnterCalls).toHaveLength(0);
  });

  it("tracks fragment:step when trackInteractions is true", () => {
    const onTrack = vi.fn();
    const plugin = createAnalyticsPlugin({ onTrack, trackInteractions: true });
    const context = {
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch: vi.fn(),
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    };
    plugin.hooks.onRegister?.(context);
    onTrack.mockClear();

    plugin.hooks.onEvent?.({
      type: "fragment:step",
      slideIndex: 0,
      fragmentIndex: 1,
      direction: "forward",
      timestamp: Date.now(),
    });
    expect(onTrack).toHaveBeenCalledWith("fragment:step", expect.objectContaining({ fragmentIndex: 1 }));
  });

  it("uses custom sessionId", () => {
    const onTrack = vi.fn();
    const plugin = createAnalyticsPlugin({ onTrack, sessionId: "my-session" });
    const context = {
      getState: () => ({ current: 0, total: 5, fragment: 0, isFullscreen: false, isOverview: false, isPresenter: false, direction: "forward" as const, isTransitioning: false }),
      dispatch: vi.fn(),
      getSlideElement: () => null,
      getViewportElement: () => null,
      storage: new Map(),
    };
    plugin.hooks.onRegister?.(context);
    expect(onTrack).toHaveBeenCalledWith("session:start", expect.objectContaining({ sessionId: "my-session" }));
  });
});
