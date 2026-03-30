import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Select } from './Select'

describe('Select', () => {
  it('renders successfully', () => {
    const { container } = render(<Select />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
