# Alert Component

## Description

A callout banner for displaying informational, success, warning, or destructive messages. Alerts are non-dismissible by default (unlike toasts) and are best for persistent in-page notices. Supports an optional icon via a child SVG element.

## When to Use

- Informing the user about a system state (maintenance, beta feature, required action)
- Displaying form-level validation errors after a failed submission
- Showing success confirmation after a completed action that stays on the page

## Props

### Alert

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive"` | `"default"` | Visual style |
| `className` | `string` | — | Additional Tailwind classes |

`AlertTitle` and `AlertDescription` accept standard heading/paragraph attributes.

## Usage

```tsx
import { Alert, AlertTitle, AlertDescription } from '@repo/ui'
import { InfoIcon, AlertTriangle } from 'lucide-react'

// Informational alert
<Alert>
  <InfoIcon className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>
```

```tsx
// Destructive alert (errors)
import { XCircle } from 'lucide-react'

<Alert variant="destructive">
  <XCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again to continue.
  </AlertDescription>
</Alert>
```

```tsx
// Alert without icon
<Alert>
  <AlertTitle>Scheduled Maintenance</AlertTitle>
  <AlertDescription>
    The system will be down for maintenance on Sunday, Jan 5 from 2–4am UTC.
  </AlertDescription>
</Alert>
```

## Exports
- `Alert`, `AlertTitle`, `AlertDescription`
- `alertVariants` — CVA function for direct class generation
