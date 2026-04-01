/**
 * DataTable component type definitions
 * @module DataTable
 */
import type * as React from "react";
import type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, RowSelectionState, PaginationState, Table as TanStackTable } from "@tanstack/react-table";
/**
 * Configuration for table features
 */
export interface DataTableFeatures {
    /** Enable column sorting */
    sorting?: boolean;
    /** Enable column filtering */
    filtering?: boolean;
    /** Enable global search */
    globalFilter?: boolean;
    /** Enable pagination */
    pagination?: boolean;
    /** Enable column visibility toggle */
    columnVisibility?: boolean;
    /** Enable row selection */
    rowSelection?: boolean | "single" | "multiple";
    /** Enable draggable columns (reorder) */
    draggableColumns?: boolean;
    /** Enable column resizing */
    columnResizing?: boolean;
    /** Enable zoom in/out */
    zoom?: boolean;
    /** Enable CSV export */
    exportCsv?: boolean;
    /** Enable striped rows */
    striped?: boolean;
    /** Enable hover highlight */
    hoverable?: boolean;
    /** Enable compact mode */
    compact?: boolean;
}
/**
 * Pagination options
 */
export interface PaginationOptions {
    /** Default page size */
    pageSize?: number;
    /** Available page sizes */
    pageSizeOptions?: number[];
}
/**
 * Zoom options
 */
export interface ZoomOptions {
    /** Minimum zoom level */
    min?: number;
    /** Maximum zoom level */
    max?: number;
    /** Zoom step */
    step?: number;
    /** Default zoom level */
    default?: number;
}
/**
 * Props for the DataTable component
 */
export interface DataTableProps<TData, TValue = unknown> {
    /** Column definitions */
    columns: ColumnDef<TData, TValue>[];
    /** Table data */
    data: TData[];
    /** Feature configuration */
    features?: DataTableFeatures;
    /** Pagination options */
    paginationOptions?: PaginationOptions;
    /** Zoom options */
    zoomOptions?: ZoomOptions;
    /** Loading state */
    isLoading?: boolean;
    /** Empty state message */
    emptyMessage?: string | React.ReactNode;
    /** Custom className for the table container */
    className?: string;
    /** Custom className for the table element */
    tableClassName?: string;
    /** Callback when row selection changes */
    onRowSelectionChange?: (selectedRows: TData[]) => void;
    /** Callback when column order changes */
    onColumnOrderChange?: (columnOrder: string[]) => void;
    /** Callback when sorting changes */
    onSortingChange?: (sorting: SortingState) => void;
    /** Callback when pagination changes */
    onPaginationChange?: (pagination: PaginationState) => void;
    /** Get row ID function */
    getRowId?: (row: TData) => string;
    /** Custom toolbar render */
    renderToolbar?: (table: TanStackTable<TData>) => React.ReactNode;
    /** Custom empty state render */
    renderEmpty?: () => React.ReactNode;
    /** Children to render inside toolbar */
    children?: React.ReactNode;
}
/**
 * Props for the DataTableToolbar component
 */
export interface DataTableToolbarProps<TData> {
    table: TanStackTable<TData>;
    features?: DataTableFeatures;
    zoomOptions?: ZoomOptions;
    children?: React.ReactNode;
}
/**
 * Props for the DataTablePagination component
 */
export interface DataTablePaginationProps<TData> {
    table: TanStackTable<TData>;
}
/**
 * Props for the DraggableColumnHeader component
 */
export interface DraggableColumnHeaderProps<TData, TValue> {
    header: any;
    children: React.ReactNode;
    className?: string;
}
/**
 * State for the DataTable
 */
export interface DataTableState {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    columnVisibility: VisibilityState;
    rowSelection: RowSelectionState;
    pagination: PaginationState;
    globalFilter: string;
    columnOrder: string[];
    zoom: number;
}
//# sourceMappingURL=DataTable.types.d.ts.map