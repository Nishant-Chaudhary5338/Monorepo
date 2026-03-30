import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollArea, ScrollBar } from './ScrollArea'

describe('ScrollArea', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default scroll area', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </ScrollArea>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px]">
          Content
        </ScrollArea>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders children correctly', () => {
      render(
        <ScrollArea className="h-[200px] w-[350px]">
          <div>Scrollable content</div>
        </ScrollArea>
      )
      expect(screen.getByText('Scrollable content')).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px]">
          Content
        </ScrollArea>
      )
      expect(container.firstChild?.nodeName).toBe('DIV')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ScrollArea className="custom-scroll-area">
          Content
        </ScrollArea>
      )
      expect(container.firstChild).toHaveClass('custom-scroll-area')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <ScrollArea data-testid="my-scroll-area">
          Content
        </ScrollArea>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-scroll-area')
    })
  })

  describe('ScrollBar', () => {
    it('renders horizontal scrollbar', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px]">
          <div style={{ width: '800px' }}>Wide content</div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )
      const scrollbar = container.querySelector('[data-orientation="horizontal"]')
      expect(scrollbar).toBeInTheDocument()
    })

    it('renders vertical scrollbar', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px]">
          <div style={{ height: '800px' }}>Tall content</div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      )
      const scrollbar = container.querySelector('[data-orientation="vertical"]')
      expect(scrollbar).toBeInTheDocument()
    })

    it('applies custom className to scrollbar', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px]">
          Content
          <ScrollBar orientation="vertical" className="custom-scrollbar" />
        </ScrollArea>
      )
      const scrollbar = container.querySelector('[data-orientation="vertical"]')
      expect(scrollbar).toHaveClass('custom-scrollbar')
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      const { container } = render(
        <ScrollArea aria-label="Scrollable content">
          Content
        </ScrollArea>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Scrollable content')
    })

    it('supports role attribute', () => {
      const { container } = render(
        <ScrollArea role="region">
          Content
        </ScrollArea>
      )
      expect(container.firstChild).toHaveAttribute('role', 'region')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty scroll area', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px]"></ScrollArea>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex nested content', () => {
      render(
        <ScrollArea className="h-[200px] w-[350px]">
          <div>
            <h2>Title</h2>
            <p>Paragraph</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </ScrollArea>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('handles long content', () => {
      const longContent = Array.from({ length: 100 }, (_, i) => (
        <p key={i}>Paragraph {i + 1}</p>
      ))
      render(
        <ScrollArea className="h-[200px] w-[350px]">
          {longContent}
        </ScrollArea>
      )
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 100')).toBeInTheDocument()
    })
  })
})