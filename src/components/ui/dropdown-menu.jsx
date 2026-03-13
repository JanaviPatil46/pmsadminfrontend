import React, { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

const DropdownMenu = ({ children, open, onOpenChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { open, onOpenChange })
      )}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, open, onOpenChange }) => {
  return (
    <div onClick={() => onOpenChange && onOpenChange(!open)}>
      {children}
    </div>
  )
}

const DropdownMenuContent = ({ children, open, onOpenChange, className, align = "end" }) => {
  const ref = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOpenChange && onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full mt-1 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50",
        align === "end" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DropdownMenuLabel = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const DropdownMenuSeparator = ({ className, ...props }) => {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
