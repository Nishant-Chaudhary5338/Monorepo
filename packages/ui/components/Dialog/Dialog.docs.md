# Dialog Component

## Description

A modal dialog with animated overlay, accessible focus trapping, and composable header/footer slots. Built on Radix UI Dialog. Blocks interaction with the rest of the page while open and restores focus on close.

## When to Use

- Confirmation dialogs (delete, submit, irreversible actions)
- Forms that need to float above page content
- Detailed views without navigating away from the current page

## Props

### Dialog (root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state changes |
| `defaultOpen` | `boolean` | `false` | Initially open (uncontrolled) |
| `modal` | `boolean` | `true` | Whether to block background interaction |

### DialogContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | CSS classes for the panel |
| `onOpenAutoFocus` | `(e: Event) => void` | — | Override initial focus target |
| `onInteractOutside` | `(e: Event) => void` | — | Called on click outside (call `e.preventDefault()` to keep open) |

## Usage

```tsx
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogFooter, DialogTitle, DialogDescription
} from '@repo/ui'
import { Button } from '@repo/ui'
import { Input } from '@repo/ui'

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Input placeholder="Name" />
      <Input type="email" placeholder="Email" />
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

```tsx
// Controlled dialog
const [open, setOpen] = React.useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button onClick={() => setOpen(true)}>Confirm Action</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={handleConfirm}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

```tsx
// Prevent closing on outside click
<DialogContent onInteractOutside={(e) => e.preventDefault()}>
  {/* Important form that must be explicitly dismissed */}
</DialogContent>
```

## Exports
- `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`
- `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogPortal`, `DialogOverlay`
