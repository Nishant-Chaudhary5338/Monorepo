import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('renders successfully', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Input className="custom-class" placeholder="test" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('INPUT')
  })

  it('spreads additional props', () => {
    render(<Input data-testid="test-input" />)
    expect(screen.getByTestId('test-input')).toBeInTheDocument()
  })

  it('applies default type of text', () => {
    render(<Input data-testid="type-test" />)
    expect(screen.getByTestId('type-test')).toHaveAttribute('type', 'text')
  })

  it('accepts type prop', () => {
    render(<Input type="email" data-testid="email-test" />)
    expect(screen.getByTestId('email-test')).toHaveAttribute('type', 'email')
  })

  it('accepts password type', () => {
    render(<Input type="password" data-testid="pw-test" />)
    expect(screen.getByTestId('pw-test')).toHaveAttribute('type', 'password')
  })

  it('can be disabled', () => {
    render(<Input disabled data-testid="disabled-test" />)
    expect(screen.getByTestId('disabled-test')).toBeDisabled()
  })

  it('accepts value prop', () => {
    render(<Input value="hello" onChange={() => {}} data-testid="value-test" />)
    expect(screen.getByTestId('value-test')).toHaveValue('hello')
  })

  it('has correct displayName', () => {
    expect(Input.displayName).toBe('Input')
  })
})
