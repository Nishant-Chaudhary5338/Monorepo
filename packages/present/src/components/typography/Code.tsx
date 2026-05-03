import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";

export interface CodeProps {
  children: ReactNode;
  block?: boolean;
  language?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Code({ children, block = false, language, className, style }: CodeProps) {
  if (block) {
    return (
      <pre
        className={cn("present-code", className)}
        data-language={language}
        style={style}
      >
        <code>{children}</code>
      </pre>
    );
  }
  return (
    <code className={cn("present-code-inline", className)} style={style}>
      {children}
    </code>
  );
}
