/**
 * NavigationMenu component variant definitions using class-variance-authority
 * @module NavigationMenu
 */
import { cva } from "class-variance-authority";
/**
 * CVA variant definitions for NavigationMenu trigger button.
 * Provides styling for the trigger button that opens navigation menus.
 *
 * @example
 * ```tsx
 * import { navigationMenuTriggerStyle } from "./NavigationMenu.variants"
 *
 * // Use variants directly
 * const className = navigationMenuTriggerStyle()
 * ```
 */
export var navigationMenuTriggerStyle = cva("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50");
