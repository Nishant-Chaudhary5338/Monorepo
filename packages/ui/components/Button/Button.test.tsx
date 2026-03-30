import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default variant', () => {
      const { container } = render(<Button>Default Button</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for destructive variant', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for link variant', () => {
      const { container } = render(<Button variant="link">Link</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for small size', () => {
      const { container } = render(<Button size="sm">Small</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for large size', () => {
      const { container } = render(<Button size="lg">Large</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for icon size', () => {
      const { container } = render(
        <Button size="icon">
          <svg data-testid="icon" />
        </Button>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for disabled state', () => {
      const { container } = render(<Button disabled>Disabled</Button>)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      render(<Button>Test Content</Button>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(<Button>Button Text</Button>)
      expect(screen.getByText('Button Text')).toBeInTheDocument()
    })

    it('renders as button element by default', () => {
      const { container } = render(<Button>Test</Button>)
      expect(container.firstChild?.nodeName).toBe('BUTTON')
    })
  })

  describe('Variants', () => {
    it('applies default variant styles', () => {
      const { container } = render(<Button>Default</Button>)
      expect(container.firstChild).toHaveClass('bg-primary')
    })

    it('applies secondary variant styles', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)
      expect(container.firstChild).toHaveClass('bg-secondary')
    })

    it('applies destructive variant styles', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>)
      expect(container.firstChild).toHaveClass('bg-destructive')
    })

    it('applies outline variant styles', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      expect(container.firstChild).toHaveClass('border')
    })

    it('applies ghost variant styles', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      expect(container.firstChild).toHaveClass('hover:bg-accent')
    })

    it('applies link variant styles', () => {
      const { container } = render(<Button variant="link">Link</Button>)
      expect(container.firstChild).toHaveClass('text-primary')
    })
  })

  describe('Sizes', () => {
    it('applies default size styles', () => {
      const { container } = render(<Button>Default</Button>)
      expect(container.firstChild).toHaveClass('h-10')
    })

    it('applies small size styles', () => {
      const { container } = render(<Button size="sm">Small</Button>)
      expect(container.firstChild).toHaveClass('h-9')
    })

    it('applies large size styles', () => {
      const { container } = render(<Button size="lg">Large</Button>)
      expect(container.firstChild).toHaveClass('h-11')
    })

    it('applies icon size styles', () => {
      const { container } = render(<Button size="icon">Icon</Button>)
      expect(container.firstChild).toHaveClass('h-10', 'w-10')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Button className="custom-class">Test</Button>)
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('merges custom className with variant styles', () => {
      const { container } = render(
        <Button variant="secondary" className="my-custom">
          Test
        </Button>
      )
      expect(container.firstChild).toHaveClass('bg-secondary')
      expect(container.firstChild).toHaveClass('my-custom')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      render(<Button ref={ref}>Test</Button>)
      expect(ref.current).not.toBeNull()
    })

    it('has correct displayName', () => {
      expect(Button.displayName).toBe('Button')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Button data-testid="button" aria-label="Submit form">
          Test
        </Button>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'button')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Submit form')
    })
  })

  describe('Interactions', () => {
    it('handles onClick events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      fireEvent.click(screen.getByText('Click me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not fire onClick when disabled', () => {
      const handleClick = vi.fn()
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      )
      fireEvent.click(screen.getByText('Disabled'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('handles keyboard events', () => {
      const handleKeyDown = vi.fn()
      render(<Button onKeyDown={handleKeyDown}>Test</Button>)
      fireEvent.keyDown(screen.getByText('Test'), { key: 'Enter' })
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('Disabled State', () => {
    it('applies disabled styles when disabled', () => {
      const { container } = render(<Button disabled>Disabled</Button>)
      expect(container.firstChild).toHaveClass('disabled:pointer-events-none')
      expect(container.firstChild).toHaveClass('disabled:opacity-50')
    })

    it('sets disabled attribute', () => {
      const { container } = render(<Button disabled>Disabled</Button>)
      expect(container.firstChild).toHaveAttribute('disabled')
    })
  })

  describe('asChild Prop', () => {
    it('renders as child element when asChild is true', () => {
      const { container } = render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      expect(container.firstChild?.nodeName).toBe('A')
      expect(container.firstChild).toHaveAttribute('href', '/test')
    })

    it('applies button styles to child element', () => {
      const { container } = render(
        <Button asChild variant="secondary">
          <a href="/test">Link</a>
        </Button>
      )
      expect(container.firstChild).toHaveClass('bg-secondary')
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      const { container } = render(
        <Button aria-label="Close dialog">×</Button>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Close dialog')
    })

    it('supports aria-disabled', () => {
      const { container } = render(<Button aria-disabled="true">Test</Button>)
      expect(container.firstChild).toHaveAttribute('aria-disabled', 'true')
    })

    it('supports role attribute', () => {
      const { container } = render(<Button role="menuitem">Menu Item</Button>)
      expect(container.firstChild).toHaveAttribute('role', 'menuitem')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { container } = render(<Button />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    it('handles loading state with disabled', () => {
      const { container } = render(
        <Button disabled>
          <svg className="animate-spin" />
          Loading...
        </Button>
      )
      expect(container.firstChild).toHaveAttribute('disabled')
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })
})