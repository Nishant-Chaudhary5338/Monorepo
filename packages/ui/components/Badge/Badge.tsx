/**
 * Badge component library for @repo/ui
 * @module Badge
 */

import * as React from "react"

import { cn } from "../../lib/utils"

import { type BadgeProps } from "./Badge.types"
import { badgeVariants } from "./Badge.variants"

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

