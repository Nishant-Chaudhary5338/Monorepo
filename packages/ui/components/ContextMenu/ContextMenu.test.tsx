import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ContextMenu } from './ContextMenu'

describe('ContextMenu', () => {
  it('renders successfully', () => {
    const { container } = render(<ContextMenu />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
