import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Collapsible } from './Collapsible'

describe('Collapsible', () => {
  it('renders successfully', () => {
    const { container } = render(<Collapsible />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
