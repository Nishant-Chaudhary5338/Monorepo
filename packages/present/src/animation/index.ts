// Animation module — Spring physics, motion values, AnimatePresence, timeline, stagger
export {
  springPresets,
  createSpring,
  stepSpring,
  setSpringTarget,
  setSpringConfig,
  getSpringValue,
  isSpringSettled,
} from "./spring";
export type { SpringConfig, SpringState } from "./spring";
export {
  MotionValue,
  useMotionValue,
  useTransform,
  useTransformRange,
  useSpring,
  useVelocity,
} from "./motion";
export { Timeline, createTimeline } from "./timeline";
export {
  AnimatePresence,
  usePresence,
  useAnimateExit,
} from "./presence";
export type { PresenceAnimationConfig, AnimatePresenceProps } from "./presence";
export {
  StaggerController,
  staggerAnimate,
  calculateStaggerDelay,
  createStagger,
} from "./stagger";
export type { StaggerConfig, StaggerChildResult } from "./stagger";
