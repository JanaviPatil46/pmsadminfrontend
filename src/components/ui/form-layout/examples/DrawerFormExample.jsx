import React, { useState } from "react"
import {
  FormDrawer,
  FormDrawerFooter,
  FormSection,
  FormField,
  FormRow,
  FormSelect,
  FormDatePicker,
  FormSwitchRow,
  FormDivider,
  FormSubtaskItem,
  FormSubtaskAdd,
  FormBadge,
} from "../index"
import { Input } from "../../input"
import { Button } from "../../button"
import { Textarea } from "../../textarea"
import {
  FileText,
  Users,
  Calendar,
  ListChecks,
  Tag,
  ArrowLeft,
} from "lucide-react"

/**
 * DrawerFormExample — Demonstrates the drawer form pattern.
 *
 * This is a self-contained reference implementation showing how to build
 * a complete drawer form using the form layout system.
 * Copy and adapt this pattern for task creation, quick edits, etc.
 */
const DrawerFormExample = ({ open, onClose }) => {
  const [taskName, setTaskName] = useState("")
  const [description, setDescription] = useState("")
  const [account, setAccount] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [status, setStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [enableSubtasks, setEnableSubtasks] = useState(false)
  const [subtasks, setSubtasks] = useState([])
  const [tags, setTags] = useState([
    { id: "1", label: "Tax", color: "#3B82F6" },
    { id: "2", label: "Urgent", color: "#EF4444" },
  ])

  // Subtask handlers
  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      { id: String(Date.now()), text: "", checked: false },
    ])
  }

  const updateSubtask = (id, text) => {
    setSubtasks(subtasks.map((s) => (s.id === id ? { ...s, text } : s)))
  }

  const toggleSubtask = (id) => {
    setSubtasks(
      subtasks.map((s) =>
        s.id === id ? { ...s, checked: !s.checked } : s
      )
    )
  }

  const deleteSubtask = (id) => {
    setSubtasks(subtasks.filter((s) => s.id !== id))
  }

  const removeTag = (id) => {
    setTags(tags.filter((t) => t.id !== id))
  }

  const handleSubmit = () => {
    console.log("Task created:", {
      taskName,
      description,
      account,
      priority,
      status,
      startDate,
      dueDate,
      subtasks,
      tags: tags.map((t) => t.id),
    })
    onClose?.()
  }

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      title="Create Task"
      description="Add a new task to the workflow"
      width="lg"
    >
      {/* ── Source ── */}
      <FormSection title="Source" icon={<FileText className="h-4 w-4" />}>
        <FormField label="Account" required>
          <FormSelect
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Select Account"
            options={[
              { value: "acme", label: "Acme Corp" },
              { value: "globex", label: "Globex Industries" },
              { value: "initech", label: "Initech LLC" },
            ]}
          />
        </FormField>

        <FormField label="Task Name" required>
          <Input
            placeholder="e.g., Prepare Q4 tax filing"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </FormField>
      </FormSection>

      {/* ── Assignment ── */}
      <FormSection title="Assignment" icon={<Users className="h-4 w-4" />}>
        <FormRow cols={2}>
          <FormField label="Priority">
            <FormSelect
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
                { value: "Urgent", label: "Urgent" },
              ]}
            />
          </FormField>
          <FormField label="Status">
            <FormSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Select Status"
              options={[
                { value: "pending", label: "Pending" },
                { value: "in-progress", label: "In Progress" },
                { value: "review", label: "In Review" },
                { value: "done", label: "Done" },
              ]}
            />
          </FormField>
        </FormRow>

        <FormField label="Description">
          <Textarea
            placeholder="Add task details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </FormField>
      </FormSection>

      {/* ── Tags ── */}
      <FormSection title="Tags" icon={<Tag className="h-4 w-4" />}>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <FormBadge
                key={tag.id}
                variant="colored"
                color={tag.color}
                onRemove={() => removeTag(tag.id)}
              >
                {tag.label}
              </FormBadge>
            ))}
          </div>
        )}
      </FormSection>

      {/* ── Dates ── */}
      <FormSection title="Schedule" icon={<Calendar className="h-4 w-4" />}>
        <FormRow cols={2}>
          <FormField label="Start Date">
            <FormDatePicker
              value={startDate}
              onChange={setStartDate}
            />
          </FormField>
          <FormField label="Due Date">
            <FormDatePicker
              value={dueDate}
              onChange={setDueDate}
            />
          </FormField>
        </FormRow>
      </FormSection>

      {/* ── Subtasks ── */}
      <FormSection title="Subtasks" icon={<ListChecks className="h-4 w-4" />}>
        <FormSwitchRow
          label="Enable Subtasks"
          description="Break this task into smaller steps"
          checked={enableSubtasks}
          onCheckedChange={(val) => {
            setEnableSubtasks(val)
            if (val && subtasks.length === 0) {
              setSubtasks([{ id: "1", text: "", checked: false }])
            }
          }}
        />

        {enableSubtasks && (
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <FormSubtaskItem
                key={subtask.id}
                text={subtask.text}
                checked={subtask.checked}
                onTextChange={(val) => updateSubtask(subtask.id, val)}
                onCheckedChange={() => toggleSubtask(subtask.id)}
                onDelete={() => deleteSubtask(subtask.id)}
              />
            ))}
            <FormSubtaskAdd onClick={addSubtask} />
          </div>
        )}
      </FormSection>

      {/* ── Footer ── */}
      <FormDrawerFooter>
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!taskName.trim()}>
          Create Task
        </Button>
      </FormDrawerFooter>
    </FormDrawer>
  )
}

export default DrawerFormExample
