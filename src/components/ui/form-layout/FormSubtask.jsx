import React from "react"
import { cn } from "../../../lib/utils"
import { Input } from "../input"
import { Checkbox } from "../checkbox"
import { Button } from "../button"
import { Trash2, GripVertical, PlusCircle } from "lucide-react"

/**
 * FormSubtaskItem — Single subtask row with checkbox, input, delete, and drag handle.
 *
 * Usage inside a Draggable:
 *   <FormSubtaskItem
 *     text={subtask.text}
 *     checked={subtask.checked}
 *     onTextChange={(val) => handleInputChange(subtask.id, val)}
 *     onCheckedChange={() => handleCheckboxChange(subtask.id)}
 *     onDelete={() => handleDeleteSubtask(subtask.id)}
 *     dragHandleProps={provided.dragHandleProps}
 *   />
 */
const FormSubtaskItem = ({
  className,
  text,
  checked,
  onTextChange,
  onCheckedChange,
  onDelete,
  dragHandleProps,
  disabled,
  ...props
}) => {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 transition-all hover:border-input hover:shadow-sm",
        checked && "bg-muted/50 opacity-70",
        className
      )}
      {...props}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
      <Input
        value={text}
        onChange={(e) => onTextChange?.(e.target.value)}
        placeholder="Things to do..."
        disabled={disabled || checked}
        className={cn(
          "h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
          checked && "line-through text-muted-foreground"
        )}
      />
      {onDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

/**
 * FormSubtaskAdd — "Add subtask" button.
 */
const FormSubtaskAdd = ({ className, onClick, label = "Add Subtask", ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-primary transition-colors hover:border-primary hover:bg-primary-50",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <PlusCircle className="h-4 w-4" />
      {label}
    </button>
  )
}

FormSubtaskItem.displayName = "FormSubtaskItem"
FormSubtaskAdd.displayName = "FormSubtaskAdd"

export { FormSubtaskItem, FormSubtaskAdd }
