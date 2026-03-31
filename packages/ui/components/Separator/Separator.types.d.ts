/**
 * Separator component type definitions
 * @module Separator
 */
import * as React from "react";
/**
 * Props for the Separator component.
 * Extends native div attributes.
 *
 * @example
 * ```tsx
 * <Separator orientation="horizontal" />
 * ```
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The orientation of the separator.
     * @default "horizontal"
     */
    orientation?: "horizontal" | "vertical";
    /**
     * Whether the separator is purely decorative or has semantic meaning.
     * When true, separator will have aria-hidden="true".
     * @default true
     */
    decorative?: boolean;
}
//# sourceMappingURL=Separator.types.d.ts.map