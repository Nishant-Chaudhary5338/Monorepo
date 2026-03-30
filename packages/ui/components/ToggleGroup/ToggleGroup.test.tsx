import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ToggleGroup } from './ToggleGroup'

describe('ToggleGroup', () => {
  it('renders successfully', () => {
    const { container } = render(<ToggleGroup />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
