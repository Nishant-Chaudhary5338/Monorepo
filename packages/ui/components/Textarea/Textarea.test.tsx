import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default textarea', () => {
      const { container } = render(<Textarea />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for textarea with placeholder', () => {
      const { container } = render(<PlaceholderTextarea />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for disabled textarea', () => {
      const { container } = render(<Textarea disabled />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for textarea with value', () => {
      const { container } = render(<Textarea value="Test value" readOnly />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Textarea />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as textarea element', () => {
      const { container } = render(<Textarea />)
      expect(container.firstChild?.nodeName).toBe('TEXTAREA')
    })

    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter your message" />)
      expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument()
    })

    it('renders with value', () => {
      render(<Textarea value="Test Value" readOnly />)
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    it('renders with default value', () => {
      render(<Textarea defaultValue="Default" />)
      expect(screen.getByDisplayValue('Default')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Textarea className="custom-textarea" />)
      expect(container.firstChild).toHaveClass('custom-textarea')
    })

    it('merges custom className with default styles', () => {
      const { container } = render(<Textarea className="my-custom" />)
      expect(container.firstChild).toHaveClass('my-custom')
      expect(container.firstChild).toHaveClass('flex')
    })

    it('forwards ref correctly', () => {
      const ref = { current: null }
      render(<Textarea ref={ref} />)
      expect(ref.current).not.toBeNull()
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Textarea data-testid="my-textarea" aria-label="Message" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-textarea')
      expect(container.firstChild).toHaveAttribute('aria-label', 'Message')
    })

    it('sets name attribute', () => {
      const { container } = render(<Textarea name="message" />)
      expect(container.firstChild).toHaveAttribute('name', 'message')
    })

    it('sets id attribute', () => {
      const { container } = render(<Textarea id="message-input" />)
      expect(container.firstChild).toHaveAttribute('id', 'message-input')
    })

    it('sets rows attribute', () => {
      const { container } = render(<Textarea rows={5} />)
      expect(container.firstChild).toHaveAttribute('rows', '5')
    })
  })

  describe('Interactions', () => {
    it('handles onChange events', () => {
      const handleChange = vi.fn()
      render(<Textarea onChange={handleChange} />)
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'new value' },
      })
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('handles onFocus events', () => {
      const handleFocus = vi.fn()
      render(<Textarea onFocus={handleFocus} />)
      fireEvent.focus(screen.getByRole('textbox'))
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('handles onBlur events', () => {
      const handleBlur = vi.fn()
      render(<Textarea onBlur={handleBlur} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('allows typing when not disabled', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Hello' } })
      expect(textarea).toHaveValue('Hello')
    })
  })

  describe('Disabled State', () => {
    it('applies disabled styles', () => {
      const { container } = render(<Textarea disabled />)
      expect(container.firstChild).toHaveClass('disabled:cursor-not-allowed')
      expect(container.firstChild).toHaveClass('disabled:opacity-50')
    })

    it('sets disabled attribute', () => {
      const { container } = render(<Textarea disabled />)
      expect(container.firstChild).toHaveAttribute('disabled')
    })

    it('does not fire onChange when disabled', () => {
      const handleChange = vi.fn()
      render(<Textarea onChange={handleChange} disabled />)
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'test' },
      })
      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Readonly State', () => {
    it('sets readonly attribute', () => {
      const { container } = render(<Textarea readOnly />)
      expect(container.firstChild).toHaveAttribute('readonly')
    })

    it('does not allow typing when readonly', () => {
      render(<Textarea value="readonly value" readOnly />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveValue('readonly value')
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      const { container } = render(<Textarea aria-label="Message content" />)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Message content')
    })

    it('supports aria-describedby', () => {
      const { container } = render(
        <Textarea aria-describedby="message-hint" />
      )
      expect(container.firstChild).toHaveAttribute(
        'aria-describedby',
        'message-hint'
      )
    })

    it('supports aria-invalid', () => {
      const { container } = render(<Textarea aria-invalid="true" />)
      expect(container.firstChild).toHaveAttribute('aria-invalid', 'true')
    })

    it('supports aria-required', () => {
      const { container } = render(<Textarea aria-required="true" />)
      expect(container.firstChild).toHaveAttribute('aria-required', 'true')
    })

    it('has textbox role', () => {
      render(<Textarea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty textarea', () => {
      const { container } = render(<Textarea />)
      expect(container.firstChild).toHaveValue('')
    })

    it('handles controlled textarea', () => {
      const { rerender } = render(<Textarea value="initial" readOnly />)
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument()

      rerender(<Textarea value="updated" readOnly />)
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument()
    })

    it('handles maxLength', () => {
      const { container } = render(<Textarea maxLength={100} />)
      expect(container.firstChild).toHaveAttribute('maxlength', '100')
    })

    it('handles autoFocus', () => {
      render(<Textarea autoFocus />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveFocus()
    })
  })
})

function PlaceholderTextarea() {
  return <Textarea placeholder="Enter text" />
}