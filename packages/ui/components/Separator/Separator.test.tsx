import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Separator } from './Separator'

describe('Separator', () => {
  it('renders successfully', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
