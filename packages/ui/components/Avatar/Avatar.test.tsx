import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

describe('Avatar', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default avatar', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot with image', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for fallback only', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('renders avatar with custom className', () => {
      const { container } = render(
        <Avatar className="custom-avatar">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild).toHaveClass('custom-avatar')
    })
  })

  describe('AvatarImage', () => {
    it('renders image with correct src', () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
        </Avatar>
      )
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('renders image with correct alt text', () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
        </Avatar>
      )
      expect(screen.getByAltText('John Doe')).toBeInTheDocument()
    })

    it('applies custom className to image', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage
            src="https://example.com/avatar.jpg"
            alt="User"
            className="custom-image"
          />
        </Avatar>
      )
      expect(container.querySelector('img')).toHaveClass('custom-image')
    })
  })

  describe('AvatarFallback', () => {
    it('renders fallback text', () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      )
      expect(screen.getByText('AB')).toBeInTheDocument()
    })

    it('applies custom className to fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback className="custom-fallback">JD</AvatarFallback>
        </Avatar>
      )
      expect(container.querySelector('span')).toHaveClass('custom-fallback')
    })

    it('renders fallback with complex content', () => {
      render(
        <Avatar>
          <AvatarFallback>
            <span>User Icon</span>
          </AvatarFallback>
        </Avatar>
      )
      expect(screen.getByText('User Icon')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('renders as a span element', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    it('supports aria-label', () => {
      const { container } = render(
        <Avatar aria-label="User avatar">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'User avatar')
    })

    it('supports role attribute', () => {
      const { container } = render(
        <Avatar role="img">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild).toHaveAttribute('role', 'img')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback></AvatarFallback>
        </Avatar>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles long fallback text', () => {
      render(
        <Avatar>
          <AvatarFallback>VeryLongFallbackText</AvatarFallback>
        </Avatar>
      )
      expect(screen.getByText('VeryLongFallbackText')).toBeInTheDocument()
    })

    it('handles multiple fallbacks', () => {
      render(
        <Avatar>
          <AvatarFallback>First</AvatarFallback>
          <AvatarFallback>Second</AvatarFallback>
        </Avatar>
      )
      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })
  })
})