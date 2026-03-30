import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

describe('ToggleGroup', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default toggle group', () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders toggle items', () => {
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

  describe('Single Selection', () => {
    it('allows single selection', () => {
      const { container } = render(
        <ToggleGroup type="single" defaultValue="a">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      )
      const items = container.querySelectorAll('[data-state="on"]')
      expect(items).toHaveLength(1)
    })

    it('calls onValueChange for single selection', () => {
      const handleValueChange = vi.fn()
      render(
        <ToggleGroup type="single" onValueChange={handleValueChange}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      )
      fireEvent.click(screen.getByText('B'))
      expect(handleValueChange).toHaveBeenCalledWith('b')
    })
  })

  describe('Multiple Selection', () => {
    it('allows multiple selection', () => {
      const { container } = render(
        <ToggleGroup type="multiple" defaultValue={["a", "b"]}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      )
      const items = container.querySelectorAll('[data-state="on"]')
      expect(items).toHaveLength(2)
    })

    it('calls onValueChange for multiple selection', () => {
      const handleValueChange = vi.fn()
      render(
        <ToggleGroup type="multiple" onValueChange={handleValueChange}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      )
      fireEvent.click(screen.getByText('A'))
      expect(handleValueChange).toHaveBeenCalled()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ToggleGroup type="single" className="custom-group">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )
      expect(container.firstChild).toHaveClass('custom-group')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <ToggleGroup type="single" data-testid="my-toggle-group">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-toggle-group')
    })
  })

  describe('Accessibility', () => {
    it('has group role', () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )
      expect(container.firstChild).toHaveAttribute('role', 'group')
    })
  })
})