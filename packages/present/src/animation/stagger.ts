/**
 * Stagger — Children animation orchestration
 *
 * Delays animations across a list of children with configurable
 * stagger timing, direction, and easing.
 */

import { animationEngine, type SpringConfig, type Priority } from "../core";
import { springPresets } from "./spring";

/** Stagger configuration */
export interface StaggerConfig {
  /** Delay between each child (ms) */
  staggerDelay: number;
  /** Start delay before first child (ms) */
  startDelay: number;
  /** Direction of stagger */
  direction: "forward" | "backward" | "center" | "edges";
  /** Spring config for animations */
  spring?: SpringConfig;
  /** Priority for animations */
  priority?: Priority;
  /** Custom delay function for complex stagger patterns */
  getDelay?: (index: number, total: number) => number;
}

const DEFAULT_CONFIG: StaggerConfig = {
  staggerDelay: 50,
  startDelay: 0,
  direction: "forward",
  spring: springPresets.default,
  priority: "normal",
};

/** Calculate delay for a child based on direction */
export function calculateStaggerDelay(
  index: number,
  total: number,
  config: StaggerConfig,
): number {
  if (config.getDelay) {
    return config.getDelay(index, total);
  }

  const { staggerDelay, startDelay, direction } = config;

  switch (direction) {
    case "forward":
      return startDelay + index * staggerDelay;

    case "backward":
      return startDelay + (total - 1 - index) * staggerDelay;

    case "center": {
      const center = Math.floor(total / 2);
      const distance = Math.abs(index - center);
      return startDelay + distance * staggerDelay;
    }

    case "edges": {
      const edgeDistance = Math.min(index, total - 1 - index);
      return startDelay + edgeDistance * staggerDelay;
    }

    default:
      return startDelay + index * staggerDelay;
  }
}

/** Stagger animation result for a single child */
export interface StaggerChildResult {
  /** Spring animation ID */
  springId: string;
  /** Calculated delay */
  delay: number;
  /** Child index */
  index: number;
}

/**
 * Stagger — Animate children with staggered timing
 *
 * Returns an array of spring IDs that can be used to control animations.
 */
export function staggerAnimate(
  count: number,
  onUpdate: (index: number, value: number) => void,
  animationConfig: {
    from: number;
    to: number;
    config?: Partial<StaggerConfig>;
  },
): StaggerChildResult[] {
  const config = { ...DEFAULT_CONFIG, ...animationConfig.config };
  const results: StaggerChildResult[] = [];

  for (let i = 0; i < count; i++) {
    const delay = calculateStaggerDelay(i, count, config);

    const springId = animationEngine.animateSpring({
      from: animationConfig.from,
      to: animationConfig.to,
      config: config.spring ?? springPresets.default,
      onUpdate: (value) => onUpdate(i, value),
      priority: config.priority ?? "normal",
    });

    results.push({
      springId,
      delay,
      index: i,
    });
  }

  return results;
}

/**
 * Stagger hook — manages staggered animations for a list
 */
export class StaggerController {
  private config: StaggerConfig;
  private springIds: string[] = [];
  private isAnimating = false;

  constructor(config: Partial<StaggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start staggered animation for children
   */
  start(
    count: number,
    onUpdate: (index: number, value: number) => void,
    animation: { from: number; to: number },
  ): void {
    if (this.isAnimating) {
      this.stop();
    }

    this.isAnimating = true;
    this.springIds = [];

    for (let i = 0; i < count; i++) {
      const delay = calculateStaggerDelay(i, count, this.config);

      setTimeout(() => {
        if (!this.isAnimating) return;

        const springId = animationEngine.animateSpring({
          from: animation.from,
          to: animation.to,
          config: this.config.spring ?? springPresets.default,
          onUpdate: (value) => onUpdate(i, value),
          priority: this.config.priority ?? "normal",
        });

        this.springIds.push(springId);
      }, delay);
    }
  }

  /**
   * Reverse the stagger animation
   */
  reverse(
    count: number,
    onUpdate: (index: number, value: number) => void,
    animation: { from: number; to: number },
  ): void {
    if (this.isAnimating) {
      this.stop();
    }

    this.isAnimating = true;
    this.springIds = [];

    for (let i = count - 1; i >= 0; i--) {
      const delay = calculateStaggerDelay(count - 1 - i, count, this.config);

      setTimeout(() => {
        if (!this.isAnimating) return;

        const springId = animationEngine.animateSpring({
          from: animation.from,
          to: animation.to,
          config: this.config.spring ?? springPresets.default,
          onUpdate: (value) => onUpdate(i, value),
          priority: this.config.priority ?? "normal",
        });

        this.springIds.push(springId);
      }, delay);
    }
  }

  /**
   * Stop all animations
   */
  stop(): void {
    this.isAnimating = false;
    for (const id of this.springIds) {
      animationEngine.stopSpring(id);
    }
    this.springIds = [];
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<StaggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if animating
   */
  get animating(): boolean {
    return this.isAnimating;
  }

  /**
   * Destroy the controller
   */
  destroy(): void {
    this.stop();
  }
}

/**
 * Create a stagger controller
 */
export function createStagger(config?: Partial<StaggerConfig>): StaggerController {
  return new StaggerController(config);
}