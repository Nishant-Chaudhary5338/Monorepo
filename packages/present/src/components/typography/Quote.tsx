import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";

export interface QuoteProps {
  children: ReactNode;
  cite?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Quote({ children, cite, className, style }: QuoteProps) {
  return (
    <figure className={cn("present-quote-figure", className)} style={style}>
      <blockquote className="present-quote">{children}</blockquote>
      {cite && (
        <figcaption className="present-quote-cite">
          <span aria-hidden>— </span>
          {cite}
        </figcaption>
      )}
    </figure>
  );
}
