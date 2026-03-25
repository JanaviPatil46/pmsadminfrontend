/**
 * Form Layout System — Reusable, composable form architecture
 * 
 * USAGE GUIDE:
 * 
 * 1. FULL-PAGE FORM (e.g., Edit Job Template, Edit Email Template):
 * 
 *    <FormPage title="Edit Job Template" actions={<Button>Save</Button>}>
 *      <FormGrid>
 *        <FormGrid.Main>
 *          <FormSection title="General Info" icon={<FileText />}>
 *            <FormField label="Template Name" required>
 *              <Input placeholder="Enter name" />
 *            </FormField>
 *            <FormRow cols={2}>
 *              <FormField label="Start Date"><Input type="date" /></FormField>
 *              <FormField label="Due Date"><Input type="date" /></FormField>
 *            </FormRow>
 *          </FormSection>
 *        </FormGrid.Main>
 *        <FormGrid.Sidebar>
 *          <FormSection title="Client Facing">...</FormSection>
 *        </FormGrid.Sidebar>
 *      </FormGrid>
 *    </FormPage>
 * 
 * 2. DRAWER FORM (e.g., New Task, Quick Edit):
 * 
 *    <FormDrawer open={open} onClose={onClose} title="New Task" width="lg">
 *      <FormSection title="Details">
 *        <FormField label="Account" required error={errors.account}>
 *          <Input />
 *        </FormField>
 *      </FormSection>
 *      <FormDrawerFooter>
 *        <Button variant="outline" onClick={onClose}>Cancel</Button>
 *        <Button onClick={handleSave}>Create</Button>
 *      </FormDrawerFooter>
 *    </FormDrawer>
 * 
 * 3. MULTI-STEP FORM:
 * 
 *    <FormPage title="Setup Wizard">
 *      <FormSteps steps={steps} currentStep={step} onStepClick={setStep} />
 *      {step === 0 && <FormSection>...</FormSection>}
 *      {step === 1 && <FormSection>...</FormSection>}
 *      <FormActions>
 *        <Button variant="outline" onClick={handleBack}>Back</Button>
 *        <Button onClick={handleNext}>Next</Button>
 *      </FormActions>
 *    </FormPage>
 * 
 * DESIGN RULES:
 * - Always group related fields in <FormSection>
 * - Use <FormRow cols={2}> for side-by-side fields
 * - Use <FormField> for every input (provides label, error, hint)
 * - Use <FormActions sticky> for bottom action bars
 * - Use <ShortcodePopover> wherever shortcode insertion is needed
 */

export { FormPage } from "./FormPage"
export { FormSection } from "./FormSection"
export { FormField } from "./FormField"
export { FormRow } from "./FormRow"
export { FormActions } from "./FormActions"
export { FormGrid } from "./FormGrid"
export { FormDrawer, FormDrawerFooter } from "./FormDrawer"
export { FormSteps } from "./FormSteps"
export { ShortcodePopover } from "./ShortcodePopover"
