import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from './Slider'

describe('Slider', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default slider', () => {
      const { container } = render(<Slider />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for slider with value', () => {
      const { container } = render(<Slider defaultValue={[50]} />)
      expect(container.firstChild).toMatchSnapshot()
    })

    it('matches snapshot for range slider', () => {
      const { container } = render(<Slider defaultValue={[25, 75]} />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(<Slider />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(<Slider />)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('renders track element', () => {
      const { container } = render(<Slider />)
      const track = container.querySelector('[data-orientation]')
      expect(track).toBeInTheDocument()
    })

    it('renders thumb element', () => {
      const { container } = render(<Slider defaultValue={[50]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toBeInTheDocument()
    })
  })

  describe('Value', () => {
    it('applies default value correctly', () => {
      const { container } = render(<Slider defaultValue={[50]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('aria-valuenow', '50')
    })

    it('handles multiple values for range', () => {
      const { container } = render(<Slider defaultValue={[25, 75]} />)
      const thumbs = container.querySelectorAll('[role="slider"]')
      expect(thumbs).toHaveLength(2)
    })

    it('handles undefined value', () => {
      const { container } = render(<Slider />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Slider className="custom-slider" />)
      expect(container.firstChild).toHaveClass('custom-slider')
    })

    it('applies min prop', () => {
      const { container } = render(<Slider min={0} defaultValue={[50]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('aria-valuemin', '0')
    })

    it('applies max prop', () => {
      const { container } = render(<Slider max={200} defaultValue={[50]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('aria-valuemax', '200')
    })

    it('applies step prop', () => {
      const { container } = render(<Slider step={10} defaultValue={[50]} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Slider data-testid="my-slider" aria-label="Volume" />
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-slider')
    })
  })

  describe('Interactions', () => {
    it('calls onValueChange when value changes', () => {
      const handleValueChange = vi.fn()
      const { container } = render(
        <Slider onValueChange={handleValueChange} defaultValue={[50]} />
      )
      const thumb = container.querySelector('[role="slider"]')
      if (thumb) {
        fireEvent.keyDown(thumb, { key: 'ArrowRight' })
      }
      expect(handleValueChange).toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      const { container } = render(<Slider disabled />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('data-disabled', '')
    })
  })

  describe('Accessibility', () => {
    it('has slider role', () => {
      const { container } = render(<Slider defaultValue={[50]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      const { container } = render(<Slider aria-label="Brightness" />)
      expect(container.firstChild).toHaveAttribute('aria-label', 'Brightness')
    })

    it('thumb has aria-valuenow', () => {
      const { container } = render(<Slider defaultValue={[50]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('aria-valuenow', '50')
    })

    it('thumb has aria-valuemin', () => {
      const { container } = render(<Slider min={0} defaultValue={[50]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('aria-valuemin', '0')
    })

    it('thumb has aria-valuemax', () => {
      const { container } = render(<Slider max={100} defaultValue={[50]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('aria-valuemax', '100')
    })
  })

  describe('Orientation', () => {
    it('applies horizontal orientation by default', () => {
      const { container } = render(<Slider />)
      const track = container.querySelector('[data-orientation]')
      expect(track).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('applies vertical orientation', () => {
      const { container } = render(<Slider orientation="vertical" />)
      const track = container.querySelector('[data-orientation]')
      expect(track).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty slider', () => {
      const { container } = render(<Slider />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles value at min', () => {
      const { container } = render(<Slider min={0} defaultValue={[0]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('aria-valuenow', '0')
    })

    it('handles value at max', () => {
      const { container } = render(<Slider max={100} defaultValue={[100]} />)
      const thumb = container.querySelector('[role="slider"]')
      expect(thumb).toHaveAttribute('aria-valuenow', '100')
    })
  })
})