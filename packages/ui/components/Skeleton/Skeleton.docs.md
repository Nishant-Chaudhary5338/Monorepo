# Skeleton Component

## Description

Loading placeholder with animated fill. Prevents layout shift during async content loads by occupying the space a real element will occupy. Supports pulse and shimmer animations and several shape presets.

## When to Use

- While fetching data from an API before content is ready to display
- Placeholder cards, text lines, avatars in list views
- Replacing individual elements (images, headings) to prevent jank

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "text" \| "circle" \| "rect" \| "card"` | `"default"` | Shape preset |
| `animate` | `"pulse" \| "shimmer" \| "none"` | `"pulse"` | Animation style |
| `className` | `string` | — | Override or set width/height with Tailwind classes |

## Usage

```tsx
import { Skeleton } from '@repo/ui'

// Text line placeholders
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
  <Skeleton className="h-4 w-[180px]" />
</div>
```

```tsx
// Profile card placeholder
<div className="flex items-center space-x-4">
  <Skeleton variant="circle" className="h-12 w-12" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[150px]" />
  </div>
</div>
```

```tsx
// Card grid placeholder
<div className="grid grid-cols-3 gap-4">
  {[1, 2, 3].map((i) => (
    <div key={i} className="space-y-3">
      <Skeleton variant="rect" className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ))}
</div>
```

```tsx
// Shimmer animation
<Skeleton animate="shimmer" className="h-8 w-full" />
```

## Exports
- `Skeleton`
