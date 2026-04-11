import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders successfully', () => {
    render(<Button>Test Content</Button>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Test</Button>)
    expect(ref.current).not.toBeNull()
  })

  it('spreads additional props', () => {
    render(<Button data-testid="test-component">Test</Button>)
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
  })

  it('has correct displayName', () => {
    expect(Button.displayName).toBe('Button')
  })
})
