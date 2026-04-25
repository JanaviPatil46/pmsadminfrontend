
// import React, { useState, useEffect,useMemo } from 'react';
// // Adjust path as needed


// import InvoiceComponent from './InvoiceComponent';
// import ServicesComponent from './ServicesComponent';

// const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';
// const SERVICE_API = process.env.REACT_APP_SERVICES_URL || 'https://www.snptaxes.com';

// const ServicesInvoicesStep = ({ 
//   formData, 
//   updateFormData, 
//   nextStep, 
//   prevStep, 
//   handleSubmit, 
//   isLastStep 
// }) => {
//   const [errors, setErrors] = useState({});
//   const [invoices, setInvoices] = useState(formData.services.invoices || [{ id: 1, ...getEmptyInvoice() }]);
//   const [invoiceTemplates, setInvoiceTemplates] = useState([]);
//   const [teammemberoption, setTeammemberoption] = useState([]);
//   const [servicedata, setServiceData] = useState([]);

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
//   }, []); // Empty dependency array = run once

//   // Initialize invoices from formData - runs when formData.services.invoices changes
//   useEffect(() => {
//     if (formData.services.invoices && formData.services.invoices.length > 0) {
//       setInvoices(formData.services.invoices);
//     }
//   }, [formData.services.invoices]); // Only when invoices in formData change

//   // Sync invoices with parent form data - runs when invoices change
//   useEffect(() => {
//     updateFormData('services', { 
//       option: formData.services.option,
//       invoices: invoices,
//       itemizedData: formData.services.itemizedData
//     });
//   }, [invoices]); // Only when invoices state changes

//   // Auto-enable payments when invoice option is selected
//   useEffect(() => {
//     if (formData.services.option === 'invoice') {
//       updateFormData('general', { paymentsEnabled: true });
//     } else {
//       updateFormData('general', { paymentsEnabled: false });
//     }
//   }, [formData.services.option]); // Only when service option changes

//   // Memoized service options to prevent unnecessary recalculations
//   const serviceoptions = useMemo(() => {
//     return servicedata.map((service) => ({
//       value: service._id,
//       label: service.serviceName,
//     }));
//   }, [servicedata]); // Only recalculate when servicedata changes

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

//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.services.option) {
//       newErrors.option = 'Please select an option';
//     } else if (formData.services.option === 'invoice' && invoices.length === 0) {
//       newErrors.invoices = 'At least one invoice is required';
//     } else if (formData.services.option === 'services') {
//       // Updated validation for services with line items
//       const itemizedData = formData.services.itemizedData || {};
//       if (!itemizedData.rows || itemizedData.rows.length === 0) {
//         newErrors.itemized = 'At least one line item is required';
//       } else {
//         const hasEmptyProductNames = itemizedData.rows.some(row => !row.productorService?.trim());
//         if (hasEmptyProductNames) {
//           newErrors.itemized = 'Product/Service name is required for all line items';
//         }
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleServiceTypeChange = (option) => {
//   // Clear the option error immediately when user selects an option
//   if (errors.option) {
//     setErrors(prevErrors => {
//       const newErrors = { ...prevErrors };
//       delete newErrors.option;
//       return newErrors;
//     });
//   }
//   updateFormData('services', { option });
// };

//   const handleNext = () => {
//     if (validate()) {
//       if (isLastStep) {
//         // If this is the last step, submit the form
//         console.log("Submitting from ServicesInvoicesStep (last step)");
//         handleSubmit();
//       } else {
//         // Otherwise, go to next step
//         nextStep();
//       }
//     }
//   };

//   // Determine button text based on option and whether it's the last step
//   const getButtonText = () => {
//     if (formData.services.option === 'invoice') {
//       return 'Next (Payment)';
//     } else {
//       return isLastStep ? 'Submit Proposal' : 'Next';
//     }
//   };

//   return (
//     <div className="step-container">
//       <h2>Services & Invoices</h2>

//       <div className="form-group">
//         <label>Select Option *</label>
//         <div className="radio-group">
//           <label>
//             <input
//               type="radio"
//               value="invoice"
//               checked={formData.services.option === 'invoice'}
//               onChange={(e) => handleServiceTypeChange(e.target.value)}
//             />
//             Add Invoice (Will show Payment step)
//           </label>
//           <label>
//             <input
//               type="radio"
//               value="services"
//               checked={formData.services.option === 'services'}
//               onChange={(e) => handleServiceTypeChange(e.target.value)}
//             />
//             Itemized Services (No Payment step)
//           </label>
//         </div>
//         {errors.option && <span className="error-text">{errors.option}</span>}
//       </div>

//       {formData.services.option === 'invoice' && (
//         <InvoiceComponent
//           invoices={invoices}
//           setInvoices={setInvoices}
//           invoiceTemplates={invoiceTemplates}
//           teammemberoption={teammemberoption}
//           serviceoptions={serviceoptions}
//           formData={formData}
//           updateFormData={updateFormData}
//         />
//       )}

//       {formData.services.option === 'services' && (
//         <ServicesComponent
//           formData={formData}
//           updateFormData={updateFormData}
//           errors={errors}
//           serviceoptions={serviceoptions}
//         />
//       )}

//       <div className="navigation-buttons">
//         <button onClick={prevStep} className="btn-secondary">
//           Previous
//         </button>
//         <button onClick={handleNext} className="btn-primary">
//           {getButtonText()}
//         </button>
//       </div>
//     </div>
//   );
// };
// export default ServicesInvoicesStep;

import React, { useState, useEffect, useMemo } from 'react';
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
//   isLastStep 
// }) => {
//   const [errors, setErrors] = useState({});
//   const [invoices, setInvoices] = useState(formData.services.invoices || [{ id: 1, ...getEmptyInvoice() }]);
//   const [invoiceTemplates, setInvoiceTemplates] = useState([]);
//   const [teammemberoption, setTeammemberoption] = useState([]);
//   const [servicedata, setServiceData] = useState([]);

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
//     if (formData.services.option && errors.option) {
//       setErrors(prevErrors => {
//         const newErrors = { ...prevErrors };
//         delete newErrors.option;
//         return newErrors;
//       });
//     }
//   }, [formData.services.option]);

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

//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.services.option) {
//       newErrors.option = 'Please select an option';
//     } else if (formData.services.option === 'invoice' && invoices.length === 0) {
//       newErrors.invoices = 'At least one invoice is required';
//     } else if (formData.services.option === 'services') {
//       const itemizedData = formData.services.itemizedData || {};
//       if (!itemizedData.rows || itemizedData.rows.length === 0) {
//         newErrors.itemized = 'At least one line item is required';
//       } else {
//         const hasEmptyProductNames = itemizedData.rows.some(row => !row.productorService?.trim());
//         if (hasEmptyProductNames) {
//           newErrors.itemized = 'Product/Service name is required for all line items';
//         }
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleServiceTypeChange = (option) => {
//     if (errors.option) {
//       setErrors(prevErrors => {
//         const newErrors = { ...prevErrors };
//         delete newErrors.option;
//         return newErrors;
//       });
//     }
//     updateFormData('services', { option });
//   };

 

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom color="primary" fontWeight="600" sx={{ mb: 4 }}>
//         Services & Invoices
//       </Typography>

      

//       <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
//         <FormControl component="fieldset" error={!!errors.option} fullWidth>
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
//                 borderWidth: formData.services.option === 'invoice' ? 2 : 1
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
//                 borderWidth: formData.services.option === 'services' ? 2 : 1
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
//           {errors.option && (
//             <FormHelperText error>{errors.option}</FormHelperText>
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
//         />
//       )}

//       {formData.services.option === 'services' && (
//         <ServicesComponent
//           formData={formData}
//           updateFormData={updateFormData}
//           errors={errors}
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

  // Validate invoices when they change
  // useEffect(() => {
  //   if (formData.services.option === 'invoice' && invoices.length > 0) {
  //     validateInvoices();
  //   }
  // }, [invoices, formData.services.option]);

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
    // Implement your team members fetch logic
    setTeammemberoption([]); // Placeholder
  };

  const fetchServiceData = async () => {
    try {
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
          
          if (!invoice.teamMember) {
            invoiceError.teamMember = 'Team member is required';
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-600">Services & Invoices</h2>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6" onBlur={handleOptionBlur}>
        <p className="text-sm font-semibold text-slate-700 mb-3">Select Option *</p>
        <div className="space-y-3">
          <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
            formData.services.option === 'invoice' ? 'border-blue-400 bg-blue-50/50 border-2' : stepErrors.option ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-white'
          }`}>
            <input type="radio" name="serviceOption" value="invoice" checked={formData.services.option === 'invoice'} onChange={(e) => handleServiceTypeChange(e.target.value)} className="mt-1 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
            <div>
              <span className="text-sm font-semibold text-slate-800">Add Invoice</span>
              <p className="text-xs text-slate-500 mt-0.5">Create one-time or recurring invoice, or ask for deposit to sign</p>
            </div>
          </label>

          <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
            formData.services.option === 'services' ? 'border-blue-400 bg-blue-50/50 border-2' : stepErrors.option ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-white'
          }`}>
            <input type="radio" name="serviceOption" value="services" checked={formData.services.option === 'services'} onChange={(e) => handleServiceTypeChange(e.target.value)} className="mt-1 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500" />
            <div>
              <span className="text-sm font-semibold text-slate-800">Itemized Services</span>
              <p className="text-xs text-slate-500 mt-0.5">No invoice or deposit request will be created</p>
            </div>
          </label>
        </div>
        {stepErrors.option && <p className="text-xs text-red-500 mt-2">{stepErrors.option}</p>}
      </div>

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
    </div>
  );
};
export default ServicesInvoicesStep;