import type { Theme } from "../types";

export const midnight: Theme = {
  name: "midnight",
  colors: {
    primary: "#7c3aed",
    secondary: "#a78bfa",
    accent: "#06b6d4",
    background: "#0f0f1a",
    foreground: "#e2e8f0",
    muted: "#1e1e2e",
    mutedForeground: "#94a3b8",
    border: "#2d2d3f",
    ring: "#7c3aed",
    destructive: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#3b82f6",
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