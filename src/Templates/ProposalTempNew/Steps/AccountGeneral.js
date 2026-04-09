import React, { useState,useEffect } from 'react';
import { Info } from 'lucide-react';
import Select from 'react-select';

const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL || 'https://www.snptaxes.com';
const GeneralStep = ({ formData, updateFormData, nextStep, stepErrors, setStepErrors }) => {
  const [touched, setTouched] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch accounts and templates on component mount
  useEffect(() => {
    fetchAccounts();
    fetchTemplates();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ACCOUNT_API}/accounts/account/accountdetailslist/true`);
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      setAccounts(data.accountlist || data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9000/api/proposals');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data.proposallist || data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateData = async (templateId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9000/api/proposals/${templateId}`);
      if (!response.ok) throw new Error('Failed to fetch template data');
      const templateData = await response.json();
      
      console.log("Template data received:", templateData);
      
      // Transform the template data using your existing transform functions
      const transformedData = transformTemplateToForm(templateData);
      
      // Update all form sections with the transformed template data
      updateFormData('general', {
        ...formData.general,
        proposalTemp: templateData.general?.proposalTemp || '',
        proposalName: templateData.general?.proposalName || '', // Set proposal name from template
        introductionEnabled: templateData.general?.introductionEnabled ?? true,
        termsEnabled: templateData.general?.termsEnabled ?? true,
        servicesEnabled: templateData.general?.servicesEnabled ?? true,
        paymentsEnabled: templateData.general?.paymentsEnabled ?? false,
      });

      // Update other sections with transformed template data
      if (transformedData.introduction) {
        updateFormData('introduction', transformedData.introduction);
      }

      if (transformedData.terms) {
        updateFormData('terms', transformedData.terms);
      }

      if (transformedData.services) {
        updateFormData('services', transformedData.services);
      }

      if (transformedData.payments) {
        updateFormData('payments', transformedData.payments);
      }
  // Clear all step errors after template data is loaded
    setStepErrors({});
    } catch (error) {
      console.error('Error fetching template data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform template data to form structure using your existing functions
  const transformTemplateToForm = (templateData) => {
    console.log("Transforming template data:", templateData);
    
    return {
      general: {
        skipStepper: templateData.general?.skipStepper || false,
        introductionEnabled: templateData.general?.introductionEnabled ?? true,
        termsEnabled: templateData.general?.termsEnabled ?? true,
        servicesEnabled: templateData.general?.servicesEnabled ?? true,
        paymentsEnabled: templateData.general?.paymentsEnabled ?? false,
        proposalTemp: templateData.general?.proposalTemp || '',
        proposalName: templateData.general?.proposalName || '',
        account: templateData.general?.account || null,
      },
      introduction: {
        title: templateData.introduction?.title || '',
        description: templateData.introduction?.description || '',
      },
      terms: {
        title: templateData.terms?.title || '',
        description: templateData.terms?.description || '',
      },
      services: {
        option: templateData.services?.option || "",
        invoices: transformInvoicesForForm(templateData.services?.invoices || []),
        itemizedData: transformItemizedDataForForm(templateData.services?.itemizedData)
      },
      payments: {
        method: templateData.payments?.method || '',
        amount: templateData.payments?.amount || 0,
      },
    };
  };
   const [invoiceTemplates, setInvoiceTemplates] = useState([]);
   const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';
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
    useEffect(() => {
      fetchInvoiceTemplates();
      // fetchTeamMembers();
      // fetchServiceData();
    }, []);
  // Your existing transform functions
  const transformInvoicesForForm = (invoices) => {
    if (!invoices || invoices.length === 0) {
      return [{ id: 1, ...getEmptyInvoice() }];
    }

    console.log("Transforming invoices:", invoices);
    console.log("Available templates:", invoiceTemplates);

    return invoices.map((invoice, index) => {
      const template = invoiceTemplates.find(t => t._id === invoice.invoiceTemplate);
      
      return {
        id: index + 1,
        invoiceTemplate: invoice.invoiceTemplate ? {
          value: invoice.invoiceTemplate,
          label: template?.templatename || 'Template'
        } : null,
        teamMember: invoice.teamMember || null,
        issueInvoice: 'immediately',
        specificDate: null,
        selectedTime: null,
        description: invoice.description || '',
        charCount: invoice.description?.length || 0,
        charLimit: 1000,
        rows: transformLineItemsToRows(invoice.lineItems || []),
        subtotal: invoice.subtotal?.toString() || '0.00',
        taxRate: invoice.taxRate?.toString() || '0',
        taxTotal: invoice.taxTotal?.toString() || '0.00',
        totalAmount: invoice.totalAmount?.toString() || '0.00',
        clientNote: '',
      };
    });
  };

  const transformLineItemsToRows = (lineItems) => {
    if (!lineItems || lineItems.length === 0) {
      return [getEmptyRow()];
    }
    
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

  // Helper functions
  function getEmptyRow() {
    return {
      productorService: '',
      description: '',
      rate: '0.00',
      quantity: '1',
      amount: '0.00',
      tax: false,
      isDiscount: false,
    };
  }

  function getEmptyInvoice() {
    return {
      invoiceTemplate: null,
      teamMember: null,
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

  const handleInputChange = (field, value) => {
    updateFormData('general', { [field]: value });
    
    // Clear error when user starts typing
    if (value && value.toString().trim() !== '' && stepErrors[field]) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // const handleAccountChange = (selectedAccount) => {
  //   updateFormData('general', { account: selectedAccount });
    
  //   // Clear error when account is selected
  //   if (selectedAccount && stepErrors.account) {
  //     setStepErrors(prev => {
  //       const newErrors = { ...prev };
  //       delete newErrors.account;
  //       return newErrors;
  //     });
  //   }
  // };
const handleAccountChange = (selectedAccount) => {
  updateFormData('general', { 
    account: selectedAccount,              // For display in Autocomplete
    accountId: selectedAccount?.value || "" // For backend submission
  });

  if (selectedAccount && stepErrors.account) {
    setStepErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.account;
      return newErrors;
    });
  }
};

  const handleTemplateChange = (selectedTemplate) => {
    console.log("Selected template:", selectedTemplate);
    
    // Update template reference and set template name
    updateFormData('general', { 
      template: selectedTemplate,
       proposalTemp: selectedTemplate?.value || "",
      templateName: selectedTemplate?.templateName || selectedTemplate?.label || '' 
    });
    
    // Clear error when template is selected
    if (selectedTemplate && stepErrors.template) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.template;
        return newErrors;
      });
    }

    // Fetch template data if a template is selected
    if (selectedTemplate && selectedTemplate.value) {
      fetchTemplateData(selectedTemplate.value);
    } else {
      // Clear form data if template is cleared
      clearTemplateData();
    }
  };

  const clearTemplateData = () => {
    // Reset form data to empty state
    updateFormData('general', {
      ...formData.general,
      proposalTemp: '',
      proposalName: '', // Clear proposal name too
      introductionEnabled: true,
      termsEnabled: true,
      servicesEnabled: true,
      paymentsEnabled: false,
    });

    updateFormData('introduction', {
      title: '',
      description: '',
    });

    updateFormData('terms', {
      title: '',
      description: '',
    });

    updateFormData('services', {
      option: "",
      invoices: [{ id: 1, ...getEmptyInvoice() }],
      itemizedData: {
        price: 0,
        name: '',
        rows: [getEmptyRow()],
        subtotal: '0.00',
        taxRate: '0',
        taxTotal: '0.00',
        totalAmount: '0.00'
      },
    });

    updateFormData('payments', {
      method: '',
      amount: 0,
    });
  };

  const handleVisibilityChange = (field, value) => {
    updateFormData('general', { [field]: value });
  };

  const StepCard = ({ title, description, checked, onChange, name }) => (
    <div className={`rounded-xl border p-4 mb-3 transition-all hover:shadow-sm ${checked ? 'border-indigo-400 bg-indigo-50/50 border-2' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-3 mb-2">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(name, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
        <span className="text-base font-semibold text-slate-800">{title}</span>
      </div>
      <div className="flex items-start gap-1.5 ml-7">
        <Info className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );

  // Prepare options for autocomplete
  const accountOptions = accounts.map(account => ({
    value: account.id,
    label: account.Name,
    // ...account
  }));

  const templateOptions = templates.map(template => ({
    value: template._id,
    label: template.general?.templateName || template.general?.proposalName || 'Unnamed Template',
    templateName: template.general?.templateName,
    proposalName: template.general?.proposalName,
    ...template
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-indigo-600">General Information</h2>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="text-sm text-slate-500">Loading...</span>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
        <h3 className="text-base font-semibold text-indigo-600 mb-3">Basic Details</h3>

        {/* Account Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Select Account *</label>
          <Select
            options={accountOptions}
            value={formData.general.account || null}
            onChange={(value) => handleAccountChange(value)}
            isClearable
            placeholder="Search for an account..."
            isLoading={loading}
            styles={{
              control: (provided) => ({ ...provided, borderColor: stepErrors.account ? 'red' : '#e2e8f0', borderRadius: '0.5rem', minHeight: '38px', fontSize: '0.875rem' }),
              menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
          {stepErrors.account && <p className="text-xs text-red-500">{stepErrors.account}</p>}
        </div>

        {/* Template Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Select Template (Optional)</label>
          <Select
            options={templateOptions}
            value={formData.general.template || null}
            onChange={(value) => handleTemplateChange(value)}
            isClearable
            placeholder="Search for a template..."
            isLoading={loading}
            styles={{
              control: (provided) => ({ ...provided, borderColor: stepErrors.proposalTemp ? 'red' : '#e2e8f0', borderRadius: '0.5rem', minHeight: '38px', fontSize: '0.875rem' }),
              menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
          <p className="text-xs text-slate-400">{stepErrors.proposalTemp || 'Choose a template to pre-fill the proposal'}</p>
        </div>

        {/* Proposal Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Proposal Name *</label>
          <input
            type="text"
            value={formData.general.proposalName || ''}
            onChange={(e) => handleInputChange('proposalName', e.target.value)}
            onBlur={() => handleBlur('proposalName')}
            placeholder="Enter a name for this proposal"
            required
            className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${stepErrors.proposalName ? 'border-red-400' : 'border-slate-200'}`}
          />
          <p className="text-xs text-slate-400">{stepErrors.proposalName || 'Enter a name for this proposal'}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-indigo-600 mb-2">Configure Proposal Steps</h3>
        <p className="text-xs text-slate-500 mb-4">
          Customize which steps to include in your proposal. Each step helps communicate different aspects of your service to clients.
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




