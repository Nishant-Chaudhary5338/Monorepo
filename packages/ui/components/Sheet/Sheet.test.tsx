import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './Sheet'

describe('Sheet', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default sheet', () => {
      const { container } = render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders trigger successfully', () => {
      const { container } = render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText('Open Sheet')).toBeInTheDocument()
    })

    it('renders content when open', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText('Sheet Title')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to trigger', () => {
      const { container } = render(
        <Sheet>
          <SheetTrigger className="custom-trigger">Open</SheetTrigger>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      const trigger = container.querySelector('[data-state]')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Sheet>
          <SheetTrigger data-testid="my-sheet">Open</SheetTrigger>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByTestId('my-sheet')).toBeInTheDocument()
    })
  })

  describe('Header', () => {
    it('renders sheet title', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>My Sheet</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText('My Sheet')).toBeInTheDocument()
    })

    it('renders sheet description', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>This is a description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText('This is a description')).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders footer content', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetFooter>
              <button>Action</button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })

  describe('Close', () => {
    it('renders close button', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetClose>Close</SheetClose>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText('Close')).toBeInTheDocument()
    })

    it('calls onOpenChange when close is clicked', () => {
      const handleOpenChange = vi.fn()
      render(
        <Sheet open onOpenChange={handleOpenChange}>
          <SheetContent>
            <SheetClose>Close</SheetClose>
          </SheetContent>
        </Sheet>
      )
      fireEvent.click(screen.getByText('Close'))
      expect(handleOpenChange).toHaveBeenCalled()
    })
  })

  describe('Controlled State', () => {
    it('respects open prop', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetTitle>Open Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText('Open Sheet')).toBeInTheDocument()
    })

    it('does not show content when open is false', () => {
      render(
        <Sheet open={false}>
          <SheetContent>
            <SheetTitle>Hidden Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(screen.queryByText('Hidden Sheet')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('dialog has correct role', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetTitle>Accessible Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(
        <Sheet open>
          <SheetContent aria-label="Sheet panel">
            <SheetTitle>Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-label', 'Sheet panel')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty sheet', () => {
      const { container } = render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent></SheetContent>
        </Sheet>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex content', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Complex Sheet</SheetTitle>
            </SheetHeader>
            <div>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
            <SheetFooter>
              <button>Action</button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})