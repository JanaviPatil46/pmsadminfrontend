import React, { useRef, useState, useEffect } from "react";
import { Search, Eye, X, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export function DataTableToolbar({
  globalFilter = "",
  onGlobalFilterChange,
  filterButtons,
  filterContent,
  columnVisibility,
  onColumnVisibilityToggle,
  columnLabels = {},
  actionLabel = "New",
  onAction,
  bulkActions,
  selectedCount = 0,
  children,
}) {
  const [visOpen, setVisOpen] = useState(false);
  const visRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (visRef.current && !visRef.current.contains(e.target)) setVisOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 mb-3">
      {/* Main toolbar row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange?.(e.target.value)}
            placeholder="Search…"
            className="w-full h-8 pl-8 pr-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow"
          />
          {globalFilter && (
            <button
              onClick={() => onGlobalFilterChange?.("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Inline filter toggle buttons */}
        {filterButtons && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterButtons}
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Column visibility */}
          {columnVisibility && onColumnVisibilityToggle && (
            <div className="relative" ref={visRef}>
              <button
                onClick={() => setVisOpen((o) => !o)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg border transition-colors",
                  visOpen
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              {visOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 w-48 rounded-xl border border-border bg-background shadow-lg py-1">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Columns
                  </p>
                  {Object.entries(columnVisibility).map(([key, visible]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={visible}
                        onChange={() => onColumnVisibilityToggle(key)}
                        className="rounded border-border accent-primary h-3.5 w-3.5"
                      />
                      {columnLabels[key] || key}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Primary action */}
          {onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedCount > 0 && bulkActions && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 border border-border/60 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            {selectedCount} selected
          </span>
          <div className="h-3.5 w-px bg-border/60 shrink-0" />
          {bulkActions}
        </div>
      )}

      {/* Extra slot (filter chips, etc.) */}
      {children}
    </div>
  );
}
