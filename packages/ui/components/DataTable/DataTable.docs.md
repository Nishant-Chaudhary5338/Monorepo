# DataTable Component

## Description

A feature-rich data table built on TanStack Table v8. Every feature is opt-in via the `features` prop — use only what you need. Supports client-side and server-side data modes. Includes RBAC for column-level access control and inline cell editing.

## When to Use

- Displaying large datasets that need sorting, filtering, or pagination
- Admin panels with row selection and bulk actions
- Data grids needing inline editing or column resizing

## Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData>[]` | required | TanStack Table column definitions |
| `data` | `TData[]` | required | Data array to render |
| `features` | `DataTableFeatures` | `{}` | Opt-in feature flags |
| `rbac` | `{ userRole: string }` | — | Role-based column visibility/editing |
| `isLoading` | `boolean` | `false` | Show loading skeleton instead of rows |
| `emptyMessage` | `string \| ReactNode` | `"No results."` | Empty state content |
| `bulkActions` | `BulkAction[]` | — | Action buttons shown on row selection |
| `onCellEdit` | `(params) => void \| Promise<void>` | — | Called after inline cell save |
| `serverSide` | `ServerSideOptions` | — | Enable manual pagination/sorting/filtering |
| `paginationOptions` | `{ pageSize, pageSizeOptions }` | — | Page size config |
| `renderToolbar` | `(table) => ReactNode` | — | Custom toolbar content |
| `getRowId` | `(row: TData) => string` | — | Custom row ID getter |

## DataTableFeatures Flags

| Flag | Description |
|------|-------------|
| `sorting` | Click-to-sort on column headers |
| `filtering` | Per-column filter inputs |
| `globalFilter` | Global search box across all columns |
| `pagination` | Paginated rows with page size control |
| `rowSelection` | Row checkboxes (`true`, `"single"`, `"multiple"`) |
| `bulkActions` | Toolbar with actions on selected rows |
| `columnVisibility` | Show/hide column dropdown |
| `columnPinning` | Sticky left/right column pinning |
| `draggableColumns` | Drag-to-reorder columns |
| `columnResizing` | Drag-to-resize columns |
| `rowExpansion` | Expandable sub-rows |
| `rowNumbers` | Row number column |
| `zoom` | Zoom in/out controls |
| `striped` | Alternating row background |
| `hoverable` | Row highlight on hover |
| `density` | Compact/default/comfortable density switcher |
| `stickyHeader` | Fixed header on scroll |
| `editableCells` | Inline double-click cell editing |
| `exportCsv` | Export to CSV button |
| `exportJson` | Export to JSON button |

## Usage

```tsx
import { DataTable } from '@repo/ui'
import type { ColumnDef } from '@tanstack/react-table'

type User = { id: string; name: string; email: string; role: string }

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
]

function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      features={{
        sorting: true,
        globalFilter: true,
        pagination: true,
        columnVisibility: true,
        exportCsv: true,
        density: true,
        rowSelection: true,
        bulkActions: true,
      }}
      paginationOptions={{ pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
      bulkActions={[
        {
          id: 'delete',
          label: 'Delete',
          variant: 'destructive',
          onClick: (rows) => deleteUsers(rows.map(r => r.id)),
        },
      ]}
      onRowSelectionChange={(rows) => console.log('selected:', rows)}
    />
  )
}
```

```tsx
// Column-level RBAC and inline editing
const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'salary',
    header: 'Salary',
    meta: {
      roles: ['admin', 'hr'],       // only admin and hr can see this column
      editRoles: ['admin'],          // only admin can edit
      editable: true,
      editType: 'number',
      align: 'right',
      validate: (v) => v < 0 ? 'Must be positive' : null,
    },
  },
]

<DataTable
  columns={columns}
  data={employees}
  rbac={{ userRole: currentUser.role }}
  features={{ editableCells: true, columnResizing: true }}
  onCellEdit={({ rowId, columnId, newValue }) => updateEmployee(rowId, columnId, newValue)}
/>
```

```tsx
// Server-side mode
<DataTable
  columns={columns}
  data={data}
  features={{ sorting: true, pagination: true, globalFilter: true }}
  serverSide={{
    totalCount: 5000,
    onFetchData: ({ sorting, pagination, globalFilter }) => {
      fetchUsers({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sort: sorting[0],
        search: globalFilter,
      })
    },
  }}
/>
```

## Exports
- `DataTable`
- Type exports: `DataTableProps`, `DataTableFeatures`, `DataTableRBAC`, `BulkAction`, `ServerSideOptions`
