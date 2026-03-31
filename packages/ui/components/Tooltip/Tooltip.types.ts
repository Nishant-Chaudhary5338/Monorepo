/**
 * Tooltip component type definitions
 * @module Tooltip
 */

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

/**
 * Props for the TooltipContent component.
 * Extends Radix UI Tooltip Content props.
 * 
 * @example
 * ```tsx
 * <Tooltip content="Save changes">
 *   <Button>Save</Button>
 * </Tooltip>
 * ```
 */
export type TooltipProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
