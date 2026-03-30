import type { Meta, StoryObj } from "@storybook/react"
import { Skeleton } from "./Skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => <Skeleton className="w-[100px] h-[20px] rounded-full" />,
}

export const Card: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
}

export const TextLines: Story = {
  render: () => (
    <div className="space-y-2 w-[400px]">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
    </div>
  ),
}

export const ProfileCard: Story = {
  render: () => (
    <div className="flex flex-col space-y-3 w-[300px] p-4 border rounded-lg">
      <Skeleton className="w-full h-[200px] rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="w-16 h-8 rounded-md" />
        <Skeleton className="w-16 h-8 rounded-md" />
      </div>
    </div>
  ),
}
