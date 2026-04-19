# Toaster (Sonner) Component

## Description

Toast notification provider powered by the Sonner library. Mount `<Toaster />` once at your app root; then call `toast()` from anywhere in your app. Supports success, error, warning, info, loading, and promise-based toasts.

## When to Use

- Non-blocking feedback after user actions (save, delete, copy, submit)
- Background operation status (upload progress, async task completion)
- Error or success messages that auto-dismiss without blocking the UI

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "top-center" \| "bottom-center"` | `"bottom-right"` | Where toasts appear |
| `richColors` | `boolean` | `false` | Use semantic colors for success/error/warning |
| `expand` | `boolean` | `false` | Show all queued toasts expanded by default |
| `duration` | `number` | `4000` | Auto-dismiss delay in ms |
| `theme` | `"light" \| "dark" \| "system"` | `"system"` | Color theme |
| `visibleToasts` | `number` | `3` | Max toasts shown at once |
| `closeButton` | `boolean` | `false` | Show a close button on each toast |

## Setup

```tsx
// app/layout.tsx or root component
import { Toaster } from '@repo/ui'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
```

## Usage

```tsx
import { toast } from 'sonner'

// Basic toast
toast('File has been saved')

// Semantic toasts
toast.success('Profile updated successfully!')
toast.error('Failed to save. Please try again.')
toast.warning('Your session will expire in 5 minutes.')
toast.info('New version available.')
```

```tsx
// Promise-based toast (loading → success/error)
toast.promise(uploadFile(data), {
  loading: 'Uploading file...',
  success: (result) => `${result.name} uploaded successfully!`,
  error: 'Upload failed. Please try again.',
})
```

```tsx
// Toast with action button
toast('File deleted', {
  action: {
    label: 'Undo',
    onClick: () => restoreFile(),
  },
  duration: 8000,
})
```

```tsx
// Custom description
toast('Event created', {
  description: 'Monday, January 3rd at 6:00pm',
})
```

## Exports
- `Toaster` — provider component to mount once at app root
- Use `toast` imported directly from `'sonner'` to trigger notifications
