import React from "react"
import { cn } from "../../../lib/utils"

/**
 * FormDivider — Lightweight horizontal rule or labeled divider inside form sections.
 * 
 * Usage:
 *   <FormDivider />
 *   <FormDivider label="Advanced Settings" />
 */
const FormDivider = ({ className, label, ...props }) => {
  if (label) {
    return (
      <div className={cn("relative py-2", className)} {...props}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-background pr-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn("border-t border-border", className)}
      {...props}
    />
  )
}

FormDivider.displayName = "FormDivider"

export { FormDivider }
