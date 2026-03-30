import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

describe('HoverCard', () => {
  it('renders trigger', () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>
    )
    expect(screen.getByText('Trigger')).toBeInTheDocument()
  })

  it('renders open hover card with content', () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent>Hover content</HoverCardContent>
      </HoverCard>
    )
    expect(screen.getByText('Hover content')).toBeInTheDocument()
  })
})
