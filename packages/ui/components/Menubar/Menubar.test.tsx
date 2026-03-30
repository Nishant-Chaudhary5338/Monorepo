import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './Menubar'

describe('Menubar', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default menubar', () => {
      const { container } = render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New Tab</MenubarItem>
              <MenubarItem>New Window</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New Tab</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New Tab</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      expect(screen.getByText('File')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Menubar className="custom-menubar">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      )
      expect(container.firstChild).toHaveClass('custom-menubar')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Menubar data-testid="my-menubar">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-menubar')
    })
  })

  describe('Items', () => {
    it('renders menu items', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New Tab</MenubarItem>
              <MenubarItem>New Window</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      expect(screen.getByText('New Tab')).toBeInTheDocument()
      expect(screen.getByText('New Window')).toBeInTheDocument()
    })

    it('handles item selection', () => {
      const handleSelect = vi.fn()
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={handleSelect}>New Tab</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      fireEvent.click(screen.getByText('New Tab'))
      expect(handleSelect).toHaveBeenCalled()
    })
  })

  describe('Checkbox Items', () => {
    it('renders checkbox items', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>Show Bookmarks</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      expect(screen.getByText('Show Bookmarks')).toBeInTheDocument()
    })
  })

  describe('Radio Items', () => {
    it('renders radio items', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Theme</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value="light">
                <MenubarRadioItem value="light">Light</MenubarRadioItem>
                <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      expect(screen.getByText('Light')).toBeInTheDocument()
      expect(screen.getByText('Dark')).toBeInTheDocument()
    })
  })

  describe('Labels and Separators', () => {
    it('renders labels', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarLabel>Actions</MenubarLabel>
              <MenubarItem>New Tab</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('renders separators', () => {
      const { container } = render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New Tab</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>New Window</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      const separators = container.querySelectorAll('[role="separator"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Shortcuts', () => {
    it('renders shortcuts', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab
                <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      expect(screen.getByText('⌘T')).toBeInTheDocument()
    })
  })

  describe('Disabled Items', () => {
    it('disables items', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled>New Tab</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
      const item = screen.getByText('New Tab')
      expect(item).toHaveAttribute('data-disabled', 'true')
    })
  })

  describe('Accessibility', () => {
    it('has menubar role', () => {
      const { container } = render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      )
      expect(container.firstChild).toHaveAttribute('role', 'menubar')
    })

    it('supports aria-label', () => {
      const { container } = render(
        <Menubar aria-label="Main menu">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Main menu')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty menubar', () => {
      const { container } = render(<Menubar />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles many menus', () => {
      const menus = Array.from({ length: 5 }, (_, i) => (
        <MenubarMenu key={i}>
          <MenubarTrigger>Menu {i}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Item {i}</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      ))
      render(<Menubar>{menus}</Menubar>)
      expect(screen.getByText('Menu 0')).toBeInTheDocument()
      expect(screen.getByText('Menu 4')).toBeInTheDocument()
    })
  })
})