/**
 * DeckMachine — XState-lite finite state machine for deck states
 *
 * States: idle → presenting ⇄ overview / paused
 * Pure logic — no React dependency
 */

import type { DeckState } from "../types";

/** Deck states */
export type DeckStatus = "idle" | "presenting" | "overview" | "paused";


/** Events the machine accepts — state machine events (distinct from DeckEvent in types/) */
export type DeckMachineEvent =
  | { type: "START" }
  | { type: "STOP" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GO_TO"; index: number }
  | { type: "NEXT_FRAGMENT" }
  | { type: "PREV_FRAGMENT" }
  | { type: "TOGGLE_OVERVIEW" }
  | { type: "TOGGLE_PRESENTER" }
  | { type: "SET_FULLSCREEN"; value: boolean }
  | { type: "SET_TRANSITIONING"; value: boolean }
  | { type: "SET_DIRECTION"; value: "forward" | "backward" };

/** State transition map */
type TransitionFn = (state: DeckMachineState, event: DeckMachineEvent) => DeckMachineState;

/** Extended DeckState with status field */
export interface DeckMachineState extends DeckState {
  status: DeckStatus;
}

/** Helper: navigate forward */
function navigateForward(state: DeckMachineState): DeckMachineState {
  if (state.current >= state.total - 1) return state;
  return {
    ...state,
    current: state.current + 1,
    fragment: 0,
    direction: "forward",
    isTransitioning: true,
  };
}

/** Helper: navigate backward */
function navigateBackward(state: DeckMachineState): DeckMachineState {
  if (state.current <= 0) return state;
  return {
    ...state,
    current: state.current - 1,
    fragment: 0,
    direction: "backward",
    isTransitioning: true,
  };
}

/** Helper: go to specific slide */
function goToSlide(state: DeckMachineState, index: number): DeckMachineState {
  const clamped = Math.max(0, Math.min(index, state.total - 1));
  if (clamped === state.current) return state;
  return {
    ...state,
    current: clamped,
    fragment: 0,
    direction: clamped > state.current ? "forward" : "backward",
    isTransitioning: true,
  };
}

const transitions: Record<DeckStatus, Partial<Record<DeckMachineEvent["type"], TransitionFn>>> = {
  idle: {
    START: (state) => ({ ...state, status: "presenting" }),
    NEXT: (state) => navigateForward(state),
    PREV: (state) => navigateBackward(state),
    GO_TO: (state, event) => goToSlide(state, (event as { type: "GO_TO"; index: number }).index),
    SET_FULLSCREEN: (state, event) => ({
      ...state,
      isFullscreen: (event as { type: "SET_FULLSCREEN"; value: boolean }).value,
    }),
  },
  presenting: {
    STOP: (state) => ({ ...state, status: "idle" }),
    NEXT: (state) => navigateForward(state),
    PREV: (state) => navigateBackward(state),
    GO_TO: (state, event) => goToSlide(state, (event as { type: "GO_TO"; index: number }).index),
    NEXT_FRAGMENT: (state) => ({ ...state, fragment: state.fragment + 1 }),
    PREV_FRAGMENT: (state) => ({
      ...state,
      fragment: Math.max(0, state.fragment - 1),
    }),
    TOGGLE_OVERVIEW: (state) => ({
      ...state,
      status: "overview",
      isOverview: true,
    }),
    TOGGLE_PRESENTER: (state) => ({
      ...state,
      status: "paused",
      isPresenter: true,
    }),
    SET_FULLSCREEN: (state, event) => ({
      ...state,
      isFullscreen: (event as { type: "SET_FULLSCREEN"; value: boolean }).value,
    }),
    SET_TRANSITIONING: (state, event) => ({
      ...state,
      isTransitioning: (event as { type: "SET_TRANSITIONING"; value: boolean }).value,
    }),
    SET_DIRECTION: (state, event) => ({
      ...state,
      direction: (event as { type: "SET_DIRECTION"; value: "forward" | "backward" }).value,
    }),
  },
  overview: {
    TOGGLE_OVERVIEW: (state) => ({
      ...state,
      status: "presenting",
      isOverview: false,
    }),
    NEXT: (state) => navigateForward(state),
    PREV: (state) => navigateBackward(state),
    GO_TO: (state, event) => {
      const next = goToSlide(state, (event as { type: "GO_TO"; index: number }).index);
      return { ...next, status: "presenting", isOverview: false };
    },
    STOP: (state) => ({ ...state, status: "idle", isOverview: false }),
    SET_FULLSCREEN: (state, event) => ({
      ...state,
      isFullscreen: (event as { type: "SET_FULLSCREEN"; value: boolean }).value,
    }),
  },
  paused: {
    TOGGLE_PRESENTER: (state) => ({
      ...state,
      status: "presenting",
      isPresenter: false,
    }),
    NEXT: (state) => navigateForward(state),
    PREV: (state) => navigateBackward(state),
    GO_TO: (state, event) => {
      const next = goToSlide(state, (event as { type: "GO_TO"; index: number }).index);
      return { ...next, status: "presenting", isPresenter: false };
    },
    STOP: (state) => ({ ...state, status: "idle", isPresenter: false }),
    SET_FULLSCREEN: (state, event) => ({
      ...state,
      isFullscreen: (event as { type: "SET_FULLSCREEN"; value: boolean }).value,
    }),
  },
};

/** Create initial machine state */
export function createDeckMachineState(totalSlides: number): DeckMachineState {
  return {
    status: "idle",
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

/** Send an event to the state machine — pure function, no side effects */
export function sendEvent(
  state: DeckMachineState,
  event: DeckMachineEvent,
): DeckMachineState {
  const stateTransitions = transitions[state.status];
  if (!stateTransitions) return state;

  const handler = stateTransitions[event.type];
  if (!handler) return state;

  return handler(state, event);
}

/** Check if a transition is valid */
export function canTransition(
  state: DeckMachineState,
  eventType: DeckMachineEvent["type"],
): boolean {
  const stateTransitions = transitions[state.status];
  return eventType in (stateTransitions ?? {});
}

/** Get available events for current state */
export function availableEvents(status: DeckStatus): DeckMachineEvent["type"][] {
  const stateTransitions = transitions[status];
  return Object.keys(stateTransitions ?? {}) as DeckMachineEvent["type"][];
}