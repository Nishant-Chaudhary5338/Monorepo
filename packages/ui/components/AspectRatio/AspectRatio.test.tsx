import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AspectRatio } from './AspectRatio'

describe('AspectRatio', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default aspect ratio', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for square aspect ratio', () => {
      const { container } = render(
        <AspectRatio ratio={1}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(
        <AspectRatio ratio={16 / 9}>
          <img src="/test.jpg" alt="Test image" />
        </AspectRatio>
      )
      expect(screen.getByAltText('Test image')).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <div>Content</div>
        </AspectRatio>
      )
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('Ratio', () => {
    it('applies 16:9 ratio correctly', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.style.paddingBottom).toBe('56.25%')
    })

    it('applies 1:1 ratio correctly', () => {
      const { container } = render(
        <AspectRatio ratio={1}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.style.paddingBottom).toBe('100%')
    })

    it('applies 4:3 ratio correctly', () => {
      const { container } = render(
        <AspectRatio ratio={4 / 3}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.style.paddingBottom).toBe('75%')
    })

    it('applies custom ratio', () => {
      const { container } = render(
        <AspectRatio ratio={2}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.style.paddingBottom).toBe('50%')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9} className="custom-aspect">
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      expect(container.firstChild).toHaveClass('custom-aspect')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9} data-testid="my-aspect-ratio">
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-aspect-ratio')
    })
  })

  describe('Overflow', () => {
    it('has overflow-hidden class', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      )
      expect(container.firstChild).toHaveClass('overflow-hidden')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty aspect ratio', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <div></div>
        </AspectRatio>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex children', () => {
      render(
        <AspectRatio ratio={16 / 9}>
          <div>
            <h2>Title</h2>
            <p>Description</p>
            <button>Action</button>
          </div>
        </AspectRatio>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    it('handles image with fill', () => {
      const { container } = render(
        <AspectRatio ratio={16 / 9}>
          <img
            src="/test.jpg"
            alt="Test"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </AspectRatio>
      )
      const img = screen.getByAltText('Test')
      expect(img).toHaveStyle({ objectFit: 'cover' })
    })
  })
})