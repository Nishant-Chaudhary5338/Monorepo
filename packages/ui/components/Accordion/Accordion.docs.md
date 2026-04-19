# Accordion Component

## Description

Vertically stacked collapsible sections. Supports single (one open at a time) or multiple (any number open) mode. Built on Radix UI Accordion with smooth open/close animation.

## When to Use

- FAQ sections where you want to show one answer at a time
- Settings panels with grouped options
- Sidebar navigation with collapsible sub-sections

## Props

### Accordion (root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"single" \| "multiple"` | required | Allow one or many open items simultaneously |
| `collapsible` | `boolean` | `false` | Allow closing all items when `type="single"` |
| `defaultValue` | `string \| string[]` | — | Initially open item(s) (uncontrolled) |
| `value` | `string \| string[]` | — | Controlled open item(s) |
| `onValueChange` | `(value) => void` | — | Called when open items change |

### AccordionItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Unique identifier for this section |
| `disabled` | `boolean` | `false` | Prevent this item from opening |

## Usage

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui'

// Single open item (collapses others)
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>What is @repo/ui?</AccordionTrigger>
    <AccordionContent>
      A React component library built on Radix UI and Tailwind CSS.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>How do I install it?</AccordionTrigger>
    <AccordionContent>
      Run <code>pnpm add @repo/ui</code> and import the styles.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It follows WAI-ARIA Accordion patterns.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

```tsx
// Multiple items open simultaneously
<Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content for section 2.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Section 3</AccordionTrigger>
    <AccordionContent>Content for section 3.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Exports
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
