import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './Alert'

describe('Alert', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default alert', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for destructive alert', () => {
      const { container } = render(
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong</AlertDescription>
        </Alert>
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Test Alert</AlertTitle>
        </Alert>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders alert title', () => {
      render(
        <Alert>
          <AlertTitle>My Title</AlertTitle>
        </Alert>
      )
      expect(screen.getByText('My Title')).toBeInTheDocument()
    })

    it('renders alert description', () => {
      render(
        <Alert>
          <AlertDescription>My Description</AlertDescription>
        </Alert>
      )
      expect(screen.getByText('My Description')).toBeInTheDocument()
    })

    it('renders complete alert', () => {
      render(
        <Alert>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('applies default variant styles', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Default</AlertTitle>
        </Alert>
      )
      expect(container.firstChild).toHaveClass('bg-background')
    })

    it('applies destructive variant styles', () => {
      const { container } = render(
        <Alert variant="destructive">
          <AlertTitle>Destructive</AlertTitle>
        </Alert>
      )
      expect(container.firstChild).toHaveClass('border-destructive/50')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Alert className="custom-alert">
          <AlertTitle>Test</AlertTitle>
        </Alert>
      )
      expect(container.firstChild).toHaveClass('custom-alert')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Alert data-testid="my-alert" role="alert">
          <AlertTitle>Test</AlertTitle>
        </Alert>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-alert')
      expect(container.firstChild).toHaveAttribute('role', 'alert')
    })
  })

  describe('Accessibility', () => {
    it('has alert role', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Accessible Alert</AlertTitle>
        </Alert>
      )
      expect(container.firstChild).toHaveAttribute('role', 'alert')
    })

    it('supports aria-label', () => {
      const { container } = render(
        <Alert aria-label="Notification">
          <AlertTitle>Test</AlertTitle>
        </Alert>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Notification')
    })
  })

  describe('Edge Cases', () => {
    it('handles alert without title', () => {
      render(
        <Alert>
          <AlertDescription>Description only</AlertDescription>
        </Alert>
      )
      expect(screen.getByText('Description only')).toBeInTheDocument()
    })

    it('handles alert without description', () => {
      render(
        <Alert>
          <AlertTitle>Title only</AlertTitle>
        </Alert>
      )
      expect(screen.getByText('Title only')).toBeInTheDocument()
    })

    it('handles complex children', () => {
      render(
        <Alert>
          <AlertTitle>Complex Alert</AlertTitle>
          <AlertDescription>
            <div>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
          </AlertDescription>
        </Alert>
      )
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
    })
  })
})