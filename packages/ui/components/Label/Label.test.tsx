import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  it('renders successfully', () => {
    const { container } = render(<Label />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
