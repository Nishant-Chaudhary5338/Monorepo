import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders successfully', () => {
    const { container } = render(<Pagination />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
