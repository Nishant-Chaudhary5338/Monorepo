import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Popover } from './Popover'

describe('Popover', () => {
  it('renders successfully', () => {
    const { container } = render(<Popover />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
