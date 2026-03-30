import type { Meta, StoryObj } from "@storybook/react"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./Table"
import { Badge } from "../Badge/Badge"

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithStatus: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">John Doe</TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>
            <Badge variant="secondary">Away</Badge>
          </TableCell>
          <TableCell>Developer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Wilson</TableCell>
          <TableCell>
            <Badge variant="destructive">Offline</Badge>
          </TableCell>
          <TableCell>Designer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Laptop</TableCell>
          <TableCell>$999.00</TableCell>
          <TableCell>
            <button className="mr-2 text-sm text-blue-600 hover:underline">Edit</button>
            <button className="text-sm text-red-600 hover:underline">Delete</button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Phone</TableCell>
          <TableCell>$699.00</TableCell>
          <TableCell>
            <button className="mr-2 text-sm text-blue-600 hover:underline">Edit</button>
            <button className="text-sm text-red-600 hover:underline">Delete</button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center">
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Pro Plan</TableCell>
          <TableCell className="text-right">$29.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Extra Storage</TableCell>
          <TableCell className="text-right">$10.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Priority Support</TableCell>
          <TableCell className="text-right">$15.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-semibold">Total</TableCell>
          <TableCell className="text-right font-semibold">$54.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const Striped: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="[&_td]:bg-muted/50">
          <TableCell className="font-medium">Alice Johnson</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Williams</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Developer</TableCell>
        </TableRow>
        <TableRow className="[&_td]:bg-muted/50">
          <TableCell className="font-medium">Charlie Brown</TableCell>
          <TableCell>charlie@example.com</TableCell>
          <TableCell>Designer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Diana Prince</TableCell>
          <TableCell>diana@example.com</TableCell>
          <TableCell>Product Manager</TableCell>
        </TableRow>
        <TableRow className="[&_td]:bg-muted/50">
          <TableCell className="font-medium">Eve Davis</TableCell>
          <TableCell>eve@example.com</TableCell>
          <TableCell>QA Engineer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const Compact: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="h-8 px-3 text-xs">ID</TableHead>
          <TableHead className="h-8 px-3 text-xs">Name</TableHead>
          <TableHead className="h-8 px-3 text-xs">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="py-2 px-3 text-sm">001</TableCell>
          <TableCell className="py-2 px-3 text-sm">Project Alpha</TableCell>
          <TableCell className="py-2 px-3 text-sm"><Badge className="text-xs" variant="outline">Active</Badge></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-2 px-3 text-sm">002</TableCell>
          <TableCell className="py-2 px-3 text-sm">Project Beta</TableCell>
          <TableCell className="py-2 px-3 text-sm"><Badge className="text-xs" variant="outline">Pending</Badge></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-2 px-3 text-sm">003</TableCell>
          <TableCell className="py-2 px-3 text-sm">Project Gamma</TableCell>
          <TableCell className="py-2 px-3 text-sm"><Badge className="text-xs" variant="outline">Completed</Badge></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const SelectableRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"><input type="checkbox" className="rounded" /></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected" className="bg-muted/50">
          <TableCell><input type="checkbox" className="rounded" defaultChecked /></TableCell>
          <TableCell className="font-medium">Selected User</TableCell>
          <TableCell>selected@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><input type="checkbox" className="rounded" /></TableCell>
          <TableCell className="font-medium">Regular User</TableCell>
          <TableCell>user@example.com</TableCell>
          <TableCell>Member</TableCell>
        </TableRow>
        <TableRow>
          <TableCell><input type="checkbox" className="rounded" /></TableCell>
          <TableCell className="font-medium">Another User</TableCell>
          <TableCell>another@example.com</TableCell>
          <TableCell>Member</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const UserTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell><Badge>Active</Badge></TableCell>
          <TableCell>Admin</TableCell>
          <TableCell className="text-right"><button className="text-sm text-blue-600 hover:underline">Edit</button></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell><Badge variant="secondary">Inactive</Badge></TableCell>
          <TableCell>Member</TableCell>
          <TableCell className="text-right"><button className="text-sm text-blue-600 hover:underline">Edit</button></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
