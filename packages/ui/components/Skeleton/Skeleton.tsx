import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { skeletonVariants } from "./Skeleton.variants"
import type { SkeletonProps } from "./Skeleton.types"

/**
 * Loading placeholder with pulse or shimmer animation and multiple shape variants.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[250px]" />
 * <Skeleton variant="circle" className="h-12 w-12" />
 * ```
 */
function Skeleton({
  className,
  variant,
  animate,
  ...props
}: SkeletonProps & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      className={cn(skeletonVariants({ variant, animate }), className)}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
