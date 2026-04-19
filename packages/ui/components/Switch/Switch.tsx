"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { switchVariants, switchThumbVariants } from "./Switch.variants"
import type { SwitchProps } from "./Switch.types"

/**
 * Toggle switch for boolean on/off values with size variants.
 *
 * @example
 * ```tsx
 * <div className="flex items-center space-x-2">
 *   <Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
 *   <Label htmlFor="notifications">Enable notifications</Label>
 * </div>
 * ```
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps & VariantProps<typeof switchVariants>
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ size }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch, switchVariants }
