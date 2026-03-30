import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Command } from './Command'

describe('Command', () => {
  it('renders successfully', () => {
    const { container } = render(<Command />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
