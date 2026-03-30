import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover>
        <PopoverTrigger>Toggle</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    )
    expect(screen.getByText('Toggle')).toBeInTheDocument()
  })

  it('renders open popover with content', () => {
    render(
      <Popover open>
        <PopoverTrigger>Toggle</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    )
    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })
})
