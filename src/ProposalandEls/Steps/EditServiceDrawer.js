import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SideSheet } from '../../components/ui/side-sheet';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../../components/ui/button';

const editServiceSchema = z.object({
  productorService: z.string().min(1, 'Product/Service name is required'),
  description: z.string().optional(),
  rate: z.coerce.number({ invalid_type_error: 'Valid rate is required' }).min(0, 'Rate must be 0 or more'),
  quantity: z.coerce.number({ invalid_type_error: 'Valid quantity is required' }).min(0.01, 'Quantity must be greater than 0'),
  tax: z.boolean().optional(),
  isDiscount: z.boolean().optional(),
});

const EditServiceDrawer = ({ open, onClose, selectedRowData, onSave }) => {
  const form = useForm({
    resolver: zodResolver(editServiceSchema),
    defaultValues: {
      productorService: '',
      description: '',
      rate: 0,
      quantity: 1,
      tax: false,
      isDiscount: false,
    },
  });

  useEffect(() => {
    if (selectedRowData) {
      form.reset({
        productorService: selectedRowData.productorService || '',
        description: selectedRowData.description || '',
        rate: parseFloat(String(selectedRowData.rate).replace('$', '')) || 0,
        quantity: parseFloat(selectedRowData.quantity) || 1,
        tax: selectedRowData.tax || false,
        isDiscount: selectedRowData.isDiscount || false,
      });
    }
  }, [selectedRowData]);

  const onSubmit = (values) => {
    const amount = (values.rate * values.quantity).toFixed(2);
    onSave({
      ...selectedRowData,
      productorService: values.productorService,
      description: values.description || '',
      rate: values.rate.toFixed(2),
      quantity: String(values.quantity),
      tax: values.tax || false,
      isDiscount: values.isDiscount || false,
      amount,
    });
  };

  const handleClose = () => { form.reset(); onClose(); };

  const watchRate = form.watch('rate') || 0;
  const watchQty = form.watch('quantity') || 0;
  const calculatedAmount = (parseFloat(watchRate) * parseFloat(watchQty)).toFixed(2);

  return (
    <SideSheet
      open={open}
      onOpenChange={o => { if (!o) handleClose(); }}
      title="Edit Line Item"
      size="md"
      hideDefaultFooter
      footer={
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
          <Button type="button" size="sm" onClick={() => form.handleSubmit(onSubmit)()}>Save Changes</Button>
        </div>
      }
    >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productorService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product or Service *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product or service name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Enter description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <Input {...field} type="number" step="0.01" placeholder="0.00" className="pl-7" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="1" placeholder="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground mb-1">Calculated Amount</p>
              <p className="text-lg font-semibold text-primary">${calculatedAmount}</p>
            </div>

            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Taxable</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDiscount"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">This is a discount</FormLabel>
                </FormItem>
              )}
            />

          </form>
        </Form>
    </SideSheet>
  );
};

export default EditServiceDrawer;