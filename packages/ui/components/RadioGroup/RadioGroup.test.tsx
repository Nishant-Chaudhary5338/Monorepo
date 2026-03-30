import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

describe('RadioGroup', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default radio group', () => {
      const { container } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      )
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for radio group with labels', () => {
      const { container } = render(
        <RadioGroup>
          <div>
            <RadioGroupItem value="option1" id="r1" />
            <label htmlFor="r1">Option 1</label>
          </div>
          <div>
            <RadioGroupItem value="option2" id="r2" />
            <label htmlFor="r2">Option 2</label>
          </div>
        </RadioGroup>
      )
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>
      )
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('renders radio items', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      )
      const radios = screen.getAllByRole('radio')
      expect(radios).toHaveLength(2)
    })
  })

  describe('Value', () => {
    it('applies default value', () => {
      const { container } = render(
        <RadioGroup defaultValue="option2">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      )
      const radios = container.querySelectorAll('[role="radio"]')
      expect(radios[1]).toHaveAttribute('data-state', 'checked')
    })

    it('handles controlled value', () => {
      const { container } = render(
        <RadioGroup value="option1">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      )
      const radios = container.querySelectorAll('[role="radio"]')
      expect(radios[0]).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Props', () => {
    it('applies custom className to group', () => {
      const { container } = render(
        <RadioGroup className="custom-group">
          <RadioGroupItem value="option1" />
        </RadioGroup>
      )
      expect(container.firstChild).toHaveClass('custom-group')
    })

    it('applies custom className to item', () => {
      const { container } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" className="custom-item" />
        </RadioGroup>
      )
      const item = container.querySelector('[role="radio"]')
      expect(item).toHaveClass('custom-item')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <RadioGroup data-testid="my-radio-group">
          <RadioGroupItem value="option1" />
        </RadioGroup>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-radio-group')
    })
  })

  describe('Interactions', () => {
    it('calls onValueChange when selection changes', () => {
      const handleValueChange = vi.fn()
      render(
        <RadioGroup onValueChange={handleValueChange}>
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      )
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[1])
      expect(handleValueChange).toHaveBeenCalledWith('option2')
    })

    it('only one item can be selected at a time', () => {
      const { container } = render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      )
      const radios = container.querySelectorAll('[role="radio"]')
      expect(radios[0]).toHaveAttribute('data-state', 'checked')
      expect(radios[1]).toHaveAttribute('data-state', 'unchecked')
    })
  })

  describe('Disabled State', () => {
    it('disables individual items', () => {
      const { container } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" disabled />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      )
      const radios = container.querySelectorAll('[role="radio"]')
      expect(radios[0]).toHaveAttribute('disabled')
      expect(radios[1]).not.toHaveAttribute('disabled')
    })

    it('does not change selection when disabled item is clicked', () => {
      const handleValueChange = vi.fn()
      render(
        <RadioGroup onValueChange={handleValueChange} defaultValue="option1">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" disabled />
        </RadioGroup>
      )
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[1])
      expect(handleValueChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has radiogroup role', () => {
      const { container } = render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>
      )
      expect(container.firstChild).toHaveAttribute('role', 'radiogroup')
    })

    it('items have radio role', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      const { container } = render(
        <RadioGroup aria-label="Select option">
          <RadioGroupItem value="option1" />
        </RadioGroup>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Select option')
    })

    it('selected item has aria-checked true', () => {
      const { container } = render(
        <RadioGroup defaultValue="option1">
          <RadioGroupItem value="option1" />
        </RadioGroup>
      )
      const radio = container.querySelector('[role="radio"]')
      expect(radio).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty radio group', () => {
      const { container } = render(<RadioGroup />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles single radio item', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="only" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio')).toBeInTheDocument()
    })

    it('handles many radio items', () => {
      const items = Array.from({ length: 10 }, (_, i) => (
        <RadioGroupItem key={i} value={`option${i}`} />
      ))
      render(<RadioGroup>{items}</RadioGroup>)
      const radios = screen.getAllByRole('radio')
      expect(radios).toHaveLength(10)
    })
  })
})