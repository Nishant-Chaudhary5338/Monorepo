/**
 * Deck — Root presentation component
 *
 * Manages deck state, keyboard navigation, and plugin lifecycle.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { sendEvent, createDeckMachineState, type DeckMachineState, type DeckMachineEvent } from "../../state/deck-machine";
import { useKeyboard } from "../../utils/keyboard";
import type { DeckState, DeckActions, DeckEvent, Slide } from "../../types";

/** Deck context value */
interface DeckContextValue {
  state: DeckMachineState;
  actions: DeckActions;
  slides: Slide[];
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

const DeckContext = createContext<DeckContextValue | null>(null);

/** Hook to access deck context */
export function useDeckContext(): DeckContextValue {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDeckContext must be used within a Deck component");
  }
  return context;
}

/** Deck props */
export interface DeckProps {
  /** Slide components */
  children: ReactNode;
  /** Initial slide index */
  initialSlide?: number;
  /** Enable keyboard navigation */
  keyboard?: boolean;
  /** Enable swipe gestures */
  swipe?: boolean;
  /** Theme name or custom theme */
  theme?: string;
  /** On state change callback */
  onStateChange?: (state: DeckState) => void;
  /** On event callback */
  onEvent?: (event: DeckEvent) => void;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/** Deck component */
export const Deck = React.memo(function Deck({
  children,
  initialSlide = 0,
  keyboard = true,
  swipe = true,
  theme,
  onStateChange,
  onEvent,
  className,
  style,
}: DeckProps): ReactNode {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slides = useMemo(() => React.Children.toArray(children), [children]);

  // Initialize state machine
  const [state, setState] = useState<DeckMachineState>(() =>
    createDeckMachineState(slides.length),
  );

  // Set initial slide
  useEffect(() => {
    if (initialSlide > 0 && initialSlide < slides.length) {
      setState((prev) => sendEvent(prev, { type: "GO_TO", index: initialSlide }));
    }
  }, [initialSlide, slides.length]);

  // Notify state changes
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Emit external event
  const emitEvent = useCallback((event: DeckEvent) => {
    onEvent?.(event);
  }, [onEvent]);

  // Stable callbacks for actions
  const next = useCallback(() => {
    setState((prev) => {
      const newState = sendEvent(prev, { type: "NEXT" });
      emitEvent({
        type: "slide:enter",
        slideIndex: newState.current,
        fragmentIndex: newState.fragment,
        direction: "forward",
        timestamp: Date.now(),
      });
      return newState;
    });
  }, [emitEvent]);

  const prev = useCallback(() => {
    setState((prev) => {
      const newState = sendEvent(prev, { type: "PREV" });
      emitEvent({
        type: "slide:enter",
        slideIndex: newState.current,
        fragmentIndex: newState.fragment,
        direction: "backward",
        timestamp: Date.now(),
      });
      return newState;
    });
  }, [emitEvent]);

  const goTo = useCallback((index: number) => {
    setState((prev) => {
      const newState = sendEvent(prev, { type: "GO_TO", index });
      emitEvent({
        type: "slide:enter",
        slideIndex: newState.current,
        fragmentIndex: newState.fragment,
        direction: index > prev.current ? "forward" : "backward",
        timestamp: Date.now(),
      });
      return newState;
    });
  }, [emitEvent]);

  const nextFragment = useCallback(() => {
    setState((prev) => {
      const newState = sendEvent(prev, { type: "NEXT_FRAGMENT" });
      emitEvent({
        type: "fragment:step",
        slideIndex: newState.current,
        fragmentIndex: newState.fragment,
        direction: "forward",
        timestamp: Date.now(),
      });
      return newState;
    });
  }, [emitEvent]);

  const prevFragment = useCallback(() => {
    setState((prev) => {
      const newState = sendEvent(prev, { type: "PREV_FRAGMENT" });
      emitEvent({
        type: "fragment:step",
        slideIndex: newState.current,
        fragmentIndex: newState.fragment,
        direction: "backward",
        timestamp: Date.now(),
      });
      return newState;
    });
  }, [emitEvent]);

  const toggleFullscreen = useCallback(() => {
    setState((prev) => sendEvent(prev, { type: "SET_FULLSCREEN", value: !prev.isFullscreen }));
    emitEvent({
      type: "deck:fullscreen",
      slideIndex: state.current,
      fragmentIndex: state.fragment,
      direction: "forward",
      timestamp: Date.now(),
    });
  }, [emitEvent, state]);

  const toggleOverview = useCallback(() => {
    setState((prev) => sendEvent(prev, { type: "TOGGLE_OVERVIEW" }));
    emitEvent({
      type: "deck:overview",
      slideIndex: state.current,
      fragmentIndex: state.fragment,
      direction: "forward",
      timestamp: Date.now(),
    });
  }, [emitEvent, state]);

  const togglePresenter = useCallback(() => {
    setState((prev) => sendEvent(prev, { type: "TOGGLE_PRESENTER" }));
    emitEvent({
      type: "deck:presenter",
      slideIndex: state.current,
      fragmentIndex: state.fragment,
      direction: "forward",
      timestamp: Date.now(),
    });
  }, [emitEvent, state]);

  // Actions object with stable references
  const actions = useMemo<DeckActions>(
    () => ({
      next,
      prev,
      goTo,
      nextFragment,
      prevFragment,
      toggleFullscreen,
      toggleOverview,
      togglePresenter,
    }),
    [next, prev, goTo, nextFragment, prevFragment, toggleFullscreen, toggleOverview, togglePresenter],
  );

  // Keyboard navigation
  useKeyboard([
    { key: "ArrowRight", action: next },
    { key: "ArrowLeft", action: prev },
    { key: "ArrowUp", action: prevFragment },
    { key: "ArrowDown", action: nextFragment },
    { key: "f", action: toggleFullscreen },
    { key: "o", action: toggleOverview },
    { key: "p", action: togglePresenter },
    { key: " ", action: next },
    { key: "Enter", action: next },
  ]);

  // Context value
  const contextValue = useMemo<DeckContextValue>(
    () => ({ state, actions, slides, viewportRef }),
    [state, actions, slides],
  );

  // Memoized style
  const deckStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      ...style,
    }),
    [style],
  );

  const deckClassName = useMemo(
    () => `present-deck ${theme ? `present-theme-${theme}` : ""} ${className ?? ""}`,
    [theme, className],
  );

  return (
    <DeckContext.Provider value={contextValue}>
      <div
        ref={viewportRef}
        className={deckClassName}
        style={deckStyle}
      >
        {children}
      </div>
    </DeckContext.Provider>
  );
});