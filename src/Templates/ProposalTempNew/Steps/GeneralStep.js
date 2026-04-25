import React, { useState,useEffect,useRef } from "react";
import { Info } from "lucide-react";
import MultiSelectDropdown from "../../MultiSelectDropdown";

const GeneralStep = ({
  formData,
  updateFormData,
  nextStep,
  stepErrors,
  setStepErrors,
}) => {
  const [touched, setTouched] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
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

  const handleTextFieldClick = () => {
    if (textFieldRef.current) {
      const position = textFieldRef.current.selectionStart;
      setCursorPosition(position);
    }
  };

  const handleTextFieldChange = (e) => {
    handleInputChange("proposalName", e.target.value);
    
    // Update cursor position
    if (textFieldRef.current) {
      const position = textFieldRef.current.selectionStart;
      setCursorPosition(position);
    }
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
    
    // Update form data with selected team members
    updateFormData("general", { 
      teamMembers: selectedValues,
      selectedTeamMembers: newSelectedUsers 
    });
  };
  const handleAddShortcut = (shortcut) => {
    const currentProposalName = formData.general.proposalName || "";
    
    const newProposalName =
      currentProposalName.slice(0, cursorPosition) +
      `[${shortcut}]` +
      currentProposalName.slice(cursorPosition);

    // Update the form data with the new proposal name containing the shortcut
    handleInputChange("proposalName", newProposalName);

    // Set focus and cursor position after the inserted shortcut
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        const newCursorPosition = cursorPosition + shortcut.length + 2; // +2 for the brackets []
        textFieldRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        setCursorPosition(newCursorPosition);
      }
    }, 0);

    setShowDropdown(false);
  };

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    if (selectedOption === "contacts" || selectedOption === "account") {
      const accountShortcuts = [
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
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);
 // Initialize selectedUser from formData if it exists
  useEffect(() => {
    if (formData.general.selectedTeamMembers) {
      setSelectedUser(formData.general.selectedTeamMembers);
    }
  }, [formData.general.selectedTeamMembers]);
  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  const StepCard = ({ title, description, checked, onChange, name }) => (
    <div className={`rounded-xl border p-4 mb-3 transition-all hover:shadow-sm ${checked ? 'border-blue-400 bg-blue-50/50 border-2' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-3 mb-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(name, e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-base font-semibold text-slate-800">{title}</span>
      </div>
      <div className="flex items-start gap-1.5 ml-7">
        <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-600">General Information</h2>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
        <h3 className="text-base font-semibold text-blue-600 mb-3">Basic Details</h3>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Template name (not visible to clients) *</label>
          <input
            type="text"
            placeholder="Template name (not visible to clients)"
            value={formData.general.templatename || ""}
            onChange={(e) => handleInputChange("templateName", e.target.value)}
            onBlur={() => handleBlur("templateName")}
            required
            className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${stepErrors.templatename ? 'border-red-400' : 'border-slate-200'}`}
          />
          {stepErrors.templatename && <p className="text-xs text-red-500">{stepErrors.templatename}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Proposal name (visible to clients) *</label>
          <input
            type="text"
            placeholder="Proposal name (visible to clients)"
            value={formData.general.proposalName || ""}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("proposalName")}
            onClick={handleTextFieldClick}
            onKeyUp={handleTextFieldClick}
            required
            ref={textFieldRef}
            className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${stepErrors.proposalName ? 'border-red-400' : 'border-slate-200'}`}
          />
          {stepErrors.proposalName && <p className="text-xs text-red-500">{stepErrors.proposalName}</p>}
        </div>

        <div className="relative">
          <button type="button" onClick={toggleDropdown} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
            Add Shortcode
          </button>
          {showDropdown && (
            <div className="absolute left-0 top-full z-50 mt-1 w-72 max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              {filteredShortcuts.map((shortcut, index) => (
                <button
                  key={index}
                  onClick={() => !shortcut.isBold && handleAddShortcut(shortcut.value)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${shortcut.isBold ? 'font-bold text-slate-800 bg-slate-50 cursor-default' : 'text-slate-600 hover:bg-slate-50 cursor-pointer'}`}
                >
                  {shortcut.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Team Members</label>
          <MultiSelectDropdown
            value={selectedUser}
            onChange={handleUserChange}
            placeholder="Team Member"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-blue-600 mb-2">Configure Proposal Steps</h3>
        <p className="text-xs text-slate-500 mb-4">
          Customize which steps to include in your proposal. Each step helps
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
