import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Separator } from './Separator'

describe('Separator', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for horizontal separator', () => {
      const { container } = render(<Separator />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for vertical separator', () => {
      const { container } = render(<Separator orientation="vertical" />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for decorative separator', () => {
      const { container } = render(<Separator decorative />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Separator />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(<Separator />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('renders horizontal separator by default', () => {
      const { container } = render(<Separator />)
      expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('renders vertical separator', () => {
      const { container } = render(<Separator orientation="vertical" />)
      expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Separator className="custom-separator" />)
      expect(container.firstChild).toHaveClass('custom-separator')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Separator data-testid="my-separator" role="separator" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-separator')
    })
  })

  describe('Accessibility', () => {
    it('has separator role', () => {
      const { container } = render(<Separator />)
      expect(container.firstChild).toHaveAttribute('role', 'separator')
    })

    it('supports aria-orientation', () => {
      const { container } = render(<Separator orientation="vertical" />)
      expect(container.firstChild).toHaveAttribute('aria-orientation', 'vertical')
    })

    it('decorative separator has aria-hidden', () => {
      const { container } = render(<Separator decorative />)
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Edge Cases', () => {
    it('handles horizontal orientation', () => {
      const { container } = render(<Separator orientation="horizontal" />)
      expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('handles vertical orientation', () => {
      const { container } = render(<Separator orientation="vertical" />)
      expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical')
    })
  })
})