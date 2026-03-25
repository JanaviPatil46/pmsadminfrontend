import React from "react"
import { cn } from "../../../lib/utils"

/**
 * FormActions — Sticky or inline action bar for Save / Cancel / Next buttons.
 * 
 * Usage:
 *   <FormActions sticky>
 *     <Button variant="outline" onClick={handleCancel}>Cancel</Button>
 *     <Button onClick={handleSave}>Save & Exit</Button>
 *   </FormActions>
 * 
 * Props:
 *   sticky — stick to bottom of viewport
 *   align — "left" | "right" | "between" (default: "right")
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
        "flex items-center gap-3 py-4",
        alignClasses[align],
        sticky && "sticky bottom-0 z-10 -mx-6 border-t border-border bg-white/90 px-6 backdrop-blur-sm",
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
