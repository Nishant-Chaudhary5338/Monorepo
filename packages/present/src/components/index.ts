// UI Components — all presentational building blocks

// Core deck
export { Deck, useDeckContext, useDeckContextOptional } from "./deck/Deck";
export type { DeckProps } from "./deck/Deck";

// Slide
export { Slide as SlideComponent } from "./slide/Slide";
export type { SlideProps } from "./slide/Slide";

// Navigation chrome
export { Progress } from "./progress/Progress";
export type { ProgressProps } from "./progress/Progress";
export { Controls } from "./controls/Controls";
export type { ControlsProps } from "./controls/Controls";

// ── Prezi canvas (new spatial system) ───────────────────────────────────
export { PreziCanvas, PreziCanvasContext, usePreziCanvas, usePreziCanvasOptional } from "./canvas/PreziCanvas";
export type { PreziCanvasProps, PreziCanvasContextValue } from "./canvas/PreziCanvas";
export { FrameRegistryContext, useFrameRegistry, useFrameRegistryOptional, useCreateFrameRegistry } from "./canvas/FrameRegistry";
export type { FrameRegistration, FrameRegistryContextValue } from "./canvas/FrameRegistry";

// Spatial frames
export { Frame } from "./frame/Frame";
export type { FrameProps } from "./frame/Frame";
export { Topic, TopicCover } from "./frame/Topic";
export type { TopicProps, TopicCoverProps, TopicLayout } from "./frame/Topic";
export { Subtopic } from "./frame/Subtopic";
export type { SubtopicProps } from "./frame/Subtopic";

// Legacy canvas (kept for backward compat)
export { CanvasFrame } from "./canvas/CanvasFrame";
export type { CanvasFrameProps } from "./canvas/CanvasFrame";
export { useCanvasNavigation } from "./canvas/useCanvasNavigation";
export type { UseCanvasNavigationOptions, CanvasSpringConfig } from "./canvas/useCanvasNavigation";

// Viewport
export { Viewport } from "./viewport/Viewport";
export type { ViewportProps } from "./viewport/Viewport";

// Transitions
export { Transitions } from "./transition/Transitions";
export type { TransitionsProps } from "./transition/Transitions";

// Fragments
export { Appear } from "./fragment/Appear";
export type { AppearProps } from "./fragment/Appear";

// Typography
export { Heading } from "./typography/Heading";
export type { HeadingProps } from "./typography/Heading";
export { Text } from "./typography/Text";
export type { TextProps } from "./typography/Text";
export { Code } from "./typography/Code";
export type { CodeProps } from "./typography/Code";
export { Quote } from "./typography/Quote";
export type { QuoteProps } from "./typography/Quote";
export { Badge } from "./typography/Badge";
export type { BadgeProps } from "./typography/Badge";

// Effects
export { Tilt } from "./tilt/Tilt";
export type { TiltProps } from "./tilt/Tilt";
export { ParallaxLayer } from "./parallax/ParallaxLayer";
export type { ParallaxLayerProps } from "./parallax/ParallaxLayer";
export { Morph } from "./morph/Morph";
export type { MorphProps } from "./morph/Morph";

// Overview
export { Overview } from "./overview/Overview";
export type { OverviewProps } from "./overview/Overview";
