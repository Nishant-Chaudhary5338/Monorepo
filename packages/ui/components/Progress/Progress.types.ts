/**
 * Progress component type definitions
 * @module Progress
 */

import type * as React from "react"
import type * as ProgressPrimitive from "@radix-ui/react-progress"

/**
 * Props for the Progress component.
 * Extends ProgressPrimitive.Root props from Radix UI.
 */
export type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>