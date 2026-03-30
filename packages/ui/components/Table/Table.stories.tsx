import type { Meta, StoryObj } from '@storybook/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from './Table'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of invoices.</TableCaption>
      <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
      <TableBody><TableRow><TableCell>INV001</TableCell><TableCell>$250.00</TableCell></TableRow></TableBody>
    </Table>
  ),
}
