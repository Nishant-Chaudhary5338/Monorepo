"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Simple show/hide container with an animated trigger and content area.
 *
 * @example
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger asChild><Button variant="ghost">Toggle</Button></CollapsibleTrigger>
 *   <CollapsibleContent><p>Hidden content</p></CollapsibleContent>
 * </Collapsible>
 * ```
 */
const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
