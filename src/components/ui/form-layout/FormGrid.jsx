import React from "react"
import { cn } from "../../../lib/utils"

/**
 * FormGrid — Two-column layout for full-page forms (main + sidebar).
 * 
 * Usage:
 *   <FormGrid>
 *     <FormGrid.Main>
 *       <FormSection title="General">...</FormSection>
 *     </FormGrid.Main>
 *     <FormGrid.Sidebar>
 *       <FormSection title="Client Facing">...</FormSection>
 *     </FormGrid.Sidebar>
 *   </FormGrid>
 */
const FormGrid = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const FormGridMain = ({ className, children, ...props }) => {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {children}
    </div>
  )
}

const FormGridSidebar = ({ className, children, ...props }) => {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {children}
    </div>
  )
}

FormGrid.displayName = "FormGrid"
FormGridMain.displayName = "FormGrid.Main"
FormGridSidebar.displayName = "FormGrid.Sidebar"

FormGrid.Main = FormGridMain
FormGrid.Sidebar = FormGridSidebar

export { FormGrid }
