import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './Collapsible'

describe('Collapsible', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default collapsible', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for open collapsible', () => {
      const { container } = render(
        <Collapsible open>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(screen.getByText('Toggle')).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('Interactions', () => {
    it('toggles content when trigger is clicked', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      const trigger = screen.getByText('Toggle')
      fireEvent.click(trigger)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('calls onOpenChange when toggled', () => {
      const handleOpenChange = vi.fn()
      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      const trigger = screen.getByText('Toggle')
      fireEvent.click(trigger)
      expect(handleOpenChange).toHaveBeenCalled()
    })
  })

  describe('Controlled State', () => {
    it('respects open prop', () => {
      render(
        <Collapsible open>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('does not show content when open is false', () => {
      render(
        <Collapsible open={false}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Collapsible className="custom-collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(container.firstChild).toHaveClass('custom-collapsible')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Collapsible data-testid="my-collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-collapsible')
    })
  })

  describe('Disabled State', () => {
    it('disables trigger when disabled', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      const trigger = screen.getByText('Toggle')
      expect(trigger).toHaveAttribute('disabled')
    })
  })

  describe('Accessibility', () => {
    it('trigger has button role', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger aria-label="Toggle section">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', 'Toggle section')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty collapsible', () => {
      const { container } = render(<Collapsible />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex content', () => {
      render(
        <Collapsible open>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>
              <h2>Heading</h2>
              <p>Paragraph</p>
              <button>Action</button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
      expect(screen.getByText('Heading')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})