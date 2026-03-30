import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Menubar } from './Menubar'

describe('Menubar', () => {
  it('renders successfully', () => {
    const { container } = render(<Menubar />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
