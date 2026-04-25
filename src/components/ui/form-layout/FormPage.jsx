import React from "react"
import { cn } from "../../../lib/utils"
import { ArrowLeft } from "lucide-react"

/**
 * FormPage — Full-page form wrapper with sticky header, responsive padding, and max-width.
 *
 * Props:
 *   title      — Page heading
 *   subtitle   — Optional description under heading
 *   actions    — React node rendered in the header (buttons)
 *   onBack     — If provided, renders a back arrow button
 *   maxWidth   — "md" | "lg" | "xl" | "2xl" | "full" (default: "xl")
 *   noPadding  — Remove default content padding (for custom layouts)
 */
const maxWidthMap = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
}

const FormPage = ({
  className,
  title,
  subtitle,
  actions,
  onBack,
  maxWidth = "xl",
  noPadding,
  children,
  ...props
}) => {
  const mw = maxWidthMap[maxWidth] || maxWidthMap.xl

  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className={cn("mx-auto px-4 py-3 sm:px-6 sm:py-4", mw)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="min-w-0">
                {title && (
                  <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "mx-auto",
          !noPadding && "px-4 py-4 sm:px-6 sm:py-6",
          mw
        )}
      >
        {children}
      </div>
    </div>
  )
}

FormPage.displayName = "FormPage"

export { FormPage }
