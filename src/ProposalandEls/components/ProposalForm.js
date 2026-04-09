

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Import your step components (make sure they're also converted to MUI)
import GeneralStep from '../Steps/GeneralStep';
import IntroductionStep from '../Steps/IntroductionStep';
import TermsStep from '../Steps/TermsStep';
import ServicesInvoicesStep from '../Steps/ServicesInvoicesStep';
import PaymentStep from '../Steps/PaymentStep';
import { toast } from 'react-toastify';

const ProposalForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepErrors, setStepErrors] = useState({});
  const [formData, setFormData] = useState({
    general: {
      skipStepper: false,
      introductionEnabled: true,
      termsEnabled: true,
      servicesEnabled: true,
      paymentsEnabled: false,
      templateName: '',
      proposalName: '',
      teamMembers:[]
    },
    introduction: {
      title: '',
      description: '',
    },
    terms: {
      title: '',
      description: '',
    },
    services: {
      option: "",
      invoices: [],
      itemizedData: {
        price: 0,
        name: '',
        rows: [getEmptyRow()],
        subtotal: '0.00',
        taxRate: '0',
        taxTotal: '0.00',
        totalAmount: '0.00'
      },
    },
    payments: {
      method: '',
      amount: 0,
    },
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('edit');
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN || 'https://www.snptaxes.com';

  // Helper function for empty row
  function getEmptyRow() {
    return {
      productName: '',
      description: '',
      rate: '0.00',
      qty: '1',
      amount: '0.00',
      tax: false,
      isDiscount: false,
    };
  }

  function getEmptyInvoice() {
    return {
      invoiceTemplate: null,
      teamMembers: [], // Changed to teamMembers array
      issueInvoice: 'immediately',
      specificDate: null,
      selectedTime: null,
      description: '',
      charCount: 0,
      charLimit: 1000,
      rows: [getEmptyRow()],
      subtotal: '0.00',
      taxRate: '0',
      taxTotal: '0.00',
      totalAmount: '0.00',
      clientNote: '',
    };
  }

  // Fetch proposal data if editing
  useEffect(() => {
    if (proposalId) {
      fetchProposalData();
    }
  }, [proposalId]);

  // Fetch team members for transformation
  const fetchTeamMembers = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      return data.map(user => ({
        value: user._id,
        label: user.username,
      }));
    } catch (error) {
      console.error("Error fetching team members:", error);
      return [];
    }
  };

  const fetchProposalData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`https://www.snptaxes.com/api/proposals/${proposalId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch proposal');
      }
      const data = await response.json();
      
      // Fetch team members first, then transform data
      const teamMemberOptions = await fetchTeamMembers();
      
      // Transform the data back to match our form structure
      const transformedData = transformDataForForm(data, teamMemberOptions);
      setFormData(transformedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching proposal:', error);
      setError('Error loading proposal: ' + error.message);
      setLoading(false);
    }
  };

  // Transform API data back to form structure
  const transformDataForForm = (apiData, teamMemberOptions = []) => {
    console.log("API Data received:", apiData);
    
    return {
      general: {
        skipStepper: apiData.general?.skipStepper || false,
        introductionEnabled: apiData.general?.introductionEnabled ?? true,
        termsEnabled: apiData.general?.termsEnabled ?? true,
        servicesEnabled: apiData.general?.servicesEnabled ?? true,
        paymentsEnabled: apiData.general?.paymentsEnabled ?? false,
        templateName: apiData.general?.templateName || '',
        proposalName: apiData.general?.proposalName || '',
        teamMembers: apiData.general?.teamMembers || [],
      },
      introduction: {
        title: apiData.introduction?.title || '',
        description: apiData.introduction?.description || '',
      },
      terms: {
        title: apiData.terms?.title || '',
        description: apiData.terms?.description || '',
      },
      services: {
        option: apiData.services?.option || "",
        invoices: transformInvoicesForForm(apiData.services?.invoices || [], teamMemberOptions),
        itemizedData: transformItemizedDataForForm(apiData.services?.itemizedData) || {}
      },
      payments: {
        method: apiData.payments?.method || '',
        amount: apiData.payments?.amount || 0,
      },
    };
  };

  // Transform team member IDs to objects for form
  const transformTeamMembersForForm = (teamMemberIds, teamMemberOptions) => {
    if (!teamMemberIds || teamMemberIds.length === 0) {
      return [];
    }
    
    return teamMemberIds.map(userId => {
      const user = teamMemberOptions.find(opt => opt.value === userId);
      return user || { value: userId, label: `User ${userId}` };
    });
  };

  // Transform line items to rows format
  const transformLineItemsToRows = (lineItems) => {
    if (!lineItems || lineItems.length === 0) {
      return [getEmptyRow()];
    }
    console.log("Transforming line items to rows:", lineItems);
    
    return lineItems.map(item => ({
      productorService: item.productorService || '',
      description: item.description || '',
      rate: item.rate?.toString() || '0.00',
      quantity: item.quantity?.toString() || '1',
      amount: item.amount?.toString() || '0.00',
      tax: item.tax || false,
      isDiscount: false,
    }));
  };

  // Update the transformInvoicesForForm to handle teamMembers properly
  const transformInvoicesForForm = (invoices, teamMemberOptions = []) => {
    if (!invoices || invoices.length === 0) {
      return [{ id: 1, ...getEmptyInvoice() }];
    }

    console.log("Transforming invoices:", invoices);

    return invoices.map((invoice, index) => {
      return {
        id: index + 1,
        invoiceTemplate: invoice.invoiceTemplate ? {
          value: invoice.invoiceTemplate,
          label: 'Template' // You might want to fetch template names here too
        } : null,
        teamMembers: transformTeamMembersForForm(invoice.teamMembers || [], teamMemberOptions),
        issueInvoice: invoice.issueInvoice || 'immediately',
        specificDate: invoice.specificDate || null,
        selectedTime: invoice.selectedTime || null,
        description: invoice.description || '',
        charCount: invoice.description?.length || 0,
        charLimit: 1000,
        rows: transformLineItemsToRows(invoice.lineItems || []),
        subtotal: invoice.subtotal?.toString() || '0.00',
        taxRate: invoice.taxRate?.toString() || '0',
        taxTotal: invoice.taxTotal?.toString() || '0.00',
        totalAmount: invoice.totalAmount?.toString() || '0.00',
        clientNote: invoice.clientNote || '',
      };
    });
  };

  // Transform itemized data for form
  const transformItemizedDataForForm = (itemizedData) => {
    console.log("Itemized data from API:", itemizedData);
    
    if (!itemizedData) {
      return {
        price: 0,
        name: '',
        rows: [getEmptyRow()],
        subtotal: '0.00',
        taxRate: '0',
        taxTotal: '0.00',
        totalAmount: '0.00'
      };
    }

    return {
      ...itemizedData,
      price: itemizedData.price || 0,
      name: itemizedData.name || '',
      rows: transformLineItemsToRows(itemizedData.lineItems),
      subtotal: itemizedData.subtotal?.toString() || '0.00',
      taxRate: itemizedData.taxRate?.toString() || '0',
      taxTotal: itemizedData.taxTotal?.toString() || '0.00',
      totalAmount: itemizedData.totalAmount?.toString() || '0.00'
    };
  };

  // Get available steps based on visibility settings and service option
  const getAvailableSteps = () => {
    const steps = [
      { name: 'General', component: GeneralStep, key: 'general', alwaysVisible: true }
    ];

    if (formData.general.introductionEnabled) {
      steps.push({ name: 'Introduction', component: IntroductionStep, key: 'introduction' });
    }

    if (formData.general.termsEnabled) {
      steps.push({ name: 'Terms', component: TermsStep, key: 'terms' });
    }

    if (formData.general.servicesEnabled) {
      steps.push({ name: 'Services & Invoices', component: ServicesInvoicesStep, key: 'services' });
    }

    if (formData.general.paymentsEnabled && formData.services.option === 'invoice') {
      steps.push({ name: 'Payment', component: PaymentStep, key: 'payments' });
    }

    return steps;
  };

  const availableSteps = getAvailableSteps();

  const updateFormData = (section, newData) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...newData }
    }));
  };

  // Validation functions for each step
  const validateStep = (stepIndex) => {
    const stepKey = availableSteps[stepIndex]?.key;
    let isValid = true;
    const newErrors = {};

    switch (stepKey) {
      case 'general':
        if (!formData.general.proposalName?.trim()) {
          newErrors.proposalName = 'Proposal name is required';
          isValid = false;
        }
        if (!formData.general.templateName?.trim()) {
          newErrors.templateName = 'Template name is required';
          isValid = false;
        }
        break;

      case 'introduction':
        if (!formData.introduction?.title?.trim()) {
          newErrors.title = 'Introduction title is required';
          isValid = false;
        }
        if (!formData.introduction?.description?.trim() || 
            formData.introduction.description.replace(/<[^>]*>/g, '').trim() === '') {
          newErrors.description = 'Introduction description is required';
          isValid = false;
        }
        break;

      case 'terms':
        if (!formData.terms?.title?.trim()) {
          newErrors.title = 'Terms title is required';
          isValid = false;
        }
        if (!formData.terms?.description?.trim() || 
            formData.terms.description.replace(/<[^>]*>/g, '').trim() === '') {
          newErrors.description = 'Terms and conditions are required';
          isValid = false;
        }
        break;

      case 'services':
        if (!formData.services.option) {
          newErrors.option = 'Please select an option';
          isValid = false;
        } 
        break;
    }

    setStepErrors(prev => ({
      ...prev,
      [stepKey]: newErrors
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    navigate('/firmtemp/templates/proposals');
  };

  const isLastStep = currentStep === availableSteps.length - 1;

  // Transform team members for submission (extract only IDs)
  const transformTeamMembersForSubmission = (teamMembers) => {
    return teamMembers.map(user => user.value);
  };

  // Transform invoice data before sending
  const transformInvoiceData = (invoices) => {
    return invoices.map(invoice => ({
      ...invoice,
      invoiceTemplate: invoice.invoiceTemplate?.value || invoice.invoiceTemplate,
      teamMembers: transformTeamMembersForSubmission(invoice.teamMembers || []),
      lineItems: invoice.rows?.map(row => ({
        productorService: String(row.productorService),
        description: row.description,
        rate: parseFloat(row.rate) || 0,
        quantity: parseFloat(row.quantity) || 0,
        amount: parseFloat(row.amount) || 0,
        tax: Boolean(row.tax)
      })) || []
    }));
  };

  // Transform itemized data for submission
  const transformItemizedData = (itemizedData) => {
    if (!itemizedData) return null;
    
    return {
      ...itemizedData,
      price: parseFloat(itemizedData.price) || 0,
      lineItems: itemizedData.rows?.map(row => ({
        productorService: String(row.productorService),
        description: row.description,
        rate: parseFloat(row.rate) || 0,
        quantity: parseFloat(row.quantity) || 0,
        amount: parseFloat(row.amount) || 0,
        tax: Boolean(row.tax)
      })) || [],
      subtotal: parseFloat(itemizedData.subtotal) || 0,
      taxRate: parseFloat(itemizedData.taxRate) || 0,
      taxTotal: parseFloat(itemizedData.taxTotal) || 0,
      totalAmount: parseFloat(itemizedData.totalAmount) || 0
    };
  };

  // const handleSubmit = async () => {
  //   try {
  //     console.log("Submitting proposal...");
  //     setError('');
      
  //     // Prepare data for submission
  //     const submissionData = {
  //       ...formData,
       
  //       services: {
  //         ...formData.services,
  //         invoices: formData.services.option === 'invoice' ? transformInvoiceData(formData.services.invoices) : [],
  //         itemizedData: formData.services.option === 'services' ? transformItemizedData(formData.services.itemizedData) : null
  //       }
  //     };

  //     console.log("Submitting data:", submissionData);

  //     const url = proposalId 
  //       ? `http://localhost:9000/api/proposals/${proposalId}`
  //       : 'http://localhost:9000/api/proposals';
      
  //     const method = proposalId ? 'PUT' : 'POST';

  //     const response = await fetch(url, {
  //       method: method,
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(submissionData),
  //     });
      
  //     if (response.ok) {
  //       const result = await response.json();
  //       // Show success message (you can replace this with a snackbar/toast)
  //       setError('');
  //       alert(proposalId ? 'Proposal updated successfully!' : 'Proposal submitted successfully!');
  //       console.log(proposalId ? 'Updated proposal:' : 'Created proposal:', result);
        
  //       // Navigate back to the proposals list
  //       navigate('/');
  //     } else {
  //       const errorText = await response.text();
  //       console.error('Server error:', errorText);
  //       setError('Error submitting proposal: ' + errorText);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setError('Error submitting proposal: ' + error.message);
  //   }
  // };
const handleSubmit = async () => {
  try {
    console.log("Submitting proposal...");
    setError('');
    
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      services: {
        ...formData.services,
        invoices: formData.services.option === 'invoice' ? transformInvoiceData(formData.services.invoices) : [],
        itemizedData: formData.services.option === 'services' ? transformItemizedData(formData.services.itemizedData) : {}
      }
    };

    console.log("Submitting data:", submissionData);

    const url = proposalId 
      ? `https://www.snptaxes.com/api/proposals/${proposalId}`
      : 'https://www.snptaxes.com/api/proposals';
    
    const method = proposalId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });
    
    if (response.ok) {
      const result = await response.json();
      // Show success message (you can replace this with a snackbar/toast)
      setError('');
      // alert(proposalId ? 'Proposal updated successfully!' : 'Proposal submitted successfully!');
      toast.success(proposalId ? 'Proposal updated successfully!' : 'Proposal submitted successfully!');
      console.log(proposalId ? 'Updated proposal:' : 'Created proposal:', result);
      
      // Navigate back to the proposals list
      navigate('/firmtemp/templates/proposals');
    } else {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      setError('Error submitting proposal: ' + errorText);
    }
  } catch (error) {
    console.error('Error:', error);
    setError('Error submitting proposal: ' + error.message);
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
    case 'general':
      if (!formData.general.proposalName?.trim()) {
        stepErrors.proposalName = 'Proposal name is required';
      }
      if (!formData.general.templateName?.trim()) {
        stepErrors.templateName = 'Template name is required';
      }
      if (!formData.general.teamMembers || formData.general.teamMembers.length === 0) {
        stepErrors.teamMembers = 'At least one team member is required';
      }
      break;

    case 'introduction':
      if (!formData.introduction?.title?.trim()) {
        stepErrors.title = 'Introduction title is required';
      }
      if (!formData.introduction?.description?.trim() || 
          formData.introduction.description.replace(/<[^>]*>/g, '').trim() === '') {
        stepErrors.description = 'Introduction description is required';
      }
      break;

    case 'terms':
      if (!formData.terms?.title?.trim()) {
        stepErrors.title = 'Terms title is required';
      }
      if (!formData.terms?.description?.trim() || 
          formData.terms.description.replace(/<[^>]*>/g, '').trim() === '') {
        stepErrors.description = 'Terms and conditions are required';
      }
      break;

    case 'services':
      if (!formData.services.option) {
        stepErrors.option = 'Please select an option';
      } else {
        // Additional validation based on selected option
        if (formData.services.option === 'invoice') {
          // Validate invoices
          if (!formData.services.invoices || formData.services.invoices.length === 0) {
            stepErrors.invoices = 'At least one invoice is required';
          } else {
            // Validate each invoice
            formData.services.invoices.forEach((invoice, index) => {
              if (!invoice.invoiceTemplate) {
                stepErrors[`invoice_${index}_template`] = `Invoice ${index + 1}: Template is required`;
              }
              if (!invoice.teamMembers || invoice.teamMembers.length === 0) {
                stepErrors[`invoice_${index}_teamMembers`] = `Invoice ${index + 1}: At least one team member is required`;
              }
              if (!invoice.description?.trim()) {
                stepErrors[`invoice_${index}_description`] = `Invoice ${index + 1}: Description is required`;
              }
              
              // Validate line items
              if (!invoice.rows || invoice.rows.length === 0) {
                stepErrors[`invoice_${index}_rows`] = `Invoice ${index + 1}: At least one line item is required`;
              } else {
                invoice.rows.forEach((row, rowIndex) => {
                  if (!row.productorService?.trim()) {
                    stepErrors[`invoice_${index}_row_${rowIndex}_product`] = `Invoice ${index + 1}, Row ${rowIndex + 1}: Product/Service name is required`;
                  }
                  if (parseFloat(row.rate) <= 0) {
                    stepErrors[`invoice_${index}_row_${rowIndex}_rate`] = `Invoice ${index + 1}, Row ${rowIndex + 1}: Rate must be greater than 0`;
                  }
                });
              }
            });
          }
        } else if (formData.services.option === 'services') {
          // Validate itemized data
          const itemized = formData.services.itemizedData;
          // if (!itemized?.name?.trim()) {
          //   stepErrors.itemizedName = 'Service name is required';
          // }
          // if (parseFloat(itemized?.price) <= 0) {
          //   stepErrors.itemizedPrice = 'Price must be greater than 0';
          // }
          if (!itemized?.rows || itemized.rows.length === 0) {
            stepErrors.itemizedRows = 'At least one line item is required';
          } 
          else {
            itemized.rows.forEach((row, index) => {
              if (!row.productorService?.trim()) {
                stepErrors[`itemized_row_${index}_product`] = `Row ${index + 1}: Product/Service name is required`;
              }
              // if (parseFloat(row.rate) <= 0) {
              //   stepErrors[`itemized_row_${index}_rate`] = `Row ${index + 1}: Rate must be greater than 0`;
              // }
            });
          }
        }
      }
      break;

    case 'payments':
      if (!formData.payments?.method?.trim()) {
        stepErrors.method = 'Payment method is required';
      }
      if (parseFloat(formData.payments?.amount) <= 0) {
        stepErrors.amount = 'Payment amount must be greater than 0';
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
    if (validationErrors[stepKey] && Object.keys(validationErrors[stepKey]).length > 0) {
      return i;
    }
  }
  
  return -1;
};

// Remove the individual step validation functions since we're handling it globally
// Remove validateStep function and step validation from nextStep function

// const nextStep = () => {
//   // Only proceed to next step without validation
//   if (currentStep < availableSteps.length - 1) {
//     setCurrentStep(currentStep + 1);
//   } else {
//     handleSubmit(); // Validation will happen in handleSubmit
//   }
// };
  const CurrentStepComponent = availableSteps[currentStep]?.component;
  const currentStepKey = availableSteps[currentStep]?.key;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <span className="text-base font-medium text-slate-500">Loading proposal data...</span>
      </div>
    );
  }

  if (!CurrentStepComponent) {
    const recalculatedSteps = getAvailableSteps();
    if (currentStep >= recalculatedSteps.length) {
      setCurrentStep(0);
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-sm text-slate-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button onClick={handleBackToList} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 truncate">
            {proposalId ? `Edit Proposal: ${formData.general.proposalName}` : 'Create New Proposal'}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Stepper */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <nav aria-label="Progress">
            <ol className="flex items-center flex-wrap gap-y-3">
              {availableSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const hasError = hasStepError(step.key);
                return (
                  <li key={step.key} className="flex items-center">
                    <button
                      onClick={() => goToStep(index)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : isCompleted
                          ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          : hasError
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                      }`}
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isCompleted
                          ? 'bg-indigo-600 text-white'
                          : hasError
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-300 text-white'
                      }`}>
                        {isCompleted ? <Check className="h-3.5 w-3.5" /> : hasError ? <AlertCircle className="h-3.5 w-3.5" /> : index + 1}
                      </span>
                      <span className="hidden sm:inline">{step.name}</span>
                    </button>
                    {index < availableSteps.length - 1 && (
                      <ChevronRight className="mx-1 h-4 w-4 text-slate-300 shrink-0" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
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
            setStepErrors={(errors) => setStepErrors(prev => ({ ...prev, [currentStepKey]: errors }))}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <button
            onClick={nextStep}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]"
          >
            {isLastStep ? (proposalId ? 'Update Proposal' : 'Submit Proposal') : 'Next'}
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProposalForm;