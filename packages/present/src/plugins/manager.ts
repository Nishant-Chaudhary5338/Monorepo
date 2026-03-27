/**
 * PluginManager — Plugin lifecycle management
 *
 * Handles plugin registration, unregistration, and event dispatching.
 */

import type { Plugin, PluginContext, PluginHooks } from "./types";
import type { DeckState, DeckEvent } from "../types";

/** Plugin manager listener */
type ManagerListener = (event: { type: string; plugin?: Plugin; error?: Error }) => void;

export class PluginManager {
  private plugins = new Map<string, Plugin>();
  private contexts = new Map<string, PluginContext>();
  private listeners = new Set<ManagerListener>();
  private state: DeckState | null = null;

  /** Register a plugin */
  register(plugin: Plugin): void {
    const { name } = plugin.config;

    if (this.plugins.has(name)) {
      console.warn(`[PluginManager] Plugin "${name}" is already registered`);
      return;
    }

    // Check dependencies
    if (plugin.config.dependencies) {
      for (const dep of plugin.config.dependencies) {
        if (!this.plugins.has(dep)) {
          this.emit({
            type: "error",
            plugin,
            error: new Error(`Dependency "${dep}" not found for plugin "${name}"`),
          });
          return;
        }
      }
    }

    this.plugins.set(name, plugin);

    // Create context
    const context: PluginContext = {
      getState: () => this.state ?? ({} as DeckState),
      dispatch: (event: DeckEvent) => this.dispatchToPlugins(event),
      getSlideElement: (index: number) => this.getSlideElement(index),
      getViewportElement: () => this.getViewportElement(),
      storage: new Map(),
    };

    this.contexts.set(name, context);

    // Call onRegister
    try {
      plugin.hooks.onRegister?.(context);
    } catch (error) {
      console.error(`[PluginManager] Error registering plugin "${name}":`, error);
      this.emit({ type: "error", plugin, error: error as Error });
    }

    this.emit({ type: "register", plugin });
  }

  /** Unregister a plugin */
  unregister(name: string): void {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      console.warn(`[PluginManager] Plugin "${name}" is not registered`);
      return;
    }

    // Call onUnregister
    try {
      plugin.hooks.onUnregister?.();
    } catch (error) {
      console.error(`[PluginManager] Error unregistering plugin "${name}":`, error);
    }

    this.plugins.delete(name);
    this.contexts.delete(name);

    this.emit({ type: "unregister", plugin });
  }

  /** Unregister all plugins */
  unregisterAll(): void {
    for (const name of this.plugins.keys()) {
      this.unregister(name);
    }
  }

  /** Get a registered plugin */
  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /** Check if a plugin is registered */
  has(name: string): boolean {
    return this.plugins.has(name);
  }

  /** Get all registered plugin names */
  getNames(): string[] {
    return Array.from(this.plugins.keys());
  }

  /** Get plugin count */
  get size(): number {
    return this.plugins.size;
  }

  /** Update deck state */
  setState(state: DeckState): void {
    this.state = state;
  }

  /** Dispatch an event to all plugins */
  dispatch(event: DeckEvent): void {
    this.dispatchToPlugins(event);
  }

  /** Call a specific hook on all plugins */
  callHook<K extends keyof PluginHooks>(hook: K, ...args: Parameters<NonNullable<PluginHooks[K]>>): void {
    for (const plugin of this.plugins.values()) {
      const hookFn = plugin.hooks[hook] as ((...a: Parameters<NonNullable<PluginHooks[K]>>) => void) | undefined;
      if (hookFn) {
        try {
          hookFn(...args);
        } catch (error) {
          console.error(`[PluginManager] Error in hook "${hook}" for plugin "${plugin.config.name}":`, error);
          this.emit({ type: "error", plugin, error: error as Error });
        }
      }
    }
  }

  /** Dispatch event to all plugins */
  private dispatchToPlugins(event: DeckEvent): void {
    for (const plugin of this.plugins.values()) {
      try {
        plugin.hooks.onEvent?.(event);
      } catch (error) {
        console.error(`[PluginManager] Error in onEvent for plugin "${plugin.config.name}":`, error);
        this.emit({ type: "error", plugin, error: error as Error });
      }
    }
  }

  /** Get slide element (to be overridden) */
  private getSlideElement(_index: number): HTMLElement | null {
    return null;
  }

  /** Get viewport element (to be overridden) */
  private getViewportElement(): HTMLElement | null {
    return null;
  }

  /** Subscribe to manager events */
  on(listener: ManagerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Emit a manager event */
  private emit(event: { type: string; plugin?: Plugin; error?: Error }): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  /** Destroy the manager */
  destroy(): void {
    this.unregisterAll();
    this.listeners.clear();
  }
}

/** Create a plugin manager */
export function createPluginManager(): PluginManager {
  return new PluginManager();
}