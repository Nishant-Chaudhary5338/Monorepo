import type { Meta, StoryObj } from "@storybook/react"
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter,
  SheetTitle, SheetDescription, SheetClose,
} from "./Sheet"
import { Button } from "../Button/Button"
import { Input } from "../Input/Input"
import { Label } from "../Label/Label"

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open Sheet</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="username" className="text-right">Username</Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild><Button type="submit">Save changes</Button></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open Left</Button></SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Navigate to different sections.</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-2">
          <button className="w-full p-2 text-left rounded hover:bg-accent">Home</button>
          <button className="w-full p-2 text-left rounded hover:bg-accent">Dashboard</button>
          <button className="w-full p-2 text-left rounded hover:bg-accent">Settings</button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const RightSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open Right</Button></SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Your recent notifications.</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-3">
          {['New message received', 'Profile updated', 'Payment confirmed'].map((n, i) => (
            <div key={i} className="p-3 border rounded-lg text-sm">{n}</div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const TopSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open Top</Button></SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Update Available</SheetTitle>
          <SheetDescription>A new version is available. Please refresh to get the latest features.</SheetDescription>
        </SheetHeader>
        <SheetFooter><Button>Refresh</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const BottomSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open Bottom</Button></SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Cookie Settings</SheetTitle>
          <SheetDescription>Manage your cookie preferences.</SheetDescription>
        </SheetHeader>
        <div className="py-4 flex gap-4">
          <Button variant="outline">Reject All</Button>
          <Button>Accept All</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button>Invite People</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite a team member</SheetTitle>
          <SheetDescription>Send an invite to join your team.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter email address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="Member" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
          <Button>Send Invite</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
