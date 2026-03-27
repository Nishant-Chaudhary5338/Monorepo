import { describe, it, expect, vi } from "vitest";
import { matchesShortcut, defaultShortcuts } from "./keyboard";

describe("matchesShortcut", () => {
  function makeKeyboardEvent(overrides: Partial<KeyboardEvent> = {}): KeyboardEvent {
    return {
      key: "ArrowRight",
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      ...overrides,
    } as KeyboardEvent;
  }

  it("matches simple key", () => {
    const event = makeKeyboardEvent({ key: "ArrowRight" });
    expect(matchesShortcut(event, { key: "ArrowRight" })).toBe(true);
  });

  it("rejects wrong key", () => {
    const event = makeKeyboardEvent({ key: "ArrowLeft" });
    expect(matchesShortcut(event, { key: "ArrowRight" })).toBe(false);
  });

  it("matches with ctrl modifier", () => {
    const event = makeKeyboardEvent({ key: "a", ctrlKey: true });
    expect(matchesShortcut(event, { key: "a", ctrl: true })).toBe(true);
  });

  it("rejects when ctrl is missing", () => {
    const event = makeKeyboardEvent({ key: "a", ctrlKey: false });
    expect(matchesShortcut(event, { key: "a", ctrl: true })).toBe(false);
  });

  it("rejects when extra ctrl is pressed", () => {
    const event = makeKeyboardEvent({ key: "a", ctrlKey: true });
    expect(matchesShortcut(event, { key: "a" })).toBe(false);
  });

  it("matches with shift modifier", () => {
    const event = makeKeyboardEvent({ key: "ArrowRight", shiftKey: true });
    expect(matchesShortcut(event, { key: "ArrowRight", shift: true })).toBe(true);
  });

  it("matches with alt modifier", () => {
    const event = makeKeyboardEvent({ key: "f", altKey: true });
    expect(matchesShortcut(event, { key: "f", alt: true })).toBe(true);
  });

  it("matches with meta modifier", () => {
    const event = makeKeyboardEvent({ key: "s", metaKey: true });
    expect(matchesShortcut(event, { key: "s", meta: true })).toBe(true);
  });

  it("rejects when extra modifiers pressed", () => {
    const event = makeKeyboardEvent({ key: "a", shiftKey: true, altKey: true });
    expect(matchesShortcut(event, { key: "a", shift: true })).toBe(false);
  });

  it("matches space key", () => {
    const event = makeKeyboardEvent({ key: " " });
    expect(matchesShortcut(event, { key: " " })).toBe(true);
  });
});

describe("defaultShortcuts", () => {
  it("has expected shortcuts", () => {
    expect(defaultShortcuts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "ArrowRight" }),
        expect.objectContaining({ key: "ArrowLeft" }),
        expect.objectContaining({ key: " " }),
        expect.objectContaining({ key: "f" }),
        expect.objectContaining({ key: "Escape" }),
      ])
    );
  });

  it("does not have action properties", () => {
    for (const shortcut of defaultShortcuts) {
      expect(shortcut).not.toHaveProperty("action");
    }
  });
});
