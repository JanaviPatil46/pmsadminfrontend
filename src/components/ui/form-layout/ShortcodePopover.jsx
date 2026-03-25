import React, { useState } from "react"
import { cn } from "../../../lib/utils"
import { Button } from "../button"
import { Input } from "../input"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { ScrollArea } from "../scroll-area"
import { Code, Search } from "lucide-react"

/**
 * ShortcodePopover — Reusable shortcode picker used across Job, Email, Chat templates.
 * 
 * Usage:
 *   <ShortcodePopover
 *     shortcuts={filteredShortcuts}
 *     onSelect={(shortcut) => handleAddShortcut(shortcut.value)}
 *   />
 */
const ShortcodePopover = ({ shortcuts = [], onSelect, label = "Add Shortcode", className }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = shortcuts.filter(
    (s) => s.title?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (shortcut) => {
    onSelect?.(shortcut)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("gap-1.5 text-xs", className)}
        >
          <Code className="h-3.5 w-3.5" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        {/* Search */}
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search shortcodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {/* List */}
        <ScrollArea className="h-64">
          <div className="p-1">
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                No shortcodes found
              </p>
            )}
            {filtered.map((shortcut, index) => (
              <div key={index}>
                {shortcut.isBold ? (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {shortcut.title}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="flex w-full items-center rounded-md px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                    onClick={() => handleSelect(shortcut.value)}
                  >
                    {shortcut.title}
                  </button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

ShortcodePopover.displayName = "ShortcodePopover"

export { ShortcodePopover }
