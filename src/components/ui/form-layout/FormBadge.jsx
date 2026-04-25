import React from "react"
import { cn } from "../../../lib/utils"
import { X } from "lucide-react"

/**
 * FormBadge — Small chip/badge for tags, assignees, selected items.
 *
 * Usage:
 *   <FormBadge color="#4CAF50" onRemove={() => removeTag(id)}>
 *     Marketing
 *   </FormBadge>
 *
 * Variants:
 *   - "default" — muted background
 *   - "outline" — bordered
 *   - "colored" — uses the color prop as background
 */
const FormBadge = ({
  className,
  children,
  color,
  variant = "default",
  onRemove,
  ...props
}) => {
  const variantClasses = {
    default: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-background text-foreground",
    colored: "",
  }

  const colorStyle =
    variant === "colored" && color
      ? { backgroundColor: color, color: "#fff" }
      : {}

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantClasses[variant],
        className
      )}
      style={colorStyle}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}

FormBadge.displayName = "FormBadge"

export { FormBadge }
