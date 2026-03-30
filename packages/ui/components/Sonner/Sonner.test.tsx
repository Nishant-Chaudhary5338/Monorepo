import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { Toaster } from './Sonner'

beforeEach(() => {
  // @ts-expect-error jsdom mock
  global.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
})

describe('Toaster', () => {
  it('renders successfully', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeDefined()
  })
})
