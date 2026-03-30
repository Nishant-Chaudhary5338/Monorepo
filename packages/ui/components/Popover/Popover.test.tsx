import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './Popover'

describe('Popover', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default popover', () => {
      const { container } = render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for open popover', () => {
      const { container } = render(
        <Popover open>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders trigger successfully', () => {
      const { container } = render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Open Popover')).toBeInTheDocument()
    })

    it('renders content when open', () => {
      render(
        <Popover open>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Popover content')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to trigger', () => {
      const { container } = render(
        <Popover>
          <PopoverTrigger className="custom-trigger">Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      const trigger = container.querySelector('[data-state]')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Popover>
          <PopoverTrigger data-testid="my-popover">Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      expect(screen.getByTestId('my-popover')).toBeInTheDocument()
    })
  })

  describe('Controlled State', () => {
    it('respects open prop', () => {
      render(
        <Popover open>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Popover content')).toBeInTheDocument()
    })

    it('does not show content when open is false', () => {
      render(
        <Popover open={false}>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onOpenChange when state changes', () => {
      const handleOpenChange = vi.fn()
      render(
        <Popover onOpenChange={handleOpenChange}>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      fireEvent.click(screen.getByText('Open'))
      expect(handleOpenChange).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('trigger has correct role', () => {
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      const trigger = screen.getByText('Open')
      expect(trigger).toHaveAttribute('data-state', 'closed')
    })

    it('supports aria-label', () => {
      render(
        <Popover>
          <PopoverTrigger aria-label="Open popover">Open</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
      const trigger = screen.getByText('Open')
      expect(trigger).toHaveAttribute('aria-label', 'Open popover')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty popover', () => {
      const { container } = render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent></PopoverContent>
        </Popover>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex content', () => {
      render(
        <Popover open>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <div>
              <h3>Title</h3>
              <p>Description</p>
              <button>Action</button>
            </div>
          </PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})