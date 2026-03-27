import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
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
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { children: 'Input', variant: 'default', size: 'default' },
}

export const Destructive: Story = {
  args: { children: 'Input', variant: 'destructive' },
}

export const Outline: Story = {
  args: { children: 'Input', variant: 'outline' },
}

export const Small: Story = {
  args: { children: 'Input', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Input', size: 'lg' },
}
