import React, { useState, useEffect, useRef,useContext } from "react";
import { Info } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown";
import CreatableSelect from "react-select/creatable";

import { LoginContext } from "../../Sidebar/Context/Context";
const GeneralStep = ({
  formData,
  updateFormData,
  nextStep,
  stepErrors,
  setStepErrors,
}) => {
  const { data } = useParams();
  console.log("selected account", data);
  const [touched, setTouched] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
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
  const ACCOUNT_API =
    process.env.REACT_APP_ACCOUNTS_URL || "https://www.snptaxes.com";
  const INVOICE_API =
    process.env.REACT_APP_INVOICE_API || "https://www.snptaxes.com";

  // Fetch accounts and templates on component mount
  useEffect(() => {
    fetchAccounts();
    fetchTemplates();
    fetchInvoiceTemplates();
    fetchTeamMembers();
  }, []);

  
// const fetchAccounts = async () => {
//   try {
//     const storedUserRole = localStorage.getItem("userRole");
//     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//     const loginuserid = storedData?.teammember?.userid;
//     const viewAllAccounts = storedData?.teammember?.viewallAccounts;

//     let url = "";

//     // === ROLE BASED ACCOUNT FETCH ===
//     if (storedUserRole === "Admin") {
//       url =
//         "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
//     } else {
//       // Team Member
//       url =
//         viewAllAccounts === true
//           ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
//           : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
//     }

//     console.log("Fetching Accounts From:", url);

//     const response = await fetch(url);
//     const result = await response.json();

//     // Handle both Admin & TeamMember API response formats
//     const accountList = Array.isArray(result.accountlist)
//       ? result.accountlist
//       : Array.isArray(result.teamAccounts)
//       ? result.teamAccounts
//       : [];

//     if (!Array.isArray(accountList)) {
//       console.error("Account list is not an array:", accountList);
//       return;
//     }

//     setAccounts(accountList);
//     console.log("Fetched accounts:", accountList);

//     // Auto-select account if useParams provides accountId
//     console.log("Looking for account ID:", data);
//     const selectedAccountData = accountList.find(
//       (account) => account._id === data
//     );

//     console.log("Found matched account:", selectedAccountData);

//     if (selectedAccountData) {
//       const selectedAccount = {
//         label: selectedAccountData.accountName,
//         value: selectedAccountData._id,
//       };

//       updateFormData("general", {
//         account: [selectedAccount], // wrap inside array
//       });

//       if (stepErrors.account) {
//         setStepErrors((prev) => {
//           const newErrors = { ...prev };
//           delete newErrors.account;
//           return newErrors;
//         });
//       }

//       console.log("Auto-selected account:", selectedAccount);
//     } else {
//       console.warn("No account found with ID:", data);
//     }
//   } catch (error) {
//     console.error("Error fetching accounts:", error);
//   }
// };
const fetchAccounts = async () => {
  try {
    // === 1. Check if account info is in cookies ===
    const accountId = Cookies.get("accountId");
    const accountName = Cookies.get("accountName");

    if (accountId && accountName) {
      // If cookies exist, set the account and skip fetching
      const selectedAccount = {
        label: accountName,
        value: accountId,
      };

      updateFormData("general", {
        account: [selectedAccount],
      });

      if (stepErrors.account) {
        setStepErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.account;
          return newErrors;
        });
      }

      console.log("Account set from cookies:", selectedAccount);
      return; // skip rest of fetch logic
    }

    // === 2. Proceed with existing API fetch logic ===
    const storedUserRole = localStorage.getItem("userRole");
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginuserid = storedData?.teammember?.userid;
    const viewAllAccounts = storedData?.teammember?.viewallAccounts;

    let url = "";

    if (storedUserRole === "Admin") {
      url =
        "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
    } else {
      url =
        viewAllAccounts === true
          ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
    }

    console.log("Fetching Accounts From:", url);

    const response = await fetch(url);
    const result = await response.json();

    const accountList = Array.isArray(result.accountlist)
      ? result.accountlist
      : Array.isArray(result.teamAccounts)
      ? result.teamAccounts
      : [];

    if (!Array.isArray(accountList)) {
      console.error("Account list is not an array:", accountList);
      return;
    }

    setAccounts(accountList);
    console.log("Fetched accounts:", accountList);

    // Auto-select account if useParams provides accountId (optional fallback)
    const selectedAccountData = accountList.find(
      (account) => account._id === data
    );

    if (selectedAccountData) {
      const selectedAccount = {
        label: selectedAccountData.accountName,
        value: selectedAccountData._id,
      };

      updateFormData("general", {
        account: [selectedAccount],
      });

      if (stepErrors.account) {
        setStepErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.account;
          return newErrors;
        });
      }

      console.log("Auto-selected account:", selectedAccount);
    } else {
      console.warn("No account found with ID:", data);
    }
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
};
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://www.snptaxes.com/api/proposals");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(data.proposallist || []);
      console.log("proposal template", data.proposallist);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceTemplates = async () => {
    try {
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch templates");
      const result = await response.json();
      setInvoiceTemplates(result.invoiceTemplate || result || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
    const { logindata } = useContext(LoginContext);

  // FIXED: Improved template data fetching and transformation
  const fetchTemplateData = async (templateId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.snptaxes.com/api/proposals/${templateId}`
      );
      if (!response.ok) throw new Error("Failed to fetch template data");
      const templateData = await response.json();

      console.log("Template data received:", templateData);

      // Transform the template data
      const transformedData = transformTemplateToForm(templateData);

      // Update all form sections with the transformed template data
      updateFormData("general", {
        ...formData.general,
        // proposalTemp: templateId,
        template: {
          value: templateId,
          label:
            templateData.general?.templateName ||
            templateData.general?.proposalName ||
            "Template",
        },
        proposalTemp: templateId,
        proposalName:
          templateData.general?.proposalName ||
          templateData.general?.templateName ||
          "",
        introductionEnabled: templateData.general?.introductionEnabled ?? true,
        termsEnabled: templateData.general?.termsEnabled ?? true,
        servicesEnabled: templateData.general?.servicesEnabled ?? true,
        paymentsEnabled: templateData.general?.paymentsEnabled ?? false,
        teamMembers: templateData.general?.teamMembers || [],
      });

      // Update other sections with transformed template data
      if (transformedData.introduction) {
        updateFormData("introduction", transformedData.introduction);
      }

      if (transformedData.terms) {
        updateFormData("terms", transformedData.terms);
      }

      if (transformedData.services) {
        updateFormData("services", transformedData.services);
      }

      if (transformedData.payments) {
        updateFormData("payments", transformedData.payments);
      }

      // Clear all step errors after template data is loaded
      setStepErrors({});
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Improved template transformation
  const transformTemplateToForm = (templateData) => {
    console.log("Transforming template data:", templateData);

    return {
      introduction: {
        title: templateData.introduction?.title || "",
        description: templateData.introduction?.description || "",
      },
      terms: {
        title: templateData.terms?.title || "",
        description: templateData.terms?.description || "",
      },
      services: {
        option: templateData.services?.option || "",
        invoices: transformInvoicesForForm(
          templateData.services?.invoices || []
        ),
        itemizedData: transformItemizedDataForForm(
          templateData.services?.itemizedData
        ),
      },
      payments: {
        method: templateData.payments?.method || "",
        amount: templateData.payments?.amount || 0,
      },
    };
  };

  // Transform functions
  const transformInvoicesForForm = (invoices) => {
    console.log("template invoice", invoices);
    if (!invoices || invoices.length === 0) {
      return [{ id: 1, ...getEmptyInvoice() }];
    }

    return invoices.map((invoice, index) => {
      const template = invoiceTemplates.find(
        (t) => t._id === invoice.invoiceTemplate
      );

      return {
        id: index + 1,
        invoiceTemplate: invoice.invoiceTemplate
          ? {
              value: invoice.invoiceTemplate,
              label: template?.templatename || "Template",
            }
          : null,
        teamMembers: invoice.teamMembers || [],
        issueInvoice: "immediately",
        specificDate: null,
        selectedTime: null,
        description: invoice.description || "",
        charCount: invoice.description?.length || 0,
        charLimit: 1000,
        rows: transformLineItemsToRows(invoice.lineItems || []),
        subtotal: invoice.subtotal?.toString() || "0.00",
        taxRate: invoice.taxRate?.toString() || "0",
        taxTotal: invoice.taxTotal?.toString() || "0.00",
        totalAmount: invoice.totalAmount?.toString() || "0.00",
        clientNote: "",
      };
    });
  };

  const transformLineItemsToRows = (lineItems) => {
    if (!lineItems || lineItems.length === 0) {
      return [getEmptyRow()];
    }

    return lineItems.map((item) => ({
      productorService: item.productorService || "",
      description: item.description || "",
      rate: item.rate?.toString() || "0.00",
      quantity: item.quantity?.toString() || "1",
      amount: item.amount?.toString() || "0.00",
      tax: item.tax || false,
      isDiscount: false,
    }));
  };

  const transformItemizedDataForForm = (itemizedData) => {
    if (!itemizedData) {
      return {
        price: 0,
        name: "",
        rows: [getEmptyRow()],
        subtotal: "0.00",
        taxRate: "0",
        taxTotal: "0.00",
        totalAmount: "0.00",
      };
    }

    return {
      ...itemizedData,
      price: itemizedData.price || 0,
      name: itemizedData.name || "",
      rows: transformLineItemsToRows(itemizedData.lineItems),
      subtotal: itemizedData.subtotal?.toString() || "0.00",
      taxRate: itemizedData.taxRate?.toString() || "0",
      taxTotal: itemizedData.taxTotal?.toString() || "0.00",
      totalAmount: itemizedData.totalAmount?.toString() || "0.00",
    };
  };

  function getEmptyRow() {
    return {
      productorService: "",
      description: "",
      rate: "0.00",
      quantity: "1",
      amount: "0.00",
      tax: false,
      isDiscount: false,
    };
  }

  function getEmptyInvoice() {
    return {
      invoiceTemplate: null,
      teamMember: [],
      issueInvoice: "immediately",
      specificDate: null,
      selectedTime: null,
      description: "",
      charCount: 0,
      charLimit: 1000,
      rows: [getEmptyRow()],
      subtotal: "0.00",
      taxRate: "0",
      taxTotal: "0.00",
      totalAmount: "0.00",
      clientNote: "",
    };
  }
console.log("logindata",logindata);
  // Get selected users objects from stored IDs
  // const getSelectedUsers = () => {
  //   if (
  //     !formData.general.teamMembers ||
  //     formData.general.teamMembers.length === 0
  //   ) {
  //     return [];
  //   }

  //   return formData.general.teamMembers.map((userId) => {
  //     const user = internalOptions.find((opt) => opt.value === userId);
  //     return user || { value: userId, label: `User ${userId}` };
  //   });
  // };
 // Get selected users objects from stored IDs or default to logged-in user
  const getSelectedUsers = () => {
    let selectedIds = formData.general.teamMembers;

    // If no teamMembers stored, default to logged-in user
    // If no teamMembers stored, default to logged-in user
  if (!selectedIds || selectedIds.length === 0) {
    selectedIds = logindata?.user?.id ? [logindata.user.id] : [];
  }

    return selectedIds.map((userId) => {
      const user = internalOptions.find((opt) => opt.value === userId);
      return user || { value: userId, label: `User ${userId}` };
    });
  };
  // Handle team member selection
  const handleTeamMembersChange = ( newSelectedUsers) => {
    const selectedValues = newSelectedUsers.map((user) => user.value);

    updateFormData("general", {
      teamMembers: selectedValues,
    });
  };

  const handleInputChange = (field, value) => {
    updateFormData("general", { [field]: value });

    // Clear error when user starts typing
    if (value && value.toString().trim() !== "" && stepErrors[field]) {
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

  const handleAccountChange = (selectedAccounts) => {
    updateFormData("general", {
      account: selectedAccounts || [],
    });

    // Remove error if any account selected
    if (selectedAccounts?.length > 0 && stepErrors.account) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.account;
        return newErrors;
      });
    }
  };

  const getCurrentTemplateValue = () => {
    if (!formData.general.template && formData.general.proposalTemp) {
      // If we have proposalTemp but no template object, find the matching template
      const foundTemplate = templates.find(
        (t) => t._id === formData.general.proposalTemp
      );
      if (foundTemplate) {
        return {
          value: foundTemplate._id,
          label:
            foundTemplate.general?.templateName ||
            foundTemplate.general?.proposalName ||
            "Unnamed Template",
        };
      }
    }
    return formData.general.template || null;
  };
  // FIXED: Improved template change handler
  const handleTemplateChange = (event, selectedTemplate) => {
    console.log("Selected template:", selectedTemplate);

    if (selectedTemplate) {
      // Update template reference
      updateFormData("general", {
        template: selectedTemplate,
        proposalTemp: selectedTemplate?.value,
      });
      console.log("updateFormData", selectedTemplate?.value);
      // Fetch and apply template data
      fetchTemplateData(selectedTemplate.value);
    } else {
      // Clear template if deselected
      clearTemplateData();
    }

    // Clear error when template is selected
    if (selectedTemplate && stepErrors.template) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.template;
        return newErrors;
      });
    }
  };

  // FIXED: Improved clear template function
  const clearTemplateData = () => {
    // Reset only template-related fields, keep other general settings
    updateFormData("general", {
      ...formData.general,
      template: null,
      proposalTemp: "",
      proposalName: "",
      teamMembers: [],
      introductionEnabled: false,
      termsEnabled: false,
      servicesEnabled: false,
    });

    // Clear other sections but preserve visibility settings
    updateFormData("introduction", {
      title: "",
      description: "",
    });

    updateFormData("terms", {
      title: "",
      description: "",
    });

    updateFormData("services", {
      option: "",
      invoices: [{ id: 1, ...getEmptyInvoice() }],
      itemizedData: {
        price: 0,
        name: "",
        rows: [getEmptyRow()],
        subtotal: "0.00",
        taxRate: "0",
        taxTotal: "0.00",
        totalAmount: "0.00",
      },
    });

    updateFormData("payments", {
      method: "",
      amount: 0,
    });
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
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(name, e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        <span className="text-base font-semibold text-foreground">{title}</span>
      </div>
      <div className="flex items-start gap-1.5 ml-7">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );

  // Prepare options for autocomplete
  const accountOptions = accounts.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

  const templateOptions = templates.map((template) => ({
    value: template._id,
    label: template.general.templateName,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">General Information</h2>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading template data...</span>
        </div>
      )}

      <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-4">
        <h3 className="text-base font-semibold text-primary mb-3">Basic Details</h3>

        {/* Account Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Select Account *</label>
          <CreatableSelect
            isMulti
            options={accountOptions}
            value={formData.general.account || []}
            onChange={(value) => handleAccountChange(value || [])}
            placeholder="Search for an account..."
            styles={{
              control: (provided) => ({ ...provided, borderColor: stepErrors.account ? 'red' : '#e2e8f0', borderRadius: '0.5rem', minHeight: '40px', fontSize: '0.875rem' }),
              menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
          {stepErrors.account && <p className="text-xs text-red-500">{stepErrors.account}</p>}
        </div>

        {/* Template Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Select Template (Optional)</label>
          <CreatableSelect
            isClearable
            options={templateOptions}
            value={getCurrentTemplateValue()}
            onChange={(selected) => handleTemplateChange(null, selected)}
            placeholder="Search for a template..."
            styles={{
              control: (provided) => ({ ...provided, borderColor: stepErrors.proposalTemp ? 'red' : '#e2e8f0', borderRadius: '0.5rem', minHeight: '40px', fontSize: '0.875rem' }),
              menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
          <p className="text-xs text-muted-foreground">{stepErrors.proposalTemp || 'Choose a template to pre-fill the proposal'}</p>
        </div>

        {/* Proposal Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Proposal name (visible to clients) *</label>
          <input
            type="text"
            value={formData.general.proposalName || ""}
            onChange={(e) => { handleInputChange("proposalName", e.target.value); handleTextFieldClick(); }}
            onClick={handleTextFieldClick}
            ref={textFieldRef}
            placeholder="Proposal name (visible to clients)"
            required
            className={`flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${stepErrors.proposalName ? 'border-destructive' : 'border-input'}`}
          />
          {stepErrors.proposalName && <p className="text-xs text-destructive">{stepErrors.proposalName}</p>}
        </div>

        {/* Shortcode Button + Dropdown */}
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

        {/* Team Members */}
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
          <StepCard
            title="Payment Step"
            description="Configure payment methods and terms for your proposal."
            checked={formData.general.paymentsEnabled || false}
            onChange={handleVisibilityChange}
            name="paymentsEnabled"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralStep;
