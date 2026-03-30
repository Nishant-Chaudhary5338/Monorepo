import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Sheet } from './Sheet'

describe('Sheet', () => {
  it('renders successfully', () => {
    const { container } = render(<Sheet />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
