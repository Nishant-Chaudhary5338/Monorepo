/**
 * Menubar component type definitions
 * @module Menubar
 */

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"

/**
 * Props for the Menubar component.
 * Wraps Radix UI Menubar root.
 */
export type MenubarProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>

/**
 * Props for the MenubarMenu component.
 * Wraps Radix UI Menubar menu.
 */
export type MenubarMenuProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Menu>

/**
 * Props for the MenubarTrigger component.
 * Wraps Radix UI Menubar trigger.
 */
export type MenubarTriggerProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>

/**
 * Props for the MenubarGroup component.
 * Wraps Radix UI Menubar group.
 */
export type MenubarGroupProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Group>

/**
 * Props for the MenubarPortal component.
 * Wraps Radix UI Menubar portal.
 */
export type MenubarPortalProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Portal>

/**
 * Props for the MenubarSub component.
 * Wraps Radix UI Menubar sub.
 */
export type MenubarSubProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Sub>

/**
 * Props for the MenubarRadioGroup component.
 * Wraps Radix UI Menubar radio group.
 */
export type MenubarRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioGroup>

/**
 * Props for the MenubarSubTrigger component.
 * Extends Radix UI Menubar sub trigger with inset option.
 */
export interface MenubarSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> {
  /**
   * Whether to add left padding for icon alignment.
   * @default false
   */
  inset?: boolean
}

/**
 * Props for the MenubarSubContent component.
 * Wraps Radix UI Menubar sub content.
 */
export type MenubarSubContentProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>

/**
 * Props for the MenubarContent component.
 * Wraps Radix UI Menubar content with alignment and offset options.
 */
export interface MenubarContentProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> {
  /**
   * Alignment of the menubar content relative to the trigger.
   * @default "start"
   */
  align?: "start" | "center" | "end"
  /**
   * Offset from the alignment point.
   * @default -4
   */
  alignOffset?: number
  /**
   * Distance in pixels from the trigger.
   * @default 8
   */
  sideOffset?: number
}

/**
 * Props for the MenubarItem component.
 * Extends Radix UI Menubar item with inset option.
 */
export interface MenubarItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> {
  /**
   * Whether to add left padding for icon alignment.
   * @default false
   */
  inset?: boolean
}

/**
 * Props for the MenubarCheckboxItem component.
 * Wraps Radix UI Menubar checkbox item.
 */
export type MenubarCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>

/**
 * Props for the MenubarRadioItem component.
 * Wraps Radix UI Menubar radio item.
 */
export type MenubarRadioItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>

/**
 * Props for the MenubarLabel component.
 * Extends Radix UI Menubar label with inset option.
 */
export interface MenubarLabelProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> {
  /**
   * Whether to add left padding for icon alignment.
   * @default false
   */
  inset?: boolean
}

/**
 * Props for the MenubarSeparator component.
 * Wraps Radix UI Menubar separator.
 */
export type MenubarSeparatorProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>

/**
 * Props for the MenubarShortcut component.
 * Simple wrapper for keyboard shortcut display.
 */
export type MenubarShortcutProps = React.HTMLAttributes<HTMLSpanElement>