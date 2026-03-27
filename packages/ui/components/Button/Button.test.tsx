import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  // Basic rendering tests
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

  // Accessibility tests
  it('has correct displayName', () => {
    expect(Button.displayName).toBe('Button')
  })

  
  // Variant tests
  it('renders with default variant', () => {
    const { container } = render(<Button variant="default">Default</Button>)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('renders with destructive variant', () => {
    const { container } = render(<Button variant="destructive">Destructive</Button>)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('renders with outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    expect(container.firstChild).toHaveClass('border-input')
  })
  

  
  // Size tests
  it('renders with default size', () => {
    const { container } = render(<Button size="default">Default</Button>)
    expect(container.firstChild).toHaveClass('h-10')
  })

  it('renders with small size', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    expect(container.firstChild).toHaveClass('h-9')
  })

  it('renders with large size', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    expect(container.firstChild).toHaveClass('h-11')
  })
  

  // Event handler tests
  it('handles onClick events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Disabled state tests
  it('applies disabled styles when disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    expect(container.firstChild).toHaveClass('disabled:pointer-events-none')
  })
})
