# AGENTS.md — modern-ui Component Library

This repository is a React component library monorepo (`modern-ui`) built with Tailwind CSS v4, Radix UI primitives, and class-variance-authority (CVA). It ships 45 production-ready components under the `@repo/ui` package, styled with a shadcn/ui New York design system and full dark-mode support. Components follow a strict folder convention (one folder per component, each with `.tsx`, `.types.ts`, `.variants.ts`, `index.ts`, and `.docs.md`). The library is built with `tsup` and exports both ESM and CJS. Storybook is included for development and visual testing.

---

## Package Names and Installation

```bash
# Install from the monorepo workspace
pnpm add @repo/ui @repo/tailwind-config

# Or, if published to npm:
npm install @repo/ui @repo/tailwind-config
```

---

## Importing Components

All components are exported from the main barrel:

```tsx
import { Button, Input, Card, Badge, Dialog, DataTable } from '@repo/ui'
```

---

## Importing Styles

### Option A — Pre-built CSS (recommended for most apps)

```tsx
// In your app entry point (e.g. main.tsx or layout.tsx)
import '@repo/ui/styles.css'
```

### Option B — Tailwind v4 via PostCSS / CSS import

```css
/* In your global CSS file */
@import '@repo/tailwind-config';
```

This gives you all design tokens as CSS custom properties (`--background`, `--primary`, `--radius`, etc.) plus the Tailwind v4 base layer.

---

## Importing `cn()`

`cn()` merges Tailwind class names intelligently (clsx + tailwind-merge):

```tsx
import { cn } from '@repo/ui/lib/utils'

// Example usage
<div className={cn('rounded-md p-4', isActive && 'bg-primary text-primary-foreground')} />
```

---

## Tailwind v4 Setup

1. Install `tailwindcss` v4 and `@tailwindcss/postcss`.
2. In your CSS entry file, import the config package:

```css
@import '@repo/tailwind-config';
/* then your own styles */
```

3. In `postcss.config.js`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

The config exposes CSS custom properties for all design tokens. You can override them in your own `:root {}` block after the import.

---

## Component List (45 components)

| Component | Description |
|-----------|-------------|
| **Accordion** | Vertically stacked collapsible sections, single or multiple open at once |
| **Alert** | Callout banner for informational or destructive messages with optional icon |
| **AspectRatio** | Constrains child content to a specific aspect ratio (e.g. 16/9, 1/1) |
| **AutoForm** | Auto-generates a form UI from a Zod schema using react-hook-form |
| **Avatar** | Circular user avatar with image, fallback text, size and shape variants |
| **Badge** | Small inline label for status, categories, or counts |
| **Breadcrumb** | Hierarchical navigation trail with separator and ellipsis support |
| **Button** | Versatile action button with 6 variants, 4 sizes, and `asChild` composition |
| **Calendar** | Date picker calendar built on react-day-picker |
| **Card** | Container surface with Header, Title, Description, Content, and Footer slots |
| **Checkbox** | Accessible checkbox with indeterminate state support |
| **Collapsible** | Simple show/hide container with trigger and content |
| **Command** | Searchable command palette / combobox powered by cmdk |
| **ContextMenu** | Right-click context menu with nested sub-menus |
| **DataTable** | Feature-rich data table: sorting, filtering, pagination, RBAC, inline editing, export |
| **DesignSystem** | Design token reference and visual documentation page |
| **Dialog** | Modal dialog with overlay, close button, header, footer, and title slots |
| **Drawer** | Slide-in side/bottom panel built on Vaul |
| **DropdownMenu** | Dropdown menu with items, separators, checkboxes, and radio groups |
| **Form** | react-hook-form wrapper with field, label, control, description, and message slots |
| **HoverCard** | Floating card shown on hover, useful for user preview cards |
| **Input** | Text input with size variants, error/success states, and start/end icon slots |
| **InputOTP** | One-time password input with slot-based entry and separator support |
| **Label** | Accessible form label with size variants, built on Radix Label |
| **Menubar** | Horizontal application menu bar with nested sub-menus |
| **NavigationMenu** | Horizontal navigation with flyout sub-menus and viewport animation |
| **Pagination** | Page navigation with previous/next, page links, and ellipsis |
| **Popover** | Floating panel anchored to a trigger, for inline forms or detail views |
| **Progress** | Linear progress bar with value, color variants, and sizes |
| **RadioGroup** | Accessible radio button group for single-choice selection |
| **ScrollArea** | Custom-styled scrollable container with visible scrollbar |
| **Select** | Accessible dropdown select with groups, labels, and separator |
| **Separator** | Horizontal or vertical divider line |
| **Sheet** | Drawer-style panel that slides from any edge (top/right/bottom/left) |
| **Skeleton** | Loading placeholder with pulse or shimmer animation, multiple shape variants |
| **Slider** | Range slider with single or multi-thumb support and size variants |
| **Sonner** | Toast notification provider built on the Sonner library |
| **Switch** | Toggle switch (on/off) with size variants |
| **Table** | Semantic HTML table with styled Header, Body, Footer, Row, Head, Cell, Caption |
| **Tabs** | Tabbed content panels with list and trigger variants |
| **Textarea** | Multi-line text input with resize control and size variants |
| **Toggle** | Pressable toggle button for on/off state, with variants |
| **ToggleGroup** | Group of toggle buttons with single or multiple selection |
| **Tooltip** | Accessible tooltip shown on focus/hover, with side and alignment options |

---

## Common Patterns

### Forms with react-hook-form + Zod

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@repo/ui'
import { Input } from '@repo/ui'
import { Button } from '@repo/ui'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginForm() {
  const form = useForm({ resolver: zodResolver(schema) })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  )
}
```

### Tables with DataTable

```tsx
import { DataTable } from '@repo/ui'
import type { ColumnDef } from '@tanstack/react-table'

type User = { id: string; name: string; email: string; role: string }

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
]

function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      features={{ sorting: true, filtering: true, pagination: true, exportCsv: true }}
    />
  )
}
```

### Component Variants with CVA

All variant-based components expose their CVA variant function for direct class generation:

```tsx
import { buttonVariants } from '@repo/ui'
import { cn } from '@repo/ui/lib/utils'

// Use variant classes on a custom element (e.g. a Next.js Link)
<Link className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} href="/about">
  About
</Link>
```

---

## Quick Code Examples

### Button

```tsx
import { Button } from '@repo/ui'

// Variants: default | destructive | outline | secondary | ghost | link
// Sizes: default | sm | lg | icon

<Button variant="default">Save Changes</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" asChild>
  <a href="/docs">Read the docs</a>
</Button>
```

### Input

```tsx
import { Input } from '@repo/ui'
import { Search } from 'lucide-react'

<Input placeholder="Search..." />
<Input type="email" inputSize="lg" placeholder="you@example.com" />
<Input startIcon={<Search className="h-4 w-4" />} placeholder="Search" />
<Input error placeholder="Invalid value" />
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@repo/ui'
import { Button } from '@repo/ui'

<Card className="w-[380px]">
  <CardHeader>
    <CardTitle>Project Setup</CardTitle>
    <CardDescription>Deploy your new project in one click.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your project will be live in seconds.</p>
  </CardContent>
  <CardFooter>
    <Button>Deploy</Button>
  </CardFooter>
</Card>
```

### Form

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@repo/ui'
import { Input } from '@repo/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ username: z.string().min(2).max(50) })

function ProfileForm() {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { username: '' } })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input placeholder="johndoe" {...field} /></FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

### DataTable

```tsx
import { DataTable } from '@repo/ui'
import type { ColumnDef } from '@tanstack/react-table'

type Invoice = { id: string; amount: number; status: 'paid' | 'pending'; customer: string }

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'amount', header: 'Amount', meta: { align: 'right' } },
]

<DataTable
  columns={columns}
  data={invoices}
  features={{
    sorting: true,
    globalFilter: true,
    pagination: true,
    columnVisibility: true,
    exportCsv: true,
    density: true,
    rowSelection: true,
  }}
  paginationOptions={{ pageSize: 20, pageSizeOptions: [10, 20, 50] }}
  emptyMessage="No invoices found."
/>
```
