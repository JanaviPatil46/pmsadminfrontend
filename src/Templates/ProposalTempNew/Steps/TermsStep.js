import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Editor from '../components/Editor';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';

const termsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

const TermsStep = ({ formData, updateFormData, stepErrors, setStepErrors }) => {
  const form = useForm({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      title: formData.terms?.title || '',
      description: formData.terms?.description || '',
    },
  });

  useEffect(() => {
    form.reset({
      title: formData.terms?.title || '',
      description: formData.terms?.description || '',
    });
  }, [formData.terms?.title, formData.terms?.description]);

  useEffect(() => {
    if (stepErrors?.title) form.setError('title', { message: stepErrors.title });
    if (stepErrors?.description) form.setError('description', { message: stepErrors.description });
  }, [stepErrors]);

  const handleTitleChange = (value) => {
    updateFormData('terms', { ...formData.terms, title: value });
    if (value.trim() && stepErrors?.title) {
      setStepErrors(prev => { const e = { ...prev }; delete e.title; return e; });
    }
  };

  const handleDescriptionChange = (content) => {
    updateFormData('terms', { ...formData.terms, description: content });
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (text && stepErrors?.description) {
      setStepErrors(prev => { const e = { ...prev }; delete e.description; return e; });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Terms & Conditions</h2>

      <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-5">
        <p className="text-sm text-muted-foreground">
          Engagement letter or contractual agreement that outlines the terms of the relationship
          between your firm and clients. The section title can be renamed.
        </p>

        <Form {...form}>
          <form className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter terms title"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleTitleChange(e.target.value);
                      }}
                    />
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
                  <FormLabel>Terms & Conditions</FormLabel>
                  <FormControl>
                    <Editor
                      initialContent={field.value || ''}
                      onChange={(content) => {
                        field.onChange(content);
                        handleDescriptionChange(content);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TermsStep;