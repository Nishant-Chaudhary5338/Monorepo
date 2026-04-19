# Form Component

## Description

A react-hook-form integration layer that provides accessible form field composition. It wraps `FormProvider` from react-hook-form and offers `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, and `FormMessage` to build fully validated, accessible forms with minimal boilerplate.

## When to Use

- Building forms that require validation (use with Zod + `@hookform/resolvers`)
- Any form where you want automatic error message display tied to field state
- When you need accessible label/input association without manual id wiring

## Props

### Form
Accepts all `FormProvider` props from react-hook-form. Pass the spread of the `useForm()` return value: `<Form {...form}>`.

### FormField

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `control` | `Control` | required | The `form.control` value from `useForm()` |
| `name` | `string` | required | Field name key (must match schema) |
| `render` | `({ field, fieldState }) => ReactNode` | required | Render prop receiving field bindings |

### FormItem, FormLabel, FormControl, FormDescription, FormMessage
All accept standard div/p/label HTML attributes. No custom props required; they get context from `FormField` automatically.

## Usage

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@repo/ui'
import { Input } from '@repo/ui'
import { Button } from '@repo/ui'

const schema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit">Save profile</Button>
      </form>
    </Form>
  )
}
```

```tsx
// With Select field
<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Exports
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`
- `useFormField` — hook for accessing form field context in custom components
