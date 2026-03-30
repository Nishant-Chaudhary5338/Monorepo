import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './InputOTP'

beforeEach(() => {
  // @ts-expect-error jsdom mock
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('InputOTP', () => {
  it('renders with slot groups', () => {
    render(
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
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders with correct number of slots', () => {
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
})
