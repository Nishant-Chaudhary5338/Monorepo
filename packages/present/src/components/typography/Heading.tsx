import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  gradient?: string;
}

export function Heading({ level = 1, children, className, style, gradient }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn("present-heading", `present-heading-${level}`, className)}
      style={{
        ...(gradient
          ? {
              background: gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
