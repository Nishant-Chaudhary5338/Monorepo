# Table Component

## Description

Semantic HTML table with styled sub-components for each table section. Wrapped in a responsive horizontal scroll container. Use this for simple, static data display. For sortable, filterable, or paginated tables use the `DataTable` component instead.

## When to Use

- Displaying a small, static dataset that doesn't need sorting or filtering
- Invoices, receipts, comparison tables
- When you need full control over table markup and styling

## Props

All sub-components accept standard HTML element attributes. Key className targets:

| Component | Renders | Key Classes |
|-----------|---------|-------------|
| `Table` | `<table>` | width, text size |
| `TableHeader` | `<thead>` | sticky header |
| `TableBody` | `<tbody>` | row content |
| `TableFooter` | `<tfoot>` | totals row |
| `TableRow` | `<tr>` | hover, selected states |
| `TableHead` | `<th>` | column header cell |
| `TableCell` | `<td>` | data cell |
| `TableCaption` | `<caption>` | accessible table summary |

## Usage

```tsx
import {
  Table, TableHeader, TableBody, TableFooter,
  TableHead, TableRow, TableCell, TableCaption
} from '@repo/ui'

const invoices = [
  { id: 'INV-001', customer: 'Acme Corp', status: 'Paid', amount: '$250.00' },
  { id: 'INV-002', customer: 'Globex', status: 'Pending', amount: '$150.00' },
]

<Table>
  <TableCaption>Recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((inv) => (
      <TableRow key={inv.id}>
        <TableCell className="font-medium">{inv.id}</TableCell>
        <TableCell>{inv.customer}</TableCell>
        <TableCell>{inv.status}</TableCell>
        <TableCell className="text-right">{inv.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right">$400.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

```tsx
// With badge status column
import { Badge } from '@repo/ui'

<TableCell>
  <Badge variant={status === 'Paid' ? 'default' : 'secondary'}>{status}</Badge>
</TableCell>
```

## Exports
- `Table`, `TableHeader`, `TableBody`, `TableFooter`
- `TableHead`, `TableRow`, `TableCell`, `TableCaption`
