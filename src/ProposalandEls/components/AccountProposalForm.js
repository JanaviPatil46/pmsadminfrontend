import React, { useState, useEffect ,useContext} from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Container,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { ArrowBack, NavigateNext, NavigateBefore } from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../Sidebar/Context/Context";
// Import your step components (make sure they're also converted to MUI)
import GeneralStep from "../Steps/AccountGeneral";
import IntroductionStep from "../Steps/IntroductionStep";
import TermsStep from "../Steps/TermsStep";
import ServicesInvoicesStep from "../Steps/ServicesInvoicesStep";
import PaymentStep from "../Steps/PaymentStep";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const ProposalForm = () => {
  const { data } = useParams();

  console.log("accountid", data);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepErrors, setStepErrors] = useState({});
  const [formData, setFormData] = useState({
    general: {
      skipStepper: false,
      introductionEnabled: true,
      termsEnabled: true,
      servicesEnabled: true,
      paymentsEnabled: false,
      proposalTemp: "",
      account: [],
      proposalName: "",
      teamMembers: [],
    },
    introduction: {
      title: "",
      description: "",
    },
    terms: {
      title: "",
      description: "",
    },
    services: {
      option: "",
      invoices: [],
      itemizedData: {
        price: 0,
        name: "",
        rows: [getEmptyRow()],
        subtotal: "0.00",
        taxRate: "0",
        taxTotal: "0.00",
        totalAmount: "0.00",
      },
    },
    payments: {
      method: "",
      amount: 0,
    },
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("edit");
  const LOGIN_API =
    process.env.REACT_APP_USER_LOGIN || "https://www.snptaxes.com";

  // Helper function for empty row
  function getEmptyRow() {
    return {
      productName: "",
      description: "",
      rate: "0.00",
      qty: "1",
      amount: "0.00",
      tax: false,
      isDiscount: false,
    };
  }

  function getEmptyInvoice() {
    return {
      invoiceTemplate: null,
      teamMembers: [],
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

  // Fetch proposal data if editing
  useEffect(() => {
    if (proposalId) {
      fetchProposalData();
    }
  }, [proposalId]);

  const ACCOUNT_API =
    process.env.REACT_APP_ACCOUNTS_URL || "https://www.snptaxes.com";
    const fetchProposalData = async () => {
  try {
    setLoading(true);
    setError("");
    const response = await fetch(
      `https://www.snptaxes.com/account/proposals/${proposalId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch proposal");
    }
    const data = await response.json();

    // Fetch accounts and templates first, then transform data
    const [accountsResponse, templatesResponse] = await Promise.all([
      fetch(
        "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
      ),
      fetch("https://www.snptaxes.com/api/proposals"),
    ]);

    const accountsData = await accountsResponse.json();
    const templatesData = await templatesResponse.json();

    // FIXED: Handle different account response formats
    let accounts = [];
    if (Array.isArray(accountsData)) {
      accounts = accountsData;
    } else if (Array.isArray(accountsData.accounts)) {
      accounts = accountsData.accounts;
    } else if (Array.isArray(accountsData.accountlist)) {
      accounts = accountsData.accountlist;
    } else if (Array.isArray(accountsData.teamAccounts)) {
      accounts = accountsData.teamAccounts;
    }
    
    console.log("Accounts data for transform:", accounts);

    // FIXED: Handle different template response formats
    let templates = [];
    if (Array.isArray(templatesData)) {
      templates = templatesData;
    } else if (Array.isArray(templatesData.proposallist)) {
      templates = templatesData.proposallist;
    } else if (Array.isArray(templatesData.templates)) {
      templates = templatesData.templates;
    }

    // Transform the data with accounts and templates
    const transformedData = transformDataForForm(data, accounts, templates);
    setFormData(transformedData);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching proposal:", error);
    setError("Error loading proposal: " + error.message);
    setLoading(false);
  }
};
// Transform API data back to form structure
const transformDataForForm = (apiData, accounts = [], templates = []) => {
  console.log("API Data received:", apiData);
  console.log("Accounts for transform:", accounts);
  console.log("Templates for transform:", templates);

  // Ensure accounts is an array
  if (!Array.isArray(accounts)) {
    console.warn("Accounts is not an array, converting to array");
    accounts = [];
  }

  // Ensure templates is an array
  if (!Array.isArray(templates)) {
    console.warn("Templates is not an array, converting to array");
    templates = [];
  }

  // Find the account object based on IDs
  let accountObj = null;
  const accountId = apiData.general?.account;
  
  if (accountId && Array.isArray(accounts)) {
    accountObj = accounts.find(
      (acc) => acc.id === accountId || acc._id === accountId
    );
  }

  // Find the template object based on IDs
  let templateObj = null;
  const templateId = apiData.general?.proposalTemp;
  
  if (templateId && Array.isArray(templates)) {
    templateObj = templates.find(
      (temp) => temp._id === templateId || temp.id === templateId
    );
  }

  // Handle multiple accounts (if needed)
  const accountArray = Array.isArray(accountId) ? accountId : [accountId];
  const selectedAccounts = accountArray
    .filter(id => id)
    .map(id => {
      const acc = accounts.find(a => a.id === id || a._id === id);
      return {
        value: id,
        label: acc?.Name || acc?.accountName || "Account",
      };
    });

  return {
    general: {
      skipStepper: apiData.general?.skipStepper || false,
      introductionEnabled: apiData.general?.introductionEnabled ?? true,
      termsEnabled: apiData.general?.termsEnabled ?? true,
      servicesEnabled: apiData.general?.servicesEnabled ?? true,
      paymentsEnabled: apiData.general?.paymentsEnabled ?? false,
      proposalTemp: templateId || "",
      proposalName: apiData.general?.proposalName || "",
      // Use selectedAccounts array for multiple accounts
      account: selectedAccounts,
      // Template object for Autocomplete
      template: templateId ? {
        value: templateId,
        label: templateObj?.general?.templateName || 
               templateObj?.general?.proposalName || 
               "Template"
      } : null,
      teamMembers: apiData.general?.teamMembers || [],
    },
    introduction: {
      title: apiData.introduction?.title || "",
      description: apiData.introduction?.description || "",
    },
    terms: {
      title: apiData.terms?.title || "",
      description: apiData.terms?.description || "",
    },
    services: {
      option: apiData.services?.option || "",
      invoices: transformInvoicesForForm(apiData.services?.invoices || []),
      itemizedData: transformItemizedDataForForm(
        apiData.services?.itemizedData
      ),
    },
    payments: {
      method: apiData.payments?.method || "",
      amount: apiData.payments?.amount || 0,
    },
  };
};
  // const fetchProposalData = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");
  //     const response = await fetch(
  //       `https://www.snptaxes.com/account/proposals/${proposalId}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch proposal");
  //     }
  //     const data = await response.json();

  //     // Fetch accounts and templates first, then transform data
  //     const [accountsResponse, templatesResponse] = await Promise.all([
  //       fetch(
  //         "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
  //       ),
  //       fetch("https://www.snptaxes.com/api/proposals"),
  //     ]);

  //     const accountsData = await accountsResponse.json();
  //     const templatesData = await templatesResponse.json();

  //     const accounts = accountsData.accounts || accountsData || [];
  //     const templates = templatesData.proposallist || templatesData || [];

  //     // Transform the data with accounts and templates
  //     const transformedData = transformDataForForm(data, accounts, templates);
  //     setFormData(transformedData);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching proposal:", error);
  //     setError("Error loading proposal: " + error.message);
  //     setLoading(false);
  //   }
  // };

  // Transform API data back to form structure
  // const transformDataForForm = (apiData, accounts = [], templates = []) => {
  //   console.log("API Data received:", apiData);

  //   // Find the account and template objects based on IDs
  //   const accountObj = accounts.find(
  //     (acc) =>
  //       acc.id === apiData.general?.account ||
  //       acc._id === apiData.general?.account
  //   );
  //   const templateObj = templates.find(
  //     (temp) => temp._id === apiData.general?.proposalTemp
  //   );

  //   return {
  //     general: {
  //       skipStepper: apiData.general?.skipStepper || false,
  //       introductionEnabled: apiData.general?.introductionEnabled ?? true,
  //       termsEnabled: apiData.general?.termsEnabled ?? true,
  //       servicesEnabled: apiData.general?.servicesEnabled ?? true,
  //       paymentsEnabled: apiData.general?.paymentsEnabled ?? false,
  //       proposalTemp: apiData.general?.proposalTemp || "",
  //       proposalName: apiData.general?.proposalName || "",
  //       // Transform account and template to Autocomplete format
  //       account: apiData.general?.account
  //         ? {
  //             value: apiData.general.account,
  //             label: accountObj?.Name || "Account",
  //           }
  //         : null,
  //       template: apiData.general?.proposalTemp
  //         ? {
  //             value: apiData.general.proposalTemp,
  //             label:
  //               templateObj?.general?.proposalTemp ||
  //               templateObj?.general?.proposalName ||
  //               "Template",
  //           }
  //         : null,
  //       teamMembers: apiData.general?.teamMembers || [],
  //     },
  //     introduction: {
  //       title: apiData.introduction?.title || "",
  //       description: apiData.introduction?.description || "",
  //     },
  //     terms: {
  //       title: apiData.terms?.title || "",
  //       description: apiData.terms?.description || "",
  //     },
  //     services: {
  //       option: apiData.services?.option || "",
  //       invoices: transformInvoicesForForm(apiData.services?.invoices || []),
  //       itemizedData: transformItemizedDataForForm(
  //         apiData.services?.itemizedData
  //       ),
  //     },
  //     payments: {
  //       method: apiData.payments?.method || "",
  //       amount: apiData.payments?.amount || 0,
  //     },
  //   };
  // };
  // Transform line items to rows format
  const transformLineItemsToRows = (lineItems) => {
    if (!lineItems || lineItems.length === 0) {
      return [getEmptyRow()];
    }
    console.log("Transforming line items to rows:", lineItems);

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

  // Update the transformInvoicesForForm to handle invoiceTemplate properly
  const transformInvoicesForForm = (invoices, invoiceTemplates = []) => {
    if (!invoices || invoices.length === 0) {
      return [{ id: 1, ...getEmptyInvoice() }];
    }

    console.log("Transforming invoices:", invoices);
    console.log("Available templates:", invoiceTemplates);

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

  // Transform itemized data for form
  const transformItemizedDataForForm = (itemizedData) => {
    console.log("Itemized data from API:", itemizedData);

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

  // Get available steps based on visibility settings and service option
  const getAvailableSteps = () => {
    const steps = [
      {
        name: "General",
        component: GeneralStep,
        key: "general",
        alwaysVisible: true,
      },
    ];

    if (formData.general.introductionEnabled) {
      steps.push({
        name: "Introduction",
        component: IntroductionStep,
        key: "introduction",
      });
    }

    if (formData.general.termsEnabled) {
      steps.push({ name: "Terms", component: TermsStep, key: "terms" });
    }

    if (formData.general.servicesEnabled) {
      steps.push({
        name: "Services & Invoices",
        component: ServicesInvoicesStep,
        key: "services",
      });
    }

    if (
      formData.general.paymentsEnabled &&
      formData.services.option === "invoice"
    ) {
      steps.push({ name: "Payment", component: PaymentStep, key: "payments" });
    }

    return steps;
  };

  const availableSteps = getAvailableSteps();

  const updateFormData = (section, newData) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...newData },
    }));
  };

  // Validation functions for each step
  const validateStep = (stepIndex) => {
    const stepKey = availableSteps[stepIndex]?.key;
    let isValid = true;
    const newErrors = {};

    switch (stepKey) {
      case "general":
        if (!formData.general.proposalName?.trim()) {
          newErrors.proposalName = "Proposal name is required";
          isValid = false;
        }

        break;

      case "introduction":
        if (!formData.introduction?.title?.trim()) {
          newErrors.title = "Introduction title is required";
          isValid = false;
        }
        if (
          !formData.introduction?.description?.trim() ||
          formData.introduction.description.replace(/<[^>]*>/g, "").trim() ===
            ""
        ) {
          newErrors.description = "Introduction description is required";
          isValid = false;
        }
        break;

      case "terms":
        if (!formData.terms?.title?.trim()) {
          newErrors.title = "Terms title is required";
          isValid = false;
        }
        if (
          !formData.terms?.description?.trim() ||
          formData.terms.description.replace(/<[^>]*>/g, "").trim() === ""
        ) {
          newErrors.description = "Terms and conditions are required";
          isValid = false;
        }
        break;

      case "services":
        if (!formData.services.option) {
          newErrors.option = "Please select an option";
          isValid = false;
        }

        break;
    }

    setStepErrors((prev) => ({
      ...prev,
      [stepKey]: newErrors,
    }));

    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < availableSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      // Scroll to top to show error messages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // Check if a step has errors for the stepper
  const hasStepError = (stepKey) => {
    return stepErrors[stepKey] && Object.keys(stepErrors[stepKey]).length > 0;
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < availableSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const handleBackToList = () => {
    const accountId = Cookies.get("accountId");
    navigate(`/clients/accounts/accountsdash/proposals/${accountId}`);
  };

  const isLastStep = currentStep === availableSteps.length - 1;

  // Transform invoice data before sending
  const transformInvoiceData = (invoices) => {
    return invoices.map((invoice) => ({
      ...invoice,
      invoiceTemplate:
        invoice.invoiceTemplate?.value || invoice.invoiceTemplate,
      teamMembers: invoice.teamMembers?.value || invoice.teamMembers,
      lineItems:
        invoice.rows?.map((row) => ({
          productorService: String(row.productorService),
          description: row.description,
          rate: parseFloat(row.rate) || 0,
          quantity: parseFloat(row.quantity) || 0,
          amount: parseFloat(row.amount) || 0,
          tax: Boolean(row.tax),
        })) || [],
    }));
  };

  // Transform itemized data for submission
  const transformItemizedData = (itemizedData) => {
    if (!itemizedData) return null;

    return {
      ...itemizedData,
      price: parseFloat(itemizedData.price) || 0,
      lineItems:
        itemizedData.rows?.map((row) => ({
          productorService: String(row.productorService),
          description: row.description,
          rate: parseFloat(row.rate) || 0,
          quantity: parseFloat(row.quantity) || 0,
          amount: parseFloat(row.amount) || 0,
          tax: Boolean(row.tax),
        })) || [],
      subtotal: parseFloat(itemizedData.subtotal) || 0,
      taxRate: parseFloat(itemizedData.taxRate) || 0,
      taxTotal: parseFloat(itemizedData.taxTotal) || 0,
      totalAmount: parseFloat(itemizedData.totalAmount) || 0,
    };
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting proposal...");
      setError("");
      //  const accountId = formData.general.account?.value ;
      const accountIds =
        formData.general.account?.map((acc) => acc.value) || [];
      const templateId = formData.general.template?.value;
      // Comprehensive validation before submission
      const validationErrors = validateAllSteps();

      if (Object.keys(validationErrors).length > 0) {
        console.log("Validation errors found:", validationErrors);
        setStepErrors(validationErrors);

        // Find the first step with errors and navigate to it
        const firstErrorStep = findFirstErrorStep(validationErrors);
        if (firstErrorStep !== -1) {
          setCurrentStep(firstErrorStep);
        }

        // Scroll to top to show error messages
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Prepare data for submission
      const submissionData = {
        ...formData,
        general: {
          ...formData.general,
          account: accountIds, // ✅ Send only ID
          proposalTemp: templateId, // ✅ Send only ID
        },
        services: {
          ...formData.services,
          invoices:
            formData.services.option === "invoice"
              ? transformInvoiceData(formData.services.invoices)
              : [],
          itemizedData:
            formData.services.option === "services"
              ? transformItemizedData(formData.services.itemizedData)
              : null,
        },
        status: "Pending",
      };

      console.log("Submitting data:", submissionData);

      const url = proposalId
        ? `https://www.snptaxes.com/account/proposals/${proposalId}`
        : "https://www.snptaxes.com/account/proposals";

      const method = proposalId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const result = await response.json();
        // Show success message (you can replace this with a snackbar/toast)
        setError("");
        // alert(proposalId ? 'Proposal updated successfully!' : 'Proposal submitted successfully!');
        toast.success(
          proposalId
            ? "Proposal updated successfully!"
            : "Proposal submitted successfully!"
        );
        console.log(
          proposalId ? "Updated proposal:" : "Created proposal:",
          result
        );

        // Navigate back to the proposals list
        navigate(`/clients/accounts/accountsdash/proposals/${data}`);
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        setError("Error submitting proposal: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error submitting proposal: " + error.message);
    }
  };

  // Comprehensive validation for all steps
  const validateAllSteps = () => {
    const errors = {};
    const availableSteps = getAvailableSteps();

    availableSteps.forEach((step, index) => {
      const stepKey = step.key;
      const stepErrors = validateStepData(stepKey, formData);

      if (Object.keys(stepErrors).length > 0) {
        errors[stepKey] = stepErrors;
      }
    });

    return errors;
  };

  // Validate data for a specific step
  const validateStepData = (stepKey, formData) => {
    const stepErrors = {};

    switch (stepKey) {
      case "general":
        if (!formData.general.proposalName?.trim()) {
          stepErrors.proposalName = "Proposal name is required";
        }
        // if (!formData.general.templateName?.trim()) {
        //   stepErrors.templateName = 'Template name is required';
        // }
        if (
          !formData.general.teamMembers ||
          formData.general.teamMembers.length === 0
        ) {
          stepErrors.teamMembers = "At least one team member is required";
        }
        break;

      case "introduction":
        if (!formData.introduction?.title?.trim()) {
          stepErrors.title = "Introduction title is required";
        }
        if (
          !formData.introduction?.description?.trim() ||
          formData.introduction.description.replace(/<[^>]*>/g, "").trim() ===
            ""
        ) {
          stepErrors.description = "Introduction description is required";
        }
        break;

      case "terms":
        if (!formData.terms?.title?.trim()) {
          stepErrors.title = "Terms title is required";
        }
        if (
          !formData.terms?.description?.trim() ||
          formData.terms.description.replace(/<[^>]*>/g, "").trim() === ""
        ) {
          stepErrors.description = "Terms and conditions are required";
        }
        break;

      case "services":
        if (!formData.services.option) {
          stepErrors.option = "Please select an option";
        } else {
          // Additional validation based on selected option
          if (formData.services.option === "invoice") {
            // Validate invoices
            if (
              !formData.services.invoices ||
              formData.services.invoices.length === 0
            ) {
              stepErrors.invoices = "At least one invoice is required";
            } else {
              // Validate each invoice
              formData.services.invoices.forEach((invoice, index) => {
                if (!invoice.invoiceTemplate) {
                  stepErrors[`invoice_${index}_template`] =
                    `Invoice ${index + 1}: Template is required`;
                }
                if (!invoice.teamMembers || invoice.teamMembers.length === 0) {
                  stepErrors[`invoice_${index}_teamMembers`] =
                    `Invoice ${index + 1}: At least one team member is required`;
                }
                if (!invoice.description?.trim()) {
                  stepErrors[`invoice_${index}_description`] =
                    `Invoice ${index + 1}: Description is required`;
                }

                // Validate line items
                if (!invoice.rows || invoice.rows.length === 0) {
                  stepErrors[`invoice_${index}_rows`] =
                    `Invoice ${index + 1}: At least one line item is required`;
                } else {
                  invoice.rows.forEach((row, rowIndex) => {
                    if (!row.productorService?.trim()) {
                      stepErrors[`invoice_${index}_row_${rowIndex}_product`] =
                        `Invoice ${index + 1}, Row ${rowIndex + 1}: Product/Service name is required`;
                    }
                    if (parseFloat(row.rate) <= 0) {
                      stepErrors[`invoice_${index}_row_${rowIndex}_rate`] =
                        `Invoice ${index + 1}, Row ${rowIndex + 1}: Rate must be greater than 0`;
                    }
                  });
                }
              });
            }
          } else if (formData.services.option === "services") {
            // Validate itemized data
            const itemized = formData.services.itemizedData;
            // if (!itemized?.name?.trim()) {
            //   stepErrors.itemizedName = 'Service name is required';
            // }
            // if (parseFloat(itemized?.price) <= 0) {
            //   stepErrors.itemizedPrice = 'Price must be greater than 0';
            // }
            if (!itemized?.rows || itemized.rows.length === 0) {
              stepErrors.itemizedRows = "At least one line item is required";
            } else {
              itemized.rows.forEach((row, index) => {
                if (!row.productorService?.trim()) {
                  stepErrors[`itemized_row_${index}_product`] =
                    `Row ${index + 1}: Product/Service name is required`;
                }
                // if (parseFloat(row.rate) <= 0) {
                //   stepErrors[`itemized_row_${index}_rate`] = `Row ${index + 1}: Rate must be greater than 0`;
                // }
              });
            }
          }
        }
        break;

      case "payments":
        if (!formData.payments?.method?.trim()) {
          stepErrors.method = "Payment method is required";
        }
        if (parseFloat(formData.payments?.amount) <= 0) {
          stepErrors.amount = "Payment amount must be greater than 0";
        }
        break;
    }

    return stepErrors;
  };

  // Find the first step that has errors
  const findFirstErrorStep = (validationErrors) => {
    const availableSteps = getAvailableSteps();

    for (let i = 0; i < availableSteps.length; i++) {
      const stepKey = availableSteps[i].key;
      if (
        validationErrors[stepKey] &&
        Object.keys(validationErrors[stepKey]).length > 0
      ) {
        return i;
      }
    }

    return -1;
  };
  const CurrentStepComponent = availableSteps[currentStep]?.component;
  const currentStepKey = availableSteps[currentStep]?.key;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading proposal data...
        </Typography>
      </Box>
    );
  }

  if (!CurrentStepComponent) {
    const recalculatedSteps = getAvailableSteps();
    if (currentStep >= recalculatedSteps.length) {
      setCurrentStep(0);
    }
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "white", color: "text.primary" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBackToList}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {proposalId
              ? `Edit Proposal: ${formData.general.proposalName}`
              : "Create New Proposal"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={currentStep}>
            {availableSteps.map((step, index) => (
              <Step key={step.key}>
                <StepLabel
                  onClick={() => goToStep(index)}
                  sx={{ cursor: "pointer" }}
                  error={hasStepError(step.key)}
                >
                  {step.name}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Paper elevation={1} sx={{ p: 4 }}>
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={currentStep}
            totalSteps={availableSteps.length}
            currentStepKey={currentStepKey}
            handleSubmit={handleSubmit}
            isLastStep={isLastStep}
            isEditing={!!proposalId}
            stepErrors={stepErrors[currentStepKey] || {}}
            setStepErrors={(errors) =>
              setStepErrors((prev) => ({ ...prev, [currentStepKey]: errors }))
            }
          />
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            startIcon={<NavigateBefore />}
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outlined"
          >
            Previous
          </Button>

          <Button
            endIcon={isLastStep ? null : <NavigateNext />}
            onClick={nextStep}
            variant="contained"
            color="primary"
          >
            {isLastStep
              ? proposalId
                ? "Update Proposal"
                : "Submit Proposal"
              : "Next"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProposalForm;
