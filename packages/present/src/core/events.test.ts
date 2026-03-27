import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeckEventBus } from "./events";

describe("DeckEventBus", () => {
  let bus: DeckEventBus;

  beforeEach(() => {
    bus = new DeckEventBus();
  });

  describe("on / off / emit", () => {
    it("registers and triggers listeners", () => {
      const handler = vi.fn();
      bus.on("slide:enter", handler);
      bus.emit({
        type: "slide:enter",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("removes listeners with off", () => {
      const handler = vi.fn();
      bus.on("slide:enter", handler);
      bus.off("slide:enter", handler);
      bus.emit({
        type: "slide:enter",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      expect(handler).not.toHaveBeenCalled();
    });

    it("returns unsubscribe function from on", () => {
      const handler = vi.fn();
      const unsub = bus.on("slide:enter", handler);
      unsub();
      bus.emit({
        type: "slide:enter",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      expect(handler).not.toHaveBeenCalled();
    });

    it("supports multiple listeners", () => {
      const h1 = vi.fn();
      const h2 = vi.fn();
      bus.on("slide:enter", h1);
      bus.on("slide:enter", h2);
      bus.emit({
        type: "slide:enter",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      expect(h1).toHaveBeenCalledTimes(1);
      expect(h2).toHaveBeenCalledTimes(1);
    });
  });

  describe("wildcard listener", () => {
    it("receives all events with * listener", () => {
      const handler = vi.fn();
      bus.on("*", handler);
      bus.emit({
        type: "slide:enter",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      bus.emit({
        type: "deck:fullscreen",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe("plugins", () => {
    it("calls plugin onEvent for every emit", () => {
      const onEvent = vi.fn();
      bus.use({ name: "test", onEvent });
      bus.emit({
        type: "slide:enter",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      expect(onEvent).toHaveBeenCalledTimes(1);
    });

    it("removes plugin with returned unsubscriber", () => {
      const onEvent = vi.fn();
      const remove = bus.use({ name: "test", onEvent });
      remove();
      bus.emit({
        type: "slide:enter",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      expect(onEvent).not.toHaveBeenCalled();
    });

    it("calls onDestroy when plugin is removed", () => {
      const onDestroy = vi.fn();
      const remove = bus.use({ name: "test", onDestroy });
      remove();
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });
  });

  describe("destroy", () => {
    it("clears all listeners and calls plugin onDestroy", () => {
      const handler = vi.fn();
      const onDestroy = vi.fn();
      bus.on("slide:enter", handler);
      bus.use({ name: "test", onDestroy });
      bus.destroy();
      expect(onDestroy).toHaveBeenCalledTimes(1);
      bus.emit({
        type: "slide:enter",
        slideIndex: 0,
        fragmentIndex: 0,
        direction: "forward",
        timestamp: Date.now(),
      });
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
