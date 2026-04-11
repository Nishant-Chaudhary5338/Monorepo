import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Button', variant: 'default', size: 'default' },
}

export const Destructive: Story = {
  args: { children: 'Button', variant: 'destructive' },
}

export const Outline: Story = {
  args: { children: 'Button', variant: 'outline' },
}

export const Small: Story = {
  args: { children: 'Button', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Button', size: 'lg' },
}
