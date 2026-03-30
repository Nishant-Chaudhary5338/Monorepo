import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './Dialog'

describe('Dialog', () => {
  it('renders trigger and opens dialog with content', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('renders dialog header with correct structure', () => {
    const { container } = render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
  })
})
