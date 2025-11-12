

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText
} from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';

import InvoiceComponent from './InvoiceComponent';
import ServicesComponent from './ServicesComponent';

const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';
const SERVICE_API = process.env.REACT_APP_SERVICES_URL || 'https://www.snptaxes.com';


// const ServicesInvoicesStep = ({ 
//   formData, 
//   updateFormData, 
//   nextStep, 
//   prevStep, 
//   handleSubmit, 
//   isLastStep,
//   stepErrors,
//   setStepErrors
// }) => {
//   const [invoices, setInvoices] = useState(formData.services.invoices || [{ id: 1, ...getEmptyInvoice() }]);
//   const [invoiceTemplates, setInvoiceTemplates] = useState([]);
//   const [teammemberoption, setTeammemberoption] = useState([]);
//   const [servicedata, setServiceData] = useState([]);
//   const [touched, setTouched] = useState({});

//   function getEmptyInvoice() {
//     return {
//       invoiceTemplate: null,
//       teamMember: null,
//       issueInvoice: 'immediately',
//       specificDate: null,
//       selectedTime: null,
//       description: '',
//       charCount: 0,
//       charLimit: 1000,
//       rows: [getEmptyRow()],
//       subtotal: '0.00',
//       taxRate: '0',
//       taxTotal: '0.00',
//       totalAmount: '0.00',
//       clientNote: '',
//     };
//   }

//   function getEmptyRow() {
//     return {
//       productorService: '',
//       description: '',
//       rate: '0.00',
//       quantity: '1',
//       amount: '0.00',
//       tax: false,
//       isDiscount: false,
//     };
//   }

//   // Fetch initial data - runs once on mount
//   useEffect(() => {
//     fetchInvoiceTemplates();
//     fetchTeamMembers();
//     fetchServiceData();
//   }, []);

//   // Initialize invoices from formData - runs when formData.services.invoices changes
//   useEffect(() => {
//     if (formData.services.invoices && formData.services.invoices.length > 0) {
//       setInvoices(formData.services.invoices);
//     }
//   }, [formData.services.invoices]);

//   // Sync invoices with parent form data - runs when invoices change
//   useEffect(() => {
//     updateFormData('services', { 
//       option: formData.services.option,
//       invoices: invoices,
//       itemizedData: formData.services.itemizedData
//     });
//   }, [invoices]);

//   // Auto-enable payments when invoice option is selected
//   useEffect(() => {
//     if (formData.services.option === 'invoice') {
//       updateFormData('general', { paymentsEnabled: true });
//     } else {
//       updateFormData('general', { paymentsEnabled: false });
//     }
//   }, [formData.services.option]);

//   // Clear option error when option is selected
//   useEffect(() => {
//     if (formData.services.option && stepErrors.option) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.option;
//         return newErrors;
//       });
//     }
//   }, [formData.services.option]);

//   // Validate invoices when they change
//   // useEffect(() => {
//   //   if (formData.services.option === 'invoice' && invoices.length > 0) {
//   //     validateInvoices();
//   //   }
//   // }, [invoices, formData.services.option]);

//   // Validate itemized data when it changes
//   useEffect(() => {
//     if (formData.services.option === 'services' && formData.services.itemizedData) {
//       validateItemizedData();
//     }
//   }, [formData.services.itemizedData, formData.services.option]);

//   // Memoized service options to prevent unnecessary recalculations
//   const serviceoptions = useMemo(() => {
//     return servicedata.map((service) => ({
//       value: service._id,
//       label: service.serviceName,
//     }));
//   }, [servicedata]);

//   const fetchInvoiceTemplates = async () => {
//     try {
//       const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch templates");
//       const result = await response.json();
//       setInvoiceTemplates(result.invoiceTemplate || result || []);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const fetchTeamMembers = async () => {
//     // Implement your team members fetch logic
//     setTeammemberoption([]); // Placeholder
//   };

//   const fetchServiceData = async () => {
//     try {
//       const url = `${SERVICE_API}/workflow/services/servicetemplate`;
//       const response = await fetch(url);
//       const data = await response.json();
//       console.log(data.serviceTemplate);
//       setServiceData(data.serviceTemplate);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Validate invoice data
//   const validateInvoices = () => {
//     const newErrors = { ...stepErrors };
    
//     if (formData.services.option === 'invoice') {
//       if (!invoices || invoices.length === 0) {
//         newErrors.invoices = 'At least one invoice is required';
//       } else {
//         // Check each invoice for required fields
//         const invoiceErrors = invoices.map((invoice, index) => {
//           const invoiceError = {};
          
//           if (!invoice.invoiceTemplate) {
//             invoiceError.invoiceTemplate = 'Invoice template is required';
//           }
          
//           if (!invoice.teamMember) {
//             invoiceError.teamMember = 'Team member is required';
//           }
          
//           // Validate line items
//           if (!invoice.rows || invoice.rows.length === 0) {
//             invoiceError.rows = 'At least one line item is required';
//           } else {
//             const rowErrors = invoice.rows.map((row, rowIndex) => {
//               const rowError = {};
//               if (!row.productorService?.trim()) {
//                 rowError.productorService = 'Product/Service name is required';
//               }
//               if (!row.rate || parseFloat(row.rate) <= 0) {
//                 rowError.rate = 'Valid rate is required';
//               }
//               if (!row.quantity || parseFloat(row.quantity) <= 0) {
//                 rowError.quantity = 'Valid quantity is required';
//               }
//               return Object.keys(rowError).length > 0 ? rowError : null;
//             }).filter(Boolean);
            
//             if (rowErrors.length > 0) {
//               invoiceError.lineItems = 'Please fix line item errors';
//             }
//           }
          
//           return Object.keys(invoiceError).length > 0 ? invoiceError : null;
//         }).filter(Boolean);
        
//         if (invoiceErrors.length > 0) {
//           newErrors.invoiceDetails = 'Please fix invoice errors';
//         } else {
//           delete newErrors.invoices;
//           delete newErrors.invoiceDetails;
//         }
//       }
//     }
    
//     setStepErrors(newErrors);
//   };

//   // Validate itemized data
//   const validateItemizedData = () => {
//     const newErrors = { ...stepErrors };
//     const itemizedData = formData.services.itemizedData || {};
    
//     if (formData.services.option === 'services') {
//       if (!itemizedData.rows || itemizedData.rows.length === 0) {
//         newErrors.itemized = 'At least one line item is required';
//       } else {
//         const rowErrors = itemizedData.rows.map((row, index) => {
//           const rowError = {};
//           if (!row.productorService?.trim()) {
//             rowError.productorService = 'Product/Service name is required';
//           }
//           if (!row.rate || parseFloat(row.rate) <= 0) {
//             rowError.rate = 'Valid rate is required';
//           }
//           if (!row.quantity || parseFloat(row.quantity) <= 0) {
//             rowError.quantity = 'Valid quantity is required';
//           }
//           return Object.keys(rowError).length > 0 ? rowError : null;
//         }).filter(Boolean);
        
//         // if (rowErrors.length > 0) {
//         //   newErrors.itemizedDetails = 'Please fix line item errors';
//         // } else {
//         //   delete newErrors.itemized;
//         //   delete newErrors.itemizedDetails;
//         // }
//       }
//     }
    
//     setStepErrors(newErrors);
//   };

//   const handleServiceTypeChange = (option) => {
//     // Clear all errors when option changes
//     setStepErrors({});
//     setTouched({});
//     updateFormData('services', { option });
//   };

//   const handleOptionBlur = () => {
//     setTouched(prev => ({ ...prev, option: true }));
//   };

//   // Check if the step has any validation errors
//   const hasStepErrors = () => {
//     return Object.keys(stepErrors).length > 0;
//   };

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom color="primary" fontWeight="600" sx={{ mb: 4 }}>
//         Services & Invoices
//       </Typography>

//       {/* Show general step errors */}
//       {/* {hasStepErrors() && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           Please fix the validation errors before proceeding.
//           {stepErrors.option && <Box>- {stepErrors.option}</Box>}
//           {stepErrors.invoices && <Box>- {stepErrors.invoices}</Box>}
//           {stepErrors.invoiceDetails && <Box>- {stepErrors.invoiceDetails}</Box>}
//           {stepErrors.itemized && <Box>- {stepErrors.itemized}</Box>}
//           {stepErrors.itemizedDetails && <Box>- {stepErrors.itemizedDetails}</Box>}
//         </Alert>
//       )} */}

//       <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
//         <FormControl 
//           component="fieldset" 
//           error={!!stepErrors.option} 
//           fullWidth
//           onBlur={handleOptionBlur}
//         >
//           <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
//             Select Option *
//           </FormLabel>
//           <RadioGroup
//             value={formData.services.option || ''}
//             onChange={(e) => handleServiceTypeChange(e.target.value)}
//             sx={{ gap: 2 }}
//           >
//             <Paper 
//               variant="outlined" 
//               sx={{ 
//                 p: 2, 
//                 borderColor: formData.services.option === 'invoice' ? 'primary.main' : 'grey.300',
//                 backgroundColor: formData.services.option === 'invoice' ? 'primary.50' : 'background.paper',
//                 borderWidth: formData.services.option === 'invoice' ? 2 : 1,
//                 ...(stepErrors.option && formData.services.option !== 'invoice' ? {
//                   borderColor: 'error.main',
//                   backgroundColor: 'error.light'
//                 } : {})
//               }}
//             >
//               <FormControlLabel
//                 value="invoice"
//                 control={<Radio />}
//                 label={
//                   <Box>
//                     <Typography variant="subtitle1" fontWeight="600">
//                       Add Invoice
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                      Create one-time or recurring invoice, or ask for deposit to sign
//                     </Typography>
//                   </Box>
//                 }
//                 sx={{ width: '100%', m: 0 }}
//               />
//             </Paper>
            
//             <Paper 
//               variant="outlined" 
//               sx={{ 
//                 p: 2,
//                 borderColor: formData.services.option === 'services' ? 'primary.main' : 'grey.300',
//                 backgroundColor: formData.services.option === 'services' ? 'primary.50' : 'background.paper',
//                 borderWidth: formData.services.option === 'services' ? 2 : 1,
//                 ...(stepErrors.option && formData.services.option !== 'services' ? {
//                   borderColor: 'error.main',
//                   backgroundColor: 'error.light'
//                 } : {})
//               }}
//             >
//               <FormControlLabel
//                 value="services"
//                 control={<Radio />}
//                 label={
//                   <Box>
//                     <Typography variant="subtitle1" fontWeight="600">
//                       Itemized Services
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       No invoice or deposit request will be created
//                     </Typography>
//                   </Box>
//                 }
//                 sx={{ width: '100%', m: 0 }}
//               />
//             </Paper>
//           </RadioGroup>
//           {stepErrors.option && (
//             <FormHelperText error>{stepErrors.option}</FormHelperText>
//           )}
//         </FormControl>
//       </Paper>

//       {formData.services.option === 'invoice' && (
//         <InvoiceComponent
//           invoices={invoices}
//           setInvoices={setInvoices}
//           invoiceTemplates={invoiceTemplates}
//           teammemberoption={teammemberoption}
//           serviceoptions={serviceoptions}
//           formData={formData}
//           updateFormData={updateFormData}
//           stepErrors={stepErrors}
//           setStepErrors={setStepErrors}
//         />
//       )}

//       {formData.services.option === 'services' && (
//         <ServicesComponent
//           formData={formData}
//           updateFormData={updateFormData}
//           stepErrors={stepErrors}
//           setStepErrors={setStepErrors}
//           serviceoptions={serviceoptions}
//         />
//       )}
//     </Box>
//   );
// };
const ServicesInvoicesStep = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep, 
  handleSubmit, 
  isLastStep,
  stepErrors,
  setStepErrors
}) => {
  const [invoices, setInvoices] = useState(formData.services.invoices || [{ id: 1, ...getEmptyInvoice() }]);
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [teammemberoption, setTeammemberoption] = useState([]);
  const [servicedata, setServiceData] = useState([]);
  const [touched, setTouched] = useState({});
console.log("servicesinvoices",invoices)
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN || 'https://www.snptaxes.com';

  function getEmptyInvoice() {
    return {
      invoiceTemplate: null,
      teamMembers: [], // Changed from teamMember to teamMembers (array)
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

  // Fetch initial data - runs once on mount
  useEffect(() => {
    fetchInvoiceTemplates();
    fetchTeamMembers();
    fetchServiceData();
  }, []);

  // Initialize invoices from formData - runs when formData.services.invoices changes
  useEffect(() => {
    if (formData.services.invoices && formData.services.invoices.length > 0) {
      setInvoices(formData.services.invoices);
    }
  }, [formData.services.invoices]);

  // Sync invoices with parent form data - runs when invoices change
  useEffect(() => {
    updateFormData('services', { 
      option: formData.services.option,
      invoices: invoices,
      itemizedData: formData.services.itemizedData
    });
  }, [invoices]);

  // Auto-enable payments when invoice option is selected
  useEffect(() => {
    if (formData.services.option === 'invoice') {
      updateFormData('general', { paymentsEnabled: true });
    } else {
      updateFormData('general', { paymentsEnabled: false });
    }
  }, [formData.services.option]);

  // Clear option error when option is selected
  useEffect(() => {
    if (formData.services.option && stepErrors.option) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.option;
        return newErrors;
      });
    }
  }, [formData.services.option]);

  // Validate itemized data when it changes
  useEffect(() => {
    if (formData.services.option === 'services' && formData.services.itemizedData) {
      validateItemizedData();
    }
  }, [formData.services.itemizedData, formData.services.option]);

  // Memoized service options to prevent unnecessary recalculations
  const serviceoptions = useMemo(() => {
    return servicedata.map((service) => ({
      value: service._id,
      label: service.serviceName,
    }));
  }, [servicedata]);

  const fetchInvoiceTemplates = async () => {
    try {
      const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';
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
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      const options = data.map(user => ({
        value: user._id,
        label: user.username,
      }));
      setTeammemberoption(options);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchServiceData = async () => {
    try {
      const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
      const url = `${SERVICE_API}/workflow/services/servicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.serviceTemplate);
      setServiceData(data.serviceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Validate invoice data
  const validateInvoices = () => {
    const newErrors = { ...stepErrors };
    
    if (formData.services.option === 'invoice') {
      if (!invoices || invoices.length === 0) {
        newErrors.invoices = 'At least one invoice is required';
      } else {
        // Check each invoice for required fields
        const invoiceErrors = invoices.map((invoice, index) => {
          const invoiceError = {};
          
          if (!invoice.invoiceTemplate) {
            invoiceError.invoiceTemplate = 'Invoice template is required';
          }
          
          // Updated validation for teamMembers array
          if (!invoice.teamMembers || invoice.teamMembers.length === 0) {
            invoiceError.teamMembers = 'At least one team member is required';
          }
          
          // Validate line items
          if (!invoice.rows || invoice.rows.length === 0) {
            invoiceError.rows = 'At least one line item is required';
          } else {
            const rowErrors = invoice.rows.map((row, rowIndex) => {
              const rowError = {};
              if (!row.productorService?.trim()) {
                rowError.productorService = 'Product/Service name is required';
              }
              if (!row.rate || parseFloat(row.rate) <= 0) {
                rowError.rate = 'Valid rate is required';
              }
              if (!row.quantity || parseFloat(row.quantity) <= 0) {
                rowError.quantity = 'Valid quantity is required';
              }
              return Object.keys(rowError).length > 0 ? rowError : null;
            }).filter(Boolean);
            
            if (rowErrors.length > 0) {
              invoiceError.lineItems = 'Please fix line item errors';
            }
          }
          
          return Object.keys(invoiceError).length > 0 ? invoiceError : null;
        }).filter(Boolean);
        
        if (invoiceErrors.length > 0) {
          newErrors.invoiceDetails = 'Please fix invoice errors';
        } else {
          delete newErrors.invoices;
          delete newErrors.invoiceDetails;
        }
      }
    }
    
    setStepErrors(newErrors);
  };

  // Validate itemized data
  const validateItemizedData = () => {
    const newErrors = { ...stepErrors };
    const itemizedData = formData.services.itemizedData || {};
    
    if (formData.services.option === 'services') {
      if (!itemizedData.rows || itemizedData.rows.length === 0) {
        newErrors.itemized = 'At least one line item is required';
      } else {
        const rowErrors = itemizedData.rows.map((row, index) => {
          const rowError = {};
          if (!row.productorService?.trim()) {
            rowError.productorService = 'Product/Service name is required';
          }
          if (!row.rate || parseFloat(row.rate) <= 0) {
            rowError.rate = 'Valid rate is required';
          }
          if (!row.quantity || parseFloat(row.quantity) <= 0) {
            rowError.quantity = 'Valid quantity is required';
          }
          return Object.keys(rowError).length > 0 ? rowError : null;
        }).filter(Boolean);
        
        // if (rowErrors.length > 0) {
        //   newErrors.itemizedDetails = 'Please fix line item errors';
        // } else {
        //   delete newErrors.itemized;
        //   delete newErrors.itemizedDetails;
        // }
      }
    }
    
    setStepErrors(newErrors);
  };

  const handleServiceTypeChange = (option) => {
    // Clear all errors when option changes
    setStepErrors({});
    setTouched({});
    updateFormData('services', { option });
  };

  const handleOptionBlur = () => {
    setTouched(prev => ({ ...prev, option: true }));
  };

  // Check if the step has any validation errors
  const hasStepErrors = () => {
    return Object.keys(stepErrors).length > 0;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="600" sx={{ mb: 4 }}>
        Services & Invoices
      </Typography>

   

      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <FormControl 
          component="fieldset" 
          error={!!stepErrors.option} 
          fullWidth
          onBlur={handleOptionBlur}
        >
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
            Select Option *
          </FormLabel>
          <RadioGroup
            value={formData.services.option || ''}
            onChange={(e) => handleServiceTypeChange(e.target.value)}
            sx={{ gap: 2 }}
          >
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                borderColor: formData.services.option === 'invoice' ? 'primary.main' : 'grey.300',
                backgroundColor: formData.services.option === 'invoice' ? 'primary.50' : 'background.paper',
                borderWidth: formData.services.option === 'invoice' ? 2 : 1,
                ...(stepErrors.option && formData.services.option !== 'invoice' ? {
                  borderColor: 'error.main',
                  backgroundColor: 'error.light'
                } : {})
              }}
            >
              <FormControlLabel
                value="invoice"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600">
                      Add Invoice
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                     Create one-time or recurring invoice, or ask for deposit to sign
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Paper>
            
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                borderColor: formData.services.option === 'services' ? 'primary.main' : 'grey.300',
                backgroundColor: formData.services.option === 'services' ? 'primary.50' : 'background.paper',
                borderWidth: formData.services.option === 'services' ? 2 : 1,
                ...(stepErrors.option && formData.services.option !== 'services' ? {
                  borderColor: 'error.main',
                  backgroundColor: 'error.light'
                } : {})
              }}
            >
              <FormControlLabel
                value="services"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600">
                      Itemized Services
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No invoice or deposit request will be created
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Paper>
          </RadioGroup>
          {stepErrors.option && (
            <FormHelperText error>{stepErrors.option}</FormHelperText>
          )}
        </FormControl>
      </Paper>

      {formData.services.option === 'invoice' && (
        <InvoiceComponent
          invoices={invoices}
          setInvoices={setInvoices}
          invoiceTemplates={invoiceTemplates}
          teammemberoption={teammemberoption}
          serviceoptions={serviceoptions}
          formData={formData}
          updateFormData={updateFormData}
          stepErrors={stepErrors}
          setStepErrors={setStepErrors}
        />
      )}

      {formData.services.option === 'services' && (
        <ServicesComponent
          formData={formData}
          updateFormData={updateFormData}
          stepErrors={stepErrors}
          setStepErrors={setStepErrors}
          serviceoptions={serviceoptions}
        />
      )}
    </Box>
  );
};
export default ServicesInvoicesStep;