import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InvoiceComponent from './InvoiceComponent';
import ServicesComponent from './ServicesComponent';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/form';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';
const SERVICE_API = process.env.REACT_APP_SERVICES_URL || 'https://www.snptaxes.com';

const servicesSchema = z.object({
  option: z.enum(['invoice', 'services'], { required_error: 'Please select a service option' }),
});

const ServicesInvoicesStep = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
  handleSubmit,
  isLastStep,
  stepErrors,
  setStepErrors
}) => {
  const [invoices, setInvoices] = useState(formData.services.invoices || [{ id: 1, ...getEmptyInvoice() }]);
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [teammemberoption, setTeammemberoption] = useState([]);
  const [servicedata, setServiceData] = useState([]);

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN || 'https://www.snptaxes.com';

  const form = useForm({
    resolver: zodResolver(servicesSchema),
    defaultValues: { option: formData.services?.option || undefined },
  });

  function getEmptyInvoice() {
    return {
      invoiceTemplate: null,
      teamMembers: [], // Changed from teamMember to teamMembers (array)
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

  // Fetch initial data - runs once on mount
  useEffect(() => {
    fetchInvoiceTemplates();
    fetchTeamMembers();
    fetchServiceData();
  }, []);

  // Initialize invoices from formData - runs when formData.services.invoices changes
  useEffect(() => {
    if (formData.services.invoices && formData.services.invoices.length > 0) {
      setInvoices(formData.services.invoices);
    }
  }, [formData.services.invoices]);

  // Sync invoices with parent form data - runs when invoices change
  useEffect(() => {
    updateFormData('services', { 
      option: formData.services.option,
      invoices: invoices,
      itemizedData: formData.services.itemizedData
    });
  }, [invoices]);

  // Auto-enable payments when invoice option is selected
  useEffect(() => {
    if (formData.services.option === 'invoice') {
      updateFormData('general', { paymentsEnabled: true });
    } else {
      updateFormData('general', { paymentsEnabled: false });
    }
  }, [formData.services.option]);

  // Clear option error when option changes
  useEffect(() => {
    if (formData.services.option && stepErrors?.option) {
      setStepErrors(prev => { const e = { ...prev }; delete e.option; return e; });
    }
  }, [formData.services.option]);

  // Memoized service options to prevent unnecessary recalculations
  const serviceoptions = useMemo(() => {
    return servicedata.map((service) => ({
      value: service._id,
      label: service.serviceName,
    }));
  }, [servicedata]);

  const fetchInvoiceTemplates = async () => {
    try {
      const INVOICE_API = process.env.REACT_APP_INVOICE_API || 'https://www.snptaxes.com';
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch templates");
      const result = await response.json();
      setInvoiceTemplates(result.invoiceTemplate || result || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      const options = data.map(user => ({
        value: user._id,
        label: user.username,
      }));
      setTeammemberoption(options);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchServiceData = async () => {
    try {
      const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
      const url = `${SERVICE_API}/workflow/services/servicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.serviceTemplate);
      setServiceData(data.serviceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleServiceTypeChange = (option) => {
    setStepErrors({});
    updateFormData('services', { option });
    form.setValue('option', option, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Services & Invoices</h2>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="option"
            render={({ field }) => (
              <FormItem className="rounded-xl border border-border bg-muted/20 p-6">
                <FormLabel className="text-sm font-semibold text-foreground">Select Option *</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value || formData.services?.option || ''}
                    onValueChange={(val) => {
                      field.onChange(val);
                      handleServiceTypeChange(val);
                    }}
                    className="space-y-3 mt-2"
                  >
                    <div
                      onClick={() => { field.onChange('invoice'); handleServiceTypeChange('invoice'); }}
                      className={`rounded-xl border p-4 cursor-pointer transition-all ${
                        (field.value || formData.services?.option) === 'invoice'
                          ? 'border-primary bg-primary/5 border-2'
                          : 'border-border bg-background hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="invoice" id="opt-invoice" />
                        <div>
                          <label htmlFor="opt-invoice" className="text-sm font-semibold text-foreground cursor-pointer">Add Invoice</label>
                          <p className="text-xs text-muted-foreground mt-0.5">Create one-time or recurring invoice, or ask for deposit to sign</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => { field.onChange('services'); handleServiceTypeChange('services'); }}
                      className={`rounded-xl border p-4 cursor-pointer transition-all ${
                        (field.value || formData.services?.option) === 'services'
                          ? 'border-primary bg-primary/5 border-2'
                          : 'border-border bg-background hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="services" id="opt-services" />
                        <div>
                          <label htmlFor="opt-services" className="text-sm font-semibold text-foreground cursor-pointer">Itemized Services</label>
                          <p className="text-xs text-muted-foreground mt-0.5">No invoice or deposit request will be created</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {formData.services.option === 'invoice' && (
        <InvoiceComponent
          invoices={invoices}
          setInvoices={setInvoices}
          invoiceTemplates={invoiceTemplates}
          teammemberoption={teammemberoption}
          serviceoptions={serviceoptions}
          formData={formData}
          updateFormData={updateFormData}
          stepErrors={stepErrors}
          setStepErrors={setStepErrors}
        />
      )}

      {formData.services.option === 'services' && (
        <ServicesComponent
          formData={formData}
          updateFormData={updateFormData}
          stepErrors={stepErrors}
          setStepErrors={setStepErrors}
          serviceoptions={serviceoptions}
        />
      )}
    </div>
  );
};

export default ServicesInvoicesStep;