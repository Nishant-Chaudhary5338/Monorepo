# Input Component

## Description
A input component built with shadcn/ui patterns using class-variance-authority for variants.

## Exports
- `Input`

## Props Interface
`InputProps`

## Variants
N/A

## Usage

```tsx
import { Input } from '@repo/ui'

// Default usage
<Input>Click me</Input>

// With variant
<Input variant="destructive">Delete</Input>

// With size
<Input size="lg">Large Button</Input>
```

## Accessibility
- Uses semantic HTML elements
- Supports keyboard navigation
- Includes focus-visible styles
- Proper ARIA attributes where needed

## Dependencies
- `class-variance-authority` - Variant management
- `@/lib/utils` - Class name merging utility (cn)

