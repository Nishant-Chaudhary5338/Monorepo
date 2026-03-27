import { describe, it, expect, beforeEach } from "vitest";
import { GestureRecognizer } from "./recognizer";

function makePointerEvent(overrides: Partial<PointerEvent> = {}): PointerEvent {
  return {
    pointerId: 1,
    clientX: 100,
    clientY: 100,
    timeStamp: 1000,
    ...overrides,
  } as PointerEvent;
}

describe("GestureRecognizer", () => {
  let recognizer: GestureRecognizer;

  beforeEach(() => {
    recognizer = new GestureRecognizer();
  });

  describe("pointerDown", () => {
    it("returns a gesture result", () => {
      const result = recognizer.pointerDown(makePointerEvent());
      expect(result).not.toBeNull();
      expect(result!.dx).toBe(0);
      expect(result!.dy).toBe(0);
      expect(result!.isActive).toBe(true);
    });

    it("tracks single pointer", () => {
      const result = recognizer.pointerDown(makePointerEvent());
      expect(result!.type).toBeNull();
    });
  });

  describe("pointerMove", () => {
    it("returns null for unknown pointer", () => {
      const result = recognizer.pointerMove(makePointerEvent({ pointerId: 99 }));
      expect(result).toBeNull();
    });

    it("calculates dx and dy", () => {
      recognizer.pointerDown(makePointerEvent({ clientX: 100, clientY: 100 }));
      const result = recognizer.pointerMove(makePointerEvent({ clientX: 150, clientY: 120 }));
      expect(result!.dx).toBe(50);
      expect(result!.dy).toBe(20);
    });

    it("detects drag gesture after threshold", () => {
      recognizer.pointerDown(makePointerEvent({ clientX: 100, clientY: 100 }));
      recognizer.pointerMove(makePointerEvent({ clientX: 100, clientY: 100 }));
      const result = recognizer.pointerMove(makePointerEvent({ clientX: 150, clientY: 100 }));
      expect(result!.type).toBe("drag");
    });
  });

  describe("pointerUp", () => {
    it("returns gesture result on release", () => {
      recognizer.pointerDown(makePointerEvent({ clientX: 100, clientY: 100, timeStamp: 0 }));
      const result = recognizer.pointerUp(makePointerEvent({ clientX: 100, clientY: 100, timeStamp: 10 }));
      expect(result).not.toBeNull();
      expect(result!.isActive).toBe(false);
    });

    it("resets state after last pointer up", () => {
      recognizer.pointerDown(makePointerEvent());
      recognizer.pointerUp(makePointerEvent());
      // Subsequent move should return null
      const result = recognizer.pointerMove(makePointerEvent());
      expect(result).toBeNull();
    });
  });

  describe("pointerCancel", () => {
    it("returns inactive result", () => {
      recognizer.pointerDown(makePointerEvent());
      const result = recognizer.pointerCancel(makePointerEvent());
      expect(result!.isActive).toBe(false);
    });
  });

  describe("reset", () => {
    it("clears all state", () => {
      recognizer.pointerDown(makePointerEvent());
      recognizer.reset();
      const result = recognizer.pointerMove(makePointerEvent());
      expect(result).toBeNull();
    });
  });
});
