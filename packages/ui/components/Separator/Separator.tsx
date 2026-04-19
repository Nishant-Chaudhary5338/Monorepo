"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { separatorVariants } from "./Separator.variants"
import type { SeparatorProps } from "./Separator.types"

/**
 * Horizontal or vertical divider line with solid, dashed, or dotted styles.
 *
 * @example
 * ```tsx
 * <Separator className="my-4" />
 * <Separator orientation="vertical" className="h-6" />
 * ```
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps & VariantProps<typeof separatorVariants>
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      variant = "solid",
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ variant, orientation }), className)}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator, separatorVariants }
