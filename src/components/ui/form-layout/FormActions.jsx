import React from "react"
import { cn } from "../../../lib/utils"

/**
 * FormActions — Sticky or inline action bar for Save / Cancel / Next buttons.
 *
 * Props:
 *   sticky — Stick to bottom of viewport with blur background
 *   align  — "left" | "right" | "between" | "center" (default: "right")
 */
const FormActions = ({ className, sticky, align = "right", children, ...props }) => {
  const alignClasses = {
    left: "justify-start",
    right: "justify-end",
    between: "justify-between",
    center: "justify-center",
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 py-3 sm:gap-3 sm:py-4",
        alignClasses[align],
        sticky && "sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/90 px-4 shadow-sticky backdrop-blur-sm sm:-mx-6 sm:px-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

FormActions.displayName = "FormActions"

export { FormActions }
