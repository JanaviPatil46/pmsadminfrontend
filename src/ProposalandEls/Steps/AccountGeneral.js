import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Card,
  CardContent,
  Chip,
  Checkbox,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
  Grid,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useParams } from "react-router-dom";

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
  //     const url =
  //       "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setAccounts(data.accounts);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
    const fetchAccounts = async () => {
    try {
      const url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
      const response = await fetch(url);
      const result = await response.json();

      if (Array.isArray(result.accounts)) {
        setAccounts(result.accounts);
        console.log("All accounts:", result.accounts);

        // Auto-select account if data from useParams is available
        console.log("Looking for account ID:", data);
        const selectedAccountData = result.accounts.find(
          (account) => account._id === data
        );
        console.log("Found account:", selectedAccountData);
        
        // if (selectedAccountData) {
        //   const selectedAccount = {
        //     label: selectedAccountData.accountName,
        //     value: selectedAccountData._id,
        //   };
          
        //   // Update form data with the selected account
        //   updateFormData("general", {
        //     account: selectedAccount,
        //     accountId: selectedAccount.value
        //   });

        //   // Clear any existing account error
        //   if (stepErrors.account) {
        //     setStepErrors((prev) => {
        //       const newErrors = { ...prev };
        //       delete newErrors.account;
        //       return newErrors;
        //     });
        //   }
          
        //   console.log("Auto-selected account:", selectedAccount);
        // } 
     if (selectedAccountData) {
  const selectedAccount = {
    label: selectedAccountData.accountName,
    value: selectedAccountData._id,
  };

  // ✅ wrap inside array
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
}
   else {
          console.warn("No account found with ID:", data);
        }
      } else {
        console.error("Account list is not an array", result.accounts);
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
  const handleTeamMembersChange = (event, newSelectedUsers) => {
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

  // const handleAccountChange = (selectedAccount) => {
  //   updateFormData("general", {
  //     account: selectedAccount,
  //     accountId: selectedAccount?.value || "",
  //   });

  //   if (selectedAccount && stepErrors.account) {
  //     setStepErrors((prev) => {
  //       const newErrors = { ...prev };
  //       delete newErrors.account;
  //       return newErrors;
  //     });
  //   }
  // };
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

  const StepCard = ({ title, description, checked, onChange, name }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderColor: checked ? "primary.main" : "grey.300",
        borderWidth: checked ? 2 : 1,
        backgroundColor: checked ? "primary.50" : "background.paper",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={(e) => onChange(name, e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="h6" component="span" color="text.primary">
              {title}
            </Typography>
          }
          sx={{ width: "100%", mb: 1 }}
        />
        <Box sx={{ display: "flex", alignItems: "flex-start", ml: 6 }}>
          <InfoOutlined
            sx={{
              fontSize: 16,
              color: "text.secondary",
              mr: 1,
              mt: 0.25,
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
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
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        color="primary"
        fontWeight="600"
        sx={{ mb: 4 }}
      >
        General Information
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading template data...</Typography>
        </Box>
      )}

      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: "grey.50" }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Basic Details
        </Typography>

        {/* Account Selection */}
        <FormControl fullWidth error={!!stepErrors.account} sx={{ mb: 3 }}>
          {/* <Autocomplete
          // disabled
           multiple
            options={accountOptions}
            value={formData.general.account || []}
            onChange={(event, value) => handleAccountChange(value)}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Account *"
                error={!!stepErrors.account}
                helperText={stepErrors.account}
                placeholder="Search for an account..."
              />
            )}
            loading={loading}
          /> */}
          <Autocomplete
  multiple
  options={accountOptions}
  value={formData.general.account || []}
  onChange={(event, value) => handleAccountChange(value)}
  isOptionEqualToValue={(option, value) =>
    option?.value === value?.value
  }
  getOptionLabel={(option) => option?.label || ""}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Account *"
      error={!!stepErrors.account}
      helperText={stepErrors.account}
      placeholder="Search for an account..."
    />
  )}
  loading={loading}
/>

        </FormControl>

        {/* Template Selection */}
        <FormControl fullWidth error={!!stepErrors.template} sx={{ mb: 3 }}>
          <Autocomplete

            options={templateOptions}
            // value={formData.general.template || null}
            value={getCurrentTemplateValue()}
            onChange={handleTemplateChange}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Template (Optional)"
                error={!!stepErrors.proposalTemp}
                helperText={
                  stepErrors.proposalTemp ||
                  "Choose a template to pre-fill the proposal"
                }
                placeholder="Search for a template..."
              />
            )}
            loading={loading}
          />
        </FormControl>

        {/* Proposal Name */}
        <TextField
          fullWidth
          label="Proposal Name *"
          value={formData.general.proposalName || ""}
          onChange={(e) => handleInputChange("proposalName", e.target.value)}
          onBlur={() => handleBlur("proposalName")}
          error={!!stepErrors.proposalName}
          helperText={
            stepErrors.proposalName || "Enter a name for this proposal"
          }
          margin="normal"
          required
          sx={{ mb: 2 }}
        />

        {/* Team Members */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Team Members *
          </Typography>
          <Autocomplete
            multiple
            options={internalOptions}
            value={getSelectedUsers()}
            onChange={handleTeamMembersChange}
            loading={loading}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select team members..."
                variant="outlined"
                error={!!stepErrors.teamMembers}
                helperText={
                  stepErrors.teamMembers ||
                  "Select team members who will be involved in this proposal"
                }
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={{ mr: 1 }} />
                <Typography variant="body2">{option.label}</Typography>
              </li>
            )}
          />
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider" }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Configure Proposal Steps
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize which steps to include in your proposal. Each step helps
          communicate different aspects of your service to clients.
        </Typography>

        <FormGroup>
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
        </FormGroup>
      </Paper>
    </Box>
  );
};

export default GeneralStep;
