import { describe, it, expect } from "vitest";
import { cn } from "./classnames";

describe("cn", () => {
  it("merges string classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "active")).toBe("base active");
    expect(cn("base", false && "hidden")).toBe("base");
  });

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base");
  });

  it("handles arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("handles objects", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
