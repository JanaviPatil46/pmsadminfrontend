// import React, { useState, useEffect } from 'react';
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   FormControlLabel,
//   Checkbox,
//   InputLabel,
//   IconButton,
//   Divider,
//   Alert
// } from '@mui/material';
// import { Close } from '@mui/icons-material';

// const EditServiceDrawer = ({
//   open,
//   onClose,
//   selectedRowData,
//   setSelectedRowData,
//   onSave
// }) => {
//   const [formData, setFormData] = useState({
//     productorService: '',
//     description: '',
//     rate: '',
//     quantity: '',
//     tax: false,
//     isDiscount: false
//   });
//   const [errors, setErrors] = useState({});

//   // Initialize form data when selectedRowData changes
//   useEffect(() => {
//     if (selectedRowData) {
//       setFormData({
//         productorService: selectedRowData.productorService || '',
//         description: selectedRowData.description || '',
//         rate: selectedRowData.rate ? selectedRowData.rate.replace('$', '') : '0.00',
//         quantity: selectedRowData.quantity || '1',
//         tax: selectedRowData.tax || false,
//         isDiscount: selectedRowData.isDiscount || false
//       });
//       setErrors({});
//     }
//   }, [selectedRowData]);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.productorService.trim()) {
//       newErrors.productorService = 'Product/Service name is required';
//     }

//     if (!formData.rate || parseFloat(formData.rate) < 0) {
//       newErrors.rate = 'Valid rate is required';
//     }

//     if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
//       newErrors.quantity = 'Valid quantity is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = () => {
//     if (!validateForm()) {
//       return;
//     }

//     // Format the rate with dollar sign for display
//     const formattedData = {
//       ...formData,
//       rate: `$${parseFloat(formData.rate).toFixed(2)}`,
//       quantity: formData.quantity.toString()
//     };

//     // Update the selected row data with formatted values
//     setSelectedRowData(formattedData);
    
//     // Call the parent's save handler
//     onSave();
//   };

//   const handleClose = () => {
//     setErrors({});
//     onClose();
//   };

//   const calculateAmount = () => {
//     const rateValue = parseFloat(formData.rate) || 0;
//     const qtyValue = parseFloat(formData.quantity) || 0;
//     return (rateValue * qtyValue).toFixed(2);
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={handleClose}
//       sx={{
//         '& .MuiDrawer-paper': {
//           width: 600,
//           maxWidth: '90vw'
//         }
//       }}
//     >
//       <Box sx={{ p: 2 }}>
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h6">
//             Edit Line Item
//           </Typography>
//           <IconButton onClick={handleClose}>
//             <Close />
//           </IconButton>
//         </Box>

//         <Divider sx={{ mb: 3 }} />

//         {/* Form */}
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//           {/* Product/Service */}
//           <Box>
//             <InputLabel sx={{ color: 'black', mb: 1 }}>
//               Product or Service *
//             </InputLabel>
//             <TextField
//               fullWidth
//               size="small"
//               value={formData.productorService}
//               onChange={(e) => handleInputChange('productorService', e.target.value)}
//               placeholder="Enter product or service name"
//               error={!!errors.productorService}
//               helperText={errors.productorService}
//             />
//           </Box>

//           {/* Description */}
//           <Box>
//             <InputLabel sx={{ color: 'black', mb: 1 }}>
//               Description
//             </InputLabel>
//             <TextField
//               fullWidth
//               size="small"
//               multiline
//               rows={3}
//               value={formData.description}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//               placeholder="Enter description"
//             />
//           </Box>

//           {/* Rate and Quantity */}
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Box sx={{ flex: 1 }}>
//               <InputLabel sx={{ color: 'black', mb: 1 }}>
//                 Rate *
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 size="small"
//                 type="number"
//                 value={formData.rate}
//                 onChange={(e) => handleInputChange('rate', e.target.value)}
//                 placeholder="0.00"
//                 error={!!errors.rate}
//                 helperText={errors.rate}
//                 InputProps={{
//                   startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
//                 }}
//               />
//             </Box>
//             <Box sx={{ flex: 1 }}>
//               <InputLabel sx={{ color: 'black', mb: 1 }}>
//                 Quantity *
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 size="small"
//                 type="number"
//                 value={formData.quantity}
//                 onChange={(e) => handleInputChange('quantity', e.target.value)}
//                 placeholder="1"
//                 error={!!errors.quantity}
//                 helperText={errors.quantity}
//               />
//             </Box>
//           </Box>

//           {/* Calculated Amount Display */}
//           <Box sx={{ 
//             p: 2, 
//             backgroundColor: '#f5f5f5', 
//             borderRadius: 1,
//             border: '1px solid #e0e0e0'
//           }}>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//               Calculated Amount
//             </Typography>
//             <Typography variant="h6" color="primary">
//               ${calculateAmount()}
//             </Typography>
//           </Box>

//           {/* Tax Checkbox */}
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={formData.tax}
//                 onChange={(e) => handleInputChange('tax', e.target.checked)}
//                 color="primary"
//               />
//             }
//             label="Taxable"
//           />

//           {/* Discount Checkbox */}
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={formData.isDiscount}
//                 onChange={(e) => handleInputChange('isDiscount', e.target.checked)}
//                 color="primary"
//               />
//             }
//             label="This is a discount"
//           />

//           {/* Validation Alert */}
//           {Object.keys(errors).length > 0 && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               Please fix the errors above before saving.
//             </Alert>
//           )}
//         </Box>

//         {/* Action Buttons */}
//         <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
//           <Button
//             variant="outlined"
//             onClick={handleClose}
//             fullWidth
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             fullWidth
//           >
//             Save Changes
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default EditServiceDrawer;
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import { X } from 'lucide-react';

const EditServiceDrawer = ({
  open,
  onClose,
  selectedRowData,
  setSelectedRowData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    productorService: '',
    description: '',
    rate: '',
    quantity: '',
    tax: false,
    isDiscount: false
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when selectedRowData changes
  useEffect(() => {
    if (selectedRowData) {
      // Extract numeric value from rate (remove $ symbol)
      const rateValue = selectedRowData.rate ? selectedRowData.rate.replace('$', '') : '0.00';
      
      setFormData({
        productorService: selectedRowData.productorService || '',
        description: selectedRowData.description || '',
        rate: rateValue,
        quantity: selectedRowData.quantity || '1',
        tax: selectedRowData.tax || false,
        isDiscount: selectedRowData.isDiscount || false
      });
      setErrors({});
    }
  }, [selectedRowData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productorService.trim()) {
      newErrors.productorService = 'Product/Service name is required';
    }

    const rateValue = parseFloat(formData.rate);
    if (isNaN(rateValue) || rateValue < 0) {
      newErrors.rate = 'Valid rate is required';
    }

    const quantityValue = parseFloat(formData.quantity);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleSave = () => {
//     if (!validateForm()) {
//       return;
//     }

//     // Format the data exactly as expected by the parent component
//     const updatedRowData = {
//       ...selectedRowData, // Keep all existing properties
//       productorService: formData.productorService,
//       description: formData.description,
//       rate: `${parseFloat(formData.rate).toFixed(2)}`, // Format with $ symbol
//       quantity: formData.quantity.toString(), // Ensure it's a string
//       tax: formData.tax,
//       isDiscount: formData.isDiscount,
//       amount:(rate * quantity).toFixed(2)
//       // Note: amount will be recalculated in handleSaveChanges
//     };

//     console.log("Saving updated data:", updatedRowData);
    
//     // Update the selected row data in parent component
//     setSelectedRowData(updatedRowData);
    
//     // Call the parent's save handler
//     onSave();
//   };
const handleSave = () => {
  if (!validateForm()) {
    return;
  }

  const rateValue = parseFloat(formData.rate) || 0;
  const quantityValue = parseFloat(formData.quantity) || 0;
  const amount = (rateValue * quantityValue).toFixed(2);

  const updatedRowData = {
    ...selectedRowData,
    productorService: formData.productorService,
    description: formData.description,
    rate: `${rateValue.toFixed(2)}`,
    quantity: formData.quantity.toString(),
    tax: formData.tax,
    isDiscount: formData.isDiscount,
    amount: `${amount}`
  };

  console.log("Saving updated data:", updatedRowData);
  
  // Pass the updated data directly to onSave
  onSave(updatedRowData);
};
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const calculateAmount = () => {
    const rateValue = parseFloat(formData.rate) || 0;
    const qtyValue = parseFloat(formData.quantity) || 0;
    return (rateValue * qtyValue).toFixed(2);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Line Item</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Product/Service */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Product or Service *</label>
            <input
              type="text"
              value={formData.productorService}
              onChange={(e) => handleInputChange('productorService', e.target.value)}
              placeholder="Enter product or service name"
              className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.productorService ? 'border-red-400' : 'border-slate-200'}`}
            />
            {errors.productorService && <p className="text-xs text-red-500">{errors.productorService}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
              className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Rate and Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Rate *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  placeholder="0.00"
                  className={`flex h-10 w-full rounded-lg border bg-white pl-7 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.rate ? 'border-red-400' : 'border-slate-200'}`}
                />
              </div>
              {errors.rate && <p className="text-xs text-red-500">{errors.rate}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Quantity *</label>
              <input
                type="number"
                step="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="1"
                className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.quantity ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
            </div>
          </div>

          {/* Calculated Amount */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500 mb-1">Calculated Amount</p>
            <p className="text-lg font-semibold text-indigo-600">${calculateAmount()}</p>
          </div>

          {/* Tax Checkbox */}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.tax} onChange={(e) => handleInputChange('tax', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <label className="text-sm text-slate-700">Taxable</label>
          </div>

          {/* Discount Checkbox */}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isDiscount} onChange={(e) => handleInputChange('isDiscount', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <label className="text-sm text-slate-700">This is a discount</label>
          </div>

          {/* Validation Alert */}
          {Object.keys(errors).length > 0 && (
            <p className="text-xs text-red-500 mt-2">Please fix the errors above before saving.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button type="button" onClick={handleClose} className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={handleSave} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Save Changes</button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditServiceDrawer;