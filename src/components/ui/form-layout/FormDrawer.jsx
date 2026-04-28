import React from "react"
import { cn } from "../../../lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../sheet"

/**
 * FormDrawer — Right-side drawer for creating/editing forms.
 * Full-screen on mobile, configurable width on desktop.
 *
 * Props:
 *   open        — Boolean controlling visibility
 *   onClose     — Called when drawer should close
 *   title       — Header title
 *   description — Optional subtitle
 *   width       — "sm" | "md" | "lg" | "xl" | "2xl" (default: "lg")
 *   footer      — React node rendered as sticky footer (alternative to FormDrawerFooter)
 *
 * Children are split: <FormDrawerFooter> is automatically extracted and placed outside scroll area.
 */
const widthMap = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[500px]",
  lg: "sm:max-w-[600px]",
  xl: "sm:max-w-[800px]",
  "2xl": "sm:max-w-[960px]",
}

const FormDrawer = ({
  className,
  open,
  onClose,
  title,
  description,
  width = "lg",
  footer,
  children,
  ...props
}) => {
  // Separate FormDrawerFooter from body children
  const childArray = React.Children.toArray(children)
  const footerChild = childArray.find(
    (child) => React.isValidElement(child) && child.type?.displayName === "FormDrawerFooter"
  )
  const bodyChildren = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type?.displayName === "FormDrawerFooter")
  )

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className={cn(
          "flex h-full w-full flex-col p-0",
          widthMap[width] || widthMap.lg,
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <SheetHeader className="space-y-0.5">
            {title && (
              <SheetTitle className="text-base font-semibold sm:text-lg">
                {title}
              </SheetTitle>
            )}
            {description && (
              <SheetDescription className="text-sm text-muted-foreground">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 sm:px-6 sm:py-5">
          <div className="space-y-5 sm:space-y-6">{bodyChildren}</div>
        </div>

        {/* Footer — either extracted child or footer prop */}
        {footerChild || footer}
      </SheetContent>
    </Sheet>
  )
}

FormDrawer.displayName = "FormDrawer"

/**
 * FormDrawerFooter — Sticky bottom action bar inside FormDrawer.
 * Automatically extracted from children and placed below the scroll area.
 */
const FormDrawerFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-between gap-2 border-t border-border bg-background px-4 py-3 sm:gap-3 sm:px-6 sm:py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

FormDrawerFooter.displayName = "FormDrawerFooter"

export { FormDrawer, FormDrawerFooter }
