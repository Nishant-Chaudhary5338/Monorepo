import { describe, it, expect } from "vitest";
import { deckReducer, createInitialState } from "./reducer";
import type { DeckState } from "../types";

describe("createInitialState", () => {
  it("creates initial state with correct total", () => {
    const state = createInitialState(5);
    expect(state.current).toBe(0);
    expect(state.fragment).toBe(0);
    expect(state.total).toBe(5);
    expect(state.isFullscreen).toBe(false);
    expect(state.isOverview).toBe(false);
    expect(state.isPresenter).toBe(false);
    expect(state.direction).toBe("forward");
    expect(state.isTransitioning).toBe(false);
  });
});

describe("deckReducer", () => {
  const base: DeckState = createInitialState(5);

  describe("NEXT", () => {
    it("advances to next slide", () => {
      const result = deckReducer(base, { type: "NEXT" });
      expect(result.current).toBe(1);
      expect(result.fragment).toBe(0);
      expect(result.direction).toBe("forward");
      expect(result.isTransitioning).toBe(true);
    });

    it("does not advance past last slide", () => {
      const last: DeckState = { ...base, current: 4 };
      const result = deckReducer(last, { type: "NEXT" });
      expect(result.current).toBe(4);
    });
  });

  describe("PREV", () => {
    it("goes to previous slide", () => {
      const state: DeckState = { ...base, current: 2 };
      const result = deckReducer(state, { type: "PREV" });
      expect(result.current).toBe(1);
      expect(result.fragment).toBe(0);
      expect(result.direction).toBe("backward");
      expect(result.isTransitioning).toBe(true);
    });

    it("does not go before first slide", () => {
      const result = deckReducer(base, { type: "PREV" });
      expect(result.current).toBe(0);
    });
  });

  describe("GO_TO", () => {
    it("navigates to specific slide", () => {
      const result = deckReducer(base, { type: "GO_TO", index: 3 });
      expect(result.current).toBe(3);
      expect(result.direction).toBe("forward");
    });

    it("clamps to valid range", () => {
      const result = deckReducer(base, { type: "GO_TO", index: 10 });
      expect(result.current).toBe(4);
    });

    it("clamps negative index to 0", () => {
      const result = deckReducer(base, { type: "GO_TO", index: -5 });
      expect(result.current).toBe(0);
    });

    it("returns same state when navigating to current", () => {
      const result = deckReducer(base, { type: "GO_TO", index: 0 });
      expect(result).toBe(base);
    });

    it("sets backward direction", () => {
      const state: DeckState = { ...base, current: 3 };
      const result = deckReducer(state, { type: "GO_TO", index: 1 });
      expect(result.direction).toBe("backward");
    });
  });

  describe("NEXT_FRAGMENT", () => {
    it("increments fragment", () => {
      const result = deckReducer(base, { type: "NEXT_FRAGMENT" });
      expect(result.fragment).toBe(1);
    });
  });

  describe("PREV_FRAGMENT", () => {
    it("decrements fragment", () => {
      const state: DeckState = { ...base, fragment: 3 };
      const result = deckReducer(state, { type: "PREV_FRAGMENT" });
      expect(result.fragment).toBe(2);
    });

    it("does not go below 0", () => {
      const result = deckReducer(base, { type: "PREV_FRAGMENT" });
      expect(result.fragment).toBe(0);
    });
  });

  describe("SET_FULLSCREEN", () => {
    it("sets fullscreen", () => {
      const result = deckReducer(base, { type: "SET_FULLSCREEN", value: true });
      expect(result.isFullscreen).toBe(true);
    });

    it("unsets fullscreen", () => {
      const state: DeckState = { ...base, isFullscreen: true };
      const result = deckReducer(state, { type: "SET_FULLSCREEN", value: false });
      expect(result.isFullscreen).toBe(false);
    });
  });

  describe("TOGGLE_OVERVIEW", () => {
    it("toggles overview", () => {
      const result = deckReducer(base, { type: "TOGGLE_OVERVIEW" });
      expect(result.isOverview).toBe(true);
      const result2 = deckReducer(result, { type: "TOGGLE_OVERVIEW" });
      expect(result2.isOverview).toBe(false);
    });
  });

  describe("TOGGLE_PRESENTER", () => {
    it("toggles presenter", () => {
      const result = deckReducer(base, { type: "TOGGLE_PRESENTER" });
      expect(result.isPresenter).toBe(true);
      const result2 = deckReducer(result, { type: "TOGGLE_PRESENTER" });
      expect(result2.isPresenter).toBe(false);
    });
  });

  describe("SET_TRANSITIONING", () => {
    it("sets transitioning flag", () => {
      const result = deckReducer(base, { type: "SET_TRANSITIONING", value: true });
      expect(result.isTransitioning).toBe(true);
    });
  });

  describe("SET_DIRECTION", () => {
    it("sets direction", () => {
      const result = deckReducer(base, { type: "SET_DIRECTION", value: "backward" });
      expect(result.direction).toBe("backward");
    });
  });
});
