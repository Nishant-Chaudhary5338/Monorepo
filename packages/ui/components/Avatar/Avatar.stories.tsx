import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar"
import { Badge } from "../Badge/Badge"

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-link.com/image.jpg" alt="@user" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="w-12 h-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="w-16 h-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+3</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const FallbackOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>CK</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full" />
      </div>
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 text-xs -top-1 -right-1">
          3
        </Badge>
      </div>
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Badge
          variant="destructive"
          className="absolute flex items-center justify-center w-5 h-5 p-0 text-xs -top-1 -right-1"
        >
          99+
        </Badge>
      </div>
    </div>
  ),
}

export const UserCard: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <Avatar className="w-12 h-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">John Doe</p>
        <p className="text-sm text-muted-foreground">@johndoe</p>
      </div>
    </div>
  ),
}

export const UserCardDetailed: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="relative">
        <Avatar className="w-14 h-14">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">John Doe</p>
          <Badge variant="secondary" className="text-xs">
            Pro
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Software Engineer</p>
        <p className="text-xs text-muted-foreground">Online</p>
      </div>
    </div>
  ),
}

export const TeamList: Story = {
  render: () => (
    <div className="flex flex-col max-w-sm gap-4">
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <span className="w-2 h-2 bg-green-500 rounded-full" />
      </div>
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <Avatar>
          <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">Jane Smith</p>
          <p className="text-xs text-muted-foreground">Developer</p>
        </div>
        <span className="w-2 h-2 bg-green-500 rounded-full" />
      </div>
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">Alice Brown</p>
          <p className="text-xs text-muted-foreground">Designer</p>
        </div>
        <span className="w-2 h-2 bg-gray-400 rounded-full" />
      </div>
    </div>
  ),
}

export const CommentAvatar: Story = {
  render: () => (
    <div className="flex max-w-md gap-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">John Doe</p>
          <span className="text-xs text-muted-foreground">2 hours ago</span>
        </div>
        <p className="text-sm text-muted-foreground">
          This is a great component library! Really enjoying using it in my
          projects.
        </p>
      </div>
    </div>
  ),
}

export const WithBorder: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="border-2 border-primary">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-green-500">
        <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-yellow-500">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const RoundedVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="rounded-none">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-sm">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-md">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-full">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const AvatarGroupStacked: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium">Team Members</p>
        <div className="flex -space-x-3">
          <Avatar className="border-2 border-background">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background bg-muted">
            <AvatarFallback>+5</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  ),
}

export const InitialsVariations: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="text-white bg-red-500">AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="text-white bg-blue-500">CK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="text-white bg-green-500">MZ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="text-white bg-purple-500">TS</AvatarFallback>
      </Avatar>
    </div>
  ),
}