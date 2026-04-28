import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Editor from '../components/Editor';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';

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

      <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Explain to your clients who you are, what services you provide, the value you bring,
          and any other information you want to share.
        </p>

        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter introduction title"
                      value={formData.introduction?.title || ''}
                      className={stepErrors?.title ? 'border-destructive' : ''}
                      onChange={e => { field.onChange(e); handleTitleChange(e.target.value); }}
                    />
                  </FormControl>
                  {stepErrors?.title
                    ? <p className="text-xs text-destructive">{stepErrors.title}</p>
                    : <FormMessage />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Editor
                      initialContent={formData.introduction?.description || ''}
                      onChange={handleDescriptionChange}
                    />
                  </FormControl>
                  {stepErrors?.description && <p className="text-xs text-destructive">{stepErrors.description}</p>}
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