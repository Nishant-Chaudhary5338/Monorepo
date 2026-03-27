import { describe, it, expect, vi, beforeEach } from "vitest";
import { PluginManager, createPluginManager } from "./manager";
import type { Plugin, PluginContext } from "./types";

function makePlugin(name: string, hooks: Record<string, unknown> = {}): Plugin {
  return {
    config: { name, version: "1.0.0" },
    hooks: hooks as Plugin["hooks"],
  };
}

describe("PluginManager", () => {
  let manager: PluginManager;

  beforeEach(() => {
    manager = new PluginManager();
  });

  describe("register", () => {
    it("registers a plugin", () => {
      const plugin = makePlugin("test");
      manager.register(plugin);
      expect(manager.has("test")).toBe(true);
      expect(manager.size).toBe(1);
    });

    it("calls onRegister hook", () => {
      const onRegister = vi.fn();
      const plugin = makePlugin("test", { onRegister });
      manager.register(plugin);
      expect(onRegister).toHaveBeenCalledTimes(1);
      expect(onRegister).toHaveBeenCalledWith(expect.objectContaining({
        getState: expect.any(Function),
        dispatch: expect.any(Function),
        storage: expect.any(Map),
      }));
    });

    it("does not register duplicate plugins", () => {
      const plugin = makePlugin("test");
      manager.register(plugin);
      manager.register(plugin);
      expect(manager.size).toBe(1);
    });

    it("checks dependencies", () => {
      const onEvent = vi.fn();
      const plugin: Plugin = {
        config: { name: "dependent", dependencies: ["missing"] },
        hooks: { onEvent },
      };
      const errorListener = vi.fn();
      manager.on(errorListener);
      manager.register(plugin);
      expect(manager.has("dependent")).toBe(false);
      expect(errorListener).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }));
    });

    it("resolves dependencies when present", () => {
      manager.register(makePlugin("base"));
      const plugin: Plugin = {
        config: { name: "dependent", dependencies: ["base"] },
        hooks: {},
      };
      manager.register(plugin);
      expect(manager.has("dependent")).toBe(true);
    });

    it("emits register event", () => {
      const listener = vi.fn();
      manager.on(listener);
      manager.register(makePlugin("test"));
      expect(listener).toHaveBeenCalledWith({ type: "register", plugin: expect.any(Object) });
    });
  });

  describe("unregister", () => {
    it("unregisters a plugin", () => {
      manager.register(makePlugin("test"));
      manager.unregister("test");
      expect(manager.has("test")).toBe(false);
      expect(manager.size).toBe(0);
    });

    it("calls onUnregister hook", () => {
      const onUnregister = vi.fn();
      manager.register(makePlugin("test", { onUnregister }));
      manager.unregister("test");
      expect(onUnregister).toHaveBeenCalledTimes(1);
    });

    it("emits unregister event", () => {
      const listener = vi.fn();
      manager.register(makePlugin("test"));
      manager.on(listener);
      manager.unregister("test");
      expect(listener).toHaveBeenCalledWith({ type: "unregister", plugin: expect.any(Object) });
    });

    it("warns for unknown plugin", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      manager.unregister("unknown");
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe("unregisterAll", () => {
    it("removes all plugins", () => {
      manager.register(makePlugin("a"));
      manager.register(makePlugin("b"));
      manager.unregisterAll();
      expect(manager.size).toBe(0);
    });
  });

  describe("get / getNames", () => {
    it("retrieves plugin by name", () => {
      const plugin = makePlugin("test");
      manager.register(plugin);
      expect(manager.get("test")).toBe(plugin);
    });

    it("returns undefined for unknown", () => {
      expect(manager.get("unknown")).toBeUndefined();
    });

    it("returns all plugin names", () => {
      manager.register(makePlugin("a"));
      manager.register(makePlugin("b"));
      expect(manager.getNames()).toEqual(["a", "b"]);
    });
  });

  describe("dispatch", () => {
    it("dispatches event to all plugins", () => {
      const onEvent1 = vi.fn();
      const onEvent2 = vi.fn();
      manager.register(makePlugin("a", { onEvent: onEvent1 }));
      manager.register(makePlugin("b", { onEvent: onEvent2 }));
      const event = { type: "slide:enter" as const, slideIndex: 0, fragmentIndex: 0, direction: "forward" as const, timestamp: Date.now() };
      manager.dispatch(event);
      expect(onEvent1).toHaveBeenCalledWith(event);
      expect(onEvent2).toHaveBeenCalledWith(event);
    });

    it("isolates errors between plugins", () => {
      const errorPlugin = makePlugin("bad", {
        onEvent: () => { throw new Error("boom"); },
      });
      const goodOnEvent = vi.fn();
      const goodPlugin = makePlugin("good", { onEvent: goodOnEvent });
      vi.spyOn(console, "error").mockImplementation(() => {});
      manager.register(errorPlugin);
      manager.register(goodPlugin);
      const event = { type: "slide:enter" as const, slideIndex: 0, fragmentIndex: 0, direction: "forward" as const, timestamp: Date.now() };
      manager.dispatch(event);
      expect(goodOnEvent).toHaveBeenCalled();
      vi.restoreAllMocks();
    });
  });

  describe("callHook", () => {
    it("calls a specific hook on all plugins", () => {
      const onSlideChange1 = vi.fn();
      const onSlideChange2 = vi.fn();
      manager.register(makePlugin("a", { onSlideChange: onSlideChange1 }));
      manager.register(makePlugin("b", { onSlideChange: onSlideChange2 }));
      manager.callHook("onSlideChange", 3, 0);
      expect(onSlideChange1).toHaveBeenCalledWith(3, 0);
      expect(onSlideChange2).toHaveBeenCalledWith(3, 0);
    });
  });

  describe("destroy", () => {
    it("unregisters all plugins and clears listeners", () => {
      const onUnregister = vi.fn();
      manager.register(makePlugin("test", { onUnregister }));
      manager.destroy();
      expect(onUnregister).toHaveBeenCalled();
      expect(manager.size).toBe(0);
    });
  });
});

describe("createPluginManager", () => {
  it("creates a new PluginManager instance", () => {
    const manager = createPluginManager();
    expect(manager).toBeInstanceOf(PluginManager);
  });
});
