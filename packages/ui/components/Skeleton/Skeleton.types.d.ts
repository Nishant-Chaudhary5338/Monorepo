/**
 * Skeleton component type definitions
 * @module Skeleton
 */
import * as React from "react";
/**
 * Props for the Skeleton component.
 * Extends native div attributes.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[200px]" />
 * ```
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The visual variant of the skeleton.
     * @default "default"
     */
    variant?: "default" | "shimmer" | "pulse";
    /**
     * Whether to show an animation effect.
     * @default true
     */
    animate?: boolean;
}
//# sourceMappingURL=Skeleton.types.d.ts.map