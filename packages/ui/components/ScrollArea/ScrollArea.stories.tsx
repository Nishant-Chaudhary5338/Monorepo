import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea, ScrollBar } from './ScrollArea'
import { Separator } from '../Separator/Separator'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ScrollArea>

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag} className="text-sm">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <figure key={i} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <div className="h-[150px] w-[150px] bg-muted flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Image {i + 1}</span>
              </div>
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo {i + 1}
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

export const WithLongList: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[350px] rounded-md border p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Recent Commits</h4>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i}>
          <div className="text-sm py-2">
            <div className="font-medium">Fix bug #{i + 100}</div>
            <div className="text-muted-foreground text-xs">
              Committed {(30 - i)} hours ago
            </div>
          </div>
          {i < 29 && <Separator />}
        </div>
      ))}
    </ScrollArea>
  ),
}

export const WithContent: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border">
      <div className="p-4">
        <h4 className="text-sm font-medium mb-2">Terms of Service</h4>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>
    </ScrollArea>
  ),
}

export const ChatMessages: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[350px] rounded-md border">
      <div className="p-4 space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${i % 2 === 0 ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
              {i % 2 === 0 ? 'Hey, how are you doing?' : 'I\'m doing great, thanks!'}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
