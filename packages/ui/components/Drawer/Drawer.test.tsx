import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './Drawer'

describe('Drawer', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default drawer', () => {
      const { container } = render(
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>Drawer description</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders trigger successfully', () => {
      const { container } = render(
        <Drawer>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Open Drawer')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to trigger', () => {
      const { container } = render(
        <Drawer>
          <DrawerTrigger className="custom-trigger">Open</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      const trigger = container.querySelector('[data-state]')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Drawer>
          <DrawerTrigger data-testid="my-drawer">Open</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByTestId('my-drawer')).toBeInTheDocument()
    })
  })

  describe('Header', () => {
    it('renders drawer title', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>My Drawer</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('My Drawer')).toBeInTheDocument()
    })

    it('renders drawer description', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerHeader>
              <DrawerDescription>This is a description</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('This is a description')).toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    it('renders footer content', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerFooter>
              <button>Action</button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })

  describe('Close', () => {
    it('renders close button', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerClose>Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Close')).toBeInTheDocument()
    })

    it('calls onClose when close is clicked', () => {
      const handleClose = vi.fn()
      render(
        <Drawer open onClose={handleClose}>
          <DrawerContent>
            <DrawerClose>Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      )
      fireEvent.click(screen.getByText('Close'))
      expect(handleClose).toHaveBeenCalled()
    })
  })

  describe('Controlled State', () => {
    it('respects open prop', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerTitle>Open Drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Open Drawer')).toBeInTheDocument()
    })

    it('does not show content when open is false', () => {
      render(
        <Drawer open={false}>
          <DrawerContent>
            <DrawerTitle>Hidden Drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.queryByText('Hidden Drawer')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('dialog has correct role', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerTitle>Accessible Drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(
        <Drawer open>
          <DrawerContent aria-label="Drawer panel">
            <DrawerTitle>Drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-label', 'Drawer panel')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty drawer', () => {
      const { container } = render(
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent></DrawerContent>
        </Drawer>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex content', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Complex Drawer</DrawerTitle>
            </DrawerHeader>
            <div>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
            <DrawerFooter>
              <button>Action</button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})