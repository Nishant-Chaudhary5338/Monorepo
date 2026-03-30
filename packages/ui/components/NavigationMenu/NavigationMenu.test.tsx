import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { NavigationMenu } from './NavigationMenu'

describe('NavigationMenu', () => {
  it('renders successfully', () => {
    const { container } = render(<NavigationMenu />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
