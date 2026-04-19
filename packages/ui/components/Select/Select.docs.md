# Select Component

## Description

Accessible dropdown select built on Radix UI Select. Supports option groups, labels, separators, and controlled/uncontrolled modes. Keyboard navigable and screen-reader friendly.

## When to Use

- Choosing one option from a list of 5+ items where radio buttons would take too much space
- Country, timezone, or category selectors
- Filter dropdowns where the selected label must be visible at all times

## Props

### Select (root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled selected value |
| `defaultValue` | `string` | — | Initially selected value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | — | Called when selection changes |
| `disabled` | `boolean` | `false` | Disable the entire select |
| `required` | `boolean` | `false` | Mark as required for form validation |

### SelectContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"item-aligned" \| "popper"` | `"popper"` | Positioning strategy |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred opening side |
| `sideOffset` | `number` | `4` | Distance from trigger in px |

### SelectItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Value submitted when this item is selected |
| `disabled` | `boolean` | `false` | Disable this option |

## Usage

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@repo/ui'

<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select a framework" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="react">React</SelectItem>
    <SelectItem value="vue">Vue</SelectItem>
    <SelectItem value="svelte">Svelte</SelectItem>
    <SelectItem value="angular" disabled>Angular (coming soon)</SelectItem>
  </SelectContent>
</Select>
```

```tsx
// With groups and labels
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectSeparator } from '@repo/ui'

<Select>
  <SelectTrigger className="w-[220px]">
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern Standard Time</SelectItem>
      <SelectItem value="cst">Central Standard Time</SelectItem>
      <SelectItem value="pst">Pacific Standard Time</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
      <SelectItem value="cet">Central European Time</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

```tsx
// Controlled select
const [value, setValue] = React.useState('')

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Choose role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="editor">Editor</SelectItem>
    <SelectItem value="viewer">Viewer</SelectItem>
  </SelectContent>
</Select>
```

## Exports
- `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`
- `SelectLabel`, `SelectItem`, `SelectSeparator`
- `SelectScrollUpButton`, `SelectScrollDownButton`
