import React, { useCallback, useLayoutEffect, type ReactNode } from "react";
import { useFrameRegistryOptional } from "../canvas/FrameRegistry";
import { usePreziCanvasOptional } from "../canvas/PreziCanvas";
import { cn } from "../../utils/classnames";

export interface FrameProps {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  shape?: "rect" | "rounded" | "circle";
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Frame({
  id,
  x,
  y,
  width = 1920,
  height = 1080,
  label,
  shape = "rounded",
  children,
  className,
  style,
}: FrameProps) {
  const registry = useFrameRegistryOptional();
  const canvas   = usePreziCanvasOptional();

  useLayoutEffect(() => {
    registry?.register({ id, x, y, width, height, label });
    return () => registry?.unregister(id);
  }, [registry, id, x, y, width, height, label]);

  const isActive   = canvas?.activeFrameId === id;
  const isOverview = canvas?.isOverview ?? false;

  const handleClick = useCallback(() => {
    if (isOverview && canvas) canvas.goToFrame(id);
  }, [isOverview, canvas, id]);

  const borderRadius =
    shape === "circle"  ? "50%"  :
    shape === "rounded" ? "12px" : "4px";

  return (
    <div
      id={`frame-${id}`}
      className={cn(
        "present-frame",
        isActive    && "present-frame--active",
        isOverview  && "present-frame--overview",
        className,
      )}
      onClick={isOverview ? handleClick : undefined}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        boxSizing: "border-box",
        borderRadius,
        overflow: shape === "circle" ? "hidden" : "visible",
        cursor: isOverview ? "pointer" : undefined,
        ...style,
      }}
    >
      <div
        className="present-frame-clip"
        style={{ position: "absolute", inset: 0, borderRadius, overflow: "hidden" }}
      >
        <div
          className="present-frame-content"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          {children}
        </div>
      </div>

      <div
        className="present-frame-border"
        aria-hidden
        style={{ position: "absolute", inset: 0, borderRadius, pointerEvents: "none", zIndex: 2 }}
      />

      {label && (
        <span className="present-frame-label" aria-hidden>
          {label}
        </span>
      )}
    </div>
  );
}
