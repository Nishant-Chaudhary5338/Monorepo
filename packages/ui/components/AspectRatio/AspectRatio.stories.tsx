import type { Meta, StoryObj } from '@storybook/react'
import { AspectRatio } from './AspectRatio'

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9}>
        <img src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=450&h=253&fit=crop" alt="Photo" className="rounded-md object-cover w-full h-full" />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={1 / 1}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">1:1 Ratio</span>
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Portrait: Story = {
  render: () => (
    <div className="w-[250px]">
      <AspectRatio ratio={3 / 4}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">3:4 Ratio</span>
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Video: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </AspectRatio>
    </div>
  ),
}

export const AllRatios: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <div className="w-[150px]">
        <p className="text-xs text-muted-foreground mb-1 text-center">1:1</p>
        <AspectRatio ratio={1 / 1}><div className="h-full w-full rounded-md bg-muted" /></AspectRatio>
      </div>
      <div className="w-[200px]">
        <p className="text-xs text-muted-foreground mb-1 text-center">4:3</p>
        <AspectRatio ratio={4 / 3}><div className="h-full w-full rounded-md bg-muted" /></AspectRatio>
      </div>
      <div className="w-[250px]">
        <p className="text-xs text-muted-foreground mb-1 text-center">16:9</p>
        <AspectRatio ratio={16 / 9}><div className="h-full w-full rounded-md bg-muted" /></AspectRatio>
      </div>
      <div className="w-[100px]">
        <p className="text-xs text-muted-foreground mb-1 text-center">3:4</p>
        <AspectRatio ratio={3 / 4}><div className="h-full w-full rounded-md bg-muted" /></AspectRatio>
      </div>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="w-[300px] rounded-lg border overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      </AspectRatio>
      <div className="p-4">
        <h3 className="font-semibold">Card Title</h3>
        <p className="text-sm text-muted-foreground mt-1">A card with an aspect ratio image.</p>
      </div>
    </div>
  ),
}
