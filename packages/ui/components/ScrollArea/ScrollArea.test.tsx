import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ScrollArea } from './ScrollArea'

describe('ScrollArea', () => {
  it('renders successfully', () => {
    const { container } = render(<ScrollArea />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
