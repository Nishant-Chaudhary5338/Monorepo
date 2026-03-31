/**
 * ToggleGroup component type definitions
 * @module ToggleGroup
 */

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { type toggleVariants } from "../Toggle/Toggle.variants"

/**
 * Props for the ToggleGroup component.
 * Extends Radix UI ToggleGroup primitive with variant styling options.
 * 
 * @example
 * ```tsx
 * <ToggleGroup type="single" variant="outline" size="sm">
 *   <ToggleGroupItem value="a">A</ToggleGroupItem>
 *   <ToggleGroupItem value="b">B</ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */
export type ToggleGroupProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>

/**
 * Props for the ToggleGroupItem component.
 * Extends Radix UI ToggleGroup.Item primitive with variant styling options.
 * 
 * @example
 * ```tsx
 * <ToggleGroupItem value="a">Option A</ToggleGroupItem>
 * ```
 */
export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>

/**
 * Context type for ToggleGroup variant/size propagation.
 */
export interface ToggleGroupContextValue {
  variant?: VariantProps<typeof toggleVariants>["variant"]
  size?: VariantProps<typeof toggleVariants>["size"]
}