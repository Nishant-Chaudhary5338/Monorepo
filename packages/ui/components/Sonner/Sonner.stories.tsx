import type { Meta, StoryObj } from '@storybook/react'
import { Toaster } from './Sonner'
import { toast } from 'sonner'
import { Button } from '../Button/Button'

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toaster',
  component: Toaster,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Toaster>

export const Default: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button onClick={() => toast('This is a toast notification')}>Show Toast</Button>
    </div>
  ),
}

export const Success: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button onClick={() => toast.success('Operation completed successfully!')}>Success Toast</Button>
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button variant="destructive" onClick={() => toast.error('Something went wrong!')}>Error Toast</Button>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button onClick={() => toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm' })}>With Description</Button>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button onClick={() => toast('Event has been created', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })}>With Action</Button>
    </div>
  ),
}

export const Promise: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button onClick={() => {
        const promise = () => new Promise((resolve) => setTimeout(resolve, 2000))
        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Successfully saved!',
          error: 'Failed to save',
        })
      }}>Promise Toast</Button>
    </div>
  ),
}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster />
      <Button variant="outline" onClick={() => toast('Default toast')}>Default</Button>
      <Button variant="outline" onClick={() => toast.success('Success!')}>Success</Button>
      <Button variant="outline" onClick={() => toast.error('Error!')}>Error</Button>
      <Button variant="outline" onClick={() => toast.warning('Warning!')}>Warning</Button>
      <Button variant="outline" onClick={() => toast.info('Info!')}>Info</Button>
    </div>
  ),
}
