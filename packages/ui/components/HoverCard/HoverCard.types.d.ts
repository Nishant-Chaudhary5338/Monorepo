/**
 * HoverCard component type definitions
 * @module HoverCard
 */
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
/**
 * Props for the HoverCard component.
 * Wraps Radix UI HoverCard root.
 */
export type HoverCardProps = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>;
/**
 * Props for the HoverCardTrigger component.
 * Wraps Radix UI HoverCard trigger.
 */
export type HoverCardTriggerProps = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>;
/**
 * Props for the HoverCardContent component.
 * Wraps Radix UI HoverCard content with alignment and offset options.
 */
export interface HoverCardContentProps extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
    /**
     * Alignment of the hover card relative to the trigger.
     * @default "center"
     */
    align?: "start" | "center" | "end";
    /**
     * Distance in pixels from the trigger.
     * @default 4
     */
    sideOffset?: number;
}
//# sourceMappingURL=HoverCard.types.d.ts.map