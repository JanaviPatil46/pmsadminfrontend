import React from "react"
import { cn } from "../../../lib/utils"
import { Switch } from "../switch"
import { Label } from "../label"

/**
 * FormSwitchRow — Inline switch with label, used for toggles like "Absolute Date", "Show in Client Portal".
 * 
 * Usage:
 *   <FormSwitchRow
 *     label="Absolute Date"
 *     description="Use fixed dates instead of relative"
 *     checked={absoluteDate}
 *     onCheckedChange={setAbsoluteDate}
 *   />
 */
const FormSwitchRow = ({
  className,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  reverse,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40",
        disabled && "opacity-50 pointer-events-none",
        reverse && "flex-row-reverse",
        className
      )}
      {...props}
    >
      <div className="space-y-0.5">
        {label && (
          <Label className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </Label>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  )
}

FormSwitchRow.displayName = "FormSwitchRow"

export { FormSwitchRow }
