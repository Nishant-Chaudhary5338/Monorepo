/**
 * Button component variant definitions using class-variance-authority
 * @module Button
 */
/**
 * CVA variant definitions for Button component.
 * Provides styling for different variants and sizes.
 *
 * @example
 * ```tsx
 * import { buttonVariants } from "./Button.variants"
 *
 * // Use variants directly
 * const className = buttonVariants({ variant: "default", size: "lg" })
 * ```
 */
export declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
//# sourceMappingURL=Button.variants.d.ts.map