import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default toggle', () => {
      const { container } = render(<Toggle>Toggle</Toggle>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for pressed toggle', () => {
      const { container } = render(<Toggle pressed>Pressed</Toggle>)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Toggle>Test Toggle</Toggle>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as button element', () => {
      const { container } = render(<Toggle>Test</Toggle>)
      expect(container.firstChild?.nodeName).toBe('BUTTON')
    })

    it('renders children correctly', () => {
      render(<Toggle>Toggle Text</Toggle>)
      expect(screen.getByText('Toggle Text')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('applies default variant styles', () => {
      const { container } = render(<Toggle>Default</Toggle>)
      expect(container.firstChild).toHaveClass('bg-transparent')
    })

    it('applies outline variant styles', () => {
      const { container } = render(<Toggle variant="outline">Outline</Toggle>)
      expect(container.firstChild).toHaveClass('border')
    })
  })

  describe('Sizes', () => {
    it('applies default size', () => {
      const { container } = render(<Toggle>Default Size</Toggle>)
      expect(container.firstChild).toHaveClass('h-10')
    })

    it('applies small size', () => {
      const { container } = render(<Toggle size="sm">Small</Toggle>)
      expect(container.firstChild).toHaveClass('h-9')
    })

    it('applies large size', () => {
      const { container } = render(<Toggle size="lg">Large</Toggle>)
      expect(container.firstChild).toHaveClass('h-11')
    })
  })

  describe('Pressed State', () => {
    it('renders unpressed by default', () => {
      const { container } = render(<Toggle>Toggle</Toggle>)
      expect(container.firstChild).toHaveAttribute('data-state', 'off')
    })

    it('renders pressed state', () => {
      const { container } = render(<Toggle pressed>Pressed</Toggle>)
      expect(container.firstChild).toHaveAttribute('data-state', 'on')
    })

    it('toggles pressed state on click', () => {
      const { container } = render(<Toggle>Toggle</Toggle>)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(container.firstChild).toHaveAttribute('data-state', 'on')
    })

    it('calls onPressedChange when toggled', () => {
      const handlePressedChange = vi.fn()
      render(<Toggle onPressedChange={handlePressedChange}>Toggle</Toggle>)
      fireEvent.click(screen.getByText('Toggle'))
      expect(handlePressedChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      const { container } = render(<Toggle disabled>Disabled</Toggle>)
      expect(container.firstChild).toHaveAttribute('disabled')
    })

    it('does not toggle when disabled', () => {
      const handlePressedChange = vi.fn()
      render(
        <Toggle disabled onPressedChange={handlePressedChange}>
          Disabled
        </Toggle>
      )
      fireEvent.click(screen.getByText('Disabled'))
      expect(handlePressedChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has button role', () => {
      render(<Toggle>Toggle</Toggle>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has aria-pressed attribute', () => {
      const { container } = render(<Toggle>Toggle</Toggle>)
      expect(container.firstChild).toHaveAttribute('aria-pressed', 'false')
    })

    it('supports aria-label', () => {
      const { container } = render(<Toggle aria-label="Toggle bold">B</Toggle>)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Toggle bold')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Toggle className="custom-toggle">Test</Toggle>)
      expect(container.firstChild).toHaveClass('custom-toggle')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      render(<Toggle ref={ref}>Test</Toggle>)
      expect(ref.current).not.toBeNull()
    })
  })
})