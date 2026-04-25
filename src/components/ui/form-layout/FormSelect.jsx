import React from "react"
import { cn } from "../../../lib/utils"
import { ChevronDown } from "lucide-react"

/**
 * FormSelect — Styled native <select> with consistent design system look.
 * Use this for simple dropdowns that don't need search/filter.
 * For searchable dropdowns, use react-select with the rs-form className.
 *
 * Usage:
 *   <FormSelect
 *     value={selectedAccount?.value || ""}
 *     onChange={(e) => handleAccountChange(e.target.value)}
 *     placeholder="Select Account"
 *     options={[{ value: "1", label: "Acme Corp" }]}
 *     error={!!errors.account}
 *   />
 *
 *   // Or with children for full control:
 *   <FormSelect value={val} onChange={handleChange}>
 *     <option value="">Select...</option>
 *     <option value="a">Option A</option>
 *   </FormSelect>
 */
const FormSelect = React.forwardRef(
  ({ className, value, onChange, placeholder, options, disabled, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full appearance-none rounded-lg border bg-background px-3 py-2 pr-10 text-sm shadow-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive focus-visible:ring-destructive" : "border-input",
            !value && "text-muted-foreground",
            className
          )}
          {...props}
        >
          {children || (
            <>
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </>
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    )
  }
)

FormSelect.displayName = "FormSelect"

export { FormSelect }
