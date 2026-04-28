import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Info } from "lucide-react";
import MultiSelectDropdown from "../../MultiSelectDropdown";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";

const SHORTCUTS = [
  { title: "Account Shortcodes", isBold: true },
  { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  { title: "Date Shortcodes", isBold: true },
  { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
  { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
  { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
  { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
  { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
  { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  { title: "Last week", isBold: false, value: "LAST_WEEK" },
  { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
  { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  { title: "Last year", isBold: false, value: "LAST_YEAR" },
  { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
  { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
  { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  { title: "Next year", isBold: false, value: "NEXT_YEAR" },
];

const generalSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),
  proposalName: z.string().min(1, "Proposal name is required"),
  introductionEnabled: z.boolean().optional(),
  termsEnabled: z.boolean().optional(),
  servicesEnabled: z.boolean().optional(),
});

const GeneralStep = ({ formData, updateFormData, stepErrors, setStepErrors }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedUser, setSelectedUser] = useState(formData.general?.selectedTeamMembers || []);
  const textFieldRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      templateName: formData.general?.templatename || formData.general?.templateName || "",
      proposalName: formData.general?.proposalName || "",
      introductionEnabled: formData.general?.introductionEnabled ?? true,
      termsEnabled: formData.general?.termsEnabled ?? true,
      servicesEnabled: formData.general?.servicesEnabled ?? true,
    },
  });

  useEffect(() => {
    if (stepErrors?.templatename) form.setError("templateName", { message: stepErrors.templatename });
    if (stepErrors?.proposalName) form.setError("proposalName", { message: stepErrors.proposalName });
  }, [stepErrors]);

  useEffect(() => {
    if (formData.general?.selectedTeamMembers) {
      setSelectedUser(formData.general.selectedTeamMembers);
    }
  }, [formData.general?.selectedTeamMembers]);

  const handleInputChange = (field, value) => {
    updateFormData("general", { [field]: value });
    if (value.trim() !== "" && stepErrors?.[field]) {
      setStepErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };

  const handleVisibilityChange = (field, value) => {
    updateFormData("general", { [field]: value });
    form.setValue(field, value);
  };

  const handleProposalNameChange = (e) => {
    const value = e.target.value;
    if (textFieldRef.current) setCursorPosition(textFieldRef.current.selectionStart);
    handleInputChange("proposalName", value);
  };

  const handleAddShortcut = (shortcut) => {
    const current = formData.general?.proposalName || "";
    const updated = current.slice(0, cursorPosition) + `[${shortcut}]` + current.slice(cursorPosition);
    handleInputChange("proposalName", updated);
    form.setValue("proposalName", updated);
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        const pos = cursorPosition + shortcut.length + 2;
        textFieldRef.current.setSelectionRange(pos, pos);
        setCursorPosition(pos);
      }
    }, 0);
    setShowDropdown(false);
  };

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    updateFormData("general", {
      teamMembers: newSelectedUsers.map(u => u.value),
      selectedTeamMembers: newSelectedUsers,
    });
  };

  const StepCard = ({ title, description, fieldName }) => {
    const checked = form.watch(fieldName) ?? false;
    return (
      <div className={`rounded-xl border p-4 mb-3 transition-all hover:shadow-sm ${checked ? 'border-primary bg-primary/5 border-2' : 'border-border bg-background'}`}>
        <div className="flex items-center gap-3 mb-2">
          <Checkbox
            id={fieldName}
            checked={checked}
            onCheckedChange={(val) => handleVisibilityChange(fieldName, val)}
          />
          <label htmlFor={fieldName} className="text-base font-semibold text-foreground cursor-pointer">{title}</label>
        </div>
        <div className="flex items-start gap-1.5 ml-7">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">General Information</h2>

      <Form {...form}>
        <form className="space-y-6">
          <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-5">
            <h3 className="text-base font-semibold text-foreground">Basic Details</h3>

            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template name (not visible to clients) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Template name (not visible to clients)"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange("templateName", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proposalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal name (visible to clients) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Proposal name (visible to clients)"
                      {...field}
                      ref={textFieldRef}
                      value={formData.general?.proposalName || ""}
                      onChange={(e) => {
                        field.onChange(e);
                        handleProposalNameChange(e);
                      }}
                      onClick={() => textFieldRef.current && setCursorPosition(textFieldRef.current.selectionStart)}
                      onKeyUp={() => textFieldRef.current && setCursorPosition(textFieldRef.current.selectionStart)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(p => !p)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Add Shortcode
              </button>
              {showDropdown && (
                <div className="absolute left-0 top-full z-50 mt-1 w-72 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
                  {SHORTCUTS.map((shortcut, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => !shortcut.isBold && handleAddShortcut(shortcut.value)}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${shortcut.isBold ? 'font-bold text-foreground bg-muted cursor-default' : 'text-muted-foreground hover:bg-muted cursor-pointer'}`}
                    >
                      {shortcut.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Team Members</label>
              <MultiSelectDropdown
                value={selectedUser}
                onChange={handleUserChange}
                placeholder="Team Member"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-2">Configure Proposal Steps</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Customize which steps to include in your proposal. Each step helps
              communicate different aspects of your service to clients.
            </p>

            <StepCard
              title="Introduction Step"
              description="Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share"
              fieldName="introductionEnabled"
            />
            <StepCard
              title="Terms Step"
              description="Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed."
              fieldName="termsEnabled"
            />
            <StepCard
              title="Services & Invoices Step"
              description="Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically."
              fieldName="servicesEnabled"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GeneralStep;
