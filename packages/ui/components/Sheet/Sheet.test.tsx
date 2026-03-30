import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './Sheet'

describe('Sheet', () => {
  it('renders trigger', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByText('Open Sheet')).toBeInTheDocument()
  })

  it('renders open sheet with content', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByText('Sheet Title')).toBeInTheDocument()
  })
})
