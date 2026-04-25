

import React,{useState} from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { CiDiscount1 } from 'react-icons/ci';
import CreatableSelect from 'react-select/creatable';



const SERVICE_API = process.env.REACT_APP_SERVICES_URL || 'https://www.snptaxes.com';

// const ServicesComponent = ({ formData, updateFormData, errors, serviceoptions }) => {
 
//   const itemizedData = formData.services.itemizedData || {
//     name: '',
//     price: '',
//     rows: [getEmptyRow()],
//     subtotal: '0.00',
//     taxRate: '0',
//     taxTotal: '0.00',
//     totalAmount: '0.00'
//   };

//   function getEmptyRow() {
//     return {
//       productorService: '', // Match API field name
//       description: '',
//       rate: '0.00',
//       quantity: '1', // Match API field name
//       amount: '0.00',
//       tax: false,
//       isDiscount: false,
//     };
//   }

//   const updateItemizedData = (field, value) => {
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         [field]: value
//       }
//     });
//   };

//   const updateItemizedDataField = (field, value) => {
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         [field]: value
//       }
//     });
//   };

//   // Row management functions
//   const addRow = (isDiscount = false) => {
//     const newRow = getEmptyRow();
//     if (isDiscount) {
//       newRow.isDiscount = true;
//       newRow.productorService = 'Discount'; // Updated field name
//     }
    
//     const updatedRows = [...(itemizedData.rows || []), newRow];
//     const summary = calculateSummary(updatedRows, itemizedData.taxRate);
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         rows: updatedRows,
//         ...summary
//       }
//     });
//   };

//   const deleteRow = (rowIndex) => {
//     const updatedRows = itemizedData.rows.filter((_, index) => index !== rowIndex);
//     const summary = calculateSummary(updatedRows, itemizedData.taxRate);
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         rows: updatedRows,
//         ...summary
//       }
//     });
//   };

//   const handleInputChange = (rowIndex, e) => {
//     const { name, value, type, checked } = e.target;
    
//     const updatedRows = itemizedData.rows.map((row, index) => 
//       index === rowIndex 
//         ? { ...row, [name]: type === 'checkbox' ? checked : value }
//         : row
//     );
    
//     const recalculatedRows = recalculateRowAmounts(updatedRows);
//     const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         rows: recalculatedRows,
//         ...summary
//       }
//     });
//   };

//   // New handler functions for CreatableSelect
//   const handleServiceChange = (index, selectedOption) => {
//     const updatedRows = itemizedData.rows.map((row, i) => 
//       i === index 
//         ? { ...row, productorService: selectedOption ? selectedOption.label : "" }
//         : row
//     );
    
//     const recalculatedRows = recalculateRowAmounts(updatedRows);
//     const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         rows: recalculatedRows,
//         ...summary
//       }
//     });
    
//     // Call fetch only if an option is actually selected
//     if (selectedOption && selectedOption.value) {
//       // If you have a fetch function, call it here
//       fetchservicebyid(selectedOption.value, index);
//     }
//   };

//   const fetchservicebyid = async (id, rowIndex) => {
//   const requestOptions = {
//     method: "GET",
//     redirect: "follow",
//   };
//   const url = `${SERVICE_API}/workflow/services/servicetemplate/${id}`;
  
//   fetch(url, requestOptions)
//     .then((response) => response.json())
//     .then((result) => {
//       console.log("fcdfdgc",result)
//       const service = Array.isArray(result.serviceTemplate)
//         ? result.serviceTemplate[0]
//         : result.serviceTemplate;
//       const rate = service.rate
//         ? parseFloat(service.rate.replace("$", ""))
//         : 0;
      
//       // Create updated row data with correct field names
//       const updatedRowData = {
//         productorService: service.serviceName || "", // Updated field name
//         description: service.description || "",
//         rate: rate.toFixed(2), // Remove $ symbol to match your component
//         quantity: "1", // Updated field name
//         amount: rate.toFixed(2), // Remove $ symbol to match your component
//         tax: service.tax || false,
//         isDiscount: false,
//       };

//       // Update the form data through the existing state management
//       const currentRows = [...formData.services.itemizedData.rows];
//       const updatedRows = currentRows.map((row, index) => 
//         index === rowIndex 
//           ? { ...row, ...updatedRowData }
//           : row
//       );

//       // Recalculate amounts and update form data
//       const recalculatedRows = recalculateRowAmounts(updatedRows);
//       const summary = calculateSummary(recalculatedRows, formData.services.itemizedData.taxRate);
      
//       updateFormData('services', {
//         itemizedData: {
//           ...formData.services.itemizedData,
//           rows: recalculatedRows,
//           ...summary
//         }
//       });
//     })
//     .catch((error) => console.error(error));
// };
//   const handleServiceInputChange = (inputValue, actionMeta, index) => {
//     if (actionMeta.action === "input-change") {
//       const updatedRows = itemizedData.rows.map((row, i) => 
//         i === index 
//           ? { ...row, productorService: inputValue }
//           : row
//       );
      
//       const recalculatedRows = recalculateRowAmounts(updatedRows);
//       const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
      
//       updateFormData('services', {
//         itemizedData: {
//           ...itemizedData,
//           rows: recalculatedRows,
//           ...summary
//         }
//       });
//     }
//   };

//   const calculateSummary = (rows, taxRate = 0) => {
//     const subtotal = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
//     const taxRateValue = parseFloat(taxRate) || 0;
    
//     const taxableAmount = rows.reduce((sum, row) => {
//       return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
//     }, 0);
    
//     const taxTotal = taxableAmount * (taxRateValue / 100);
//     const totalAmount = subtotal + taxTotal;
    
//     return {
//       subtotal: subtotal.toFixed(2),
//       taxTotal: taxTotal.toFixed(2),
//       totalAmount: totalAmount.toFixed(2)
//     };
//   };

//   const recalculateRowAmounts = (rows) => {
//     return rows.map(row => {
//       const rate = parseFloat(row.rate) || 0;
//       const quantity = parseFloat(row.quantity) || 0; // Updated field name
//       const amount = rate * quantity;
//       return { ...row, amount: amount.toFixed(2) };
//     });
//   };

//   const handleTaxRateChange = (e) => {
//     const value = e.target.value;
//     updateItemizedDataField('taxRate', value);
    
//     // Recalculate tax with new rate
//     const subtotal = itemizedData.rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
//     const taxRateValue = parseFloat(value) || 0;
    
//     const taxableAmount = itemizedData.rows.reduce((sum, row) => {
//       return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
//     }, 0);
    
//     const taxTotal = taxableAmount * (taxRateValue / 100);
//     const totalAmount = subtotal + taxTotal;
    
//     updateFormData('services', {
//       itemizedData: {
//         ...itemizedData,
//         taxRate: value,
//         taxTotal: taxTotal.toFixed(2),
//         totalAmount: totalAmount.toFixed(2)
//       }
//     });
//   };

//   return (
//     <div className="itemized-section">
//       <h3>Itemized Service</h3>
//       <div className="info-message">
//         <p>⚠️ No Payment step will be shown for itemized services</p>
//       </div>

//       {/* Basic Service Information */}
//       {/* <Box sx={{ mb: 3 }}>
//         <div className="form-group">
//           <InputLabel sx={{ color: "black", mb: 1 }}>Service Name *</InputLabel>
//           <TextField
//             fullWidth
//             size="small"
//             value={itemizedData.name || ''}
//             onChange={(e) => updateItemizedData('name', e.target.value)}
//             error={!!errors.itemized}
//             placeholder="Enter service name"
//           />
//         </div>
//       </Box> */}

//       {/* Line Items Section */}
//       <Box sx={{ mt: 3 }}>
//         <Box sx={{ margin: "20px 0 10px 0" }}>
//           <Typography variant="h6">Line items</Typography>
//           <Typography variant="body2">Client-facing itemized list of products and services</Typography>
//         </Box>
        
//         <Box sx={{ overflow: "auto", width: "100%" }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Product or service</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Rate</TableCell>
//                 <TableCell>Qty</TableCell>
//                 <TableCell>Amount</TableCell>
//                 <TableCell>Tax</TableCell>
//                 <TableCell></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {itemizedData.rows && itemizedData.rows.map((row, rowIndex) => (
//                 <TableRow key={rowIndex}>
//                   <TableCell>
//                     <CreatableSelect
//                       placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
//                       options={serviceoptions}
//                       value={row.productorService ? serviceoptions.find((option) => option.label === row.productorService) || { label: row.productorService, value: row.productorService } : null}
//                       onChange={(selectedOption) => handleServiceChange(rowIndex, selectedOption)}
//                       onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, rowIndex)}
//                       isClearable
//                       styles={{
//                         container: (provided) => ({ ...provided, width: "180px" }),
//                         control: (provided) => ({ ...provided, width: "180px" }),
//                         menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
//                       }}
//                       menuPortalTarget={document.body}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       name="description"
//                       value={row.description}
//                       onChange={(e) => handleInputChange(rowIndex, e)}
//                       placeholder="Description"
//                       fullWidth
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       name="rate"
//                       value={row.rate}
//                       onChange={(e) => handleInputChange(rowIndex, e)}
//                       sx={{ width: "80px" }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       name="quantity" // Updated field name
//                       value={row.quantity} // Updated field name
//                       onChange={(e) => handleInputChange(rowIndex, e)}
//                       sx={{ width: "60px" }}
//                     />
//                   </TableCell>
//                   <TableCell>${row.amount}</TableCell>
//                   <TableCell>
//                     <Checkbox 
//                       name="tax" 
//                       checked={row.tax} 
//                       onChange={(e) => handleInputChange(rowIndex, e)} 
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {itemizedData.rows.length > 1 && (
//                       <IconButton onClick={() => deleteRow(rowIndex)} size="small">
//                         <RiCloseLine />
//                       </IconButton>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Box>

//         {/* Add Row Buttons */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "10px" }}>
//           <Button 
//             onClick={() => addRow()} 
//             startIcon={<AiOutlinePlusCircle />} 
//             sx={{ color: "blue", fontSize: "15px" }}
//           >
//             Line item
//           </Button>
//           <Button 
//             onClick={() => addRow(true)} 
//             startIcon={<CiDiscount1 />} 
//             sx={{ color: "blue", fontSize: "15px" }}
//           >
//             Discount
//           </Button>
//         </Box>

//         {/* Summary Section */}
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6">Summary</Typography>
//           <Table sx={{ backgroundColor: "#fff", width: "50%" }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Subtotal</TableCell>
//                 <TableCell>Tax Rate</TableCell>
//                 <TableCell>Tax Total</TableCell>
//                 <TableCell>Total</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               <TableRow>
//                 <TableCell>${itemizedData.subtotal || '0.00'}</TableCell>
//                 <TableCell>
//                   <TextField
//                     size="small"
//                     value={itemizedData.taxRate || '0'}
//                     onChange={handleTaxRateChange}
//                     sx={{ width: "60px" }}
//                     InputProps={{
//                       endAdornment: '%',
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell>${itemizedData.taxTotal || '0.00'}</TableCell>
//                 <TableCell>${itemizedData.totalAmount || '0.00'}</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </Box>
//       </Box>

//       {errors.itemized && (
//         <Typography color="error" sx={{ mt: 2 }}>
//           {errors.itemized}
//         </Typography>
//       )}
//     </div>
//   );
// };
const ServicesComponent = ({ 
  formData, 
  updateFormData, 
  stepErrors, 
  setStepErrors,
  serviceoptions 
}) => {
  const [touched, setTouched] = useState({});
  
  const itemizedData = formData.services.itemizedData || {
    name: '',
    price: '',
    rows: [getEmptyRow()],
    subtotal: '0.00',
    taxRate: '0',
    taxTotal: '0.00',
    totalAmount: '0.00'
  };

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

  // Validate itemized data
  const validateItemizedData = () => {
    const newErrors = {};
    
    // Check if any rows exist
    if (!itemizedData.rows || itemizedData.rows.length === 0) {
      newErrors.itemized = 'At least one line item is required';
    } else {
      // Check each row for required fields
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
        
        return Object.keys(rowError).length > 0 ? { rowIndex: index, ...rowError } : null;
      }).filter(Boolean);
      
      if (rowErrors.length > 0) {
        newErrors.rowErrors = rowErrors;
        newErrors.itemizedDetails = 'Please fix line item errors';
      }
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

  // Clear row errors when a row is updated
  const clearRowErrors = (rowIndex) => {
    if (stepErrors.rowErrors) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        newErrors.rowErrors = newErrors.rowErrors.filter(error => error.rowIndex !== rowIndex);
        if (newErrors.rowErrors.length === 0) {
          delete newErrors.rowErrors;
          delete newErrors.itemizedDetails;
        }
        return newErrors;
      });
    }
  };

  const updateItemizedData = (field, value) => {
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        [field]: value
      }
    });
  };

  const updateItemizedDataField = (field, value) => {
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        [field]: value
      }
    });
  };

  // Row management functions
  const addRow = (isDiscount = false) => {
    const newRow = getEmptyRow();
    if (isDiscount) {
      newRow.isDiscount = true;
      newRow.productorService = 'Discount';
    }
    
    const updatedRows = [...(itemizedData.rows || []), newRow];
    const summary = calculateSummary(updatedRows, itemizedData.taxRate);
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        rows: updatedRows,
        ...summary
      }
    });
    
    // Clear errors when adding new row
    clearFieldError('itemized');
  };

  const deleteRow = (rowIndex) => {
    const updatedRows = itemizedData.rows.filter((_, index) => index !== rowIndex);
    const summary = calculateSummary(updatedRows, itemizedData.taxRate);
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        rows: updatedRows,
        ...summary
      }
    });
    
    // Clear errors for deleted row
    clearRowErrors(rowIndex);
  };

  const handleInputChange = (rowIndex, e) => {
    const { name, value, type, checked } = e.target;
    
    const updatedRows = itemizedData.rows.map((row, index) => 
      index === rowIndex 
        ? { ...row, [name]: type === 'checkbox' ? checked : value }
        : row
    );
    
    const recalculatedRows = recalculateRowAmounts(updatedRows);
    const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        rows: recalculatedRows,
        ...summary
      }
    });
    
    // Clear errors when user starts typing
    if (name === 'productorService' && value.trim() !== '') {
      clearRowErrors(rowIndex);
    }
    if ((name === 'rate' || name === 'quantity') && value && parseFloat(value) > 0) {
      clearRowErrors(rowIndex);
    }
  };

  // New handler functions for CreatableSelect
  const handleServiceChange = (index, selectedOption) => {
    const updatedRows = itemizedData.rows.map((row, i) => 
      i === index 
        ? { ...row, productorService: selectedOption ? selectedOption.label : "" }
        : row
    );
    
    const recalculatedRows = recalculateRowAmounts(updatedRows);
    const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        rows: recalculatedRows,
        ...summary
      }
    });
    
    // Clear errors when service is selected
    if (selectedOption && selectedOption.label) {
      clearRowErrors(index);
    }
    
    // Call fetch only if an option is actually selected
    if (selectedOption && selectedOption.value) {
      fetchservicebyid(selectedOption.value, index);
    }
  };

  const fetchservicebyid = async (id, rowIndex) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate/${id}`;
    
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("fcdfdgc",result)
        const service = Array.isArray(result.serviceTemplate)
          ? result.serviceTemplate[0]
          : result.serviceTemplate;
        const rate = service.rate
          ? parseFloat(service.rate.replace("$", ""))
          : 0;
        
        // Create updated row data with correct field names
        const updatedRowData = {
          productorService: service.serviceName || "",
          description: service.description || "",
          rate: rate.toFixed(2),
          quantity: "1",
          amount: rate.toFixed(2),
          tax: service.tax || false,
          isDiscount: false,
        };

        // Update the form data through the existing state management
        const currentRows = [...formData.services.itemizedData.rows];
        const updatedRows = currentRows.map((row, index) => 
          index === rowIndex 
            ? { ...row, ...updatedRowData }
            : row
        );

        // Recalculate amounts and update form data
        const recalculatedRows = recalculateRowAmounts(updatedRows);
        const summary = calculateSummary(recalculatedRows, formData.services.itemizedData.taxRate);
        
        updateFormData('services', {
          itemizedData: {
            ...formData.services.itemizedData,
            rows: recalculatedRows,
            ...summary
          }
        });
        
        // Clear errors after successful fetch
        clearRowErrors(rowIndex);
      })
      .catch((error) => console.error(error));
  };

  const handleServiceInputChange = (inputValue, actionMeta, index) => {
    if (actionMeta.action === "input-change") {
      const updatedRows = itemizedData.rows.map((row, i) => 
        i === index 
          ? { ...row, productorService: inputValue }
          : row
      );
      
      const recalculatedRows = recalculateRowAmounts(updatedRows);
      const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
      
      updateFormData('services', {
        itemizedData: {
          ...itemizedData,
          rows: recalculatedRows,
          ...summary
        }
      });
      
      // Clear errors when user types
      if (inputValue.trim() !== '') {
        clearRowErrors(index);
      }
    }
  };

  const calculateSummary = (rows, taxRate = 0) => {
    const subtotal = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    const taxRateValue = parseFloat(taxRate) || 0;
    
    const taxableAmount = rows.reduce((sum, row) => {
      return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
    }, 0);
    
    const taxTotal = taxableAmount * (taxRateValue / 100);
    const totalAmount = subtotal + taxTotal;
    
    return {
      subtotal: subtotal.toFixed(2),
      taxTotal: taxTotal.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const recalculateRowAmounts = (rows) => {
    return rows.map(row => {
      const rate = parseFloat(row.rate) || 0;
      const quantity = parseFloat(row.quantity) || 0;
      const amount = rate * quantity;
      return { ...row, amount: amount.toFixed(2) };
    });
  };

  const handleTaxRateChange = (e) => {
    const value = e.target.value;
    updateItemizedDataField('taxRate', value);
    
    // Recalculate tax with new rate
    const subtotal = itemizedData.rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    const taxRateValue = parseFloat(value) || 0;
    
    const taxableAmount = itemizedData.rows.reduce((sum, row) => {
      return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
    }, 0);
    
    const taxTotal = taxableAmount * (taxRateValue / 100);
    const totalAmount = subtotal + taxTotal;
    
    updateFormData('services', {
      itemizedData: {
        ...itemizedData,
        taxRate: value,
        taxTotal: taxTotal.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
      }
    });
  };

  // Get error for specific row and field
  const getRowError = (rowIndex, field) => {
    if (stepErrors.rowErrors) {
      const rowError = stepErrors.rowErrors.find(error => error.rowIndex === rowIndex);
      return rowError ? rowError[field] : null;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-slate-800">Itemized Service</h3>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
        <p className="text-xs text-amber-700">No Payment step will be shown for itemized services</p>
      </div>

      {/* Line Items Section */}
      <div>
        <div className="mb-2">
          <h5 className="text-sm font-semibold text-slate-800">Line items</h5>
          <p className="text-xs text-slate-500">Client-facing itemized list of products and services</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Product / Service</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Rate</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tax</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {itemizedData.rows && itemizedData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2 min-w-[200px]">
                      <CreatableSelect
                        placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                        options={serviceoptions}
                        value={row.productorService ? serviceoptions.find((option) => option.label === row.productorService) || { label: row.productorService, value: row.productorService } : null}
                        onChange={(selectedOption) => handleServiceChange(rowIndex, selectedOption)}
                        onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, rowIndex)}
                        isClearable
                        styles={{
                          control: (provided) => ({ ...provided, minWidth: 180, borderColor: getRowError(rowIndex, 'productorService') ? 'red' : '#e2e8f0' }),
                          menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                      />
                      {getRowError(rowIndex, 'productorService') && <p className="text-xs text-red-500 mt-0.5">{getRowError(rowIndex, 'productorService')}</p>}
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(rowIndex, e)} placeholder="Description" className="w-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0" />
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(rowIndex, e)} className={`w-20 rounded border bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${getRowError(rowIndex, 'rate') ? 'border-red-400' : 'border-slate-200'}`} />
                      {getRowError(rowIndex, 'rate') && <p className="text-xs text-red-500 mt-0.5">{getRowError(rowIndex, 'rate')}</p>}
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" name="quantity" value={row.quantity} onChange={(e) => handleInputChange(rowIndex, e)} className={`w-16 rounded border bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${getRowError(rowIndex, 'quantity') ? 'border-red-400' : 'border-slate-200'}`} />
                      {getRowError(rowIndex, 'quantity') && <p className="text-xs text-red-500 mt-0.5">{getRowError(rowIndex, 'quantity')}</p>}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-700">${row.amount}</td>
                    <td className="px-4 py-2">
                      <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(rowIndex, e)} className="h-4 w-4 rounded border-slate-300 text-blue-600 border-slate-300 focus:ring-blue-500" />
                    </td>
                    <td className="px-4 py-2">
                      {itemizedData.rows.length > 1 && (
                        <button type="button" onClick={() => deleteRow(rowIndex)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500">
                          <RiCloseLine className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Row Buttons */}
        <div className="flex items-center gap-4 mt-2">
          <button type="button" onClick={() => addRow()} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
            <AiOutlinePlusCircle className="h-4 w-4" /> Line item
          </button>
          <button type="button" onClick={() => addRow(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
            <CiDiscount1 className="h-4 w-4" /> Discount
          </button>
        </div>

        {/* Summary Section */}
        <h5 className="text-sm font-semibold text-slate-800 mt-4">Summary</h5>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden max-w-lg mt-2">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Subtotal</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tax Rate</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tax Total</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-slate-700">${itemizedData.subtotal || '0.00'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <input type="text" value={itemizedData.taxRate || '0'} onChange={handleTaxRateChange} className="w-16 rounded border border-slate-200 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">${itemizedData.taxTotal || '0.00'}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-900">${itemizedData.totalAmount || '0.00'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ServicesComponent;