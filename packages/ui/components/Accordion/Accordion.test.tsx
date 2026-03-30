import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Accordion } from './Accordion'

describe('Accordion', () => {
  it('renders successfully', () => {
    const { container } = render(<Accordion />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
