import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown"
const generalSchema = z.object({
  templateName: z.string().min(1, 'Template name is required'),
  proposalName: z.string().min(1, 'Proposal name is required'),
});

const GeneralStep = ({
  formData,
  updateFormData,
  nextStep,
  stepErrors,
  setStepErrors,
}) => {
  const [touched, setTouched] = useState({});

  const form = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      templateName: formData.general?.templateName || '',
      proposalName: formData.general?.proposalName || '',
    },
  });
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  // === SHORTCODES States ===
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  useEffect(() => {
    const accountShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
      { title: "Date Shortcodes", isBold: true },
      {
        title: "Current day full date",
        isBold: false,
        value: "CURRENT_DAY_FULL_DATE",
      },
      {
        title: "Current day number",
        isBold: false,
        value: "CURRENT_DAY_NUMBER",
      },
      { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
      { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
      {
        title: "Current month number",
        isBold: false,
        value: "CURRENT_MONTH_NUMBER",
      },
      {
        title: "Current month name",
        isBold: false,
        value: "CURRENT_MONTH_NAME",
      },
      { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
      { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
      {
        title: "Last day full date",
        isBold: false,
        value: "LAST_DAY_FULL_DATE",
      },
      { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
      { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
      { title: "Last week", isBold: false, value: "LAST_WEEK" },
      { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
      { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
      { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
      { title: "Last year", isBold: false, value: "LAST_YEAR" },
      {
        title: "Next day full date",
        isBold: false,
        value: "NEXT_DAY_FULL_DATE",
      },
      { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
      { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
      { title: "Next week", isBold: false, value: "NEXT_WEEK" },
      { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
      { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
      { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
      { title: "Next year", isBold: false, value: "NEXT_YEAR" },
    ];
    setShortcuts(accountShortcuts);
    setFilteredShortcuts(accountShortcuts);
  }, []);

  const LOGIN_API =
    process.env.REACT_APP_USER_LOGIN || "https://www.snptaxes.com";

  // Fetch team members data
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
        const response = await fetch(url);
        const data = await response.json();
        const options = data.map((user) => ({
          value: user._id,
          label: user.username,
        }));
        setInternalOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team members:", error);
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [LOGIN_API]);

  // Get selected users objects from stored IDs
  const getSelectedUsers = () => {
    if (
      !formData.general.teamMembers ||
      formData.general.teamMembers.length === 0
    ) {
      return [];
    }

    return formData.general.teamMembers.map((userId) => {
      const user = internalOptions.find((opt) => opt.value === userId);
      return user || { value: userId, label: `User ${userId}` };
    });
  };

  // Handle team member selection
  const handleTeamMembersChange = ( newSelectedUsers) => {
    const selectedValues = newSelectedUsers.map((user) => user.value);

    // Update form data
    updateFormData("general", {
      teamMembers: selectedValues,
    });

    console.log("Selected team members:", selectedValues);
  };

  // Handle input changes for other fields
  const handleInputChange = (field, value) => {
    updateFormData("general", { [field]: value });

    // Clear error when user starts typing
    if (value.trim() !== "" && stepErrors[field]) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleVisibilityChange = (field, value) => {
    updateFormData("general", { [field]: value });
  };
  // Toggle dropdown
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  // Track cursor position inside Proposal Name
  const handleTextFieldClick = () => {
    if (textFieldRef.current) {
      setCursorPosition(textFieldRef.current.selectionStart);
    }
  };

  // Insert shortcode at cursor position
  const handleAddShortcut = (shortcutValue) => {
    const current = formData.general.proposalName || "";

    const newValue =
      current.slice(0, cursorPosition) +
      `[${shortcutValue}]` +
      current.slice(cursorPosition);

    updateFormData("general", { proposalName: newValue });

    setTimeout(() => {
      if (textFieldRef.current) {
        const newCursor = cursorPosition + shortcutValue.length + 2;
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(newCursor, newCursor);
        setCursorPosition(newCursor);
      }
    }, 0);

    setShowDropdown(false);
  };

  const StepCard = ({ title, description, checked, onChange, name }) => (
    <div className={`rounded-xl border p-4 mb-3 transition-all hover:shadow-sm ${checked ? 'border-primary/60 bg-primary/5 border-2' : 'border-border bg-card'}`}>
      <div className="flex items-center gap-3 mb-2">
        <Checkbox
          checked={checked}
          onCheckedChange={(val) => onChange(name, val)}
        />
        <span className="text-base font-semibold text-foreground">{title}</span>
      </div>
      <div className="flex items-start gap-1.5 ml-7">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">General Information</h2>

      <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-4">
        <h3 className="text-base font-semibold text-primary mb-3">Basic Details</h3>

        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Template Name"
                      value={formData.general.templateName || ''}
                      className={stepErrors?.templateName ? 'border-destructive' : ''}
                      onChange={e => { field.onChange(e); handleInputChange('templateName', e.target.value); }}
                      onBlur={() => handleBlur('templateName')}
                    />
                  </FormControl>
                  {stepErrors?.templateName
                    ? <p className="text-xs text-destructive">{stepErrors.templateName}</p>
                    : <FormMessage />}
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
                      {...field}
                      ref={textFieldRef}
                      placeholder="Proposal name (visible to clients)"
                      value={formData.general.proposalName || ''}
                      className={stepErrors?.proposalName ? 'border-destructive' : ''}
                      onChange={e => { field.onChange(e); handleInputChange('proposalName', e.target.value); handleTextFieldClick(); }}
                      onClick={handleTextFieldClick}
                    />
                  </FormControl>
                  {stepErrors?.proposalName
                    ? <p className="text-xs text-destructive">{stepErrors.proposalName}</p>
                    : <FormMessage />}
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="relative">
          <button type="button" onClick={toggleDropdown} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Add Shortcode
          </button>
          {showDropdown && (
            <div className="absolute left-0 top-full z-50 mt-1 w-72 max-h-72 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
              {filteredShortcuts.map((shortcut, index) => (
                <button
                  key={index}
                  onClick={() => !shortcut.isBold && handleAddShortcut(shortcut.value)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${shortcut.isBold ? 'font-bold text-foreground bg-muted/40 cursor-default' : 'text-muted-foreground hover:bg-muted/60 cursor-pointer'}`}
                >
                  {shortcut.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Team Members *</label>
          <MultiSelectDropdown
            value={getSelectedUsers()}
            onChange={handleTeamMembersChange}
            placeholder="Team Member"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-primary mb-2">Configure Proposal Steps</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Customi which steps to include in your proposal. Each step helps
          communicate different aspects of your service to clients.
        </p>

        <div>
          <StepCard
            title="Introduction Step"
            description="Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share"
            checked={formData.general.introductionEnabled || false}
            onChange={handleVisibilityChange}
            name="introductionEnabled"
          />
          <StepCard
            title="Terms Step"
            description="Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed."
            checked={formData.general.termsEnabled || false}
            onChange={handleVisibilityChange}
            name="termsEnabled"
          />
          <StepCard
            title="Services & Invoices Step"
            description="Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically."
            checked={formData.general.servicesEnabled || false}
            onChange={handleVisibilityChange}
            name="servicesEnabled"
          />
        </div>
      </div>
    </div>
  );
};
export default GeneralStep;
