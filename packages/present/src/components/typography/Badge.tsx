import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";

export interface BadgeProps {
  variant?: "default" | "accent" | "muted" | "success" | "warning" | "danger";
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ variant = "default", children, className, style }: BadgeProps) {
  return (
    <span
      className={cn("present-badge", `present-badge--${variant}`, className)}
      style={style}
    >
      {children}
    </span>
  );
}
