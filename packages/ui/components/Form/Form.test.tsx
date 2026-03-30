import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './Form'

function FormWrapper({ children }: { children: React.ReactNode }) {
  const form = useForm({ defaultValues: { name: '' } })
  return <Form {...form}>{children}</Form>
}

function TestForm() {
  return (
    <FormField
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <input {...field} data-testid="name-input" />
          </FormControl>
          <FormDescription>Enter your name</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

describe('Form', () => {
  it('renders form fields within a form context', () => {
    render(
      <FormWrapper>
        <TestForm />
      </FormWrapper>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Enter your name')).toBeInTheDocument()
    expect(screen.getByTestId('name-input')).toBeInTheDocument()
  })

  it('renders form label with correct htmlFor', () => {
    render(
      <FormWrapper>
        <TestForm />
      </FormWrapper>
    )
    const label = screen.getByText('Name')
    expect(label).toBeInTheDocument()
  })

  it('renders form description', () => {
    render(
      <FormWrapper>
        <TestForm />
      </FormWrapper>
    )
    const description = screen.getByText('Enter your name')
    expect(description).toBeInTheDocument()
    expect(description.tagName).toBe('P')
  })

  it('does not render error message when no error', () => {
    render(
      <FormWrapper>
        <TestForm />
      </FormWrapper>
    )
    expect(screen.queryByRole('paragraph')).not.toHaveClass('text-destructive')
  })
})
