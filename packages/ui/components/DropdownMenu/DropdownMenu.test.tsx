import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu'

describe('DropdownMenu', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default dropdown menu', () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders trigger successfully', () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Open Menu')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to trigger', () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger className="custom-trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      const trigger = container.querySelector('[data-state]')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="my-dropdown">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByTestId('my-dropdown')).toBeInTheDocument()
    })
  })

  describe('Items', () => {
    it('renders menu items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Billing')).toBeInTheDocument()
    })

    it('handles item selection', () => {
      const handleSelect = vi.fn()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleSelect}>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      fireEvent.click(screen.getByText('Profile'))
      expect(handleSelect).toHaveBeenCalled()
    })
  })

  describe('Checkbox Items', () => {
    it('renders checkbox items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>Show Bookmarks</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Show Bookmarks')).toBeInTheDocument()
    })
  })

  describe('Radio Items', () => {
    it('renders radio items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="light">
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
    })
  })

  describe('Labels and Separators', () => {
    it('renders labels', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('My Account')).toBeInTheDocument()
    })

    it('renders separators', () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      const separators = container.querySelectorAll('[role="separator"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Shortcuts', () => {
    it('renders shortcuts', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('⌘P')).toBeInTheDocument()
    })
  })

  describe('Disabled Items', () => {
    it('disables items', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      const item = screen.getByText('Profile')
      expect(item).toHaveAttribute('data-disabled', 'true')
    })
  })

  describe('Accessibility', () => {
    it('trigger has button role', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Open menu">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', 'Open menu')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty dropdown menu', () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent></DropdownMenuContent>
        </DropdownMenu>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles many items', () => {
      const items = Array.from({ length: 10 }, (_, i) => (
        <DropdownMenuItem key={i}>Item {i}</DropdownMenuItem>
      ))
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>{items}</DropdownMenuContent>
        </DropdownMenu>
      )
      expect(screen.getByText('Item 0')).toBeInTheDocument()
      expect(screen.getByText('Item 9')).toBeInTheDocument()
    })
  })
})