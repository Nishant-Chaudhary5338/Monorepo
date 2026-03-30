import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from './Table'

describe('Table', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for basic table', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for table with caption', () => {
      const { container } = render(
        <Table>
          <TableCaption>User List</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for table with footer', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>$100</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>$100</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as table element', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const table = container.querySelector('table')
      expect(table).toBeInTheDocument()
    })

    it('renders table header', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      expect(screen.getByText('Header')).toBeInTheDocument()
    })

    it('renders table body', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Body Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(screen.getByText('Body Content')).toBeInTheDocument()
    })

    it('renders table caption', () => {
      render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(screen.getByText('Table Caption')).toBeInTheDocument()
    })

    it('renders table footer', () => {
      render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Footer Content</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      expect(screen.getByText('Footer Content')).toBeInTheDocument()
    })
  })

  describe('Table Structure', () => {
    it('renders multiple rows', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Row 1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(screen.getByText('Row 1')).toBeInTheDocument()
      expect(screen.getByText('Row 2')).toBeInTheDocument()
      expect(screen.getByText('Row 3')).toBeInTheDocument()
    })

    it('renders multiple columns', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Col 1</TableHead>
              <TableHead>Col 2</TableHead>
              <TableHead>Col 3</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>A</TableCell>
              <TableCell>B</TableCell>
              <TableCell>C</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(screen.getByText('Col 1')).toBeInTheDocument()
      expect(screen.getByText('Col 2')).toBeInTheDocument()
      expect(screen.getByText('Col 3')).toBeInTheDocument()
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('C')).toBeInTheDocument()
    })

    it('renders complete table structure', () => {
      render(
        <Table>
          <TableCaption>Users Table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>john@test.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane</TableCell>
              <TableCell>jane@test.com</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>2 users</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      expect(screen.getByText('Users Table')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Jane')).toBeInTheDocument()
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('2 users')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to table', () => {
      const { container } = render(
        <Table className="custom-table">
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const table = container.querySelector('table')
      expect(table).toHaveClass('custom-table')
    })

    it('applies custom className to header', () => {
      const { container } = render(
        <Table>
          <TableHeader className="custom-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      expect(container.querySelector('thead')).toHaveClass('custom-header')
    })

    it('applies custom className to body', () => {
      const { container } = render(
        <Table>
          <TableBody className="custom-body">
            <TableRow>
              <TableCell>Body</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(container.querySelector('tbody')).toHaveClass('custom-body')
    })

    it('applies custom className to row', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow className="custom-row">
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(container.querySelector('tr')).toHaveClass('custom-row')
    })

    it('applies custom className to header cell', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head">Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      expect(container.querySelector('th')).toHaveClass('custom-head')
    })

    it('applies custom className to cell', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell">Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(container.querySelector('td')).toHaveClass('custom-cell')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Table data-testid="my-table" aria-label="Data table">
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-table')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Data table')
    })
  })

  describe('Accessibility', () => {
    it('table has correct role', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const table = container.querySelector('table')
      expect(table?.nodeName).toBe('TABLE')
    })

    it('supports aria-label', () => {
      const { container } = render(
        <Table aria-label="User data">
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const table = container.querySelector('table')
      expect(table).toHaveAttribute('aria-label', 'User data')
    })

    it('supports aria-describedby', () => {
      const { container } = render(
        <Table aria-describedby="table-description">
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const table = container.querySelector('table')
      expect(table).toHaveAttribute(
        'aria-describedby',
        'table-description'
      )
    })

    it('header cells have correct scope', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Column Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      const th = container.querySelector('th')
      expect(th).toHaveAttribute('scope', 'col')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty table', () => {
      const { container } = render(
        <Table>
          <TableBody></TableBody>
        </Table>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles table with only header', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header Only</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      expect(screen.getByText('Header Only')).toBeInTheDocument()
    })

    it('handles table with complex cell content', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <div>
                  <span>Nested</span>
                  <span>Content</span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(screen.getByText('Nested')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('handles table with many rows', () => {
      const rows = Array.from({ length: 10 }, (_, i) => (
        <TableRow key={i}>
          <TableCell>Row {i + 1}</TableCell>
        </TableRow>
      ))
      render(
        <Table>
          <TableBody>{rows}</TableBody>
        </Table>
      )
      expect(screen.getByText('Row 1')).toBeInTheDocument()
      expect(screen.getByText('Row 10')).toBeInTheDocument()
    })

    it('handles table with many columns', () => {
      const headers = Array.from({ length: 5 }, (_, i) => (
        <TableHead key={i}>Col {i + 1}</TableHead>
      ))
      const cells = Array.from({ length: 5 }, (_, i) => (
        <TableCell key={i}>Cell {i + 1}</TableCell>
      ))
      render(
        <Table>
          <TableHeader>
            <TableRow>{headers}</TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>{cells}</TableRow>
          </TableBody>
        </Table>
      )
      expect(screen.getByText('Col 1')).toBeInTheDocument()
      expect(screen.getByText('Col 5')).toBeInTheDocument()
      expect(screen.getByText('Cell 1')).toBeInTheDocument()
      expect(screen.getByText('Cell 5')).toBeInTheDocument()
    })
  })
})