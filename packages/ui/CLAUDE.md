# @repo/ui — Component Library Reference

Production-grade React component library built on Radix UI + Tailwind CSS v4.
All components are fully typed, accessible (WCAG 2.1 AA), and tree-shakeable.

## Installation & Setup

```tsx
// 1. Import CSS once at app root (e.g. layout.tsx or main.tsx)
import "@repo/ui/styles.css"

// 2. Import components from the package
import { Button, DataTable, AutoForm } from "@repo/ui"
```

---

## Component Map

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `Button` | Action trigger | `variant`, `size`, `asChild`, `disabled` |
| `Input` | Text input | `type`, `size`, `error`, `success`, `startIcon`, `endIcon` |
| `Textarea` | Multi-line text | `rows`, `resize` |
| `Label` | Form field label | `htmlFor` |
| `Checkbox` | Boolean toggle (box) | `checked`, `onCheckedChange`, `disabled` |
| `Switch` | Boolean toggle (pill) | `checked`, `onCheckedChange`, `disabled` |
| `Slider` | Range input | `min`, `max`, `step`, `value`, `onValueChange` |
| `RadioGroup` + `RadioGroupItem` | Single-choice group | `value`, `onValueChange` |
| `Select` + `SelectTrigger` + `SelectContent` + `SelectItem` | Dropdown picker | `value`, `onValueChange` |
| `Form` + `FormField` + `FormItem` + `FormLabel` + `FormControl` + `FormDescription` + `FormMessage` | React Hook Form wrapper | See Composition Patterns |
| `AutoForm` | Schema-driven form from Zod | `schema`, `onSubmit`, `fieldConfig`, `include`, `exclude`, `order` |
| `InputOTP` | One-time password input | `maxLength`, `value`, `onChange` |
| `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter` | Content container | `className` |
| `Badge` | Status/tag label | `variant` (`default`, `secondary`, `destructive`, `outline`) |
| `Avatar` + `AvatarImage` + `AvatarFallback` | User avatar | `src`, `alt` |
| `Alert` + `AlertTitle` + `AlertDescription` | Inline notification | `variant` (`default`, `destructive`) |
| `Skeleton` | Loading placeholder | `className` for dimensions |
| `Progress` | Progress bar | `value` (0–100) |
| `Table` + sub-components | Static HTML table | Standard table semantics |
| `DataTable` | Full-featured interactive table | `columns`, `data`, `features`, `rbac` |
| `Separator` | Visual divider | `orientation` (`horizontal`/`vertical`) |
| `AspectRatio` | Fixed aspect ratio box | `ratio` |
| `ScrollArea` | Custom scrollbar | `className` for dimensions |
| `Dialog` + `DialogTrigger` + `DialogContent` + `DialogHeader` + `DialogTitle` + `DialogDescription` + `DialogFooter` | Modal dialog | `open`, `onOpenChange` |
| `Sheet` + `SheetTrigger` + `SheetContent` | Side panel / drawer | `side` (`top`/`right`/`bottom`/`left`) |
| `Drawer` | Mobile-friendly bottom sheet (vaul) | `open`, `onOpenChange` |
| `Popover` + `PopoverTrigger` + `PopoverContent` | Floating panel | `side`, `align` |
| `HoverCard` + `HoverCardTrigger` + `HoverCardContent` | Hover tooltip card | `openDelay`, `closeDelay` |
| `Tooltip` + `TooltipProvider` + `TooltipTrigger` + `TooltipContent` | Simple hover tooltip | `side`, `delayDuration` |
| `DropdownMenu` + sub-components | Dropdown menu | `open`, `onOpenChange` |
| `ContextMenu` + sub-components | Right-click menu | Same API as DropdownMenu |
| `Menubar` + sub-components | Top-level menu bar | Horizontal nav |
| `NavigationMenu` + sub-components | Site navigation | Horizontal with dropdowns |
| `Command` + `CommandDialog` + `CommandInput` + `CommandList` + `CommandGroup` + `CommandItem` | Command palette | `open`, `onOpenChange` (for Dialog) |
| `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent` | Tab panels | `value`, `onValueChange` |
| `Accordion` + `AccordionItem` + `AccordionTrigger` + `AccordionContent` | Expandable sections | `type` (`single`/`multiple`) |
| `Collapsible` + `CollapsibleTrigger` + `CollapsibleContent` | Single expand/collapse | `open`, `onOpenChange` |
| `Toggle` | On/off button | `pressed`, `onPressedChange`, `variant` |
| `ToggleGroup` + `ToggleGroupItem` | Multi-option toggle | `type` (`single`/`multiple`) |
| `Breadcrumb` + sub-components | Navigation path | Standard breadcrumb |
| `Pagination` + sub-components | Page navigation | Standard pagination |
| `Calendar` | Date picker calendar | `mode`, `selected`, `onSelect` |
| `Toaster` | Toast notification host | Add once to layout root |
| `Sonner` | (re-export) Call `toast()` from `sonner` | |

---

## Composition Patterns

### 1. Form with Zod Validation (all field types)

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form, FormField, FormItem, FormLabel, FormControl,
  FormDescription, FormMessage,
  Input, Textarea, Checkbox, Switch, Button,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  RadioGroup, RadioGroupItem,
} from "@repo/ui"

const schema = z.object({
  name:     z.string().min(2, "Min 2 chars"),
  email:    z.string().email("Invalid email"),
  bio:      z.string().optional(),
  role:     z.enum(["admin", "editor", "viewer"]),
  theme:    z.enum(["light", "dark", "system"]),
  terms:    z.boolean().refine(Boolean, "Must accept"),
  notifs:   z.boolean(),
})

function MyForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", bio: "", role: "editor", theme: "system", terms: false, notifs: true },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-6">

        {/* Text */}
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input placeholder="Alice" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Email */}
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" placeholder="alice@corp.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Textarea */}
        <FormField control={form.control} name="bio" render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl><Textarea rows={3} {...field} /></FormControl>
            <FormDescription>Optional. 300 chars max.</FormDescription>
          </FormItem>
        )} />

        {/* Select */}
        <FormField control={form.control} name="role" render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* RadioGroup */}
        <FormField control={form.control} name="theme" render={({ field }) => (
          <FormItem>
            <FormLabel>Theme</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                {(["light", "dark", "system"] as const).map((t) => (
                  <FormItem key={t} className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value={t} /></FormControl>
                    <FormLabel className="font-normal capitalize">{t}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Checkbox */}
        <FormField control={form.control} name="terms" render={({ field }) => (
          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <div><FormLabel>Accept terms</FormLabel><FormMessage /></div>
          </FormItem>
        )} />

        {/* Switch */}
        <FormField control={form.control} name="notifs" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <FormLabel>Email notifications</FormLabel>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save"}
        </Button>
      </form>
    </Form>
  )
}
```

---

### 2. DataTable with Features

```tsx
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@repo/ui"

type User = { id: string; name: string; email: string; role: string; salary: number }

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    meta: { editable: true, editType: "select", editOptions: ["admin", "editor", "viewer"] },
  },
  {
    accessorKey: "salary",
    header: "Salary",
    meta: {
      align: "right",
      roles: ["admin", "hr"],       // only visible to admin/hr
      editable: true,
      editType: "number",
      editRoles: ["admin"],         // only editable by admin
      validate: (v) => Number(v) < 0 ? "Must be positive" : null,
    },
    cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
  },
]

<DataTable
  columns={columns}
  data={users}
  getRowId={(r) => r.id}
  rbac={{ userRole: currentUser.role }}
  features={{
    sorting: true,
    filtering: true,
    globalFilter: true,
    pagination: true,
    rowSelection: "multiple",
    bulkActions: true,
    columnVisibility: true,
    columnPinning: true,
    columnResizing: true,
    draggableColumns: true,
    rowExpansion: true,
    rowNumbers: true,
    density: true,
    zoom: true,
    striped: true,
    hoverable: true,
    stickyHeader: true,
    editableCells: true,
    exportCsv: true,
    exportJson: true,
  }}
  paginationOptions={{ pageSize: 20, pageSizeOptions: [10, 20, 50] }}
  bulkActions={[
    { id: "delete", label: "Delete", variant: "destructive", onClick: (rows) => handleDelete(rows) },
  ]}
  onCellEdit={({ rowId, columnId, newValue }) => updateCell(rowId, columnId, newValue)}
  renderSubComponent={({ row }) => <pre>{JSON.stringify(row.original, null, 2)}</pre>}
/>
```

**DataTable `features` flags reference:**

| Flag | Description |
|------|-------------|
| `sorting` | Click headers to sort ASC/DESC |
| `filtering` | Per-column filter row (toggle-able) |
| `globalFilter` | Search bar across all columns |
| `pagination` | Paginated view with page size control |
| `rowSelection` | `true`/`"multiple"`/`"single"` — checkbox selection |
| `bulkActions` | Toolbar with action buttons on selection (requires `bulkActions` prop) |
| `columnVisibility` | Show/hide columns dropdown |
| `columnPinning` | Freeze columns left/right |
| `draggableColumns` | Drag to reorder columns |
| `columnResizing` | Drag handles to resize columns |
| `rowExpansion` | Expandable sub-rows (requires `renderSubComponent`) |
| `rowNumbers` | Auto-incremented row number column |
| `zoom` | Zoom in/out controls in toolbar |
| `striped` | Alternating row backgrounds |
| `hoverable` | Row highlight on hover |
| `density` | Compact/Default/Comfortable density switcher |
| `stickyHeader` | Header stays fixed while scrolling |
| `editableCells` | Double-click to edit cells inline |
| `exportCsv` | Export visible data as CSV |
| `exportJson` | Export visible data as JSON |

**DataTable column `meta` fields:**

```ts
meta: {
  roles?: string[]        // roles that can SEE this column (RBAC)
  editRoles?: string[]    // roles that can EDIT this column (RBAC)
  editable?: boolean      // mark column as editable
  editType?: "text" | "number" | "date" | "select" | "boolean" | "textarea"
  editOptions?: string[]  // options for editType: "select"
  validate?: (v: unknown) => string | null  // reject value with error message
  onCellSave?: (params) => void  // per-column save handler
  align?: "left" | "center" | "right"
}
```

---

### 3. AutoForm from Zod Schema

```tsx
import { AutoForm } from "@repo/ui"
import { z } from "zod"

const schema = z.object({
  name:     z.string().min(2, "Required"),
  email:    z.string().email("Invalid email"),
  role:     z.enum(["admin", "editor", "viewer"]),
  active:   z.boolean(),
  bio:      z.string().optional(),
})

<AutoForm
  schema={schema}
  defaultValues={{ name: "", email: "", role: "editor", active: true }}
  fieldConfig={{
    name:  { label: "Full Name", placeholder: "Alice Johnson" },
    email: { description: "Work email only." },
    role:  { fieldType: "radio" },  // override auto-detection
    bio:   { fieldType: "textarea", label: "About You" },
  }}
  include={["name", "email", "role"]}     // only render these fields
  exclude={["bio"]}                        // skip these fields
  order={["name", "email", "role"]}        // explicit render order
  submitText="Save Profile"
  isLoading={saving}
  onSubmit={async (values) => await save(values)}
  onValidationError={(errors) => console.error(errors)}
  renderSubmit={({ isLoading, isValid }) => (
    <Button type="submit" disabled={!isValid || isLoading}>
      {isLoading ? "Saving…" : "Save"}
    </Button>
  )}
/>
```

**AutoForm `fieldConfig` options:**

```ts
{
  label?: string               // Display label (default: capitalized key)
  placeholder?: string         // Input placeholder text
  description?: string         // Helper text below the field
  fieldType?: FieldType        // Override auto-detected type
  options?: { label: string; value: string | number }[]  // for select/radio
  disabled?: boolean           // Disable the field
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  className?: string           // Wrapper class
}

type FieldType = "text" | "email" | "password" | "number" | "textarea" 
               | "select" | "checkbox" | "radio" | "date" | "switch"
```

---

### 4. Command Palette / ⌘K Modal

```tsx
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
} from "@repo/ui"

function App() {
  const [open, setOpen] = React.useState(false)

  // Open with ⌘K
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { navigate("/dashboard"); setOpen(false) }}>
            Dashboard <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => { navigate("/team"); setOpen(false) }}>
            Team
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => setOpen(false)}>New Project</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

---

### 5. Page Layout with Card + Badge + Separator

```tsx
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Badge, Separator, Button, Avatar, AvatarImage, AvatarFallback,
} from "@repo/ui"

<Card className="max-w-md">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Team Member</CardTitle>
      <Badge variant="default">Active</Badge>
    </div>
    <CardDescription>Software Engineer · Platform team</CardDescription>
  </CardHeader>
  <Separator />
  <CardContent className="pt-4">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="/alice.jpg" alt="Alice" />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">Alice Johnson</p>
        <p className="text-xs text-muted-foreground">alice@corp.com</p>
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button variant="outline" size="sm">View Profile</Button>
  </CardFooter>
</Card>
```

---

## Theming — CSS Variables

All tokens are in `src/styles.css`. Override in your global CSS:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... override dark tokens ... */
}
```

---

## Do's and Don'ts

### DO
- Import CSS once at app root: `import "@repo/ui/styles.css"`
- Use `getRowId` on DataTable when you have editable cells or row selection — it stabilizes row identity
- Wrap your app with `<TooltipProvider>` when using Tooltip components
- Add `<Toaster />` once in your layout root for toast notifications
- Use `zodResolver` from `@hookform/resolvers/zod` with React Hook Form for full type safety
- Pass `shouldFilter={false}` to `<Command>` when handling filtering yourself (e.g. async search)

### DON'T
- Don't import from `@repo/ui/components/Button/Button` — import from `@repo/ui` only
- Don't mix `value` + `defaultValue` on controlled inputs — pick one
- Don't forget `<FormControl>` around custom form controls — it wires up accessibility attributes
- Don't use `<Form>` without spreading `{...form}` — it needs the RHF form instance
- Don't rely on `isLoading` in DataTable for server-side data alone — also update `data` on fetch
- Don't pass `editableCells` without `getRowId` — row identity will be unstable

---

## Testing

All components are tested with Vitest + React Testing Library.

```bash
# Run all tests once
pnpm --filter @repo/ui test

# Watch mode
pnpm --filter @repo/ui test:watch
```

## Storybook

```bash
pnpm --filter @repo/ui storybook
# Opens at http://localhost:6006
```

## Build

```bash
pnpm --filter @repo/ui build
# Emits dist/ with ESM, CJS, and .d.ts declarations
```
