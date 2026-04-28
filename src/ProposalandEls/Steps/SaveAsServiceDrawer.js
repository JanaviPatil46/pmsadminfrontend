import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'react-toastify';

const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
const CATEGORY_API = process.env.REACT_APP_CATEGORY_API || 'https://www.snptaxes.com';

const rateTypeOptions = [
  { label: 'Item', value: 'item' },
  { label: 'Hour', value: 'hour' },
];

const serviceSchema = z.object({
  serviceName: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  rate: z.coerce.number({ invalid_type_error: 'Valid rate is required' }).min(0.01, 'Rate must be greater than 0'),
  rateType: z.string().min(1, 'Rate type is required'),
  tax: z.boolean().optional(),
  category: z.string().optional(),
});

const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
});

const SaveAsServiceDrawer = ({
  open,
  onClose,
  selectedRowData,
  categoryOptions = [],
  onServiceCreated,
  onCategoryCreated,
}) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const serviceForm = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { serviceName: '', description: '', rate: 0, rateType: 'item', tax: false, category: '' },
  });

  const categoryForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { categoryName: '' },
  });

  useEffect(() => {
    if (selectedRowData && open) {
      serviceForm.reset({
        serviceName: selectedRowData.productorService || '',
        description: selectedRowData.description || '',
        rate: parseFloat(String(selectedRowData.rate).replace('$', '')) || 0,
        rateType: 'item',
        tax: selectedRowData.tax || false,
        category: '',
      });
    }
  }, [selectedRowData, open]);

  const createServiceTemplate = async (values) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const raw = JSON.stringify({
      serviceName: values.serviceName,
      description: values.description || '',
      rate: String(values.rate),
      ratetype: values.rateType,
      tax: values.tax || false,
      category: values.category || null,
      active: 'true',
    });
    const response = await fetch(`${SERVICE_API}/workflow/services/servicetemplate`, { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' });
    const result = await response.json();
    if (result?.message === 'ServiceTemplate created successfully') {
      toast.success('Service Template created successfully');
      if (onServiceCreated) onServiceCreated(result.serviceTemplate || values);
    } else {
      throw new Error(result.message || 'Failed to create Service Template');
    }
  };

  const createCategory = async (categoryName) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const raw = JSON.stringify({ categoryName });
    const response = await fetch(`${CATEGORY_API}/workflow/category/newcategory`, { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' });
    const result = await response.json();
    if (result?.message === 'Category created successfully') {
      toast.success('Category created successfully');
      if (onCategoryCreated) onCategoryCreated(result.category || { categoryName });
    } else {
      throw new Error(result.message || 'Failed to create Category');
    }
  };

  const onServiceSubmit = async (values) => {
    setIsLoading(true);
    try {
      await createServiceTemplate(values);
      serviceForm.reset();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };

  const onCategorySubmit = async (values) => {
    setIsCategoryLoading(true);
    try {
      await createCategory(values.categoryName.trim());
      categoryForm.reset();
      setIsCategoryFormOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleDrawerClose = () => { serviceForm.reset(); onClose(); };

  return (
    <>
      <Sheet open={open} onOpenChange={o => { if (!o) handleDrawerClose(); }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Service</SheetTitle>
          </SheetHeader>
          <Form {...serviceForm}>
            <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="mt-4 space-y-4">
              <FormField
                control={serviceForm.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name *</FormLabel>
                    <FormControl><Input {...field} placeholder="Service Name" disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} rows={3} placeholder="Description" disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={serviceForm.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate *</FormLabel>
                      <FormControl><Input {...field} type="number" step="0.01" min="0" placeholder="0.00" disabled={isLoading} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={serviceForm.control}
                  name="rateType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate Type *</FormLabel>
                      <ShadSelect value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select rate type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {rateTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </ShadSelect>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={serviceForm.control}
                name="tax"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} /></FormControl>
                    <FormLabel className="font-normal">Taxable</FormLabel>
                  </FormItem>
                )}
              />
              <h4 className="text-sm font-semibold text-foreground pt-2">Category</h4>
              <FormField
                control={serviceForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <ShadSelect value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categoryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </ShadSelect>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCategoryFormOpen(true)} disabled={isLoading}>
                + Create category
              </Button>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleDrawerClose} disabled={isLoading}>Cancel</Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <Sheet open={isCategoryFormOpen} onOpenChange={o => { if (!o) { categoryForm.reset(); setIsCategoryFormOpen(false); } }}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Category</SheetTitle>
          </SheetHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="mt-4 space-y-4">
              <FormField
                control={categoryForm.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl><Input {...field} placeholder="Category Name" disabled={isCategoryLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-3">
                <Button type="submit" className="flex-1" disabled={isCategoryLoading}>{isCategoryLoading ? 'Creating...' : 'Create'}</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => { categoryForm.reset(); setIsCategoryFormOpen(false); }} disabled={isCategoryLoading}>Cancel</Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SaveAsServiceDrawer;