import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default skeleton', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for skeleton with custom dimensions', () => {
      const { container } = render(<Skeleton className="w-48 h-4" />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Skeleton className="custom-skeleton" />)
      expect(container.firstChild).toHaveClass('custom-skeleton')
    })

    it('applies custom dimensions', () => {
      const { container } = render(<Skeleton className="w-20 h-10" />)
      expect(container.firstChild).toHaveClass('h-10')
      expect(container.firstChild).toHaveClass('w-20')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Skeleton data-testid="my-skeleton" aria-label="Loading" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-skeleton')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Loading')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty skeleton', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies animate-pulse class', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).toHaveClass('animate-pulse')
    })

    it('applies rounded-md class', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).toHaveClass('rounded-md')
    })
  })
})