/**
 * Spring physics solver — real stiffness/damping/mass, not CSS timing functions
 *
 * Uses semi-implicit Euler integration for stable convergence.
 */

import { springSolver } from "../core/math";

/** Spring configuration */
export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

/** Spring presets inspired by Framer Motion */
export const springPresets = {
  default: { stiffness: 170, damping: 26, mass: 1 },
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  stiff: { stiffness: 300, damping: 30, mass: 1 },
  slow: { stiffness: 80, damping: 20, mass: 1 },
  molasses: { stiffness: 280, damping: 120, mass: 1 },
} as const satisfies Record<string, SpringConfig>;

/** Spring animation state */
export interface SpringState {
  position: number;
  velocity: number;
  target: number;
  config: SpringConfig;
  isSettled: boolean;
}

/** Create a new spring state */
export function createSpring(
  target: number,
  config: SpringConfig = springPresets.default,
  initialPosition?: number,
): SpringState {
  return {
    position: initialPosition ?? target,
    velocity: 0,
    target,
    config,
    isSettled: initialPosition === undefined || initialPosition === target,
  };
}

/** Step a spring forward by one frame */
export function stepSpring(
  spring: SpringState,
  deltaSeconds: number,
): SpringState {
  if (spring.isSettled) return spring;

  const result = springSolver({
    current: spring.position,
    target: spring.target,
    velocity: spring.velocity,
    stiffness: spring.config.stiffness,
    damping: spring.config.damping,
    mass: spring.config.mass,
    deltaSeconds,
  });

  return {
    ...spring,
    position: result.position,
    velocity: result.velocity,
    isSettled: result.isSettled,
  };
}

/** Set a new target for the spring */
export function setSpringTarget(spring: SpringState, target: number): SpringState {
  return {
    ...spring,
    target,
    isSettled: spring.position === target && spring.velocity === 0,
  };
}

/** Set a new config for the spring */
export function setSpringConfig(
  spring: SpringState,
  config: Partial<SpringConfig>,
): SpringState {
  return {
    ...spring,
    config: { ...spring.config, ...config },
  };
}

/** Get the current value of the spring */
export function getSpringValue(spring: SpringState): number {
  return spring.position;
}

/** Check if the spring has settled */
export function isSpringSettled(spring: SpringState): boolean {
  return spring.isSettled;
}