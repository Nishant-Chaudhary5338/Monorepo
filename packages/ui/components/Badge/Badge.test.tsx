import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default variant', () => {
      const { container } = render(<Badge>Default Badge</Badge>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for secondary variant', () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for destructive variant', () => {
      const { container } = render(<Badge variant="destructive">Destructive</Badge>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for outline variant', () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Badge>Test Badge</Badge>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(<Badge>Badge Content</Badge>)
      expect(screen.getByText('Badge Content')).toBeInTheDocument()
    })

    it('renders without children', () => {
      const { container } = render(<Badge />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('applies default variant styles', () => {
      const { container } = render(<Badge>Default</Badge>)
      expect(container.firstChild).toHaveClass('bg-primary')
    })

    it('applies secondary variant styles', () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>)
      expect(container.firstChild).toHaveClass('bg-secondary')
    })

    it('applies destructive variant styles', () => {
      const { container } = render(<Badge variant="destructive">Destructive</Badge>)
      expect(container.firstChild).toHaveClass('bg-destructive')
    })

    it('applies outline variant styles', () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>)
      expect(container.firstChild).toHaveClass('text-foreground')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Badge className="custom-class">Test</Badge>)
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('merges custom className with variant styles', () => {
      const { container } = render(
        <Badge variant="secondary" className="my-custom">
          Test
        </Badge>
      )
      expect(container.firstChild).toHaveClass('bg-secondary')
      expect(container.firstChild).toHaveClass('my-custom')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Badge data-testid="badge" aria-label="Status badge">
          Test
        </Badge>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'badge')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Status badge')
    })
  })

  describe('Accessibility', () => {
    it('renders as a div element', () => {
      const { container } = render(<Badge>Test</Badge>)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('supports aria-label', () => {
      const { container } = render(<Badge aria-label="Notification count">5</Badge>)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Notification count')
    })

    it('supports role attribute', () => {
      const { container } = render(<Badge role="status">Active</Badge>)
      expect(container.firstChild).toHaveAttribute('role', 'status')
    })
  })

  describe('Edge Cases', () => {
    it('handles numeric children', () => {
      render(<Badge>{42}</Badge>)
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('handles complex children', () => {
      render(
        <Badge>
          <span>Icon</span>
          <span>Text</span>
        </Badge>
      )
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })
  })
})