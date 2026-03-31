/**
 * Toggle component type definitions
 * @module Toggle
 */

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { type VariantProps } from "class-variance-authority"

import { type toggleVariants } from "./Toggle.variants"

/**
 * Props for the Toggle component.
 * Extends Radix UI Toggle primitive with variant styling options.
 * 
 * @example
 * ```tsx
 * <Toggle variant="outline" size="sm">Toggle</Toggle>
 * ```
 */
export type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>