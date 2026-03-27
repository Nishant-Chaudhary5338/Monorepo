// Plugins module — Plugin architecture and built-in plugins
export { PluginManager, createPluginManager } from "./manager";
export { usePlugins } from "./use-plugins";
export type { Plugin, PluginConfig, PluginHooks, PluginContext, PluginManagerEvent } from "./types";
export type { UsePluginsOptions } from "./use-plugins";

// Built-in plugins
export { createAnalyticsPlugin } from "./built-in/analytics";
export type { AnalyticsOptions } from "./built-in/analytics";
export { createAutoplayPlugin } from "./built-in/autoplay";
export type { AutoplayOptions } from "./built-in/autoplay";
export { createSyncPlugin } from "./built-in/sync";
export type { SyncOptions } from "./built-in/sync";
export { createNotesPlugin } from "./built-in/notes";
export type { NotesOptions } from "./built-in/notes";