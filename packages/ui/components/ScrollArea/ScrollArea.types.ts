/**
 * ScrollArea component type definitions
 * @module ScrollArea
 */

import type * as React from "react"
import type * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

/**
 * Props for the ScrollArea root component.
 */
export type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>

/**
 * Props for the ScrollBar component.
 */
export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  /**
   * The orientation of the scrollbar.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal"
}