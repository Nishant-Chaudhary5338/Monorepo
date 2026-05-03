/**
 * Appear — Fragment/step reveal component.
 *
 * Within a <Slide>, wrap any element with <Appear step={N}> to reveal it
 * when the deck's fragment counter reaches N. Arrow Down advances fragments.
 *
 *   <Slide>
 *     <Heading>Always visible</Heading>
 *     <Appear step={1}><Text>First bullet</Text></Appear>
 *     <Appear step={2} animation="slide-up"><Text>Second bullet</Text></Appear>
 *   </Slide>
 */

import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";
import { useDeckContextOptional } from "../deck/Deck";
import type { FragmentAnimation } from "../../types";

export interface AppearProps {
  /** Fragment step at which this element becomes visible (1-indexed) */
  step: number;
  /** Animation to play on reveal */
  animation?: FragmentAnimation;
  /** Bypass auto-detection — force visible/hidden state */
  visible?: boolean;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ANIMATION_CLASS: Record<FragmentAnimation, string> = {
  fade:         "present-appear-fade",
  "slide-up":   "present-appear-slide-up",
  "slide-left": "present-appear-slide-left",
  "slide-right":"present-appear-slide-right",
  scale:        "present-appear-scale",
  rotate:       "present-appear-rotate",
  flip:         "present-appear-flip",
  none:         "",
};

export function Appear({
  step,
  animation = "fade",
  visible: visibleOverride,
  children,
  className,
  style,
}: AppearProps) {
  const ctx = useDeckContextOptional();
  const isVisible = visibleOverride ?? (ctx ? ctx.state.fragment >= step : false);
  const animClass = isVisible ? (ANIMATION_CLASS[animation] ?? "") : "";

  return (
    <div
      className={cn(
        "present-appear",
        isVisible ? `present-appear--visible ${animClass}` : "present-appear--hidden",
        className,
      )}
      style={{ display: "contents", ...style }}
      aria-hidden={!isVisible}
    >
      {children}
    </div>
  );
}
