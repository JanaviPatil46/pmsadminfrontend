import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./sheet";
import { Button } from "./button";

const sizeMap = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-2xl",
};

export function SideSheet({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  children,
  footer,
  onCancel,
  onConfirm,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  hideDefaultFooter = false,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className={cn(
          "p-0 flex flex-col border-l border-border/40 shadow-lg bg-background [&>button]:hidden",
          sizeMap[size] ?? sizeMap.md
        )}
      >
        <div className="flex flex-1 min-h-0 flex-col">
          {/* Header */}
          <SheetHeader className="flex-row items-center justify-between px-5 py-4 border-b border-border/40 space-y-0 shrink-0">
            <div className="flex flex-col gap-0.5">
              <SheetTitle className="text-base font-semibold text-foreground leading-none">
                {title}
              </SheetTitle>
              {description && (
                <SheetDescription className="text-xs text-muted-foreground">
                  {description}
                </SheetDescription>
              )}
            </div>
            <button
              onClick={() => onOpenChange?.(false)}
              className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </SheetHeader>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
            {children}
          </div>

          {/* Footer */}
          {(!hideDefaultFooter || footer) && (
            <SheetFooter className="border-t border-border/40 px-5 py-3.5 bg-muted/20 shrink-0">
              <div className="flex items-center justify-end gap-2 w-full">
                {/* <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel ?? (() => onOpenChange?.(false))}
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button> */}
                {onConfirm && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving…" : confirmLabel}
                  </Button>
                )}
                {footer}
              </div>
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
