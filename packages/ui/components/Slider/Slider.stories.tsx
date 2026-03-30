import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./Slider"

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  render: () => <Slider defaultValue={[50]} max={100} step={1} className="w-[300px]" />,
}

export const WithRange: Story = {
  render: () => <Slider defaultValue={[25, 75]} max={100} step={1} className="w-[300px]" />,
}

export const Disabled: Story = {
  render: () => (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      disabled
      className="w-[300px]"
    />
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="flex justify-between text-sm">
        <span>Volume</span>
        <span>50%</span>
      </div>
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  ),
}

export const WithSteps: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="flex justify-between text-sm">
        <span>Brightness</span>
        <span>75%</span>
      </div>
      <Slider defaultValue={[75]} max={100} step={25} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  ),
}
