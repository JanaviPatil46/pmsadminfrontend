import React from "react"
import { cn } from "../../../lib/utils"
import { Label } from "../label"

/**
 * FormField — Wraps a form control with label, help text, and error message.
 * 
 * Usage:
 *   <FormField label="Template Name" required error="Name is required" hint="Max 100 characters">
 *     <Input placeholder="Enter template name" />
 *   </FormField>
 */
const FormField = ({
  className,
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  horizontal,
  ...props
}) => {
  return (
    <div
      className={cn(
        horizontal ? "grid grid-cols-[140px_1fr] items-start gap-4" : "space-y-2",
        className
      )}
      {...props}
    >
      {label && (
        <Label
          htmlFor={htmlFor}
          className={cn(
            "text-sm font-medium text-foreground",
            horizontal && "pt-2.5"
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      <div className="space-y-1.5">
        {children}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    </div>
  )
}

FormField.displayName = "FormField"

export { FormField }
