import React from "react"
import { cn } from "../../../lib/utils"
import { X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../sheet"

/**
 * FormDrawer — Right-side drawer for creating/editing forms (replaces MUI Drawer).
 * 
 * Usage:
 *   <FormDrawer open={open} onClose={onClose} title="New Task" description="Create a new task" width="lg">
 *     <FormSection>...</FormSection>
 *     <FormDrawerFooter>
 *       <Button variant="outline" onClick={onClose}>Cancel</Button>
 *       <Button onClick={handleSave}>Save</Button>
 *     </FormDrawerFooter>
 *   </FormDrawer>
 * 
 * Props:
 *   width — "sm" (400px) | "md" (500px) | "lg" (600px) | "xl" (800px) (default: "lg")
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
  children,
  ...props
}) => {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <SheetContent
        side="right"
        className={cn(
          "flex h-full w-full flex-col overflow-hidden p-0",
          widthMap[width] || widthMap.lg,
          className
        )}
        {...props}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <SheetHeader className="space-y-0.5">
            {title && <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>}
            {description && (
              <SheetDescription className="text-sm text-muted-foreground">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

FormDrawer.displayName = "FormDrawer"

/**
 * FormDrawerFooter — Sticky bottom action bar inside FormDrawer.
 */
const FormDrawerFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "sticky bottom-0 flex items-center gap-3 border-t border-border bg-white px-6 py-4",
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
