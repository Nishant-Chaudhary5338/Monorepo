import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./DataTable"
import { Badge } from "../Badge/Badge"

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
}

export default meta
type Story = StoryObj<typeof DataTable>

// ─── Shared data ─────────────────────────────────────────────────────────────

type Employee = {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "inactive" | "pending"
  salary: number
  startDate: string
  remote: boolean
  notes: string
}

const employees: Employee[] = [
  { id: "1", name: "Alice Johnson", email: "alice@corp.com", role: "Engineer", department: "Engineering", status: "active", salary: 120000, startDate: "2021-03-15", remote: true, notes: "Team lead" },
  { id: "2", name: "Bob Martinez", email: "bob@corp.com", role: "Designer", department: "Product", status: "active", salary: 95000, startDate: "2020-07-01", remote: false, notes: "UI specialist" },
  { id: "3", name: "Carol White", email: "carol@corp.com", role: "Manager", department: "Engineering", status: "inactive", salary: 140000, startDate: "2019-01-20", remote: true, notes: "On leave" },
  { id: "4", name: "David Lee", email: "david@corp.com", role: "Analyst", department: "Finance", status: "active", salary: 88000, startDate: "2022-06-10", remote: false, notes: "" },
  { id: "5", name: "Eva Chen", email: "eva@corp.com", role: "Engineer", department: "Engineering", status: "pending", salary: 105000, startDate: "2023-02-14", remote: true, notes: "New hire" },
  { id: "6", name: "Frank Kim", email: "frank@corp.com", role: "DevOps", department: "Infrastructure", status: "active", salary: 115000, startDate: "2020-11-30", remote: false, notes: "" },
  { id: "7", name: "Grace Patel", email: "grace@corp.com", role: "PM", department: "Product", status: "active", salary: 130000, startDate: "2018-09-05", remote: true, notes: "Senior PM" },
  { id: "8", name: "Henry Brown", email: "henry@corp.com", role: "Engineer", department: "Engineering", status: "inactive", salary: 98000, startDate: "2021-12-01", remote: false, notes: "" },
  { id: "9", name: "Iris Wang", email: "iris@corp.com", role: "Designer", department: "Product", status: "active", salary: 92000, startDate: "2022-03-20", remote: true, notes: "" },
  { id: "10", name: "James Taylor", email: "james@corp.com", role: "Analyst", department: "Finance", status: "pending", salary: 82000, startDate: "2023-08-01", remote: false, notes: "Probation" },
  { id: "11", name: "Karen Davis", email: "karen@corp.com", role: "Engineer", department: "Engineering", status: "active", salary: 110000, startDate: "2020-04-15", remote: true, notes: "" },
  { id: "12", name: "Leo Nguyen", email: "leo@corp.com", role: "Manager", department: "Finance", status: "active", salary: 145000, startDate: "2017-06-01", remote: false, notes: "VP-level" },
]

const statusBadge = (status: Employee["status"]) => {
  const map = {
    active: "default",
    inactive: "destructive",
    pending: "secondary",
  } as const
  return <Badge variant={map[status]}>{status}</Badge>
}

const baseColumns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "department", header: "Department" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => statusBadge(getValue() as Employee["status"]),
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
    meta: { align: "right" },
  },
]

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <DataTable columns={baseColumns} data={employees} />
  ),
}

export const Sorting: Story = {
  name: "Sorting",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ sorting: true }}
    />
  ),
}

export const GlobalFilter: Story = {
  name: "Global Search",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ sorting: true, globalFilter: true }}
    />
  ),
}

export const ColumnFiltering: Story = {
  name: "Column Filters",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ sorting: true, filtering: true, globalFilter: true }}
    />
  ),
}

export const Pagination: Story = {
  name: "Pagination",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ sorting: true, pagination: true }}
      paginationOptions={{ pageSize: 5, pageSizeOptions: [5, 10, 20] }}
    />
  ),
}

export const RowSelectionMultiple: Story = {
  name: "Row Selection (Multiple)",
  render: () => {
    const [selected, setSelected] = React.useState<Employee[]>([])
    return (
      <div className="space-y-4">
        <DataTable
          columns={baseColumns}
          data={employees}
          features={{ rowSelection: "multiple" }}
          onRowSelectionChange={setSelected}
        />
        {selected.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {selected.length} row(s) selected: {selected.map((r) => r.name).join(", ")}
          </p>
        )}
      </div>
    )
  },
}

export const RowSelectionSingle: Story = {
  name: "Row Selection (Single)",
  render: () => {
    const [selected, setSelected] = React.useState<Employee[]>([])
    return (
      <div className="space-y-4">
        <DataTable
          columns={baseColumns}
          data={employees}
          features={{ rowSelection: "single" }}
          onRowSelectionChange={setSelected}
        />
        {selected.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Selected: {selected[0]?.name}
          </p>
        )}
      </div>
    )
  },
}

export const BulkActions: Story = {
  name: "Bulk Actions",
  render: () => {
    const [log, setLog] = React.useState<string[]>([])
    return (
      <div className="space-y-4">
        <DataTable
          columns={baseColumns}
          data={employees}
          features={{ rowSelection: "multiple", bulkActions: true }}
          bulkActions={[
            {
              id: "activate",
              label: "Activate",
              variant: "default",
              onClick: (rows) => setLog((l) => [...l, `Activated: ${rows.map((r) => r.name).join(", ")}`]),
            },
            {
              id: "delete",
              label: "Delete",
              variant: "destructive",
              onClick: (rows) => setLog((l) => [...l, `Deleted: ${rows.map((r) => r.name).join(", ")}`]),
            },
          ]}
        />
        <div className="text-sm text-muted-foreground space-y-1">
          {log.map((entry, i) => <p key={i}>{entry}</p>)}
        </div>
      </div>
    )
  },
}

export const ColumnVisibility: Story = {
  name: "Column Visibility",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ columnVisibility: true }}
    />
  ),
}

export const ColumnPinning: Story = {
  name: "Column Pinning",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ columnPinning: true, columnVisibility: true }}
    />
  ),
}

export const DraggableColumns: Story = {
  name: "Draggable Columns",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ draggableColumns: true }}
    />
  ),
}

export const ColumnResizing: Story = {
  name: "Column Resizing",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ columnResizing: true }}
    />
  ),
}

export const RowExpansion: Story = {
  name: "Row Expansion",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ rowExpansion: true }}
      renderSubComponent={({ row }) => (
        <div className="px-4 py-3 bg-muted/30 text-sm space-y-1">
          <p><span className="font-medium">Start date:</span> {row.original.startDate}</p>
          <p><span className="font-medium">Remote:</span> {row.original.remote ? "Yes" : "No"}</p>
          {row.original.notes && (
            <p><span className="font-medium">Notes:</span> {row.original.notes}</p>
          )}
        </div>
      )}
    />
  ),
}

export const RowNumbers: Story = {
  name: "Row Numbers",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ rowNumbers: true }}
    />
  ),
}

export const Striped: Story = {
  name: "Striped & Hoverable",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ striped: true, hoverable: true }}
    />
  ),
}

export const Density: Story = {
  name: "Density Switcher",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ density: true }}
    />
  ),
}

export const Zoom: Story = {
  name: "Zoom Controls",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ zoom: true }}
      zoomOptions={{ min: 0.7, max: 1.5, step: 0.1, default: 1 }}
    />
  ),
}

export const StickyHeader: Story = {
  name: "Sticky Header",
  render: () => (
    <div className="h-64 overflow-auto border rounded-md">
      <DataTable
        columns={baseColumns}
        data={employees}
        features={{ stickyHeader: true }}
      />
    </div>
  ),
}

export const ExportButtons: Story = {
  name: "Export CSV & JSON",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ exportCsv: true, exportJson: true }}
    />
  ),
}

export const EditableCells: Story = {
  name: "Editable Cells",
  render: () => {
    const [data, setData] = React.useState(employees)
    const columns: ColumnDef<Employee>[] = [
      { accessorKey: "name", header: "Name", meta: { editable: true, editType: "text" } },
      { accessorKey: "role", header: "Role", meta: { editable: true, editType: "select", editOptions: ["Engineer", "Designer", "Manager", "Analyst", "DevOps", "PM"] } },
      { accessorKey: "department", header: "Department", meta: { editable: true, editType: "text" } },
      {
        accessorKey: "salary",
        header: "Salary",
        meta: {
          editable: true,
          editType: "number",
          align: "right",
          validate: (v) => (Number(v) < 0 ? "Salary must be positive" : null),
        },
        cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
      },
      { accessorKey: "startDate", header: "Start Date", meta: { editable: true, editType: "date" } },
      { accessorKey: "remote", header: "Remote", meta: { editable: true, editType: "boolean" }, cell: ({ getValue }) => (getValue() ? "Yes" : "No") },
      { accessorKey: "notes", header: "Notes", meta: { editable: true, editType: "textarea" } },
    ]
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Double-click any cell to edit. Press Enter to save, Escape to cancel.</p>
        <DataTable
          columns={columns}
          data={data}
          getRowId={(r) => r.id}
          features={{ editableCells: true, sorting: true }}
          onCellEdit={({ rowId, columnId, newValue }) => {
            setData((prev) =>
              prev.map((row) => row.id === rowId ? { ...row, [columnId]: newValue } : row)
            )
          }}
        />
      </div>
    )
  },
}

export const RBACColumnAccess: Story = {
  name: "RBAC – Role-Based Column Access",
  render: () => {
    const [role, setRole] = React.useState<"admin" | "hr" | "manager">("manager")
    const columns: ColumnDef<Employee>[] = [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "department", header: "Department" },
      {
        accessorKey: "salary",
        header: "Salary",
        meta: {
          roles: ["admin", "hr"],
          editable: true,
          editType: "number",
          editRoles: ["admin"],
          align: "right",
        },
        cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { roles: ["admin", "hr", "manager"] },
        cell: ({ getValue }) => statusBadge(getValue() as Employee["status"]),
      },
    ]
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Viewing as:</span>
          {(["admin", "hr", "manager"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${role === r ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          "Salary" column is only visible to admin/hr. Editing salary is only allowed for admin.
        </p>
        <DataTable
          columns={columns}
          data={employees}
          rbac={{ userRole: role }}
          features={{ editableCells: true }}
        />
      </div>
    )
  },
}

export const LoadingState: Story = {
  name: "Loading State",
  render: () => (
    <DataTable columns={baseColumns} data={[]} isLoading />
  ),
}

export const EmptyState: Story = {
  name: "Empty State",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={[]}
      emptyMessage="No employees found. Try adjusting your filters."
    />
  ),
}

export const CustomEmptyState: Story = {
  name: "Custom Empty Render",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={[]}
      renderEmpty={() => (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          <p className="text-sm font-medium">Nothing here yet</p>
          <p className="text-xs">Add an employee to get started.</p>
        </div>
      )}
    />
  ),
}

export const ServerSideMode: Story = {
  name: "Server-Side Pagination & Sorting",
  render: () => {
    const [log, setLog] = React.useState("Waiting for interaction…")
    return (
      <div className="space-y-4">
        <DataTable
          columns={baseColumns}
          data={employees.slice(0, 5)}
          features={{ sorting: true, pagination: true, globalFilter: true }}
          paginationOptions={{ pageSize: 5 }}
          serverSide={{
            totalCount: 120,
            onFetchData: ({ sorting, pagination, globalFilter }) => {
              setLog(
                `Page ${pagination.pageIndex + 1}, size ${pagination.pageSize}` +
                (sorting[0] ? `, sort by ${sorting[0].id} ${sorting[0].desc ? "desc" : "asc"}` : "") +
                (globalFilter ? `, search: "${globalFilter}"` : "")
              )
            },
          }}
        />
        <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-2 rounded">{log}</p>
      </div>
    )
  },
}

export const CustomToolbar: Story = {
  name: "Custom Toolbar Content",
  render: () => (
    <DataTable
      columns={baseColumns}
      data={employees}
      features={{ globalFilter: true, columnVisibility: true }}
      renderToolbar={() => (
        <button className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
          + Add Employee
        </button>
      )}
    />
  ),
}

export const KitchenSink: Story = {
  name: "Kitchen Sink (All Features)",
  render: () => {
    const [data, setData] = React.useState(employees)
    const [log, setLog] = React.useState<string[]>([])

    const columns: ColumnDef<Employee>[] = [
      { accessorKey: "name", header: "Name", meta: { editable: true, editType: "text" } },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        meta: { editable: true, editType: "select", editOptions: ["Engineer", "Designer", "Manager", "Analyst", "DevOps", "PM"] },
      },
      { accessorKey: "department", header: "Department" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => statusBadge(getValue() as Employee["status"]),
      },
      {
        accessorKey: "salary",
        header: "Salary",
        meta: {
          editable: true,
          editType: "number",
          align: "right",
          validate: (v) => (Number(v) < 0 ? "Must be positive" : null),
        },
        cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
      },
      { accessorKey: "startDate", header: "Start Date", meta: { editable: true, editType: "date" } },
      { accessorKey: "remote", header: "Remote", meta: { editable: true, editType: "boolean" }, cell: ({ getValue }) => (getValue() ? "Yes" : "No") },
    ]

    return (
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data}
          getRowId={(r) => r.id}
          features={{
            sorting: true,
            filtering: true,
            globalFilter: true,
            pagination: true,
            rowSelection: "multiple",
            bulkActions: true,
            columnVisibility: true,
            columnPinning: true,
            draggableColumns: true,
            columnResizing: true,
            rowExpansion: true,
            rowNumbers: true,
            zoom: true,
            striped: true,
            hoverable: true,
            density: true,
            editableCells: true,
            exportCsv: true,
            exportJson: true,
          }}
          paginationOptions={{ pageSize: 5, pageSizeOptions: [5, 10, 20] }}
          bulkActions={[
            {
              id: "delete",
              label: "Delete selected",
              variant: "destructive",
              onClick: (rows) => {
                const ids = new Set(rows.map((r) => r.id))
                setData((prev) => prev.filter((r) => !ids.has(r.id)))
                setLog((l) => [`Deleted ${rows.length} row(s)`, ...l])
              },
            },
          ]}
          onCellEdit={({ rowId, columnId, newValue }) => {
            setData((prev) =>
              prev.map((row) => row.id === rowId ? { ...row, [columnId]: newValue } : row)
            )
            setLog((l) => [`Edited ${columnId} on row ${rowId} → ${newValue}`, ...l])
          }}
          renderSubComponent={({ row }) => (
            <div className="px-4 py-3 bg-muted/30 text-sm space-y-1">
              <p><span className="font-medium">Start date:</span> {row.original.startDate}</p>
              <p><span className="font-medium">Remote:</span> {row.original.remote ? "Yes" : "No"}</p>
              {row.original.notes && <p><span className="font-medium">Notes:</span> {row.original.notes}</p>}
            </div>
          )}
          renderToolbar={() => (
            <button className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
              + Add
            </button>
          )}
        />
        {log.length > 0 && (
          <div className="text-xs font-mono bg-muted rounded px-3 py-2 space-y-0.5 max-h-32 overflow-auto">
            {log.map((entry, i) => <p key={i}>{entry}</p>)}
          </div>
        )}
      </div>
    )
  },
}
