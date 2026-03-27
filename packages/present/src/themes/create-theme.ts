/**
 * createTheme — Theme builder utility
 *
 * Creates a complete theme by merging a base theme with overrides.
 */

import type { Theme, ThemeColors, ThemeTypography, ThemeSpacing } from "./types";

/** Deep merge utility for theme objects */
function deepMerge<T>(base: T, override: Partial<T>): T {
  const result = { ...base };

  for (const key in override) {
    if (override[key] === undefined) continue;

    if (
      typeof override[key] === "object" &&
      override[key] !== null &&
      !Array.isArray(override[key]) &&
      typeof base[key] === "object" &&
      base[key] !== null
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        base[key] as Record<string, unknown>,
        override[key] as Record<string, unknown>,
      );
    } else {
      (result as Record<string, unknown>)[key] = override[key];
    }
  }

  return result;
}

/** Override type for createTheme — all fields optional */
export interface ThemeOverride {
  name?: string;
  colors?: Partial<ThemeColors>;
  typography?: Partial<ThemeTypography> & {
    fontSizes?: Partial<ThemeTypography["fontSizes"]>;
    lineHeights?: Partial<ThemeTypography["lineHeights"]>;
    fontWeights?: Partial<ThemeTypography["fontWeights"]>;
  };
  spacing?: Partial<ThemeSpacing>;
}

/**
 * createTheme — Build a custom theme from a base theme and overrides
 *
 * @param base — Base theme to extend
 * @param override — Overrides to apply
 * @returns A new complete Theme object
 */
export function createTheme(base: Theme, override: ThemeOverride): Theme {
  return deepMerge(base, override as Partial<Theme>);
}

/**
 * toCssVars — Convert a theme to CSS custom properties
 *
 * @param theme — Theme to convert
 * @returns Object with CSS custom property names and values
 */
export function toCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  for (const [key, value] of Object.entries(theme.colors)) {
    vars[`--present-color-${kebabCase(key)}`] = value;
  }

  // Typography
  vars["--present-font-family"] = theme.typography.fontFamily;
  vars["--present-heading-font-family"] = theme.typography.headingFontFamily;
  vars["--present-code-font-family"] = theme.typography.codeFontFamily;

  for (const [key, value] of Object.entries(theme.typography.fontSizes)) {
    vars[`--present-font-size-${key}`] = value;
  }

  for (const [key, value] of Object.entries(theme.typography.lineHeights)) {
    vars[`--present-line-height-${key}`] = value;
  }

  for (const [key, value] of Object.entries(theme.typography.fontWeights)) {
    vars[`--present-font-weight-${key}`] = value;
  }

  // Spacing
  vars["--present-slide-width"] = `${theme.spacing.slideWidth}px`;
  vars["--present-slide-height"] = `${theme.spacing.slideHeight}px`;
  vars["--present-slide-padding"] = theme.spacing.slidePadding;
  vars["--present-border-radius"] = theme.spacing.borderRadius;

  return vars;
}

/** Convert camelCase to kebab-case */
function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}