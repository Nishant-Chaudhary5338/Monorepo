# Card Component

## Description

A surface container component with composable slots for header, title, description, content, and footer. Cards visually group related content and can contain any combination of sub-components.

## When to Use

- Grouping a form with a title and submit button
- Displaying a list of items with consistent visual framing
- Creating dashboard widgets with a header and body

## Props

### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render child element as the card |
| `className` | `string` | — | Additional CSS classes |

### CardTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"` | Heading level to render |

All other sub-components (`CardHeader`, `CardDescription`, `CardContent`, `CardFooter`) accept standard `div` or `p` HTML attributes.

## Usage

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@repo/ui'
import { Button } from '@repo/ui'

<Card className="w-[380px]">
  <CardHeader>
    <CardTitle>Account settings</CardTitle>
    <CardDescription>Manage your account preferences.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Update your name, email, or password here.</p>
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

```tsx
// Simple card without header
<Card className="p-6">
  <p className="text-muted-foreground">Quick note or widget content.</p>
</Card>
```

```tsx
// Card as a link using asChild
import { Card } from '@repo/ui'

<Card asChild>
  <a href="/product/123" className="block hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <p className="font-medium">Product Name</p>
    </CardContent>
  </a>
</Card>
```

## Exports
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
