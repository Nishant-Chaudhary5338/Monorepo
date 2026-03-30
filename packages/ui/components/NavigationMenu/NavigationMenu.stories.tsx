import type { Meta, StoryObj } from '@storybook/react'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from './NavigationMenu'
import { cn } from '../../lib/utils'

const meta: Meta<typeof NavigationMenu> = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NavigationMenu>

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/">
                    <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                    <p className="text-sm leading-tight text-muted-foreground">Beautifully designed components built with Radix UI and Tailwind CSS.</p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li><NavigationMenuLink asChild><a href="/docs" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"><div className="text-sm font-medium leading-none">Introduction</div><p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Re-usable components built using Radix UI and Tailwind CSS.</p></a></NavigationMenuLink></li>
              <li><NavigationMenuLink asChild><a href="/docs/installation" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"><div className="text-sm font-medium leading-none">Installation</div><p className="line-clamp-2 text-sm leading-snug text-muted-foreground">How to install dependencies and structure your app.</p></a></NavigationMenuLink></li>
              <li><NavigationMenuLink asChild><a href="/docs/primitives/typography" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"><div className="text-sm font-medium leading-none">Typography</div><p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Styles for headings, paragraphs, lists...etc</p></a></NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {['Alert Dialog', 'Hover Card', 'Progress', 'Tabs', 'Toggle'].map((item) => (
                <li key={item}><NavigationMenuLink asChild><a href="/docs" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"><div className="text-sm font-medium leading-none">{item}</div><p className="line-clamp-2 text-sm leading-snug text-muted-foreground">A {item.toLowerCase()} component.</p></a></NavigationMenuLink></li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const SimpleLinks: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/about">About</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/contact">Contact</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const WithDropdowns: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-4">
              <li><NavigationMenuLink asChild><a href="#" className="block select-none rounded-md p-3 text-sm font-medium hover:bg-accent">Software</a></NavigationMenuLink></li>
              <li><NavigationMenuLink asChild><a href="#" className="block select-none rounded-md p-3 text-sm font-medium hover:bg-accent">Hardware</a></NavigationMenuLink></li>
              <li><NavigationMenuLink asChild><a href="#" className="block select-none rounded-md p-3 text-sm font-medium hover:bg-accent">Services</a></NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-4">
              <li><NavigationMenuLink asChild><a href="#" className="block select-none rounded-md p-3 text-sm font-medium hover:bg-accent">Enterprise</a></NavigationMenuLink></li>
              <li><NavigationMenuLink asChild><a href="#" className="block select-none rounded-md p-3 text-sm font-medium hover:bg-accent">Startups</a></NavigationMenuLink></li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/pricing">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
