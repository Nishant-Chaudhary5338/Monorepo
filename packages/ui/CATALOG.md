# @repo/ui Component Catalog

Deep reference for all 45 components. Each entry shows the import, key props, and a minimal usage example.

All components are exported from the main barrel:
```tsx
import { ComponentName } from '@repo/ui'
```

---

## Accordion

Vertically stacked collapsible sections; supports `single` (one open at a time) or `multiple` mode.

**Import**
```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui'
```

**Key Props — `Accordion` (root)**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"single" \| "multiple"` | required | Allow one or many open items |
| `collapsible` | `boolean` | `false` | When `type="single"`, allow closing the open item |
| `defaultValue` | `string \| string[]` | — | Initially open item(s) |
| `value` | `string \| string[]` | — | Controlled open item(s) |
| `onValueChange` | `(value) => void` | — | Called when open items change |

**Key Props — `AccordionItem`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Unique identifier for this item |
| `disabled` | `boolean` | `false` | Prevent this item from being opened |

**Usage**
```tsx
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It adheres to WAI-ARIA design patterns.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>Yes. Comes with default Tailwind styles.</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Alert

Callout banner for informational, success, warning, or destructive messages. Optionally includes an icon.

**Import**
```tsx
import { Alert, AlertTitle, AlertDescription } from '@repo/ui'
```

**Key Props — `Alert`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive"` | `"default"` | Visual style of the alert |
| `className` | `string` | — | Additional CSS classes |

**Usage**
```tsx
import { Terminal } from 'lucide-react'

<Alert>
  <Terminal className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
</Alert>
```

---

## AspectRatio

Constrains child content to a specific aspect ratio. Prevents layout shift during image loads.

**Import**
```tsx
import { AspectRatio } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ratio` | `number` | `1` | Width/height ratio (e.g. `16/9`, `4/3`, `1`) |

**Usage**
```tsx
<AspectRatio ratio={16 / 9} className="bg-muted">
  <img src="/hero.jpg" alt="Hero" className="h-full w-full rounded-md object-cover" />
</AspectRatio>
```

---

## AutoForm

Auto-generates a complete form UI from a Zod schema using react-hook-form. Field types are inferred from the schema.

**Import**
```tsx
import { AutoForm } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `ZodSchema` | required | Zod schema that defines form fields |
| `onSubmit` | `(values) => void` | required | Submit handler with typed values |
| `fieldsConfig` | `FieldsConfig` | — | Per-field overrides (label, placeholder, fieldType, options) |
| `defaultValues` | `object` | — | Initial form values |
| `submitLabel` | `string` | `"Submit"` | Text for the submit button |
| `className` | `string` | — | Wrapper class |

**Usage**
```tsx
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'viewer']),
})

<AutoForm
  schema={schema}
  onSubmit={(values) => console.log(values)}
  fieldsConfig={{
    name: { label: 'Full Name', placeholder: 'John Doe' },
    role: { label: 'Role', options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Viewer', value: 'viewer' },
    ]},
  }}
  submitLabel="Create Account"
/>
```

---

## Avatar

Circular user avatar with image support and fallback text. Supports multiple sizes and shapes.

**Import**
```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui'
```

**Key Props — `Avatar`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "default" \| "lg" \| "xl"` | `"default"` | Avatar size |
| `shape` | `"circle" \| "square"` | `"circle"` | Border radius shape |

**Key Props — `AvatarImage`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image URL |
| `alt` | `string` | — | Alt text for accessibility |

**Usage**
```tsx
<Avatar size="lg">
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>SC</AvatarFallback>
</Avatar>
```

---

## Badge

Small inline label for status indicators, categories, or counts.

**Import**
```tsx
import { Badge } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline"` | `"default"` | Visual style |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Badge size |
| `className` | `string` | — | Additional CSS classes |

**Usage**
```tsx
<Badge>New</Badge>
<Badge variant="secondary">Beta</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

---

## Breadcrumb

Hierarchical navigation trail showing the current page path with separator support.

**Import**
```tsx
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis
} from '@repo/ui'
```

**Key Props — `Breadcrumb`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `separator` | `ReactNode` | `<ChevronRight />` | Custom separator element |

**Key Props — `BreadcrumbLink`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render child as link (e.g. Next.js `<Link>`) |

**Usage**
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## Button

Versatile action button with 6 visual variants, 4 sizes, and polymorphic `asChild` composition.

**Import**
```tsx
import { Button } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | Button size |
| `asChild` | `boolean` | `false` | Render child element as button (for Link composition) |
| `disabled` | `boolean` | `false` | Disable interaction |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Button type |

**Usage**
```tsx
<Button>Save Changes</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" size="icon"><TrashIcon /></Button>
<Button asChild variant="link">
  <a href="/docs">Documentation</a>
</Button>
```

---

## Calendar

Interactive date picker calendar built on react-day-picker. Supports single, range, and multiple selection modes.

**Import**
```tsx
import { Calendar } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"single" \| "multiple" \| "range"` | `"single"` | Selection mode |
| `selected` | `Date \| Date[] \| DateRange` | — | Currently selected date(s) |
| `onSelect` | `(date) => void` | — | Called when selection changes |
| `disabled` | `Matcher \| Matcher[]` | — | Dates to disable |
| `defaultMonth` | `Date` | — | Month to show on first render |
| `numberOfMonths` | `number` | `1` | Number of months to display |

**Usage**
```tsx
const [date, setDate] = React.useState<Date | undefined>()

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

---

## Card

Container surface with composable Header, Title, Description, Content, and Footer slots.

**Import**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@repo/ui'
```

**Key Props — `Card`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render child as card element |
| `className` | `string` | — | Additional CSS classes |

**Key Props — `CardTitle`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"` | Heading element to render |

**Usage**
```tsx
<Card className="w-[380px]">
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>You have 3 unread messages.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Manage your notification preferences here.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Later</Button>
    <Button>Mark all read</Button>
  </CardFooter>
</Card>
```

---

## Checkbox

Accessible checkbox with controlled/uncontrolled support and indeterminate state.

**Import**
```tsx
import { Checkbox } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| "indeterminate"` | — | Controlled checked state |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | — | Change handler |
| `disabled` | `boolean` | `false` | Prevent interaction |
| `required` | `boolean` | `false` | Mark as required for form validation |
| `id` | `string` | — | Associates with a `<Label>` |

**Usage**
```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

---

## Collapsible

Simple show/hide container with a trigger and animated content area.

**Import**
```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@repo/ui'
```

**Key Props — `Collapsible`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state changes |
| `defaultOpen` | `boolean` | `false` | Initially open |
| `disabled` | `boolean` | `false` | Prevent toggling |

**Usage**
```tsx
const [isOpen, setIsOpen] = React.useState(false)

<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">Show more</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <p>Additional hidden content revealed on toggle.</p>
  </CollapsibleContent>
</Collapsible>
```

---

## Command

Searchable command palette and combobox powered by cmdk. Can be embedded inline or in a Dialog.

**Import**
```tsx
import {
  Command, CommandDialog, CommandInput, CommandList,
  CommandEmpty, CommandGroup, CommandItem, CommandSeparator
} from '@repo/ui'
```

**Key Props — `CommandInput`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | — | Input placeholder text |
| `value` | `string` | — | Controlled input value |
| `onValueChange` | `(value: string) => void` | — | Called on input change |

**Key Props — `CommandItem`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Value used for filtering |
| `onSelect` | `(value: string) => void` | — | Called when item is selected |
| `disabled` | `boolean` | `false` | Disable this item |

**Usage**
```tsx
<Command className="rounded-lg border shadow-md">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={() => console.log('calendar')}>Calendar</CommandItem>
      <CommandItem onSelect={() => console.log('search')}>Search</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>Profile</CommandItem>
      <CommandItem>Billing</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

---

## ContextMenu

Right-click context menu with nested sub-menus, checkboxes, and radio groups.

**Import**
```tsx
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuSeparator, ContextMenuSub,
  ContextMenuSubTrigger, ContextMenuSubContent
} from '@repo/ui'
```

**Key Props — `ContextMenuItem`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Add left padding for icon alignment |
| `disabled` | `boolean` | `false` | Disable this item |
| `onSelect` | `() => void` | — | Called when item is selected |

**Usage**
```tsx
<ContextMenu>
  <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-md border border-dashed">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent className="w-48">
    <ContextMenuItem>Open</ContextMenuItem>
    <ContextMenuItem>Copy Link</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

## DataTable

Feature-rich data table built on TanStack Table v8. All features are opt-in via the `features` prop.

**Import**
```tsx
import { DataTable } from '@repo/ui'
import type { ColumnDef } from '@tanstack/react-table'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData>[]` | required | TanStack column definitions |
| `data` | `TData[]` | required | Table data array |
| `features` | `DataTableFeatures` | `{}` | Feature flags (all opt-in) |
| `rbac` | `{ userRole: string }` | — | RBAC config for column visibility/editing |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `emptyMessage` | `string \| ReactNode` | `"No results."` | Empty state message |
| `bulkActions` | `BulkAction[]` | — | Actions shown on row selection |
| `onCellEdit` | `(params) => void` | — | Callback after inline cell edit |
| `serverSide` | `ServerSideOptions` | — | Enable server-side pagination/sorting |
| `paginationOptions` | `{ pageSize, pageSizeOptions }` | — | Page size configuration |
| `renderToolbar` | `(table) => ReactNode` | — | Custom toolbar content |

**`DataTableFeatures` flags**

`sorting`, `filtering`, `globalFilter`, `pagination`, `rowSelection`, `bulkActions`, `columnVisibility`, `columnPinning`, `draggableColumns`, `columnResizing`, `rowExpansion`, `rowNumbers`, `zoom`, `striped`, `hoverable`, `density`, `stickyHeader`, `editableCells`, `exportCsv`, `exportJson`

**Usage**
```tsx
type User = { id: string; name: string; email: string; role: string }

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
]

<DataTable
  columns={columns}
  data={users}
  features={{ sorting: true, globalFilter: true, pagination: true, exportCsv: true }}
  paginationOptions={{ pageSize: 25 }}
/>
```

---

## DesignSystem

Visual design token reference page showing colors, typography, spacing, and component variants. Intended for internal use / Storybook.

**Import**
```tsx
import { DesignSystem } from '@repo/ui'
```

**Usage**
```tsx
<DesignSystem />
```

---

## Dialog

Modal dialog with animated overlay, accessible focus trapping, and composable header/footer slots.

**Import**
```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogFooter, DialogTitle, DialogDescription, DialogClose
} from '@repo/ui'
```

**Key Props — `DialogContent`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes for the panel |
| `onOpenAutoFocus` | `(e: Event) => void` | — | Override initial focus |
| `onInteractOutside` | `(e: Event) => void` | — | Called on outside click |

**Key Props — `Dialog`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state changes |
| `defaultOpen` | `boolean` | `false` | Initially open |

**Usage**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Input placeholder="Name" />
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Drawer

Slide-up (or configurable direction) panel built on Vaul. Ideal for mobile-first bottom sheets.

**Import**
```tsx
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader,
  DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose
} from '@repo/ui'
```

**Key Props — `Drawer`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state changes |
| `shouldScaleBackground` | `boolean` | `true` | Scale and dim background when open |
| `direction` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Slide direction |

**Usage**
```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Move Goal</DrawerTitle>
      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
    </DrawerHeader>
    <div className="p-4">Content here</div>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

## DropdownMenu

Dropdown menu with items, separators, checkboxes, radio groups, and nested sub-menus.

**Import**
```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem
} from '@repo/ui'
```

**Key Props — `DropdownMenuContent`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start" \| "center" \| "end"` | `"center"` | Horizontal alignment |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Which side to open on |
| `sideOffset` | `number` | `4` | Distance from trigger in px |

**Usage**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Form

react-hook-form wrapper providing accessible field, label, control, description, and error message slots.

**Import**
```tsx
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormDescription, FormMessage
} from '@repo/ui'
```

**Key Props — `FormField`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `control` | `Control` | required | The `form.control` from `useForm()` |
| `name` | `string` | required | Field name (must match schema key) |
| `render` | `({ field }) => ReactNode` | required | Render prop with field bindings |

**Usage**
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

function EmailForm() {
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
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </Form>
  )
}
```

---

## HoverCard

Floating card revealed on hover, useful for user profile previews or rich link previews.

**Import**
```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@repo/ui'
```

**Key Props — `HoverCardContent`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment relative to trigger |
| `sideOffset` | `number` | `4` | Distance from trigger in px |

**Usage**
```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@nextjs</Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-80">
    <div className="flex justify-between space-x-4">
      <Avatar>
        <AvatarImage src="https://github.com/vercel.png" />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">@nextjs</h4>
        <p className="text-sm text-muted-foreground">The React Framework for the Web.</p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

---

## Input

Styled text input with size variants, error/success states, and optional start/end icon slots.

**Import**
```tsx
import { Input } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"text" \| "email" \| "password" \| "number" \| ...` | `"text"` | HTML input type |
| `inputSize` | `"sm" \| "default" \| "lg"` | `"default"` | Size variant |
| `error` | `boolean` | `false` | Display error state (red border) |
| `success` | `boolean` | `false` | Display success state (green border) |
| `startIcon` | `ReactNode` | — | Icon on the left side |
| `endIcon` | `ReactNode` | — | Icon on the right side |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disable input |

**Usage**
```tsx
import { Search, Mail } from 'lucide-react'

<Input placeholder="Enter your name" />
<Input type="email" inputSize="lg" placeholder="you@example.com" />
<Input startIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
<Input type="password" endIcon={<EyeIcon className="h-4 w-4" />} />
<Input error placeholder="Invalid value" />
```

---

## InputOTP

One-time password input with slot-based entry, configurable length, and separator support.

**Import**
```tsx
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@repo/ui'
```

**Key Props — `InputOTP`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | required | Number of OTP characters |
| `value` | `string` | — | Controlled OTP value |
| `onChange` | `(value: string) => void` | — | Called when value changes |
| `pattern` | `string` | — | Regex pattern for allowed characters |
| `disabled` | `boolean` | `false` | Disable input |

**Key Props — `InputOTPSlot`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | required | Zero-based slot index |

**Usage**
```tsx
const [value, setValue] = React.useState('')

<InputOTP maxLength={6} value={value} onChange={setValue}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

---

## Label

Accessible form label with optional error and required states, built on Radix Label.

**Import**
```tsx
import { Label } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | `string` | — | Associates label with an input by ID |
| `error` | `boolean` | `false` | Display label in error state |
| `required` | `boolean` | `false` | Show required indicator |

**Usage**
```tsx
<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email" required>Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>
```

---

## Menubar

Horizontal application menu bar with nested sub-menus, radio groups, and checkboxes.

**Import**
```tsx
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarItem, MenubarSeparator, MenubarLabel,
  MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub,
  MenubarSubContent, MenubarSubTrigger, MenubarShortcut
} from '@repo/ui'
```

**Usage**
```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
      <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print...</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
      <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

---

## NavigationMenu

Horizontal top navigation with animated flyout sub-menus and viewport panel.

**Import**
```tsx
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
  NavigationMenuViewport, navigationMenuTriggerStyle
} from '@repo/ui'
```

**Usage**
```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-6 w-[400px]">
          <li>
            <NavigationMenuLink href="/docs/intro">Introduction</NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/docs">
        Documentation
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

## Pagination

Page navigation controls with previous/next buttons, page links, and ellipsis for large page counts.

**Import**
```tsx
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis
} from '@repo/ui'
```

**Key Props — `PaginationLink`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | `false` | Highlights the current page |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"icon"` | Link size |
| `href` | `string` | — | Page URL |

**Usage**
```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="/page/1" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/page/1">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/page/2" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="/page/3" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## Popover

Floating panel anchored to a trigger element. Useful for inline forms, filters, or detail views.

**Import**
```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@repo/ui'
```

**Key Props — `PopoverContent`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"start" \| "center" \| "end"` | `"center"` | Horizontal alignment |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Opening side |
| `sideOffset` | `number` | `4` | Distance from trigger in px |
| `className` | `string` | — | Additional CSS classes |

**Usage**
```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open filter</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="grid gap-4">
      <h4 className="font-medium leading-none">Filter options</h4>
      <Input placeholder="Search..." />
    </div>
  </PopoverContent>
</Popover>
```

---

## Progress

Linear progress bar with animated fill. Indicates task completion or loading state.

**Import**
```tsx
import { Progress } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress value 0–100 |
| `max` | `number` | `100` | Maximum value |
| `className` | `string` | — | Additional CSS classes |

**Usage**
```tsx
<Progress value={60} className="w-[60%]" />

// With label
<div className="space-y-1">
  <div className="flex justify-between text-sm">
    <span>Uploading...</span>
    <span>60%</span>
  </div>
  <Progress value={60} />
</div>
```

---

## RadioGroup

Accessible radio button group for single-choice selection from a set of options.

**Import**
```tsx
import { RadioGroup, RadioGroupItem } from '@repo/ui'
```

**Key Props — `RadioGroup`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled selected value |
| `onValueChange` | `(value: string) => void` | — | Called when selection changes |
| `defaultValue` | `string` | — | Initially selected value |
| `disabled` | `boolean` | `false` | Disable all items |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Layout direction |

**Usage**
```tsx
<RadioGroup defaultValue="option-one" className="space-y-2">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>
```

---

## ScrollArea

Custom-styled scrollable container with always-visible or auto-hiding scrollbar.

**Import**
```tsx
import { ScrollArea, ScrollBar } from '@repo/ui'
```

**Key Props — `ScrollArea`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Sets container height (required to enable scrolling) |
| `type` | `"auto" \| "always" \| "scroll" \| "hover"` | `"hover"` | When to show scrollbar |

**Key Props — `ScrollBar`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Scrollbar direction |

**Usage**
```tsx
<ScrollArea className="h-72 w-48 rounded-md border">
  <div className="p-4">
    {Array.from({ length: 50 }).map((_, i) => (
      <div key={i} className="text-sm py-1">Item {i + 1}</div>
    ))}
  </div>
</ScrollArea>
```

---

## Select

Accessible dropdown select with groups, labels, and separator. Built on Radix UI Select.

**Import**
```tsx
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectLabel, SelectItem, SelectSeparator
} from '@repo/ui'
```

**Key Props — `Select`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Controlled selected value |
| `onValueChange` | `(value: string) => void` | — | Called when value changes |
| `defaultValue` | `string` | — | Initially selected value |
| `disabled` | `boolean` | `false` | Disable the select |

**Key Props — `SelectContent`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"item-aligned" \| "popper"` | `"popper"` | Positioning strategy |

**Usage**
```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="blueberry">Blueberry</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

## Separator

Horizontal or vertical divider line with solid, dashed, or dotted styles.

**Import**
```tsx
import { Separator } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the divider |
| `variant` | `"solid" \| "dashed" \| "dotted"` | `"solid"` | Line style |
| `decorative` | `boolean` | `true` | When true, hides from accessibility tree |

**Usage**
```tsx
<div className="space-y-1">
  <h4 className="text-sm font-medium">Radix Primitives</h4>
  <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
</div>
<Separator className="my-4" />
<div className="flex h-5 items-center space-x-4 text-sm">
  <span>Blog</span>
  <Separator orientation="vertical" />
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Source</span>
</div>
```

---

## Sheet

Slide-in panel that appears from any screen edge. Uses Radix Dialog under the hood.

**Import**
```tsx
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader,
  SheetFooter, SheetTitle, SheetDescription, SheetClose
} from '@repo/ui'
```

**Key Props — `SheetContent`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | Which edge to slide from |

**Usage**
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Make changes to your profile. Click save when done.</SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4">
      <Input placeholder="Name" />
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button type="submit">Save changes</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

## Skeleton

Loading placeholder with pulse or shimmer animation. Multiple shape variants for common patterns.

**Import**
```tsx
import { Skeleton } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "text" \| "circle" \| "rect" \| "card"` | `"default"` | Shape preset |
| `animate` | `"pulse" \| "shimmer" \| "none"` | `"pulse"` | Animation style |
| `className` | `string` | — | Override width/height with Tailwind classes |

**Usage**
```tsx
// Text line placeholders
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>

// Card placeholder
<div className="flex items-center space-x-4">
  <Skeleton variant="circle" className="h-12 w-12" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[150px]" />
  </div>
</div>
```

---

## Slider

Range slider for numeric input with single or multi-thumb support.

**Import**
```tsx
import { Slider } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number[]` | — | Controlled value(s) |
| `defaultValue` | `number[]` | `[0]` | Initial value(s) |
| `onValueChange` | `(value: number[]) => void` | — | Called during drag |
| `onValueCommit` | `(value: number[]) => void` | — | Called on release |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disable interaction |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Slider direction |

**Usage**
```tsx
const [volume, setVolume] = React.useState([50])

<Slider
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  step={1}
  className="w-[60%]"
/>

// Range slider (two thumbs)
<Slider defaultValue={[20, 80]} min={0} max={100} step={5} />
```

---

## Sonner

Toast notification provider powered by the Sonner library. Mount once at the app root.

**Import**
```tsx
import { Toaster } from '@repo/ui'
import { toast } from 'sonner'
```

**Key Props — `Toaster`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "top-center" \| "bottom-center"` | `"bottom-right"` | Where toasts appear |
| `richColors` | `boolean` | `false` | Use semantic colors for success/error |
| `expand` | `boolean` | `false` | Expand multiple toasts by default |
| `duration` | `number` | `4000` | Auto-dismiss duration in ms |
| `theme` | `"light" \| "dark" \| "system"` | `"system"` | Color theme |

**Usage**
```tsx
// In root layout:
import { Toaster } from '@repo/ui'
<Toaster richColors position="top-right" />

// Anywhere in your app:
import { toast } from 'sonner'

toast('File saved successfully')
toast.success('Profile updated!')
toast.error('Failed to save. Please try again.')
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Error saving data.',
})
```

---

## Switch

Toggle switch for boolean on/off values, with size variants.

**Import**
```tsx
import { Switch } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | — | Controlled checked state |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called when state changes |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Required for form validation |
| `name` | `string` | — | Form field name |
| `value` | `string` | `"on"` | Value submitted with form |

**Usage**
```tsx
const [enabled, setEnabled] = React.useState(false)

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" checked={enabled} onCheckedChange={setEnabled} />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
```

---

## Table

Semantic HTML table with styled Header, Body, Footer, Row, Head, Cell, and Caption sub-components.

**Import**
```tsx
import {
  Table, TableHeader, TableBody, TableFooter,
  TableHead, TableRow, TableCell, TableCaption
} from '@repo/ui'
```

**Key Props**

All sub-components accept standard HTML element attributes. No custom props beyond `className`.

**Usage**
```tsx
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV-001</TableCell>
      <TableCell><Badge>Paid</Badge></TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

---

## Tabs

Tabbed content panels with list, trigger, and content slots. Supports variant styles.

**Import**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui'
```

**Key Props — `Tabs`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | — | Initially active tab |
| `value` | `string` | — | Controlled active tab |
| `onValueChange` | `(value: string) => void` | — | Called when active tab changes |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Tab list direction |

**Usage**
```tsx
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>
      <CardHeader><CardTitle>Account</CardTitle></CardHeader>
      <CardContent><Input placeholder="Username" /></CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="password">
    <Card>
      <CardHeader><CardTitle>Password</CardTitle></CardHeader>
      <CardContent><Input type="password" placeholder="Current password" /></CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

---

## Textarea

Multi-line text input with resize control, size variants, and error/success states.

**Import**
```tsx
import { Textarea } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputSize` | `"sm" \| "default" \| "lg"` | `"default"` | Size variant |
| `error` | `boolean` | `false` | Display error state |
| `success` | `boolean` | `false` | Display success state |
| `placeholder` | `string` | — | Placeholder text |
| `rows` | `number` | — | Number of visible text lines |
| `disabled` | `boolean` | `false` | Disable input |

**Usage**
```tsx
<Textarea placeholder="Type your message here." />
<Textarea inputSize="lg" rows={6} placeholder="Detailed description..." />
<Textarea error placeholder="This field is required" />
```

---

## Toggle

Pressable toggle button that switches between pressed and unpressed states.

**Import**
```tsx
import { Toggle } from '@repo/ui'
```

**Key Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "outline"` | `"default"` | Visual style |
| `size` | `"default" \| "sm" \| "lg"` | `"default"` | Button size |
| `pressed` | `boolean` | — | Controlled pressed state |
| `onPressedChange` | `(pressed: boolean) => void` | — | Called when state changes |
| `disabled` | `boolean` | `false` | Disable interaction |

**Usage**
```tsx
import { Bold, Italic } from 'lucide-react'

<Toggle aria-label="Toggle bold">
  <Bold className="h-4 w-4" />
</Toggle>

<Toggle variant="outline" aria-label="Toggle italic">
  <Italic className="h-4 w-4" />
</Toggle>
```

---

## ToggleGroup

Group of toggle buttons supporting single or multiple selection with shared variant styling.

**Import**
```tsx
import { ToggleGroup, ToggleGroupItem } from '@repo/ui'
```

**Key Props — `ToggleGroup`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"single" \| "multiple"` | required | Single or multi-select |
| `value` | `string \| string[]` | — | Controlled selected value(s) |
| `onValueChange` | `(value) => void` | — | Called when selection changes |
| `variant` | `"default" \| "outline"` | `"default"` | Visual style for all items |
| `size` | `"default" \| "sm" \| "lg"` | `"default"` | Size for all items |

**Usage**
```tsx
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

// Single select (radio behavior)
<ToggleGroup type="single" defaultValue="center">
  <ToggleGroupItem value="left" aria-label="Left align">
    <AlignLeft className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Center align">
    <AlignCenter className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Right align">
    <AlignRight className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>
```

---

## Tooltip

Accessible tooltip shown on focus or hover. Requires wrapping the app in `TooltipProvider`.

**Import**
```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@repo/ui'
```

**Key Props — `TooltipContent`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Tooltip placement |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side axis |
| `sideOffset` | `number` | `4` | Distance from trigger in px |

**Usage**
```tsx
// Wrap your app once:
<TooltipProvider>
  <App />
</TooltipProvider>

// Then use anywhere:
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline" size="icon">
      <InfoIcon className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>
```
