import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Info, ChevronsUpDown, Check } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL || 'https://www.snptaxes.com';
const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';

const accountGeneralSchema = z.object({
  account: z.string().min(1, 'Account is required'),
  proposalName: z.string().min(1, 'Proposal name is required'),
  template: z.string().optional(),
  introductionEnabled: z.boolean().optional(),
  termsEnabled: z.boolean().optional(),
  servicesEnabled: z.boolean().optional(),
  paymentsEnabled: z.boolean().optional(),
});

function getEmptyRow() {
  return { productorService: '', description: '', rate: '0.00', quantity: '1', amount: '0.00', tax: false, isDiscount: false };
}

function getEmptyInvoice() {
  return {
    invoiceTemplate: null, teamMember: null, issueInvoice: 'immediately', specificDate: null, selectedTime: null,
    description: '', charCount: 0, charLimit: 1000, rows: [getEmptyRow()],
    subtotal: '0.00', taxRate: '0', taxTotal: '0.00', totalAmount: '0.00', clientNote: '',
  };
}

const AccountGeneral = ({ formData, updateFormData, stepErrors, setStepErrors }) => {
  const [accounts, setAccounts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [accountSearch, setAccountSearch] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');

  const form = useForm({
    resolver: zodResolver(accountGeneralSchema),
    defaultValues: {
      account: formData.general?.accountId || '',
      proposalName: formData.general?.proposalName || '',
      template: formData.general?.proposalTemp || '',
      introductionEnabled: formData.general?.introductionEnabled ?? true,
      termsEnabled: formData.general?.termsEnabled ?? true,
      servicesEnabled: formData.general?.servicesEnabled ?? true,
      paymentsEnabled: formData.general?.paymentsEnabled ?? false,
    },
  });

  useEffect(() => {
    fetchAccounts();
    fetchTemplates();
    fetchInvoiceTemplates();
  }, []);

  useEffect(() => {
    if (stepErrors?.account) form.setError('account', { message: stepErrors.account });
    if (stepErrors?.proposalName) form.setError('proposalName', { message: stepErrors.proposalName });
  }, [stepErrors]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${ACCOUNT_API}/accounts/account/accountdetailslist/true`);
      if (!res.ok) throw new Error('Failed to fetch accounts');
      const data = await res.json();
      setAccounts(data.accountlist || data || []);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('http://localhost:9000/api/proposals');
      if (!res.ok) throw new Error('Failed to fetch templates');
      const data = await res.json();
      setTemplates(data.proposallist || data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const fetchInvoiceTemplates = async () => {
    try {
      const res = await fetch(`${INVOICE_API}/workflow/invoicetemp/invoicetemplate`);
      if (!res.ok) throw new Error('Failed to fetch invoice templates');
      const result = await res.json();
      setInvoiceTemplates(result.invoiceTemplate || result || []);
    } catch (err) {
      console.error('Error fetching invoice templates:', err);
    }
  };

  const transformLineItemsToRows = (lineItems) => {
    if (!lineItems?.length) return [getEmptyRow()];
    return lineItems.map(item => ({
      productorService: item.productorService || '',
      description: item.description || '',
      rate: item.rate?.toString() || '0.00',
      quantity: item.quantity?.toString() || '1',
      amount: item.amount?.toString() || '0.00',
      tax: item.tax || false,
      isDiscount: false,
    }));
  };

  const fetchTemplateData = async (templateId) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:9000/api/proposals/${templateId}`);
      if (!res.ok) throw new Error('Failed to fetch template data');
      const templateData = await res.json();

      updateFormData('general', {
        ...formData.general,
        proposalTemp: templateData.general?.proposalTemp || '',
        proposalName: templateData.general?.proposalName || '',
        introductionEnabled: templateData.general?.introductionEnabled ?? true,
        termsEnabled: templateData.general?.termsEnabled ?? true,
        servicesEnabled: templateData.general?.servicesEnabled ?? true,
        paymentsEnabled: templateData.general?.paymentsEnabled ?? false,
      });

      if (templateData.introduction) updateFormData('introduction', templateData.introduction);
      if (templateData.terms) updateFormData('terms', templateData.terms);
      if (templateData.services) {
        updateFormData('services', {
          option: templateData.services?.option || '',
          invoices: (templateData.services?.invoices || []).map((inv, idx) => ({
            id: idx + 1,
            invoiceTemplate: inv.invoiceTemplate ? { value: inv.invoiceTemplate, label: invoiceTemplates.find(t => t._id === inv.invoiceTemplate)?.templatename || 'Template' } : null,
            teamMember: inv.teamMember || null,
            issueInvoice: 'immediately', specificDate: null, selectedTime: null,
            description: inv.description || '', charCount: inv.description?.length || 0, charLimit: 1000,
            rows: transformLineItemsToRows(inv.lineItems || []),
            subtotal: inv.subtotal?.toString() || '0.00', taxRate: inv.taxRate?.toString() || '0',
            taxTotal: inv.taxTotal?.toString() || '0.00', totalAmount: inv.totalAmount?.toString() || '0.00', clientNote: '',
          })) || [{ id: 1, ...getEmptyInvoice() }],
          itemizedData: templateData.services?.itemizedData ? {
            ...templateData.services.itemizedData,
            rows: transformLineItemsToRows(templateData.services.itemizedData.lineItems),
            subtotal: templateData.services.itemizedData.subtotal?.toString() || '0.00',
            taxRate: templateData.services.itemizedData.taxRate?.toString() || '0',
            taxTotal: templateData.services.itemizedData.taxTotal?.toString() || '0.00',
            totalAmount: templateData.services.itemizedData.totalAmount?.toString() || '0.00',
          } : { price: 0, name: '', rows: [getEmptyRow()], subtotal: '0.00', taxRate: '0', taxTotal: '0.00', totalAmount: '0.00' },
        });
      }
      if (templateData.payments) updateFormData('payments', templateData.payments);
      setStepErrors({});
    } catch (err) {
      console.error('Error fetching template data:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearTemplateData = () => {
    updateFormData('general', { ...formData.general, proposalTemp: '', proposalName: '', introductionEnabled: true, termsEnabled: true, servicesEnabled: true, paymentsEnabled: false });
    updateFormData('introduction', { title: '', description: '' });
    updateFormData('terms', { title: '', description: '' });
    updateFormData('services', { option: '', invoices: [{ id: 1, ...getEmptyInvoice() }], itemizedData: { price: 0, name: '', rows: [getEmptyRow()], subtotal: '0.00', taxRate: '0', taxTotal: '0.00', totalAmount: '0.00' } });
    updateFormData('payments', { method: '', amount: 0 });
  };

  const handleAccountSelect = (option) => {
    form.setValue('account', option.value, { shouldValidate: true });
    updateFormData('general', { account: option, accountId: option.value });
    if (stepErrors?.account) setStepErrors(prev => { const e = { ...prev }; delete e.account; return e; });
    setAccountOpen(false);
  };

  const handleTemplateSelect = (option) => {
    form.setValue('template', option ? option.value : '');
    updateFormData('general', { template: option, proposalTemp: option?.value || '', templateName: option?.label || '' });
    if (option?.value) {
      fetchTemplateData(option.value);
    } else {
      clearTemplateData();
    }
    setTemplateOpen(false);
  };

  const handleVisibilityChange = (field, value) => {
    updateFormData('general', { [field]: value });
    form.setValue(field, value);
  };

  const accountOptions = accounts.map(a => ({ value: a.id, label: a.Name }));
  const templateOptions = templates.map(t => ({
    value: t._id,
    label: t.general?.templateName || t.general?.proposalName || 'Unnamed Template',
  }));

  const filteredAccounts = accountOptions.filter(o => o.label?.toLowerCase().includes(accountSearch.toLowerCase()));
  const filteredTemplates = templateOptions.filter(o => o.label?.toLowerCase().includes(templateSearch.toLowerCase()));

  const selectedAccount = accountOptions.find(o => o.value === form.watch('account'));
  const selectedTemplate = templateOptions.find(o => o.value === form.watch('template'));

  const StepCard = ({ title, description, fieldName }) => {
    const checked = form.watch(fieldName) ?? false;
    return (
      <div className={`rounded-xl border p-4 mb-3 transition-all hover:shadow-sm ${checked ? 'border-primary bg-primary/5 border-2' : 'border-border bg-background'}`}>
        <div className="flex items-center gap-3 mb-2">
          <Checkbox id={fieldName} checked={checked} onCheckedChange={val => handleVisibilityChange(fieldName, val)} />
          <label htmlFor={fieldName} className="text-base font-semibold text-foreground cursor-pointer">{title}</label>
        </div>
        <div className="flex items-start gap-1.5 ml-7">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">General Information</h2>

      {loading && (
        <div className="flex items-center gap-2 py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      )}

      <Form {...form}>
        <form className="space-y-6">
          <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-5">
            <h3 className="text-base font-semibold text-foreground">Basic Details</h3>

            {/* Account Selection */}
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Account *</FormLabel>
                  <Popover open={accountOpen} onOpenChange={setAccountOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between font-normal", !selectedAccount && "text-muted-foreground")}
                        >
                          {selectedAccount ? selectedAccount.label : "Search for an account..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="p-2 border-b border-border">
                        <Input
                          placeholder="Search accounts..."
                          value={accountSearch}
                          onChange={e => setAccountSearch(e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredAccounts.length === 0 ? (
                          <p className="p-3 text-sm text-muted-foreground">No accounts found.</p>
                        ) : filteredAccounts.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleAccountSelect(option)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-left"
                          >
                            <Check className={cn("h-4 w-4", field.value === option.value ? "opacity-100 text-primary" : "opacity-0")} />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Template Selection */}
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Template (Optional)</FormLabel>
                  <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between font-normal text-muted-foreground"
                        >
                          {selectedTemplate ? selectedTemplate.label : "Search for a template..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="p-2 border-b border-border">
                        <Input
                          placeholder="Search templates..."
                          value={templateSearch}
                          onChange={e => setTemplateSearch(e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => handleTemplateSelect(null)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-muted-foreground"
                        >
                          Clear selection
                        </button>
                        {filteredTemplates.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleTemplateSelect(option)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-left"
                          >
                            <Check className={cn("h-4 w-4", field.value === option.value ? "opacity-100 text-primary" : "opacity-0")} />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">Choose a template to pre-fill the proposal</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Proposal Name */}
            <FormField
              control={form.control}
              name="proposalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposal Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a name for this proposal"
                      {...field}
                      value={formData.general?.proposalName || ''}
                      onChange={(e) => {
                        field.onChange(e);
                        updateFormData('general', { proposalName: e.target.value });
                        if (e.target.value.trim() && stepErrors?.proposalName) {
                          setStepErrors(prev => { const er = { ...prev }; delete er.proposalName; return er; });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-xl border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-2">Configure Proposal Steps</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Customize which steps to include in your proposal. Each step helps communicate different aspects of your service to clients.
            </p>

            <StepCard title="Introduction Step" description="Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share" fieldName="introductionEnabled" />
            <StepCard title="Terms Step" description="Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed." fieldName="termsEnabled" />
            <StepCard title="Services & Invoices Step" description="Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically." fieldName="servicesEnabled" />
            <StepCard title="Payment Step" description="Configure payment methods and terms for your proposal." fieldName="paymentsEnabled" />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountGeneral;




