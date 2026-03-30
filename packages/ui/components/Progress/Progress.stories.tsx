import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "./Progress"

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: { value: 33 },
}

export const Half: Story = {
  args: { value: 50 },
}

export const Complete: Story = {
  args: { value: 100 },
}

export const Zero: Story = {
  args: { value: 0 },
}

export const CustomWidth: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>45%</span>
        </div>
        <Progress value={45} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Loading</span>
          <span>75%</span>
        </div>
        <Progress value={75} />
      </div>
    </div>
  ),
}
