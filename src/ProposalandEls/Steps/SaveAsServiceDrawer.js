

// import React, { useState, useEffect } from 'react';
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   InputLabel,
//   FormControlLabel,
//   Switch,
//   Autocomplete,
//   Button,
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';
// import { RxCross2 } from 'react-icons/rx';
// import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
// import Divider from '@mui/material/Divider';
// import { toast } from 'react-toastify';

// const SaveAsServiceDrawer = ({
//   open,
//   onClose,
//   selectedRowData,
//   categoryOptions ,
//   onServiceCreated, // Callback when service is successfully created
//   onCategoryCreated, // Callback when category is successfully created
// }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   // API endpoints
//   const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
//   const CATEGORY_API = process.env.REACT_APP_CATEGORY_API || 'https://www.snptaxes.com';

//   // Local state for form data
//   const [formData, setFormData] = useState({
//     serviceName: '',
//     description: '',
//     rate: '',
//     rateType: null,
//     tax: false,
//     category: null,
//   });

//   // State for category creation
//   const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCategoryLoading, setIsCategoryLoading] = useState(false);
 
//   // Rate type options
//   const rateTypeOptions = [
//      { label: "Item", value: "item" },
//     { label: "Hour", value: "hour" },
//   ];

//   // Initialize form data when selectedRowData changes or drawer opens
//   useEffect(() => {
//     if (selectedRowData && open) {
//       setFormData({
//         serviceName: selectedRowData.productorService || '',
//         description: selectedRowData.description || '',
//         rate: selectedRowData.rate || '',
//         rateType: rateTypeOptions.find(opt => opt.value === 'fixed') || rateTypeOptions[0],
//         tax: selectedRowData.tax || false,
//         category: null,
//       });
//     }
//   }, [selectedRowData, open]);

//   // Handle form field changes
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Handle rate type change
//   const handleRateTypeChange = (event, newValue) => {
//     handleInputChange('rateType', newValue);
//   };

//   // Handle category change
//   const handleCategoryChange = (event, newValue) => {
//     handleInputChange('category', newValue);
//   };

//   // Handle tax switch change
//   const handleTaxChange = (event) => {
//     handleInputChange('tax', event.target.checked);
//   };

//   // Category form handlers
//   const handleCategoryFormOpen = () => {
//     setIsCategoryFormOpen(true);
//   };

//   const handleCategoryFormClose = () => {
//     setIsCategoryFormOpen(false);
//     setNewCategoryName('');
//   };

//   // Create Service Template API function
//   const createServiceTemplate = async (serviceData) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       serviceName: serviceData.serviceName,
//       description: serviceData.description,
//       rate: serviceData.rate,
//       ratetype: serviceData.rateType?.value,
//       tax: serviceData.tax,
//       category: serviceData.category ? serviceData.category.value : null,
//       active: "true",
//     });

//     console.log("Creating service template:", raw);

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     try {
//       const url = `${SERVICE_API}/workflow/services/servicetemplate`;
//       const response = await fetch(url, requestOptions);
//       const result = await response.json();
      
//       console.log("Service creation result:", result);

//       if (result && result.message === "ServiceTemplate created successfully") {
//         toast.success("Service Template created successfully");
        
//         // Call the callback if provided
//         if (onServiceCreated) {
//           onServiceCreated(result.serviceTemplate || serviceData);
//         }
        
//         return { success: true, data: result };
//       } else {
//         throw new Error(result.message || "Failed to create Service Template");
//       }
//     } catch (error) {
//       console.error("Error creating service template:", error);
//       throw error;
//     }
//   };

//   // Create Category API function
//   const createCategory = async (categoryName) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       categoryName: categoryName,
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     try {
//       const url = `${CATEGORY_API}/workflow/category/newcategory`;
//       const response = await fetch(url, requestOptions);
//       const result = await response.json();
      
//       console.log("Category creation result:", result);

//       if (result && result.message === "Category created successfully") {
//         toast.success("Category created successfully");
        
//         // Call the callback if provided
//         if (onCategoryCreated) {
//           onCategoryCreated(result.category || { categoryName });
//         }
        
//         return { success: true, data: result };
//       } else {
//         throw new Error(result.message || "Failed to create Category");
//       }
//     } catch (error) {
//       console.error("Error creating category:", error);
//       throw error;
//     }
//   };

//   // Handle create category
//   const handleCreateCategory = async () => {
//     if (!newCategoryName.trim()) {
//       toast.error('Category name is required');
//       return;
//     }

//     setIsCategoryLoading(true);
//     try {
//       await createCategory(newCategoryName.trim());
//       handleCategoryFormClose();
//     } catch (error) {
//       toast.error(error.message || 'Failed to create category');
//     } finally {
//       setIsCategoryLoading(false);
//     }
//   };

//   // Handle save service
//   const handleSaveService = async () => {
//     if (!formData.serviceName.trim()) {
//       toast.error('Service name is required');
//       return;
//     }

//     if (!formData.rate || parseFloat(formData.rate) <= 0) {
//       toast.error('Valid rate is required');
//       return;
//     }

//     if (!formData.rateType) {
//       toast.error('Rate type is required');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const serviceData = {
//         serviceName: formData.serviceName.trim(),
//         description: formData.description.trim(),
//         rate: formData.rate,
//         rateType: formData.rateType,
//         tax: formData.tax,
//         category: formData.category,
//       };

//       await createServiceTemplate(serviceData);
      
//       // Reset form and close drawer
//       setFormData({
//         serviceName: '',
//         description: '',
//         rate: '',
//         rateType: null,
//         tax: false,
//         category: null,
//       });
//       onClose();
//     } catch (error) {
//       toast.error(error.message || 'Failed to create service');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle drawer close
//   const handleDrawerClose = () => {
//     setFormData({
//       serviceName: '',
//       description: '',
//       rate: '',
//       rateType: null,
//       tax: false,
//       category: null,
//     });
//     onClose();
//   };

//   return (
//     <>
//       {/* Main Service Drawer */}
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={handleDrawerClose}
//         PaperProps={{
//           sx: {
//             borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//             width: isSmallScreen ? "100%" : "650px",
//             zIndex: 1000,
//           },
//         }}
//       >
//         <Box role="presentation" sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}>
//           <Box>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid grey" }}>
//               <Typography variant="h6">Create Service</Typography>
//               <RxCross2 onClick={handleDrawerClose} style={{ cursor: "pointer" }} />
//             </Box>
//           </Box>
          
//           <form style={{ margin: "15px" }}>
//             <Box>
//               <Box>
//                 <InputLabel sx={{ color: "black" }}>Service Name *</InputLabel>
//                 <TextField
//                   fullWidth
//                   name="serviceName"
//                   placeholder="Service Name"
//                   size="small"
//                   margin="normal"
//                   value={formData.serviceName}
//                   onChange={(e) => handleInputChange('serviceName', e.target.value)}
//                   required
//                   disabled={isLoading}
//                 />
//               </Box>
              
//               <Box sx={{ mt: 1 }}>
//                 <InputLabel sx={{ color: "black" }}>Description</InputLabel>
//                 <TextField
//                   fullWidth
//                   name="description"
//                   placeholder="Description"
//                   size="small"
//                   margin="normal"
//                   value={formData.description}
//                   onChange={(e) => handleInputChange('description', e.target.value)}
//                   multiline
//                   rows={3}
//                   disabled={isLoading}
//                 />
//               </Box>

//               <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
//                 <Box width="50%">
//                   <InputLabel sx={{ color: "black" }}>Rate *</InputLabel>
//                   <TextField
//                     fullWidth
//                     name="rate"
//                     placeholder="0.00"
//                     size="small"
//                     sx={{ mt: 1 }}
//                     value={formData.rate}
//                     onChange={(e) => handleInputChange('rate', e.target.value)}
//                     type="number"
//                     inputProps={{ step: "0.01", min: "0" }}
//                     required
//                     disabled={isLoading}
//                   />
//                 </Box>

//                 <Box width="50%">
//                   <InputLabel sx={{ color: "black" }}>Rate Type *</InputLabel>
//                   <Autocomplete
//                     size="small"
//                     fullWidth
//                     sx={{ mt: 1 }}
//                     options={rateTypeOptions}
//                     getOptionLabel={(option) => option?.label || ""}
//                     value={formData.rateType}
//                     onChange={handleRateTypeChange}
//                     renderInput={(params) => (
//                       <TextField 
//                         {...params} 
//                         variant="outlined" 
//                         placeholder="Select Rate Type" 
//                         required
//                       />
//                     )}
//                     isOptionEqualToValue={(option, value) => option.value === value.value}
//                     renderOption={(props, option) => (
//                       <Box component="li" {...props}>
//                         <Typography>{option.label}</Typography>
//                       </Box>
//                     )}
//                     disabled={isLoading}
//                   />
//                 </Box>
//               </Box>

//               <Box mt={2}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={formData.tax}
//                       onChange={handleTaxChange}
//                       color="primary"
//                       disabled={isLoading}
//                     />
//                   }
//                   label="Taxable"
//                 />
//               </Box>

//               <Box mt={3}>
//                 <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                   Category
//                 </Typography>
                
//                 <InputLabel sx={{ color: "black", mt: 1 }}>Category Name</InputLabel>
//                 <Autocomplete
//                   size="small"
//                   fullWidth
//                   sx={{ mt: 1 }}
//                   options={categoryOptions}
//                   getOptionLabel={(option) => option.label}
//                   value={formData.category}
//                   onChange={handleCategoryChange}
//                   renderInput={(params) => (
//                     <TextField {...params} placeholder="Category Name" variant="outlined" />
//                   )}
//                   isOptionEqualToValue={(option, value) => option.value === value.value}
//                   disabled={isLoading}
//                 />
                
//                 <Button 
//                   variant="contained" 
//                   color="primary" 
//                   onClick={handleCategoryFormOpen}
                 
//                   disabled={isLoading}
//                   sx={{mt:2}}
//                 >
//                   Create category
//                 </Button>
//               </Box>

//               <Box sx={{ pt: 5, display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
//                 <Button 
//                   variant="contained" 
//                   color="primary" 
//                   onClick={handleSaveService}
//                   disabled={isLoading}
                  
//                 >
//                   {isLoading ? 'Saving...' : 'Save'}
//                 </Button>
//                 <Button 
//                   variant="outlined" 
//                   onClick={handleDrawerClose}
//                   disabled={isLoading}
                  
//                 >
//                   Cancel
//                 </Button>
//               </Box>
//             </Box>
//           </form>
//         </Box>
//       </Drawer>

//       {/* Category Creation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isCategoryFormOpen}
//         onClose={handleCategoryFormClose}
//         PaperProps={{
//           sx: {
//             borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//             width: isSmallScreen ? "100%" : "650px",
//             maxWidth: "100%",
//           },
//         }}
//       >
//         <Box>
//           <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px" }}>
//             <ArrowBackRoundedIcon 
//               onClick={handleCategoryFormClose} 
//               style={{ cursor: "pointer" }} 
//               disabled={isCategoryLoading}
//             />
//             <Typography variant="h6">Create Category</Typography>
//             <Box width={24} /> {/* Spacer for alignment */}
//           </Box>
//           <Divider />
//         </Box>
        
//         <Box p={3}>
//           <InputLabel sx={{ color: "black" }}>Category Name *</InputLabel>
//           <TextField 
//             fullWidth 
//             name="categoryName" 
//             placeholder="Category Name" 
//             size="small" 
//             margin="normal" 
//             value={newCategoryName}
//             onChange={(e) => setNewCategoryName(e.target.value)}
//             required
//             disabled={isCategoryLoading}
//           />
//         </Box>
        
//         <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 2, margin: "8px", ml: 3, mb: 2 }}>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={handleCreateCategory}
//             disabled={isCategoryLoading}
            
//           >
//             {isCategoryLoading ? 'Creating...' : 'Create'}
//           </Button>
//           <Button 
//             variant="outlined" 
//             onClick={handleCategoryFormClose}
//             disabled={isCategoryLoading}
            
//           >
//             Cancel
//           </Button>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default SaveAsServiceDrawer;


import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import { toast } from 'react-toastify';

const SaveAsServiceDrawer = ({
  open,
  onClose,
  selectedRowData,
  categoryOptions = [],
  onServiceCreated,
  onCategoryCreated,
}) => {

  // API endpoints
  const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
  const CATEGORY_API = process.env.REACT_APP_CATEGORY_API || 'https://www.snptaxes.com';

  // Local state for form data
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    rate: '',
    rateType: null,
    tax: false,
    category: null,
  });

  // State for category creation
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
 
  // Rate type options
  const rateTypeOptions = [
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];

  // Initialize form data when selectedRowData changes or drawer opens
  useEffect(() => {
    if (selectedRowData && open) {
      setFormData({
        serviceName: selectedRowData.productorService || '',
        description: selectedRowData.description || '',
        rate: selectedRowData.rate || '',
        rateType: rateTypeOptions.find(opt => opt.value === 'fixed') || rateTypeOptions[0],
        tax: selectedRowData.tax || false,
        category: null,
      });
    }
  }, [selectedRowData, open]);

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle rate type change
  const handleRateTypeChange = (event, newValue) => {
    handleInputChange('rateType', newValue);
  };

  // Handle category change
  const handleCategoryChange = (event, newValue) => {
    handleInputChange('category', newValue);
  };

  // Handle tax switch change
  const handleTaxChange = (event) => {
    handleInputChange('tax', event.target.checked);
  };

  // Category form handlers
  const handleCategoryFormOpen = () => {
    setIsCategoryFormOpen(true);
  };

  const handleCategoryFormClose = () => {
    setIsCategoryFormOpen(false);
    setNewCategoryName('');
  };

  // Create Service Template API function
  const createServiceTemplate = async (serviceData) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      serviceName: serviceData.serviceName,
      description: serviceData.description,
      rate: serviceData.rate,
      ratetype: serviceData.rateType?.value,
      tax: serviceData.tax,
      category: serviceData.category ? serviceData.category.value : null,
      active: "true",
    });

    console.log("Creating service template:", raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const url = `${SERVICE_API}/workflow/services/servicetemplate`;
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      
      console.log("Service creation result:", result);

      if (result && result.message === "ServiceTemplate created successfully") {
        toast.success("Service Template created successfully");
        
        if (onServiceCreated) {
          onServiceCreated(result.serviceTemplate || serviceData);
        }
        
        return { success: true, data: result };
      } else {
        throw new Error(result.message || "Failed to create Service Template");
      }
    } catch (error) {
      console.error("Error creating service template:", error);
      throw error;
    }
  };

  // Create Category API function
  const createCategory = async (categoryName) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      categoryName: categoryName,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const url = `${CATEGORY_API}/workflow/category/newcategory`;
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      
      console.log("Category creation result:", result);

      if (result && result.message === "Category created successfully") {
        toast.success("Category created successfully");
        
        if (onCategoryCreated) {
          onCategoryCreated(result.category || { categoryName });
        }
        
        return { success: true, data: result };
      } else {
        throw new Error(result.message || "Failed to create Category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  // Handle create category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsCategoryLoading(true);
    try {
      await createCategory(newCategoryName.trim());
      handleCategoryFormClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setIsCategoryLoading(false);
    }
  };

  // Handle save service
  const handleSaveService = async () => {
    if (!formData.serviceName.trim()) {
      toast.error('Service name is required');
      return;
    }

    if (!formData.rate || parseFloat(formData.rate) <= 0) {
      toast.error('Valid rate is required');
      return;
    }

    if (!formData.rateType) {
      toast.error('Rate type is required');
      return;
    }

    setIsLoading(true);
    try {
      const serviceData = {
        serviceName: formData.serviceName.trim(),
        description: formData.description.trim(),
        rate: formData.rate,
        rateType: formData.rateType,
        tax: formData.tax,
        category: formData.category,
      };

      await createServiceTemplate(serviceData);
      
      // Reset form and close drawer
      setFormData({
        serviceName: '',
        description: '',
        rate: '',
        rateType: null,
        tax: false,
        category: null,
      });
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setFormData({
      serviceName: '',
      description: '',
      rate: '',
      rateType: null,
      tax: false,
      category: null,
    });
    onClose();
  };

  return (
    <>
      {/* Main Service Sheet */}
      <Sheet open={open} onOpenChange={(o) => { if (!o) handleDrawerClose(); }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Service</SheetTitle>
          </SheetHeader>
          <form className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Service Name *</label>
              <input type="text" placeholder="Service Name" value={formData.serviceName} onChange={(e) => handleInputChange('serviceName', e.target.value)} disabled={isLoading} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea rows={3} placeholder="Description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} disabled={isLoading} className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Rate *</label>
                <input type="number" step="0.01" min="0" placeholder="0.00" value={formData.rate} onChange={(e) => handleInputChange('rate', e.target.value)} disabled={isLoading} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Rate Type *</label>
                <select value={formData.rateType?.value || ''} onChange={(e) => { const opt = rateTypeOptions.find(o => o.value === e.target.value); handleRateTypeChange(null, opt || null); }} disabled={isLoading} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">
                  <option value="">Select Rate Type</option>
                  {rateTypeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" checked={formData.tax} onChange={handleTaxChange} disabled={isLoading} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label className="text-sm text-slate-700">Taxable</label>
            </div>

            <h4 className="text-base font-semibold text-slate-800 pt-2">Category</h4>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Category Name</label>
              <select value={formData.category?.value || ''} onChange={(e) => { const opt = categoryOptions.find(o => o.value === e.target.value); handleCategoryChange(null, opt || null); }} disabled={isLoading} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">
                <option value="">Select Category</option>
                {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <button type="button" onClick={handleCategoryFormOpen} disabled={isLoading} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
              Create category
            </button>

            <div className="flex items-center gap-3 pt-4">
              <button type="button" onClick={handleSaveService} disabled={isLoading} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={handleDrawerClose} disabled={isLoading} className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Category Creation Sheet */}
      <Sheet open={isCategoryFormOpen} onOpenChange={(o) => { if (!o) handleCategoryFormClose(); }}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Category</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Category Name *</label>
              <input type="text" placeholder="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} disabled={isCategoryLoading} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleCreateCategory} disabled={isCategoryLoading} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
                {isCategoryLoading ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={handleCategoryFormClose} disabled={isCategoryLoading} className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SaveAsServiceDrawer;