# @repo/ui

Production-grade React component library for internal engineering teams. Built on Radix UI + Tailwind CSS v4 with full TypeScript support.

## Quick Start

```bash
# Already in the monorepo — no install needed
# Import CSS once in your app entry (e.g. layout.tsx / main.tsx)
import "@repo/ui/styles.css"

# Then import components
import { Button, DataTable, AutoForm } from "@repo/ui"
```

## Component Count

43 components across 8 categories, all accessible, typed, and tree-shakeable.

| Category | Components |
|----------|-----------|
| Inputs & Forms | Button, Input, Textarea, Checkbox, Switch, Slider, RadioGroup, Select, InputOTP, Form, AutoForm |
| Data Display | DataTable, Table, Badge, Avatar, Skeleton, Progress, Card |
| Overlays | Dialog, Sheet, Drawer, Popover, HoverCard, Tooltip |
| Menus | DropdownMenu, ContextMenu, Menubar, Command (+ CommandDialog) |
| Navigation | Breadcrumb, Pagination, NavigationMenu, Tabs |
| Layout | Separator, AspectRatio, ScrollArea, Accordion, Collapsible |
| Feedback | Alert, Toaster (Sonner) |
| Controls | Toggle, ToggleGroup, Calendar |

## Storybook

```bash
pnpm --filter @repo/ui storybook
# Opens at http://localhost:6006
```

## Tests

```bash
pnpm --filter @repo/ui test          # single run
pnpm --filter @repo/ui test:watch    # watch mode
```

## Build

```bash
pnpm --filter @repo/ui build
# Outputs ESM + CJS + .d.ts declarations to dist/
```

## Generate a New Component

```bash
pnpm --filter @repo/ui component:generate --name=MyComponent
```

## Key Features

- **AutoForm** — generate a complete form from a Zod schema in one line
- **DataTable** — 20+ opt-in features: sorting, filtering, pagination, inline editing, RBAC, drag-to-reorder, export CSV/JSON, and more
- **RBAC** — column-level role-based access control built into DataTable
- **Full TypeScript** — every prop is typed with JSDoc examples
- **Zero config** — import CSS once, use anywhere

## See Also

- [CLAUDE.md](./CLAUDE.md) — Complete API reference, composition patterns, and agentic usage guide
- [Storybook stories](./components/) — Interactive examples for every component and feature
