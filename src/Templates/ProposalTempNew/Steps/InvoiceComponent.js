import React, { useState } from 'react';
import { X, PlusCircle, Tag } from 'lucide-react';
import Editor from '../components/Editor';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';


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
  const [serviceSearch, setServiceSearch] = useState({});

  const clearInvoiceError = (invoiceId, field) => {
    if (stepErrors?.invoiceErrors) {
      setStepErrors(prev => {
        const e = { ...prev };
        const idx = invoices.findIndex(inv => inv.id === invoiceId);
        if (idx !== -1) {
          e.invoiceErrors = e.invoiceErrors.filter(err => !(err.invoiceIndex === idx && err[field]));
          if (e.invoiceErrors.length === 0) { delete e.invoiceErrors; delete e.invoiceDetails; }
        }
        return e;
      });
    }
  };

  const clearInvoicesError = () => {
    if (stepErrors?.invoices) setStepErrors(prev => { const e = { ...prev }; delete e.invoices; return e; });
  };

  const clearInvoiceRowErrors = (invoiceId, rowIndex) => {
    if (stepErrors?.invoiceErrors) {
      setStepErrors(prev => {
        const e = { ...prev };
        const idx = invoices.findIndex(inv => inv.id === invoiceId);
        if (idx !== -1) {
          e.invoiceErrors = e.invoiceErrors.map(err => {
            if (err.invoiceIndex === idx && err.rowErrors) {
              err.rowErrors = err.rowErrors.filter(re => re.rowIndex !== rowIndex);
              if (!err.rowErrors.length) delete err.rowErrors;
            }
            return Object.keys(err).length > 2 ? err : null;
          }).filter(Boolean);
          if (!e.invoiceErrors.length) { delete e.invoiceErrors; delete e.invoiceDetails; }
        }
        return e;
      });
    }
  };

  const getInvoiceError = (invoiceId, field) => {
    const idx = invoices.findIndex(inv => inv.id === invoiceId);
    const err = stepErrors?.invoiceErrors?.find(e => e.invoiceIndex === idx);
    return err ? err[field] : null;
  };

  const getInvoiceRowError = (invoiceId, rowIndex, field) => {
    const idx = invoices.findIndex(inv => inv.id === invoiceId);
    const err = stepErrors?.invoiceErrors?.find(e => e.invoiceIndex === idx);
    const rowErr = err?.rowErrors?.find(e => e.rowIndex === rowIndex);
    return rowErr ? rowErr[field] : null;
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
    clearInvoicesError();
  };

  const removeInvoice = (id) => {
    if (invoices.length > 1) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      if (invoices.length - 1 > 0) clearInvoicesError();
    } else {
      setStepErrors(prev => ({ ...prev, invoices: 'At least one invoice is required' }));
    }
  };

  const updateInvoice = (id, field, value) => {
    setInvoices(prev => prev.map(invoice => invoice.id === id ? { ...invoice, [field]: value } : invoice));
    if ((field === 'invoiceTemplate' || field === 'teamMember') && value) clearInvoiceError(id, field);
  };

  // Handler functions for individual invoices
  const handleInvoiceTemplateChange = (id, value) => {
    updateInvoice(id, 'invoiceTemplate', value);
    if (value) fetchInvoiceTemplateDetails(id, value);
  };

  const handleDescriptionChange = (id, e) => {
    const value = e.target.value;
    updateInvoice(id, 'description', value);
    updateInvoice(id, 'charCount', value.length);
  };

  const handleEditorChange = (id, content) => updateInvoice(id, 'clientNote', content);

  const handleServiceSelect = (invoiceId, rowIndex, option) => {
    updateInvoiceRow(invoiceId, rowIndex, 'productorService', option.label);
    setServiceSearch(prev => ({ ...prev, [`${invoiceId}-${rowIndex}`]: option.label }));
    if (option.value) fetchservicebyid(invoiceId, rowIndex, option.value);
    clearInvoiceRowErrors(invoiceId, rowIndex);
  };

  const updateInvoiceRow = (id, rowIndex, name, value) => {
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id !== id) return invoice;
      const updatedRows = invoice.rows.map((row, i) =>
        i === rowIndex ? { ...row, [name]: value } : row
      );
      const recalc = recalculateRowAmounts(updatedRows);
      return { ...invoice, rows: recalc, ...calculateSummary(recalc, invoice.taxRate) };
    }));
  };

  const fetchservicebyid = async (invoiceId, rowIndex, serviceId) => {
    try {
      const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
      const res = await fetch(`${SERVICE_API}/workflow/services/servicetemplate/${serviceId}`);
      const result = await res.json();
      const service = Array.isArray(result.serviceTemplate) ? result.serviceTemplate[0] : result.serviceTemplate;
      const rate = service.rate ? parseFloat(service.rate.replace('$', '')) : 0;
      const rowData = { productorService: service.serviceName || '', description: service.description || '', rate: rate.toFixed(2), quantity: '1', amount: rate.toFixed(2), tax: service.tax || false, isDiscount: false };
      setInvoices(prev => prev.map(invoice => {
        if (invoice.id !== invoiceId) return invoice;
        const rows = invoice.rows.map((row, i) => i === rowIndex ? { ...row, ...rowData } : row);
        const recalc = recalculateRowAmounts(rows);
        return { ...invoice, rows: recalc, ...calculateSummary(recalc, invoice.taxRate) };
      }));
      clearInvoiceRowErrors(invoiceId, rowIndex);
    } catch (err) { console.error(err); }
  };

  const addRow = (id, isDiscount = false) => {
    const newRow = getEmptyRow();
    if (isDiscount) { newRow.isDiscount = true; newRow.productorService = 'Discount'; }
    setInvoices(prev => prev.map(invoice => invoice.id === id ? { ...invoice, rows: [...invoice.rows, newRow] } : invoice));
    clearInvoiceError(id, 'rows');
  };

  const deleteRow = (id, rowIndex) => {
    setInvoices(prev => prev.map(invoice => invoice.id === id ? { ...invoice, rows: invoice.rows.filter((_, i) => i !== rowIndex) } : invoice));
    clearInvoiceRowErrors(id, rowIndex);
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

  const handleTaxRateChange = (id, value) => {
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id !== id) return invoice;
      return { ...invoice, taxRate: value, ...calculateSummary(invoice.rows, value) };
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

  const invoiceOptions = invoiceTemplates.map(t => ({ value: t._id, label: t.templatename }));

  return (
    <div className="mt-4 space-y-4">
      {(stepErrors?.invoices || stepErrors?.invoiceDetails) && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {stepErrors.invoices && <div>- {stepErrors.invoices}</div>}
          {stepErrors.invoiceDetails && <div>- {stepErrors.invoiceDetails}</div>}
        </div>
      )}

      {invoices.length === 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">No Invoices Added</p>
          <p className="text-xs text-amber-700 mt-1">Add at least one invoice to proceed.</p>
        </div>
      )}

      {invoices.map((invoice, invoiceIndex) => (
        <div key={invoice.id} className="relative rounded-xl border border-border bg-background p-5 shadow-sm">
          {invoices.length > 1 && (
            <button type="button" onClick={() => removeInvoice(invoice.id)} className="absolute top-3 right-3 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}

          <h4 className="text-base font-semibold text-foreground mb-4">Invoice #{invoiceIndex + 1}</h4>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Invoice Template *</label>
                <ShadSelect
                  value={invoice.invoiceTemplate || ''}
                  onValueChange={(val) => handleInvoiceTemplateChange(invoice.id, val)}
                >
                  <SelectTrigger className={getInvoiceError(invoice.id, 'invoiceTemplate') ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Invoice Template" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </ShadSelect>
                {getInvoiceError(invoice.id, 'invoiceTemplate') && <p className="text-xs text-destructive">{getInvoiceError(invoice.id, 'invoiceTemplate')}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Team Member *</label>
                <ShadSelect
                  value={invoice.teamMember || ''}
                  onValueChange={(val) => updateInvoice(invoice.id, 'teamMember', val)}
                >
                  <SelectTrigger className={getInvoiceError(invoice.id, 'teamMember') ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Team Member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teammemberoption.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </ShadSelect>
                {getInvoiceError(invoice.id, 'teamMember') && <p className="text-xs text-destructive">{getInvoiceError(invoice.id, 'teamMember')}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Issue invoice</label>
                <ShadSelect value={invoice.issueInvoice || 'immediately'} onValueChange={(val) => updateInvoice(invoice.id, 'issueInvoice', val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {invoiceissueoptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </ShadSelect>
              </div>
              {invoice.issueInvoice === 'specific date' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Date</label>
                    <Input type="date" value={invoice.specificDate || ''} onChange={(e) => updateInvoice(invoice.id, 'specificDate', e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Time</label>
                    <ShadSelect value={invoice.selectedTime || ''} onValueChange={(val) => updateInvoice(invoice.id, 'selectedTime', val)}>
                      <SelectTrigger><SelectValue placeholder="Select Time" /></SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </ShadSelect>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <div className="relative">
                <Input value={invoice.description} onChange={(e) => handleDescriptionChange(invoice.id, e)} placeholder="Description" className="pr-20" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{invoice.charCount}/{invoice.charLimit}</span>
              </div>
            </div>

            <div>
              <div className="mb-2">
                <h5 className="text-sm font-semibold text-foreground">Line items</h5>
                <p className="text-xs text-muted-foreground">Client-facing itemized list of products and services</p>
                {getInvoiceError(invoice.id, 'rows') && <p className="text-xs text-destructive mt-1">{getInvoiceError(invoice.id, 'rows')}</p>}
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
                      {invoice.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-muted/20">
                          <td className="px-4 py-2 min-w-[200px]">
                            <div className="relative">
                              <Input
                                value={serviceSearch[`${invoice.id}-${rowIndex}`] ?? row.productorService}
                                placeholder={row.isDiscount ? 'Reason for discount' : 'Product or Service'}
                                className={`h-8 text-sm ${getInvoiceRowError(invoice.id, rowIndex, 'productorService') ? 'border-destructive' : ''}`}
                                onChange={e => {
                                  setServiceSearch(prev => ({ ...prev, [`${invoice.id}-${rowIndex}`]: e.target.value }));
                                  updateInvoiceRow(invoice.id, rowIndex, 'productorService', e.target.value);
                                }}
                              />
                              {(serviceSearch[`${invoice.id}-${rowIndex}`] || '').length > 0 &&
                                serviceoptions.filter(o => o.label.toLowerCase().includes((serviceSearch[`${invoice.id}-${rowIndex}`] || '').toLowerCase())).length > 0 && (
                                  <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg max-h-40 overflow-y-auto">
                                    {serviceoptions.filter(o => o.label.toLowerCase().includes((serviceSearch[`${invoice.id}-${rowIndex}`] || '').toLowerCase())).map(o => (
                                      <button key={o.value} type="button" onMouseDown={() => handleServiceSelect(invoice.id, rowIndex, o)} className="block w-full px-3 py-1.5 text-left text-sm hover:bg-muted">{o.label}</button>
                                    ))}
                                  </div>
                              )}
                            </div>
                            {getInvoiceRowError(invoice.id, rowIndex, 'productorService') && <p className="text-xs text-destructive mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'productorService')}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <Input value={row.description} placeholder="Description" className="h-8 border-0 bg-transparent text-sm" onChange={e => updateInvoiceRow(invoice.id, rowIndex, 'description', e.target.value)} />
                          </td>
                          <td className="px-4 py-2">
                            <Input value={row.rate} className={`h-8 w-20 text-sm ${getInvoiceRowError(invoice.id, rowIndex, 'rate') ? 'border-destructive' : ''}`} onChange={e => updateInvoiceRow(invoice.id, rowIndex, 'rate', e.target.value)} />
                            {getInvoiceRowError(invoice.id, rowIndex, 'rate') && <p className="text-xs text-destructive mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'rate')}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <Input value={row.quantity} className={`h-8 w-16 text-sm ${getInvoiceRowError(invoice.id, rowIndex, 'quantity') ? 'border-destructive' : ''}`} onChange={e => updateInvoiceRow(invoice.id, rowIndex, 'quantity', e.target.value)} />
                            {getInvoiceRowError(invoice.id, rowIndex, 'quantity') && <p className="text-xs text-destructive mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'quantity')}</p>}
                          </td>
                          <td className="px-4 py-2 text-sm text-foreground">${row.amount}</td>
                          <td className="px-4 py-2">
                            <Checkbox checked={row.tax} onCheckedChange={val => updateInvoiceRow(invoice.id, rowIndex, 'tax', val)} />
                          </td>
                          <td className="px-4 py-2">
                            <button type="button" onClick={() => deleteRow(invoice.id, rowIndex)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-destructive">
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button type="button" onClick={() => addRow(invoice.id)} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
                  <PlusCircle className="h-4 w-4" /> Line item
                </button>
                <button type="button" onClick={() => addRow(invoice.id, true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
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
                      <td className="px-4 py-3 text-sm font-medium text-foreground">${invoice.subtotal}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Input value={invoice.taxRate} className="h-8 w-16 text-sm" onChange={e => handleTaxRateChange(invoice.id, e.target.value)} />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">${invoice.taxTotal}</td>
                      <td className="px-4 py-3 text-sm font-bold text-foreground">${invoice.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Note for Client</label>
              <Editor onChange={(content) => handleEditorChange(invoice.id, content)} initialContent={invoice.clientNote} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-2">
        <button type="button" onClick={addInvoice} className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/5">
          Add invoice
        </button>
      </div>

      <p className="text-xs text-muted-foreground">{invoices.length} invoice(s) added</p>
    </div>
  );
};
export default InvoiceComponent;