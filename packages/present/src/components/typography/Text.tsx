import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";

export interface TextProps {
  size?: "sm" | "md" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  muted?: boolean;
  as?: "p" | "span" | "div" | "li";
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_CLASS: Record<NonNullable<TextProps["size"]>, string> = {
  sm:  "present-text-small",
  md:  "",
  lg:  "present-text-large",
  xl:  "present-text-xlarge",
};

const WEIGHT_MAP: Record<NonNullable<TextProps["weight"]>, number> = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
};

export function Text({
  size = "md",
  weight = "normal",
  muted = false,
  as: Tag = "p",
  children,
  className,
  style,
}: TextProps) {
  return (
    <Tag
      className={cn(
        "present-text",
        SIZE_CLASS[size],
        muted && "present-text--muted",
        className,
      )}
      style={{ fontWeight: WEIGHT_MAP[weight], ...style }}
    >
      {children}
    </Tag>
  );
}
