import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
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
