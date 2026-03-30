import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

  it('has correct displayName', () => {
    expect(Button.displayName).toBe('Button')
  })

  it('handles onClick events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies disabled styles when disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    expect(container.firstChild).toHaveClass('disabled:pointer-events-none')
  })
})
