import React from "react"
import { cn } from "../../../lib/utils"

/**
 * FormSection — Card-based section that groups related form fields.
 * 
 * Usage:
 *   <FormSection title="General Info" description="Basic template details">
 *     <FormField label="Name"><Input /></FormField>
 *   </FormSection>
 */
const FormSection = ({ className, title, description, icon, collapsible, children, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {/* Section Header */}
      {(title || description) && (
        <div
          className={cn(
            "flex items-start justify-between border-b border-border px-6 py-4",
            collapsible && "cursor-pointer select-none"
          )}
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {collapsible && (
            <svg
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                !isOpen && "-rotate-90"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      )}

      {/* Section Content */}
      {(!collapsible || isOpen) && (
        <div className="p-6">
          <div className="space-y-5">{children}</div>
        </div>
      )}
    </div>
  )
}

FormSection.displayName = "FormSection"

export { FormSection }
