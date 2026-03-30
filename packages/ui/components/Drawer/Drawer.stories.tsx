import type { Meta, StoryObj } from "@storybook/react"
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter,
  DrawerTitle, DrawerDescription, DrawerClose,
} from "./Drawer"
import { Button } from "../Button/Button"

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open Drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button>Edit Profile</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile here. Click save when you're done.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" defaultValue="Pedro Duarte" className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" type="email" defaultValue="pedro@example.com" className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save changes</Button>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const ConfirmDialog: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="destructive">Delete Item</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delete item</DrawerTitle>
          <DrawerDescription>Are you sure you want to delete this item? This action cannot be reversed.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="destructive">Delete</Button>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">View Details</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Order #12345</DrawerTitle>
          <DrawerDescription>Placed on January 15, 2024</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm"><span>Pro Plan (monthly)</span><span>$29.00</span></div>
          <div className="flex justify-between text-sm"><span>Extra Storage</span><span>$10.00</span></div>
          <div className="border-t pt-2 flex justify-between font-medium"><span>Total</span><span>$39.00</span></div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open Drawer</Button></DrawerTrigger>
      <DrawerContent className="h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>Custom Height Drawer</DrawerTitle>
          <DrawerDescription>This drawer has a custom height of 50vh.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <p className="text-sm text-muted-foreground">Content fills the remaining space.</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
}
