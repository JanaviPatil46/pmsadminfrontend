import React from "react"
import { cn } from "../../../lib/utils"

/**
 * FormPage — Full-page form wrapper with consistent padding, max-width, and background.
 * 
 * Usage:
 *   <FormPage title="Edit Job Template" subtitle="Update your template settings" actions={<Button>Save</Button>}>
 *     <FormSection>...</FormSection>
 *   </FormPage>
 */
const FormPage = ({ className, title, subtitle, actions, children, ...props }) => {
  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-3">{actions}</div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-6">
        {children}
      </div>
    </div>
  )
}

FormPage.displayName = "FormPage"

export { FormPage }
