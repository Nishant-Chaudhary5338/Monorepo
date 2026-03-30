import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'

describe('Tooltip', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default tooltip', () => {
      const { container } = render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders trigger successfully', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      expect(screen.getByText('Hover me')).toBeInTheDocument()
    })

    it('renders trigger as button by default', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="custom-trigger">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('passes through additional HTML attributes to trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="my-tooltip-trigger">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      expect(screen.getByTestId('my-tooltip-trigger')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('trigger has button role', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('supports aria-label on trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger aria-label="Help">?</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', 'Help')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty tooltip', () => {
      const { container } = render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex content in trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span>Icon</span>
              <span>Text</span>
            </TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })
  })
})