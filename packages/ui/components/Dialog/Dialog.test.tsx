import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './Dialog'

describe('Dialog', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for closed dialog', () => {
      const { container } = render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for open dialog', () => {
      const { container } = render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Open Dialog</DialogTitle>
              <DialogDescription>This dialog is open</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for dialog with footer', () => {
      const { container } = render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders trigger button', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Open Dialog')).toBeInTheDocument()
    })

    it('renders dialog content when open', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
      expect(screen.getByText('Dialog description')).toBeInTheDocument()
    })

    it('renders dialog header with correct structure', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription>Description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('renders dialog footer', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogFooter>
              <button>Cancel</button>
              <button>Save</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('opens dialog when trigger is clicked', async () => {
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Opened Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Open'))
      await waitFor(() => {
        expect(screen.getByText('Opened Dialog')).toBeInTheDocument()
      })
    })

    it('calls onOpenChange when dialog state changes', async () => {
      const handleOpenChange = vi.fn()

      render(
        <Dialog onOpenChange={handleOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.click(screen.getByText('Open'))
      expect(handleOpenChange).toHaveBeenCalledWith(true)
    })

    it('closes dialog when close button is clicked', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument()
      })
    })

    it('closes dialog when Escape key is pressed', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('Controlled State', () => {
    it('respects open prop', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Controlled Dialog')).toBeInTheDocument()
    })

    it('does not show content when open is false', () => {
      render(
        <Dialog open={false}>
          <DialogContent>
            <DialogTitle>Hidden Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.queryByText('Hidden Dialog')).not.toBeInTheDocument()
    })

    it('updates when open prop changes', () => {
      const { rerender } = render(
        <Dialog open={false}>
          <DialogContent>
            <DialogTitle>Dynamic Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.queryByText('Dynamic Dialog')).not.toBeInTheDocument()

      rerender(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle>Dynamic Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Dynamic Dialog')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('dialog has correct role', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('dialog title is associated with dialog', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      const dialog = screen.getByRole('dialog')
      const title = screen.getByText('Dialog Title')
      expect(dialog).toContainElement(title)
    })

    it('supports aria-labelledby', () => {
      render(
        <Dialog open>
          <DialogContent aria-labelledby="custom-title">
            <DialogTitle id="custom-title">Custom Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'custom-title')
    })

    it('supports aria-describedby', () => {
      render(
        <Dialog open>
          <DialogContent aria-describedby="custom-desc">
            <DialogDescription id="custom-desc">
              Dialog description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-describedby', 'custom-desc')
    })

    it('focus is trapped inside dialog when open', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Focus Trap Test</DialogTitle>
            <button>First Button</button>
            <button>Second Button</button>
          </DialogContent>
        </Dialog>
      )

      const firstButton = screen.getByText('First Button')
      const secondButton = screen.getByText('Second Button')

      firstButton.focus()
      expect(firstButton).toHaveFocus()

      fireEvent.keyDown(firstButton, { key: 'Tab' })
      expect(secondButton).toHaveFocus()
    })
  })

  describe('Props', () => {
    it('applies custom className to content', () => {
      render(
        <Dialog open>
          <DialogContent className="custom-dialog">
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('custom-dialog')
    })

    it('passes through additional HTML attributes', () => {
      render(
        <Dialog open>
          <DialogContent data-testid="dialog-content">
            <DialogTitle>Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles dialog without title', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogDescription>Description only</DialogDescription>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('handles dialog with complex children', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complex Dialog</DialogTitle>
            </DialogHeader>
            <div>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
            <DialogFooter>
              <button>Action</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    it('handles multiple dialogs', () => {
      render(
        <>
          <Dialog open>
            <DialogContent>
              <DialogTitle>First Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
          <Dialog open>
            <DialogContent>
              <DialogTitle>Second Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      )
      expect(screen.getByText('First Dialog')).toBeInTheDocument()
      expect(screen.getByText('Second Dialog')).toBeInTheDocument()
    })
  })
})