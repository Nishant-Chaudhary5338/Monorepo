/**
 * Command component type definitions
 * @module Command
 */
import type * as React from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import type { Command as CommandPrimitive } from "cmdk";
/**
 * Props for the Command root component.
 */
export type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive>;
/**
 * Props for the CommandDialog component.
 * Extends DialogProps from Radix UI.
 */
export interface CommandDialogProps extends DialogProps {
}
/**
 * Props for the CommandInput component.
 */
export type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;
/**
 * Props for the CommandList component.
 */
export type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>;
/**
 * Props for the CommandEmpty component.
 */
export type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;
/**
 * Props for the CommandGroup component.
 */
export type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>;
/**
 * Props for the CommandSeparator component.
 */
export type CommandSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>;
/**
 * Props for the CommandItem component.
 */
export type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;
/**
 * Props for the CommandShortcut component.
 */
export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
}
//# sourceMappingURL=Command.types.d.ts.map