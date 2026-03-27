import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('renders successfully', () => {
    render(<Input>Test Content</Input>)
    expect(screen.getByPlaceholderText('test')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Input className="custom-class">Test</Input>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Input ref={ref}>Test</Input>)
    expect(ref.current).not.toBeNull()
  })

  it('spreads additional props', () => {
    render(<Input data-testid="test-component">Test</Input>)
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
  })
})
