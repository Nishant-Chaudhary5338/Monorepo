import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb'

describe('Breadcrumb', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default breadcrumb', () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders breadcrumb links', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    it('renders breadcrumb page', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(screen.getByText('Current')).toBeInTheDocument()
    })

    it('renders separators', () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      const separators = container.querySelectorAll('li[role="presentation"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Props', () => {
    it('applies custom className to breadcrumb', () => {
      const { container } = render(
        <Breadcrumb className="custom-breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(container.firstChild).toHaveClass('custom-breadcrumb')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Breadcrumb data-testid="my-breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-breadcrumb')
    })
  })

  describe('Accessibility', () => {
    it('has navigation role', () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(container.firstChild).toHaveAttribute('role', 'navigation')
    })

    it('supports aria-label', () => {
      const { container } = render(
        <Breadcrumb aria-label="Breadcrumb navigation">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Breadcrumb navigation')
    })

    it('list has list role', () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      const list = container.querySelector('ol')
      expect(list).toBeInTheDocument()
    })
  })

  describe('Links', () => {
    it('renders link with href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      const link = screen.getByText('Home')
      expect(link).toHaveAttribute('href', '/home')
    })

    it('renders page without href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      const page = screen.getByText('Current Page')
      expect(page).not.toHaveAttribute('href')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty breadcrumb', () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList></BreadcrumbList>
        </Breadcrumb>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles single item breadcrumb', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Only Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
      expect(screen.getByText('Only Page')).toBeInTheDocument()
    })

    it('handles many items', () => {
      const items = Array.from({ length: 10 }, (_, i) => (
        <BreadcrumbItem key={i}>
          <BreadcrumbLink href={`/page${i}`}>Page {i}</BreadcrumbLink>
        </BreadcrumbItem>
      ))
      render(
        <Breadcrumb>
          <BreadcrumbList>{items}</BreadcrumbList>
        </Breadcrumb>
      )
      expect(screen.getByText('Page 0')).toBeInTheDocument()
      expect(screen.getByText('Page 9')).toBeInTheDocument()
    })
  })
})