import type { Theme } from "../types";

export const monokai: Theme = {
  name: "monokai",
  colors: {
    primary: "#f92672",
    secondary: "#ae81ff",
    accent: "#66d9ef",
    background: "#272822",
    foreground: "#f8f8f2",
    muted: "#3e3d32",
    mutedForeground: "#75715e",
    border: "#49483e",
    ring: "#f92672",
    destructive: "#f92672",
    success: "#a6e22e",
    warning: "#e6db74",
    info: "#66d9ef",
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