import React from "react"
import { cn } from "../../../lib/utils"
import { Input } from "../input"
import { Button } from "../button"
import { Trash2 } from "lucide-react"

/**
 * FormComment — Repeatable comment field with delete action.
 * 
 * Usage:
 *   {comments.map((comment, index) => (
 *     <FormComment
 *       key={index}
 *       value={comment}
 *       onChange={(value) => handleCommentChange(index, value)}
 *       onDelete={() => deleteCommentField(index)}
 *       placeholder={`Comment ${index + 1}`}
 *     />
 *   ))}
 */
const FormComment = ({ className, value, onChange, onDelete, placeholder, ...props }) => {
  return (
    <div
      className={cn(
        "group flex items-start gap-2 rounded-lg border border-border bg-background p-3 transition-colors hover:border-input",
        className
      )}
      {...props}
    >
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="flex-1 resize-none border-0 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
      />
      {onDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

FormComment.displayName = "FormComment"

export { FormComment }
