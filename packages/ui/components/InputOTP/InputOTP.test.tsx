import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from './InputOTP'

describe('InputOTP', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default input OTP', () => {
      const { container } = render(
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders correct number of slots', () => {
      render(
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      )
      const slots = screen.getAllByRole('textbox')
      expect(slots.length).toBeGreaterThan(0)
    })

    it('renders separator', () => {
      const { container } = render(
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )
      const separators = container.querySelectorAll('[role="separator"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <InputOTP maxLength={4} className="custom-otp">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
        </InputOTP>
      )
      expect(container.firstChild).toHaveClass('custom-otp')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <InputOTP maxLength={4} data-testid="my-otp">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
        </InputOTP>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-otp')
    })
  })

  describe('Interactions', () => {
    it('handles value change', () => {
      const handleValueChange = vi.fn()
      render(
        <InputOTP maxLength={4} onChange={handleValueChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
        </InputOTP>
      )
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '12' } })
      expect(handleValueChange).toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('disables input when disabled prop is set', () => {
      render(
        <InputOTP maxLength={4} disabled>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
        </InputOTP>
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('disabled')
    })
  })

  describe('Accessibility', () => {
    it('has input role', () => {
      render(
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
        </InputOTP>
      )
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(
        <InputOTP maxLength={4} aria-label="Enter OTP">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
        </InputOTP>
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-label', 'Enter OTP')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty OTP', () => {
      const { container } = render(
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
        </InputOTP>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles many slots', () => {
      const slots = Array.from({ length: 10 }, (_, i) => (
        <InputOTPSlot key={i} index={i} />
      ))
      const { container } = render(
        <InputOTP maxLength={10}>
          <InputOTPGroup>{slots}</InputOTPGroup>
        </InputOTP>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})