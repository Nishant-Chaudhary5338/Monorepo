import type { CSSProperties, ReactNode } from "react";

// ─── Deck Engine State ─────────────────────────────────────────────────
export interface DeckState {
  current: number;
  fragment: number;
  total: number;
  isFullscreen: boolean;
  isOverview: boolean;
  isPresenter: boolean;
  direction: "forward" | "backward";
  isTransitioning: boolean;
}

export interface DeckActions {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  nextFragment: () => void;
  prevFragment: () => void;
  toggleFullscreen: () => void;
  toggleOverview: () => void;
  togglePresenter: () => void;
}

// ─── Deck Events ───────────────────────────────────────────────────────
export type DeckEventType =
  | "slide:enter"
  | "slide:exit"
  | "fragment:step"
  | "deck:fullscreen"
  | "deck:overview"
  | "deck:presenter"
  | "deck:start"
  | "deck:end";

export interface DeckEvent {
  type: DeckEventType;
  slideIndex: number;
  fragmentIndex: number;
  direction: "forward" | "backward";
  timestamp: number;
}

export type DeckEventListener = (event: DeckEvent) => void;

// ─── Slide ─────────────────────────────────────────────────────────────
export interface Slide {
  id: string;
  title?: string;
  content?: ReactNode;
  layout?: SlideLayout;
  background?: SlideBackground;
  transition?: TransitionConfig;
  fragments?: FragmentConfig[];
}

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
  | "grid-2x2"
  | "grid-3x1";

export type SlideBackground =
  | { type: "color"; value: string }
  | { type: "gradient"; value: string }
  | { type: "image"; value: string; overlay?: boolean; overlayColor?: string }
  | { type: "video"; value: string; overlay?: boolean; overlayColor?: string };

// ─── Transitions ───────────────────────────────────────────────────────
export type TransitionType =
  | "none"
  | "fade"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "zoom"
  | "flip"
  | "cube"
  | "morph"
  | "parallax";

export interface TransitionConfig {
  type: TransitionType;
  duration?: number;
  easing?: string;
}

// ─── Fragments ─────────────────────────────────────────────────────────
export interface FragmentConfig {
  step: number;
  animation?: FragmentAnimation;
  duration?: number;
  easing?: string;
}

export type FragmentAnimation =
  | "fade"
  | "slide-up"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "rotate"
  | "flip"
  | "none";

// ─── Theme ─────────────────────────────────────────────────────────────
export interface DeckTheme {
  primary?: string;
  secondary?: string;
  background?: string;
  foreground?: string;
  accent?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  codeFontFamily?: string;
  slideWidth?: number;
  slideHeight?: number;
  [key: string]: string | number | undefined;
}

// ─── Parallax ──────────────────────────────────────────────────────────
export interface ParallaxLayerConfig {
  speed: number;
  children: ReactNode;
  zIndex?: number;
}

// ─── Canvas ────────────────────────────────────────────────────────────
export interface CanvasStep {
  x: number;
  y: number;
  zoom: number;
  rotation?: number;
  duration?: number;
}

// ─── Prezi Spatial Canvas ──────────────────────────────────────────────
export interface PreziFrame {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  rotation?: number;
}

export type PreziPath = string[];

export type SubtopicLayout = "planet" | "page-horizontal" | "page-vertical";

// ─── Progress ──────────────────────────────────────────────────────────
export type ProgressVariant = "bar" | "circle" | "fraction" | "dots" | "none";

// ─── Gesture ───────────────────────────────────────────────────────────
export interface GestureState {
  type: "swipe" | "pinch" | "drag" | "pointer" | null;
  dx: number;
  dy: number;
  velocity: { x: number; y: number };
  scale: number;
  rotation: number;
  event: PointerEvent | null;
}

// ─── Plugin ────────────────────────────────────────────────────────────
export interface DeckPlugin {
  name: string;
  onInit?: (deck: DeckActions & DeckState) => void;
  onDestroy?: () => void;
  onEvent?: (event: DeckEvent) => void;
}

// ─── Lifecycle ─────────────────────────────────────────────────────────
export interface DeckLifecycle {
  onSlideEnter?: (index: number, direction: "forward" | "backward") => void;
  onSlideExit?: (index: number, direction: "forward" | "backward") => void;
  onFragmentStep?: (slideIndex: number, fragmentIndex: number) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

// ─── Morph ─────────────────────────────────────────────────────────────
export interface MorphConfig {
  id: string;
  duration?: number;
  easing?: string;
}

// ─── Code ──────────────────────────────────────────────────────────────
export interface CodeBlockProps {
  code: string;
  language?: string;
  theme?: "dark" | "light";
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

// ─── Tilt ──────────────────────────────────────────────────────────────
export interface TiltConfig {
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}
