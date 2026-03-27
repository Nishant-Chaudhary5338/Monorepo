/**
 * Plugin types — Plugin architecture interfaces
 */

import type { DeckState, DeckEvent } from "../types";

/** Plugin lifecycle hooks */
export interface PluginHooks {
  /** Called when plugin is registered */
  onRegister?: (context: PluginContext) => void;
  /** Called when plugin is unregistered */
  onUnregister?: () => void;
  /** Called on every deck event */
  onEvent?: (event: DeckEvent) => void;
  /** Called on slide change */
  onSlideChange?: (index: number, previousIndex: number) => void;
  /** Called on fragment change */
  onFragmentChange?: (index: number, slideIndex: number) => void;
  /** Called on fullscreen change */
  onFullscreenChange?: (isFullscreen: boolean) => void;
  /** Called on presentation start */
  onStart?: () => void;
  /** Called on presentation stop */
  onStop?: () => void;
  /** Called on overview toggle */
  onOverviewToggle?: (isOverview: boolean) => void;
  /** Called on presenter mode toggle */
  onPresenterToggle?: (isPresenter: boolean) => void;
  /** Called on keyboard event */
  onKeydown?: (event: KeyboardEvent) => void;
  /** Called on pointer event */
  onPointer?: (event: PointerEvent) => void;
  /** Called on resize */
  onResize?: (width: number, height: number) => void;
}

/** Context passed to plugins */
export interface PluginContext {
  /** Get current deck state */
  getState: () => DeckState;
  /** Dispatch an event */
  dispatch: (event: DeckEvent) => void;
  /** Get slide element by index */
  getSlideElement: (index: number) => HTMLElement | null;
  /** Get viewport element */
  getViewportElement: () => HTMLElement | null;
  /** Plugin-specific storage */
  storage: Map<string, unknown>;
}

/** Plugin configuration */
export interface PluginConfig {
  /** Plugin name */
  name: string;
  /** Plugin version */
  version?: string;
  /** Plugin description */
  description?: string;
  /** Plugin author */
  author?: string;
  /** Plugin dependencies */
  dependencies?: string[];
  /** Plugin options */
  options?: Record<string, unknown>;
}

/** Complete plugin interface */
export interface Plugin {
  /** Plugin configuration */
  config: PluginConfig;
  /** Plugin lifecycle hooks */
  hooks: PluginHooks;
}

/** Plugin manager events */
export type PluginManagerEvent =
  | { type: "register"; plugin: Plugin }
  | { type: "unregister"; plugin: Plugin }
  | { type: "error"; plugin: Plugin; error: Error };