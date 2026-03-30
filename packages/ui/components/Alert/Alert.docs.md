# Alert Component

## Description
Displays a callout for user attention with optional title and description.

## Exports
- `Alert`
- `AlertTitle`
- `AlertDescription`
- `alertVariants`

## Usage

```tsx
import { Alert, AlertTitle, AlertDescription } from '@repo/ui'

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components to your app.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

## Dependencies
- `class-variance-authority`
