import React, { useState,useEffect } from 'react';
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
  Alert,CircularProgress,FormControl,InputLabel,FormHelperText,Autocomplete,Grid
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

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
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        borderColor: checked ? 'primary.main' : 'grey.300',
        borderWidth: checked ? 2 : 1,
        backgroundColor: checked ? 'primary.50' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: 1
        }
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
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
          sx={{ width: '100%', mb: 1 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: 6 }}>
          <InfoOutlined 
            sx={{ 
              fontSize: 16, 
              color: 'text.secondary', 
              mr: 1, 
              mt: 0.25 
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading...</Typography>
        </Box>
      )}

      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Basic Details
        </Typography>
        
        {/* Account Selection */}
        <FormControl fullWidth error={!!stepErrors.account} sx={{ mb: 3 }}>
          {/* <InputLabel sx={{ color: "black" }}>Select Account *</InputLabel> */}
          <Autocomplete
            options={accountOptions}
            value={formData.general.account || null}
            onChange={(event, value) => handleAccountChange(value)}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
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
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body1">{option.label}</Typography>
                
                </Box>
              </li>
            )}
          />
          {stepErrors.account && (
            <FormHelperText error>{stepErrors.account}</FormHelperText>
          )}
        </FormControl>

        {/* Template Selection */}
        <FormControl fullWidth error={!!stepErrors.template} sx={{ mb: 3 }}>
          {/* <InputLabel sx={{ color: "black" }}>Select Template (Optional)</InputLabel> */}
          <Autocomplete
            options={templateOptions}
            value={formData.general.template || null}
            onChange={(event, value) => handleTemplateChange(value)}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Template (Optional)"
                error={!!stepErrors.proposalTemp}
                helperText={stepErrors.proposalTemp || "Choose a template to pre-fill the proposal"}
                placeholder="Search for a template..."
              />
            )}
            loading={loading}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body1">{option.label}</Typography>
                  {option.general?.proposalName && (
                    <Typography variant="body2" color="text.secondary">
                      Proposal: {option.general.proposalName}
                    </Typography>
                  )}
                </Box>
              </li>
            )}
          />
          {stepErrors.proposalTemp && (
            <FormHelperText error>{stepErrors.proposalTemp}</FormHelperText>
          )}
        </FormControl>

        {/* Proposal Name - This will be auto-filled when template is selected */}
        <TextField
          fullWidth
          label="Proposal Name *"
          value={formData.general.proposalName || ''}
          onChange={(e) => handleInputChange('proposalName', e.target.value)}
          onBlur={() => handleBlur('proposalName')}
          error={!!stepErrors.proposalName}
          helperText={stepErrors.proposalName || "Enter a name for this proposal"}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />

       
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Configure Proposal Steps
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize which steps to include in your proposal. Each step helps communicate different aspects of your service to clients.
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




