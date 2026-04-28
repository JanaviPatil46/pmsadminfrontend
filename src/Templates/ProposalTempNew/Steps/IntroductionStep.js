

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Editor from '../components/Editor';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';

const introductionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

const IntroductionStep = ({ formData, updateFormData, stepErrors, setStepErrors }) => {
  const form = useForm({
    resolver: zodResolver(introductionSchema),
    defaultValues: {
      title: formData.introduction?.title || '',
      description: formData.introduction?.description || '',
    },
  });

  useEffect(() => {
    form.reset({
      title: formData.introduction?.title || '',
      description: formData.introduction?.description || '',
    });
  }, [formData.introduction?.title, formData.introduction?.description]);

  useEffect(() => {
    if (stepErrors?.title) form.setError('title', { message: stepErrors.title });
    if (stepErrors?.description) form.setError('description', { message: stepErrors.description });
  }, [stepErrors]);

  const handleTitleChange = (value) => {
    updateFormData('introduction', { ...formData.introduction, title: value });
    if (value.trim() && stepErrors?.title) {
      setStepErrors(prev => { const e = { ...prev }; delete e.title; return e; });
    }
  };

  const handleDescriptionChange = (content) => {
    updateFormData('introduction', { ...formData.introduction, description: content });
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (text && stepErrors?.description) {
      setStepErrors(prev => { const e = { ...prev }; delete e.description; return e; });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Introduction</h2>

      <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-5">
        <p className="text-sm text-muted-foreground">
          Explain to your clients who you are, what services you provide, the value you bring,
          and any other information you want to share.
        </p>

        <Form {...form}>
          <form className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Introduction Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter introduction title"
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
                  <FormLabel>Description</FormLabel>
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

export default IntroductionStep;