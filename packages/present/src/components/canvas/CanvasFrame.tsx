import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";

export interface CanvasFrameProps {
  /** Canvas-space X coordinate of the frame's center */
  x: number;
  /** Canvas-space Y coordinate of the frame's center */
  y: number;
  /** Frame width in canvas pixels */
  width?: number;
  /** Frame height in canvas pixels */
  height?: number;
  /** Unique id for this frame (used for overview thumbnails) */
  id?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CanvasFrame = React.memo(function CanvasFrame({
  x,
  y,
  width = 960,
  height = 540,
  id,
  children,
  className,
  style,
}: CanvasFrameProps) {
  return (
    <div
      id={id}
      className={cn("present-canvas-frame", className)}
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
});
