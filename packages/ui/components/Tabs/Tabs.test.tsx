import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tabs } from './Tabs'

describe('Tabs', () => {
  it('renders successfully', () => {
    const { container } = render(<Tabs />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
