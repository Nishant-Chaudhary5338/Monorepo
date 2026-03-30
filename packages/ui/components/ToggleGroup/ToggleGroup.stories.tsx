import type { Meta, StoryObj } from '@storybook/react'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Default: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Left aligned"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center" variant="outline">
      <ToggleGroupItem value="left" aria-label="Left aligned"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Bold"><Bold className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><Underline className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Small: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center" size="sm" variant="outline">
      <ToggleGroupItem value="left" aria-label="Left aligned"><AlignLeft className="h-3 w-3" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned"><AlignCenter className="h-3 w-3" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned"><AlignRight className="h-3 w-3" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Large: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center" size="lg" variant="outline">
      <ToggleGroupItem value="left" aria-label="Left aligned"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const WithText: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="day">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center" disabled>
      <ToggleGroupItem value="left" aria-label="Left aligned"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const TextFormatting: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium mb-2">Text Style</p>
        <ToggleGroup type="multiple" variant="outline">
          <ToggleGroupItem value="bold" aria-label="Bold"><Bold className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline"><Underline className="h-4 w-4" /></ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Alignment</p>
        <ToggleGroup type="single" defaultValue="left" variant="outline">
          <ToggleGroupItem value="left" aria-label="Left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="justify" aria-label="Justify"><AlignJustify className="h-4 w-4" /></ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
}
