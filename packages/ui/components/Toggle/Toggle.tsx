"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"

import { cn } from "../../lib/utils"

import { type ToggleProps } from "./Toggle.types"
import { toggleVariants } from "./Toggle.variants"

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
