import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'Enter your email' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Enter password' },
}

export const Search: Story = {
  args: { type: 'search', placeholder: 'Search...' },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true },
}

export const WithValue: Story = {
  args: { value: 'Pre-filled value', readOnly: true },
}
