import type { Meta, StoryObj } from "@storybook/react"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"
import { Button } from "../Button/Button"
import { Input } from "../Input/Input"
import { Label } from "../Label/Label"

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open Popover</Button></PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid items-center grid-cols-3 gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid items-center grid-cols-3 gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button>Create</Button></PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">New Layer</h4>
            <p className="text-sm text-muted-foreground">Add a new layer to the canvas.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="layer-name">Name</Label>
            <Input id="layer-name" placeholder="Layer name" />
          </div>
          <Button size="sm">Create Layer</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Top</Button></PopoverTrigger>
        <PopoverContent side="top" className="w-48"><p className="text-sm">Popover on top</p></PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Right</Button></PopoverTrigger>
        <PopoverContent side="right" className="w-48"><p className="text-sm">Popover on right</p></PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Bottom</Button></PopoverTrigger>
        <PopoverContent side="bottom" className="w-48"><p className="text-sm">Popover on bottom</p></PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Left</Button></PopoverTrigger>
        <PopoverContent side="left" className="w-48"><p className="text-sm">Popover on left</p></PopoverContent>
      </Popover>
    </div>
  ),
}

export const UserInfo: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="link">@shadcn</Button></PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold">SC</div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">shadcn</h4>
            <p className="text-sm text-muted-foreground">Building @shadcn/ui and cal.com</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">10k followers</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const ColorPicker: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-10 p-0">
          <div className="h-4 w-4 rounded-full bg-blue-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="grid grid-cols-5 gap-2">
          {['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500', 'bg-black'].map((c) => (
            <button key={c} className={`h-6 w-6 rounded-full ${c} hover:ring-2 ring-offset-2 ring-ring`} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  ),
}
