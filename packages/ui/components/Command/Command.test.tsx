import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './Command'

describe('Command', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default command', () => {
      const { container } = render(
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </Command>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders input', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      )
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('renders command items', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )
      expect(screen.getByText('Calendar')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
    })

    it('renders empty state', () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </Command>
      )
      expect(screen.getByText('No results found.')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Command className="custom-command">
          <CommandInput />
        </Command>
      )
      expect(container.firstChild).toHaveClass('custom-command')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Command data-testid="my-command">
          <CommandInput />
        </Command>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-command')
    })
  })

  describe('Input', () => {
    it('handles input changes', () => {
      const handleValueChange = vi.fn()
      render(
        <Command>
          <CommandInput onValueChange={handleValueChange} />
        </Command>
      )
      const input = screen.getByRole('combobox')
      fireEvent.change(input, { target: { value: 'test' } })
      expect(handleValueChange).toHaveBeenCalledWith('test')
    })

    it('applies placeholder', () => {
      render(
        <Command>
          <CommandInput placeholder="Enter command" />
        </Command>
      )
      expect(screen.getByPlaceholderText('Enter command')).toBeInTheDocument()
    })
  })

  describe('Groups', () => {
    it('renders group heading', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Actions">
              <CommandItem>Action 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })
  })

  describe('Items', () => {
    it('renders item with shortcut', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                Calendar
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )
      expect(screen.getByText('⌘K')).toBeInTheDocument()
    })

    it('handles item selection', () => {
      const handleSelect = vi.fn()
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={handleSelect}>Calendar</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )
      fireEvent.click(screen.getByText('Calendar'))
      expect(handleSelect).toHaveBeenCalled()
    })
  })

  describe('Separator', () => {
    it('renders separator', () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )
      const separators = container.querySelectorAll('[role="separator"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('input has combobox role', () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      const { container } = render(
        <Command aria-label="Command palette">
          <CommandInput />
        </Command>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Command palette')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty command', () => {
      const { container } = render(<Command />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles many items', () => {
      const items = Array.from({ length: 20 }, (_, i) => (
        <CommandItem key={i}>Item {i}</CommandItem>
      ))
      render(
        <Command>
          <CommandList>
            <CommandGroup>{items}</CommandGroup>
          </CommandList>
        </Command>
      )
      expect(screen.getByText('Item 0')).toBeInTheDocument()
      expect(screen.getByText('Item 19')).toBeInTheDocument()
    })
  })
})