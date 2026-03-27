import type { Theme } from "../types";

export const nord: Theme = {
  name: "nord",
  colors: {
    primary: "#88c0d0",
    secondary: "#81a1c1",
    accent: "#8fbcbb",
    background: "#2e3440",
    foreground: "#eceff4",
    muted: "#3b4252",
    mutedForeground: "#d8dee9",
    border: "#4c566a",
    ring: "#88c0d0",
    destructive: "#bf616a",
    success: "#a3be8c",
    warning: "#ebcb8b",
    info: "#81a1c1",
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