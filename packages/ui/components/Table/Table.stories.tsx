import type { Meta, StoryObj } from "@storybook/react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./Table"
import { Badge } from "../Badge/Badge"
import { Button } from "../Button/Button"

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
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
              Away
            </span>
          </TableCell>
          <TableCell>Developer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Wilson</TableCell>
          <TableCell>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
              Offline
            </span>
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
            <button className="mr-2 text-sm text-blue-600 hover:underline">
              Edit
            </button>
            <button className="text-sm text-red-600 hover:underline">
              Delete
            </button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Phone</TableCell>
          <TableCell>$699.00</TableCell>
          <TableCell>
            <button className="mr-2 text-sm text-blue-600 hover:underline">
              Edit
            </button>
            <button className="text-sm text-red-600 hover:underline">
              Delete
            </button>
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

export const WithBadges: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">John Doe</TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell>Admin</TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>
            <Badge variant="secondary">Pending</Badge>
          </TableCell>
          <TableCell>Developer</TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Wilson</TableCell>
          <TableCell>
            <Badge variant="destructive">Suspended</Badge>
          </TableCell>
          <TableCell>Designer</TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const StripedRows: Story = {
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
        <TableRow>
          <TableCell className="font-medium">John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Developer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Wilson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Designer</TableCell>
        </TableRow>
        <TableRow className="bg-muted/50">
          <TableCell className="font-medium">Alice Brown</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>Manager</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const CompactTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="h-8 px-2 text-xs">ID</TableHead>
          <TableHead className="h-8 px-2 text-xs">Name</TableHead>
          <TableHead className="h-8 px-2 text-xs">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="p-2 text-sm">001</TableCell>
          <TableCell className="p-2 text-sm">Item One</TableCell>
          <TableCell className="p-2 text-sm">Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="p-2 text-sm">002</TableCell>
          <TableCell className="p-2 text-sm">Item Two</TableCell>
          <TableCell className="p-2 text-sm">Inactive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="p-2 text-sm">003</TableCell>
          <TableCell className="p-2 text-sm">Item Three</TableCell>
          <TableCell className="p-2 text-sm">Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const UsersTable: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of registered users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                JD
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">@johndoe</p>
              </div>
            </div>
          </TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>
            <Badge variant="default">Active</Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                JS
              </div>
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-muted-foreground">@janesmith</p>
              </div>
            </div>
          </TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Developer</TableCell>
          <TableCell>
            <Badge variant="secondary">Pending</Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const ProductsTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Wireless Headphones</TableCell>
          <TableCell>Electronics</TableCell>
          <TableCell>$99.99</TableCell>
          <TableCell>
            <Badge variant="default">In Stock</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Laptop Stand</TableCell>
          <TableCell>Accessories</TableCell>
          <TableCell>$49.99</TableCell>
          <TableCell>
            <Badge variant="secondary">Low Stock</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">USB-C Cable</TableCell>
          <TableCell>Accessories</TableCell>
          <TableCell>$19.99</TableCell>
          <TableCell>
            <Badge variant="destructive">Out of Stock</Badge>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
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
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Widget A</TableCell>
          <TableCell className="text-right">2</TableCell>
          <TableCell className="text-right">$10.00</TableCell>
          <TableCell className="text-right">$20.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget B</TableCell>
          <TableCell className="text-right">5</TableCell>
          <TableCell className="text-right">$15.00</TableCell>
          <TableCell className="text-right">$75.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget C</TableCell>
          <TableCell className="text-right">1</TableCell>
          <TableCell className="text-right">$25.00</TableCell>
          <TableCell className="text-right">$25.00</TableCell>
        </TableRow>
      </TableBody>
      <tfoot>
        <TableRow>
          <TableCell colSpan={3} className="font-bold text-right">
            Total
          </TableCell>
          <TableCell className="font-bold text-right">$120.00</TableCell>
        </TableRow>
      </tfoot>
    </Table>
  ),
}