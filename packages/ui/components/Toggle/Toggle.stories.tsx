import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from './Toggle'
import { Bold, Italic, Underline } from 'lucide-react'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: {
    'aria-label': 'Toggle italic',
    children: <Italic className="h-4 w-4" />,
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    'aria-label': 'Toggle italic',
    children: <Italic className="h-4 w-4" />,
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    'aria-label': 'Toggle italic',
    children: <Italic className="h-4 w-4" />,
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    'aria-label': 'Toggle italic',
    children: <Italic className="h-4 w-4" />,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Toggle italic',
    children: <Italic className="h-4 w-4" />,
  },
}

export const WithText: Story = {
  args: {
    'aria-label': 'Toggle bold',
    children: (<><Bold className="h-4 w-4 mr-2" /> Bold</>),
  },
}

export const Pressed: Story = {
  args: {
    defaultPressed: true,
    'aria-label': 'Toggle italic',
    children: <Italic className="h-4 w-4" />,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Toggle variant="default" aria-label="Default toggle"><Bold className="h-4 w-4" /></Toggle>
      <Toggle variant="outline" aria-label="Outline toggle"><Bold className="h-4 w-4" /></Toggle>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Toggle size="sm" aria-label="Small"><Bold className="h-4 w-4" /></Toggle>
      <Toggle size="default" aria-label="Default"><Bold className="h-4 w-4" /></Toggle>
      <Toggle size="lg" aria-label="Large"><Bold className="h-4 w-4" /></Toggle>
    </div>
  ),
}

export const Toolbar: Story = {
  render: () => (
    <div className="flex gap-1">
      <Toggle variant="outline" aria-label="Bold"><Bold className="h-4 w-4" /></Toggle>
      <Toggle variant="outline" aria-label="Italic"><Italic className="h-4 w-4" /></Toggle>
      <Toggle variant="outline" aria-label="Underline"><Underline className="h-4 w-4" /></Toggle>
    </div>
  ),
}
