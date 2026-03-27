/**
 * ScrollLinked — Declarative scroll-linked animation wrapper
 *
 * Maps scroll progress to a CSS property value and applies it as an inline style.
 */

import React, { type ReactNode, useMemo } from "react";
import { useScroll } from "./use-scroll";

/** Props for ScrollLinked */
export interface ScrollLinkedProps {
  /** Children to render */
  children: ReactNode;
  /** CSS property to animate (e.g., "transform", "opacity") */
  property: string;
  /** Input range [start, end] — scroll progress (0-1) */
  inputRange?: [number, number];
  /** Output range [start, end] — property value */
  outputRange: [string, string];
  /** CSS unit for output (e.g., "px", "deg", "") */
  unit?: string;
  /** Target element for scroll tracking */
  target?: React.RefObject<HTMLElement | null>;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export function ScrollLinked({
  children,
  property,
  inputRange = [0, 1],
  outputRange,
  unit = "",
  target,
  className,
  style,
}: ScrollLinkedProps): React.JSX.Element {
  const { progress } = useScroll({ target });

  const computedStyle = useMemo((): React.CSSProperties => {
    const [inMin, inMax] = inputRange;
    const [outMinStr, outMaxStr] = outputRange;

    const outMin = parseFloat(outMinStr);
    const outMax = parseFloat(outMaxStr);
    const t = Math.max(0, Math.min(1, (progress - inMin) / (inMax - inMin)));
    const value = outMin + t * (outMax - outMin);

    return {
      ...style,
      [property]: `${value}${unit}`,
    };
  }, [progress, property, inputRange, outputRange, unit, style]);

  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
}

ScrollLinked.displayName = "ScrollLinked";