/**
 * DropdownMenu component type definitions
 * @module DropdownMenu
 */
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
/**
 * Props for the DropdownMenu component.
 * Wraps Radix UI DropdownMenu root.
 */
export type DropdownMenuProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>;
/**
 * Props for the DropdownMenuTrigger component.
 * Wraps Radix UI DropdownMenu trigger.
 */
export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>;
/**
 * Props for the DropdownMenuGroup component.
 * Wraps Radix UI DropdownMenu group.
 */
export type DropdownMenuGroupProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>;
/**
 * Props for the DropdownMenuPortal component.
 * Wraps Radix UI DropdownMenu portal.
 */
export type DropdownMenuPortalProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Portal>;
/**
 * Props for the DropdownMenuSub component.
 * Wraps Radix UI DropdownMenu sub.
 */
export type DropdownMenuSubProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>;
/**
 * Props for the DropdownMenuRadioGroup component.
 * Wraps Radix UI DropdownMenu radio group.
 */
export type DropdownMenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup>;
/**
 * Props for the DropdownMenuSubTrigger component.
 * Extends Radix UI DropdownMenu sub trigger with inset option.
 */
export interface DropdownMenuSubTriggerProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> {
    /**
     * Whether to add left padding for icon alignment.
     * @default false
     */
    inset?: boolean;
}
/**
 * Props for the DropdownMenuSubContent component.
 * Wraps Radix UI DropdownMenu sub content.
 */
export type DropdownMenuSubContentProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>;
/**
 * Props for the DropdownMenuContent component.
 * Wraps Radix UI DropdownMenu content.
 */
export type DropdownMenuContentProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>;
/**
 * Props for the DropdownMenuItem component.
 * Extends Radix UI DropdownMenu item with inset option.
 */
export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
    /**
     * Whether to add left padding for icon alignment.
     * @default false
     */
    inset?: boolean;
}
/**
 * Props for the DropdownMenuCheckboxItem component.
 * Wraps Radix UI DropdownMenu checkbox item.
 */
export type DropdownMenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>;
/**
 * Props for the DropdownMenuRadioItem component.
 * Wraps Radix UI DropdownMenu radio item.
 */
export type DropdownMenuRadioItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>;
/**
 * Props for the DropdownMenuLabel component.
 * Extends Radix UI DropdownMenu label with inset option.
 */
export interface DropdownMenuLabelProps extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {
    /**
     * Whether to add left padding for icon alignment.
     * @default false
     */
    inset?: boolean;
}
/**
 * Props for the DropdownMenuSeparator component.
 * Wraps Radix UI DropdownMenu separator.
 */
export type DropdownMenuSeparatorProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>;
/**
 * Props for the DropdownMenuShortcut component.
 * Simple wrapper for keyboard shortcut display.
 */
export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
//# sourceMappingURL=DropdownMenu.types.d.ts.map