import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select'

describe('Select', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default select', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger button', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders placeholder text', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
        </Select>
      )
      expect(screen.getByText('Choose an option')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className to trigger', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      )
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('passes through additional HTML attributes', () => {
      render(
        <Select>
          <SelectTrigger data-testid="my-select">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      )
      expect(screen.getByTestId('my-select')).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('disables trigger when disabled prop is set', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      )
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('disabled')
    })
  })

  describe('Accessibility', () => {
    it('trigger has combobox role', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(
        <Select>
          <SelectTrigger aria-label="Select option">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      )
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-label', 'Select option')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty select', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles select with many options', () => {
      const options = Array.from({ length: 20 }, (_, i) => (
        <SelectItem key={i} value={`option${i}`}>
          Option {i}
        </SelectItem>
      ))
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>{options}</SelectContent>
        </Select>
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })
})