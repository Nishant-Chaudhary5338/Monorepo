import { type CSSProperties, type ReactNode, useMemo } from "react";
import type { SlideBackground, SlideLayout } from "../types";
import { cn } from "../utils/classnames";
import { backgroundToStyle } from "../utils/background";

interface SlideProps {
  children: ReactNode;
  layout?: SlideLayout;
  background?: SlideBackground;
  className?: string;
  style?: CSSProperties;
}

export function Slide({
  children,
  layout = "default",
  background,
  className,
  style,
}: SlideProps) {
  const bgStyle = useMemo(() => backgroundToStyle(background), [background]);

  return (
    <div
      className={cn(
        "present-slide",
        layout !== "default" && `present-slide--${layout}`,
        className
      )}
      style={{ ...bgStyle, ...style }}
    >
      {children}
    </div>
  );
}
