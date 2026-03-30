import React, { useState } from "react"
import {
  FormPage,
  FormSection,
  FormField,
  FormRow,
  FormActions,
  FormSteps,
  FormSwitchRow,
  FormDatePicker,
  FormSelect,
  FormDivider,
  FormSubtaskItem,
  FormSubtaskAdd,
} from "../index"
import { Input } from "../../input"
import { Button } from "../../button"
import { Textarea } from "../../textarea"
import { FileText, Users, Calendar, Settings } from "lucide-react"

/**
 * MultiStepFormExample — Demonstrates the multi-step form pattern.
 *
 * This is a reference implementation showing how to compose the form system
 * into a wizard-style form with progress indicator and step navigation.
 *
 * Copy and adapt this pattern for onboarding flows, setup wizards,
 * or any form that benefits from breaking into logical steps.
 */
const STEPS = [
  { label: "General", description: "Basic info" },
  { label: "Assignment", description: "Team & dates" },
  { label: "Details", description: "Tasks & settings" },
  { label: "Review", description: "Confirm & save" },
]

const MultiStepFormExample = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    templateName: "",
    jobName: "",
    description: "",
    assignees: [],
    priority: "Medium",
    startDate: "",
    dueDate: "",
    enableSubtasks: false,
    subtasks: [],
    notifyOnComplete: true,
    autoArchive: false,
  })

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    // Add your submit logic here
  }

  const handleAddSubtask = () => {
    const newId = String(formData.subtasks.length + 1)
    updateField("subtasks", [
      ...formData.subtasks,
      { id: newId, text: "", checked: false },
    ])
  }

  const handleSubtaskChange = (id, value) => {
    updateField(
      "subtasks",
      formData.subtasks.map((s) => (s.id === id ? { ...s, text: value } : s))
    )
  }

  const handleSubtaskDelete = (id) => {
    updateField(
      "subtasks",
      formData.subtasks.filter((s) => s.id !== id)
    )
  }

  const handleSubtaskCheck = (id) => {
    updateField(
      "subtasks",
      formData.subtasks.map((s) =>
        s.id === id ? { ...s, checked: !s.checked } : s
      )
    )
  }

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.templateName.trim() !== ""
      case 1:
        return true
      case 2:
        return true
      case 3:
        return true
      default:
        return true
    }
  }

  return (
    <FormPage
      title="Create Template"
      subtitle="Set up a new job template step by step"
      onBack={onBack}
      maxWidth="lg"
      actions={
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {STEPS.length}
        </span>
      }
    >
      {/* Step Indicator */}
      <div className="mb-6 sm:mb-8">
        <FormSteps
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(index) => {
            if (index < currentStep) setCurrentStep(index)
          }}
        />
      </div>

      {/* ── Step 1: General ── */}
      {currentStep === 0 && (
        <FormSection
          title="General Information"
          description="Basic details about the template"
          icon={<FileText className="h-4 w-4" />}
        >
          <FormField label="Template Name" required hint="This name is for internal use only">
            <Input
              placeholder="e.g., Monthly Tax Return"
              value={formData.templateName}
              onChange={(e) => updateField("templateName", e.target.value)}
            />
          </FormField>

          <FormField label="Job Name" hint="Supports shortcodes like [ACCOUNT_NAME]">
            <Input
              placeholder="e.g., [ACCOUNT_NAME] - Tax Return"
              value={formData.jobName}
              onChange={(e) => updateField("jobName", e.target.value)}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              placeholder="Describe what this template is for..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
            />
          </FormField>
        </FormSection>
      )}

      {/* ── Step 2: Assignment ── */}
      {currentStep === 1 && (
        <FormSection
          title="Assignment & Schedule"
          description="Set team members and dates"
          icon={<Users className="h-4 w-4" />}
        >
          <FormField label="Priority">
            <FormSelect
              value={formData.priority}
              onChange={(e) => updateField("priority", e.target.value)}
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
                { value: "Urgent", label: "Urgent" },
              ]}
            />
          </FormField>

          <FormDivider label="Schedule" />

          <FormRow cols={2}>
            <FormField label="Start Date">
              <FormDatePicker
                value={formData.startDate}
                onChange={(val) => updateField("startDate", val)}
              />
            </FormField>
            <FormField label="Due Date">
              <FormDatePicker
                value={formData.dueDate}
                onChange={(val) => updateField("dueDate", val)}
              />
            </FormField>
          </FormRow>
        </FormSection>
      )}

      {/* ── Step 3: Details ── */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <FormSection
            title="Subtasks"
            description="Break the job into smaller steps"
            icon={<Calendar className="h-4 w-4" />}
          >
            <FormSwitchRow
              label="Enable Subtasks"
              description="Add a checklist of tasks to complete"
              checked={formData.enableSubtasks}
              onCheckedChange={(val) => updateField("enableSubtasks", val)}
            />

            {formData.enableSubtasks && (
              <div className="space-y-2">
                {formData.subtasks.map((subtask) => (
                  <FormSubtaskItem
                    key={subtask.id}
                    text={subtask.text}
                    checked={subtask.checked}
                    onTextChange={(val) => handleSubtaskChange(subtask.id, val)}
                    onCheckedChange={() => handleSubtaskCheck(subtask.id)}
                    onDelete={() => handleSubtaskDelete(subtask.id)}
                  />
                ))}
                <FormSubtaskAdd onClick={handleAddSubtask} />
              </div>
            )}
          </FormSection>

          <FormSection
            title="Settings"
            icon={<Settings className="h-4 w-4" />}
          >
            <FormSwitchRow
              label="Notify on Completion"
              description="Send email when all tasks are done"
              checked={formData.notifyOnComplete}
              onCheckedChange={(val) => updateField("notifyOnComplete", val)}
            />
            <FormSwitchRow
              label="Auto-Archive"
              description="Archive completed jobs after 30 days"
              checked={formData.autoArchive}
              onCheckedChange={(val) => updateField("autoArchive", val)}
            />
          </FormSection>
        </div>
      )}

      {/* ── Step 4: Review ── */}
      {currentStep === 3 && (
        <FormSection title="Review & Confirm" description="Check everything before saving">
          <div className="space-y-4">
            <ReviewItem label="Template Name" value={formData.templateName || "—"} />
            <ReviewItem label="Job Name" value={formData.jobName || "—"} />
            <ReviewItem label="Priority" value={formData.priority} />
            <ReviewItem label="Start Date" value={formData.startDate || "Not set"} />
            <ReviewItem label="Due Date" value={formData.dueDate || "Not set"} />
            <ReviewItem label="Subtasks" value={formData.enableSubtasks ? `${formData.subtasks.length} subtask(s)` : "Disabled"} />
            <ReviewItem label="Notify on Complete" value={formData.notifyOnComplete ? "Yes" : "No"} />
            <ReviewItem label="Auto-Archive" value={formData.autoArchive ? "Yes" : "No"} />
          </div>

          {formData.description && (
            <>
              <FormDivider />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {formData.description}
                </p>
              </div>
            </>
          )}
        </FormSection>
      )}

      {/* ── Step Navigation ── */}
      <FormActions align="between">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onBack : handleBack}
        >
          {currentStep === 0 ? "Cancel" : "Back"}
        </Button>
        <div className="flex items-center gap-2 sm:gap-3">
          {currentStep === STEPS.length - 1 ? (
            <Button onClick={handleSubmit}>
              Create Template
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
            >
              Continue
            </Button>
          )}
        </div>
      </FormActions>
    </FormPage>
  )
}

// Small helper component for review step
const ReviewItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
)

export default MultiStepFormExample
