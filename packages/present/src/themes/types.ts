/**
 * Theme types — Token-based design system
 */

/** Color tokens */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ring: string;
  destructive: string;
  success: string;
  warning: string;
  info: string;
  [key: string]: string;
}

/** Typography tokens */
export interface ThemeTypography {
  fontFamily: string;
  headingFontFamily: string;
  codeFontFamily: string;
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
    "6xl": string;
  };
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  fontWeights: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

/** Spacing tokens */
export interface ThemeSpacing {
  slideWidth: number;
  slideHeight: number;
  slidePadding: string;
  borderRadius: string;
}

/** Complete theme definition */
export interface Theme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
}