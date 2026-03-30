import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default checkbox', () => {
      const { container } = render(<Checkbox />)
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for checked checkbox', () => {
      const { container } = render(<Checkbox checked />)
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for disabled checkbox', () => {
      const { container } = render(<Checkbox disabled />)
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for checkbox with label', () => {
      const { container } = render(
        <div>
          <Checkbox id="terms" />
          <label htmlFor="terms">Accept terms</label>
        </div>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Checkbox />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as button element', () => {
      const { container } = render(<Checkbox />)
      expect(container.firstChild?.nodeName).toBe('BUTTON')
    })

    it('renders with default unchecked state', () => {
      const { container } = render(<Checkbox />)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')
    })
  })

  describe('Checked State', () => {
    it('renders checked state', () => {
      const { container } = render(<Checkbox checked />)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })

    it('toggles checked state on click', () => {
      const { container } = render(<Checkbox />)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })

    it('toggles from checked to unchecked on click', () => {
      const { container } = render(<Checkbox checked />)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')
    })

    it('calls onCheckedChange when toggled', () => {
      const handleCheckedChange = vi.fn()
      const { container } = render(<Checkbox onCheckedChange={handleCheckedChange} />)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('calls onCheckedChange with false when unchecking', () => {
      const handleCheckedChange = vi.fn()
      const { container } = render(
        <Checkbox checked onCheckedChange={handleCheckedChange} />
      )
      fireEvent.click(container.firstChild as HTMLElement)
      expect(handleCheckedChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Controlled State', () => {
    it('respects checked prop', () => {
      const { container } = render(<Checkbox checked />)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })

    it('respects unchecked checked prop', () => {
      const { container } = render(<Checkbox checked={false} />)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')
    })

    it('updates when checked prop changes', () => {
      const { container, rerender } = render(<Checkbox checked={false} />)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')

      rerender(<Checkbox checked={true} />)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      const { container } = render(<Checkbox disabled />)
      expect(container.firstChild).toHaveAttribute('disabled')
    })

    it('applies disabled styles', () => {
      const { container } = render(<Checkbox disabled />)
      expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed')
      expect(container.firstChild).toHaveClass('disabled:opacity-50')
    })

    it('does not toggle when disabled', () => {
      const handleCheckedChange = vi.fn()
      const { container } = render(
        <Checkbox disabled onCheckedChange={handleCheckedChange} />
      )
      fireEvent.click(container.firstChild as HTMLElement)
      expect(handleCheckedChange).not.toHaveBeenCalled()
    })

    it('maintains checked state when disabled', () => {
      const { container } = render(<Checkbox checked disabled />)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Checkbox className="custom-checkbox" />)
      expect(container.firstChild).toHaveClass('custom-checkbox')
    })

    it('merges custom className with default styles', () => {
      const { container } = render(<Checkbox className="my-custom" />)
      expect(container.firstChild).toHaveClass('my-custom')
      expect(container.firstChild).toHaveClass('peer')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      render(<Checkbox ref={ref} />)
      expect(ref.current).not.toBeNull()
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Checkbox data-testid="my-checkbox" aria-label="Accept terms" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-checkbox')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Accept terms')
    })

    it('sets name attribute', () => {
      const { container } = render(<Checkbox name="terms" />)
      expect(container.firstChild).toHaveAttribute('name', 'terms')
    })

    it('sets value attribute', () => {
      const { container } = render(<Checkbox value="accepted" />)
      expect(container.firstChild).toHaveAttribute('value', 'accepted')
    })
  })

  describe('Required State', () => {
    it('sets aria-required when required', () => {
      const { container } = render(<Checkbox required />)
      expect(container.firstChild).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Accessibility', () => {
    it('has checkbox role', () => {
      const { container } = render(<Checkbox />)
      expect(container.firstChild).toHaveAttribute('role', 'checkbox')
    })

    it('supports aria-label', () => {
      const { container } = render(<Checkbox aria-label="Accept terms" />)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Accept terms')
    })

    it('supports aria-describedby', () => {
      const { container } = render(
        <Checkbox aria-describedby="terms-hint" />
      )
      expect(container.firstChild).toHaveAttribute('aria-describedby', 'terms-hint')
    })

    it('supports aria-checked', () => {
      const { container } = render(<Checkbox checked />)
      expect(container.firstChild).toHaveAttribute('aria-checked', 'true')
    })

    it('supports aria-invalid', () => {
      const { container } = render(<Checkbox aria-invalid="true" />)
      expect(container.firstChild).toHaveAttribute('aria-invalid', 'true')
    })

    it('can be associated with a label', () => {
      render(
        <div>
          <Checkbox id="my-checkbox" />
          <label htmlFor="my-checkbox">My Checkbox</label>
        </div>
      )
      const checkbox = document.getElementById('my-checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('can be focused', () => {
      const { container } = render(<Checkbox />)
      const checkbox = container.firstChild as HTMLElement
      checkbox.focus()
      expect(checkbox).toHaveFocus()
    })

    it('toggles on Space key', () => {
      const { container } = render(<Checkbox />)
      fireEvent.keyDown(container.firstChild as HTMLElement, { key: ' ' })
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid clicks', () => {
      const handleCheckedChange = vi.fn()
      const { container } = render(
        <Checkbox onCheckedChange={handleCheckedChange} />
      )
      const checkbox = container.firstChild as HTMLElement

      fireEvent.click(checkbox)
      fireEvent.click(checkbox)
      fireEvent.click(checkbox)

      expect(handleCheckedChange).toHaveBeenCalledTimes(3)
    })

    it('handles undefined checked prop', () => {
      const { container } = render(<Checkbox checked={undefined} />)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')
    })

    it('handles asChild prop', () => {
      const { container } = render(
        <Checkbox asChild>
          <button>Custom Checkbox</button>
        </Checkbox>
      )
      expect(container.firstChild?.nodeName).toBe('BUTTON')
    })
  })
})