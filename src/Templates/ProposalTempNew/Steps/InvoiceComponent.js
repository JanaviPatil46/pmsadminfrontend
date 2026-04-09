import React from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { CiDiscount1 } from 'react-icons/ci';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import Editor from '../components/Editor';


// const InvoiceComponent = ({ 
//   invoices, 
//   setInvoices, 
//   invoiceTemplates, 
//   teammemberoption, 
//   serviceoptions,
//   formData,
//   updateFormData 
// }) => {
//   const invoiceissueoptions = ['immediately', 'specific date'];
//   const timeOptions = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

//   // Invoice management functions
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

//   const addInvoice = () => {
//     const newId = invoices.length > 0 ? Math.max(...invoices.map(inv => inv.id)) + 1 : 1;
//     setInvoices(prev => [...prev, { id: newId, ...getEmptyInvoice() }]);
//   };

//   const removeInvoice = (id) => {
//     if (invoices.length > 1) {
//       setInvoices(prev => prev.filter(invoice => invoice.id !== id));
//     }
//   };

//   const updateInvoice = (id, field, value) => {
//     setInvoices(prev => prev.map(invoice => 
//       invoice.id === id ? { ...invoice, [field]: value } : invoice
//     ));
//   };

//   // Handler functions for individual invoices
//   const handleInvoiceTemplateChange = (id, selectedOption) => {
//     updateInvoice(id, 'invoiceTemplate', selectedOption);
//     if (selectedOption) {
//       fetchInvoiceTemplateDetails(id, selectedOption.value);
//     }
//   };

//   const handleTeamMemberChange = (id, selectedOption) => {
//     updateInvoice(id, 'teamMember', selectedOption);
//   };

//   const handleIssueChange = (id, value) => {
//     updateInvoice(id, 'issueInvoice', value);
//   };

//   const handleDateChange = (id, date) => {
//     updateInvoice(id, 'specificDate', date);
//   };

//   const handleTimeChange = (id, time) => {
//     updateInvoice(id, 'selectedTime', time);
//   };

//   const handleDescriptionChange = (id, e) => {
//     const value = e.target.value;
//     updateInvoice(id, 'description', value);
//     updateInvoice(id, 'charCount', value.length);
//   };

//   const handleEditorChange = (id, content) => {
//     updateInvoice(id, 'clientNote', content);
//   };

//   // New handler functions for CreatableSelect
//   const handleServiceChange = (id, rowIndex, selectedOption) => {
//     setInvoices(prev => prev.map(invoice => {
//       if (invoice.id === id) {
//         const updatedRows = invoice.rows.map((row, index) => 
//           index === rowIndex 
//             ? { ...row, productorService: selectedOption ? selectedOption.label : "" }
//             : row
//         );
        
//         const summary = calculateSummary(updatedRows, invoice.taxRate);
        
//         return {
//           ...invoice,
//           rows: updatedRows,
//           ...summary
//         };
//       }
//       return invoice;
//     }));
    
//     // Call fetch only if an option is actually selected and has a value
//     if (selectedOption && selectedOption.value) {
//       fetchservicebyid(id, rowIndex, selectedOption.value);
//     }
//   };

//   const handleServiceInputChange = (id, rowIndex, inputValue, actionMeta) => {
//     if (actionMeta.action === "input-change") {
//       setInvoices(prev => prev.map(invoice => {
//         if (invoice.id === id) {
//           const updatedRows = invoice.rows.map((row, index) => 
//             index === rowIndex 
//               ? { ...row, productorService: inputValue }
//               : row
//           );
          
//           const summary = calculateSummary(updatedRows, invoice.taxRate);
          
//           return {
//             ...invoice,
//             rows: updatedRows,
//             ...summary
//           };
//         }
//         return invoice;
//       }));
//     }
//   };

//   // Fetch service by ID function
//   const fetchservicebyid = async (invoiceId, rowIndex, serviceId) => {
//     const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };
//     const url = `${SERVICE_API}/workflow/services/servicetemplate/${serviceId}`;
    
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         const service = Array.isArray(result.serviceTemplate)
//           ? result.serviceTemplate[0]
//           : result.serviceTemplate;
//         const rate = service.rate
//           ? parseFloat(service.rate.replace("$", ""))
//           : 0;
        
//         // Create updated row data
//         const updatedRowData = {
//           productorService: service.serviceName || "",
//           description: service.description || "",
//           rate: rate.toFixed(2),
//           quantity: "1",
//           amount: rate.toFixed(2),
//           tax: service.tax || false,
//           isDiscount: false,
//         };

//         // Update the invoice with the fetched service data
//         setInvoices(prev => prev.map(invoice => {
//           if (invoice.id === invoiceId) {
//             const updatedRows = invoice.rows.map((row, index) => 
//               index === rowIndex 
//                 ? { ...row, ...updatedRowData }
//                 : row
//             );
            
//             const summary = calculateSummary(updatedRows, invoice.taxRate);
            
//             return {
//               ...invoice,
//               rows: updatedRows,
//               ...summary
//             };
//           }
//           return invoice;
//         }));
//       })
//       .catch((error) => console.error(error));
//   };

//   // Row management for individual invoices
//   const addRow = (id, isDiscount = false) => {
//     const newRow = getEmptyRow();
//     if (isDiscount) {
//       newRow.isDiscount = true;
//       newRow.productorService = 'Discount';
//     }
    
//     setInvoices(prev => prev.map(invoice => 
//       invoice.id === id 
//         ? { ...invoice, rows: [...invoice.rows, newRow] }
//         : invoice
//     ));
//   };

//   const deleteRow = (id, rowIndex) => {
//     setInvoices(prev => prev.map(invoice => 
//       invoice.id === id 
//         ? { 
//             ...invoice, 
//             rows: invoice.rows.filter((_, index) => index !== rowIndex)
//           }
//         : invoice
//     ));
//   };

//   const handleInputChange = (id, rowIndex, e) => {
//     const { name, value, type, checked } = e.target;
    
//     setInvoices(prev => prev.map(invoice => {
//       if (invoice.id === id) {
//         const updatedRows = invoice.rows.map((row, index) => 
//           index === rowIndex 
//             ? { 
//                 ...row, 
//                 [name]: type === 'checkbox' ? checked : value,
//                 // Recalculate amount if rate or quantity changes
//                 ...((name === 'rate' || name === 'quantity') ? {
//                   amount: ((parseFloat(name === 'rate' ? value : row.rate) || 0) * 
//                           (parseFloat(name === 'quantity' ? value : row.quantity) || 0)).toFixed(2)
//                 } : {})
//               }
//             : row
//         );
        
//         const summary = calculateSummary(updatedRows, invoice.taxRate);
        
//         return {
//           ...invoice,
//           rows: updatedRows,
//           ...summary
//         };
//       }
//       return invoice;
//     }));
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

//   const handleTaxRateChange = (id, value) => {
//     setInvoices(prev => prev.map(invoice => {
//       if (invoice.id === id) {
//         const taxRateValue = parseFloat(value) || 0;
//         const subtotal = invoice.rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
//         const taxableAmount = invoice.rows.reduce((sum, row) => {
//           return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
//         }, 0);
        
//         const taxTotal = taxableAmount * (taxRateValue / 100);
//         const totalAmount = subtotal + taxTotal;
        
//         return {
//           ...invoice,
//           taxRate: value,
//           taxTotal: taxTotal.toFixed(2),
//           totalAmount: totalAmount.toFixed(2)
//         };
//       }
//       return invoice;
//     }));
//   };

//   const fetchInvoiceTemplateDetails = async (id, templateId) => {
//     try {
//       const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';
//       const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${templateId}`;
//       const response = await fetch(url);
//       const result = await response.json();
      
//       if (result) {
//         const template = result.invoiceTemplate || result;
//         console.log("selected invoice result", template);
        
//         setInvoices(prev => prev.map(invoice => 
//           invoice.id === id 
//             ? {
//                 ...invoice,
//                 description: template.description || "",
//                 clientNote: template.messageForClient || template.clientNote || "",
//                 rows: template.lineItems?.map(item => ({
//                   productorService: item.productorService || "",
//                   description: item.description || "",
//                   rate: String(item.rate || "0.00"),
//                   quantity: String(item.quantity || "1"),
//                   amount: String(item.amount || "0.00"),
//                   tax: item.tax || false,
//                   isDiscount: item.isDiscount || false,
//                 })) || [getEmptyRow()],
//                 taxRate: template.summary?.taxRate || "0",
//                 subtotal: template.summary?.subtotal || "0",
//                 taxTotal: template.summary?.taxTotal || "0",
//                 totalAmount: template.summary?.total || "0",
//               }
//             : invoice
//         ));
//       }
//     } catch (error) {
//       console.error("Error fetching template details:", error);
//     }
//   };

//   const invoiceOptions = invoiceTemplates.map(template => ({
//     value: template._id,
//     label: template.templatename,
//   }));

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box sx={{ mt: 2 }}>
       
        
//         {invoices.map((invoice, invoiceIndex) => (
//           <Paper key={invoice.id} elevation={2} sx={{ p: 2, mt: 2, position: 'relative' }}>
//             {invoices.length > 1 && (
//               <IconButton 
//                 sx={{ position: 'absolute', top: 8, right: 8 }}
//                 onClick={() => removeInvoice(invoice.id)}
//               >
//                 <RiCloseLine />
//               </IconButton>
//             )}
            
//             <Typography variant="h6" gutterBottom>
//               Invoice #{invoiceIndex + 1}
//             </Typography>
            
//             <Box padding={2}>
//               <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//                 <Grid  xs={6}>
//                   <Box>
//                     <InputLabel sx={{ color: "black" }}>Invoice Template</InputLabel>
//                     <Autocomplete 
//                       options={invoiceOptions}
//                       sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }} 
//                       size="small"
//                       value={invoice.invoiceTemplate}
//                       onChange={(event, value) => handleInvoiceTemplateChange(invoice.id, value)}
//                       isOptionEqualToValue={(option, value) => option?.value === value?.value}
//                       getOptionLabel={(option) => option?.label || ""}
//                       renderInput={(params) => <TextField {...params} placeholder="Invoice Template" />}
//                       isClearable={true} 
//                     />
//                   </Box>
//                 </Grid>
//                 <Grid  xs={6}>
//                   <InputLabel sx={{ color: "black" }}>Team Member</InputLabel>
//                   <Autocomplete 
//                     sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }} 
//                     size="small" 
//                     options={teammemberoption}
//                     value={invoice.teamMember}
//                     onChange={(event, value) => handleTeamMemberChange(invoice.id, value)}
//                     isOptionEqualToValue={(option, value) => option?.value === value?.value} 
//                     getOptionLabel={(option) => option?.label || ""}
//                     renderInput={(params) => <TextField {...params} placeholder="Team Member" />} 
//                   />
//                 </Grid>
//               </Grid>

//               <Box>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={4}>
//                     <InputLabel sx={{ color: "black" }}>Issue invoice</InputLabel>
//                     <Autocomplete
//                       sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }}
//                       size="small"
//                       options={invoiceissueoptions}
//                       value={invoice.issueInvoice}
//                       onChange={(event, value) => handleIssueChange(invoice.id, value)}
//                       renderInput={(params) => <TextField {...params} placeholder="Issue invoice" />}
//                     />
//                   </Grid>
//                   {invoice.issueInvoice === "specific date" && (
//                     <>
//                       <Grid item xs={12} md={4}>
//                         <InputLabel>Date</InputLabel>
//                         <DatePicker 
//                           format="MM/DD/YYYY" 
//                           sx={{ width: "100%", backgroundColor: "#fff" }} 
//                           value={invoice.specificDate}
//                           onChange={(date) => handleDateChange(invoice.id, date)}
//                           renderInput={(params) => <TextField {...params} size="small" />} 
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={4}>
//                         <InputLabel>Time</InputLabel>
//                         <Autocomplete 
//                           sx={{ mt: 1, mb: 2, backgroundColor: "#fff" }} 
//                           options={timeOptions} 
//                           size="small" 
//                           value={invoice.selectedTime}
//                           onChange={(event, value) => handleTimeChange(invoice.id, value)}
//                           renderInput={(params) => <TextField {...params} placeholder="Select Time" variant="outlined" />} 
//                           fullWidth 
//                         />
//                       </Grid>
//                     </>
//                   )}
//                 </Grid>
//               </Box>

//               <Box sx={{ position: "relative", mt: 2 }}>
//                 <InputLabel sx={{ color: "black" }}>Description</InputLabel>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   margin="normal"
//                   type="text"
//                   value={invoice.description}
//                   onChange={(e) => handleDescriptionChange(invoice.id, e)}
//                   placeholder="Description"
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <Typography sx={{ color: "gray", fontSize: "12px" }}>
//                           {invoice.charCount}/{invoice.charLimit}
//                         </Typography>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Box>

//               {/* Line Items Table */}
//               <Box>
//                 <Box sx={{ margin: "20px 0 10px 0" }}>
//                   <Typography variant="h6">Line items</Typography>
//                   <Typography variant="body2">Client-facing itemized list of products and services</Typography>
//                 </Box>
//                 <Box sx={{ overflow: "auto", width: "100%" }}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Product or service</TableCell>
//                         <TableCell>Description</TableCell>
//                         <TableCell>Rate</TableCell>
//                         <TableCell>Qty</TableCell>
//                         <TableCell>Amount</TableCell>
//                         <TableCell>Tax</TableCell>
//                         <TableCell></TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {invoice.rows.map((row, rowIndex) => (
//                         <TableRow key={rowIndex}>
//                           <TableCell>
//                             <CreatableSelect
//                               placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
//                               options={serviceoptions}
//                               value={row.productorService ? serviceoptions.find((option) => option.label === row.productorService) || { label: row.productorService, value: row.productorService } : null}
//                               onChange={(selectedOption) => handleServiceChange(invoice.id, rowIndex, selectedOption)}
//                               onInputChange={(inputValue, actionMeta) => handleServiceInputChange(invoice.id, rowIndex, inputValue, actionMeta)}
//                               isClearable
//                               styles={{
//                                 container: (provided) => ({ ...provided, width: "180px" }),
//                                 control: (provided) => ({ ...provided, width: "180px" }),
//                                 menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
//                               }}
//                               menuPortalTarget={document.body}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               size="small"
//                               name="description"
//                               value={row.description}
//                               onChange={(e) => handleInputChange(invoice.id, rowIndex, e)}
//                               placeholder="Description"
//                               fullWidth
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               size="small"
//                               name="rate"
//                               value={row.rate}
//                               onChange={(e) => handleInputChange(invoice.id, rowIndex, e)}
//                               sx={{ width: "80px" }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               size="small"
//                               name="quantity"
//                               value={row.quantity}
//                               onChange={(e) => handleInputChange(invoice.id, rowIndex, e)}
//                               sx={{ width: "60px" }}
//                             />
//                           </TableCell>
//                           <TableCell>${row.amount}</TableCell>
//                           <TableCell>
//                             <Checkbox 
//                               name="tax" 
//                               checked={row.tax} 
//                               onChange={(e) => handleInputChange(invoice.id, rowIndex, e)} 
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <IconButton onClick={() => deleteRow(invoice.id, rowIndex)}>
//                               <RiCloseLine />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </Box>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "10px" }}>
//                   <Button onClick={() => addRow(invoice.id)} startIcon={<AiOutlinePlusCircle />} sx={{ color: "blue", fontSize: "15px" }}>
//                     Line item
//                   </Button>
//                   <Button onClick={() => addRow(invoice.id, true)} startIcon={<CiDiscount1 />} sx={{ color: "blue", fontSize: "15px" }}>
//                     Discount
//                   </Button>
//                 </Box>

//                 {/* Summary */}
//                 <Typography variant="h6" sx={{ mt: 2 }}>Summary</Typography>
//                 <Table sx={{ backgroundColor: "#fff", width: "50%" }}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Subtotal</TableCell>
//                       <TableCell>Tax Rate</TableCell>
//                       <TableCell>Tax Total</TableCell>
//                       <TableCell>Total</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>${invoice.subtotal}</TableCell>
//                       <TableCell>
//                         <TextField
//                           size="small"
//                           value={invoice.taxRate}
//                           onChange={(e) => handleTaxRateChange(invoice.id, e.target.value)}
//                           sx={{ width: "60px" }}
//                         />%
//                       </TableCell>
//                       <TableCell>${invoice.taxTotal}</TableCell>
//                       <TableCell>${invoice.totalAmount}</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </Box>

//               {/* Client Note Editor */}
//               <Box sx={{ width: "100%", mt: 3, mb: 3 }}>
//                 <InputLabel sx={{ color: "black", mb: 1 }}>Note for Client</InputLabel>
//                 <Editor 
//                   onChange={(content) => handleEditorChange(invoice.id, content)} 
//                   initialContent={invoice.clientNote} 
//                 />
//               </Box>
//             </Box>
//           </Paper>
//         ))}

//         {/* Add Invoice Button */}
//         <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
//           <Button variant="outlined" onClick={addInvoice}>
//             Add  invoice
//           </Button>
//         </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// };
const InvoiceComponent = ({ 
  invoices, 
  setInvoices, 
  invoiceTemplates, 
  teammemberoption, 
  serviceoptions,
  formData,
  updateFormData,
  stepErrors,
  setStepErrors
}) => {
  const invoiceissueoptions = ['immediately', 'specific date'];
  const timeOptions = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  // Validate invoices
  const validateInvoices = () => {
    const newErrors = {};
    
    // Check if at least one invoice exists
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
            return Object.keys(rowError).length > 0 ? { rowIndex, ...rowError } : null;
          }).filter(Boolean);
          
          if (rowErrors.length > 0) {
            invoiceError.rowErrors = rowErrors;
          }
        }
        
        return Object.keys(invoiceError).length > 0 ? { invoiceIndex: index, ...invoiceError } : null;
      }).filter(Boolean);
      
      if (invoiceErrors.length > 0) {
        newErrors.invoiceErrors = invoiceErrors;
        newErrors.invoiceDetails = 'Please fix invoice errors';
      }
    }
    
    setStepErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear specific error when field is updated
  const clearInvoiceError = (invoiceId, field) => {
    if (stepErrors.invoiceErrors) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
        if (invoiceIndex !== -1) {
          newErrors.invoiceErrors = newErrors.invoiceErrors.filter(error => 
            !(error.invoiceIndex === invoiceIndex && error[field])
          );
          if (newErrors.invoiceErrors.length === 0) {
            delete newErrors.invoiceErrors;
            delete newErrors.invoiceDetails;
          }
        }
        return newErrors;
      });
    }
  };

  // Clear the "at least one invoice required" error
  const clearInvoicesError = () => {
    if (stepErrors.invoices) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.invoices;
        return newErrors;
      });
    }
  };

  // Clear row errors when a row is updated
  const clearInvoiceRowErrors = (invoiceId, rowIndex) => {
    if (stepErrors.invoiceErrors) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
        if (invoiceIndex !== -1) {
          newErrors.invoiceErrors = newErrors.invoiceErrors.map(error => {
            if (error.invoiceIndex === invoiceIndex && error.rowErrors) {
              error.rowErrors = error.rowErrors.filter(rowError => rowError.rowIndex !== rowIndex);
              if (error.rowErrors.length === 0) {
                delete error.rowErrors;
              }
            }
            return Object.keys(error).length > 2 ? error : null; // Keep only if there are other errors
          }).filter(Boolean);
          
          if (newErrors.invoiceErrors.length === 0) {
            delete newErrors.invoiceErrors;
            delete newErrors.invoiceDetails;
          }
        }
        return newErrors;
      });
    }
  };

  // Get error for specific invoice and field
  const getInvoiceError = (invoiceId, field) => {
    if (stepErrors.invoiceErrors) {
      const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
      const invoiceError = stepErrors.invoiceErrors.find(error => error.invoiceIndex === invoiceIndex);
      return invoiceError ? invoiceError[field] : null;
    }
    return null;
  };

  // Get error for specific row in an invoice
  const getInvoiceRowError = (invoiceId, rowIndex, field) => {
    if (stepErrors.invoiceErrors) {
      const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
      const invoiceError = stepErrors.invoiceErrors.find(error => error.invoiceIndex === invoiceIndex);
      if (invoiceError && invoiceError.rowErrors) {
        const rowError = invoiceError.rowErrors.find(error => error.rowIndex === rowIndex);
        return rowError ? rowError[field] : null;
      }
    }
    return null;
  };

  // Invoice management functions
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

  const addInvoice = () => {
    const newId = invoices.length > 0 ? Math.max(...invoices.map(inv => inv.id)) + 1 : 1;
    setInvoices(prev => [...prev, { id: newId, ...getEmptyInvoice() }]);
    
    // Clear invoices error when adding new invoice
    clearInvoicesError();
  };

  const removeInvoice = (id) => {
    if (invoices.length > 1) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      
      // Clear errors for removed invoice
      if (stepErrors.invoiceErrors) {
        setStepErrors(prev => {
          const newErrors = { ...prev };
          const invoiceIndex = invoices.findIndex(inv => inv.id === id);
          if (invoiceIndex !== -1) {
            newErrors.invoiceErrors = newErrors.invoiceErrors.filter(error => error.invoiceIndex !== invoiceIndex);
            if (newErrors.invoiceErrors.length === 0) {
              delete newErrors.invoiceErrors;
              delete newErrors.invoiceDetails;
            }
          }
          return newErrors;
        });
      }
      
      // Check if we still have invoices after removal
      if (invoices.length - 1 > 0) {
        clearInvoicesError();
      }
    } else {
      // If trying to remove the last invoice, show error
      setStepErrors(prev => ({
        ...prev,
        invoices: 'At least one invoice is required'
      }));
    }
  };

  const updateInvoice = (id, field, value) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { ...invoice, [field]: value } : invoice
    ));
    
    // Clear errors when fields are updated
    if (field === 'invoiceTemplate' && value) {
      clearInvoiceError(id, 'invoiceTemplate');
    }
    if (field === 'teamMember' && value) {
      clearInvoiceError(id, 'teamMember');
    }
  };

  // Handler functions for individual invoices
  const handleInvoiceTemplateChange = (id, selectedOption) => {
    updateInvoice(id, 'invoiceTemplate', selectedOption);
    if (selectedOption) {
      fetchInvoiceTemplateDetails(id, selectedOption.value);
    }
  };

  const handleTeamMemberChange = (id, selectedOption) => {
    updateInvoice(id, 'teamMember', selectedOption);
  };

  const handleIssueChange = (id, value) => {
    updateInvoice(id, 'issueInvoice', value);
  };

  const handleDateChange = (id, date) => {
    updateInvoice(id, 'specificDate', date);
  };

  const handleTimeChange = (id, time) => {
    updateInvoice(id, 'selectedTime', time);
  };

  const handleDescriptionChange = (id, e) => {
    const value = e.target.value;
    updateInvoice(id, 'description', value);
    updateInvoice(id, 'charCount', value.length);
  };

  const handleEditorChange = (id, content) => {
    updateInvoice(id, 'clientNote', content);
  };

  // New handler functions for CreatableSelect
  const handleServiceChange = (id, rowIndex, selectedOption) => {
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === id) {
        const updatedRows = invoice.rows.map((row, index) => 
          index === rowIndex 
            ? { ...row, productorService: selectedOption ? selectedOption.label : "" }
            : row
        );
        
        const summary = calculateSummary(updatedRows, invoice.taxRate);
        
        return {
          ...invoice,
          rows: updatedRows,
          ...summary
        };
      }
      return invoice;
    }));
    
    // Clear errors when service is selected
    if (selectedOption && selectedOption.label) {
      clearInvoiceRowErrors(id, rowIndex);
    }
    
    // Call fetch only if an option is actually selected and has a value
    if (selectedOption && selectedOption.value) {
      fetchservicebyid(id, rowIndex, selectedOption.value);
    }
  };

  const handleServiceInputChange = (id, rowIndex, inputValue, actionMeta) => {
    if (actionMeta.action === "input-change") {
      setInvoices(prev => prev.map(invoice => {
        if (invoice.id === id) {
          const updatedRows = invoice.rows.map((row, index) => 
            index === rowIndex 
              ? { ...row, productorService: inputValue }
              : row
          );
          
          const summary = calculateSummary(updatedRows, invoice.taxRate);
          
          return {
            ...invoice,
            rows: updatedRows,
            ...summary
          };
        }
        return invoice;
      }));
      
      // Clear errors when user types
      if (inputValue.trim() !== '') {
        clearInvoiceRowErrors(id, rowIndex);
      }
    }
  };

  // Fetch service by ID function
  const fetchservicebyid = async (invoiceId, rowIndex, serviceId) => {
    const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate/${serviceId}`;
    
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const service = Array.isArray(result.serviceTemplate)
          ? result.serviceTemplate[0]
          : result.serviceTemplate;
        const rate = service.rate
          ? parseFloat(service.rate.replace("$", ""))
          : 0;
        
        // Create updated row data
        const updatedRowData = {
          productorService: service.serviceName || "",
          description: service.description || "",
          rate: rate.toFixed(2),
          quantity: "1",
          amount: rate.toFixed(2),
          tax: service.tax || false,
          isDiscount: false,
        };

        // Update the invoice with the fetched service data
        setInvoices(prev => prev.map(invoice => {
          if (invoice.id === invoiceId) {
            const updatedRows = invoice.rows.map((row, index) => 
              index === rowIndex 
                ? { ...row, ...updatedRowData }
                : row
            );
            
            const summary = calculateSummary(updatedRows, invoice.taxRate);
            
            return {
              ...invoice,
              rows: updatedRows,
              ...summary
            };
          }
          return invoice;
        }));
        
        // Clear errors after successful fetch
        clearInvoiceRowErrors(invoiceId, rowIndex);
      })
      .catch((error) => console.error(error));
  };

  // Row management for individual invoices
  const addRow = (id, isDiscount = false) => {
    const newRow = getEmptyRow();
    if (isDiscount) {
      newRow.isDiscount = true;
      newRow.productorService = 'Discount';
    }
    
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id 
        ? { ...invoice, rows: [...invoice.rows, newRow] }
        : invoice
    ));
    
    // Clear rows error when adding new row
    clearInvoiceError(id, 'rows');
  };

  const deleteRow = (id, rowIndex) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id 
        ? { 
            ...invoice, 
            rows: invoice.rows.filter((_, index) => index !== rowIndex)
          }
        : invoice
    ));
    
    // Clear errors for deleted row
    clearInvoiceRowErrors(id, rowIndex);
  };

  const handleInputChange = (id, rowIndex, e) => {
    const { name, value, type, checked } = e.target;
    
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === id) {
        const updatedRows = invoice.rows.map((row, index) => 
          index === rowIndex 
            ? { 
                ...row, 
                [name]: type === 'checkbox' ? checked : value,
                // Recalculate amount if rate or quantity changes
                ...((name === 'rate' || name === 'quantity') ? {
                  amount: ((parseFloat(name === 'rate' ? value : row.rate) || 0) * 
                          (parseFloat(name === 'quantity' ? value : row.quantity) || 0)).toFixed(2)
                } : {})
              }
            : row
        );
        
        const summary = calculateSummary(updatedRows, invoice.taxRate);
        
        return {
          ...invoice,
          rows: updatedRows,
          ...summary
        };
      }
      return invoice;
    }));
    
    // Clear errors when user starts typing
    if (name === 'productorService' && value.trim() !== '') {
      clearInvoiceRowErrors(id, rowIndex);
    }
    if ((name === 'rate' || name === 'quantity') && value && parseFloat(value) > 0) {
      clearInvoiceRowErrors(id, rowIndex);
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

  const handleTaxRateChange = (id, value) => {
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === id) {
        const taxRateValue = parseFloat(value) || 0;
        const subtotal = invoice.rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
        const taxableAmount = invoice.rows.reduce((sum, row) => {
          return row.tax ? sum + (parseFloat(row.amount) || 0) : sum;
        }, 0);
        
        const taxTotal = taxableAmount * (taxRateValue / 100);
        const totalAmount = subtotal + taxTotal;
        
        return {
          ...invoice,
          taxRate: value,
          taxTotal: taxTotal.toFixed(2),
          totalAmount: totalAmount.toFixed(2)
        };
      }
      return invoice;
    }));
  };

  const fetchInvoiceTemplateDetails = async (id, templateId) => {
    try {
      const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${templateId}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result) {
        const template = result.invoiceTemplate || result;
        console.log("selected invoice result", template);
        
        setInvoices(prev => prev.map(invoice => 
          invoice.id === id 
            ? {
                ...invoice,
                description: template.description || "",
                clientNote: template.messageForClient || template.clientNote || "",
                rows: template.lineItems?.map(item => ({
                  productorService: item.productorService || "",
                  description: item.description || "",
                  rate: String(item.rate || "0.00"),
                  quantity: String(item.quantity || "1"),
                  amount: String(item.amount || "0.00"),
                  tax: item.tax || false,
                  isDiscount: item.isDiscount || false,
                })) || [getEmptyRow()],
                taxRate: template.summary?.taxRate || "0",
                subtotal: template.summary?.subtotal || "0",
                taxTotal: template.summary?.taxTotal || "0",
                totalAmount: template.summary?.total || "0",
              }
            : invoice
        ));
        
        // Clear errors after successful template fetch
        clearInvoiceError(id, 'invoiceTemplate');
        clearInvoiceError(id, 'rows');
      }
    } catch (error) {
      console.error("Error fetching template details:", error);
    }
  };

  const invoiceOptions = invoiceTemplates.map(template => ({
    value: template._id,
    label: template.templatename,
  }));

  return (
    <div className="mt-4 space-y-4">
      {/* Show validation errors */}
      {(stepErrors.invoices || stepErrors.invoiceDetails) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {stepErrors.invoices && <div>- {stepErrors.invoices}</div>}
          {stepErrors.invoiceDetails && <div>- {stepErrors.invoiceDetails}</div>}
        </div>
      )}

      {/* Show warning if no invoices exist */}
      {invoices.length === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">No Invoices Added</p>
          <p className="text-xs text-amber-700 mt-1">You need to add at least one invoice to proceed. Click the "Add invoice" button below to get started.</p>
        </div>
      )}

      {invoices.map((invoice, invoiceIndex) => (
        <div key={invoice.id} className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {invoices.length > 1 && (
            <button type="button" onClick={() => removeInvoice(invoice.id)} className="absolute top-3 right-3 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <RiCloseLine className="h-5 w-5" />
            </button>
          )}

          <h4 className="text-base font-semibold text-slate-800 mb-4">Invoice #{invoiceIndex + 1}</h4>

          <div className="space-y-4">
            {/* Invoice Template & Team Member */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Invoice Template *</label>
                <Select
                  options={invoiceOptions}
                  value={invoice.invoiceTemplate}
                  onChange={(value) => handleInvoiceTemplateChange(invoice.id, value)}
                  isClearable
                  placeholder="Invoice Template"
                  styles={{
                    control: (provided) => ({ ...provided, borderColor: getInvoiceError(invoice.id, 'invoiceTemplate') ? 'red' : '#e2e8f0', borderRadius: '0.5rem', minHeight: '38px', fontSize: '0.875rem' }),
                    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                />
                {getInvoiceError(invoice.id, 'invoiceTemplate') && <p className="text-xs text-red-500">{getInvoiceError(invoice.id, 'invoiceTemplate')}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Team Member *</label>
                <Select
                  options={teammemberoption}
                  value={invoice.teamMember}
                  onChange={(value) => handleTeamMemberChange(invoice.id, value)}
                  isClearable
                  placeholder="Team Member"
                  styles={{
                    control: (provided) => ({ ...provided, borderColor: getInvoiceError(invoice.id, 'teamMember') ? 'red' : '#e2e8f0', borderRadius: '0.5rem', minHeight: '38px', fontSize: '0.875rem' }),
                    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                />
                {getInvoiceError(invoice.id, 'teamMember') && <p className="text-xs text-red-500">{getInvoiceError(invoice.id, 'teamMember')}</p>}
              </div>
            </div>

            {/* Issue Invoice, Date, Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Issue invoice</label>
                <select value={invoice.issueInvoice || ''} onChange={(e) => handleIssueChange(invoice.id, e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {invoiceissueoptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              {invoice.issueInvoice === "specific date" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Date</label>
                    <input type="date" value={invoice.specificDate ? (typeof invoice.specificDate === 'string' ? invoice.specificDate : invoice.specificDate.format?.('YYYY-MM-DD') || '') : ''} onChange={(e) => handleDateChange(invoice.id, e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Time</label>
                    <select value={invoice.selectedTime || ''} onChange={(e) => handleTimeChange(invoice.id, e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Select Time</option>
                      {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <div className="relative">
                <input type="text" value={invoice.description} onChange={(e) => handleDescriptionChange(invoice.id, e)} placeholder="Description" className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-20 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{invoice.charCount}/{invoice.charLimit}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="mb-2">
                <h5 className="text-sm font-semibold text-slate-800">Line items</h5>
                <p className="text-xs text-slate-500">Client-facing itemized list of products and services</p>
                {getInvoiceError(invoice.id, 'rows') && <p className="text-xs text-red-500 mt-1">{getInvoiceError(invoice.id, 'rows')}</p>}
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
                      {invoice.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50/70">
                          <td className="px-4 py-2 min-w-[200px]">
                            <CreatableSelect
                              placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                              options={serviceoptions}
                              value={row.productorService ? serviceoptions.find((option) => option.label === row.productorService) || { label: row.productorService, value: row.productorService } : null}
                              onChange={(selectedOption) => handleServiceChange(invoice.id, rowIndex, selectedOption)}
                              onInputChange={(inputValue, actionMeta) => handleServiceInputChange(invoice.id, rowIndex, inputValue, actionMeta)}
                              isClearable
                              styles={{
                                control: (provided) => ({ ...provided, minWidth: 180, borderColor: getInvoiceRowError(invoice.id, rowIndex, 'productorService') ? 'red' : '#e2e8f0' }),
                                menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                              }}
                              menuPortalTarget={document.body}
                            />
                            {getInvoiceRowError(invoice.id, rowIndex, 'productorService') && <p className="text-xs text-red-500 mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'productorService')}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(invoice.id, rowIndex, e)} placeholder="Description" className="w-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0" />
                          </td>
                          <td className="px-4 py-2">
                            <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(invoice.id, rowIndex, e)} className={`w-20 rounded border bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${getInvoiceRowError(invoice.id, rowIndex, 'rate') ? 'border-red-400' : 'border-slate-200'}`} />
                            {getInvoiceRowError(invoice.id, rowIndex, 'rate') && <p className="text-xs text-red-500 mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'rate')}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <input type="text" name="quantity" value={row.quantity} onChange={(e) => handleInputChange(invoice.id, rowIndex, e)} className={`w-16 rounded border bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${getInvoiceRowError(invoice.id, rowIndex, 'quantity') ? 'border-red-400' : 'border-slate-200'}`} />
                            {getInvoiceRowError(invoice.id, rowIndex, 'quantity') && <p className="text-xs text-red-500 mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'quantity')}</p>}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-700">${row.amount}</td>
                          <td className="px-4 py-2">
                            <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(invoice.id, rowIndex, e)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                          </td>
                          <td className="px-4 py-2">
                            <button type="button" onClick={() => deleteRow(invoice.id, rowIndex)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500">
                              <RiCloseLine className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Row Buttons */}
              <div className="flex items-center gap-4 mt-2">
                <button type="button" onClick={() => addRow(invoice.id)} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  <AiOutlinePlusCircle className="h-4 w-4" /> Line item
                </button>
                <button type="button" onClick={() => addRow(invoice.id, true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  <CiDiscount1 className="h-4 w-4" /> Discount
                </button>
              </div>

              {/* Summary */}
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
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">${invoice.subtotal}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <input type="text" value={invoice.taxRate} onChange={(e) => handleTaxRateChange(invoice.id, e.target.value)} className="w-16 rounded border border-slate-200 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          <span className="text-sm text-slate-500">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">${invoice.taxTotal}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">${invoice.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Client Note Editor */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Note for Client</label>
              <Editor
                onChange={(content) => handleEditorChange(invoice.id, content)}
                initialContent={invoice.clientNote}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Invoice Button */}
      <div className="flex items-center gap-3 mt-2">
        <button type="button" onClick={addInvoice} className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50">
          Add invoice
        </button>
      </div>

      {/* Invoice Count Display */}
      <p className="text-xs text-slate-400">{invoices.length} invoice(s) added</p>
    </div>
  );
};
export default InvoiceComponent;