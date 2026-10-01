import { cn } from "./cn";

export const container = "mx-auto w-full max-w-content px-gutter";

export const eyebrow = cn(
  "font-mono text-xs text-fg-3 uppercase tracking-label",
);

export const meta = "font-mono text-xs text-fg-3";

export const textLink = cn(
  "text-fg underline decoration-line-strong underline-offset-4",
  "transition-colors duration-150 hover:text-accent hover:decoration-accent",
);

export const monoLink = cn(
  "font-mono text-sm text-fg underline decoration-line-strong underline-offset-4",
  "transition-colors duration-150 hover:text-accent hover:decoration-accent",
);

const buttonBase = cn(
  "inline-flex h-10 items-center justify-center px-4",
  "text-sm font-medium rounded-md transition-colors duration-150",
  "disabled:cursor-wait disabled:opacity-70",
);

export const buttonPrimary = cn(buttonBase, "bg-accent text-canvas hover:bg-fg");

export const buttonSecondary = cn(
  buttonBase,
  "text-fg border border-line-strong hover:border-fg",
);

// Row hover tints the full width; negative margins let the tint bleed past
// the text without shifting the text off the grid.
export const rowLink = cn(
  "-mx-3 block px-3 py-5",
  "rounded-md transition-colors duration-150 hover:bg-surface",
);
