import React from "react"
import { cn } from "../../../lib/utils"

/**
 * FormRow — Side-by-side layout for form fields within a section.
 * 
 * Usage:
 *   <FormRow cols={2}>
 *     <FormField label="First Name"><Input /></FormField>
 *     <FormField label="Last Name"><Input /></FormField>
 *   </FormRow>
 * 
 *   <FormRow cols={3}>
 *     <FormField label="City"><Input /></FormField>
 *     <FormField label="State"><Input /></FormField>
 *     <FormField label="Zip"><Input /></FormField>
 *   </FormRow>
 */
const FormRow = ({ className, cols = 2, children, ...props }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div
      className={cn("grid gap-4", gridCols[cols] || gridCols[2], className)}
      {...props}
    >
      {children}
    </div>
  )
}

FormRow.displayName = "FormRow"

export { FormRow }
