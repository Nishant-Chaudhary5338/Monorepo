import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseHash, buildHash, onHashChange, setHash, getCurrentHash } from "./hash-router";

describe("parseHash", () => {
  it("parses empty hash", () => {
    expect(parseHash("")).toEqual({ slide: 0, fragment: 0 });
  });

  it("parses slide-only hash", () => {
    expect(parseHash("#slide-3")).toEqual({ slide: 3, fragment: 0 });
  });

  it("parses slide and fragment", () => {
    expect(parseHash("#slide-3/fragment-2")).toEqual({ slide: 3, fragment: 2 });
  });

  it("parses numeric hash", () => {
    expect(parseHash("#5")).toEqual({ slide: 5, fragment: 0 });
  });

  it("parses numeric slide/fragment", () => {
    expect(parseHash("#5/3")).toEqual({ slide: 5, fragment: 3 });
  });

  it("handles hash without leading #", () => {
    expect(parseHash("slide-2")).toEqual({ slide: 2, fragment: 0 });
  });

  it("clamps negative values to 0", () => {
    expect(parseHash("#slide-0")).toEqual({ slide: 0, fragment: 0 });
  });
});

describe("buildHash", () => {
  it("builds slide-only hash", () => {
    expect(buildHash(3)).toBe("#slide-3");
  });

  it("builds slide+fragment hash", () => {
    expect(buildHash(3, 2)).toBe("#slide-3/fragment-2");
  });

  it("omits fragment when 0", () => {
    expect(buildHash(5, 0)).toBe("#slide-5");
  });
});

describe("onHashChange", () => {
  let listeners: Array<() => void>;

  beforeEach(() => {
    listeners = [];
    vi.spyOn(window, "addEventListener").mockImplementation((event, handler) => {
      if (event === "hashchange") {
        listeners.push(handler as () => void);
      }
    });
    vi.spyOn(window, "removeEventListener").mockImplementation((event, handler) => {
      if (event === "hashchange") {
        const idx = listeners.indexOf(handler as () => void);
        if (idx >= 0) listeners.splice(idx, 1);
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers hashchange listener", () => {
    const callback = vi.fn();
    onHashChange(callback);
    expect(window.addEventListener).toHaveBeenCalledWith("hashchange", expect.any(Function));
  });

  it("returns unsubscribe function", () => {
    const callback = vi.fn();
    const unsub = onHashChange(callback);
    unsub();
    expect(window.removeEventListener).toHaveBeenCalledWith("hashchange", expect.any(Function));
  });
});

describe("setHash", () => {
  it("sets window.location.hash", () => {
    setHash(3);
    expect(window.location.hash).toBe("#slide-3");
  });

  it("sets hash with fragment", () => {
    setHash(3, 2);
    expect(window.location.hash).toBe("#slide-3/fragment-2");
  });
});

describe("getCurrentHash", () => {
  it("returns parsed current hash", () => {
    window.location.hash = "#slide-7/fragment-3";
    const result = getCurrentHash();
    expect(result.slide).toBe(7);
    expect(result.fragment).toBe(3);
  });
});
