import type { DataTableProps } from "./DataTable.types";
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
declare function DataTable<TData, TValue>({ columns, data, features, paginationOptions, zoomOptions, isLoading, emptyMessage, className, tableClassName, onRowSelectionChange, onColumnOrderChange, onSortingChange, onPaginationChange, getRowId, renderToolbar, renderEmpty, children, }: DataTableProps<TData, TValue>): import("react/jsx-runtime").JSX.Element;
declare namespace DataTable {
    var displayName: string;
}
export { DataTable };
//# sourceMappingURL=DataTable.d.ts.map