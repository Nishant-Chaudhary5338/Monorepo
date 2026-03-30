import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table'

describe('Table', () => {
  it('renders successfully', () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>John</TableCell></TableRow></TableBody>
      </Table>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Table className="custom-class"><tbody /></Table>)
    expect(container.querySelector('table')).toHaveClass('custom-class')
  })
})
