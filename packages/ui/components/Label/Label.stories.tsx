import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './Label'
import { Input } from '../Input/Input'
import { Checkbox } from '../Checkbox/Checkbox'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: {
    children: 'Your email address',
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="required-field">
        Email <span className="text-destructive">*</span>
      </Label>
      <Input type="email" id="required-field" placeholder="Email" required />
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input type="text" id="username" placeholder="Username" />
      <p className="text-sm text-muted-foreground">
        This will be your public display name.
      </p>
    </div>
  ),
}

export const DisabledState: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled-input" className="opacity-70">
        Disabled field
      </Label>
      <Input type="text" id="disabled-input" placeholder="Disabled" disabled />
    </div>
  ),
}

export const FormLayout: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email2">Email</Label>
        <Input type="email" id="email2" placeholder="john@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Input id="bio" placeholder="Tell us about yourself" />
        <p className="text-sm text-muted-foreground">Max 200 characters.</p>
      </div>
    </div>
  ),
}
