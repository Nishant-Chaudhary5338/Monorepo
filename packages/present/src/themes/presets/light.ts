import type { Theme } from "../types";

export const light: Theme = {
  name: "light",
  colors: {
    primary: "#2563eb",
    secondary: "#64748b",
    accent: "#0891b2",
    background: "#ffffff",
    foreground: "#1e293b",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    border: "#e2e8f0",
    ring: "#2563eb",
    destructive: "#dc2626",
    success: "#16a34a",
    warning: "#d97706",
    info: "#2563eb",
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