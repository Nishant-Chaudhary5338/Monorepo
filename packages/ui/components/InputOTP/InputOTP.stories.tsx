import type { Meta, StoryObj } from '@storybook/react'
import { InputOTP } from './InputOTP'

const meta: Meta<typeof InputOTP> = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InputOTP>

export const Default: Story = {}
