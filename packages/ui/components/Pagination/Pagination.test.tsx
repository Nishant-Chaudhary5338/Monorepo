import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination'

describe('Pagination', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default pagination', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => {}} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => {}}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => {}} isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => {}} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => {}}>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as nav element', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => {}}>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(container.firstChild?.nodeName).toBe('NAV')
    })

    it('renders pagination links', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => {}}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => {}}>2</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('renders previous button', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => {}} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(screen.getByText('Previous')).toBeInTheDocument()
    })

    it('renders next button', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext onClick={() => {}} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('calls onClick when previous is clicked', () => {
      const handleClick = vi.fn()
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handleClick} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      fireEvent.click(screen.getByText('Previous'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when next is clicked', () => {
      const handleClick = vi.fn()
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext onClick={handleClick} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      fireEvent.click(screen.getByText('Next'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Links', () => {
    it('calls onClick when link is clicked', () => {
      const handleClick = vi.fn()
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={handleClick}>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      fireEvent.click(screen.getByText('1'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders active link', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => {}} isActive>2</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      const activeLink = container.querySelector('[aria-current="page"]')
      expect(activeLink).toBeInTheDocument()
    })
  })

  describe('Ellipsis', () => {
    it('renders ellipsis', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      const ellipsis = container.querySelector('[aria-hidden="true"]')
      expect(ellipsis).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Pagination className="custom-pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => {}} size="icon">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(container.firstChild).toHaveClass('custom-pagination')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Pagination data-testid="my-pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => {}} size="icon">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-pagination')
    })
  })

  describe('Accessibility', () => {
    it('has navigation role', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => {}} size="icon">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(container.firstChild).toHaveAttribute('role', 'navigation')
    })

    it('supports aria-label', () => {
      const { container } = render(
        <Pagination aria-label="Pagination navigation">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink onClick={() => {}} size="icon">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Pagination navigation')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty pagination', () => {
      const { container } = render(
        <Pagination>
          <PaginationContent></PaginationContent>
        </Pagination>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles many page links', () => {
      const links = Array.from({ length: 10 }, (_, i) => (
        <PaginationItem key={i}>
          <PaginationLink onClick={() => {}} size="icon">{i + 1}</PaginationLink>
        </PaginationItem>
      ))
      render(
        <Pagination>
          <PaginationContent>{links}</PaginationContent>
        </Pagination>
      )
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })
})