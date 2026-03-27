// Core module — Pure engine, no React
export { DeckEventBus, eventBus } from "./events";
export { deckReducer, createInitialState } from "./reducer";
export type { DeckAction } from "./reducer";
export {
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
} from "./math";
export { FrameScheduler, frameScheduler } from "./scheduler";
export type { Priority } from "./scheduler";
export {
  AnimationEngine,
  animationEngine,
  springPresets,
} from "./engine";
export type { SpringConfig } from "./engine";
