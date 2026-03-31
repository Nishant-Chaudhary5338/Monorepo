/**
 * Popover component type definitions
 * @module Popover
 */
import type * as React from "react";
import type * as PopoverPrimitive from "@radix-ui/react-popover";
/**
 * Props for the Popover root component.
 */
export type PopoverProps = PopoverPrimitive.PopoverProps;
/**
 * Props for the PopoverTrigger component.
 */
export type PopoverTriggerProps = PopoverPrimitive.PopoverTriggerProps;
/**
 * Props for the PopoverContent component.
 */
export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
}
//# sourceMappingURL=Popover.types.d.ts.map