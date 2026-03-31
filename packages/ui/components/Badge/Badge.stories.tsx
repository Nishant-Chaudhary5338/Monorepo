import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "./Badge"

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
}

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
}

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
}

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Featured
      </>
    ),
    variant: "default",
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Offline</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
}

export const NotificationBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 text-xs -top-2 -right-2">
          3
        </Badge>
      </div>
      <div className="relative">
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <Badge
          variant="destructive"
          className="absolute flex items-center justify-center w-5 h-5 p-0 text-xs -top-2 -right-2"
        >
          12
        </Badge>
      </div>
    </div>
  ),
}

export const ProductTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">New</Badge>
      <Badge variant="secondary">Sale</Badge>
      <Badge variant="destructive">Sold Out</Badge>
      <Badge variant="outline">Limited Edition</Badge>
    </div>
  ),
}

export const UserRoles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Admin</Badge>
      <Badge variant="secondary">Editor</Badge>
      <Badge variant="outline">Viewer</Badge>
      <Badge variant="destructive">Suspended</Badge>
    </div>
  ),
}

export const CategoryBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">React</Badge>
      <Badge variant="secondary">TypeScript</Badge>
      <Badge variant="outline">JavaScript</Badge>
      <Badge variant="default">CSS</Badge>
      <Badge variant="secondary">Node.js</Badge>
    </div>
  ),
}

export const PriorityBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="destructive">High</Badge>
      <Badge variant="default">Medium</Badge>
      <Badge variant="secondary">Low</Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">
        <span className="w-2 h-2 mr-1.5 rounded-full bg-white" />
        Online
      </Badge>
      <Badge variant="secondary">
        <span className="w-2 h-2 mr-1.5 rounded-full bg-gray-500" />
        Away
      </Badge>
      <Badge variant="destructive">
        <span className="w-2 h-2 mr-1.5 rounded-full bg-white" />
        Busy
      </Badge>
      <Badge variant="outline">
        <span className="w-2 h-2 mr-1.5 rounded-full bg-gray-400" />
        Offline
      </Badge>
    </div>
  ),
}

export const CountBadge: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span>Messages</span>
        <Badge>24</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Tasks</span>
        <Badge variant="secondary">8</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Errors</span>
        <Badge variant="destructive">3</Badge>
      </div>
    </div>
  ),
}

export const InteractiveBadge: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="transition-colors cursor-pointer hover:bg-primary/80">
        Clickable
      </Badge>
      <Badge
        variant="outline"
        className="transition-colors cursor-pointer hover:bg-accent"
      >
        Hover me
      </Badge>
    </div>
  ),
}

export const BadgeWithAvatar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
          <span className="text-sm font-medium">JD</span>
        </div>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <div className="relative">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
          <span className="text-sm font-medium">AS</span>
        </div>
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
        >
          !
        </Badge>
      </div>
    </div>
  ),
}