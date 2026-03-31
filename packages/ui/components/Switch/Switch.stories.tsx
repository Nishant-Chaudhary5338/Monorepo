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

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
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

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center space-x-2">
        <Switch id="off" />
        <Label htmlFor="off">Off</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="on" defaultChecked />
        <Label htmlFor="on">On</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off" className="opacity-50">
          Disabled Off
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on" className="opacity-50">
          Disabled On
        </Label>
      </div>
    </div>
  ),
}

export const NotificationSettings: Story = {
  render: () => (
    <div className="flex flex-col max-w-md gap-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Notification Preferences</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Email Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive email updates about your account
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Push Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive push notifications on your device
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>SMS Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive text messages for important updates
          </p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Marketing Communications</Label>
          <p className="text-sm text-muted-foreground">
            Receive promotional offers and news
          </p>
        </div>
        <Switch />
      </div>
    </div>
  ),
}

export const PrivacySettings: Story = {
  render: () => (
    <div className="flex flex-col max-w-md gap-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Privacy Settings</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Profile Visibility</Label>
          <p className="text-sm text-muted-foreground">
            Make your profile visible to everyone
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Activity Status</Label>
          <p className="text-sm text-muted-foreground">
            Show when you are online
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Read Receipts</Label>
          <p className="text-sm text-muted-foreground">
            Let others know when you have read their messages
          </p>
        </div>
        <Switch />
      </div>
    </div>
  ),
}

export const FeatureFlags: Story = {
  render: () => (
    <div className="flex flex-col max-w-md gap-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Beta Features</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>New Dashboard</Label>
          <p className="text-sm text-muted-foreground">
            Try the redesigned dashboard interface
          </p>
        </div>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>AI Assistant</Label>
          <p className="text-sm text-muted-foreground">
            Enable AI-powered suggestions and automation
          </p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Advanced Analytics</Label>
          <p className="text-sm text-muted-foreground">
            Access detailed analytics and reports
          </p>
        </div>
        <Switch defaultChecked />
      </div>
    </div>
  ),
}

export const AccessibilityExample: Story = {
  render: () => (
    <div className="flex flex-col max-w-md gap-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Accessibility Options</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="reduce-motion">Reduce Motion</Label>
          <p className="text-sm text-muted-foreground">
            Minimize animations and transitions
          </p>
        </div>
        <Switch id="reduce-motion" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="high-contrast">High Contrast</Label>
          <p className="text-sm text-muted-foreground">
            Increase color contrast for better visibility
          </p>
        </div>
        <Switch id="high-contrast" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="screen-reader">Screen Reader Mode</Label>
          <p className="text-sm text-muted-foreground">
            Optimize for screen reader compatibility
          </p>
        </div>
        <Switch id="screen-reader" />
      </div>
    </div>
  ),
}