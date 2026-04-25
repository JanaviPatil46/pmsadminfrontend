import React from "react"
import { cn } from "../../../lib/utils"
import { Check } from "lucide-react"

/**
 * FormSteps — Multi-step wizard progress indicator.
 * 
 * Usage:
 *   <FormSteps
 *     steps={[
 *       { label: "General", description: "Basic info" },
 *       { label: "Assignment", description: "Assign users" },
 *       { label: "Schedule", description: "Set dates" },
 *     ]}
 *     currentStep={1}
 *     onStepClick={(index) => setStep(index)}
 *   />
 */
const FormSteps = ({ steps = [], currentStep = 0, onStepClick, className }) => {
  return (
    <nav className={cn("w-full", className)} aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <li
              key={index}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <button
                type="button"
                className="group flex items-center gap-3"
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
              >
                {/* Step indicator */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "border-2 border-primary bg-primary/10 text-primary",
                    !isCompleted && !isCurrent && "border-2 border-border bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </span>

                {/* Label */}
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-sm font-medium leading-tight",
                      (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  )}
                </div>
              </button>

              {/* Connector line */}
              {!isLast && (
                <div className="mx-4 flex-1">
                  <div
                    className={cn(
                      "h-0.5 w-full rounded-full transition-colors duration-200",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

FormSteps.displayName = "FormSteps"

export { FormSteps }
