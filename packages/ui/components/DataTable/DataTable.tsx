"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type PaginationState,
  type ColumnOrderState,
} from "@tanstack/react-table"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { cn } from "../../lib/utils"
import { Button } from "../Button/Button"
import { Input } from "../Input/Input"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../Table/Table"

import type {
  DataTableProps,
  DataTableFeatures,
  DraggableColumnHeaderProps,
} from "./DataTable.types"

// Icons for UI elements
function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ChevronsUpDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  )
}

function GripVerticalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  )
}

function ZoomInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  )
}

function ZoomOutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8 11h6" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

// Draggable column header component
function DraggableColumnHeader<TData, TValue>({
  header,
  children,
  className,
}: DraggableColumnHeaderProps<TData, TValue>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: header.column.id,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : 0,
  }

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn("relative select-none", className)}
      {...attributes}
    >
      <div className="flex items-center gap-2">
        <button
          className="cursor-grab touch-none active:cursor-grabbing"
          {...listeners}
        >
          <GripVerticalIcon />
        </button>
        {children}
      </div>
    </TableHead>
  )
}

// Regular column header with sort
function SortableColumnHeader<TData, TValue>({
  header,
  children,
  canSort,
}: {
  header: any
  children: React.ReactNode
  canSort: boolean
}) {
  if (!canSort) {
    return <TableHead>{children}</TableHead>
  }

  return (
    <TableHead>
      <button
        className="flex items-center gap-2 hover:text-foreground"
        onClick={header.column.getToggleSortingHandler()}
      >
        {children}
        {header.column.getIsSorted() === "asc" ? (
          <ChevronUpIcon />
        ) : header.column.getIsSorted() === "desc" ? (
          <ChevronDownIcon />
        ) : (
          <ChevronsUpDownIcon />
        )}
      </button>
    </TableHead>
  )
}

/**
 * DataTable - An Airtable-like data table with advanced features.
 * 
 * @example
 * ```tsx
 * const columns: ColumnDef<User>[] = [
 *   { accessorKey: "name", header: "Name" },
 *   { accessorKey: "email", header: "Email" },
 *   { accessorKey: "role", header: "Role" },
 * ]
 * 
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   features={{
 *     sorting: true,
 *     filtering: true,
 *     pagination: true,
 *     draggableColumns: true,
 *     columnResizing: true,
 *     zoom: true,
 *   }}
 * />
 * ```
 */
function DataTable<TData, TValue>({
  columns,
  data,
  features = {},
  paginationOptions,
  zoomOptions,
  isLoading = false,
  emptyMessage = "No results.",
  className,
  tableClassName,
  onRowSelectionChange,
  onColumnOrderChange,
  onSortingChange,
  onPaginationChange,
  getRowId,
  renderToolbar,
  renderEmpty,
  children,
}: DataTableProps<TData, TValue>) {
  // Default features
  const {
    sorting: enableSorting = false,
    filtering: enableFiltering = false,
    globalFilter: enableGlobalFilter = false,
    pagination: enablePagination = false,
    columnVisibility: enableColumnVisibility = false,
    rowSelection: enableRowSelection = false,
    draggableColumns: enableDraggableColumns = false,
    columnResizing: enableColumnResizing = false,
    zoom: enableZoom = false,
    exportCsv: enableExportCsv = false,
    striped = false,
    hoverable = true,
    compact = false,
  } = features

  // Zoom settings
  const {
    min: zoomMin = 50,
    max: zoomMax = 150,
    step: zoomStep = 10,
    default: zoomDefault = 100,
  } = zoomOptions || {}

  // Pagination settings
  const {
    pageSize: defaultPageSize = 10,
    pageSizeOptions = [10, 20, 30, 40, 50],
  } = paginationOptions || {}

  // State
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    columns.map((c) => (c as any).accessorKey || c.id || "")
  )
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })
  const [zoom, setZoom] = React.useState(zoomDefault)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater
      setSorting(newSorting)
      onSortingChange?.(newSorting)
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newRowSelection = typeof updater === "function" ? updater(rowSelection) : updater
      setRowSelection(newRowSelection)
      if (onRowSelectionChange) {
        const selectedRows = Object.keys(newRowSelection)
          .filter((key) => newRowSelection[key])
          .map((key) => data[parseInt(key)])
          .filter(Boolean)
        onRowSelectionChange(selectedRows)
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater
      setPagination(newPagination)
      onPaginationChange?.(newPagination)
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnOrder,
      pagination,
    },
    enableSorting,
    enableColumnFilters: enableFiltering,
    enableGlobalFilter,
    enableRowSelection: !!enableRowSelection,
    enableMultiRowSelection: enableRowSelection !== "single",
    enableColumnResizing,
    columnResizeMode: "onChange",
    getRowId,
    manualPagination: false,
  })

  // Handle drag end for columns
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        const newOrder = arrayMove(prev, oldIndex, newIndex)
        onColumnOrderChange?.(newOrder)
        return newOrder
      })
    }
  }

  // Export to CSV
  const exportToCsv = () => {
    const headers = table.getAllLeafColumns().map((col) => col.id)
    const rows = table.getFilteredRowModel().rows.map((row) =>
      headers.map((header) => {
        const value = row.getValue(header)
        // Handle values that might contain commas or quotes
        const stringValue = String(value ?? "")
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
    )

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "table-export.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + zoomStep, zoomMax))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - zoomStep, zoomMin))

  // Render header
  const renderHeader = () => {
    return table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {enableDraggableColumns ? (
          <SortableContext
            items={columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {headerGroup.headers.map((header) => (
              <DraggableColumnHeader key={header.id} header={header}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </DraggableColumnHeader>
            ))}
          </SortableContext>
        ) : (
          headerGroup.headers.map((header) => (
            <SortableColumnHeader
              key={header.id}
              header={header}
              canSort={enableSorting && header.column.getCanSort()}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </SortableColumnHeader>
          ))
        )}
      </TableRow>
    ))
  }

  // Render body
  const renderBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 rounded-full animate-spin border-primary border-t-transparent" />
              <span className="ml-2">Loading...</span>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (table.getRowModel().rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            {renderEmpty ? renderEmpty() : emptyMessage}
          </TableCell>
        </TableRow>
      )
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className={cn(
          striped && row.index % 2 === 0 && "bg-muted/50",
          hoverable && "hover:bg-muted/50"
        )}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={cn(compact && "py-2 px-3")}
            style={
              enableColumnResizing
                ? { width: cell.column.getSize() }
                : undefined
            }
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  // DnD wrapper for draggable columns
  const tableContent = (
    <div
      className={cn("w-full", className)}
      style={enableZoom ? { fontSize: `${zoom}%` } : undefined}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          {/* Global search */}
          {enableGlobalFilter && (
            <div className="relative">
              <SearchIcon />
              <Input
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm pl-8"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          {enableZoom && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= zoomMin}
              >
                <ZoomOutIcon />
              </Button>
              <span className="min-w-[3rem] text-center text-sm">{zoom}%</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= zoomMax}
              >
                <ZoomInIcon />
              </Button>
            </div>
          )}

          {/* Export */}
          {enableExportCsv && (
            <Button variant="outline" size="sm" onClick={exportToCsv}>
              <DownloadIcon />
              <span className="ml-2">Export CSV</span>
            </Button>
          )}

          {/* Column visibility */}
          {enableColumnVisibility && (
            <div className="flex items-center gap-2">
              {table.getAllLeafColumns().map((column) => (
                <label key={column.id} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  {column.id}
                </label>
              ))}
            </div>
          )}

          {/* Custom toolbar */}
          {renderToolbar && renderToolbar(table)}

          {/* Children */}
          {children}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table
          className={cn(
            tableClassName,
            enableColumnResizing && "table-fixed"
          )}
        >
          <TableHeader>{renderHeader()}</TableHeader>
          <TableBody>{renderBody()}</TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="h-8 px-2 text-sm border rounded-md border-input bg-background"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Wrap with DnD context if draggable columns are enabled
  if (enableDraggableColumns) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {tableContent}
      </DndContext>
    )
  }

  return tableContent
}

DataTable.displayName = "DataTable"

export { DataTable }