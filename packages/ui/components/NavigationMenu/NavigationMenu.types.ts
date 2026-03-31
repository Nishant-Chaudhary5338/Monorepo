/**
 * NavigationMenu component type definitions
 * @module NavigationMenu
 */

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"

/**
 * Props for the NavigationMenu component.
 * Wraps Radix UI NavigationMenu root.
 */
export type NavigationMenuProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>

/**
 * Props for the NavigationMenuList component.
 * Wraps Radix UI NavigationMenu list.
 */
export type NavigationMenuListProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>

/**
 * Props for the NavigationMenuItem component.
 * Wraps Radix UI NavigationMenu item.
 */
export type NavigationMenuItemProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>

/**
 * Props for the NavigationMenuTrigger component.
 * Wraps Radix UI NavigationMenu trigger.
 */
export type NavigationMenuTriggerProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>

/**
 * Props for the NavigationMenuContent component.
 * Wraps Radix UI NavigationMenu content.
 */
export type NavigationMenuContentProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>

/**
 * Props for the NavigationMenuLink component.
 * Wraps Radix UI NavigationMenu link.
 */
export type NavigationMenuLinkProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>

/**
 * Props for the NavigationMenuViewport component.
 * Wraps Radix UI NavigationMenu viewport.
 */
export type NavigationMenuViewportProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>

/**
 * Props for the NavigationMenuIndicator component.
 * Wraps Radix UI NavigationMenu indicator.
 */
export type NavigationMenuIndicatorProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>