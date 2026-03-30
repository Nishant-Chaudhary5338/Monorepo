import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from './Calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => <Calendar mode="single" className="rounded-md border" />,
}

export const WithSelectedDate: Story = {
  render: () => <Calendar mode="single" selected={new Date()} className="rounded-md border" />,
}

export const RangeSelection: Story = {
  render: () => (
    <Calendar
      mode="range"
      defaultMonth={new Date()}
      numberOfMonths={2}
      className="rounded-md border"
    />
  ),
}

export const MultipleMonths: Story = {
  render: () => (
    <Calendar
      mode="single"
      numberOfMonths={2}
      className="rounded-md border"
    />
  ),
}

export const WithDisabledDates: Story = {
  render: () => (
    <Calendar
      mode="single"
      disabled={{ before: new Date() }}
      className="rounded-md border"
    />
  ),
}

export const WithFooter: Story = {
  render: () => (
    <div className="border rounded-md">
      <Calendar mode="single" />
      <div className="border-t p-3 text-center text-sm text-muted-foreground">
        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
    </div>
  ),
}

export const DateRange: Story = {
  render: () => (
    <div className="border rounded-md p-4">
      <Calendar
        mode="range"
        defaultMonth={new Date(2024, 0)}
        numberOfMonths={1}
      />
    </div>
  ),
}
