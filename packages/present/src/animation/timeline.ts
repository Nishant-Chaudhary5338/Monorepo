/**
 * Timeline — Sequenced animation orchestration
 *
 * Allows defining ordered animation steps that execute sequentially
 * or with overlaps. Supports labels, callbacks, and parallel groups.
 */

import { animationEngine, type SpringConfig, type Priority } from "../core";
import { springPresets } from "./spring";

/** A single step in the timeline */
interface TimelineStep {
  type: "animation" | "callback" | "label" | "group";
  id: string;
  delay: number;
  duration?: number;
  execute: () => Promise<void> | void;
}

/** Configuration for a timeline animation */
interface TimelineAnimationConfig {
  from: number;
  to: number;
  config?: SpringConfig;
  priority?: Priority;
}

/** Configuration for the timeline */
interface TimelineConfig {
  /** Default delay between steps (ms) */
  defaultDelay: number;
  /** Whether to auto-start */
  autoStart: boolean;
  /** On complete callback */
  onComplete?: () => void;
  /** On step complete callback */
  onStepComplete?: (stepId: string, index: number) => void;
}

const DEFAULT_CONFIG: TimelineConfig = {
  defaultDelay: 0,
  autoStart: true,
};

export class Timeline {
  private steps: TimelineStep[] = [];
  private currentIndex = 0;
  private isPlaying = false;
  private isPaused = false;
  private config: TimelineConfig;
  private labels = new Map<string, number>();

  constructor(config: Partial<TimelineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Add a spring animation step
   */
  animate(
    id: string,
    onUpdate: (value: number) => void,
    animationConfig: TimelineAnimationConfig,
    delay?: number,
  ): this {
    this.steps.push({
      type: "animation",
      id,
      delay: delay ?? this.config.defaultDelay,
      execute: () => {
        return new Promise<void>((resolve) => {
          animationEngine.animateSpring({
            from: animationConfig.from,
            to: animationConfig.to,
            config: animationConfig.config ?? springPresets.default,
            onUpdate,
            onComplete: resolve,
            priority: animationConfig.priority ?? "high",
          });
        });
      },
    });
    return this;
  }

  /**
   * Add a callback step
   */
  callback(id: string, fn: () => void | Promise<void>, delay?: number): this {
    this.steps.push({
      type: "callback",
      id,
      delay: delay ?? this.config.defaultDelay,
      execute: fn,
    });
    return this;
  }

  /**
   * Add a label (bookmark for seeking)
   */
  label(name: string): this {
    this.labels.set(name, this.steps.length);
    this.steps.push({
      type: "label",
      id: `label_${name}`,
      delay: 0,
      execute: () => {},
    });
    return this;
  }

  /**
   * Add a group of parallel steps
   */
  group(id: string, steps: Array<() => Promise<void> | void>, delay?: number): this {
    this.steps.push({
      type: "group",
      id,
      delay: delay ?? this.config.defaultDelay,
      execute: async () => {
        await Promise.all(steps.map((s) => s()));
      },
    });
    return this;
  }

  /**
   * Add a delay step
   */
  wait(ms: number): this {
    this.steps.push({
      type: "callback",
      id: `wait_${ms}`,
      delay: 0,
      execute: () => new Promise((resolve) => setTimeout(resolve, ms)),
    });
    return this;
  }

  /**
   * Play the timeline from the beginning
   */
  async play(): Promise<void> {
    this.currentIndex = 0;
    this.isPlaying = true;
    this.isPaused = false;
    await this.executeFromCurrent();
  }

  /**
   * Resume from paused state
   */
  async resume(): Promise<void> {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.isPlaying = true;
    await this.executeFromCurrent();
  }

  /**
   * Pause the timeline
   */
  pause(): void {
    this.isPaused = true;
    this.isPlaying = false;
  }

  /**
   * Stop and reset the timeline
   */
  stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = 0;
  }

  /**
   * Seek to a label
   */
  async seekTo(label: string): Promise<void> {
    const index = this.labels.get(label);
    if (index === undefined) {
      console.warn(`[Timeline] Label "${label}" not found`);
      return;
    }
    this.currentIndex = index;
    if (this.isPlaying) {
      await this.executeFromCurrent();
    }
  }

  /**
   * Execute steps from current index
   */
  private async executeFromCurrent(): Promise<void> {
    while (this.currentIndex < this.steps.length && this.isPlaying && !this.isPaused) {
      const step = this.steps[this.currentIndex]!;

      // Apply delay
      if (step.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
      }

      // Check if paused during delay
      if (this.isPaused) break;

      // Execute step
      try {
        await step.execute();
        this.config.onStepComplete?.(step.id, this.currentIndex);
      } catch (error) {
        console.error(`[Timeline] Step "${step.id}" error:`, error);
      }

      this.currentIndex++;
    }

    // Check if completed
    if (this.currentIndex >= this.steps.length && this.isPlaying) {
      this.isPlaying = false;
      this.config.onComplete?.();
    }
  }

  /**
   * Get current step index
   */
  get current(): number {
    return this.currentIndex;
  }

  /**
   * Get total steps
   */
  get total(): number {
    return this.steps.length;
  }

  /**
   * Check if playing
   */
  get playing(): boolean {
    return this.isPlaying;
  }

  /**
   * Check if paused
   */
  get paused(): boolean {
    return this.isPaused;
  }

  /**
   * Get all label names
   */
  get labelNames(): string[] {
    return Array.from(this.labels.keys());
  }

  /**
   * Clear all steps
   */
  clear(): this {
    this.steps = [];
    this.labels.clear();
    this.currentIndex = 0;
    return this;
  }

  /**
   * Destroy the timeline
   */
  destroy(): void {
    this.stop();
    this.clear();
  }
}

/**
 * Create a new timeline
 */
export function createTimeline(config?: Partial<TimelineConfig>): Timeline {
  return new Timeline(config);
}