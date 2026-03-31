/**
 * Avatar component type definitions
 * @module Avatar
 */
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
/**
 * Props for the Avatar root component.
 * Wraps Radix UI Avatar primitive.
 */
export type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;
/**
 * Props for the AvatarImage component.
 * The image element within the avatar.
 */
export type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;
/**
 * Props for the AvatarFallback component.
 * Fallback content displayed when the image fails to load.
 */
export type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;
//# sourceMappingURL=Avatar.types.d.ts.map