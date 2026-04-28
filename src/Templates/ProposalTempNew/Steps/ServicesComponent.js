import React, { useState } from 'react';
import { X, PlusCircle, Tag } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';


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
  const [serviceSearch, setServiceSearch] = useState({});

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

  const clearFieldError = (field) => {
    if (stepErrors?.[field]) {
      setStepErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };

  const clearRowErrors = (rowIndex) => {
    if (stepErrors?.rowErrors) {
      setStepErrors(prev => {
        const e = { ...prev };
        e.rowErrors = e.rowErrors.filter(err => err.rowIndex !== rowIndex);
        if (e.rowErrors.length === 0) { delete e.rowErrors; delete e.itemizedDetails; }
        return e;
      });
    }
  };

  const updateItemizedDataField = (field, value) => {
    updateFormData('services', { itemizedData: { ...itemizedData, [field]: value } });
  };

  // Row management functions
  const addRow = (isDiscount = false) => {
    const newRow = getEmptyRow();
    if (isDiscount) { newRow.isDiscount = true; newRow.productorService = 'Discount'; }
    const updatedRows = [...(itemizedData.rows || []), newRow];
    updateFormData('services', { itemizedData: { ...itemizedData, rows: updatedRows, ...calculateSummary(updatedRows, itemizedData.taxRate) } });
    clearFieldError('itemized');
  };

  const deleteRow = (rowIndex) => {
    const updatedRows = itemizedData.rows.filter((_, i) => i !== rowIndex);
    updateFormData('services', { itemizedData: { ...itemizedData, rows: updatedRows, ...calculateSummary(updatedRows, itemizedData.taxRate) } });
    clearRowErrors(rowIndex);
  };

  const handleRowFieldChange = (rowIndex, name, value) => {
    const updatedRows = itemizedData.rows.map((row, i) =>
      i === rowIndex ? { ...row, [name]: value } : row
    );
    const recalculated = recalculateRowAmounts(updatedRows);
    updateFormData('services', { itemizedData: { ...itemizedData, rows: recalculated, ...calculateSummary(recalculated, itemizedData.taxRate) } });
    if ((name === 'productorService' && value.trim()) || ((name === 'rate' || name === 'quantity') && parseFloat(value) > 0)) {
      clearRowErrors(rowIndex);
    }
  };

  const handleServiceSelect = (index, option) => {
    handleRowFieldChange(index, 'productorService', option.label);
    setServiceSearch(prev => ({ ...prev, [index]: option.label }));
    if (option.value) fetchservicebyid(option.value, index);
    clearRowErrors(index);
  };

  const fetchservicebyid = async (id, rowIndex) => {
    try {
      const res = await fetch(`${SERVICE_API}/workflow/services/servicetemplate/${id}`);
      const result = await res.json();
      const service = Array.isArray(result.serviceTemplate) ? result.serviceTemplate[0] : result.serviceTemplate;
      const rate = service.rate ? parseFloat(service.rate.replace('$', '')) : 0;
      const updatedRowData = { productorService: service.serviceName || '', description: service.description || '', rate: rate.toFixed(2), quantity: '1', amount: rate.toFixed(2), tax: service.tax || false, isDiscount: false };
      const currentRows = [...formData.services.itemizedData.rows];
      const updatedRows = currentRows.map((row, i) => i === rowIndex ? { ...row, ...updatedRowData } : row);
      const recalculated = recalculateRowAmounts(updatedRows);
      updateFormData('services', { itemizedData: { ...formData.services.itemizedData, rows: recalculated, ...calculateSummary(recalculated, formData.services.itemizedData.taxRate) } });
      clearRowErrors(rowIndex);
    } catch (err) { console.error(err); }
  };

  const calculateSummary = (rows, taxRate = 0) => {
    const subtotal = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
    const taxRateValue = parseFloat(taxRate) || 0;
    const taxableAmount = rows.reduce((sum, row) => row.tax ? sum + (parseFloat(row.amount) || 0) : sum, 0);
    const taxTotal = taxableAmount * (taxRateValue / 100);
    return { subtotal: subtotal.toFixed(2), taxTotal: taxTotal.toFixed(2), totalAmount: (subtotal + taxTotal).toFixed(2) };
  };

  const recalculateRowAmounts = (rows) =>
    rows.map(row => ({ ...row, amount: ((parseFloat(row.rate) || 0) * (parseFloat(row.quantity) || 0)).toFixed(2) }));

  const handleTaxRateChange = (value) => {
    updateFormData('services', { itemizedData: { ...itemizedData, ...calculateSummary(itemizedData.rows, value), taxRate: value } });
  };

  const getRowError = (rowIndex, field) => {
    const rowError = stepErrors?.rowErrors?.find(e => e.rowIndex === rowIndex);
    return rowError ? rowError[field] : null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">Itemized Service</h3>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
        <p className="text-xs text-amber-700">No Payment step will be shown for itemized services</p>
      </div>

      <div>
        <div className="mb-2">
          <h5 className="text-sm font-semibold text-foreground">Line items</h5>
          <p className="text-xs text-muted-foreground">Client-facing itemized list of products and services</p>
        </div>

        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product / Service</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rate</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {itemizedData.rows && itemizedData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-muted/20">
                    <td className="px-4 py-2 min-w-[200px]">
                      <div className="relative">
                        <Input
                          value={serviceSearch[rowIndex] ?? row.productorService}
                          placeholder={row.isDiscount ? 'Reason for discount' : 'Product or Service'}
                          className={`h-8 text-sm ${getRowError(rowIndex, 'productorService') ? 'border-destructive' : ''}`}
                          onChange={e => {
                            setServiceSearch(prev => ({ ...prev, [rowIndex]: e.target.value }));
                            handleRowFieldChange(rowIndex, 'productorService', e.target.value);
                          }}
                        />
                        {(serviceSearch[rowIndex] || '').length > 0 && serviceoptions.filter(o => o.label.toLowerCase().includes((serviceSearch[rowIndex] || '').toLowerCase())).length > 0 && (
                          <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg max-h-40 overflow-y-auto">
                            {serviceoptions.filter(o => o.label.toLowerCase().includes((serviceSearch[rowIndex] || '').toLowerCase())).map(o => (
                              <button key={o.value} type="button" onMouseDown={() => handleServiceSelect(rowIndex, o)} className="block w-full px-3 py-1.5 text-left text-sm hover:bg-muted">{o.label}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      {getRowError(rowIndex, 'productorService') && <p className="text-xs text-destructive mt-0.5">{getRowError(rowIndex, 'productorService')}</p>}
                    </td>
                    <td className="px-4 py-2">
                      <Input value={row.description} placeholder="Description" className="h-8 border-0 bg-transparent text-sm" onChange={e => handleRowFieldChange(rowIndex, 'description', e.target.value)} />
                    </td>
                    <td className="px-4 py-2">
                      <Input value={row.rate} className={`h-8 w-20 text-sm ${getRowError(rowIndex, 'rate') ? 'border-destructive' : ''}`} onChange={e => handleRowFieldChange(rowIndex, 'rate', e.target.value)} />
                      {getRowError(rowIndex, 'rate') && <p className="text-xs text-destructive mt-0.5">{getRowError(rowIndex, 'rate')}</p>}
                    </td>
                    <td className="px-4 py-2">
                      <Input value={row.quantity} className={`h-8 w-16 text-sm ${getRowError(rowIndex, 'quantity') ? 'border-destructive' : ''}`} onChange={e => handleRowFieldChange(rowIndex, 'quantity', e.target.value)} />
                      {getRowError(rowIndex, 'quantity') && <p className="text-xs text-destructive mt-0.5">{getRowError(rowIndex, 'quantity')}</p>}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground">${row.amount}</td>
                    <td className="px-4 py-2">
                      <Checkbox checked={row.tax} onCheckedChange={val => handleRowFieldChange(rowIndex, 'tax', val)} />
                    </td>
                    <td className="px-4 py-2">
                      {itemizedData.rows.length > 1 && (
                        <button type="button" onClick={() => deleteRow(rowIndex)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-destructive">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button type="button" onClick={() => addRow()} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
            <PlusCircle className="h-4 w-4" /> Line item
          </button>
          <button type="button" onClick={() => addRow(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
            <Tag className="h-4 w-4" /> Discount
          </button>
        </div>

        <h5 className="text-sm font-semibold text-foreground mt-4">Summary</h5>
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden max-w-lg mt-2">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subtotal</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax Rate</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax Total</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-foreground">${itemizedData.subtotal || '0.00'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Input value={itemizedData.taxRate || '0'} className="h-8 w-16 text-sm" onChange={e => handleTaxRateChange(e.target.value)} />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">${itemizedData.taxTotal || '0.00'}</td>
                <td className="px-4 py-3 text-sm font-bold text-foreground">${itemizedData.totalAmount || '0.00'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServicesComponent;