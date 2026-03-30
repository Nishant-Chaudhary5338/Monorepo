import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default label', () => {
      const { container } = render(<Label>Label Text</Label>)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for label with htmlFor', () => {
      const { container } = render(<Label htmlFor="input-id">Email</Label>)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Label>Test Label</Label>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as label element', () => {
      const { container } = render(<Label>Test</Label>)
      expect(container.firstChild?.nodeName).toBe('LABEL')
    })

    it('renders children correctly', () => {
      render(<Label>My Label</Label>)
      expect(screen.getByText('My Label')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Label className="custom-label">Test</Label>)
      expect(container.firstChild).toHaveClass('custom-label')
    })

    it('sets htmlFor attribute', () => {
      const { container } = render(<Label htmlFor="email-input">Email</Label>)
      expect(container.firstChild).toHaveAttribute('for', 'email-input')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Label data-testid="my-label" aria-label="Form label">
          Test
        </Label>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-label')
    })
  })

  describe('Accessibility', () => {
    it('can be associated with input', () => {
      render(
        <div>
          <Label htmlFor="test-input">Name</Label>
          <input id="test-input" />
        </div>
      )
      const label = screen.getByText('Name')
      expect(label).toHaveAttribute('for', 'test-input')
    })

    it('supports aria-label', () => {
      const { container } = render(<Label aria-label="Accessible label">Test</Label>)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Accessible label')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty label', () => {
      const { container } = render(<Label />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex children', () => {
      render(
        <Label>
          <span>Icon</span>
          <span>Text</span>
        </Label>
      )
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })
  })
})