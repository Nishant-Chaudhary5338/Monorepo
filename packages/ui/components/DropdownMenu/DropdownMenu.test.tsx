import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DropdownMenu } from './DropdownMenu'

describe('DropdownMenu', () => {
  it('renders successfully', () => {
    const { container } = render(<DropdownMenu />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
