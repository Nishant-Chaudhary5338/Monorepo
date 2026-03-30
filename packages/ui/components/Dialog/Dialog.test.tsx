import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('renders successfully', () => {
    const { container } = render(<Dialog />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
