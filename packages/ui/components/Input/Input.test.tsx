import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default input', () => {
      const { container } = render(<Input />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for input with placeholder', () => {
      const { container } = render(<Input placeholder="Enter text" />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for disabled input', () => {
      const { container } = render(<Input disabled />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for input with value', () => {
      const { container } = render(<Input value="Test value" readOnly />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Input />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as input element', () => {
      const { container } = render(<Input />)
      expect(container.firstChild?.nodeName).toBe('INPUT')
    })

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter your name" />)
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })

    it('renders with value', () => {
      render(<Input value="Test Value" readOnly />)
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    it('renders with default value', () => {
      render(<Input defaultValue="Default" />)
      expect(screen.getByDisplayValue('Default')).toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('renders text input by default', () => {
      const { container } = render(<Input />)
      expect(container.firstChild).toHaveAttribute('type', 'text')
    })

    it('renders email input', () => {
      const { container } = render(<Input type="email" />)
      expect(container.firstChild).toHaveAttribute('type', 'email')
    })

    it('renders password input', () => {
      const { container } = render(<Input type="password" />)
      expect(container.firstChild).toHaveAttribute('type', 'password')
    })

    it('renders number input', () => {
      const { container } = render(<Input type="number" />)
      expect(container.firstChild).toHaveAttribute('type', 'number')
    })

    it('renders search input', () => {
      const { container } = render(<Input type="search" />)
      expect(container.firstChild).toHaveAttribute('type', 'search')
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Input className="custom-input" />)
      expect(container.firstChild).toHaveClass('custom-input')
    })

    it('merges custom className with default styles', () => {
      const { container } = render(<Input className="my-custom" />)
      expect(container.firstChild).toHaveClass('my-custom')
      expect(container.firstChild).toHaveClass('flex')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      render(<Input ref={ref} />)
      expect(ref.current).not.toBeNull()
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Input data-testid="my-input" aria-label="Username" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-input')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Username')
    })

    it('sets name attribute', () => {
      const { container } = render(<Input name="username" />)
      expect(container.firstChild).toHaveAttribute('name', 'username')
    })

    it('sets id attribute', () => {
      const { container } = render(<Input id="email-input" />)
      expect(container.firstChild).toHaveAttribute('id', 'email-input')
    })
  })

  describe('Interactions', () => {
    it('handles onChange events', () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} />)
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'new value' },
      })
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('handles onFocus events', () => {
      const handleFocus = vi.fn()
      render(<Input onFocus={handleFocus} />)
      fireEvent.focus(screen.getByRole('textbox'))
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('handles onBlur events', () => {
      const handleBlur = vi.fn()
      render(<Input onBlur={handleBlur} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('handles onKeyDown events', () => {
      const handleKeyDown = vi.fn()
      render(<Input onKeyDown={handleKeyDown} />)
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })

    it('allows typing when not disabled', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'Hello' } })
      expect(input).toHaveValue('Hello')
    })
  })

  describe('Disabled State', () => {
    it('applies disabled styles', () => {
      const { container } = render(<Input disabled />)
      expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed')
      expect(container.firstChild).toHaveClass('disabled:opacity-50')
    })

    it('sets disabled attribute', () => {
      const { container } = render(<Input disabled />)
      expect(container.firstChild).toHaveAttribute('disabled')
    })

    it('does not fire onChange when disabled', () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} disabled />)
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'test' },
      })
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Readonly State', () => {
    it('sets readonly attribute', () => {
      const { container } = render(<Input readOnly />)
      expect(container.firstChild).toHaveAttribute('readonly')
    })

    it('does not allow typing when readonly', () => {
      render(<Input value="readonly value" readOnly />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('readonly value')
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      const { container } = render(<Input aria-label="Email address" />)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Email address')
    })

    it('supports aria-describedby', () => {
      const { container } = render(
        <Input aria-describedby="email-hint" />
      )
      expect(container.firstChild).toHaveAttribute(
        'aria-describedby',
        'email-hint'
      )
    })

    it('supports aria-invalid', () => {
      const { container } = render(<Input aria-invalid="true" />)
      expect(container.firstChild).toHaveAttribute('aria-invalid', 'true')
    })

    it('supports aria-required', () => {
      const { container } = render(<Input aria-required="true" />)
      expect(container.firstChild).toHaveAttribute('aria-required', 'true')
    })

    it('has textbox role', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty input', () => {
      const { container } = render(<Input />)
      expect(container.firstChild).toHaveValue('')
    })

    it('handles controlled input', () => {
      const { rerender } = render(<Input value="initial" readOnly />)
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument()

      rerender(<Input value="updated" readOnly />)
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument()
    })

    it('handles maxLength', () => {
      const { container } = render(<Input maxLength={10} />)
      expect(container.firstChild).toHaveAttribute('maxlength', '10')
    })

    it('handles min and max for number input', () => {
      const { container } = render(
        <Input type="number" min={0} max={100} />
      )
      expect(container.firstChild).toHaveAttribute('min', '0')
      expect(container.firstChild).toHaveAttribute('max', '100')
    })

    it('handles autoComplete', () => {
      const { container } = render(<Input autoComplete="email" />)
      expect(container.firstChild).toHaveAttribute('autocomplete', 'email')
    })

    it('handles autoFocus', () => {
      render(<Input autoFocus />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveFocus()
    })
  })
})