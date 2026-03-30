import React from "react"
import { cn } from "../../../lib/utils"

/**
 * FormGrid — Responsive two-column layout for full-page forms (main + sidebar).
 *
 * Props:
 *   sidebarWidth — "sm" (320px) | "md" (380px) | "lg" (420px) (default: "md")
 *
 * On mobile: single column, sidebar stacks below main.
 * On desktop (lg+): main content + sidebar side by side.
 */
const sidebarWidthMap = {
  sm: "lg:grid-cols-[1fr_320px]",
  md: "lg:grid-cols-[1fr_380px]",
  lg: "lg:grid-cols-[1fr_420px]",
}

const FormGrid = ({ className, sidebarWidth = "md", children, ...props }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6",
        sidebarWidthMap[sidebarWidth] || sidebarWidthMap.md,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const FormGridMain = ({ className, children, ...props }) => {
  return (
    <div className={cn("space-y-4 sm:space-y-6", className)} {...props}>
      {children}
    </div>
  )
}

const FormGridSidebar = ({ className, children, ...props }) => {
  return (
    <div className={cn("space-y-4 sm:space-y-6", className)} {...props}>
      {children}
    </div>
  )
}

FormGrid.displayName = "FormGrid"
FormGridMain.displayName = "FormGrid.Main"
FormGridSidebar.displayName = "FormGrid.Sidebar"

FormGrid.Main = FormGridMain
FormGrid.Sidebar = FormGridSidebar

export { FormGrid }
