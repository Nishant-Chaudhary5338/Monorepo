"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { progressVariants, progressIndicatorVariants } from "./Progress.variants"

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressIndicatorVariants> {}

/**
 * Linear progress bar with animated fill, color variants, and sizes.
 *
 * @example
 * ```tsx
 * <Progress value={60} className="w-full" />
 * ```
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress, progressVariants, progressIndicatorVariants }
