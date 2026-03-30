import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "./Switch"
import { Label } from "../Label/Label"

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    "aria-label": "Toggle switch",
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    "aria-label": "Toggle switch",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    "aria-label": "Toggle switch",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-3">
      <Switch id="marketing" className="mt-1" />
      <div className="grid gap-1.5">
        <Label htmlFor="marketing">Marketing emails</Label>
        <p className="text-sm text-muted-foreground">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
  ),
}

export const Settings: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive push notifications.
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Dark mode</Label>
          <p className="text-sm text-muted-foreground">Toggle dark theme.</p>
        </div>
        <Switch />
      </div>
    </div>
  ),
}
