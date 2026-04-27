import React from "react";
import { cn } from "../lib/utils";
import { useSidebar } from "../components/ui/sidebar";

export function SidebarSection({ label, children, className }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {label && !isCollapsed && (
        <p className="mb-1 mt-0.5 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
          {label}
        </p>
      )}
      {isCollapsed && label && (
        <div className="mx-auto mb-1 h-px w-5 rounded bg-border/60" />
      )}
      {children}
    </div>
  );
}
