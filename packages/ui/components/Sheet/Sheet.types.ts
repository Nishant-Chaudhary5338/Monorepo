/**
 * Sheet component type definitions
 * @module Sheet
 */

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { type VariantProps } from "class-variance-authority"

import { type sheetVariants } from "./Sheet.variants"

/**
 * Props for the Sheet component.
 * Wraps Radix UI Dialog root.
 */
export type SheetProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>

/**
 * Props for the SheetTrigger component.
 * Wraps Radix UI Dialog trigger.
 */
export type SheetTriggerProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>

/**
 * Props for the SheetClose component.
 * Wraps Radix UI Dialog close.
 */
export type SheetCloseProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close>

/**
 * Props for the SheetPortal component.
 * Wraps Radix UI Dialog portal.
 */
export type SheetPortalProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>

/**
 * Props for the SheetOverlay component.
 * Wraps Radix UI Dialog overlay with custom styling.
 */
export type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>

/**
 * Props for the SheetContent component.
 * Extends Radix UI Dialog content with side variant styling.
 * 
 * @example
 * ```tsx
 * <SheetContent side="left">Content</SheetContent>
 * ```
 */
export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

/**
 * Props for the SheetHeader component.
 * Simple wrapper for sheet header content.
 */
export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Props for the SheetFooter component.
 * Simple wrapper for sheet footer content.
 */
export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Props for the SheetTitle component.
 * Wraps Radix UI Dialog title.
 */
export type SheetTitleProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>

/**
 * Props for the SheetDescription component.
 * Wraps Radix UI Dialog description.
 */
export type SheetDescriptionProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>