/**
 * AnimationEngine — Orchestrates spring animations and motion values
 *
 * Registers active animations with the FrameScheduler,
 * solves spring physics each frame, and notifies subscribers.
 */

import { springSolver } from "./math";
import { frameScheduler, type Priority } from "./scheduler";

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

/** Active spring animation */
interface ActiveSpring {
  id: string;
  current: number;
  target: number;
  velocity: number;
  config: SpringConfig;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
  priority: Priority;
}

export class AnimationEngine {
  private springs = new Map<string, ActiveSpring>();
  private schedulerTaskId: string | null = null;
  private idCounter = 0;

  /** Start a spring animation */
  animateSpring({
    from,
    to,
    config = springPresets.default,
    onUpdate,
    onComplete,
    priority = "high",
  }: {
    from?: number;
    to: number;
    config?: SpringConfig;
    onUpdate: (value: number) => void;
    onComplete?: () => void;
    priority?: Priority;
  }): string {
    const id = `spring_${++this.idCounter}`;

    const spring: ActiveSpring = {
      id,
      current: from ?? 0,
      target: to,
      velocity: 0,
      config,
      onUpdate,
      onComplete,
      priority,
    };

    this.springs.set(id, spring);
    this.ensureSchedulerRunning();

    return id;
  }

  /** Update the target of an active spring */
  setSpringTarget(id: string, target: number): void {
    const spring = this.springs.get(id);
    if (spring) {
      spring.target = target;
    }
  }

  /** Update spring config */
  setSpringConfig(id: string, config: Partial<SpringConfig>): void {
    const spring = this.springs.get(id);
    if (spring) {
      spring.config = { ...spring.config, ...config };
    }
  }

  /** Stop a spring animation */
  stopSpring(id: string): void {
    const spring = this.springs.get(id);
    if (spring) {
      spring.onComplete?.();
      this.springs.delete(id);
    }
    this.ensureSchedulerStopped();
  }

  /** Stop all animations */
  stopAll(): void {
    for (const spring of this.springs.values()) {
      spring.onComplete?.();
    }
    this.springs.clear();
    this.ensureSchedulerStopped();
  }

  /** Ensure the scheduler is running when we have active springs */
  private ensureSchedulerRunning(): void {
    if (this.schedulerTaskId === null && this.springs.size > 0) {
      this.schedulerTaskId = frameScheduler.schedule("critical", (deltaMs) => {
        this.tick(deltaMs);
      });
    }
  }

  /** Stop the scheduler when no springs are active */
  private ensureSchedulerStopped(): void {
    if (this.schedulerTaskId !== null && this.springs.size === 0) {
      frameScheduler.cancel(this.schedulerTaskId);
      this.schedulerTaskId = null;
    }
  }

  /** Tick all active springs */
  private tick(deltaMs: number): void {
    const deltaSeconds = deltaMs / 1000;
    const completed: string[] = [];

    for (const [id, spring] of this.springs) {
      const result = springSolver({
        current: spring.current,
        target: spring.target,
        velocity: spring.velocity,
        stiffness: spring.config.stiffness,
        damping: spring.config.damping,
        mass: spring.config.mass,
        deltaSeconds,
      });

      spring.current = result.position;
      spring.velocity = result.velocity;
      spring.onUpdate(result.position);

      if (result.isSettled) {
        completed.push(id);
      }
    }

    for (const id of completed) {
      const spring = this.springs.get(id);
      if (spring) {
        spring.onComplete?.();
        this.springs.delete(id);
      }
    }

    this.ensureSchedulerStopped();
  }

  /** Get the number of active springs */
  get activeCount(): number {
    return this.springs.size;
  }

  /** Check if a specific spring is active */
  isActive(id: string): boolean {
    return this.springs.has(id);
  }

  /** Destroy the engine */
  destroy(): void {
    this.stopAll();
  }
}

/** Singleton animation engine */
export const animationEngine = new AnimationEngine();