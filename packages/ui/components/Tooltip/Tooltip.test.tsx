import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders successfully', () => {
    const { container } = render(<Tooltip />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
