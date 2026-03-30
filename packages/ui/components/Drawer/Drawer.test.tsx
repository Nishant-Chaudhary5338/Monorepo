import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './Drawer'

describe('Drawer', () => {
  it('renders trigger', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )
    expect(screen.getByText('Open Drawer')).toBeInTheDocument()
  })

  it('renders open drawer with content', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )
    expect(screen.getByText('Drawer Title')).toBeInTheDocument()
  })
})
