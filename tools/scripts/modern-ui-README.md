# modern-ui

Production-grade React component library. 43 accessible, typed, and tree-shakeable components built on Radix UI + Tailwind CSS v4.

Designed for internal engineering teams who want shadcn/ui quality without the copy-paste setup — import once, use everywhere.

## Components

| Category | Components |
|---|---|
| Inputs & Forms | Button, Input, Textarea, Checkbox, Switch, Slider, RadioGroup, Select, InputOTP, Form, **AutoForm** |
| Data Display | **DataTable**, Table, Badge, Avatar, Skeleton, Progress, Card |
| Overlays | Dialog, Sheet, Drawer, Popover, HoverCard, Tooltip |
| Menus | DropdownMenu, ContextMenu, Menubar, Command + CommandDialog |
| Navigation | Breadcrumb, Pagination, NavigationMenu, Tabs |
| Layout | Separator, AspectRatio, ScrollArea, Accordion, Collapsible |
| Feedback | Alert, Toaster |
| Controls | Toggle, ToggleGroup, Calendar |

## Highlights

**AutoForm** — generate a complete, validated form from a Zod schema in one line:

```tsx
import { AutoForm } from '@repo/ui'
import { z } from 'zod'

const schema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  role:  z.enum(['admin', 'editor', 'viewer']),
})

<AutoForm schema={schema} onSubmit={save} submitText="Save" />
```

**DataTable** — 20+ opt-in features: sorting, filtering, pagination, drag-to-reorder, inline editing, column-level RBAC, CSV/JSON export:

```tsx
import { DataTable } from '@repo/ui'
import type { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'role',
    header: 'Role',
    meta: {
      editable: true,
      editType: 'select',
      editOptions: ['admin', 'editor', 'viewer'],
      roles: ['admin', 'hr'],
    },
  },
]

<DataTable
  columns={columns}
  data={users}
  getRowId={(r) => r.id}
  rbac={{ userRole: currentUser.role }}
  features={{ sorting: true, filtering: true, pagination: true, editableCells: true, exportCsv: true }}
/>
```

## Quick start

```sh
# add to your workspace
pnpm add @repo/ui

# import CSS once at app root
import '@repo/ui/styles.css'

# import components
import { Button, DataTable, AutoForm } from '@repo/ui'
```

## Storybook

```sh
pnpm storybook
# opens at http://localhost:6006
```

Every component has stories, a full API reference, and examples.

## Development

```sh
pnpm install
pnpm build        # compile packages
pnpm storybook    # interactive docs
pnpm test         # vitest
pnpm typecheck    # tsc --noEmit
```

## Structure

```
packages/
  ui/              43 components — Radix UI + Tailwind CSS v4 + TypeScript strict
  tailwind-config/ Shared Tailwind config and PostCSS setup
```

## License

MIT
