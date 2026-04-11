import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './DataTable'

// ─── Shared fixtures ──────────────────────────────────────────────────────────

type User = { id: string; name: string; email: string; role: string; salary: number; active: boolean }

const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@corp.com', role: 'Engineer', salary: 120000, active: true },
  { id: '2', name: 'Bob Martinez', email: 'bob@corp.com', role: 'Designer', salary: 95000, active: false },
  { id: '3', name: 'Carol White', email: 'carol@corp.com', role: 'Manager', salary: 140000, active: true },
  { id: '4', name: 'David Lee', email: 'david@corp.com', role: 'Analyst', salary: 88000, active: true },
  { id: '5', name: 'Eva Chen', email: 'eva@corp.com', role: 'Engineer', salary: 105000, active: false },
]

const baseColumns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'salary', header: 'Salary', meta: { align: 'right' } },
]

// ─── Snapshot ─────────────────────────────────────────────────────────────────

describe('DataTable', () => {
  describe('Snapshot', () => {
    it('matches snapshot for default render', () => {
      const { container } = render(<DataTable columns={baseColumns} data={users} />)
      expect(container).toMatchSnapshot()
    })
  })

  // ─── Rendering ──────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders column headers', () => {
      render(<DataTable columns={baseColumns} data={users} />)
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      expect(screen.getByText('Salary')).toBeInTheDocument()
    })

    it('renders all row data', () => {
      render(<DataTable columns={baseColumns} data={users} />)
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('Bob Martinez')).toBeInTheDocument()
      expect(screen.getByText('Carol White')).toBeInTheDocument()
      expect(screen.getByText('David Lee')).toBeInTheDocument()
      expect(screen.getByText('Eva Chen')).toBeInTheDocument()
    })

    it('shows default empty message when data is empty', () => {
      render(<DataTable columns={baseColumns} data={[]} />)
      expect(screen.getByText(/no results/i)).toBeInTheDocument()
    })

    it('shows custom emptyMessage when data is empty', () => {
      render(<DataTable columns={baseColumns} data={[]} emptyMessage="No employees found." />)
      expect(screen.getByText('No employees found.')).toBeInTheDocument()
    })

    it('shows loading skeleton when isLoading is true', () => {
      const { container } = render(<DataTable columns={baseColumns} data={[]} isLoading />)
      // Skeleton elements should be present
      const skeletons = container.querySelectorAll('[data-slot="skeleton"], .animate-pulse, [class*="skeleton"]')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('renders custom renderEmpty when data is empty', () => {
      render(
        <DataTable
          columns={baseColumns}
          data={[]}
          renderEmpty={() => <div data-testid="custom-empty">Custom empty</div>}
        />
      )
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument()
    })
  })

  // ─── Row Numbers ─────────────────────────────────────────────────────────────

  describe('Row Numbers', () => {
    it('renders row number column when rowNumbers feature is enabled', () => {
      render(<DataTable columns={baseColumns} data={users} features={{ rowNumbers: true }} />)
      expect(screen.getByText('#')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('does not render row number column by default', () => {
      render(<DataTable columns={baseColumns} data={users} />)
      expect(screen.queryByText('#')).not.toBeInTheDocument()
    })
  })

  // ─── Sorting ─────────────────────────────────────────────────────────────────

  describe('Sorting', () => {
    it('renders sortable headers when sorting is enabled', () => {
      render(<DataTable columns={baseColumns} data={users} features={{ sorting: true }} />)
      const nameHeader = screen.getByText('Name')
      expect(nameHeader).toBeInTheDocument()
    })

    it('calls onSortingChange when a header is clicked', async () => {
      const onSortingChange = vi.fn()
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          features={{ sorting: true }}
          onSortingChange={onSortingChange}
        />
      )
      fireEvent.click(screen.getByText('Name'))
      await waitFor(() => expect(onSortingChange).toHaveBeenCalled())
    })

    it('toggling sort order on the same column cycles through states', async () => {
      const onSortingChange = vi.fn()
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          features={{ sorting: true }}
          onSortingChange={onSortingChange}
        />
      )
      fireEvent.click(screen.getByText('Name'))
      await waitFor(() => expect(onSortingChange).toHaveBeenCalledTimes(1))
      fireEvent.click(screen.getByText('Name'))
      await waitFor(() => expect(onSortingChange).toHaveBeenCalledTimes(2))
    })
  })

  // ─── Global Filter ────────────────────────────────────────────────────────────

  describe('Global Filter', () => {
    it('renders search input when globalFilter feature is enabled', () => {
      render(<DataTable columns={baseColumns} data={users} features={{ globalFilter: true }} />)
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    })

    it('filters rows based on search input', async () => {
      render(<DataTable columns={baseColumns} data={users} features={{ globalFilter: true }} />)
      const searchInput = screen.getByPlaceholderText(/search/i)
      fireEvent.change(searchInput, { target: { value: 'alice' } })
      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
        expect(screen.queryByText('Bob Martinez')).not.toBeInTheDocument()
      })
    })

    it('shows empty state when no rows match filter', async () => {
      render(<DataTable columns={baseColumns} data={users} features={{ globalFilter: true }} />)
      const searchInput = screen.getByPlaceholderText(/search/i)
      fireEvent.change(searchInput, { target: { value: 'zzznomatch' } })
      await waitFor(() => expect(screen.getByText(/no results/i)).toBeInTheDocument())
    })
  })

  // ─── Pagination ───────────────────────────────────────────────────────────────

  describe('Pagination', () => {
    const manyUsers: User[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      email: `user${i + 1}@corp.com`,
      role: 'Engineer',
      salary: 100000,
      active: true,
    }))

    it('renders pagination controls when pagination feature is enabled', () => {
      render(
        <DataTable
          columns={baseColumns}
          data={manyUsers}
          features={{ pagination: true }}
          paginationOptions={{ pageSize: 5 }}
        />
      )
      // Next/prev buttons should exist
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('shows correct rows for first page', () => {
      render(
        <DataTable
          columns={baseColumns}
          data={manyUsers}
          features={{ pagination: true }}
          paginationOptions={{ pageSize: 5 }}
        />
      )
      expect(screen.getByText('User 1')).toBeInTheDocument()
      expect(screen.queryByText('User 6')).not.toBeInTheDocument()
    })

    it('navigates to next page on button click', async () => {
      render(
        <DataTable
          columns={baseColumns}
          data={manyUsers}
          features={{ pagination: true }}
          paginationOptions={{ pageSize: 5 }}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await waitFor(() => expect(screen.getByText('User 6')).toBeInTheDocument())
    })

    it('calls onPaginationChange when page changes', async () => {
      const onPaginationChange = vi.fn()
      render(
        <DataTable
          columns={baseColumns}
          data={manyUsers}
          features={{ pagination: true }}
          paginationOptions={{ pageSize: 5 }}
          onPaginationChange={onPaginationChange}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await waitFor(() => expect(onPaginationChange).toHaveBeenCalled())
    })
  })

  // ─── Row Selection ────────────────────────────────────────────────────────────

  describe('Row Selection', () => {
    it('renders checkboxes when rowSelection is enabled', () => {
      render(<DataTable columns={baseColumns} data={users} features={{ rowSelection: true }} />)
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    it('calls onRowSelectionChange when a row is selected', async () => {
      const onRowSelectionChange = vi.fn()
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          getRowId={(r) => r.id}
          features={{ rowSelection: 'multiple' }}
          onRowSelectionChange={onRowSelectionChange}
        />
      )
      const checkboxes = screen.getAllByRole('checkbox')
      // Click first row checkbox (index 1 because index 0 is "select all")
      fireEvent.click(checkboxes[1])
      await waitFor(() => expect(onRowSelectionChange).toHaveBeenCalled())
    })

    it('selects all rows via header checkbox', async () => {
      const onRowSelectionChange = vi.fn()
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          getRowId={(r) => r.id}
          features={{ rowSelection: 'multiple' }}
          onRowSelectionChange={onRowSelectionChange}
        />
      )
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0]) // header "select all"
      await waitFor(() => {
        expect(onRowSelectionChange).toHaveBeenCalled()
        const lastCall = onRowSelectionChange.mock.calls.at(-1)?.[0]
        expect(lastCall?.length).toBe(users.length)
      })
    })
  })

  // ─── Bulk Actions ─────────────────────────────────────────────────────────────

  describe('Bulk Actions', () => {
    it('bulk action bar is hidden when no rows are selected', () => {
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          features={{ rowSelection: 'multiple', bulkActions: true }}
          bulkActions={[{ id: 'delete', label: 'Delete', onClick: vi.fn() }]}
        />
      )
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    })

    it('bulk action bar appears when rows are selected', async () => {
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          getRowId={(r) => r.id}
          features={{ rowSelection: 'multiple', bulkActions: true }}
          bulkActions={[{ id: 'delete', label: 'Delete', variant: 'destructive', onClick: vi.fn() }]}
        />
      )
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[1])
      await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())
    })

    it('calls bulk action onClick with selected rows', async () => {
      const onDelete = vi.fn()
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          getRowId={(r) => r.id}
          features={{ rowSelection: 'multiple', bulkActions: true }}
          bulkActions={[{ id: 'delete', label: 'Delete', onClick: onDelete }]}
        />
      )
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[1])
      await waitFor(() => screen.getByText('Delete'))
      fireEvent.click(screen.getByText('Delete'))
      expect(onDelete).toHaveBeenCalledWith([users[0]])
    })
  })

  // ─── Editable Cells ───────────────────────────────────────────────────────────

  describe('Editable Cells', () => {
    const editableColumns: ColumnDef<User>[] = [
      { accessorKey: 'name', header: 'Name', meta: { editable: true, editType: 'text' } },
      { accessorKey: 'role', header: 'Role', meta: { editable: true, editType: 'select', editOptions: ['Engineer', 'Designer', 'Manager'] } },
      { accessorKey: 'salary', header: 'Salary', meta: { editable: true, editType: 'number' } },
    ]

    it('double-clicking an editable cell enters edit mode', async () => {
      render(
        <DataTable
          columns={editableColumns}
          data={users}
          getRowId={(r) => r.id}
          features={{ editableCells: true }}
        />
      )
      const cell = screen.getByText('Alice Johnson')
      fireEvent.doubleClick(cell)
      await waitFor(() => expect(screen.getByDisplayValue('Alice Johnson')).toBeInTheDocument())
    })

    it('pressing Escape cancels an edit', async () => {
      render(
        <DataTable
          columns={editableColumns}
          data={users}
          getRowId={(r) => r.id}
          features={{ editableCells: true }}
        />
      )
      fireEvent.doubleClick(screen.getByText('Alice Johnson'))
      await waitFor(() => screen.getByDisplayValue('Alice Johnson'))
      fireEvent.keyDown(screen.getByDisplayValue('Alice Johnson'), { key: 'Escape' })
      await waitFor(() => expect(screen.queryByDisplayValue('Alice Johnson')).not.toBeInTheDocument())
    })

    it('pressing Enter commits an edit and calls onCellEdit', async () => {
      const onCellEdit = vi.fn()
      render(
        <DataTable
          columns={editableColumns}
          data={users}
          getRowId={(r) => r.id}
          features={{ editableCells: true }}
          onCellEdit={onCellEdit}
        />
      )
      fireEvent.doubleClick(screen.getByText('Alice Johnson'))
      const input = await screen.findByDisplayValue('Alice Johnson')
      fireEvent.change(input, { target: { value: 'Alice Updated' } })
      fireEvent.keyDown(input, { key: 'Enter' })
      await waitFor(() => {
        expect(onCellEdit).toHaveBeenCalledWith(
          expect.objectContaining({ columnId: 'name', newValue: 'Alice Updated' })
        )
      })
    })
  })

  // ─── Column Visibility ────────────────────────────────────────────────────────

  describe('Column Visibility', () => {
    it('renders column visibility toggle button when feature is enabled', () => {
      render(<DataTable columns={baseColumns} data={users} features={{ columnVisibility: true }} />)
      // Should have a columns toggle button in toolbar
      const btn = screen.getByRole('button', { name: /columns/i })
      expect(btn).toBeInTheDocument()
    })
  })

  // ─── RBAC ─────────────────────────────────────────────────────────────────────

  describe('RBAC', () => {
    const rbacColumns: ColumnDef<User>[] = [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'salary', header: 'Salary', meta: { roles: ['admin', 'hr'] } },
    ]

    it('hides column when user role is not in meta.roles', () => {
      render(<DataTable columns={rbacColumns} data={users} rbac={{ userRole: 'viewer' }} />)
      expect(screen.queryByText('Salary')).not.toBeInTheDocument()
    })

    it('shows column when user role is in meta.roles', () => {
      render(<DataTable columns={rbacColumns} data={users} rbac={{ userRole: 'admin' }} />)
      expect(screen.getByText('Salary')).toBeInTheDocument()
    })

    it('shows all columns when no rbac is provided', () => {
      render(<DataTable columns={rbacColumns} data={users} />)
      expect(screen.getByText('Salary')).toBeInTheDocument()
    })
  })

  // ─── Export ───────────────────────────────────────────────────────────────────

  describe('Export', () => {
    it('renders Export CSV button when exportCsv feature is enabled', () => {
      render(<DataTable columns={baseColumns} data={users} features={{ exportCsv: true }} />)
      expect(screen.getByRole('button', { name: /csv/i })).toBeInTheDocument()
    })

    it('renders Export JSON button when exportJson feature is enabled', () => {
      render(<DataTable columns={baseColumns} data={users} features={{ exportJson: true }} />)
      expect(screen.getByRole('button', { name: /json/i })).toBeInTheDocument()
    })

    it('does not render export buttons when features are disabled', () => {
      render(<DataTable columns={baseColumns} data={users} />)
      expect(screen.queryByRole('button', { name: /csv/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /json/i })).not.toBeInTheDocument()
    })
  })

  // ─── Custom Toolbar ───────────────────────────────────────────────────────────

  describe('Custom Toolbar', () => {
    it('renders renderToolbar content', () => {
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          renderToolbar={() => <button data-testid="custom-btn">Add</button>}
        />
      )
      expect(screen.getByTestId('custom-btn')).toBeInTheDocument()
    })
  })

  // ─── Row Expansion ────────────────────────────────────────────────────────────

  describe('Row Expansion', () => {
    it('renders expand toggle buttons when rowExpansion is enabled', () => {
      render(
        <DataTable
          columns={baseColumns}
          data={users}
          features={{ rowExpansion: true }}
          renderSubComponent={({ row }) => <div>Details for {row.original.name}</div>}
        />
      )
      const expandBtns = screen.getAllByRole('button')
      expect(expandBtns.length).toBeGreaterThan(0)
    })

    it('shows sub-component when a row is expanded', async () => {
      render(
        <DataTable
          columns={baseColumns}
          data={users.slice(0, 1)}
          features={{ rowExpansion: true }}
          renderSubComponent={({ row }) => (
            <div data-testid="subrow">Details: {row.original.name}</div>
          )}
        />
      )
      const expandBtn = screen.getAllByRole('button')[0]
      fireEvent.click(expandBtn)
      await waitFor(() => expect(screen.getByTestId('subrow')).toBeInTheDocument())
    })
  })

  // ─── Edge Cases ───────────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('renders with no features enabled', () => {
      const { container } = render(<DataTable columns={baseColumns} data={users} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with empty columns array', () => {
      const { container } = render(<DataTable columns={[]} data={users} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with a single row', () => {
      render(<DataTable columns={baseColumns} data={[users[0]]} />)
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    it('renders with all features enabled and empty data', () => {
      expect(() =>
        render(
          <DataTable
            columns={baseColumns}
            data={[]}
            features={{
              sorting: true,
              filtering: true,
              globalFilter: true,
              pagination: true,
              rowSelection: true,
              columnVisibility: true,
              rowNumbers: true,
              striped: true,
              hoverable: true,
              density: true,
              exportCsv: true,
              exportJson: true,
            }}
          />
        )
      ).not.toThrow()
    })

    it('accepts a custom getRowId function', () => {
      const getRowId = vi.fn((r: User) => r.id)
      render(<DataTable columns={baseColumns} data={users} getRowId={getRowId} />)
      expect(getRowId).toHaveBeenCalled()
    })

    it('applies custom className to outer container', () => {
      const { container } = render(
        <DataTable columns={baseColumns} data={users} className="my-custom-class" />
      )
      expect(container.firstChild).toHaveClass('my-custom-class')
    })
  })
})
