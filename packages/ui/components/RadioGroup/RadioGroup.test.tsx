import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RadioGroup } from './RadioGroup'

describe('RadioGroup', () => {
  it('renders successfully', () => {
    const { container } = render(<RadioGroup />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
