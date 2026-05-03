/**
 * Tilt — 3D perspective tilt on hover.
 *
 * Tracks mouse position relative to the element center and maps it to
 * rotateX / rotateY. Resets smoothly on mouseleave.
 *
 *   <Tilt max={15} perspective={1000}>
 *     <div className="card">...</div>
 *   </Tilt>
 */

import React, { useRef, useCallback, type ReactNode } from "react";
import { cn } from "../../utils/classnames";
import { clamp } from "../../core/math";

export interface TiltProps {
  /** Max tilt angle in degrees (default 10) */
  max?: number;
  /** CSS perspective in px (default 1000) */
  perspective?: number;
  /** Scale on hover (default 1.02) */
  scale?: number;
  /** Transition speed in ms (default 300) */
  speed?: number;
  /** Tilt only on one axis */
  axis?: "x" | "y" | "both";
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Tilt({
  max = 10,
  perspective = 1000,
  scale = 1.02,
  speed = 300,
  axis = "both",
  children,
  className,
  style,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Normalise cursor to [-1, 1] relative to element center
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      const rotateY = axis !== "x" ? clamp(nx * max, -max, max) : 0;
      const rotateX = axis !== "y" ? clamp(-ny * max, -max, max) : 0;

      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`;
    },
    [max, perspective, scale, axis],
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    }
  }, [perspective]);

  return (
    <div
      ref={ref}
      className={cn("present-tilt", className)}
      style={{
        transformStyle: "preserve-3d",
        transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
        willChange: "transform",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
