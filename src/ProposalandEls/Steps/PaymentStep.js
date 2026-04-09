// import React, { useState, useEffect } from 'react';

// const PaymentStep = ({ formData, updateFormData, prevStep, handleSubmit }) => {
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     // Calculate total amount based on services option
//     let totalAmount = 0;
    
//     if (formData.services.option === 'invoice') {
//       totalAmount = formData.services.invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
//     } else if (formData.services.option === 'services') {
//       totalAmount = formData.services.itemizedData.price || 0;
//     }
    
//     updateFormData('payments', { amount: totalAmount });
//   }, [formData.services, updateFormData]);

//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.payments.method?.trim()) {
//       newErrors.method = 'Payment method is required';
//     }
    
//     if (!formData.payments.amount || formData.payments.amount <= 0) {
//       newErrors.amount = 'Valid amount is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleFinalSubmit = () => {
//     if (validate()) {
//       handleSubmit();
//     }
//   };

//   const paymentMethods = [
//     'Credit Card',
//     'Bank Transfer', 
//     'PayPal',
//     'Cash',
//     'Check',
//     'Other'
//   ];

//   return (
//     <div className="step-container">
//       <h2>Payment Information</h2>

//       <div className="form-group">
//         <label>Payment Method *</label>
//         <select
//           value={formData.payments.method || ''}
//           onChange={(e) => updateFormData('payments', { method: e.target.value })}
//           className={errors.method ? 'error' : ''}
//         >
//           <option value="">Select Payment Method</option>
//           {paymentMethods.map(method => (
//             <option key={method} value={method}>{method}</option>
//           ))}
//         </select>
//         {errors.method && <span className="error-text">{errors.method}</span>}
//       </div>

//       <div className="form-group">
//         <label>Total Amount *</label>
//         <input
//           type="number"
//           value={formData.payments.amount || 0}
//           onChange={(e) => updateFormData('payments', { amount: parseFloat(e.target.value) || 0 })}
//           className={errors.amount ? 'error' : ''}
//           readOnly
//         />
//         {errors.amount && <span className="error-text">{errors.amount}</span>}
//       </div>

//       <div className="summary">
//         <h3>Proposal Summary</h3>
//         <p><strong>Proposal Name:</strong> {formData.general.proposalName}</p>
//         <p><strong>Template:</strong> {formData.general.templateName}</p>
//         <p><strong>Service Type:</strong> {formData.services.option === 'invoice' ? 'Invoice' : 'Itemized Service'}</p>
//         <p><strong>Total Amount:</strong> ${formData.payments.amount || 0}</p>
//       </div>

//       <div className="navigation-buttons">
//         <button onClick={prevStep} className="btn-secondary">
//           Previous
//         </button>
//         <button onClick={handleFinalSubmit} className="btn-primary">
//           Submit Proposal
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentStep;

import React, { useState, useEffect } from 'react';


// const PaymentStep = ({ formData, updateFormData, validationErrors }) => {
//   useEffect(() => {
//     // Calculate total amount based on services option
//     let totalAmount = 0;
    
//     if (formData.services.option === 'invoice') {
//       totalAmount = formData.services.invoices.reduce((sum, invoice) => 
//         sum + (parseFloat(invoice.totalAmount) || 0), 0
//       );
//     } else if (formData.services.option === 'services') {
//       totalAmount = parseFloat(formData.services.itemizedData?.totalAmount) || 0;
//     }
    
//     updateFormData('payments', { amount: totalAmount });
//   }, [formData.services, updateFormData]);

//   const handleFieldChange = (field, value) => {
//     updateFormData('payments', { [field]: value });
//   };

//   const paymentMethods = [
//     'Credit Card',
//     'Bank Transfer', 
//     'PayPal',
//     'Cash',
//     'Check',
//     'Other'
//   ];

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom color="primary" fontWeight="600" sx={{ mb: 4 }}>
//         Payment Information
//       </Typography>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={8}>
//           <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
//             <Typography variant="h6" gutterBottom color="primary">
//               Payment Details
//             </Typography>

//             <FormControl fullWidth error={!!validationErrors.method} sx={{ mb: 3 }}>
//               <InputLabel>Payment Method *</InputLabel>
//               <Select
//                 value={formData.payments.method || ''}
//                 onChange={(e) => handleFieldChange('method', e.target.value)}
//                 label="Payment Method *"
//               >
//                 <MenuItem value="">
//                   <em>Select Payment Method</em>
//                 </MenuItem>
//                 {paymentMethods.map(method => (
//                   <MenuItem key={method} value={method}>
//                     {method}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {validationErrors.method && (
//                 <FormHelperText error>{validationErrors.method}</FormHelperText>
//               )}
//             </FormControl>

//             <TextField
//               fullWidth
//               label="Total Amount *"
//               type="number"
//               value={formData.payments.amount || 0}
//               onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value) || 0)}
//               error={!!validationErrors.amount}
//               helperText={validationErrors.amount}
//               InputProps={{
//                 readOnly: true,
//                 startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
//               }}
//               sx={{ mb: 2 }}
//             />
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };
const PaymentStep = ({ 
  formData, 
  updateFormData, 
  stepErrors, 
  setStepErrors,
  nextStep, 
  prevStep 
}) => {
  const [touched, setTouched] = useState({});

  useEffect(() => {
    // Calculate total amount based on services option
    let totalAmount = 0;
    
    if (formData.services.option === 'invoice') {
      totalAmount = formData.services.invoices.reduce((sum, invoice) => 
        sum + (parseFloat(invoice.totalAmount) || 0), 0
      );
    } else if (formData.services.option === 'services') {
      totalAmount = parseFloat(formData.services.itemizedData?.totalAmount) || 0;
    }
    
    updateFormData('payments', { amount: totalAmount });
  }, [formData.services, updateFormData]);

  // Validate payment step
  const validatePaymentStep = () => {
    const newErrors = {};
    
    if (!formData.payments.method?.trim()) {
      newErrors.method = 'Payment method is required';
    }
    
    if (!formData.payments.amount || parseFloat(formData.payments.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    setStepErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear specific error when field is updated
  const clearFieldError = (field) => {
    if (stepErrors[field]) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFieldChange = (field, value) => {
    updateFormData('payments', { [field]: value });
    
    // Clear error when user starts typing/selecting
    if (value && value.toString().trim() !== '') {
      clearFieldError(field);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const paymentMethods = [
    'Credit Card',
    'Bank Transfer', 
    'PayPal',
    'Cash',
    'Check',
    'Other'
  ];

  // Determine the source of the amount for display
  const getAmountSource = () => {
    if (formData.services.option === 'invoice') {
      const invoiceCount = formData.services.invoices?.length || 0;
      return invoiceCount > 1 
        ? `Total from ${invoiceCount} invoices` 
        : 'Total from invoice';
    } else if (formData.services.option === 'services') {
      return 'Total from itemized services';
    }
    return 'Calculated total';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-indigo-600">Payment Information</h2>

      {/* Show validation errors */}
      {Object.keys(stepErrors).length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Please fix the following errors:
          {stepErrors.method && <div>- {stepErrors.method}</div>}
          {stepErrors.amount && <div>- {stepErrors.amount}</div>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
            <h3 className="text-base font-semibold text-indigo-600">Payment Details</h3>
            <p className="text-xs text-slate-500">Configure how you would like to receive payments for this proposal.</p>

            <div className="space-y-1.5" onBlur={() => handleBlur('method')}>
              <label className="text-sm font-medium text-slate-700">Payment Method *</label>
              <select
                value={formData.payments.method || ''}
                onChange={(e) => handleFieldChange('method', e.target.value)}
                className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${stepErrors.method ? 'border-red-400' : 'border-slate-200'}`}
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              {stepErrors.method && <p className="text-xs text-red-500">{stepErrors.method}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Total Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                <input
                  type="number"
                  value={formData.payments.amount || 0}
                  readOnly
                  onBlur={() => handleBlur('amount')}
                  className={`flex h-10 w-full rounded-lg border bg-slate-100 pl-7 pr-3 py-2 text-sm shadow-sm focus:outline-none ${stepErrors.amount ? 'border-red-400' : 'border-slate-200'}`}
                />
              </div>
              <p className="text-xs text-slate-400">{stepErrors.amount || getAmountSource()}</p>
            </div>

            {/* Additional Payment Information based on method */}
            {formData.payments.method && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 mt-3 space-y-2">
                <p className="text-sm font-semibold text-indigo-600">{formData.payments.method} Instructions</p>
                <p className="text-xs text-slate-500">
                  {formData.payments.method === 'Credit Card' && 'Clients will be able to pay securely online using credit cards.'}
                  {formData.payments.method === 'Bank Transfer' && 'Provide your bank account details to clients for direct transfers.'}
                  {formData.payments.method === 'PayPal' && 'Clients will be redirected to PayPal to complete their payment.'}
                  {formData.payments.method === 'Cash' && 'Arrange for cash payment upon service completion or delivery.'}
                  {formData.payments.method === 'Check' && 'Provide your mailing address for clients to send checks.'}
                  {formData.payments.method === 'Other' && 'Specify any special payment instructions for your clients.'}
                </p>

                {formData.payments.method === 'Bank Transfer' && (
                  <textarea rows={2} placeholder="Bank name, account number, routing number..." onChange={(e) => handleFieldChange('bankDetails', e.target.value)} value={formData.payments.bankDetails || ''} className="flex min-h-[60px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2" />
                )}

                {formData.payments.method === 'Other' && (
                  <textarea rows={2} placeholder="Describe your preferred payment method..." onChange={(e) => handleFieldChange('specialInstructions', e.target.value)} value={formData.payments.specialInstructions || ''} className="flex min-h-[60px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2" />
                )}
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="rounded-xl border border-slate-200 p-6 space-y-3">
            <h3 className="text-base font-semibold text-indigo-600">Payment Summary</h3>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Service Type:</span><span className="font-medium text-slate-700">{formData.services.option === 'invoice' ? 'Invoicing' : 'Itemized Services'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total Amount:</span><span className="font-medium text-slate-700">${parseFloat(formData.payments.amount || 0).toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Payment Method:</span><span className="font-medium text-slate-700">{formData.payments.method || 'Not specified'}</span></div>
            <hr className="border-slate-200" />
            <div className="flex justify-between"><span className="text-sm font-bold text-slate-800">Client Will Pay:</span><span className="text-sm font-bold text-indigo-600">${parseFloat(formData.payments.amount || 0).toFixed(2)}</span></div>
          </div>
        </div>

        {/* Help Section */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 space-y-3">
            <h4 className="text-base font-semibold text-blue-800">💡 Payment Tips</h4>
            <p className="text-xs text-blue-700"><strong>Credit Card:</strong> Best for online payments and faster processing.</p>
            <p className="text-xs text-blue-700"><strong>Bank Transfer:</strong> Lower fees, good for large amounts.</p>
            <p className="text-xs text-blue-700"><strong>PayPal:</strong> Familiar to most clients, secure.</p>
            <p className="text-xs text-blue-700"><strong>Cash/Check:</strong> Traditional methods, may require more follow-up.</p>
          </div>
        </div>
      </div>
    </div>
  );
};



export default PaymentStep;