import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  it('renders successfully', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Progress value={50} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
