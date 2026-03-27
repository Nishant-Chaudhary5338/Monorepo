import type { DeckState } from "../types";

export type DeckAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GO_TO"; index: number }
  | { type: "NEXT_FRAGMENT" }
  | { type: "PREV_FRAGMENT" }
  | { type: "SET_FULLSCREEN"; value: boolean }
  | { type: "TOGGLE_OVERVIEW" }
  | { type: "TOGGLE_PRESENTER" }
  | { type: "SET_TRANSITIONING"; value: boolean }
  | { type: "SET_DIRECTION"; value: "forward" | "backward" };

export function deckReducer(state: DeckState, action: DeckAction): DeckState {
  switch (action.type) {
    case "NEXT":
      if (state.current >= state.total - 1) return state;
      return { ...state, current: state.current + 1, fragment: 0, direction: "forward", isTransitioning: true };
    case "PREV":
      if (state.current <= 0) return state;
      return { ...state, current: state.current - 1, fragment: 0, direction: "backward", isTransitioning: true };
    case "GO_TO": {
      const idx = Math.max(0, Math.min(action.index, state.total - 1));
      if (idx === state.current) return state;
      return { ...state, current: idx, fragment: 0, direction: idx > state.current ? "forward" : "backward", isTransitioning: true };
    }
    case "NEXT_FRAGMENT":
      return { ...state, fragment: state.fragment + 1 };
    case "PREV_FRAGMENT":
      return { ...state, fragment: Math.max(0, state.fragment - 1) };
    case "SET_FULLSCREEN":
      return { ...state, isFullscreen: action.value };
    case "TOGGLE_OVERVIEW":
      return { ...state, isOverview: !state.isOverview };
    case "TOGGLE_PRESENTER":
      return { ...state, isPresenter: !state.isPresenter };
    case "SET_TRANSITIONING":
      return { ...state, isTransitioning: action.value };
    case "SET_DIRECTION":
      return { ...state, direction: action.value };
    default:
      return state;
  }
}

export function createInitialState(totalSlides: number): DeckState {
  return {
    current: 0,
    fragment: 0,
    total: totalSlides,
    isFullscreen: false,
    isOverview: false,
    isPresenter: false,
    direction: "forward",
    isTransitioning: false,
  };
}
