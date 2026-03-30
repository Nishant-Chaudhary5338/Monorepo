import type { Meta, StoryObj } from '@storybook/react'
import { NavigationMenu } from './NavigationMenu'

const meta: Meta<typeof NavigationMenu> = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NavigationMenu>

export const Default: Story = {}
