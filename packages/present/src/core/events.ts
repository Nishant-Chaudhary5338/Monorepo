import type { DeckState } from "../types";
import type { DeckAction } from "./reducer";
import type { DeckEventListener, DeckEvent, DeckPlugin } from "../types";

export class DeckEventBus {
  private listeners = new Map<string, Set<DeckEventListener>>();
  private plugins: DeckPlugin[] = [];

  on(type: string, fn: DeckEventListener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(fn);
    return () => this.off(type, fn);
  }

  off(type: string, fn: DeckEventListener) {
    this.listeners.get(type)?.delete(fn);
  }

  emit(event: DeckEvent) {
    this.listeners.get(event.type)?.forEach((fn) => fn(event));
    this.listeners.get("*")?.forEach((fn) => fn(event));
    this.plugins.forEach((p) => p.onEvent?.(event));
  }

  use(plugin: DeckPlugin) {
    this.plugins.push(plugin);
    return () => {
      this.plugins = this.plugins.filter((p) => p !== plugin);
      plugin.onDestroy?.();
    };
  }

  destroy() {
    this.listeners.clear();
    this.plugins.forEach((p) => p.onDestroy?.());
    this.plugins = [];
  }
}

export const eventBus = new DeckEventBus();
