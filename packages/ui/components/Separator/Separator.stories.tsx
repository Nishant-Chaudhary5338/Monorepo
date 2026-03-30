import type { Meta, StoryObj } from "@storybook/react"
import { Separator } from "./Separator"

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    decorative: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="text-sm">Section 1</div>
      <Separator />
      <div className="text-sm">Section 2</div>
      <Separator />
      <div className="text-sm">Section 3</div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center h-5 space-x-4">
      <div className="text-sm">Blog</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Docs</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Source</div>
    </div>
  ),
}

export const WithContent: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">Update your account settings.</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
      </div>
    </div>
  ),
}

export const InSidebar: Story = {
  render: () => (
    <div className="w-[200px] space-y-2">
      <div className="text-sm font-medium">Navigation</div>
      <Separator />
      <div className="space-y-1">
        <div className="text-sm cursor-pointer hover:bg-accent rounded px-2 py-1">Dashboard</div>
        <div className="text-sm cursor-pointer hover:bg-accent rounded px-2 py-1">Projects</div>
        <div className="text-sm cursor-pointer hover:bg-accent rounded px-2 py-1">Settings</div>
      </div>
      <Separator />
      <div className="space-y-1">
        <div className="text-sm cursor-pointer hover:bg-accent rounded px-2 py-1">Help</div>
        <div className="text-sm cursor-pointer hover:bg-accent rounded px-2 py-1">Sign Out</div>
      </div>
    </div>
  ),
}

export const VerticalNav: Story = {
  render: () => (
    <div className="flex items-center h-8 space-x-4 text-sm">
      <a href="#" className="hover:text-foreground text-muted-foreground">Dashboard</a>
      <Separator orientation="vertical" />
      <a href="#" className="hover:text-foreground text-muted-foreground">Users</a>
      <Separator orientation="vertical" />
      <a href="#" className="hover:text-foreground text-muted-foreground">Settings</a>
      <Separator orientation="vertical" />
      <a href="#" className="hover:text-foreground text-muted-foreground">Sign Out</a>
    </div>
  ),
}
