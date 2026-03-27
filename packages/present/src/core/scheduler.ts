/**
 * FrameScheduler — Priority-based requestAnimationFrame scheduling
 *
 * Ensures 60fps by batching work across priority levels:
 * - CRITICAL: Must run every frame (gesture tracking, spring updates)
 * - HIGH: Should run every frame (state-driven animations)
 * - NORMAL: Can skip frames if needed (UI updates)
 * - LOW: Background tasks (analytics, prefetching)
 */

export type Priority = "critical" | "high" | "normal" | "low";

interface ScheduledTask {
  id: string;
  priority: Priority;
  callback: (deltaMs: number) => void;
  enabled: boolean;
}

const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

let taskIdCounter = 0;

function generateTaskId(): string {
  return `task_${++taskIdCounter}`;
}

export class FrameScheduler {
  private tasks = new Map<string, ScheduledTask>();
  private rafId: number | null = null;
  private lastFrameTime = 0;
  private isRunning = false;

  /** Register a task with a priority */
  schedule(
    priority: Priority,
    callback: (deltaMs: number) => void,
  ): string {
    const id = generateTaskId();
    this.tasks.set(id, { id, priority, callback, enabled: true });

    // Auto-start if not running
    if (!this.isRunning) {
      this.start();
    }

    return id;
  }

  /** Remove a task */
  cancel(taskId: string): void {
    this.tasks.delete(taskId);

    // Auto-stop if no tasks remain
    if (this.tasks.size === 0) {
      this.stop();
    }
  }

  /** Enable/disable a task without removing it */
  setEnabled(taskId: string, enabled: boolean): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.enabled = enabled;
    }
  }

  /** Start the RAF loop */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.tick();
  }

  /** Stop the RAF loop */
  stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** Main frame loop */
  private tick = (): void => {
    if (!this.isRunning) return;

    this.rafId = requestAnimationFrame((now) => {
      const deltaMs = Math.min(now - this.lastFrameTime, 33.33); // Cap at ~30fps minimum
      this.lastFrameTime = now;

      // Sort tasks by priority
      const sortedTasks = Array.from(this.tasks.values())
        .filter((t) => t.enabled)
        .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

      // Execute tasks
      for (const task of sortedTasks) {
        try {
          task.callback(deltaMs);
        } catch (error) {
          console.error(`[FrameScheduler] Task ${task.id} error:`, error);
        }
      }

      this.tick();
    });
  };

  /** Get current task count */
  get size(): number {
    return this.tasks.size;
  }

  /** Check if scheduler is running */
  get running(): boolean {
    return this.isRunning;
  }

  /** Destroy the scheduler — cancel all tasks and stop */
  destroy(): void {
    this.stop();
    this.tasks.clear();
  }
}

/** Singleton frame scheduler */
export const frameScheduler = new FrameScheduler();