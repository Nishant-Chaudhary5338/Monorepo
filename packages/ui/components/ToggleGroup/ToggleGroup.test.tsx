import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

describe('ToggleGroup', () => {
  it('renders toggle group with items', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})
