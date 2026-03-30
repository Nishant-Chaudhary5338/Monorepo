import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders successfully', () => {
    const { container } = render(<Breadcrumb />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
