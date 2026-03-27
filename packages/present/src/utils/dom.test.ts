import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isFullscreen, getSlideElements, getSlideElement, scrollIntoView } from "./dom";

describe("isFullscreen", () => {
  it("returns false when not fullscreen", () => {
    Object.defineProperty(document, "fullscreenElement", {
      value: null,
      writable: true,
      configurable: true,
    });
    expect(isFullscreen()).toBe(false);
  });

  it("returns true when fullscreen", () => {
    Object.defineProperty(document, "fullscreenElement", {
      value: document.createElement("div"),
      writable: true,
      configurable: true,
    });
    expect(isFullscreen()).toBe(true);
  });
});

describe("getSlideElements", () => {
  it("finds all data-slide elements", () => {
    const container = document.createElement("div");
    for (let i = 0; i < 3; i++) {
      const slide = document.createElement("div");
      slide.setAttribute("data-slide", String(i));
      container.appendChild(slide);
    }
    const result = getSlideElements(container);
    expect(result).toHaveLength(3);
  });

  it("returns empty array when no slides", () => {
    const container = document.createElement("div");
    expect(getSlideElements(container)).toHaveLength(0);
  });
});

describe("getSlideElement", () => {
  it("finds slide by index", () => {
    const container = document.createElement("div");
    const slide = document.createElement("div");
    slide.setAttribute("data-slide", "2");
    container.appendChild(slide);
    expect(getSlideElement(container, 2)).toBe(slide);
  });

  it("returns null for missing slide", () => {
    const container = document.createElement("div");
    expect(getSlideElement(container, 99)).toBeNull();
  });
});

describe("scrollIntoView", () => {
  it("calls scrollIntoView on element", () => {
    const el = document.createElement("div");
    el.scrollIntoView = vi.fn();
    scrollIntoView(el);
    expect(el.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  });

  it("accepts custom options", () => {
    const el = document.createElement("div");
    el.scrollIntoView = vi.fn();
    scrollIntoView(el, { behavior: "instant", block: "start" });
    expect(el.scrollIntoView).toHaveBeenCalledWith({
      behavior: "instant",
      block: "start",
      inline: "center",
    });
  });
});
