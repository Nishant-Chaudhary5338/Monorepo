import type { Theme } from "../types";

export const solarized: Theme = {
  name: "solarized",
  colors: {
    primary: "#268bd2",
    secondary: "#2aa198",
    accent: "#6c71c4",
    background: "#002b36",
    foreground: "#839496",
    muted: "#073642",
    mutedForeground: "#586e75",
    border: "#586e75",
    ring: "#268bd2",
    destructive: "#dc322f",
    success: "#859900",
    warning: "#b58900",
    info: "#268bd2",
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    headingFontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    codeFontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
    },
    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
    fontWeights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  spacing: {
    slideWidth: 960,
    slideHeight: 540,
    slidePadding: "3rem",
    borderRadius: "0.5rem",
  },
};