import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { Slider } from './Slider'

beforeEach(() => {
  // @ts-expect-error jsdom mock
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('Slider', () => {
  it('renders successfully', () => {
    const { container } = render(<Slider />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Slider className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders with default value', () => {
    const { container } = render(<Slider defaultValue={[50]} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
