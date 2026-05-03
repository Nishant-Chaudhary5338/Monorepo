/**
 * ParallaxLayer — Scroll-linked depth layer.
 *
 * Wraps useParallax from the scroll module and translates on the Y axis
 * at the given speed relative to the scroll container.
 *
 *   <div style={{ position: 'relative', height: '200vh' }}>
 *     <ParallaxLayer speed={0.3} zIndex={0}>
 *       <img src="bg.jpg" />
 *     </ParallaxLayer>
 *     <ParallaxLayer speed={0.7} zIndex={1}>
 *       <h1>Foreground text</h1>
 *     </ParallaxLayer>
 *   </div>
 */

import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";
import { useParallax } from "../../scroll/use-parallax";

export interface ParallaxLayerProps {
  /** Scroll speed multiplier: 0 = fixed, 1 = normal scroll, 0.5 = half speed */
  speed?: number;
  zIndex?: number;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxLayer({
  speed = 0.5,
  zIndex,
  children,
  className,
  style,
}: ParallaxLayerProps) {
  const translateY = useParallax(speed);

  return (
    <div
      className={cn("present-parallax-layer", className)}
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        transform: `translateY(${translateY}px)`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
