import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"

export function Select({ value, onValueChange, children }) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
    >
      {children}
    </SelectPrimitive.Root>
  )
}

export function SelectTrigger({ className = "", children }) {
  return (
    <SelectPrimitive.Trigger
      className={`
        flex h-11 w-full items-center justify-between
        rounded-md border border-input bg-background px-3 py-2
        text-sm
        focus:outline-none focus:ring-2 focus:ring-primary
        ${className}
      `}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Trigger>
  )
}

export function SelectValue({ placeholder }) {
  return (
    <SelectPrimitive.Value placeholder={placeholder} />
  )
}

export function SelectContent({ children }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className="
          z-50 min-w-[var(--radix-select-trigger-width)]
          overflow-hidden rounded-md border bg-popover shadow-md
          animate-in fade-in zoom-in-95
        "
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export function SelectItem({ value, children }) {
  return (
    <SelectPrimitive.Item
      value={value}
      className="
        relative flex w-full cursor-pointer select-none
        items-center rounded-sm py-2 pl-8 pr-2 text-sm
        hover:bg-accent hover:text-accent-foreground
      "
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}
