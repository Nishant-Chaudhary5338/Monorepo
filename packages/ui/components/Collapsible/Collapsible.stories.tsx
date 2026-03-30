import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible'
import { Button } from '../Button/Button'
import { ChevronsUpDown } from 'lucide-react'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const WithTrigger: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>Show details</span>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">
          <p className="font-medium">Additional Information</p>
          <p className="text-muted-foreground mt-1">This content was hidden and is now visible.</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const FAQ: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      {[
        { q: 'What is shadcn/ui?', a: 'Beautifully designed components built with Radix UI and Tailwind CSS.' },
        { q: 'Is it free?', a: 'Yes, shadcn/ui is completely free and open source.' },
        { q: 'Can I use it in my project?', a: 'Yes! You can use it in any project, personal or commercial.' },
      ].map((faq, i) => (
        <Collapsible key={i} className="border rounded-lg">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium text-sm hover:bg-accent rounded-lg">
            {faq.q}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  ),
}

export const Sidebar: Story = {
  render: () => (
    <div className="w-[250px] space-y-2 border rounded-lg p-4">
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:bg-accent rounded px-2">
          Getting Started
          <ChevronsUpDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 space-y-1">
          <div className="py-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">Installation</div>
          <div className="py-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">Quick Start</div>
          <div className="py-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">CLI</div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:bg-accent rounded px-2">
          Components
          <ChevronsUpDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 space-y-1">
          <div className="py-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">Button</div>
          <div className="py-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">Input</div>
          <div className="py-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">Card</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}
