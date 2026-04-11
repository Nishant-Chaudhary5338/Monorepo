import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { z } from 'zod'
import { AutoForm } from './AutoForm'

// ─── Shared schemas ───────────────────────────────────────────────────────────

const simpleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

const fullSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  age: z.number().min(18, 'Must be 18 or older'),
  bio: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer']),
  active: z.boolean(),
})

// ─── Snapshot ─────────────────────────────────────────────────────────────────

describe('AutoForm', () => {
  describe('Snapshot', () => {
    it('matches snapshot for simple schema', () => {
      const { container } = render(
        <AutoForm schema={simpleSchema} onSubmit={vi.fn()} />
      )
      expect(container).toMatchSnapshot()
    })
  })

  // ─── Field Generation ────────────────────────────────────────────────────────

  describe('Field Generation', () => {
    it('generates text fields for string properties', () => {
      render(<AutoForm schema={simpleSchema} onSubmit={vi.fn()} />)
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    })

    it('generates email field for email-named properties', () => {
      render(<AutoForm schema={simpleSchema} onSubmit={vi.fn()} />)
      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('generates a number field for ZodNumber properties', () => {
      const schema = z.object({ age: z.number() })
      render(<AutoForm schema={schema} onSubmit={vi.fn()} />)
      const ageInput = screen.getByLabelText(/age/i)
      expect(ageInput).toHaveAttribute('type', 'number')
    })

    it('generates a select for ZodEnum properties', () => {
      const schema = z.object({ role: z.enum(['admin', 'editor', 'viewer']) })
      render(<AutoForm schema={schema} onSubmit={vi.fn()} />)
      // Select should be rendered (combobox or select element)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('generates a switch/checkbox for ZodBoolean properties', () => {
      const schema = z.object({ active: z.boolean() })
      render(<AutoForm schema={schema} onSubmit={vi.fn()} />)
      // Switch renders as a button with role="switch"
      const switchEl = screen.queryByRole('switch') || screen.queryByRole('checkbox')
      expect(switchEl).toBeInTheDocument()
    })

    it('generates a textarea for fields named bio or description', () => {
      const schema = z.object({ bio: z.string().optional() })
      render(<AutoForm schema={schema} onSubmit={vi.fn()} />)
      expect(screen.getByRole('textbox', { name: /bio/i })).toBeInTheDocument()
    })

    it('renders a submit button by default', () => {
      render(<AutoForm schema={simpleSchema} onSubmit={vi.fn()} />)
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })

    it('renders custom submit button text', () => {
      render(<AutoForm schema={simpleSchema} onSubmit={vi.fn()} submitText="Save Changes" />)
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    })

    it('hides the submit button when showSubmit is false', () => {
      render(<AutoForm schema={simpleSchema} onSubmit={vi.fn()} showSubmit={false} />)
      expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument()
    })
  })

  // ─── Field Config ─────────────────────────────────────────────────────────────

  describe('Field Configuration', () => {
    it('applies custom label from fieldConfig', () => {
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          fieldConfig={{ name: { label: 'Full Name' } }}
        />
      )
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })

    it('applies placeholder from fieldConfig', () => {
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          fieldConfig={{ name: { placeholder: 'Enter your full name' } }}
        />
      )
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    })

    it('renders description text from fieldConfig', () => {
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          fieldConfig={{ name: { description: 'Your display name visible to the team.' } }}
        />
      )
      expect(screen.getByText('Your display name visible to the team.')).toBeInTheDocument()
    })

    it('disables a field when disabled is set in fieldConfig', () => {
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          fieldConfig={{ name: { disabled: true } }}
        />
      )
      expect(screen.getByLabelText(/name/i)).toBeDisabled()
    })

    it('overrides field type via fieldConfig.fieldType', () => {
      const schema = z.object({ role: z.enum(['admin', 'editor']) })
      render(
        <AutoForm
          schema={schema}
          onSubmit={vi.fn()}
          fieldConfig={{ role: { fieldType: 'radio' } }}
        />
      )
      const radios = screen.getAllByRole('radio')
      expect(radios.length).toBe(2)
    })
  })

  // ─── Include / Exclude ────────────────────────────────────────────────────────

  describe('Include / Exclude', () => {
    it('only renders included fields when include prop is provided', () => {
      render(
        <AutoForm schema={fullSchema} onSubmit={vi.fn()} include={['firstName', 'lastName']} />
      )
      expect(screen.getByLabelText(/first.*name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last.*name/i)).toBeInTheDocument()
      expect(screen.queryByLabelText(/age/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/role/i)).not.toBeInTheDocument()
    })

    it('hides excluded fields when exclude prop is provided', () => {
      render(
        <AutoForm schema={simpleSchema} onSubmit={vi.fn()} exclude={['email']} />
      )
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
    })
  })

  // ─── Field Order ──────────────────────────────────────────────────────────────

  describe('Field Order', () => {
    it('renders fields in the order specified by the order prop', () => {
      render(
        <AutoForm schema={simpleSchema} onSubmit={vi.fn()} order={['email', 'name']} />
      )
      const inputs = screen.getAllByRole('textbox')
      // First input should be email (reversed order)
      expect(inputs[0]).toHaveAttribute('type', 'email')
    })
  })

  // ─── Default Values ───────────────────────────────────────────────────────────

  describe('Default Values', () => {
    it('pre-populates text fields with defaultValues', () => {
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          defaultValues={{ name: 'Alice Johnson', email: 'alice@corp.com' }}
        />
      )
      expect(screen.getByDisplayValue('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByDisplayValue('alice@corp.com')).toBeInTheDocument()
    })
  })

  // ─── Validation ───────────────────────────────────────────────────────────────

  describe('Validation', () => {
    it('shows validation errors on submit when fields are invalid', async () => {
      render(<AutoForm schema={simpleSchema} onSubmit={vi.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      await waitFor(() => {
        expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument()
      })
    })

    it('does not call onSubmit when form is invalid', async () => {
      const onSubmit = vi.fn()
      render(<AutoForm schema={simpleSchema} onSubmit={onSubmit} />)
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      await waitFor(() => screen.getByText(/at least 2 characters/i))
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('calls onSubmit with correct values when form is valid', async () => {
      const onSubmit = vi.fn()
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={onSubmit}
          defaultValues={{ name: 'Alice Johnson', email: 'alice@corp.com' }}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Alice Johnson', email: 'alice@corp.com' })
        )
      })
    })

    it('calls onValidationError with error map on invalid submit', async () => {
      const onValidationError = vi.fn()
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          onValidationError={onValidationError}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      await waitFor(() => expect(onValidationError).toHaveBeenCalled())
      const errors = onValidationError.mock.calls[0][0]
      expect(errors).toHaveProperty('name')
    })
  })

  // ─── Loading State ────────────────────────────────────────────────────────────

  describe('Loading State', () => {
    it('disables inputs when isLoading is true', () => {
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          isLoading
          defaultValues={{ name: 'Alice', email: 'alice@corp.com' }}
        />
      )
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach((input) => expect(input).toBeDisabled())
    })

    it('disables the submit button when isLoading is true', () => {
      render(<AutoForm schema={simpleSchema} onSubmit={vi.fn()} isLoading />)
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
    })
  })

  // ─── Custom Submit Render ─────────────────────────────────────────────────────

  describe('Custom Submit Render', () => {
    it('renders custom submit button via renderSubmit', () => {
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          renderSubmit={() => <button data-testid="custom-submit">Go!</button>}
        />
      )
      expect(screen.getByTestId('custom-submit')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument()
    })

    it('passes isLoading and isValid to renderSubmit', () => {
      const renderSubmit = vi.fn().mockReturnValue(<button>Custom</button>)
      render(
        <AutoForm
          schema={simpleSchema}
          onSubmit={vi.fn()}
          renderSubmit={renderSubmit}
          defaultValues={{ name: 'Alice', email: 'alice@corp.com' }}
        />
      )
      expect(renderSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ isLoading: expect.any(Boolean), isValid: expect.any(Boolean) })
      )
    })
  })

  // ─── Children ─────────────────────────────────────────────────────────────────

  describe('Children', () => {
    it('renders children after the fields', () => {
      render(
        <AutoForm schema={simpleSchema} onSubmit={vi.fn()}>
          <p data-testid="extra-content">Extra content here</p>
        </AutoForm>
      )
      expect(screen.getByTestId('extra-content')).toBeInTheDocument()
    })
  })

  // ─── Edge Cases ───────────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('renders without crashing with an empty schema', () => {
      const emptySchema = z.object({})
      expect(() =>
        render(<AutoForm schema={emptySchema} onSubmit={vi.fn()} />)
      ).not.toThrow()
    })

    it('handles optional fields without errors', () => {
      const schema = z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
      })
      expect(() =>
        render(<AutoForm schema={schema} onSubmit={vi.fn()} />)
      ).not.toThrow()
    })

    it('applies custom className to the form container', () => {
      const { container } = render(
        <AutoForm schema={simpleSchema} onSubmit={vi.fn()} className="my-form" />
      )
      expect(container.querySelector('.my-form')).toBeInTheDocument()
    })
  })
})
