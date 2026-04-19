# Tabs Component

## Description

Tabbed content panels that organize related content into distinct views. Supports multiple visual variants (default, underline, pills, boxed) and both horizontal and vertical orientations. Built on Radix UI Tabs.

## When to Use

- Switching between related views on the same page (e.g. Overview / Details / Settings)
- Segmented forms where different sections are revealed on demand
- Dashboard panels with multiple data perspectives

## Props

### Tabs (root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | — | Initially active tab (uncontrolled) |
| `value` | `string` | — | Controlled active tab |
| `onValueChange` | `(value: string) => void` | — | Called when active tab changes |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Tab list direction |

### TabsList

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "underline" \| "pills" \| "boxed"` | `"default"` | Visual style of the tab list |

### TabsTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | The value this trigger activates |
| `disabled` | `boolean` | `false` | Disable this tab |

### TabsContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | The value this content panel corresponds to |

## Usage

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'

<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>
      <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
      <CardContent><p>Update your account details.</p></CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="password">
    <Card>
      <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
      <CardContent><p>Update your password here.</p></CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="billing">
    <Card>
      <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
      <CardContent><p>Manage your billing information.</p></CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

```tsx
// Underline variant (minimal style)
<TabsList variant="underline">
  <TabsTrigger value="all">All</TabsTrigger>
  <TabsTrigger value="active">Active</TabsTrigger>
  <TabsTrigger value="archived">Archived</TabsTrigger>
</TabsList>
```

```tsx
// Controlled tabs
const [tab, setTab] = React.useState('overview')

<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><Overview /></TabsContent>
  <TabsContent value="analytics"><Analytics /></TabsContent>
</Tabs>
```

## Exports
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
