/**
 * Drawer component type definitions
 * @module Drawer
 */
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
/**
 * Props for the Drawer component.
 * Wraps Vaul Drawer root with scale background option.
 */
export type DrawerProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root> & {
    /**
     * Whether to scale the background when drawer is open.
     * @default true
     */
    shouldScaleBackground?: boolean;
};
/**
 * Props for the DrawerTrigger component.
 * Wraps Vaul Drawer trigger.
 */
export type DrawerTriggerProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>;
/**
 * Props for the DrawerPortal component.
 * Wraps Vaul Drawer portal.
 */
export type DrawerPortalProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Portal>;
/**
 * Props for the DrawerClose component.
 * Wraps Vaul Drawer close.
 */
export type DrawerCloseProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>;
/**
 * Props for the DrawerOverlay component.
 * Wraps Vaul Drawer overlay with custom styling.
 */
export type DrawerOverlayProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>;
/**
 * Props for the DrawerContent component.
 * Wraps Vaul Drawer content with custom styling.
 */
export type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>;
/**
 * Props for the DrawerHeader component.
 * Simple wrapper for drawer header content.
 */
export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;
/**
 * Props for the DrawerFooter component.
 * Simple wrapper for drawer footer content.
 */
export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;
/**
 * Props for the DrawerTitle component.
 * Wraps Vaul Drawer title.
 */
export type DrawerTitleProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>;
/**
 * Props for the DrawerDescription component.
 * Wraps Vaul Drawer description.
 */
export type DrawerDescriptionProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>;
//# sourceMappingURL=Drawer.types.d.ts.map