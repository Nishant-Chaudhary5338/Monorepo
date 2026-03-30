import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders successfully', () => {
    const { container } = render(<Card />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
