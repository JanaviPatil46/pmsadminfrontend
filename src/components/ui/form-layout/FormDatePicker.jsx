import React from "react"
import { cn } from "../../../lib/utils"
import { Label } from "../label"
import { Calendar } from "lucide-react"

/**
 * FormDatePicker — Styled date input that replaces MUI DatePicker.
 * Uses native HTML date input with consistent design system styling.
 *
 * Usage:
 *   <FormDatePicker
 *     value={startDate}
 *     onChange={(date) => setStartDate(date)}
 *     placeholder="MM/DD/YYYY"
 *   />
 *
 * For dayjs integration:
 *   <FormDatePicker
 *     value={StartsDateNew ? StartsDateNew.format("YYYY-MM-DD") : ""}
 *     onChange={(date) => setStartsDateNew(dayjs(date))}
 *   />
 */
const FormDatePicker = React.forwardRef(
  ({ className, value, onChange, placeholder, disabled, error, ...props }, ref) => {
    const handleChange = (e) => {
      onChange?.(e.target.value)
    }

    return (
      <div className="relative">
        <input
          ref={ref}
          type="date"
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-background px-3 py-2 pr-10 text-sm shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
            error ? "border-destructive focus-visible:ring-destructive" : "border-input",
            className
          )}
          {...props}
        />
        <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    )
  }
)

FormDatePicker.displayName = "FormDatePicker"

export { FormDatePicker }
