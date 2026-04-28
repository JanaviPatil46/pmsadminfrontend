import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';

const paymentSchema = z.object({
  method: z.string().min(1, 'Payment method is required'),
  amount: z.number().optional(),
  bankDetails: z.string().optional(),
  specialInstructions: z.string().optional(),
});

const PAYMENT_METHODS = ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash', 'Check', 'Other'];

const METHOD_HINTS = {
  'Credit Card': 'Clients will be able to pay securely online using credit cards.',
  'Bank Transfer': 'Provide your bank account details to clients for direct transfers.',
  'PayPal': 'Clients will be redirected to PayPal to complete their payment.',
  'Cash': 'Arrange for cash payment upon service completion or delivery.',
  'Check': 'Provide your mailing address for clients to send checks.',
  'Other': 'Specify any special payment instructions for your clients.',
};

const PaymentStep = ({ formData, updateFormData, stepErrors, setStepErrors }) => {
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: formData.payments?.method || '',
      amount: formData.payments?.amount || 0,
      bankDetails: formData.payments?.bankDetails || '',
      specialInstructions: formData.payments?.specialInstructions || '',
    },
  });

  const watchedMethod = form.watch('method');

  useEffect(() => {
    let totalAmount = 0;
    if (formData.services.option === 'invoice') {
      totalAmount = (formData.services.invoices || []).reduce(
        (sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0
      );
    } else if (formData.services.option === 'services') {
      totalAmount = parseFloat(formData.services.itemizedData?.totalAmount) || 0;
    }
    updateFormData('payments', { amount: totalAmount });
    form.setValue('amount', totalAmount);
  }, [formData.services]);

  useEffect(() => {
    if (stepErrors?.method) form.setError('method', { message: stepErrors.method });
  }, [stepErrors]);

  const handleFieldChange = (field, value) => {
    updateFormData('payments', { [field]: value });
    if (value && value.toString().trim() !== '' && stepErrors?.[field]) {
      setStepErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    }
  };

  const getAmountSource = () => {
    if (formData.services.option === 'invoice') {
      const count = formData.services.invoices?.length || 0;
      return count > 1 ? `Total from ${count} invoices` : 'Total from invoice';
    }
    if (formData.services.option === 'services') return 'Total from itemized services';
    return 'Calculated total';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Payment Information</h2>

      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Payment Details</h3>
                  <p className="text-xs text-muted-foreground mt-1">Configure how you would like to receive payments for this proposal.</p>
                </div>

                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleFieldChange('method', value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAYMENT_METHODS.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                          <Input
                            type="number"
                            readOnly
                            className="pl-7 bg-muted/40 cursor-not-allowed"
                            {...field}
                            value={formData.payments?.amount || 0}
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground">{getAmountSource()}</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedMethod && (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <p className="text-sm font-semibold text-foreground">{watchedMethod} Instructions</p>
                    <p className="text-xs text-muted-foreground">{METHOD_HINTS[watchedMethod]}</p>

                    {watchedMethod === 'Bank Transfer' && (
                      <FormField
                        control={form.control}
                        name="bankDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                rows={2}
                                placeholder="Bank name, account number, routing number..."
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleFieldChange('bankDetails', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {watchedMethod === 'Other' && (
                      <FormField
                        control={form.control}
                        name="specialInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                rows={2}
                                placeholder="Describe your preferred payment method..."
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleFieldChange('specialInstructions', e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border p-6 space-y-3">
                <h3 className="text-base font-semibold text-foreground">Payment Summary</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Type:</span>
                  <span className="font-medium text-foreground">{formData.services.option === 'invoice' ? 'Invoicing' : 'Itemized Services'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium text-foreground">${parseFloat(formData.payments?.amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium text-foreground">{formData.payments?.method || 'Not specified'}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-foreground">Client Will Pay:</span>
                  <span className="text-sm font-bold text-primary">${parseFloat(formData.payments?.amount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-3">
                <h4 className="text-base font-semibold text-foreground">Payment Tips</h4>
                <p className="text-xs text-muted-foreground"><strong>Credit Card:</strong> Best for online payments and faster processing.</p>
                <p className="text-xs text-muted-foreground"><strong>Bank Transfer:</strong> Lower fees, good for large amounts.</p>
                <p className="text-xs text-muted-foreground"><strong>PayPal:</strong> Familiar to most clients, secure.</p>
                <p className="text-xs text-muted-foreground"><strong>Cash/Check:</strong> Traditional methods, may require more follow-up.</p>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentStep;