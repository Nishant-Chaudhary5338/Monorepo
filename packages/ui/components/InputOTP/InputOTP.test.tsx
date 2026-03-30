import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { InputOTP } from './InputOTP'

describe('InputOTP', () => {
  it('renders successfully', () => {
    const { container } = render(<InputOTP />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
