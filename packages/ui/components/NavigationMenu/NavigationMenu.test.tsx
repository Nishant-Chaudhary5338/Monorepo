import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './NavigationMenu'

describe('NavigationMenu', () => {
  describe('Snapshot Tests', () => {
    it('matches snapshot for default navigation menu', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Rendering', () => {
    it('renders successfully', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders trigger text', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <NavigationMenu className="custom-nav">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(container.firstChild).toHaveClass('custom-nav')
    })

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <NavigationMenu data-testid="my-nav">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(container.firstChild).toHaveAttribute('data-testid', 'my-nav')
    })
  })

  describe('Links', () => {
    it('renders navigation links', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
                <NavigationMenuLink href="/tutorial">Tutorial</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(screen.getByText('Documentation')).toBeInTheDocument()
      expect(screen.getByText('Tutorial')).toBeInTheDocument()
    })

    it('renders link with href', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      const link = screen.getByText('Documentation')
      expect(link).toHaveAttribute('href', '/docs')
    })
  })

  describe('Multiple Items', () => {
    it('renders multiple menu items', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/button">Button</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Components')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has navigation role', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(container.firstChild).toHaveAttribute('role', 'navigation')
    })

    it('supports aria-label', () => {
      const { container } = render(
        <NavigationMenu aria-label="Main navigation">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
      expect(container.firstChild).toHaveAttribute('aria-label', 'Main navigation')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty navigation menu', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList></NavigationMenuList>
        </NavigationMenu>
      )
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles many items', () => {
      const items = Array.from({ length: 10 }, (_, i) => (
        <NavigationMenuItem key={i}>
          <NavigationMenuTrigger>Item {i}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href={`/item${i}`}>Link {i}</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ))
      render(
        <NavigationMenu>
          <NavigationMenuList>{items}</NavigationMenuList>
        </NavigationMenu>
      )
      expect(screen.getByText('Item 0')).toBeInTheDocument()
      expect(screen.getByText('Item 9')).toBeInTheDocument()
    })
  })
})