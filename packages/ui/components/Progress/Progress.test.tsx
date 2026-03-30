import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default progress', () => {
      const { container } = render(<Progress />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for progress with value', () => {
      const { container } = render(<Progress value={50} />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for complete progress', () => {
      const { container } = render(<Progress value={100} />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Progress />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(<Progress />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('renders indicator element', () => {
      const { container } = render(<Progress value={50} />)
      const indicator = container.querySelector('[data-state]')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('Value', () => {
    it('applies value correctly', () => {
      const { container } = render(<Progress value={75} />)
      const indicator = container.querySelector('[data-state]')
      expect(indicator).toHaveStyle('transform: translateX(-25%)')
    })

    it('handles 0 value', () => {
      const { container } = render(<Progress value={0} />)
      const indicator = container.querySelector('[data-state]')
      expect(indicator).toHaveStyle('transform: translateX(-100%)')
    })

    it('handles 100 value', () => {
      const { container } = render(<Progress value={100} />)
      const indicator = container.querySelector('[data-state]')
      expect(indicator).toHaveStyle('transform: translateX(-0%)')
    })

    it('handles undefined value', () => {
      const { container } = render(<Progress />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Progress className="custom-progress" />)
      expect(container.firstChild).toHaveClass('custom-progress')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Progress data-testid="my-progress" aria-label="Loading progress" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-progress')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Loading progress')
    })
  })

  describe('Accessibility', () => {
    it('has progressbar role', () => {
      const { container } = render(<Progress value={50} />)
      expect(container.firstChild).toHaveAttribute('role', 'progressbar')
    })

    it('supports aria-valuenow', () => {
      const { container } = render(<Progress value={50} />)
      expect(container.firstChild).toHaveAttribute('aria-valuenow', '50')
    })

    it('supports aria-valuemin', () => {
      const { container } = render(<Progress value={50} />)
      expect(container.firstChild).toHaveAttribute('aria-valuemin', '0')
    })

    it('supports aria-valuemax', () => {
      const { container } = render(<Progress value={50} />)
      expect(container.firstChild).toHaveAttribute('aria-valuemax', '100')
    })

    it('supports aria-label', () => {
      const { container } = render(<Progress aria-label="Upload progress" />)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Upload progress')
    })
  })

  describe('Edge Cases', () => {
    it('handles negative value', () => {
      const { container } = render(<Progress value={-10} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles value over 100', () => {
      const { container } = render(<Progress value={150} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles decimal value', () => {
      const { container } = render(<Progress value={33.33} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})