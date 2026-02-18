import * as React from "react"
import { cn } from "../../lib/utils"

 export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-white text-black shadow-sm",
      className
    )}
    {...props}
  />
))
export function CardContent({ className, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props} />
  )
}
// Card.displayName = "Card"


