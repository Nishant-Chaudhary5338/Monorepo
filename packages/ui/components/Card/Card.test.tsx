import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card'

describe('Card', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for basic card', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card content</CardContent>
        </Card>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for complete card', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for card with custom className', () => {
      const { container } = render(
        <Card className="custom-card">
          <CardContent>Content</CardContent>
        </Card>
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Card>
          <CardContent>Test</CardContent>
        </Card>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(
        <Card>
          <CardContent>Test</CardContent>
        </Card>
      )
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('renders card header', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Header Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Header Title')).toBeInTheDocument()
    })

    it('renders card title', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>My Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('My Title')).toBeInTheDocument()
    })

    it('renders card description', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>My Description</CardDescription>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('My Description')).toBeInTheDocument()
    })

    it('renders card content', () => {
      render(
        <Card>
          <CardContent>Main Content</CardContent>
        </Card>
      )
      expect(screen.getByText('Main Content')).toBeInTheDocument()
    })

    it('renders card footer', () => {
      render(
        <Card>
          <CardFooter>Footer Content</CardFooter>
        </Card>
      )
      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })
  })

  describe('Card Structure', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Complete Card</CardTitle>
            <CardDescription>This is a complete card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card body content</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )
      expect(screen.getByText('Complete Card')).toBeInTheDocument()
      expect(screen.getByText('This is a complete card')).toBeInTheDocument()
      expect(screen.getByText('Card body content')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })

    it('renders card with multiple sections', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title 1</CardTitle>
          </CardHeader>
          <CardContent>Content 1</CardContent>
          <CardHeader>
            <CardTitle>Title 2</CardTitle>
          </CardHeader>
          <CardContent>Content 2</CardContent>
        </Card>
      )
      expect(screen.getByText('Title 1')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Title 2')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to card', () => {
      const { container } = render(
        <Card className="my-card">
          <CardContent>Test</CardContent>
        </Card>
      )
      expect(container.firstChild).toHaveClass('my-card')
    })

    it('merges custom className with default styles', () => {
      const { container } = render(
        <Card className="custom">
          <CardContent>Test</CardContent>
        </Card>
      )
      expect(container.firstChild).toHaveClass('custom')
      expect(container.firstChild).toHaveClass('rounded-lg')
    })

    it('applies custom className to header', () => {
      const { container } = render(
        <Card>
          <CardHeader className="custom-header">
            <CardTitle>Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(container.querySelector('[class*="flex flex-col"]')).toHaveClass(
        'custom-header'
      )
    })

    it('applies custom className to title', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle className="custom-title">Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Title')).toHaveClass('custom-title')
    })

    it('applies custom className to description', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription className="custom-desc">Desc</CardDescription>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Desc')).toHaveClass('custom-desc')
    })

    it('applies custom className to content', () => {
      const { container } = render(
        <Card>
          <CardContent className="custom-content">Test</CardContent>
        </Card>
      )
      expect(container.querySelector('p, div')).toHaveClass('custom-content')
    })

    it('applies custom className to footer', () => {
      const { container } = render(
        <Card>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      )
      expect(container.querySelector('[class*="flex"]')).toHaveClass(
        'custom-footer'
      )
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Card data-testid="my-card" aria-label="Info card">
          <CardContent>Test</CardContent>
        </Card>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-card')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Info card')
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      const { container } = render(
        <Card aria-label="User profile">
          <CardContent>Test</CardContent>
        </Card>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'User profile')
    })

    it('supports role attribute', () => {
      const { container } = render(
        <Card role="article">
          <CardContent>Test</CardContent>
        </Card>
      )
      expect(container.firstChild).toHaveAttribute('role', 'article')
    })

    it('title has correct heading structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Heading Title</CardTitle>
          </CardHeader>
        </Card>
      )
      const title = screen.getByText('Heading Title')
      expect(title.nodeName).toBe('H3')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty card', () => {
      const { container } = render(<Card />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles card with only content', () => {
      render(
        <Card>
          <CardContent>Only content</CardContent>
        </Card>
      )
      expect(screen.getByText('Only content')).toBeInTheDocument()
    })

    it('handles card with complex children', () => {
      render(
        <Card>
          <CardContent>
            <div>
              <span>Nested</span>
              <span>Content</span>
            </div>
          </CardContent>
        </Card>
      )
      expect(screen.getByText('Nested')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('handles card with multiple footers', () => {
      render(
        <Card>
          <CardFooter>Footer 1</CardFooter>
          <CardFooter>Footer 2</CardFooter>
        </Card>
      )
      expect(screen.getByText('Footer 1')).toBeInTheDocument()
      expect(screen.getByText('Footer 2')).toBeInTheDocument()
    })
  })
})