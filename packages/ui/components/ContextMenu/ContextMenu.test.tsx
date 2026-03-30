import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './ContextMenu'

describe('ContextMenu', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default context menu', () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
            <ContextMenuItem>Billing</ContextMenuItem>
            <ContextMenuItem>Settings</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders trigger successfully', () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(screen.getByText('Right click me')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to trigger', () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuTrigger className="custom-trigger">Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      const trigger = container.querySelector('[data-state]')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuTrigger data-testid="my-context-menu">Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(screen.getByTestId('my-context-menu')).toBeInTheDocument()
    })
  })

  describe('Items', () => {
    it('renders menu items', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
            <ContextMenuItem>Billing</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Billing')).toBeInTheDocument()
    })

    it('handles item selection', () => {
      const handleSelect = vi.fn()
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={handleSelect}>Profile</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      fireEvent.click(screen.getByText('Profile'))
      expect(handleSelect).toHaveBeenCalled()
    })
  })

  describe('Checkbox Items', () => {
    it('renders checkbox items', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(screen.getByText('Show Bookmarks')).toBeInTheDocument()
    })
  })

  describe('Radio Items', () => {
    it('renders radio items', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuRadioGroup value="light">
              <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
              <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
    })
  })

  describe('Labels and Separators', () => {
    it('renders labels', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>My Account</ContextMenuLabel>
            <ContextMenuItem>Profile</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(screen.getByText('My Account')).toBeInTheDocument()
    })

    it('renders separators', () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Settings</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      const separators = container.querySelectorAll('[role="separator"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Shortcuts', () => {
    it('renders shortcuts', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              Profile
              <ContextMenuShortcut>⌘P</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      expect(screen.getByText('⌘P')).toBeInTheDocument()
    })
  })

  describe('Disabled Items', () => {
    it('disables items', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem disabled>Profile</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      const item = screen.getByText('Profile')
      expect(item).toHaveAttribute('data-disabled', 'true')
    })
  })

  describe('Accessibility', () => {
    it('trigger has correct role', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Profile</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )
      const trigger = screen.getByText('Right click me')
      expect(trigger).toHaveAttribute('data-state', 'closed')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty context menu', () => {
      const { container } = render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent></ContextMenuContent>
        </ContextMenu>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles many items', () => {
      const items = Array.from({ length: 10 }, (_, i) => (
        <ContextMenuItem key={i}>Item {i}</ContextMenuItem>
      ))
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>{items}</ContextMenuContent>
        </ContextMenu>
      )
      expect(screen.getByText('Item 0')).toBeInTheDocument()
      expect(screen.getByText('Item 9')).toBeInTheDocument()
    })
  })
})