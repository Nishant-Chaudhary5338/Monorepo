/**
 * Analytics plugin — Track presentation events
 */

import type { Plugin, PluginContext } from "../types";
import type { DeckEvent } from "../../types";

/** Analytics plugin options */
export interface AnalyticsOptions {
  /** Tracking callback */
  onTrack?: (event: string, data: Record<string, unknown>) => void;
  /** Session ID */
  sessionId?: string;
  /** Track slide views */
  trackSlideViews: boolean;
  /** Track time spent per slide */
  trackTimeSpent: boolean;
  /** Track interactions */
  trackInteractions: boolean;
}

const DEFAULT_OPTIONS: AnalyticsOptions = {
  trackSlideViews: true,
  trackTimeSpent: true,
  trackInteractions: true,
};

/**
 * Create analytics plugin
 */
export function createAnalyticsPlugin(
  options: Partial<AnalyticsOptions> = {},
): Plugin {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const sessionId = config.sessionId ?? generateSessionId();
  const slideTimers = new Map<number, number>();
  const slideViews = new Map<number, number>();
  let context: PluginContext | null = null;
  let currentSlide: number | null = null;
  let slideStartTime = 0;

  function track(event: string, data: Record<string, unknown> = {}): void {
    const payload = {
      ...data,
      sessionId,
      timestamp: Date.now(),
    };

    if (config.onTrack) {
      config.onTrack(event, payload);
    } else {
      console.log(`[Analytics] ${event}`, payload);
    }
  }

  function startSlideTimer(slideIndex: number): void {
    slideStartTime = Date.now();
    currentSlide = slideIndex;
  }

  function stopSlideTimer(): void {
    if (currentSlide !== null && config.trackTimeSpent) {
      const elapsed = Date.now() - slideStartTime;
      const total = (slideTimers.get(currentSlide) ?? 0) + elapsed;
      slideTimers.set(currentSlide, total);

      track("slide:time", {
        slideIndex: currentSlide,
        duration: elapsed,
        totalTime: total,
      });
    }
  }

  return {
    config: {
      name: "analytics",
      version: "1.0.0",
      description: "Track presentation events and metrics",
      options: config,
    },
    hooks: {
      onRegister: (ctx) => {
        context = ctx;
        track("session:start");
      },

      onUnregister: () => {
        stopSlideTimer();
        track("session:end", {
          slideViews: Object.fromEntries(slideViews),
          slideTimers: Object.fromEntries(slideTimers),
        });
        context = null;
      },

      onEvent: (event: DeckEvent) => {
        switch (event.type) {
          case "slide:enter":
            stopSlideTimer();
            startSlideTimer(event.slideIndex);

            if (config.trackSlideViews) {
              const views = (slideViews.get(event.slideIndex) ?? 0) + 1;
              slideViews.set(event.slideIndex, views);
              track("slide:enter", {
                slideIndex: event.slideIndex,
                direction: event.direction,
                views,
              });
            }
            break;

          case "slide:exit":
            if (config.trackTimeSpent) {
              track("slide:exit", {
                slideIndex: event.slideIndex,
                direction: event.direction,
              });
            }
            break;

          case "fragment:step":
            if (config.trackInteractions) {
              track("fragment:step", {
                slideIndex: event.slideIndex,
                fragmentIndex: event.fragmentIndex,
              });
            }
            break;

          case "deck:fullscreen":
            if (config.trackInteractions) {
              track("deck:fullscreen", {
                isFullscreen: context?.getState().isFullscreen ?? false,
              });
            }
            break;

          case "deck:overview":
            if (config.trackInteractions) {
              track("deck:overview", {
                isOverview: context?.getState().isOverview ?? false,
              });
            }
            break;

          case "deck:presenter":
            if (config.trackInteractions) {
              track("deck:presenter", {
                isPresenter: context?.getState().isPresenter ?? false,
              });
            }
            break;

          case "deck:start":
            track("deck:start");
            break;

          case "deck:end":
            stopSlideTimer();
            track("deck:end", {
              totalSlides: context?.getState().total ?? 0,
            });
            break;
        }
      },
    },
  };
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}