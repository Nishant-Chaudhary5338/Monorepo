import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './HoverCard'

describe('HoverCard', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default hover card', () => {
      const { container } = render(
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders trigger successfully', () => {
      const { container } = render(
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      expect(screen.getByText('Hover me')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to trigger', () => {
      const { container } = render(
        <HoverCard>
          <HoverCardTrigger className="custom-trigger">Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      const trigger = container.querySelector('[data-state]')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <HoverCard>
          <HoverCardTrigger data-testid="my-hover-card">Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      expect(screen.getByTestId('my-hover-card')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('renders content text', () => {
      render(
        <HoverCard open>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      expect(screen.getByText('Hover content')).toBeInTheDocument()
    })

    it('renders complex content', () => {
      render(
        <HoverCard open>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>
            <div>
              <h3>Title</h3>
              <p>Description</p>
              <button>Action</button>
            </div>
          </HoverCardContent>
        </HoverCard>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })

  describe('Controlled State', () => {
    it('respects open prop', () => {
      render(
        <HoverCard open>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      expect(screen.getByText('Hover content')).toBeInTheDocument()
    })

    it('does not show content when open is false', () => {
      render(
        <HoverCard open={false}>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      expect(screen.queryByText('Hover content')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('trigger has correct role', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      const trigger = screen.getByText('Hover me')
      expect(trigger).toHaveAttribute('data-state', 'closed')
    })

    it('supports aria-label', () => {
      render(
        <HoverCard>
          <HoverCardTrigger aria-label="User profile">Hover me</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      const trigger = screen.getByText('Hover me')
      expect(trigger).toHaveAttribute('aria-label', 'User profile')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty hover card', () => {
      const { container } = render(
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent></HoverCardContent>
        </HoverCard>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles complex content in trigger', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>
            <span>Icon</span>
            <span>Text</span>
          </HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
      )
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })
  })
})