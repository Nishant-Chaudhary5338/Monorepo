/**
 * DeckProvider — React context provider for deck state
 *
 * Wraps the deck state machine and exposes state + actions via context.
 */

import React, {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { DeckActions, DeckState } from "../types";
import {
  createDeckMachineState,
  sendEvent,
  type DeckMachineEvent,
  type DeckMachineState,
} from "./deck-machine";

/** Combined state + actions exposed via context */
export interface DeckContextValue extends DeckState {
  /** Machine status */
  status: DeckMachineState["status"];
  /** Navigate to next slide */
  next: () => void;
  /** Navigate to previous slide */
  prev: () => void;
  /** Go to a specific slide */
  goTo: (index: number) => void;
  /** Advance to next fragment */
  nextFragment: () => void;
  /** Go back to previous fragment */
  prevFragment: () => void;
  /** Toggle fullscreen mode */
  toggleFullscreen: () => void;
  /** Toggle overview mode */
  toggleOverview: () => void;
  /** Toggle presenter mode */
  togglePresenter: () => void;
  /** Start the deck */
  start: () => void;
  /** Stop the deck */
  stop: () => void;
}

export const DeckContext = createContext<DeckContextValue | null>(null);

/** Internal reducer wrapping the state machine */
function deckStateReducer(state: DeckMachineState, event: DeckMachineEvent): DeckMachineState {
  return sendEvent(state, event);
}

/** Props for DeckProvider */
export interface DeckProviderProps {
  /** Total number of slides */
  totalSlides: number;
  /** Children components */
  children: ReactNode;
  /** Optional initial slide index */
  initialSlide?: number;
  /** Called when slide changes */
  onSlideChange?: (index: number) => void;
}

export function DeckProvider({
  totalSlides,
  children,
  initialSlide = 0,
  onSlideChange,
}: DeckProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(deckStateReducer, totalSlides, (total: number): DeckMachineState => {
    const initial = createDeckMachineState(total);
    if (initialSlide > 0) {
      return {
        ...initial,
        current: Math.min(initialSlide, total - 1),
        status: "presenting",
      };
    }
    return { ...initial, status: "presenting" };
  });

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);
  const goTo = useCallback(
    (index: number) => dispatch({ type: "GO_TO", index }),
    [],
  );
  const nextFragment = useCallback(() => dispatch({ type: "NEXT_FRAGMENT" }), []);
  const prevFragment = useCallback(() => dispatch({ type: "PREV_FRAGMENT" }), []);
  const toggleFullscreen = useCallback(
    () => dispatch({ type: "SET_FULLSCREEN", value: !state.isFullscreen }),
    [state.isFullscreen],
  );
  const toggleOverview = useCallback(() => dispatch({ type: "TOGGLE_OVERVIEW" }), []);
  const togglePresenter = useCallback(() => dispatch({ type: "TOGGLE_PRESENTER" }), []);
  const start = useCallback(() => dispatch({ type: "START" }), []);
  const stop = useCallback(() => dispatch({ type: "STOP" }), []);

  // Notify parent of slide changes
  React.useEffect(() => {
    onSlideChange?.(state.current);
  }, [state.current, onSlideChange]);

  const value = useMemo<DeckContextValue>(
    () => ({
      ...state,
      next,
      prev,
      goTo,
      nextFragment,
      prevFragment,
      toggleFullscreen,
      toggleOverview,
      togglePresenter,
      start,
      stop,
    }),
    [state, next, prev, goTo, nextFragment, prevFragment, toggleFullscreen, toggleOverview, togglePresenter, start, stop],
  );

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

DeckContext.displayName = "DeckContext";
DeckProvider.displayName = "DeckProvider";