import type { CSSProperties, ReactNode } from "react";

// ─── Slide ────────────────────────────────────────────────────────────────
export interface Slide {
  /** Unique slide identifier */
  id: string;
  /** Slide title (used in overview / progress) */
  title?: string;
  /** Slide content rendered inside the slide wrapper */
  content: ReactNode;
  /** Per-slide background override */
  background?: SlideBackground;
  /** Per-slide layout override */
  layout?: SlideLayout;
  /** Optional transition override */
  transition?: SlideTransition;
}

// ─── Layouts ──────────────────────────────────────────────────────────────
export type SlideLayout =
  | "default"
  | "center"
  | "two-column"
  | "two-column-left"
  | "two-column-right"
  | "full-bleed"
  | "title"
  | "code"
  | "blank"
  | "grid-2x2";

export interface LayoutComponentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// ─── Backgrounds ──────────────────────────────────────────────────────────
export type SlideBackground =
  | { type: "color"; value: string }
  | { type: "gradient"; value: string }
  | { type: "image"; value: string; overlay?: boolean; overlayColor?: string }
  | { type: "video"; value: string; overlay?: boolean; overlayColor?: string };

// ─── Transitions ──────────────────────────────────────────────────────────
export type TransitionType =
  | "none"
  | "fade"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "zoom"
  | "flip"
  | "cube";

export interface SlideTransition {
  type: TransitionType;
  duration?: number; // ms
}

// ─── Prezi-like Path / Canvas ─────────────────────────────────────────────
export interface PreziStep {
  /** Position & zoom on the infinite canvas */
  x: number;
  y: number;
  /** Zoom level 1 = 100%, 2 = 200% */
  zoom: number;
  /** Optional rotation in degrees */
  rotation?: number;
  /** Duration to animate to this step (ms) */
  duration?: number;
}

export interface PreziSlide extends Slide {
  /** Prezi canvas steps – if provided, uses canvas-mode instead of slide-mode */
  path: PreziStep;
}

// ─── Deck Configuration ───────────────────────────────────────────────────
export interface DeckConfig {
  /** Deck title */
  title?: string;
  /** Slides */
  slides: Slide[];
  /** Global transition */
  transition?: SlideTransition;
  /** Global background */
  background?: SlideBackground;
  /** Global layout */
  layout?: SlideLayout;
  /** Enable presenter mode */
  presenterMode?: boolean;
  /** Enable keyboard navigation */
  keyboard?: boolean;
  /** Custom CSS variables */
  theme?: DeckTheme;
}

export interface DeckTheme {
  /** Primary brand color */
  primary?: string;
  /** Background color */
  background?: string;
  /** Text color */
  foreground?: string;
  /** Font family */
  fontFamily?: string;
  /** Heading font family */
  headingFontFamily?: string;
  /** Code font family */
  codeFontFamily?: string;
  /** Slide width in px */
  slideWidth?: number;
  /** Slide height in px */
  slideHeight?: number;
}

// ─── Navigation ───────────────────────────────────────────────────────────
export interface DeckState {
  currentSlide: number;
  totalSlides: number;
  isFullscreen: boolean;
  isOverview: boolean;
  isPresenterMode: boolean;
}

export interface DeckActions {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  toggleFullscreen: () => void;
  toggleOverview: () => void;
  togglePresenterMode: () => void;
}

// ─── Progress ─────────────────────────────────────────────────────────────
export type ProgressVariant = "bar" | "circle" | "fraction" | "dots" | "none";

// ─── Code Highlight ───────────────────────────────────────────────────────
export interface CodeBlockProps {
  code: string;
  language?: string;
  theme?: "dark" | "light";
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

// ─── Appear (step-by-step reveal) ─────────────────────────────────────────
export interface AppearProps {
  children: ReactNode;
  /** Which step index triggers this to appear */
  step?: number;
  /** Animation type */
  animation?: "fade" | "slide-up" | "slide-left" | "scale" | "none";
  /** Duration in ms */
  duration?: number;
}
