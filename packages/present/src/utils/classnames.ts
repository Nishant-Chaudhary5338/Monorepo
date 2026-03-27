/**
 * Merge classNames safely, filtering falsy values.
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Convert a CSSProperties-like object to an inline style string.
 */
export function cssToString(style: Record<string, string>): string {
  return Object.entries(style)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}
