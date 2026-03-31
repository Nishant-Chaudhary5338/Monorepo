/**
 * Accordion component type definitions
 * @module Accordion
 */

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"

/**
 * Props for the Accordion root component.
 * Wraps Radix UI Accordion primitive.
 */
export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>

/**
 * Props for the AccordionItem component.
 * Each collapsible section within the accordion.
 */
export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

/**
 * Props for the AccordionTrigger component.
 * The clickable header that toggles the accordion content.
 */
export type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>

/**
 * Props for the AccordionContent component.
 * The collapsible content area.
 */
export type AccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>