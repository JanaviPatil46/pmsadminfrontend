import React, { useState, useEffect } from 'react';
import Editor from '../components/Editor'; // Adjust the import path as needed


const IntroductionStep = ({ formData, updateFormData, nextStep, prevStep, stepErrors, setStepErrors }) => {
  const [touched, setTouched] = useState({});

  // Handle field blur
  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  // Handle title change
  const handleTitleChange = (e) => {
    const value = e.target.value;
    updateFormData('introduction', { 
      ...formData.introduction, 
      title: value 
    });

    // Clear error when user starts typing
    if (value.trim() !== '' && stepErrors.title) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  };

  // Handle description change from editor
  const handleDescriptionChange = (content) => {
    updateFormData('introduction', { 
      ...formData.introduction, 
      description: content 
    });

    // Clear error when user starts typing
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (textContent !== '' && stepErrors.description) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-indigo-600">Introduction</h2>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
        <p className="text-sm text-slate-500">
          Explain to your clients who you are, what services you provide, the value you bring,
          and any other information you want to share.
        </p>

        <div className="space-y-1.5">
          <input
            type="text"
            value={formData.introduction?.title || ''}
            onChange={handleTitleChange}
            onBlur={() => handleBlur('title')}
            placeholder="Enter introduction title"
            required
            className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${stepErrors.title ? 'border-red-400' : 'border-slate-200'}`}
          />
          {stepErrors.title && <p className="text-xs text-red-500">{stepErrors.title}</p>}
        </div>

        <div className="space-y-1.5 mt-4">
          <Editor
            initialContent={formData.introduction?.description || ''}
            onChange={handleDescriptionChange}
            onBlur={() => handleBlur('description')}
          />
          {stepErrors.description && <p className="text-xs text-red-500">{stepErrors.description}</p>}
        </div>
      </div>
    </div>
  );
};
export default IntroductionStep;