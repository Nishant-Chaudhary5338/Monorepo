import type { Meta, StoryObj } from '@storybook/react'
import { ToggleGroup } from './ToggleGroup'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Default: Story = {}
