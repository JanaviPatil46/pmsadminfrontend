import React from "react"
import { cn } from "../../../lib/utils"
import { ChevronDown } from "lucide-react"

/**
 * FormSection — Card-based section that groups related form fields.
 *
 * Props:
 *   title       — Section heading
 *   description — Optional subtitle
 *   icon        — React node (e.g., lucide icon) shown before title
 *   collapsible — Allow section to collapse/expand
 *   defaultOpen — Initial open state when collapsible (default: true)
 *   flat        — No border/shadow (for nesting inside other sections)
 */
const FormSection = ({
  className,
  title,
  description,
  icon,
  collapsible,
  defaultOpen = true,
  flat,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div
      className={cn(
        "form-section-enter",
        !flat && "rounded-xl border border-border bg-card shadow-section transition-shadow hover:shadow-card-hover",
        flat && "bg-transparent",
        className
      )}
      {...props}
    >
      {/* Section Header */}
      {(title || description) && (
        <div
          className={cn(
            "flex items-start justify-between px-4 py-3 sm:px-6 sm:py-4",
            !flat && "border-b border-border",
            collapsible && "cursor-pointer select-none"
          )}
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
          role={collapsible ? "button" : undefined}
          aria-expanded={collapsible ? isOpen : undefined}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {icon && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-9 sm:w-9">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          {collapsible && (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                !isOpen && "-rotate-90"
              )}
            />
          )}
        </div>
      )}

      {/* Section Content */}
      {(!collapsible || isOpen) && (
        flat ? (
          <div className="space-y-4 sm:space-y-5">{children}</div>
        ) : (
          <div className={cn("p-4 sm:p-6", !title && !description && "pt-4 sm:pt-6")}>
            <div className="space-y-4 sm:space-y-5">{children}</div>
          </div>
        )
      )}
    </div>
  )
}

FormSection.displayName = "FormSection"

export { FormSection }
