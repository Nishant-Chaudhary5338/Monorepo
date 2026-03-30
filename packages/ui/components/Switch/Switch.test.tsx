import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default switch', () => {
      const { container } = render(<Switch />)
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for checked switch', () => {
      const { container } = render(<Switch checked />)
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for disabled switch', () => {
      const { container } = render(<Switch disabled />)
      expect(container).toMatchSnapshot()
    })

    it('matches snapshot for switch with label', () => {
      const { container } = render(
        <div className="flex items-center gap-2">
          <Switch id="dark-mode" />
          <label htmlFor="dark-mode">Dark Mode</label>
        </div>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Switch />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as button element', () => {
      const { container } = render(<Switch />)
      expect(container.firstChild?.nodeName).toBe('BUTTON')
    })

    it('renders with default unchecked state', () => {
      const { container } = render(<Switch />)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')
    })

    it('renders thumb element', () => {
      const { container } = render(<Switch />)
      const thumb = container.querySelector('span')
      expect(thumb).toBeInTheDocument()
    })
  })

  describe('Checked State', () => {
    it('renders checked state', () => {
      const { container } = render(<Switch checked />)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })

    it('toggles checked state on click', () => {
      const { container } = render(<Switch />)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })

    it('toggles from checked to unchecked on click', () => {
      const { container } = render(<Switch checked />)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')
    })

    it('calls onCheckedChange when toggled', () => {
      const handleCheckedChange = vi.fn()
      const { container } = render(<Switch onCheckedChange={handleCheckedChange} />)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(handleCheckedChange).toHaveBeenCalledWith(true)
    })

    it('calls onCheckedChange with false when unchecking', () => {
      const handleCheckedChange = vi.fn()
      const { container } = render(
        <Switch checked onCheckedChange={handleCheckedChange} />
      )
      fireEvent.click(container.firstChild as HTMLElement)
      expect(handleCheckedChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Controlled State', () => {
    it('respects checked prop', () => {
      const { container } = render(<Switch checked />)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })

    it('respects unchecked checked prop', () => {
      const { container } = render(<Switch checked={false} />)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')
    })

    it('updates when checked prop changes', () => {
      const { container, rerender } = render(<Switch checked={false} />)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')

      rerender(<Switch checked={true} />)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      const { container } = render(<Switch disabled />)
      expect(container.firstChild).toHaveAttribute('disabled')
    })

    it('applies disabled styles', () => {
      const { container } = render(<Switch disabled />)
      expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed')
      expect(container.firstChild).toHaveClass('disabled:opacity-50')
    })

    it('does not toggle when disabled', () => {
      const handleCheckedChange = vi.fn()
      const { container } = render(
        <Switch disabled onCheckedChange={handleCheckedChange} />
      )
      fireEvent.click(container.firstChild as HTMLElement)
      expect(handleCheckedChange).not.toHaveBeenCalled()
    })

    it('maintains checked state when disabled', () => {
      const { container } = render(<Switch checked disabled />)
      fireEvent.click(container.firstChild as HTMLElement)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Switch className="custom-switch" />)
      expect(container.firstChild).toHaveClass('custom-switch')
    })

    it('merges custom className with default styles', () => {
      const { container } = render(<Switch className="my-custom" />)
      expect(container.firstChild).toHaveClass('my-custom')
      expect(container.firstChild).toHaveClass('peer')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      render(<Switch ref={ref} />)
      expect(ref.current).not.toBeNull()
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Switch data-testid="my-switch" aria-label="Toggle dark mode" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-switch')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Toggle dark mode')
    })

    it('sets name attribute', () => {
      const { container } = render(<Switch name="dark-mode" />)
      expect(container.firstChild).toHaveAttribute('name', 'dark-mode')
    })

    it('sets value attribute', () => {
      const { container } = render(<Switch value="on" />)
      expect(container.firstChild).toHaveAttribute('value', 'on')
    })
  })

  describe('Required State', () => {
    it('sets aria-required when required', () => {
      const { container } = render(<Switch required />)
      expect(container.firstChild).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Accessibility', () => {
    it('has switch role', () => {
      const { container } = render(<Switch />)
      expect(container.firstChild).toHaveAttribute('role', 'switch')
    })

    it('supports aria-label', () => {
      const { container } = render(<Switch aria-label="Enable notifications" />)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Enable notifications')
    })

    it('supports aria-describedby', () => {
      const { container } = render(
        <Switch aria-describedby="switch-hint" />
      )
      expect(container.firstChild).toHaveAttribute('aria-describedby', 'switch-hint')
    })

    it('supports aria-checked', () => {
      const { container } = render(<Switch checked />)
      expect(container.firstChild).toHaveAttribute('aria-checked', 'true')
    })

    it('supports aria-checked false', () => {
      const { container } = render(<Switch checked={false} />)
      expect(container.firstChild).toHaveAttribute('aria-checked', 'false')
    })

    it('supports aria-invalid', () => {
      const { container } = render(<Switch aria-invalid="true" />)
      expect(container.firstChild).toHaveAttribute('aria-invalid', 'true')
    })

    it('can be associated with a label', () => {
      render(
        <div>
          <Switch id="my-switch" />
          <label htmlFor="my-switch">My Switch</label>
        </div>
      )
      const switchEl = document.getElementById('my-switch')
      expect(switchEl).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('can be focused', () => {
      const { container } = render(<Switch />)
      const switchEl = container.firstChild as HTMLElement
      switchEl.focus()
      expect(switchEl).toHaveFocus()
    })

    it('toggles on Space key', () => {
      const { container } = render(<Switch />)
      fireEvent.keyDown(container.firstChild as HTMLElement, { key: ' ' })
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })

    it('toggles on Enter key', () => {
      const { container } = render(<Switch />)
      fireEvent.keyDown(container.firstChild as HTMLElement, { key: 'Enter' })
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid clicks', () => {
      const handleCheckedChange = vi.fn()
      const { container } = render(
        <Switch onCheckedChange={handleCheckedChange} />
      )
      const switchEl = container.firstChild as HTMLElement

      fireEvent.click(switchEl)
      fireEvent.click(switchEl)
      fireEvent.click(switchEl)

      expect(handleCheckedChange).toHaveBeenCalledTimes(3)
    })

    it('handles undefined checked prop', () => {
      const { container } = render(<Switch checked={undefined} />)
      expect(container.firstChild).toHaveAttribute('data-state', 'unchecked')
    })

    it('handles defaultChecked prop', () => {
      const { container } = render(<Switch defaultChecked />)
      expect(container.firstChild).toHaveAttribute('data-state', 'checked')
    })

    it('thumb moves when toggled', () => {
      const { container } = render(<Switch />)
      const thumb = container.querySelector('span')
      expect(thumb).toHaveClass('left-[2px]')

      fireEvent.click(container.firstChild as HTMLElement)
      expect(thumb).toHaveClass('left-[18px]')
    })
  })
})