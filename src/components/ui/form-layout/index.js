/**
 * ═══════════════════════════════════════════════════════════════════
 *  FORM LAYOUT SYSTEM — Production-Ready, Composable Form Architecture
 * ═══════════════════════════════════════════════════════════════════
 *
 * A complete form UI system for SaaS applications.
 * All components use Tailwind CSS + shadcn/ui design tokens.
 * Responsive by default (mobile → tablet → desktop).
 *
 * ─── COMPONENT CATALOG ───
 *
 *  LAYOUT        │ FormPage, FormDrawer, FormGrid, FormSteps, FormActions
 *  STRUCTURE     │ FormSection, FormField, FormRow, FormDivider
 *  CONTROLS      │ FormSelect, FormDatePicker, FormSwitchRow
 *  DATA DISPLAY  │ FormBadge, FormComment, FormSubtaskItem, FormSubtaskAdd
 *  UTILITIES     │ ShortcodePopover
 *
 * ─── PATTERN 1: FULL-PAGE FORM ───
 *
 *  <FormPage title="Edit Template" subtitle="..." actions={<Button>Save</Button>}>
 *    <FormGrid>
 *      <FormGrid.Main>
 *        <FormSection title="General" icon={<FileText />}>
 *          <FormField label="Name" required>
 *            <Input placeholder="Enter name" />
 *          </FormField>
 *          <FormRow cols={2}>
 *            <FormField label="Start"><FormDatePicker value={start} onChange={setStart} /></FormField>
 *            <FormField label="Due"><FormDatePicker value={due} onChange={setDue} /></FormField>
 *          </FormRow>
 *        </FormSection>
 *      </FormGrid.Main>
 *      <FormGrid.Sidebar>
 *        <FormSection title="Settings">...</FormSection>
 *      </FormGrid.Sidebar>
 *    </FormGrid>
 *  </FormPage>
 *
 * ─── PATTERN 2: DRAWER FORM ───
 *
 *  <FormDrawer open={open} onClose={onClose} title="New Task" width="lg">
 *    <FormSection title="Details">
 *      <FormField label="Account" required error={errors.account}>
 *        <FormSelect options={accounts} value={val} onChange={setVal} placeholder="Select..." />
 *      </FormField>
 *    </FormSection>
 *    <FormDrawerFooter>
 *      <Button variant="outline" onClick={onClose}>Cancel</Button>
 *      <Button onClick={handleSave}>Create</Button>
 *    </FormDrawerFooter>
 *  </FormDrawer>
 *
 * ─── PATTERN 3: MULTI-STEP FORM ───
 *
 *  <FormPage title="Setup Wizard">
 *    <FormSteps steps={[{ label: "Info" }, { label: "Review" }]} currentStep={step} onStepClick={setStep} />
 *    {step === 0 && <FormSection>...</FormSection>}
 *    {step === 1 && <FormSection>...</FormSection>}
 *    <FormActions sticky>
 *      <Button variant="outline" onClick={prev}>Back</Button>
 *      <Button onClick={next}>Next</Button>
 *    </FormActions>
 *  </FormPage>
 *
 * ─── DESIGN RULES ───
 *
 *  1. Always wrap related fields in <FormSection>
 *  2. Always wrap inputs with <FormField> (provides label, error, hint)
 *  3. Use <FormRow cols={2|3|4}> for side-by-side fields
 *  4. Use <FormSwitchRow> for toggle settings (not raw Switch + Label)
 *  5. Use <FormSelect> for native dropdowns, react-select with className="rs-form" for searchable
 *  6. Use <FormDatePicker> instead of MUI DatePicker
 *  7. Use <FormActions sticky> for bottom action bars
 *  8. Use <ShortcodePopover> wherever shortcode insertion is needed
 *  9. Use <FormSubtaskItem> + <FormSubtaskAdd> for checklist patterns
 * 10. Use <FormBadge> for tag/chip display
 *
 * ─── SPACING SYSTEM ───
 *
 *  Between sections:    gap-6 (1.5rem)  — handled by FormGrid.Main, FormGrid.Sidebar
 *  Inside sections:     space-y-5        — handled by FormSection
 *  Between row fields:  gap-4 (1rem)     — handled by FormRow
 *  Label to input:      space-y-2        — handled by FormField
 *
 * ─── RESPONSIVE BREAKPOINTS ───
 *
 *  Mobile  (<640px):   Single column, full-width inputs, stacked sections
 *  Tablet  (640-1024): 2-column rows, sidebar stacks below main
 *  Desktop (>1024):    Full grid with sidebar, 2-4 col rows
 */

// Layout
export { FormPage } from "./FormPage"
export { FormDrawer, FormDrawerFooter } from "./FormDrawer"
export { FormGrid } from "./FormGrid"
export { FormSteps } from "./FormSteps"
export { FormActions } from "./FormActions"

// Structure
export { FormSection } from "./FormSection"
export { FormField } from "./FormField"
export { FormRow } from "./FormRow"
export { FormDivider } from "./FormDivider"

// Controls
export { FormSelect } from "./FormSelect"
export { FormDatePicker } from "./FormDatePicker"
export { FormSwitchRow } from "./FormSwitchRow"

// Data Display
export { FormBadge } from "./FormBadge"
export { FormComment } from "./FormComment"
export { FormSubtaskItem, FormSubtaskAdd } from "./FormSubtask"

// Utilities
export { ShortcodePopover } from "./ShortcodePopover"
