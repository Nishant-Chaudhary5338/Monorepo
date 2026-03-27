/**
 * usePlugins — React hook for plugin management
 */

import { useRef, useEffect, useCallback } from "react";
import { PluginManager } from "./manager";
import type { Plugin } from "./types";

/** usePlugins options */
export interface UsePluginsOptions {
  /** Plugins to register */
  plugins?: Plugin[];
  /** Auto-unregister on unmount */
  autoCleanup?: boolean;
}

/**
 * usePlugins — Manage plugins in a React component
 */
export function usePlugins(options: UsePluginsOptions = {}): {
  /** Plugin manager instance */
  manager: PluginManager;
  /** Register a plugin */
  register: (plugin: Plugin) => void;
  /** Unregister a plugin */
  unregister: (name: string) => void;
  /** Check if plugin is registered */
  has: (name: string) => boolean;
  /** Get registered plugin names */
  getNames: () => string[];
} {
  const { plugins = [], autoCleanup = true } = options;
  const managerRef = useRef<PluginManager | null>(null);

  // Lazy initialize manager
  if (managerRef.current === null) {
    managerRef.current = new PluginManager();
  }

  const manager = managerRef.current;

  // Register initial plugins
  useEffect(() => {
    for (const plugin of plugins) {
      manager.register(plugin);
    }
  }, [manager]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoCleanup) {
        manager.destroy();
      }
    };
  }, [manager, autoCleanup]);

  const register = useCallback(
    (plugin: Plugin) => {
      manager.register(plugin);
    },
    [manager],
  );

  const unregister = useCallback(
    (name: string) => {
      manager.unregister(name);
    },
    [manager],
  );

  const has = useCallback(
    (name: string) => manager.has(name),
    [manager],
  );

  const getNames = useCallback(
    () => manager.getNames(),
    [manager],
  );

  return {
    manager,
    register,
    unregister,
    has,
    getNames,
  };
}