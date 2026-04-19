"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { sliderTrackVariants, sliderThumbVariants } from "./Slider.variants"

type SliderSize = "sm" | "default" | "lg"

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderTrackVariants> {
  size?: SliderSize
}

/**
 * Range slider for numeric input with single or multi-thumb support.
 *
 * @example
 * ```tsx
 * <Slider defaultValue={[50]} min={0} max={100} step={1} className="w-[60%]" />
 * // Range slider:
 * <Slider defaultValue={[20, 80]} min={0} max={100} />
 * ```
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, size, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className={cn("relative w-full grow overflow-hidden rounded-full bg-secondary", sliderTrackVariants({ size }))}>
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn(sliderThumbVariants({ size }))} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider, sliderTrackVariants, sliderThumbVariants }
