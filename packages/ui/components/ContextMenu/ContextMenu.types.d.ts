/**
 * ContextMenu component type definitions
 * @module ContextMenu
 */
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
/**
 * Props for the ContextMenu component.
 * Wraps Radix UI ContextMenu root.
 */
export type ContextMenuProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>;
/**
 * Props for the ContextMenuTrigger component.
 * Wraps Radix UI ContextMenu trigger.
 */
export type ContextMenuTriggerProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>;
/**
 * Props for the ContextMenuGroup component.
 * Wraps Radix UI ContextMenu group.
 */
export type ContextMenuGroupProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Group>;
/**
 * Props for the ContextMenuPortal component.
 * Wraps Radix UI ContextMenu portal.
 */
export type ContextMenuPortalProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Portal>;
/**
 * Props for the ContextMenuSub component.
 * Wraps Radix UI ContextMenu sub.
 */
export type ContextMenuSubProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Sub>;
/**
 * Props for the ContextMenuRadioGroup component.
 * Wraps Radix UI ContextMenu radio group.
 */
export type ContextMenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioGroup>;
/**
 * Props for the ContextMenuSubTrigger component.
 * Extends Radix UI ContextMenu sub trigger with inset option.
 */
export interface ContextMenuSubTriggerProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> {
    /**
     * Whether to add left padding for icon alignment.
     * @default false
     */
    inset?: boolean;
}
/**
 * Props for the ContextMenuSubContent component.
 * Wraps Radix UI ContextMenu sub content.
 */
export type ContextMenuSubContentProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>;
/**
 * Props for the ContextMenuContent component.
 * Wraps Radix UI ContextMenu content.
 */
export type ContextMenuContentProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>;
/**
 * Props for the ContextMenuItem component.
 * Extends Radix UI ContextMenu item with inset option.
 */
export interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
    /**
     * Whether to add left padding for icon alignment.
     * @default false
     */
    inset?: boolean;
}
/**
 * Props for the ContextMenuCheckboxItem component.
 * Wraps Radix UI ContextMenu checkbox item.
 */
export type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>;
/**
 * Props for the ContextMenuRadioItem component.
 * Wraps Radix UI ContextMenu radio item.
 */
export type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>;
/**
 * Props for the ContextMenuLabel component.
 * Extends Radix UI ContextMenu label with inset option.
 */
export interface ContextMenuLabelProps extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> {
    /**
     * Whether to add left padding for icon alignment.
     * @default false
     */
    inset?: boolean;
}
/**
 * Props for the ContextMenuSeparator component.
 * Wraps Radix UI ContextMenu separator.
 */
export type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>;
/**
 * Props for the ContextMenuShortcut component.
 * Simple wrapper for keyboard shortcut display.
 */
export type ContextMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
//# sourceMappingURL=ContextMenu.types.d.ts.map