import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from './ContextMenu'

describe('ContextMenu', () => {
  it('renders trigger', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    expect(screen.getByText('Right click me')).toBeInTheDocument()
  })
})
