// import React,{useState} from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   TextField,
//   InputLabel,
//   InputAdornment,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Checkbox,
//   Button,
//   IconButton,
//   Autocomplete,Alert,FormControl,FormHelperText,AlertTitle,Chip,Menu,MenuItem
// } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { RiCloseLine } from 'react-icons/ri';
// import { AiOutlinePlusCircle } from 'react-icons/ai';
// import { CiDiscount1 } from 'react-icons/ci';
// import CreatableSelect from 'react-select/creatable';
// import Editor from '../components/Editor';
// import { styled } from '@mui/material/styles';
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   color: (theme.vars ?? theme).palette.text.secondary,
//   ...theme.applyStyles('dark', {
//     backgroundColor: '#1A2027',
//   }),
// }));


// const InvoiceComponent = ({ 
//   invoices, 
//   setInvoices, 
//   invoiceTemplates, 
//   teammemberoption, 
//   serviceoptions,
//   formData,
//   updateFormData,
//   stepErrors,
//   setStepErrors,
// }) => {
//   const invoiceissueoptions = ['immediately', 'specific date'];
//   const timeOptions = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
// console.log("invoices",invoices)
// console.log("teammemberoption",teammemberoption)
//   // Validate invoices
//   const validateInvoices = () => {
//     const newErrors = {};
    
//     // Check if at least one invoice exists
//     if (!invoices || invoices.length === 0) {
//       newErrors.invoices = 'At least one invoice is required';
//     } else {
//       // Check each invoice for required fields
//       const invoiceErrors = invoices.map((invoice, index) => {
//         const invoiceError = {};
        
//         if (!invoice.invoiceTemplate) {
//           invoiceError.invoiceTemplate = 'Invoice template is required';
//         }
        
//         if (!invoice.teamMembers || invoice.teamMembers.length === 0) {
//           invoiceError.teamMembers = 'At least one team member is required';
//         }
        
//         // Validate line items
//         if (!invoice.rows || invoice.rows.length === 0) {
//           invoiceError.rows = 'At least one line item is required';
//         } else {
//           const rowErrors = invoice.rows.map((row, rowIndex) => {
//             const rowError = {};
//             if (!row.productorService?.trim()) {
//               rowError.productorService = 'Product/Service name is required';
//             }
//             if (!row.rate || parseFloat(row.rate) <= 0) {
//               rowError.rate = 'Valid rate is required';
//             }
//             if (!row.quantity || parseFloat(row.quantity) <= 0) {
//               rowError.quantity = 'Valid quantity is required';
//             }
//             return Object.keys(rowError).length > 0 ? { rowIndex, ...rowError } : null;
//           }).filter(Boolean);
          
//           if (rowErrors.length > 0) {
//             invoiceError.rowErrors = rowErrors;
//           }
//         }
        
//         return Object.keys(invoiceError).length > 0 ? { invoiceIndex: index, ...invoiceError } : null;
//       }).filter(Boolean);
      
//       if (invoiceErrors.length > 0) {
//         newErrors.invoiceErrors = invoiceErrors;
//         newErrors.invoiceDetails = 'Please fix invoice errors';
//       }
//     }
    
//     setStepErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Clear specific error when field is updated
//   const clearInvoiceError = (invoiceId, field) => {
//     if (stepErrors.invoiceErrors) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
//         if (invoiceIndex !== -1) {
//           newErrors.invoiceErrors = newErrors.invoiceErrors.filter(error => 
//             !(error.invoiceIndex === invoiceIndex && error[field])
//           );
//           if (newErrors.invoiceErrors.length === 0) {
//             delete newErrors.invoiceErrors;
//             delete newErrors.invoiceDetails;
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   // Clear the "at least one invoice required" error
//   const clearInvoicesError = () => {
//     if (stepErrors.invoices) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.invoices;
//         return newErrors;
//       });
//     }
//   };

//   // Clear row errors when a row is updated
//   const clearInvoiceRowErrors = (invoiceId, rowIndex) => {
//     if (stepErrors.invoiceErrors) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
//         if (invoiceIndex !== -1) {
//           newErrors.invoiceErrors = newErrors.invoiceErrors.map(error => {
//             if (error.invoiceIndex === invoiceIndex && error.rowErrors) {
//               error.rowErrors = error.rowErrors.filter(rowError => rowError.rowIndex !== rowIndex);
//               if (error.rowErrors.length === 0) {
//                 delete error.rowErrors;
//               }
//             }
//             return Object.keys(error).length > 2 ? error : null; // Keep only if there are other errors
//           }).filter(Boolean);
          
//           if (newErrors.invoiceErrors.length === 0) {
//             delete newErrors.invoiceErrors;
//             delete newErrors.invoiceDetails;
//           }
//         }
//         return newErrors;
//       });
//     }
//   };

//   // Get error for specific invoice and field
//   const getInvoiceError = (invoiceId, field) => {
//     if (stepErrors.invoiceErrors) {
//       const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
//       const invoiceError = stepErrors.invoiceErrors.find(error => error.invoiceIndex === invoiceIndex);
//       return invoiceError ? invoiceError[field] : null;
//     }
//     return null;
//   };

//   // Get error for specific row in an invoice
//   const getInvoiceRowError = (invoiceId, rowIndex, field) => {
//     if (stepErrors.invoiceErrors) {
//       const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
//       const invoiceError = stepErrors.invoiceErrors.find(error => error.invoiceIndex === invoiceIndex);
//       if (invoiceError && invoiceError.rowErrors) {
//         const rowError = invoiceError.rowErrors.find(error => error.rowIndex === rowIndex);
//         return rowError ? rowError[field] : null;
//       }
//     }
//     return null;
//   };

//   // Invoice management functions
//   function getEmptyInvoice() {
//     return {
//       invoiceTemplate: null,
//       teamMembers: [],
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
    
//     // Clear invoices error when adding new invoice
//     clearInvoicesError();
//   };

//   const removeInvoice = (id) => {
//     if (invoices.length > 1) {
//       setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      
//       // Clear errors for removed invoice
//       if (stepErrors.invoiceErrors) {
//         setStepErrors(prev => {
//           const newErrors = { ...prev };
//           const invoiceIndex = invoices.findIndex(inv => inv.id === id);
//           if (invoiceIndex !== -1) {
//             newErrors.invoiceErrors = newErrors.invoiceErrors.filter(error => error.invoiceIndex !== invoiceIndex);
//             if (newErrors.invoiceErrors.length === 0) {
//               delete newErrors.invoiceErrors;
//               delete newErrors.invoiceDetails;
//             }
//           }
//           return newErrors;
//         });
//       }
      
//       // Check if we still have invoices after removal
//       if (invoices.length - 1 > 0) {
//         clearInvoicesError();
//       }
//     } else {
//       // If trying to remove the last invoice, show error
//       setStepErrors(prev => ({
//         ...prev,
//         invoices: 'At least one invoice is required'
//       }));
//     }
//   };

//   const updateInvoice = (id, field, value) => {
//     setInvoices(prev => prev.map(invoice => 
//       invoice.id === id ? { ...invoice, [field]: value } : invoice
//     ));
    
//     // Clear errors when fields are updated
//     if (field === 'invoiceTemplate' && value) {
//       clearInvoiceError(id, 'invoiceTemplate');
//     }
//     if (field === 'teamMembers' && value && value.length > 0) {
//       clearInvoiceError(id, 'teamMembers');
//     }
//   };

//   // Handler functions for individual invoices
//   const handleInvoiceTemplateChange = (id, selectedOption) => {
//     updateInvoice(id, 'invoiceTemplate', selectedOption);
//     if (selectedOption) {
//       fetchInvoiceTemplateDetails(id, selectedOption.value);
//     }
//   };

//   // Updated team member handler using multi-select Autocomplete
//   // const handleTeamMembersChange = (id, newSelectedUsers) => {
//   //   updateInvoice(id, 'teamMembers', newSelectedUsers);
//   // };
//   const handleTeamMembersChange = (id, newSelectedUsers) => {
//   console.log("🔄 Team Members Change - Invoice ID:", id);
//   console.log("📋 Selected Users:", newSelectedUsers);
//   console.log("📊 Type of newSelectedUsers:", typeof newSelectedUsers);
//   console.log("🔍 Array check:", Array.isArray(newSelectedUsers));
  
//   updateInvoice(id, 'teamMembers', newSelectedUsers);
  
//   // Log the updated state after a brief delay
//   setTimeout(() => {
//     const updatedInvoice = invoices.find(inv => inv.id === id);
//     console.log("💾 Stored team members:", updatedInvoice?.teamMembers);
//   }, 100);
// };

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
    
//     // Clear errors when service is selected
//     if (selectedOption && selectedOption.label) {
//       clearInvoiceRowErrors(id, rowIndex);
//     }
    
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
      
//       // Clear errors when user types
//       if (inputValue.trim() !== '') {
//         clearInvoiceRowErrors(id, rowIndex);
//       }
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
        
//         // Clear errors after successful fetch
//         clearInvoiceRowErrors(invoiceId, rowIndex);
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
    
//     // Clear rows error when adding new row
//     clearInvoiceError(id, 'rows');
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
    
//     // Clear errors for deleted row
//     clearInvoiceRowErrors(id, rowIndex);
//   };
//   const [anchorElNew, setAnchorElNew] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [selectedRowData, setSelectedRowData] = useState(null);
//   const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//   const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
//   const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
//   const handleMenuOpen = (event, index,invoiceId) => {
//     setAnchorElNew(event.currentTarget);
//     setSelectedRow(index);
//      setSelectedInvoiceId(invoiceId);
//   };

//   const handleMenuClose = () => {
//     setAnchorElNew(null);
//     setSelectedRow(null);
//     setSelectedInvoiceId(null);
//   };
//   const handleEditService = (row, index) => {
//     console.log("Row data:", row);

//     setSelectedRowData(row);
//     setSelectedRowIndex(index); // Save the index of the selected row
//     handleMenuClose();
//     setIsEditDrawerOpen(true);
//   };
//   // Add the handleDuplicate function
//   const handleDuplicate = () => {
//     if (selectedInvoiceId !== null && selectedRow !== null) {
//       const invoiceId = selectedInvoiceId;
//       const rowIndex = selectedRow;
      
//       setInvoices(prev => prev.map(invoice => {
//         if (invoice.id === invoiceId) {
//           const rowToDuplicate = invoice.rows[rowIndex];
          
//           // Create a duplicate with "Copy" extension
//           const duplicatedRow = {
//             ...rowToDuplicate,
//             productorService: `${rowToDuplicate.productorService} Copy`,
//             description: rowToDuplicate.description,
//             rate: rowToDuplicate.rate,
//             quantity: rowToDuplicate.quantity,
//             amount: rowToDuplicate.amount,
//             tax: rowToDuplicate.tax,
//             isDiscount: rowToDuplicate.isDiscount,
//           };
          
//           // Insert the duplicated row after the original row
//           const newRows = [...invoice.rows];
//           newRows.splice(rowIndex + 1, 0, duplicatedRow);
          
//           const summary = calculateSummary(newRows, invoice.taxRate);
          
//           return {
//             ...invoice,
//             rows: newRows,
//             ...summary
//           };
//         }
//         return invoice;
//       }));
      
//       handleMenuClose();
//     }
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
    
//     // Clear errors when user starts typing
//     if (name === 'productorService' && value.trim() !== '') {
//       clearInvoiceRowErrors(id, rowIndex);
//     }
//     if ((name === 'rate' || name === 'quantity') && value && parseFloat(value) > 0) {
//       clearInvoiceRowErrors(id, rowIndex);
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
        
//         // Clear errors after successful template fetch
//         clearInvoiceError(id, 'invoiceTemplate');
//         clearInvoiceError(id, 'rows');
//       }
//     } catch (error) {
//       console.error("Error fetching template details:", error);
//     }
//   };

//   const invoiceOptions = invoiceTemplates.map(template => ({
//     value: template._id,
//     label: template.templatename,
//   }));

//   // Team Members Selector Component for each invoice
//   // const TeamMembersSelector = ({ invoice }) => (
//   //   <Box sx={{ mt: 1 }}>
//   //     <InputLabel sx={{ color: "black" }}>Team Members *</InputLabel>
//   //     <FormControl error={!!getInvoiceError(invoice.id, 'teamMembers')} fullWidth>
//   //       <Autocomplete
//   //         multiple
//   //         size='small'
//   //         options={teammemberoption}
//   //         value={invoice.teamMembers || []}
//   //         onChange={(event, newValue) => handleTeamMembersChange(invoice.id, newValue)}
//   //         disableCloseOnSelect
//   //         getOptionLabel={(option) => option.label}
//   //         isOptionEqualToValue={(option, value) => option.value === value.value}
//   //         renderInput={(params) => (
//   //           <TextField
//   //             {...params}
//   //             placeholder="Select team members..."
//   //             variant="outlined"
//   //             error={!!getInvoiceError(invoice.id, 'teamMembers')}
//   //             // sx={{ mt: 1, mb: 1 }}
//   //           />
//   //         )}
//   //         renderTags={(value, getTagProps) =>
//   //           value.map((option, index) => (
//   //             <Chip
//   //               label={option.label}
//   //               {...getTagProps({ index })}
//   //               size="small"
//   //               sx={{
//   //                 fontWeight: 500,
//   //                 borderRadius: "12px",
//   //                 height: "24px",
//   //               }}
//   //             />
//   //           ))
//   //         }
//   //         renderOption={(props, option, { selected }) => (
//   //           <li {...props}>
//   //             <Checkbox
//   //               checked={selected}
//   //               sx={{ mr: 1 }}
//   //             />
//   //             <Typography variant="body2">{option.label}</Typography>
//   //           </li>
//   //         )}
//   //       />
//   //       {getInvoiceError(invoice.id, 'teamMembers') && (
//   //         <FormHelperText error>
//   //           {getInvoiceError(invoice.id, 'teamMembers')}
//   //         </FormHelperText>
//   //       )}
//   //       <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
//   //         Select team members who will be responsible for this invoice
//   //       </Typography>
//   //     </FormControl>
//   //   </Box>
//   // );
   
//   const TeamMembersSelector = ({ invoice }) => {
//   // Safely get the current team members
//  const getSelectedTeamMembers = () => {
//     if (!invoice.teamMembers || invoice.teamMembers.length === 0) {
//       return [];
//     }
    
//     return invoice.teamMembers.map(member => {
//       // If member is already a full object with label, return it
//       if (member && typeof member === 'object' && member.label) {
//         return member;
//       }
      
//       // If member is just an ID (string), find the full object
//       if (typeof member === 'string') {
//         const user = teammemberoption.find(opt => opt.value === member);
//         return user || { value: member, label: `User ${member}` };
//       }
      
//       // If member is an object but missing label, try to find it
//       if (member && member.value) {
//         const user = teammemberoption.find(opt => opt.value === member.value);
//         return user || { value: member.value, label: member.value };
//       }
      
//       return member;
//     }).filter(Boolean);
//   };

//   const selectedTeamMembers = getSelectedTeamMembers();
//   return (
//     <Box sx={{ mt: 1 }}>
//       <InputLabel sx={{ color: "black" }}>Team Members *</InputLabel>
//       <FormControl error={!!getInvoiceError(invoice.id, 'teamMembers')} fullWidth>
//         <Autocomplete
//           multiple
//           size='small'
//           options={teammemberoption}
//           value={selectedTeamMembers}
//           onChange={(event, newValue) => {
//             console.log("🎯 Autocomplete onChange:", newValue);
//             handleTeamMembersChange(invoice.id, newValue);
//           }}
//           disableCloseOnSelect
//           getOptionLabel={(option) => {
//             // Handle both option formats
//             return option.label || option.username || String(option);
//           }}
//           isOptionEqualToValue={(option, value) => {
//             // Compare by value property if available
//             return option.value === value.value;
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Select team members..."
//               variant="outlined"
//               error={!!getInvoiceError(invoice.id, 'teamMembers')}
//             />
//           )}
//           renderTags={(value, getTagProps) =>
//             value.map((option, index) => (
//               <Chip
//                 label={option.label || option.username || String(option)}
//                 {...getTagProps({ index })}
//                 size="small"
//                 sx={{
//                   fontWeight: 500,
//                   borderRadius: "12px",
//                   height: "24px",
//                 }}
//               />
//             ))
//           }
//           renderOption={(props, option, { selected }) => (
//             <li {...props}>
//               <Checkbox
//                 checked={selected}
//                 sx={{ mr: 1 }}
//               />
//               <Typography variant="body2">
//                 {option.label}
//               </Typography>
//             </li>
//           )}
//         />
//         {getInvoiceError(invoice.id, 'teamMembers') && (
//           <FormHelperText error>
//             {getInvoiceError(invoice.id, 'teamMembers')}
//           </FormHelperText>
//         )}
//         <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
//           {selectedTeamMembers.length} team member(s) selected
//         </Typography>
//       </FormControl>
//     </Box>
//   );
// };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box sx={{ mt: 2 }}>
//         {/* Show validation errors */}
//         {(stepErrors.invoices || stepErrors.invoiceDetails) && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {stepErrors.invoices && <Box>- {stepErrors.invoices}</Box>}
//             {stepErrors.invoiceDetails && <Box>- {stepErrors.invoiceDetails}</Box>}
//           </Alert>
//         )}
        
//         {/* Show warning if no invoices exist */}
//         {invoices.length === 0 && (
//           <Alert severity="warning" sx={{ mb: 3 }}>
//             <AlertTitle>No Invoices Added</AlertTitle>
//             You need to add at least one invoice to proceed. Click the "Add invoice" button below to get started.
//           </Alert>
//         )}
        
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
              
//               <Box sx={{ flexGrow: 1 }}>
//       <Grid container spacing={2}>
//         <Grid size={6}>
//           {/* <Item> */}
//             <InputLabel sx={{ color: "black", textAlign: 'left', mb: 1 }}>
//               Invoice Template *
//             </InputLabel>
//             <FormControl 
//               error={!!getInvoiceError(invoice.id, 'invoiceTemplate')} 
//               fullWidth
//             >
//               <Autocomplete 
//                 options={invoiceOptions}
//                 sx={{ backgroundColor: "#fff" }} 
//                 size="small"
//                 value={invoice.invoiceTemplate}
//                 onChange={(event, value) => handleInvoiceTemplateChange(invoice.id, value)}
//                 isOptionEqualToValue={(option, value) => option?.value === value?.value}
//                 getOptionLabel={(option) => option?.label || ""}
//                 renderInput={(params) => (
//                   <TextField 
//                     {...params} 
//                     placeholder="Invoice Template" 
//                     error={!!getInvoiceError(invoice.id, 'invoiceTemplate')}
//                   />
//                 )}
//                 isClearable={true} 
//               />
//               {getInvoiceError(invoice.id, 'invoiceTemplate') && (
//                 <FormHelperText error>
//                   {getInvoiceError(invoice.id, 'invoiceTemplate')}
//                 </FormHelperText>
//               )}
//             </FormControl>
//           {/* </Item> */}
//         </Grid>
        
//         <Grid size={6}>
//           {/* <Item sx={{ textAlign: 'left' }}> */}
//             <TeamMembersSelector invoice={invoice} />
//           {/* </Item> */}
//         </Grid>
//       </Grid>
//     </Box>

//               {/* Rest of the invoice component remains the same */}
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
//                   {getInvoiceError(invoice.id, 'rows') && (
//                     <Typography color="error" variant="body2">
//                       {getInvoiceError(invoice.id, 'rows')}
//                     </Typography>
//                   )}
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
//                         <TableCell></TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {invoice.rows.map((row, rowIndex) => (
//                         <TableRow key={rowIndex}>
//                           <TableCell>
//                             <FormControl error={!!getInvoiceRowError(invoice.id, rowIndex, 'productorService')}>
//                               <CreatableSelect
//                                 placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
//                                 options={serviceoptions}
//                                 value={row.productorService ? serviceoptions.find((option) => option.label === row.productorService) || { label: row.productorService, value: row.productorService } : null}
//                                 onChange={(selectedOption) => handleServiceChange(invoice.id, rowIndex, selectedOption)}
//                                 onInputChange={(inputValue, actionMeta) => handleServiceInputChange(invoice.id, rowIndex, inputValue, actionMeta)}
//                                 isClearable
//                                 styles={{
//                                   container: (provided) => ({ 
//                                     ...provided, 
//                                     width: "180px",
//                                     borderColor: getInvoiceRowError(invoice.id, rowIndex, 'productorService') ? 'red' : 'inherit'
//                                   }),
//                                   control: (provided, state) => ({ 
//                                     ...provided, 
//                                     width: "180px",
//                                     borderColor: getInvoiceRowError(invoice.id, rowIndex, 'productorService') ? 'red' : state.isFocused ? '#2684ff' : '#ccc',
//                                     boxShadow: getInvoiceRowError(invoice.id, rowIndex, 'productorService') ? '0 0 0 1px red' : state.isFocused ? '0 0 0 1px #2684ff' : 'none',
//                                     '&:hover': {
//                                       borderColor: getInvoiceRowError(invoice.id, rowIndex, 'productorService') ? 'red' : '#999'
//                                     }
//                                   }),
//                                   menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
//                                 }}
//                                 menuPortalTarget={document.body}
//                               />
//                               {getInvoiceRowError(invoice.id, rowIndex, 'productorService') && (
//                                 <FormHelperText error sx={{ mt: 0.5 }}>
//                                   {getInvoiceRowError(invoice.id, rowIndex, 'productorService')}
//                                 </FormHelperText>
//                               )}
//                             </FormControl>
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
//                               error={!!getInvoiceRowError(invoice.id, rowIndex, 'rate')}
//                               helperText={getInvoiceRowError(invoice.id, rowIndex, 'rate')}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               size="small"
//                               name="quantity"
//                               value={row.quantity}
//                               onChange={(e) => handleInputChange(invoice.id, rowIndex, e)}
//                               sx={{ width: "60px" }}
//                               error={!!getInvoiceRowError(invoice.id, rowIndex, 'quantity')}
//                               helperText={getInvoiceRowError(invoice.id, rowIndex, 'quantity')}
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
//                            <TableCell>
//                                   <IconButton onClick={(event) => handleMenuOpen(event, rowIndex)}>
//                                     <MoreVertIcon />
//                                   </IconButton>
//                                   <Menu anchorEl={anchorElNew} open={Boolean(anchorElNew) && selectedRow === rowIndex && selectedInvoiceId === invoice.id} onClose={handleMenuClose} anchorOrigin={{ vertical: "top", horizontal: "left" }} transformOrigin={{ vertical: "top", horizontal: "left" }}>
//                                     <MenuItem onClick={() => handleEditService(row, rowIndex)}>Edit</MenuItem>
                                
//                                     <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
//                                   </Menu>
//                                 </TableCell>
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
//             Add invoice
//           </Button>
//         </Box>

//         {/* Invoice Count Display */}
//         <Box sx={{ mt: 1 }}>
//           <Typography variant="body2" color="text.secondary">
//             {invoices.length} invoice(s) added
//           </Typography>
//         </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// };
// export default InvoiceComponent;
import React, { useState,useEffect } from 'react';
import { PlusCircle, Tag, MoreVertical, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { ServiceCombobox } from '../../components/ui/service-combobox';
import Select from 'react-select';
import Editor from '../components/Editor';
import SaveAsServiceDrawer from "./SaveAsServiceDrawer"
import EditServiceDrawer from "./EditServiceDrawer"
const InvoiceComponent = ({ 
  invoices, 
  setInvoices, 
  invoiceTemplates, 
  teammemberoption, 
  serviceoptions,
  formData,
  updateFormData,
  stepErrors,
  setStepErrors,
}) => {
  const invoiceissueoptions = ['immediately', 'specific date'];
  const timeOptions = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
    const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL || 'https://www.snptaxes.com'; 


  // Menu state management
  const [menuAnchor, setMenuAnchor] = useState(null); // { invoiceId: null, rowIndex: null, anchorEl: null }
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
const [isNewServiceDrawerOpen, setIsNewServiceDrawerOpen] = useState(false);
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
// Handle service creation success
const handleServiceCreated = (newService) => {
  console.log('New service created:', newService);
  
};

// Handle category creation success
const handleCategoryCreated = (newCategory) => {
  console.log('New category created:', newCategory);
  fetchData()
  
};

  // Menu handlers
  const handleMenuOpen = (event, rowIndex, invoiceId) => {
    setMenuAnchor({
      invoiceId,
      rowIndex,
      anchorEl: event.currentTarget
    });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Helper to check if menu is open for specific row
  const isMenuOpen = (rowIndex, invoiceId) => {
    return menuAnchor && 
           menuAnchor.invoiceId === invoiceId && 
           menuAnchor.rowIndex === rowIndex;
  };

  const handleEditService = (row, rowIndex, invoiceId) => {
    console.log("Row data:", row);
    setSelectedRowData(row);
    setSelectedRowIndex(rowIndex);
    setSelectedInvoiceId(invoiceId);
    handleMenuClose();
    setIsEditDrawerOpen(true);
  };

 const closeEditDrawer=()=>{
  setSelectedRowData(null);
   setSelectedRowIndex(null);
    setSelectedInvoiceId(null);
    handleMenuClose();
    setIsEditDrawerOpen(false);
 }
//  const handleSaveChanges = () => {
//   if (selectedRowIndex !== null && selectedInvoiceId !== null && selectedRowData) {
//     console.log("🔄 Saving changes for invoice:", selectedInvoiceId, "row:", selectedRowIndex);
//     console.log("📝 Row data to save:", selectedRowData);

//     setInvoices(prev => {
//       const updatedInvoices = prev.map(invoice => {
//         if (invoice.id === selectedInvoiceId) {
//           console.log("📋 Found invoice to update:", invoice.id);
          
//           const updatedRows = invoice.rows.map((row, index) => {
//             if (index === selectedRowIndex) {
//               console.log("🎯 Updating row at index:", index);
              
//               // Calculate amount from rate and quantity
//               const rateValue = parseFloat(selectedRowData.rate.replace(/[^0-9.-]+/g, "")) || 0;
//               const qtyValue = parseInt(selectedRowData.quantity) || 0;
//               const amount = (rateValue * qtyValue).toFixed(2);
              
//               const updatedRow = {
//                 ...selectedRowData,
//                 amount: `${amount}`
//               };
              
//               console.log("🔄 Updated row:", updatedRow);
//               return updatedRow;
//             }
//             return row;
//           });
          
//           // Recalculate summary
//           const summary = calculateSummary(updatedRows, invoice.taxRate);
//           console.log("🧮 New summary:", summary);
          
//           return {
//             ...invoice,
//             rows: updatedRows,
//             ...summary
//           };
//         }
//         return invoice;
//       });
      
//       console.log("✅ Final updated invoices:", updatedInvoices);
//       return updatedInvoices;
//     });
    
//     // Clear errors
//     clearInvoiceRowErrors(selectedInvoiceId, selectedRowIndex);
//   }
  
//   // Close drawer
//   closeEditDrawer();
// };

// Update handleSaveChanges to accept parameter:
const handleSaveChanges = (updatedRowData = null) => {
  const dataToUse = updatedRowData || selectedRowData;
  
  if (selectedRowIndex !== null && selectedInvoiceId !== null && dataToUse) {
    console.log("🔄 Saving changes for invoice:", selectedInvoiceId, "row:", selectedRowIndex);
    console.log("📝 Row data to save:", dataToUse);

    setInvoices(prev => {
      const updatedInvoices = prev.map(invoice => {
        if (invoice.id === selectedInvoiceId) {
          const updatedRows = invoice.rows.map((row, index) => {
            if (index === selectedRowIndex) {
              return { ...dataToUse };
            }
            return row;
          });
          
          const summary = calculateSummary(updatedRows, invoice.taxRate);
          
          return {
            ...invoice,
            rows: updatedRows,
            ...summary
          };
        }
        return invoice;
      });
      
      return updatedInvoices;
    });
    
    clearInvoiceRowErrors(selectedInvoiceId, selectedRowIndex);
  }
  
  closeEditDrawer();
};
  const handleDuplicate = (invoiceId, rowIndex) => {
    if (invoiceId !== null && rowIndex !== null) {
      setInvoices(prev => prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const rowToDuplicate = invoice.rows[rowIndex];
          
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
          const newRows = [...invoice.rows];
          newRows.splice(rowIndex + 1, 0, duplicatedRow);
          
          const summary = calculateSummary(newRows, invoice.taxRate);
          
          return {
            ...invoice,
            rows: newRows,
            ...summary
          };
        }
        return invoice;
      }));
      
      handleMenuClose();
    }
  };

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
      teamMembers: [],
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
    if (field === 'teamMembers' && value && value.length > 0) {
      clearInvoiceError(id, 'teamMembers');
    }
  };

  // Handler functions for individual invoices
  const handleInvoiceTemplateChange = (id, selectedOption) => {
    updateInvoice(id, 'invoiceTemplate', selectedOption);
    if (selectedOption) {
      fetchInvoiceTemplateDetails(id, selectedOption.value);
    }
  };

  const handleTeamMembersChange = (id, newSelectedUsers) => {
    console.log("🔄 Team Members Change - Invoice ID:", id);
    console.log("📋 Selected Users:", newSelectedUsers);
    console.log("📊 Type of newSelectedUsers:", typeof newSelectedUsers);
    console.log("🔍 Array check:", Array.isArray(newSelectedUsers));
    
    updateInvoice(id, 'teamMembers', newSelectedUsers);
    
    // Log the updated state after a brief delay
    setTimeout(() => {
      const updatedInvoice = invoices.find(inv => inv.id === id);
      console.log("💾 Stored team members:", updatedInvoice?.teamMembers);
    }, 100);
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

  // Team Members Selector Component for each invoice
  const TeamMembersSelector = ({ invoice }) => {
    // Safely get the current team members
    const getSelectedTeamMembers = () => {
      if (!invoice.teamMembers || invoice.teamMembers.length === 0) {
        return [];
      }
      
      return invoice.teamMembers.map(member => {
        if (member && typeof member === 'object' && member.label) {
          return member;
        }
        if (typeof member === 'string') {
          const user = teammemberoption.find(opt => opt.value === member);
          return user || { value: member, label: `User ${member}` };
        }
        if (member && member.value) {
          const user = teammemberoption.find(opt => opt.value === member.value);
          return user || { value: member.value, label: member.value };
        }
        return member;
      }).filter(Boolean);
    };

    const selectedTeamMembers = getSelectedTeamMembers();
    
    return (
      <div className="mt-1 space-y-1.5">
        <label className="text-sm font-medium text-foreground">Team Members *</label>
        <Select
          isMulti
          options={teammemberoption}
          value={selectedTeamMembers}
          onChange={(newValue) => {
            console.log("🎯 Select onChange:", newValue);
            handleTeamMembersChange(invoice.id, newValue || []);
          }}
          placeholder="Select team members..."
          styles={{
            control: (provided) => ({ ...provided, borderColor: getInvoiceError(invoice.id, 'teamMembers') ? 'red' : '#e2e8f0', borderRadius: '0.5rem', minHeight: '38px', fontSize: '0.875rem' }),
            menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          menuPortalTarget={document.body}
        />
        {getInvoiceError(invoice.id, 'teamMembers') && (
          <p className="text-xs text-destructive">{getInvoiceError(invoice.id, 'teamMembers')}</p>
        )}
        <p className="text-xs text-muted-foreground">{selectedTeamMembers.length} team member(s) selected</p>
      </div>
    );
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Show validation errors */}
      {(stepErrors.invoices || stepErrors.invoiceDetails) && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
        <div key={invoice.id} className="relative rounded-xl border border-border bg-card p-5 shadow-sm">
          {invoices.length > 1 && (
            <button type="button" onClick={() => removeInvoice(invoice.id)} className="absolute top-3 right-3 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}

          <h4 className="text-base font-semibold text-foreground mb-4">Invoice #{invoiceIndex + 1}</h4>

          <div className="space-y-4">
            {/* Invoice Template & Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Invoice Template *</label>
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
                {getInvoiceError(invoice.id, 'invoiceTemplate') && <p className="text-xs text-destructive">{getInvoiceError(invoice.id, 'invoiceTemplate')}</p>}
              </div>
              <TeamMembersSelector invoice={invoice} />
            </div>

            {/* Issue Invoice, Date, Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Issue invoice</label>
                <select value={invoice.issueInvoice || ''} onChange={(e) => handleIssueChange(invoice.id, e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {invoiceissueoptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              {invoice.issueInvoice === "specific date" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Date</label>
                    <input type="date" value={invoice.specificDate ? (typeof invoice.specificDate === 'string' ? invoice.specificDate : invoice.specificDate.format?.('YYYY-MM-DD') || '') : ''} onChange={(e) => handleDateChange(invoice.id, e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Time</label>
                    <select value={invoice.selectedTime || ''} onChange={(e) => handleTimeChange(invoice.id, e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select Time</option>
                      {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <div className="relative">
                <input type="text" value={invoice.description} onChange={(e) => handleDescriptionChange(invoice.id, e)} placeholder="Description" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 pr-20 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{invoice.charCount}/{invoice.charLimit}</span>
              </div>
            </div>

            {/* Line Items Table */}
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
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {invoice.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-muted/20">
                          <td className="px-4 py-2 min-w-[220px]">
                            <ServiceCombobox
                              options={serviceoptions}
                              value={row.productorService}
                              placeholder={row.isDiscount ? 'Reason for discount' : 'Product or Service'}
                              hasError={!!getInvoiceRowError(invoice.id, rowIndex, 'productorService')}
                              onChange={label => handleServiceChange(invoice.id, rowIndex, { label, value: label })}
                              onInputChange={text => handleServiceInputChange(invoice.id, rowIndex, text, { action: 'input-change' })}
                            />
                            {getInvoiceRowError(invoice.id, rowIndex, 'productorService') && <p className="text-xs text-destructive mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'productorService')}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <Input name="description" value={row.description} onChange={(e) => handleInputChange(invoice.id, rowIndex, e)} placeholder="Description" className="border-0 bg-transparent shadow-none focus-visible:ring-0" />
                          </td>
                          <td className="px-4 py-2">
                            <Input name="rate" value={row.rate} onChange={(e) => handleInputChange(invoice.id, rowIndex, e)} className={`w-20 ${getInvoiceRowError(invoice.id, rowIndex, 'rate') ? 'border-destructive' : ''}`} />
                            {getInvoiceRowError(invoice.id, rowIndex, 'rate') && <p className="text-xs text-destructive mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'rate')}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <Input name="quantity" value={row.quantity} onChange={(e) => handleInputChange(invoice.id, rowIndex, e)} className={`w-16 ${getInvoiceRowError(invoice.id, rowIndex, 'quantity') ? 'border-destructive' : ''}`} />
                            {getInvoiceRowError(invoice.id, rowIndex, 'quantity') && <p className="text-xs text-destructive mt-0.5">{getInvoiceRowError(invoice.id, rowIndex, 'quantity')}</p>}
                          </td>
                          <td className="px-4 py-2 text-sm text-foreground">${row.amount}</td>
                          <td className="px-4 py-2">
                            <Checkbox
                              checked={row.tax}
                              onCheckedChange={checked => handleInputChange(invoice.id, rowIndex, { target: { name: 'tax', type: 'checkbox', checked } })}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <div className="relative">
                              <button type="button" onClick={(event) => handleMenuOpen(event, rowIndex, invoice.id)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {isMenuOpen(rowIndex, invoice.id) && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-background py-1 shadow-lg">
                                  <button type="button" onClick={() => { handleEditService(row, rowIndex, invoice.id); handleMenuClose(); }} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/60">Edit</button>
                                  <button type="button" onClick={() => { handleDuplicate(invoice.id, rowIndex); handleMenuClose(); }} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/60">Duplicate</button>
                                  <button type="button" onClick={() => { deleteRow(invoice.id, rowIndex); handleMenuClose(); }} className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10">Delete</button>
                                  <button type="button" onClick={() => { setSelectedRowData(row); setIsNewServiceDrawerOpen(true); handleMenuClose(); }} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/60">Save as new service</button>
                                </div>
                              )}
                            </div>
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

              {/* Add Row Buttons */}
              <div className="flex items-center gap-4 mt-2">
                <button type="button" onClick={() => addRow(invoice.id)} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
                  <PlusCircle className="h-4 w-4" /> Line item
                </button>
                <button type="button" onClick={() => addRow(invoice.id, true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
                  <Tag className="h-4 w-4" /> Discount
                </button>
              </div>

              {/* Summary */}
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
                          <Input type="text" value={invoice.taxRate} onChange={(e) => handleTaxRateChange(invoice.id, e.target.value)} className="w-16" />
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

            {/* Client Note Editor */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Note for Client</label>
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
        <button type="button" onClick={addInvoice} className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/10">
          Add invoice
        </button>
      </div>

      {/* Invoice Count Display */}
      <p className="text-xs text-muted-foreground">{invoices.length} invoice(s) added</p>

      <SaveAsServiceDrawer
        open={isNewServiceDrawerOpen}
        onClose={() => setIsNewServiceDrawerOpen(false)}
        selectedRowData={selectedRowData}
        categoryOptions={categoryoptions}
        onServiceCreated={handleServiceCreated}
        onCategoryCreated={handleCategoryCreated}
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

export default InvoiceComponent;