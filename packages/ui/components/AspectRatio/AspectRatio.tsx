"use client"
import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

import type { AspectRatioProps } from "./AspectRatio.types"

/**
 * Constrains child content to a specific aspect ratio, preventing layout shift.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/hero.jpg" alt="Hero" className="h-full w-full object-cover" />
 * </AspectRatio>
 * ```
 */
const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
