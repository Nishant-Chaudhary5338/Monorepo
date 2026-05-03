/**
 * Transitions — Animated slide switcher.
 *
 * Renders the current slide with enter/exit CSS keyframe classes based on
 * direction. Maintains two render slots (outgoing + incoming) for the
 * duration of the transition, then cleans up the outgoing one.
 *
 * CSS keyframes live in styles/transitions.css.
 */

import React, {
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { cn } from "../../utils/classnames";
import type { TransitionType } from "../../types";

export interface TransitionsProps {
  /** The current slide content */
  children: ReactNode;
  /** Current slide key — changes trigger the transition */
  slideKey: string | number;
  /** Transition animation type */
  type?: TransitionType;
  /** Direction of navigation */
  direction?: "forward" | "backward";
  /** Duration in ms (overrides CSS variable) */
  duration?: number;
  className?: string;
}

interface SlotState {
  key: string | number;
  node: ReactNode;
  phase: "enter" | "exit" | "idle";
}

const TRANSITION_CLASSES: Record<
  TransitionType,
  { enter: string; exit: string }
> = {
  none:       { enter: "", exit: "" },
  fade:       { enter: "present-transition-fade-enter",       exit: "present-transition-fade-exit" },
  "slide-left":  { enter: "present-transition-slide-left-enter",  exit: "present-transition-slide-left-exit" },
  "slide-right": { enter: "present-transition-slide-right-enter", exit: "present-transition-slide-right-exit" },
  "slide-up":    { enter: "present-transition-slide-up-enter",    exit: "present-transition-slide-up-exit" },
  "slide-down":  { enter: "present-transition-slide-down-enter",  exit: "present-transition-slide-down-exit" },
  zoom:       { enter: "present-transition-zoom-enter",       exit: "present-transition-zoom-exit" },
  flip:       { enter: "present-transition-flip-enter",       exit: "present-transition-flip-exit" },
  cube:       { enter: "present-transition-cube-enter",       exit: "present-transition-cube-exit" },
  morph:      { enter: "present-transition-fade-enter",       exit: "present-transition-fade-exit" },
  parallax:   { enter: "present-transition-slide-left-enter", exit: "present-transition-slide-left-exit" },
};

export function Transitions({
  children,
  slideKey,
  type = "fade",
  direction = "forward",
  duration = 300,
  className,
}: TransitionsProps) {
  const classes = TRANSITION_CLASSES[type] ?? TRANSITION_CLASSES.fade;
  const prevKey = useRef<string | number | null>(null);
  const [outgoing, setOutgoing] = useState<SlotState | null>(null);

  useEffect(() => {
    if (prevKey.current !== null && prevKey.current !== slideKey) {
      // Capture the previous content and kick off exit animation
      setOutgoing({
        key: prevKey.current,
        node: children,
        phase: "exit",
      });

      const timer = setTimeout(() => setOutgoing(null), duration + 50);
      return () => clearTimeout(timer);
    }
    prevKey.current = slideKey;
  }, [slideKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update prevKey after each render
  useEffect(() => {
    prevKey.current = slideKey;
  });

  // Determine enter class based on direction
  const enterClass = type === "none"
    ? ""
    : direction === "backward" && type.startsWith("slide-left")
      ? classes.exit
      : classes.enter;

  return (
    <div
      className={cn("present-transitions", className)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        "--present-transition-duration": `${duration}ms`,
      } as React.CSSProperties}
    >
      {/* Outgoing (exit animation) */}
      {outgoing && (
        <div
          key={outgoing.key}
          className={cn("present-transitions-slot", classes.exit)}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          {outgoing.node}
        </div>
      )}

      {/* Incoming (enter animation) */}
      <div
        key={slideKey}
        className={cn("present-transitions-slot", enterClass)}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      >
        {children}
      </div>
    </div>
  );
}
