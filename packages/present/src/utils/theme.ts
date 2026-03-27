import type { DeckTheme } from "../types";

const DEFAULTS: Required<DeckTheme> = {
  primary: "#6366f1",
  background: "#0f172a",
  foreground: "#f8fafc",
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headingFontFamily:
    'Cal Sans, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  codeFontFamily:
    '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
  slideWidth: 1280,
  slideHeight: 720,
};

export function resolveTheme(theme?: DeckTheme): Required<DeckTheme> {
  return { ...DEFAULTS, ...theme };
}

export function themeToCssVars(theme: DeckTheme): Record<string, string> {
  const resolved = resolveTheme(theme);
  return {
    "--present-primary": resolved.primary,
    "--present-bg": resolved.background,
    "--present-fg": resolved.foreground,
    "--present-font": resolved.fontFamily,
    "--present-heading-font": resolved.headingFontFamily,
    "--present-code-font": resolved.codeFontFamily,
    "--present-slide-w": `${resolved.slideWidth}px`,
    "--present-slide-h": `${resolved.slideHeight}px`,
  };
}
