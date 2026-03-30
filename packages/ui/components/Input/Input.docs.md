# Input Component

## Description
A styled input component built with Tailwind CSS classes. Supports all native HTML input attributes.

## Exports
- `Input`
- `InputProps` type

## Usage

```tsx
import { Input } from '@repo/ui'

// Default usage
<Input placeholder="Enter text..." />

// With type
<Input type="email" placeholder="Enter your email" />

// Disabled
<Input disabled placeholder="Cannot edit" />

// With value
<Input value="pre-filled" onChange={handleChange} />

// With custom className
<Input className="border-red-500" placeholder="Error state" />
```

## Props
Accepts all standard HTML input attributes:
- `type` - Input type (text, email, password, number, etc.)
- `placeholder` - Placeholder text
- `disabled` - Disable the input
- `value` / `defaultValue` - Controlled/uncontrolled value
- `onChange` - Change handler
- `className` - Additional CSS classes

## Accessibility
- Uses native `<input>` element for semantic correctness
- Supports keyboard navigation natively
- Includes focus-visible styles with ring
- Disabled state with proper cursor and opacity

## Dependencies
- `clsx` - Conditional class names
- `tailwind-merge` - Tailwind class deduplication
