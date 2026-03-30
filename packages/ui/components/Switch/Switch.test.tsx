import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders successfully', () => {
    const { container } = render(<Switch />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
