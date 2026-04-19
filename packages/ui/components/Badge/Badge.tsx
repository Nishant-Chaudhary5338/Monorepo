import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { type BadgeProps } from "./Badge.types"
import { badgeVariants } from "./Badge.variants"

/**
 * Small inline label for status, categories, or counts.
 *
 * @example
 * ```tsx
 * <Badge variant="secondary">Beta</Badge>
 * <Badge variant="destructive">Error</Badge>
 * ```
 */
function Badge({ className, variant, size, ...props }: BadgeProps & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
