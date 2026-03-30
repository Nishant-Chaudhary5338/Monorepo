import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './Alert'

describe('Alert', () => {
  it('renders successfully', () => {
    render(<Alert>Test Content</Alert>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Alert className="custom-class">Test</Alert>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('has correct displayName', () => {
    expect(Alert.displayName).toBe('Alert')
  })

  it('renders with destructive variant', () => {
    const { container } = render(<Alert variant="destructive">Error</Alert>)
    expect(container.firstChild).toHaveClass('border-destructive/50')
  })
})

describe('AlertTitle', () => {
  it('renders title text', () => {
    render(<AlertTitle>Title</AlertTitle>)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })
})

describe('AlertDescription', () => {
  it('renders description text', () => {
    render(<AlertDescription>Description</AlertDescription>)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})
