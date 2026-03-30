import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders successfully', () => {
    render(<Textarea placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Textarea className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Textarea ref={ref} />)
    expect(ref.current).not.toBeNull()
  })

  it('has correct displayName', () => {
    expect(Textarea.displayName).toBe('Textarea')
  })

  it('handles disabled state', () => {
    render(<Textarea disabled placeholder="test" />)
    expect(screen.getByPlaceholderText('test')).toBeDisabled()
  })
})
