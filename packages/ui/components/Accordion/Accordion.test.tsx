import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

describe('Accordion', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for basic accordion', () => {
      const { container } = render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for multiple accordion', () => {
      const { container } = render(
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for collapsible accordion', () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Collapsible</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Click me</AccordionTrigger>
            <AccordionContent>Expanded content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('renders multiple items', () => {
      render(
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Item 3</AccordionTrigger>
            <AccordionContent>Content 3</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })
  })

  describe('Single Accordion', () => {
    it('expands item when trigger is clicked', async () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Expanded Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      fireEvent.click(screen.getByText('Trigger'))
      await waitFor(() => {
        expect(screen.getByText('Expanded Content')).toBeInTheDocument()
      })
    })

    it('only allows one item open at a time', async () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      fireEvent.click(screen.getByText('Item 1'))
      await waitFor(() => {
        expect(screen.getByText('Content 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Item 2'))
      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument()
      })

      await waitFor(() => {
        expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
      })
    })

    it('supports collapsible prop', async () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      fireEvent.click(screen.getByText('Trigger'))
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Trigger'))
      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument()
      })
    })
  })

  describe('Multiple Accordion', () => {
    it('allows multiple items open', async () => {
      render(
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      fireEvent.click(screen.getByText('Item 1'))
      await waitFor(() => {
        expect(screen.getByText('Content 1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Item 2'))
      await waitFor(() => {
        expect(screen.getByText('Content 1')).toBeInTheDocument()
        expect(screen.getByText('Content 2')).toBeInTheDocument()
      })
    })
  })

  describe('Controlled State', () => {
    it('respects value prop for single accordion', async () => {
      render(
        <Accordion type="single" value="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      await waitFor(() => {
        expect(screen.getByText('Content 1')).toBeInTheDocument()
      })
    })

    it('calls onValueChange when item is toggled', async () => {
      const handleValueChange = vi.fn()

      render(
        <Accordion type="single" onValueChange={handleValueChange}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      fireEvent.click(screen.getByText('Item 1'))
      expect(handleValueChange).toHaveBeenCalledWith('item-1')
    })
  })

  describe('Props', () => {
    it('applies custom className to accordion', () => {
      const { container } = render(
        <Accordion type="single" className="custom-accordion">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(container.firstChild).toHaveClass('custom-accordion')
    })

    it('applies custom className to item', () => {
      const { container } = render(
        <Accordion type="single">
          <AccordionItem value="item-1" className="custom-item">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(container.querySelector('[data-state]')).toHaveClass('custom-item')
    })

    it('applies custom className to trigger', () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger className="custom-trigger">
              Trigger
            </AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(screen.getByText('Trigger')).toHaveClass('custom-trigger')
    })

    it('applies custom className to content', async () => {
      const { container } = render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent className="custom-content">
              Content
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      await waitFor(() => {
        expect(container.querySelector('[role="region"]')).toHaveClass(
          'custom-content'
        )
      })
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Accordion type="single" data-testid="my-accordion">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-accordion')
    })
  })

  describe('Accessibility', () => {
    it('trigger has button role', () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('content has region role when expanded', async () => {
      const { container } = render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      await waitFor(() => {
        expect(container.querySelector('[role="region"]')).toBeInTheDocument()
      })
    })

    it('trigger has aria-expanded when open', async () => {
      render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-expanded',
          'true'
        )
      })
    })

    it('supports aria-controls', async () => {
      render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      const trigger = screen.getByRole('button')
      const controls = trigger.getAttribute('aria-controls')
      expect(controls).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty accordion', () => {
      const { container } = render(<Accordion type="single" />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles item without content', () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger Only</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      )
      expect(screen.getByText('Trigger Only')).toBeInTheDocument()
    })

    it('handles complex content', async () => {
      render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Complex</AccordionTrigger>
            <AccordionContent>
              <div>
                <p>Paragraph 1</p>
                <p>Paragraph 2</p>
                <button>Action</button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      await waitFor(() => {
        expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
        expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
        expect(screen.getByText('Action')).toBeInTheDocument()
      })
    })

    it('handles disabled items', () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1" disabled>
            <AccordionTrigger>Disabled</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      )

      fireEvent.click(screen.getByText('Disabled'))
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })
  })
})