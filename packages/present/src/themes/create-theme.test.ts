import { describe, it, expect } from "vitest";
import { createTheme, toCssVars } from "./create-theme";
import type { Theme } from "./types";

const baseTheme: Theme = {
  name: "base",
  colors: {
    primary: "#000",
    secondary: "#333",
    accent: "#f00",
    background: "#fff",
    foreground: "#000",
    muted: "#eee",
    mutedForeground: "#666",
    border: "#ccc",
    ring: "#00f",
    destructive: "#f00",
    success: "#0f0",
    warning: "#ff0",
    info: "#0ff",
  },
  typography: {
    fontFamily: "sans-serif",
    headingFontFamily: "sans-serif",
    codeFontFamily: "monospace",
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
    lineHeights: { tight: "1.25", normal: "1.5", relaxed: "1.75" },
    fontWeights: { normal: "400", medium: "500", semibold: "600", bold: "700" },
  },
  spacing: {
    slideWidth: 960,
    slideHeight: 540,
    slidePadding: "2rem",
    borderRadius: "0.5rem",
  },
};

describe("createTheme", () => {
  it("returns base theme when no overrides", () => {
    const theme = createTheme(baseTheme, {});
    expect(theme.name).toBe("base");
    expect(theme.colors.primary).toBe("#000");
  });

  it("overrides top-level name", () => {
    const theme = createTheme(baseTheme, { name: "custom" });
    expect(theme.name).toBe("custom");
  });

  it("overrides specific colors", () => {
    const theme = createTheme(baseTheme, {
      colors: { primary: "#123456" },
    });
    expect(theme.colors.primary).toBe("#123456");
    expect(theme.colors.secondary).toBe("#333");
  });

  it("deep merges typography", () => {
    const theme = createTheme(baseTheme, {
      typography: {
        fontFamily: "serif",
        fontSizes: { base: "1.25rem" },
      },
    });
    expect(theme.typography.fontFamily).toBe("serif");
    expect(theme.typography.fontSizes.base).toBe("1.25rem");
    expect(theme.typography.fontSizes.xl).toBe("1.25rem");
  });

  it("overrides spacing", () => {
    const theme = createTheme(baseTheme, {
      spacing: { slideWidth: 1280 },
    });
    expect(theme.spacing.slideWidth).toBe(1280);
    expect(theme.spacing.slideHeight).toBe(540);
  });

  it("does not mutate base theme", () => {
    const original = JSON.stringify(baseTheme);
    createTheme(baseTheme, { name: "mutated", colors: { primary: "#abc" } });
    expect(JSON.stringify(baseTheme)).toBe(original);
  });
});

describe("toCssVars", () => {
  it("converts colors to CSS variables", () => {
    const vars = toCssVars(baseTheme);
    expect(vars["--present-color-primary"]).toBe("#000");
    expect(vars["--present-color-secondary"]).toBe("#333");
  });

  it("converts typography to CSS variables", () => {
    const vars = toCssVars(baseTheme);
    expect(vars["--present-font-family"]).toBe("sans-serif");
    expect(vars["--present-heading-font-family"]).toBe("sans-serif");
    expect(vars["--present-code-font-family"]).toBe("monospace");
    expect(vars["--present-font-size-base"]).toBe("1rem");
    expect(vars["--present-line-height-tight"]).toBe("1.25");
    expect(vars["--present-font-weight-bold"]).toBe("700");
  });

  it("converts spacing to CSS variables", () => {
    const vars = toCssVars(baseTheme);
    expect(vars["--present-slide-width"]).toBe("960px");
    expect(vars["--present-slide-height"]).toBe("540px");
    expect(vars["--present-slide-padding"]).toBe("2rem");
    expect(vars["--present-border-radius"]).toBe("0.5rem");
  });

  it("converts camelCase keys to kebab-case", () => {
    const vars = toCssVars(baseTheme);
    expect(vars["--present-color-muted-foreground"]).toBe("#666");
  });
});
