# Input Component

## Description

A styled text input with size variants, error/success states, and optional start/end icon slots. Extends all native HTML input attributes. Built with CVA for consistent variant handling.

## When to Use

- Any text, email, password, number, or search field in a form
- Inputs with icons (search bar, currency field, password reveal)
- Validated form fields that need visual error/success feedback

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"text" \| "email" \| "password" \| "number" \| "tel" \| "url" \| "search" \| "date" \| ...` | `"text"` | HTML input type |
| `inputSize` | `"sm" \| "default" \| "lg"` | `"default"` | Size variant |
| `error` | `boolean` | `false` | Display error state (red border/ring) |
| `success` | `boolean` | `false` | Display success state (green border/ring) |
| `startIcon` | `ReactNode` | — | Icon rendered on the left inside the input |
| `endIcon` | `ReactNode` | — | Icon rendered on the right inside the input |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disable interaction |
| `className` | `string` | — | Additional Tailwind classes |

All other native `<input>` attributes (`value`, `onChange`, `onBlur`, `ref`, etc.) are also supported.

## Usage

```tsx
import { Input } from '@repo/ui'

// Basic usage
<Input placeholder="Enter your name" />
<Input type="email" placeholder="you@example.com" />
<Input type="password" placeholder="Password" />
```

```tsx
// Size variants
<Input inputSize="sm" placeholder="Small" />
<Input inputSize="default" placeholder="Default" />
<Input inputSize="lg" placeholder="Large" />
```

```tsx
// With icons
import { Search, Mail, Eye } from 'lucide-react'

<Input startIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
<Input startIcon={<Mail className="h-4 w-4" />} type="email" placeholder="Email" />
<Input endIcon={<Eye className="h-4 w-4 cursor-pointer" />} type="password" placeholder="Password" />
```

```tsx
// Validation states
<Input error placeholder="This field is required" />
<Input success placeholder="Valid input" />
```

```tsx
// Controlled input with react-hook-form
<FormField
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input
          type="email"
          placeholder="you@example.com"
          error={!!fieldState.error}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Exports
- `Input`
