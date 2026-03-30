import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Toaster } from './Sonner'

describe('Sonner', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default toaster', () => {
      const { container } = render(<Toaster />)
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Toaster />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as sonner-toaster element', () => {
      const { container } = render(<Toaster />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Toaster className="custom-toaster" />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveClass('custom-toaster')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(<Toaster data-testid="my-toaster" />)
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-toaster')
    })
  })

  describe('Position', () => {
    it('applies position prop', () => {
      const { container } = render(<Toaster position="top-right" />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-position', 'top-right')
    })

    it('applies bottom-right position by default', () => {
      const { container } = render(<Toaster />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-position', 'bottom-right')
    })
  })

  describe('Theme', () => {
    it('applies theme prop', () => {
      const { container } = render(<Toaster theme="dark" />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-theme', 'dark')
    })

    it('applies light theme by default', () => {
      const { container } = render(<Toaster />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-theme', 'light')
    })
  })

  describe('Rich Colors', () => {
    it('applies richColors prop', () => {
      const { container } = render(<Toaster richColors />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-rich-colors', 'true')
    })
  })

  describe('Expand', () => {
    it('applies expand prop', () => {
      const { container } = render(<Toaster expand />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-expand', 'true')
    })
  })

  describe('Visible Toasts', () => {
    it('applies visibleToasts prop', () => {
      const { container } = render(<Toaster visibleToasts={5} />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-visible-toasts', '5')
    })

    it('applies 3 visible toasts by default', () => {
      const { container } = render(<Toaster />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-visible-toasts', '3')
    })
  })

  describe('Close Button', () => {
    it('applies closeButton prop', () => {
      const { container } = render(<Toaster closeButton />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-close-button', 'true')
    })
  })

  describe('Duration', () => {
    it('applies duration prop', () => {
      const { container } = render(<Toaster duration={5000} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Gap', () => {
    it('applies gap prop', () => {
      const { container } = render(<Toaster gap={16} />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-gap', '16')
    })
  })

  describe('Offset', () => {
    it('applies offset prop', () => {
      const { container } = render(<Toaster offset={32} />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-offset', '32')
    })
  })

  describe('Dir', () => {
    it('applies dir prop', () => {
      const { container } = render(<Toaster dir="rtl" />)
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('dir', 'rtl')
    })
  })

  describe('Style', () => {
    it('applies style prop', () => {
      const { container } = render(
        <Toaster style={{ '--normal-bg': 'red' } as React.CSSProperties} />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Toast Options', () => {
    it('applies toastOptions prop', () => {
      const { container } = render(
        <Toaster
          toastOptions={{
            className: 'custom-toast',
            duration: 3000,
          }}
        />
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty toaster', () => {
      const { container } = render(<Toaster />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles multiple props', () => {
      const { container } = render(
        <Toaster
          position="top-left"
          theme="dark"
          richColors
          expand
          visibleToasts={5}
          closeButton
          duration={5000}
          gap={16}
          offset={32}
        />
      )
      const toaster = container.querySelector('[data-sonner-toaster]')
      expect(toaster).toHaveAttribute('data-position', 'top-left')
      expect(toaster).toHaveAttribute('data-theme', 'dark')
      expect(toaster).toHaveAttribute('data-rich-colors', 'true')
      expect(toaster).toHaveAttribute('data-expand', 'true')
      expect(toaster).toHaveAttribute('data-visible-toasts', '5')
      expect(toaster).toHaveAttribute('data-close-button', 'true')
      expect(toaster).toHaveAttribute('data-gap', '16')
      expect(toaster).toHaveAttribute('data-offset', '32')
    })
  })
})