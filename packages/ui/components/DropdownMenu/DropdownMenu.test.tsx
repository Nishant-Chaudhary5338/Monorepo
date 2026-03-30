import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './DropdownMenu'

describe('DropdownMenu', () => {
  it('renders trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('renders open dropdown with items', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })
})
