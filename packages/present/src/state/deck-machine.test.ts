import { describe, it, expect } from "vitest";
import {
  createDeckMachineState,
  sendEvent,
  canTransition,
  availableEvents,
  type DeckMachineState,
} from "./deck-machine";

describe("createDeckMachineState", () => {
  it("creates initial idle state", () => {
    const state = createDeckMachineState(5);
    expect(state.status).toBe("idle");
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

describe("sendEvent", () => {
  const base = createDeckMachineState(5);

  describe("from idle state", () => {
    it("START transitions to presenting", () => {
      const result = sendEvent(base, { type: "START" });
      expect(result.status).toBe("presenting");
    });

    it("NEXT advances slide", () => {
      const result = sendEvent(base, { type: "NEXT" });
      expect(result.current).toBe(1);
      expect(result.direction).toBe("forward");
      expect(result.isTransitioning).toBe(true);
    });

    it("PREV does not go before 0", () => {
      const result = sendEvent(base, { type: "PREV" });
      expect(result).toBe(base);
    });

    it("GO_TO navigates to specific slide", () => {
      const result = sendEvent(base, { type: "GO_TO", index: 3 });
      expect(result.current).toBe(3);
      expect(result.direction).toBe("forward");
    });

    it("SET_FULLSCREEN sets fullscreen", () => {
      const result = sendEvent(base, { type: "SET_FULLSCREEN", value: true });
      expect(result.isFullscreen).toBe(true);
    });

    it("NEXT_FRAGMENT is ignored in idle", () => {
      const result = sendEvent(base, { type: "NEXT_FRAGMENT" });
      expect(result).toBe(base);
    });
  });

  describe("from presenting state", () => {
    const presenting = sendEvent(base, { type: "START" });

    it("STOP transitions to idle", () => {
      const result = sendEvent(presenting, { type: "STOP" });
      expect(result.status).toBe("idle");
    });

    it("NEXT advances slide", () => {
      const result = sendEvent(presenting, { type: "NEXT" });
      expect(result.current).toBe(1);
    });

    it("PREV does not go before 0", () => {
      const result = sendEvent(presenting, { type: "PREV" });
      expect(result.current).toBe(0);
    });

    it("NEXT_FRAGMENT increments fragment", () => {
      const result = sendEvent(presenting, { type: "NEXT_FRAGMENT" });
      expect(result.fragment).toBe(1);
    });

    it("PREV_FRAGMENT decrements fragment", () => {
      const withFrag = { ...presenting, fragment: 2 };
      const result = sendEvent(withFrag, { type: "PREV_FRAGMENT" });
      expect(result.fragment).toBe(1);
    });

    it("PREV_FRAGMENT does not go below 0", () => {
      const result = sendEvent(presenting, { type: "PREV_FRAGMENT" });
      expect(result.fragment).toBe(0);
    });

    it("TOGGLE_OVERVIEW transitions to overview", () => {
      const result = sendEvent(presenting, { type: "TOGGLE_OVERVIEW" });
      expect(result.status).toBe("overview");
      expect(result.isOverview).toBe(true);
    });

    it("TOGGLE_PRESENTER transitions to paused", () => {
      const result = sendEvent(presenting, { type: "TOGGLE_PRESENTER" });
      expect(result.status).toBe("paused");
      expect(result.isPresenter).toBe(true);
    });

    it("SET_TRANSITIONING sets flag", () => {
      const result = sendEvent(presenting, { type: "SET_TRANSITIONING", value: false });
      expect(result.isTransitioning).toBe(false);
    });

    it("SET_DIRECTION sets direction", () => {
      const result = sendEvent(presenting, { type: "SET_DIRECTION", value: "backward" });
      expect(result.direction).toBe("backward");
    });
  });

  describe("from overview state", () => {
    const presenting = sendEvent(base, { type: "START" });
    const overview = sendEvent(presenting, { type: "TOGGLE_OVERVIEW" });

    it("TOGGLE_OVERVIEW returns to presenting", () => {
      const result = sendEvent(overview, { type: "TOGGLE_OVERVIEW" });
      expect(result.status).toBe("presenting");
      expect(result.isOverview).toBe(false);
    });

    it("NEXT navigates forward", () => {
      const result = sendEvent(overview, { type: "NEXT" });
      expect(result.current).toBe(1);
    });

    it("GO_TO navigates and returns to presenting", () => {
      const result = sendEvent(overview, { type: "GO_TO", index: 2 });
      expect(result.status).toBe("presenting");
      expect(result.current).toBe(2);
      expect(result.isOverview).toBe(false);
    });

    it("STOP transitions to idle", () => {
      const result = sendEvent(overview, { type: "STOP" });
      expect(result.status).toBe("idle");
      expect(result.isOverview).toBe(false);
    });
  });

  describe("from paused state", () => {
    const presenting = sendEvent(base, { type: "START" });
    const paused = sendEvent(presenting, { type: "TOGGLE_PRESENTER" });

    it("TOGGLE_PRESENTER returns to presenting", () => {
      const result = sendEvent(paused, { type: "TOGGLE_PRESENTER" });
      expect(result.status).toBe("presenting");
      expect(result.isPresenter).toBe(false);
    });

    it("NEXT navigates forward", () => {
      const result = sendEvent(paused, { type: "NEXT" });
      expect(result.current).toBe(1);
    });

    it("GO_TO navigates and returns to presenting", () => {
      const result = sendEvent(paused, { type: "GO_TO", index: 3 });
      expect(result.status).toBe("presenting");
      expect(result.current).toBe(3);
      expect(result.isPresenter).toBe(false);
    });

    it("STOP transitions to idle", () => {
      const result = sendEvent(paused, { type: "STOP" });
      expect(result.status).toBe("idle");
      expect(result.isPresenter).toBe(false);
    });
  });

  describe("boundary conditions", () => {
    it("NEXT at last slide returns same state", () => {
      const last = { ...base, current: 4 };
      const result = sendEvent(last, { type: "NEXT" });
      expect(result).toBe(last);
    });

    it("GO_TO clamps to valid range", () => {
      const result = sendEvent(base, { type: "GO_TO", index: 100 });
      expect(result.current).toBe(4);
    });

    it("GO_TO clamps negative to 0", () => {
      const result = sendEvent(base, { type: "GO_TO", index: -5 });
      expect(result.current).toBe(0);
    });

    it("GO_TO same slide returns same state", () => {
      const result = sendEvent(base, { type: "GO_TO", index: 0 });
      expect(result).toBe(base);
    });
  });
});

describe("canTransition", () => {
  it("returns true for valid transitions", () => {
    const idle = createDeckMachineState(5);
    expect(canTransition(idle, "START")).toBe(true);
    expect(canTransition(idle, "NEXT")).toBe(true);
  });

  it("returns false for invalid transitions", () => {
    const idle = createDeckMachineState(5);
    expect(canTransition(idle, "STOP")).toBe(false);
    expect(canTransition(idle, "NEXT_FRAGMENT")).toBe(false);
  });
});

describe("availableEvents", () => {
  it("returns events for idle state", () => {
    const events = availableEvents("idle");
    expect(events).toContain("START");
    expect(events).toContain("NEXT");
    expect(events).toContain("PREV");
    expect(events).toContain("GO_TO");
    expect(events).toContain("SET_FULLSCREEN");
  });

  it("returns events for presenting state", () => {
    const events = availableEvents("presenting");
    expect(events).toContain("STOP");
    expect(events).toContain("NEXT");
    expect(events).toContain("TOGGLE_OVERVIEW");
    expect(events).toContain("TOGGLE_PRESENTER");
  });

  it("returns events for overview state", () => {
    const events = availableEvents("overview");
    expect(events).toContain("TOGGLE_OVERVIEW");
    expect(events).toContain("NEXT");
    expect(events).toContain("STOP");
  });

  it("returns events for paused state", () => {
    const events = availableEvents("paused");
    expect(events).toContain("TOGGLE_PRESENTER");
    expect(events).toContain("NEXT");
    expect(events).toContain("STOP");
  });
});
