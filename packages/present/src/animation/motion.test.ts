import { describe, it, expect, vi } from "vitest";
import { MotionValue } from "./motion";

describe("MotionValue", () => {
  it("stores and returns initial value", () => {
    const mv = new MotionValue(42);
    expect(mv.get()).toBe(42);
  });

  it("updates value with set", () => {
    const mv = new MotionValue(0);
    mv.set(100);
    expect(mv.get()).toBe(100);
  });

  it("notifies listeners on set", () => {
    const mv = new MotionValue(0);
    const listener = vi.fn();
    mv.on(listener);
    mv.set(50);
    expect(listener).toHaveBeenCalledWith(50);
  });

  it("does not notify when value unchanged", () => {
    const mv = new MotionValue(42);
    const listener = vi.fn();
    mv.on(listener);
    mv.set(42);
    expect(listener).not.toHaveBeenCalled();
  });

  it("returns unsubscribe function from on", () => {
    const mv = new MotionValue(0);
    const listener = vi.fn();
    const unsub = mv.on(listener);
    unsub();
    mv.set(50);
    expect(listener).not.toHaveBeenCalled();
  });

  it("removes listener with off", () => {
    const mv = new MotionValue(0);
    const listener = vi.fn();
    mv.on(listener);
    mv.off(listener);
    mv.set(50);
    expect(listener).not.toHaveBeenCalled();
  });

  it("applies transformers via pipe", () => {
    const mv = new MotionValue(0);
    mv.pipe((v) => v * 2);
    mv.set(10);
    expect(mv.get()).toBe(20);
  });

  it("applies multiple transformers in order", () => {
    const mv = new MotionValue(0);
    mv.pipe((v) => v * 2, (v) => v + 1);
    mv.set(5);
    expect(mv.get()).toBe(11);
  });

  it("clears listeners and transformers on destroy", () => {
    const mv = new MotionValue(0);
    const listener = vi.fn();
    mv.on(listener);
    mv.pipe((v) => v * 2);
    mv.destroy();
    mv.set(50);
    expect(listener).not.toHaveBeenCalled();
    expect(mv.get()).toBe(50);
  });

  it("supports multiple listeners", () => {
    const mv = new MotionValue(0);
    const l1 = vi.fn();
    const l2 = vi.fn();
    mv.on(l1);
    mv.on(l2);
    mv.set(50);
    expect(l1).toHaveBeenCalledWith(50);
    expect(l2).toHaveBeenCalledWith(50);
  });
});
