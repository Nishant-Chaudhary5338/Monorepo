/**
 * Autoplay plugin — Auto-advance slides at configurable intervals
 */

import type { Plugin, PluginContext } from "../types";

/** Autoplay plugin options */
export interface AutoplayOptions {
  /** Delay between slides in ms */
  delay: number;
  /** Start playing on registration */
  autoStart: boolean;
  /** Pause on hover */
  pauseOnHover: boolean;
  /** Stop at the end */
  loop: boolean;
  /** Progress callback */
  onProgress?: (progress: number) => void;
}

const DEFAULT_OPTIONS: AutoplayOptions = {
  delay: 5000,
  autoStart: false,
  pauseOnHover: true,
  loop: false,
};

/**
 * Create autoplay plugin
 */
export function createAutoplayPlugin(
  options: Partial<AutoplayOptions> = {},
): Plugin {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let context: PluginContext | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let progressTimer: ReturnType<typeof setInterval> | null = null;
  let isPlaying = false;
  let progress = 0;

  function startProgressTracking(): void {
    if (progressTimer) clearInterval(progressTimer);
    progress = 0;

    const updateInterval = 50; // Update every 50ms
    progressTimer = setInterval(() => {
      progress += updateInterval / config.delay;
      if (progress > 1) progress = 1;
      config.onProgress?.(progress);
    }, updateInterval);
  }

  function stopProgressTracking(): void {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    progress = 0;
  }

  function start(): void {
    if (isPlaying || !context) return;
    isPlaying = true;

    startProgressTracking();

    timer = setInterval(() => {
      const state = context?.getState();
      if (!state) return;

      if (state.current < state.total - 1) {
        context?.dispatch({ type: "slide:enter", slideIndex: state.current + 1, fragmentIndex: 0, direction: "forward", timestamp: Date.now() });
      } else if (config.loop) {
        context?.dispatch({ type: "slide:enter", slideIndex: 0, fragmentIndex: 0, direction: "forward", timestamp: Date.now() });
      } else {
        stop();
      }

      // Reset progress
      progress = 0;
    }, config.delay);
  }

  function stop(): void {
    if (!isPlaying) return;
    isPlaying = false;

    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    stopProgressTracking();
  }

  function toggle(): void {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }

  return {
    config: {
      name: "autoplay",
      version: "1.0.0",
      description: "Auto-advance slides at configurable intervals",
      options: config,
    },
    hooks: {
      onRegister: (ctx) => {
        context = ctx;

        if (config.autoStart) {
          start();
        }
      },

      onUnregister: () => {
        stop();
        context = null;
      },

      onEvent: (event) => {
        if (!isPlaying) return;

        // Pause on certain events
        if (event.type === "deck:overview" || event.type === "deck:presenter") {
          stop();
        }
      },

      onPointer: () => {
        if (config.pauseOnHover && isPlaying) {
          stop();
        }
      },
    },
  };
}