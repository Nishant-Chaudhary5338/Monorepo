"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, } from "../Table/Table";
// Icons for UI elements
function ChevronUpIcon() {
    return (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "m18 15-6-6-6 6" }) }));
}
function ChevronDownIcon() {
    return (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
}
function ChevronsUpDownIcon() {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "m7 15 5 5 5-5" }), _jsx("path", { d: "m7 9 5-5 5 5" })] }));
}
function GripVerticalIcon() {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "9", cy: "12", r: "1" }), _jsx("circle", { cx: "9", cy: "5", r: "1" }), _jsx("circle", { cx: "9", cy: "19", r: "1" }), _jsx("circle", { cx: "15", cy: "12", r: "1" }), _jsx("circle", { cx: "15", cy: "5", r: "1" }), _jsx("circle", { cx: "15", cy: "19", r: "1" })] }));
}
function ZoomInIcon() {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.3-4.3" }), _jsx("path", { d: "M11 8v6" }), _jsx("path", { d: "M8 11h6" })] }));
}
function ZoomOutIcon() {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.3-4.3" }), _jsx("path", { d: "M8 11h6" })] }));
}
function DownloadIcon() {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsx("polyline", { points: "7 10 12 15 17 10" }), _jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })] }));
}
function SearchIcon() {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.3-4.3" })] }));
}
// Draggable column header component
function DraggableColumnHeader(_a) {
    var header = _a.header, children = _a.children, className = _a.className;
    var _b = useSortable({
        id: header.column.id,
    }), attributes = _b.attributes, listeners = _b.listeners, setNodeRef = _b.setNodeRef, transform = _b.transform, transition = _b.transition, isDragging = _b.isDragging;
    var style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 100 : 0,
    };
    return (_jsx(TableHead, __assign({ ref: setNodeRef, style: style, className: cn("relative select-none", className) }, attributes, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", __assign({ className: "cursor-grab touch-none active:cursor-grabbing" }, listeners, { children: _jsx(GripVerticalIcon, {}) })), children] }) })));
}
// Regular column header with sort
function SortableColumnHeader(_a) {
    var header = _a.header, children = _a.children, canSort = _a.canSort;
    if (!canSort) {
        return _jsx(TableHead, { children: children });
    }
    return (_jsx(TableHead, { children: _jsxs("button", { className: "flex items-center gap-2 hover:text-foreground", onClick: header.column.getToggleSortingHandler(), children: [children, header.column.getIsSorted() === "asc" ? (_jsx(ChevronUpIcon, {})) : header.column.getIsSorted() === "desc" ? (_jsx(ChevronDownIcon, {})) : (_jsx(ChevronsUpDownIcon, {}))] }) }));
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
function DataTable(_a) {
    var columns = _a.columns, data = _a.data, _b = _a.features, features = _b === void 0 ? {} : _b, paginationOptions = _a.paginationOptions, zoomOptions = _a.zoomOptions, _c = _a.isLoading, isLoading = _c === void 0 ? false : _c, _d = _a.emptyMessage, emptyMessage = _d === void 0 ? "No results." : _d, className = _a.className, tableClassName = _a.tableClassName, onRowSelectionChange = _a.onRowSelectionChange, onColumnOrderChange = _a.onColumnOrderChange, onSortingChange = _a.onSortingChange, onPaginationChange = _a.onPaginationChange, getRowId = _a.getRowId, renderToolbar = _a.renderToolbar, renderEmpty = _a.renderEmpty, children = _a.children;
    // Default features
    var _e = features.sorting, enableSorting = _e === void 0 ? false : _e, _f = features.filtering, enableFiltering = _f === void 0 ? false : _f, _g = features.globalFilter, enableGlobalFilter = _g === void 0 ? false : _g, _h = features.pagination, enablePagination = _h === void 0 ? false : _h, _j = features.columnVisibility, enableColumnVisibility = _j === void 0 ? false : _j, _k = features.rowSelection, enableRowSelection = _k === void 0 ? false : _k, _l = features.draggableColumns, enableDraggableColumns = _l === void 0 ? false : _l, _m = features.columnResizing, enableColumnResizing = _m === void 0 ? false : _m, _o = features.zoom, enableZoom = _o === void 0 ? false : _o, _p = features.exportCsv, enableExportCsv = _p === void 0 ? false : _p, _q = features.striped, striped = _q === void 0 ? false : _q, _r = features.hoverable, hoverable = _r === void 0 ? true : _r, _s = features.compact, compact = _s === void 0 ? false : _s;
    // Zoom settings
    var _t = zoomOptions || {}, _u = _t.min, zoomMin = _u === void 0 ? 50 : _u, _v = _t.max, zoomMax = _v === void 0 ? 150 : _v, _w = _t.step, zoomStep = _w === void 0 ? 10 : _w, _x = _t.default, zoomDefault = _x === void 0 ? 100 : _x;
    // Pagination settings
    var _y = paginationOptions || {}, _z = _y.pageSize, defaultPageSize = _z === void 0 ? 10 : _z, _0 = _y.pageSizeOptions, pageSizeOptions = _0 === void 0 ? [10, 20, 30, 40, 50] : _0;
    // State
    var _1 = React.useState([]), sorting = _1[0], setSorting = _1[1];
    var _2 = React.useState([]), columnFilters = _2[0], setColumnFilters = _2[1];
    var _3 = React.useState({}), columnVisibility = _3[0], setColumnVisibility = _3[1];
    var _4 = React.useState({}), rowSelection = _4[0], setRowSelection = _4[1];
    var _5 = React.useState(""), globalFilter = _5[0], setGlobalFilter = _5[1];
    var _6 = React.useState(columns.map(function (c) { return c.accessorKey || c.id || ""; })), columnOrder = _6[0], setColumnOrder = _6[1];
    var _7 = React.useState({
        pageIndex: 0,
        pageSize: defaultPageSize,
    }), pagination = _7[0], setPagination = _7[1];
    var _8 = React.useState(zoomDefault), zoom = _8[0], setZoom = _8[1];
    // DnD sensors
    var sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    // Table instance
    var table = useReactTable({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
        getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
        onSortingChange: function (updater) {
            var newSorting = typeof updater === "function" ? updater(sorting) : updater;
            setSorting(newSorting);
            onSortingChange === null || onSortingChange === void 0 ? void 0 : onSortingChange(newSorting);
        },
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: function (updater) {
            var newRowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
            setRowSelection(newRowSelection);
            if (onRowSelectionChange) {
                var selectedRows = Object.keys(newRowSelection)
                    .filter(function (key) { return newRowSelection[key]; })
                    .map(function (key) { return data[parseInt(key)]; })
                    .filter(Boolean);
                onRowSelectionChange(selectedRows);
            }
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnOrderChange: setColumnOrder,
        onPaginationChange: function (updater) {
            var newPagination = typeof updater === "function" ? updater(pagination) : updater;
            setPagination(newPagination);
            onPaginationChange === null || onPaginationChange === void 0 ? void 0 : onPaginationChange(newPagination);
        },
        state: {
            sorting: sorting,
            columnFilters: columnFilters,
            columnVisibility: columnVisibility,
            rowSelection: rowSelection,
            globalFilter: globalFilter,
            columnOrder: columnOrder,
            pagination: pagination,
        },
        enableSorting: enableSorting,
        enableColumnFilters: enableFiltering,
        enableGlobalFilter: enableGlobalFilter,
        enableRowSelection: !!enableRowSelection,
        enableMultiRowSelection: enableRowSelection !== "single",
        enableColumnResizing: enableColumnResizing,
        columnResizeMode: "onChange",
        getRowId: getRowId,
        manualPagination: false,
    });
    // Handle drag end for columns
    var handleDragEnd = function (event) {
        var active = event.active, over = event.over;
        if (active && over && active.id !== over.id) {
            setColumnOrder(function (prev) {
                var oldIndex = prev.indexOf(active.id);
                var newIndex = prev.indexOf(over.id);
                var newOrder = arrayMove(prev, oldIndex, newIndex);
                onColumnOrderChange === null || onColumnOrderChange === void 0 ? void 0 : onColumnOrderChange(newOrder);
                return newOrder;
            });
        }
    };
    // Export to CSV
    var exportToCsv = function () {
        var headers = table.getAllLeafColumns().map(function (col) { return col.id; });
        var rows = table.getFilteredRowModel().rows.map(function (row) {
            return headers.map(function (header) {
                var value = row.getValue(header);
                // Handle values that might contain commas or quotes
                var stringValue = String(value !== null && value !== void 0 ? value : "");
                if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
                    return "\"".concat(stringValue.replace(/"/g, '""'), "\"");
                }
                return stringValue;
            });
        });
        var csv = __spreadArray([headers.join(",")], rows.map(function (row) { return row.join(","); }), true).join("\n");
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "table-export.csv";
        link.click();
        URL.revokeObjectURL(link.href);
    };
    // Zoom controls
    var handleZoomIn = function () { return setZoom(function (prev) { return Math.min(prev + zoomStep, zoomMax); }); };
    var handleZoomOut = function () { return setZoom(function (prev) { return Math.max(prev - zoomStep, zoomMin); }); };
    // Render header
    var renderHeader = function () {
        return table.getHeaderGroups().map(function (headerGroup) { return (_jsx(TableRow, { children: enableDraggableColumns ? (_jsx(SortableContext, { items: columnOrder, strategy: horizontalListSortingStrategy, children: headerGroup.headers.map(function (header) { return (_jsx(DraggableColumnHeader, { header: header, children: header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext()) }, header.id)); }) })) : (headerGroup.headers.map(function (header) { return (_jsx(SortableColumnHeader, { header: header, canSort: enableSorting && header.column.getCanSort(), children: header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext()) }, header.id)); })) }, headerGroup.id)); });
    };
    // Render body
    var renderBody = function () {
        if (isLoading) {
            return (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: _jsxs("div", { className: "flex items-center justify-center", children: [_jsx("div", { className: "w-6 h-6 border-2 rounded-full animate-spin border-primary border-t-transparent" }), _jsx("span", { className: "ml-2", children: "Loading..." })] }) }) }));
        }
        if (table.getRowModel().rows.length === 0) {
            return (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: renderEmpty ? renderEmpty() : emptyMessage }) }));
        }
        return table.getRowModel().rows.map(function (row) { return (_jsx(TableRow, { "data-state": row.getIsSelected() && "selected", className: cn(striped && row.index % 2 === 0 && "bg-muted/50", hoverable && "hover:bg-muted/50"), children: row.getVisibleCells().map(function (cell) { return (_jsx(TableCell, { className: cn(compact && "py-2 px-3"), style: enableColumnResizing
                    ? { width: cell.column.getSize() }
                    : undefined, children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id)); }) }, row.id)); });
    };
    // DnD wrapper for draggable columns
    var tableContent = (_jsxs("div", { className: cn("w-full", className), style: enableZoom ? { fontSize: "".concat(zoom, "%") } : undefined, children: [_jsxs("div", { className: "flex items-center justify-between gap-4 py-4", children: [_jsx("div", { className: "flex items-center gap-2", children: enableGlobalFilter && (_jsxs("div", { className: "relative", children: [_jsx(SearchIcon, {}), _jsx(Input, { placeholder: "Search...", value: globalFilter, onChange: function (e) { return setGlobalFilter(e.target.value); }, className: "max-w-sm pl-8" })] })) }), _jsxs("div", { className: "flex items-center gap-2", children: [enableZoom && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "outline", size: "icon", onClick: handleZoomOut, disabled: zoom <= zoomMin, children: _jsx(ZoomOutIcon, {}) }), _jsxs("span", { className: "min-w-[3rem] text-center text-sm", children: [zoom, "%"] }), _jsx(Button, { variant: "outline", size: "icon", onClick: handleZoomIn, disabled: zoom >= zoomMax, children: _jsx(ZoomInIcon, {}) })] })), enableExportCsv && (_jsxs(Button, { variant: "outline", size: "sm", onClick: exportToCsv, children: [_jsx(DownloadIcon, {}), _jsx("span", { className: "ml-2", children: "Export CSV" })] })), enableColumnVisibility && (_jsx("div", { className: "flex items-center gap-2", children: table.getAllLeafColumns().map(function (column) { return (_jsxs("label", { className: "flex items-center gap-1 text-sm", children: [_jsx("input", { type: "checkbox", checked: column.getIsVisible(), onChange: column.getToggleVisibilityHandler() }), column.id] }, column.id)); }) })), renderToolbar && renderToolbar(table), children] })] }), _jsx("div", { className: "border rounded-md", children: _jsxs(Table, { className: cn(tableClassName, enableColumnResizing && "table-fixed"), children: [_jsx(TableHeader, { children: renderHeader() }), _jsx(TableBody, { children: renderBody() })] }) }), enablePagination && (_jsxs("div", { className: "flex items-center justify-between py-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: [table.getFilteredSelectedRowModel().rows.length, " of", " ", table.getFilteredRowModel().rows.length, " row(s) selected."] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", children: "Rows per page" }), _jsx("select", { value: table.getState().pagination.pageSize, onChange: function (e) { return table.setPageSize(Number(e.target.value)); }, className: "h-8 px-2 text-sm border rounded-md border-input bg-background", children: pageSizeOptions.map(function (size) { return (_jsx("option", { value: size, children: size }, size)); }) })] }), _jsxs("div", { className: "text-sm", children: ["Page ", table.getState().pagination.pageIndex + 1, " of", " ", table.getPageCount()] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: function () { return table.previousPage(); }, disabled: !table.getCanPreviousPage(), children: "Previous" }), _jsx(Button, { variant: "outline", size: "sm", onClick: function () { return table.nextPage(); }, disabled: !table.getCanNextPage(), children: "Next" })] })] })] }))] }));
    // Wrap with DnD context if draggable columns are enabled
    if (enableDraggableColumns) {
        return (_jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: tableContent }));
    }
    return tableContent;
}
DataTable.displayName = "DataTable";
export { DataTable };
