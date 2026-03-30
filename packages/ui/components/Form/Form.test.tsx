import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Form } from './Form'

describe('Form', () => {
  it('renders successfully', () => {
    const { container } = render(<Form />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
