# Badge Component

## Description

Small inline label for conveying status, categories, counts, or short metadata. Badges are non-interactive by default but can be made interactive with custom handlers.

## When to Use

- Display a status on a list item (e.g. "Active", "Draft", "Archived")
- Highlight new or beta features in a UI
- Show a count or notification number alongside an icon or heading

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline"` | `"default"` | Visual color variant |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Badge size |
| `className` | `string` | — | Additional Tailwind classes |

## Usage

```tsx
import { Badge } from '@repo/ui'

// Variants
<Badge>New</Badge>
<Badge variant="secondary">Beta</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

```tsx
// Inside a heading
<h2 className="flex items-center gap-2">
  Dashboard
  <Badge variant="secondary">Beta</Badge>
</h2>
```

```tsx
// Custom colors via className
<Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
```

## Exports
- `Badge`
- `badgeVariants` — CVA function to generate badge class names on arbitrary elements
