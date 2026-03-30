# Button Component

## Description
A button component built with shadcn/ui patterns using class-variance-authority for variants.

## Exports
- `Button`
- `buttonVariants`

## Props Interface
`ButtonProps` - extends `React.ButtonHTMLAttributes<HTMLButtonElement>` with:
- `variant` - Button style variant (default, destructive, outline, secondary, ghost, link)
- `size` - Button size (default, sm, lg, icon)
- `asChild` - Render as child element (polymorphic)
- `className` - Additional CSS classes

## Usage

```tsx
import { Button } from '@repo/ui'

// Default usage
<Button>Click me</Button>

// With variant
<Button variant="destructive">Delete</Button>

// With size
<Button size="lg">Large Button</Button>

// Icon button
<Button size="icon" aria-label="Close">X</Button>

// As child (polymorphic)
<Button asChild><a href="/link">Link Button</a></Button>

// Disabled
<Button disabled>Cannot click</Button>
```

## Accessibility
- Uses semantic `<button>` element
- Supports keyboard navigation (Enter/Space)
- Includes focus-visible styles with ring
- Disabled state with proper pointer-events and opacity
- Polymorphic support via `asChild` prop

## Dependencies
- `class-variance-authority` - Variant management
- `@radix-ui/react-slot` - Polymorphic component support
