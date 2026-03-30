import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders successfully', () => {
    const { container } = render(<Toggle />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
