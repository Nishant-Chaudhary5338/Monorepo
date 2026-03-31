/**
 * Badge component variant definitions using class-variance-authority
 * @module Badge
 */
import { cva } from "class-variance-authority";
/**
 * CVA variant definitions for Badge component.
 * Provides styling for different variants.
 *
 * @example
 * ```tsx
 * import { badgeVariants } from "./Badge.variants"
 *
 * // Use variants directly
 * const className = badgeVariants({ variant: "default" })
 * ```
 */
export var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            outline: "text-foreground",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
