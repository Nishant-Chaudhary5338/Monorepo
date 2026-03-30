import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Toaster } from './Sonner'

describe('Toaster', () => {
  it('renders successfully', () => {
    const { container } = render(<Toaster />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
