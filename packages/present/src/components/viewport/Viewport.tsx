/**
 * Viewport — Responsive scale-to-fit container.
 *
 * Scales a fixed-dimension "slide canvas" (default 1920×1080) to fill any
 * container while maintaining aspect ratio. Uses ResizeObserver so it reacts
 * to container resizes without layout thrash.
 *
 * Usage:
 *   <Viewport width={1920} height={1080}>
 *     <Slide>...</Slide>
 *   </Viewport>
 */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { cn } from "../../utils/classnames";

export interface ViewportProps {
  /** Design-space width of the slide (default 1920) */
  width?: number;
  /** Design-space height of the slide (default 1080) */
  height?: number;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Whether to centre the inner canvas inside the container */
  center?: boolean;
}

export function Viewport({
  width = 1920,
  height = 1080,
  children,
  className,
  style,
  center = true,
}: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const computeScale = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const sw = el.offsetWidth / width;
    const sh = el.offsetHeight / height;
    setScale(Math.min(sw, sh));
  }, [width, height]);

  useEffect(() => {
    computeScale();

    const ro = new ResizeObserver(computeScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeScale]);

  return (
    <div
      ref={containerRef}
      className={cn("present-viewport", className)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: center ? "flex" : undefined,
        alignItems: center ? "center" : undefined,
        justifyContent: center ? "center" : undefined,
        ...style,
      }}
    >
      <div
        className="present-viewport-inner"
        style={{
          width,
          height,
          position: "relative",
          flexShrink: 0,
          transformOrigin: "center center",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
