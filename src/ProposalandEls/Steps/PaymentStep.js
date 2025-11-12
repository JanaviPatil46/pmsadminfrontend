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
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Card,
  CardContent,
  Grid,Divider,InputAdornment
} from '@mui/material';
import { NavigateBefore, CheckCircle } from '@mui/icons-material';


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
    <Box>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="600" sx={{ mb: 4 }}>
        Payment Information
      </Typography>

      {/* Show validation errors */}
      {Object.keys(stepErrors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Please fix the following errors:
          {stepErrors.method && <Box>- {stepErrors.method}</Box>}
          {stepErrors.amount && <Box>- {stepErrors.amount}</Box>}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Payment Details
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure how you would like to receive payments for this proposal.
            </Typography>

            <FormControl 
              fullWidth 
              error={!!stepErrors.method} 
              sx={{ mb: 3 }}
              onBlur={() => handleBlur('method')}
            >
              <InputLabel>Payment Method *</InputLabel>
              <Select
                value={formData.payments.method || ''}
                onChange={(e) => handleFieldChange('method', e.target.value)}
                label="Payment Method *"
              >
                <MenuItem value="">
                  <em>Select Payment Method</em>
                </MenuItem>
                {paymentMethods.map(method => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
              {stepErrors.method && (
                <FormHelperText error>{stepErrors.method}</FormHelperText>
              )}
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Total Amount *"
                type="number"
                value={formData.payments.amount || 0}
                onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value) || 0)}
                error={!!stepErrors.amount}
                helperText={stepErrors.amount || getAmountSource()}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                onBlur={() => handleBlur('amount')}
              />
            </Box>

            {/* Additional Payment Information based on method */}
            {formData.payments.method && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {formData.payments.method} Instructions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.payments.method === 'Credit Card' && 
                    'Clients will be able to pay securely online using credit cards.'}
                  {formData.payments.method === 'Bank Transfer' && 
                    'Provide your bank account details to clients for direct transfers.'}
                  {formData.payments.method === 'PayPal' && 
                    'Clients will be redirected to PayPal to complete their payment.'}
                  {formData.payments.method === 'Cash' && 
                    'Arrange for cash payment upon service completion or delivery.'}
                  {formData.payments.method === 'Check' && 
                    'Provide your mailing address for clients to send checks.'}
                  {formData.payments.method === 'Other' && 
                    'Specify any special payment instructions for your clients.'}
                </Typography>
                
                {/* Additional fields for specific payment methods */}
                {formData.payments.method === 'Bank Transfer' && (
                  <TextField
                    fullWidth
                    label="Bank Account Details (Optional)"
                    multiline
                    rows={2}
                    placeholder="Bank name, account number, routing number..."
                    sx={{ mt: 2 }}
                    onChange={(e) => handleFieldChange('bankDetails', e.target.value)}
                    value={formData.payments.bankDetails || ''}
                  />
                )}
                
                {formData.payments.method === 'Other' && (
                  <TextField
                    fullWidth
                    label="Special Instructions (Optional)"
                    multiline
                    rows={2}
                    placeholder="Describe your preferred payment method..."
                    sx={{ mt: 2 }}
                    onChange={(e) => handleFieldChange('specialInstructions', e.target.value)}
                    value={formData.payments.specialInstructions || ''}
                  />
                )}
              </Box>
            )}
          </Paper>

          {/* Payment Summary */}
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Payment Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Service Type:</Typography>
              <Typography variant="body2" fontWeight="medium">
                {formData.services.option === 'invoice' ? 'Invoicing' : 'Itemized Services'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Total Amount:</Typography>
              <Typography variant="body2" fontWeight="medium">
                ${parseFloat(formData.payments.amount || 0).toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Payment Method:</Typography>
              <Typography variant="body2" fontWeight="medium">
                {formData.payments.method || 'Not specified'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" fontWeight="bold">
                Client Will Pay:
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="primary">
                ${parseFloat(formData.payments.amount || 0).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Help Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, backgroundColor: 'info.light', border: 1, borderColor: 'info.main' }}>
            <Typography variant="h6" gutterBottom color="info.dark">
              💡 Payment Tips
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Credit Card:</strong> Best for online payments and faster processing.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Bank Transfer:</strong> Lower fees, good for large amounts.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>PayPal:</strong> Familiar to most clients, secure.
            </Typography>
            <Typography variant="body2">
              <strong>Cash/Check:</strong> Traditional methods, may require more follow-up.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};



export default PaymentStep;