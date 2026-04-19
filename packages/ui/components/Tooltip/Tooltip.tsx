"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { tooltipContentVariants } from "./Tooltip.variants"
import type { TooltipProps } from "./Tooltip.types"

const TooltipProvider = TooltipPrimitive.Provider

/**
 * Accessible tooltip shown on focus or hover. Wrap your app in TooltipProvider once.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger asChild><Button size="icon"><InfoIcon /></Button></TooltipTrigger>
 *     <TooltipContent><p>More information</p></TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipProps & VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentVariants({ variant }), className)}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, tooltipContentVariants }
