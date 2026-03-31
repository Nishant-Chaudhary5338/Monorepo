/**
 * Button component library for @repo/ui
 * 
 * @module Button
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Props for the Button component.
 * Extends native button attributes with variant styling options.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">Click me</Button>
 * ```
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the component will render its child as the button element.
   * Useful for composing with other components like Link.
   * 
   * @default false
   * @example
   * ```tsx
   * <Button asChild>
   *   <a href="/about">About</a>
   * </Button>
   * ```
   */
  asChild?: boolean
}

/**
 * A versatile button component with multiple variants and sizes.
 * 
 * Features:
 * - 6 visual variants: default, destructive, outline, secondary, ghost, link
 * - 4 size options: default, sm, lg, icon
 * - Polymorphic rendering with `asChild` prop
 * - Full accessibility support with focus-visible states
 * - Icon integration with automatic sizing
 * 
 * @component
 * @example
 * ```tsx
 * // Primary action button
 * <Button variant="default">Save Changes</Button>
 * 
 * // Destructive action
 * <Button variant="destructive">Delete</Button>
 * 
 * // Outline style
 * <Button variant="outline">Cancel</Button>
 * 
 * // Icon button
 * <Button variant="ghost" size="icon">
 *   <SettingsIcon />
 * </Button>
 * 
 * // As a link
 * <Button asChild>
 *   <a href="/dashboard">Go to Dashboard</a>
 * </Button>
 * ```
 * 
 * @param {ButtonProps} props - The component props
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref
 * @returns {JSX.Element} The rendered button element
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
