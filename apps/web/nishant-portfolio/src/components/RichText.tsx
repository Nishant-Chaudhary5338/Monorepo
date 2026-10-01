import { Fragment, type ReactNode } from "react";

// Content strings mark the one number worth emphasising with **double
// asterisks**; everything else renders as plain text.
export function RichText({ text }: { text: string }): ReactNode {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
  );
}
