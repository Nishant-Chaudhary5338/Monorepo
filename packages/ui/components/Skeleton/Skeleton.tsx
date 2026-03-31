import * as React from "react"

import { cn } from "../../lib/utils"
import type { SkeletonProps } from "./Skeleton.types"

function Skeleton({
  className,
  variant = "default",
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        variant === "shimmer" && "animate-shimmer",
        variant === "pulse" && "animate-pulse",
        variant === "default" && animate && "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
