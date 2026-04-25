import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {

    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
      default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      success: "bg-success text-success-foreground shadow-sm hover:bg-success/90",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
