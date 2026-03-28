// @repo/present — Full bundle barrel export
// Tree-shakeable: prefer importing from specific modules
// e.g., import { useMotionValue } from "@repo/present/animation"

export * from "./state";
export * from "./gestures";
export * from "./scroll";
export * from "./router";
export * from "./plugins";
export * from "./components";
export * from "./themes";
export * from "./utils";
export * from "./types";

// Re-export animation (includes SpringConfig, springPresets from spring.ts)
export * from "./animation";

// Re-export core explicitly to avoid SpringConfig/springPresets conflicts
export {
  DeckEventBus,
  eventBus,
  deckReducer,
  createInitialState,
  lerp,
  clamp,
  mapRange,
  roundTo,
  approximately,
  springSolver,
  VelocityTracker,
  VelocityTracker2D,
  degToRad,
  radToDeg,
  distance,
  midpoint,
  smoothStep,
  easeInOutCubic,
  FrameScheduler,
  frameScheduler,
  AnimationEngine,
  animationEngine,
} from "./core";
export type { DeckAction, Priority } from "./core";
