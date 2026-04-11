# Button Component

## Description
A button component built with shadcn/ui patterns using class-variance-authority for variants.

## Exports
- `Button`
- `buttonVariants`

## Props Interface
`ButtonProps`

## Variants
default, destructive, outline, secondary, ghost, link

## Usage

```tsx
import { Button } from '@repo/ui'

// Default usage
<Button>Click me</Button>

// With variant
<Button variant="destructive">Delete</Button>

// With size
<Button size="lg">Large Button</Button>
```

## Accessibility
- Uses semantic HTML elements
- Supports keyboard navigation
- Includes focus-visible styles
- Proper ARIA attributes where needed

## Dependencies
- `class-variance-authority` - Variant management
- `@/lib/utils` - Class name merging utility (cn)
- `@radix-ui/react-slot` - Polymorphic component support
