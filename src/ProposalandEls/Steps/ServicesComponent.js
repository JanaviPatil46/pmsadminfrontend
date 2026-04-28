import React, { useState, useEffect } from 'react';
import { MoreVertical, PlusCircle, Tag } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { ServiceCombobox } from '../../components/ui/service-combobox';
import SaveAsServiceDrawer from './SaveAsServiceDrawer';
import EditServiceDrawer from './EditServiceDrawer';

const SERVICE_API = process.env.REACT_APP_SERVICES_URL || 'https://www.snptaxes.com';


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

  const handleServiceInputChange = (inputValue, index) => {
    const updatedRows = itemizedData.rows.map((row, i) =>
      i === index ? { ...row, productorService: inputValue } : row
    );
    const recalculatedRows = recalculateRowAmounts(updatedRows);
    const summary = calculateSummary(recalculatedRows, itemizedData.taxRate);
    updateFormData('services', { itemizedData: { ...itemizedData, rows: recalculatedRows, ...summary } });
    if (inputValue.trim()) clearRowErrors(index);
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Itemized Service</h3>
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">⚠️ No Payment step will be shown for itemized services</p>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-base font-semibold text-foreground">Line items</h4>
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
                    <td className="px-4 py-2 min-w-[220px]">
                      <ServiceCombobox
                        options={serviceoptions}
                        value={row.productorService}
                        placeholder={row.isDiscount ? 'Reason for discount' : 'Product or Service'}
                        hasError={!!getRowError(rowIndex, 'productorService')}
                        onChange={label => handleServiceChange(rowIndex, { label, value: label })}
                        onInputChange={text => handleServiceInputChange(text, rowIndex)}
                      />
                      {getRowError(rowIndex, 'productorService') && <p className="text-xs text-destructive mt-0.5">{getRowError(rowIndex, 'productorService')}</p>}
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        name="description"
                        value={row.description}
                        onChange={e => handleInputChange(rowIndex, e)}
                        placeholder="Description"
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        name="rate"
                        value={row.rate}
                        onChange={e => handleInputChange(rowIndex, e)}
                        className={`w-20 ${getRowError(rowIndex, 'rate') ? 'border-destructive' : ''}`}
                      />
                      {getRowError(rowIndex, 'rate') && <p className="text-xs text-destructive mt-0.5">{getRowError(rowIndex, 'rate')}</p>}
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        name="quantity"
                        value={row.quantity}
                        onChange={e => handleInputChange(rowIndex, e)}
                        className={`w-16 ${getRowError(rowIndex, 'quantity') ? 'border-destructive' : ''}`}
                      />
                      {getRowError(rowIndex, 'quantity') && <p className="text-xs text-destructive mt-0.5">{getRowError(rowIndex, 'quantity')}</p>}
                    </td>
                    <td className="px-4 py-2 text-sm text-foreground">${row.amount}</td>
                    <td className="px-4 py-2">
                      <Checkbox
                        checked={row.tax}
                        onCheckedChange={checked =>
                          handleInputChange(rowIndex, { target: { name: 'tax', type: 'checkbox', checked } })
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative">
                        <button type="button" onClick={e => handleMenuOpen(e, rowIndex)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {isMenuOpen(rowIndex) && (
                          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-background py-1 shadow-lg">
                            <button type="button" onClick={() => handleEditService(row, rowIndex)} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/60">Edit</button>
                            <button type="button" onClick={() => handleDuplicate(rowIndex)} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/60">Duplicate</button>
                            <button type="button" onClick={() => deleteRow(rowIndex)} className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10">Delete</button>
                            <button type="button" onClick={() => { setSelectedRowData(row); setIsNewServiceDrawerOpen(true); handleMenuClose(); }} className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/60">Save as new service</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => addRow()} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
            <PlusCircle className="h-4 w-4" /> Line item
          </button>
          <button type="button" onClick={() => addRow(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80">
            <Tag className="h-4 w-4" /> Discount
          </button>
        </div>

        <h4 className="text-base font-semibold text-foreground">Summary</h4>
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden max-w-lg">
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
                    <Input type="text" value={itemizedData.taxRate || '0'} onChange={handleTaxRateChange} className="w-16" />
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

      {/* Drawers */}
      <SaveAsServiceDrawer
        open={isNewServiceDrawerOpen}
        onClose={() => setIsNewServiceDrawerOpen(false)}
        selectedRowData={selectedRowData}
        onServiceCreated={handleServiceCreated}
        onCategoryCreated={handleCategoryCreated}
        categoryOptions={categoryoptions}
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