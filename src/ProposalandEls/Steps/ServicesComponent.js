

import React,{useState,useEffect} from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  IconButton,
  Typography,
  InputLabel,
  TextField,Alert,FormControl,FormHelperText,Menu,MenuItem,Autocomplete
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RiCloseLine } from 'react-icons/ri';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { CiDiscount1 } from 'react-icons/ci';
import CreatableSelect from 'react-select/creatable';

import SaveAsServiceDrawer from "./SaveAsServiceDrawer"
import EditServiceDrawer from "./EditServiceDrawer"

const SERVICE_API = process.env.REACT_APP_SERVICES_URL || 'https://www.snptaxes.com';


// const ServicesComponent = ({ 
//   formData, 
//   updateFormData, 
//   stepErrors, 
//   setStepErrors,
//   serviceoptions 
// }) => {
 
  
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
//       productorService: '',
//       description: '',
//       rate: '0.00',
//       quantity: '1',
//       amount: '0.00',
//       tax: false,
//       isDiscount: false,
//     };
//   }

//   // Validate itemized data
//   const validateItemizedData = () => {
//     const newErrors = {};
    
//     // Check if any rows exist
//     if (!itemizedData.rows || itemizedData.rows.length === 0) {
//       newErrors.itemized = 'At least one line item is required';
//     } else {
//       // Check each row for required fields
//       const rowErrors = itemizedData.rows.map((row, index) => {
//         const rowError = {};
        
//         if (!row.productorService?.trim()) {
//           rowError.productorService = 'Product/Service name is required';
//         }
        
//         if (!row.rate || parseFloat(row.rate) <= 0) {
//           rowError.rate = 'Valid rate is required';
//         }
        
//         if (!row.quantity || parseFloat(row.quantity) <= 0) {
//           rowError.quantity = 'Valid quantity is required';
//         }
        
//         return Object.keys(rowError).length > 0 ? { rowIndex: index, ...rowError } : null;
//       }).filter(Boolean);
      
//       if (rowErrors.length > 0) {
//         newErrors.rowErrors = rowErrors;
//         newErrors.itemizedDetails = 'Please fix line item errors';
//       }
//     }
    
//     setStepErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Clear specific error when field is updated
//   const clearFieldError = (field) => {
//     if (stepErrors[field]) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   // Clear row errors when a row is updated
//   const clearRowErrors = (rowIndex) => {
//     if (stepErrors.rowErrors) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         newErrors.rowErrors = newErrors.rowErrors.filter(error => error.rowIndex !== rowIndex);
//         if (newErrors.rowErrors.length === 0) {
//           delete newErrors.rowErrors;
//           delete newErrors.itemizedDetails;
//         }
//         return newErrors;
//       });
//     }
//   };

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
//       newRow.productorService = 'Discount';
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
    
//     // Clear errors when adding new row
//     clearFieldError('itemized');
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
    
//     // Clear errors for deleted row
//     clearRowErrors(rowIndex);
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
    
//     // Clear errors when user starts typing
//     if (name === 'productorService' && value.trim() !== '') {
//       clearRowErrors(rowIndex);
//     }
//     if ((name === 'rate' || name === 'quantity') && value && parseFloat(value) > 0) {
//       clearRowErrors(rowIndex);
//     }
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
    
//     // Clear errors when service is selected
//     if (selectedOption && selectedOption.label) {
//       clearRowErrors(index);
//     }
    
//     // Call fetch only if an option is actually selected
//     if (selectedOption && selectedOption.value) {
//       fetchservicebyid(selectedOption.value, index);
//     }
//   };

//   const fetchservicebyid = async (id, rowIndex) => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };
//     const url = `${SERVICE_API}/workflow/services/servicetemplate/${id}`;
    
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("fcdfdgc",result)
//         const service = Array.isArray(result.serviceTemplate)
//           ? result.serviceTemplate[0]
//           : result.serviceTemplate;
//         const rate = service.rate
//           ? parseFloat(service.rate.replace("$", ""))
//           : 0;
        
//         // Create updated row data with correct field names
//         const updatedRowData = {
//           productorService: service.serviceName || "",
//           description: service.description || "",
//           rate: rate.toFixed(2),
//           quantity: "1",
//           amount: rate.toFixed(2),
//           tax: service.tax || false,
//           isDiscount: false,
//         };

//         // Update the form data through the existing state management
//         const currentRows = [...formData.services.itemizedData.rows];
//         const updatedRows = currentRows.map((row, index) => 
//           index === rowIndex 
//             ? { ...row, ...updatedRowData }
//             : row
//         );

//         // Recalculate amounts and update form data
//         const recalculatedRows = recalculateRowAmounts(updatedRows);
//         const summary = calculateSummary(recalculatedRows, formData.services.itemizedData.taxRate);
        
//         updateFormData('services', {
//           itemizedData: {
//             ...formData.services.itemizedData,
//             rows: recalculatedRows,
//             ...summary
//           }
//         });
        
//         // Clear errors after successful fetch
//         clearRowErrors(rowIndex);
//       })
//       .catch((error) => console.error(error));
//   };

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
      
//       // Clear errors when user types
//       if (inputValue.trim() !== '') {
//         clearRowErrors(index);
//       }
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
//       const quantity = parseFloat(row.quantity) || 0;
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

//   // Get error for specific row and field
//   const getRowError = (rowIndex, field) => {
//     if (stepErrors.rowErrors) {
//       const rowError = stepErrors.rowErrors.find(error => error.rowIndex === rowIndex);
//       return rowError ? rowError[field] : null;
//     }
//     return null;
//   };

//   return (
//     <div className="itemized-section">
//       <h3>Itemized Service</h3>
//       <div className="info-message">
//         <p>⚠️ No Payment step will be shown for itemized services</p>
//       </div>

//       {/* Show validation errors */}
//       {/* {(stepErrors.itemized || stepErrors.itemizedDetails) && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {stepErrors.itemized && <Box>- {stepErrors.itemized}</Box>}
//           {stepErrors.itemizedDetails && <Box>- {stepErrors.itemizedDetails}</Box>}
//         </Alert>
//       )} */}

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
//                     <FormControl error={!!getRowError(rowIndex, 'productorService')}>
//                       <CreatableSelect
//                         placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
//                         options={serviceoptions}
//                         value={row.productorService ? serviceoptions.find((option) => option.label === row.productorService) || { label: row.productorService, value: row.productorService } : null}
//                         onChange={(selectedOption) => handleServiceChange(rowIndex, selectedOption)}
//                         onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, rowIndex)}
//                         isClearable
//                         styles={{
//                           container: (provided) => ({ 
//                             ...provided, 
//                             width: "180px",
//                             borderColor: getRowError(rowIndex, 'productorService') ? 'red' : 'inherit'
//                           }),
//                           control: (provided, state) => ({ 
//                             ...provided, 
//                             width: "180px",
//                             borderColor: getRowError(rowIndex, 'productorService') ? 'red' : state.isFocused ? '#2684ff' : '#ccc',
//                             boxShadow: getRowError(rowIndex, 'productorService') ? '0 0 0 1px red' : state.isFocused ? '0 0 0 1px #2684ff' : 'none',
//                             '&:hover': {
//                               borderColor: getRowError(rowIndex, 'productorService') ? 'red' : '#999'
//                             }
//                           }),
//                           menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
//                         }}
//                         menuPortalTarget={document.body}
//                       />
//                       {getRowError(rowIndex, 'productorService') && (
//                         <FormHelperText error sx={{ mt: 0.5 }}>
//                           {getRowError(rowIndex, 'productorService')}
//                         </FormHelperText>
//                       )}
//                     </FormControl>
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
//                       error={!!getRowError(rowIndex, 'rate')}
//                       helperText={getRowError(rowIndex, 'rate')}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       name="quantity"
//                       value={row.quantity}
//                       onChange={(e) => handleInputChange(rowIndex, e)}
//                       sx={{ width: "60px" }}
//                       error={!!getRowError(rowIndex, 'quantity')}
//                       helperText={getRowError(rowIndex, 'quantity')}
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
  // Menu state management
  const [menuAnchor, setMenuAnchor] = useState(null); // { rowIndex: null, anchorEl: null }
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isNewServiceDrawerOpen, setIsNewServiceDrawerOpen] = useState(false);

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

  // Menu handlers
  const handleMenuOpen = (event, rowIndex) => {
    setMenuAnchor({
      rowIndex,
      anchorEl: event.currentTarget
    });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Helper to check if menu is open for specific row
  const isMenuOpen = (rowIndex) => {
    return menuAnchor && menuAnchor.rowIndex === rowIndex;
  };

  const handleEditService = (row, rowIndex) => {
    console.log("Row data:", row);
    setSelectedRowData(row);
    setSelectedRowIndex(rowIndex);
    handleMenuClose();
    setIsEditDrawerOpen(true);
  };

  const closeEditDrawer = () => {
    setSelectedRowData(null);
    setSelectedRowIndex(null);
    handleMenuClose();
    setIsEditDrawerOpen(false);
  };

  const handleSaveChanges = (updatedRowData = null) => {
    const dataToUse = updatedRowData || selectedRowData;
    
    if (selectedRowIndex !== null && dataToUse) {
      console.log("🔄 Saving changes for row:", selectedRowIndex);
      console.log("📝 Row data to save:", dataToUse);

      const currentRows = [...itemizedData.rows];
      const updatedRows = currentRows.map((row, index) => {
        if (index === selectedRowIndex) {
          return { ...dataToUse };
        }
        return row;
      });

      const recalculatedRows = recalculateRowAmounts(updatedRows);
      const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
      
      updateFormData('services', {
        itemizedData: {
          ...itemizedData,
          rows: recalculatedRows,
          ...summary
        }
      });
      
      clearRowErrors(selectedRowIndex);
    }
    
    closeEditDrawer();
  };

  const handleDuplicate = (rowIndex) => {
    if (rowIndex !== null) {
      const rowToDuplicate = itemizedData.rows[rowIndex];
      
      // Create a duplicate with "Copy" extension
      const duplicatedRow = {
        ...rowToDuplicate,
        productorService: `${rowToDuplicate.productorService} Copy`,
        description: rowToDuplicate.description,
        rate: rowToDuplicate.rate,
        quantity: rowToDuplicate.quantity,
        amount: rowToDuplicate.amount,
        tax: rowToDuplicate.tax,
        isDiscount: rowToDuplicate.isDiscount,
      };
      
      // Insert the duplicated row after the original row
      const newRows = [...itemizedData.rows];
      newRows.splice(rowIndex + 1, 0, duplicatedRow);
      
      const summary = calculateSummary(newRows, itemizedData.taxRate);
      
      updateFormData('services', {
        itemizedData: {
          ...itemizedData,
          rows: newRows,
          ...summary
        }
      });
      
      handleMenuClose();
    }
  };

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
    handleMenuClose();
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
    const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
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
   const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL || 'https://www.snptaxes.com'; 
const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
     
      const url = `${CATEGORY_API}/workflow/category/categorys`;
      const response = await fetch(url);
      const data = await response.json();
 
      setCategoryData(data.category);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const categoryoptions = categoryData.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));
  // Handler for saving as new service
  const handleServiceCreated = (newService) => {
    console.log('New service created:', newService);
  };

  const handleCategoryCreated = (newCategory) => {
    console.log('New category created:', newCategory);
      fetchData()
  };

  return (
    <div className="itemized-section">
      <h3>Itemized Service</h3>
      <div className="info-message">
        <p>⚠️ No Payment step will be shown for itemized services</p>
      </div>

      {/* Line Items Section */}
      <Box sx={{ mt: 3 }}>
        <Box sx={{ margin: "20px 0 10px 0" }}>
          <Typography variant="h6">Line items</Typography>
          <Typography variant="body2">Client-facing itemized list of products and services</Typography>
        </Box>
        
        <Box sx={{ overflow: "auto", width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product or service</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemizedData.rows && itemizedData.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <FormControl error={!!getRowError(rowIndex, 'productorService')}>
                      {/* <CreatableSelect
                        placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                        options={serviceoptions}
                        value={row.productorService ? serviceoptions.find((option) => option.label === row.productorService) || { label: row.productorService, value: row.productorService } : null}
                        onChange={(selectedOption) => handleServiceChange(rowIndex, selectedOption)}
                        onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, rowIndex)}
                        isClearable
                        styles={{
                          container: (provided) => ({ 
                            ...provided, 
                            width: "180px",
                            borderColor: getRowError(rowIndex, 'productorService') ? 'red' : 'inherit'
                          }),
                          control: (provided, state) => ({ 
                            ...provided, 
                            width: "180px",
                            borderColor: getRowError(rowIndex, 'productorService') ? 'red' : state.isFocused ? '#2684ff' : '#ccc',
                            boxShadow: getRowError(rowIndex, 'productorService') ? '0 0 0 1px red' : state.isFocused ? '0 0 0 1px #2684ff' : 'none',
                            '&:hover': {
                              borderColor: getRowError(rowIndex, 'productorService') ? 'red' : '#999'
                            }
                          }),
                          menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                      /> */}
                      <Autocomplete
                      size='small'
  value={row.productorService ? 
    (typeof row.productorService === 'string' ? 
      { title: row.productorService } : 
      { title: row.productorService.label }
    ) : 
    null
  }
  onChange={(event, newValue) => {
    if (typeof newValue === 'string') {
      // User typed and pressed enter
      handleServiceChange(rowIndex, { label: newValue, value: newValue });
    } else if (newValue && newValue.inputValue) {
      // User clicked "Add" option
      handleServiceChange(rowIndex, { 
        label: newValue.inputValue, 
        value: newValue.inputValue 
      });
    } else if (newValue) {
      // User selected from existing options
      handleServiceChange(rowIndex, { 
        label: newValue.title, 
        value: newValue.value || newValue.title 
      });
    } else {
      // User cleared the selection
      handleServiceChange(rowIndex, null);
    }
  }}
  onInputChange={(event, inputValue, reason) => {
    if (reason === 'input') {
      handleServiceInputChange(inputValue, { action: 'input-change' }, rowIndex);
    }
  }}
  filterOptions={(options, params) => {
    const filtered = options.filter(option => 
      option.title.toLowerCase().includes(params.inputValue.toLowerCase())
    );

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some((option) => 
      inputValue.toLowerCase() === option.title.toLowerCase()
    );
    
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        inputValue,
        title: `Add "${inputValue}"`,
      });
    }

    return filtered;
  }}
  selectOnFocus
  clearOnBlur
  handleHomeEndKeys
  options={serviceoptions.map(option => ({
    title: option.label,
    value: option.value
  }))}
  getOptionLabel={(option) => {
    // Value selected with enter, right from the input
    if (typeof option === 'string') {
      return option;
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return option.title;
  }}
  renderOption={(props, option) => {
    const { key, ...optionProps } = props;
    return (
      <li key={key} {...optionProps}>
        {option.title}
      </li>
    );
  }}
  sx={{ 
    width: 180,
    '& .MuiOutlinedInput-root': {
      borderColor: getRowError(rowIndex, 'productorService') ? 'red' : 'inherit',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: getRowError(rowIndex, 'productorService') ? 'red' : undefined,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: getRowError(rowIndex, 'productorService') ? 'red' : '#999',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: getRowError(rowIndex, 'productorService') ? 'red' : '#2684ff',
        boxShadow: getRowError(rowIndex, 'productorService') ? '0 0 0 1px red' : '0 0 0 1px #2684ff',
      }
    }
  }}
  freeSolo
  renderInput={(params) => (
    <TextField 
      {...params} 
      placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
      error={!!getRowError(rowIndex, 'productorService')}
      helperText={getRowError(rowIndex, 'productorService')}
    />
  )}
/>
                      {getRowError(rowIndex, 'productorService') && (
                        <FormHelperText error sx={{ mt: 0.5 }}>
                          {getRowError(rowIndex, 'productorService')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      name="description"
                      value={row.description}
                      onChange={(e) => handleInputChange(rowIndex, e)}
                      placeholder="Description"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      name="rate"
                      value={row.rate}
                      onChange={(e) => handleInputChange(rowIndex, e)}
                      sx={{ width: "80px" }}
                      error={!!getRowError(rowIndex, 'rate')}
                      helperText={getRowError(rowIndex, 'rate')}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      name="quantity"
                      value={row.quantity}
                      onChange={(e) => handleInputChange(rowIndex, e)}
                      sx={{ width: "60px" }}
                      error={!!getRowError(rowIndex, 'quantity')}
                      helperText={getRowError(rowIndex, 'quantity')}
                    />
                  </TableCell>
                  <TableCell>${row.amount}</TableCell>
                  <TableCell>
                    <Checkbox 
                      name="tax" 
                      checked={row.tax} 
                      onChange={(e) => handleInputChange(rowIndex, e)} 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuOpen(event, rowIndex)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu 
                      anchorEl={menuAnchor?.anchorEl || null}
                      open={isMenuOpen(rowIndex)}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: "top", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                      sx={{ mt: 5 }}
                    >
                      <MenuItem onClick={() => handleEditService(row, rowIndex)}>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => handleDuplicate(rowIndex)}>
                        Duplicate
                      </MenuItem>
                      <MenuItem onClick={() => deleteRow(rowIndex)}>
                        Delete
                      </MenuItem>
                      <MenuItem onClick={() => {
                        setSelectedRowData(row);
                        setIsNewServiceDrawerOpen(true);
                        handleMenuClose();
                      }}>
                        Save as new service
                      </MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell>
                   
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Add Row Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "10px" }}>
          <Button 
            onClick={() => addRow()} 
            startIcon={<AiOutlinePlusCircle />} 
            sx={{ color: "blue", fontSize: "15px" }}
          >
            Line item
          </Button>
          <Button 
            onClick={() => addRow(true)} 
            startIcon={<CiDiscount1 />} 
            sx={{ color: "blue", fontSize: "15px" }}
          >
            Discount
          </Button>
        </Box>

        {/* Summary Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Summary</Typography>
          <Table sx={{ backgroundColor: "#fff", width: "50%" }}>
            <TableHead>
              <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell>Tax Rate</TableCell>
                <TableCell>Tax Total</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>${itemizedData.subtotal || '0.00'}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={itemizedData.taxRate || '0'}
                    onChange={handleTaxRateChange}
                    sx={{ width: "60px" }}
                    InputProps={{
                      endAdornment: '%',
                    }}
                  />
                </TableCell>
                <TableCell>${itemizedData.taxTotal || '0.00'}</TableCell>
                <TableCell>${itemizedData.totalAmount || '0.00'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>

      {/* Drawers */}
      <SaveAsServiceDrawer
        open={isNewServiceDrawerOpen}
        onClose={() => setIsNewServiceDrawerOpen(false)}
        selectedRowData={selectedRowData}
        onServiceCreated={handleServiceCreated}
        onCategoryCreated={handleCategoryCreated}
         categoryOptions={categoryoptions}// You'll need to pass these if available
      />
      
      <EditServiceDrawer
        open={isEditDrawerOpen}
        onClose={closeEditDrawer}
        selectedRowData={selectedRowData}
        setSelectedRowData={setSelectedRowData}
        onSave={(updatedData) => handleSaveChanges(updatedData)}
      />
    </div>
  );
};
export default ServicesComponent;