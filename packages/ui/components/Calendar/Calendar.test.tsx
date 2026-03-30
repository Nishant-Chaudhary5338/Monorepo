import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Calendar } from './Calendar'

describe('Calendar', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default calendar', () => {
      const { container } = render(<Calendar mode="single" />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for calendar with selected date', () => {
      const { container } = render(
        <Calendar mode="single" selected={new Date(2024, 0, 15)} />
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Calendar mode="single" />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(<Calendar mode="single" />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('renders month and year', () => {
      render(<Calendar mode="single" month={new Date(2024, 0, 1)} />)
      expect(screen.getByText('January 2024')).toBeInTheDocument()
    })

    it('renders day names', () => {
      render(<Calendar mode="single" />)
      expect(screen.getByText('Mo')).toBeInTheDocument()
      expect(screen.getByText('Tu')).toBeInTheDocument()
      expect(screen.getByText('We')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('navigates to next month', () => {
      render(<Calendar mode="single" month={new Date(2024, 0, 1)} />)
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      expect(screen.getByText('February 2024')).toBeInTheDocument()
    })

    it('navigates to previous month', () => {
      render(<Calendar mode="single" month={new Date(2024, 0, 1)} />)
      const prevButton = screen.getByRole('button', { name: /previous/i })
      fireEvent.click(prevButton)
      expect(screen.getByText('December 2023')).toBeInTheDocument()
    })
  })

  describe('Date Selection', () => {
    it('selects a date when clicked', () => {
      const handleSelect = vi.fn()
      render(<Calendar mode="single" onSelect={handleSelect} />)
      const dayButton = screen.getByText('15')
      fireEvent.click(dayButton)
      expect(handleSelect).toHaveBeenCalled()
    })

    it('highlights selected date', () => {
      const selectedDate = new Date(2024, 0, 15)
      const { container } = render(
        <Calendar mode="single" selected={selectedDate} />
      )
      const selectedDay = container.querySelector('[aria-selected="true"]')
      expect(selectedDay).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Calendar mode="single" className="custom-calendar" />
      )
      expect(container.firstChild).toHaveClass('custom-calendar')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Calendar mode="single" data-testid="my-calendar" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-calendar')
    })
  })

  describe('Disabled Dates', () => {
    it('disables specific dates', () => {
      const disabledDate = new Date(2024, 0, 15)
      render(<Calendar mode="single" disabled={[disabledDate]} />)
      const dayButton = screen.getByText('15')
      expect(dayButton).toHaveAttribute('disabled')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty calendar', () => {
      const { container } = render(<Calendar mode="single" />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles different months', () => {
      render(<Calendar mode="single" month={new Date(2024, 11, 1)} />)
      expect(screen.getByText('December 2024')).toBeInTheDocument()
    })
  })
})
