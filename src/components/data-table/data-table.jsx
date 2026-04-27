import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "../ui/checkbox";

const SortIcon = ({ column }) => {
  const sorted = column.getIsSorted();
  if (sorted === "asc") return <ArrowUp className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  if (sorted === "desc") return <ArrowDown className="ml-1.5 h-3.5 w-3.5 shrink-0" />;
  return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" />;
};

const EmptyState = ({ message = "No results found", description }) => (
  <tr>
    <td colSpan={9999}>
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">{message}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </td>
  </tr>
);

const SkeletonRows = ({ columns, rows = 8 }) =>
  Array.from({ length: rows }).map((_, i) => (
    <tr key={i} className="border-b border-border/40">
      {columns.map((col, j) => (
        <td key={j} className="px-3 py-2.5">
          <Skeleton className={cn("h-4 rounded", j === 0 ? "w-8" : j === 1 ? "w-36" : "w-24")} />
        </td>
      ))}
    </tr>
  ));

export function DataTable({
  columns,
  data,
  loading = false,
  globalFilter,
  onGlobalFilterChange,
  enableRowSelection = true,
  onRowSelectionChange,
  pageSize = 25,
  emptyMessage = "No results found",
  emptyDescription,
  getRowId,
}) {
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const selectionColumn = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
        aria-label="Select all"
        className="translate-y-px"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
        aria-label="Select row"
        className="translate-y-px"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };

  const tableColumns = enableRowSelection
    ? [selectionColumn, ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      globalFilter,
      pagination,
    },
    getRowId,
    enableRowSelection,
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
      if (onRowSelectionChange) {
        const next = typeof updater === "function" ? updater(rowSelection) : updater;
        onRowSelectionChange(next);
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;

  return (
    <div className="flex flex-col gap-0 rounded-xl border border-border/60 bg-background overflow-hidden shadow-sm">
      {/* Selection bar */}
      {enableRowSelection && selectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border-b border-border/40 text-xs font-medium text-primary">
          <span>{selectedCount} row{selectedCount > 1 ? "s" : ""} selected</span>
          <button
            onClick={() => table.resetRowSelection()}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border/40 bg-muted/30">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const colSize = header.column.columnDef.size;
                  const isCompact = colSize !== undefined && colSize <= 100;
                  return (
                    <th
                      key={header.id}
                      style={isCompact ? { width: colSize, minWidth: colSize } : undefined}
                      className={cn(
                        "px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none whitespace-nowrap",
                        header.column.columnDef.meta?.align === "right" ? "text-right" : "text-left",
                        canSort && "group cursor-pointer hover:text-foreground transition-colors"
                      )}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <div className={cn(
                          "flex items-center",
                          header.column.columnDef.meta?.align === "right" && "justify-end"
                        )}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && <SortIcon column={header.column} />}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-border/30">
            {loading ? (
              <SkeletonRows columns={tableColumns} />
            ) : table.getRowModel().rows.length === 0 ? (
              <EmptyState message={emptyMessage} description={emptyDescription} />
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-selected={row.getIsSelected()}
                  className={cn(
                    "group transition-colors duration-100",
                    "hover:bg-muted/40",
                    row.getIsSelected() && "bg-primary/5 hover:bg-primary/8"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const colSize = cell.column.columnDef.size;
                    const isCompact = colSize !== undefined && colSize <= 100;
                    return (
                      <td
                        key={cell.id}
                        style={isCompact ? { width: colSize, minWidth: colSize } : undefined}
                        className={cn(
                          "px-3 py-2.5 align-middle",
                          isCompact && "whitespace-nowrap",
                          cell.column.columnDef.meta?.align === "right" && "text-right"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows per page</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-border rounded-md px-2 py-1 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {[10, 25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="mr-2">
            {table.getFilteredRowModel().rows.length === 0
              ? "0 results"
              : `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–${Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )} of ${table.getFilteredRowModel().rows.length}`}
          </span>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded-md hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 rounded-md hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-1 font-medium text-foreground">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded-md hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1 rounded-md hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { useReactTable };
