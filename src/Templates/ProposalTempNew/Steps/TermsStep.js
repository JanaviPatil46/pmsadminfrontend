

import React, { useState } from 'react';
import Editor from '../components/Editor';

// const TermsStep = ({ formData, updateFormData, nextStep, prevStep }) => {
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   // Validation rules
//   const validateField = (name, value) => {
//     const newErrors = { ...errors };

//     switch (name) {
//       case 'title':
//         if (!value || value.trim() === '') {
//           newErrors.title = 'Title is required';
//         } else {
//           delete newErrors.title;
//         }
//         break;

//       case 'description':
//         // Remove HTML tags for validation
//         const textContent = value.replace(/<[^>]*>/g, '').trim();
//         if (!textContent) {
//           newErrors.description = 'Terms and conditions are required';
//         } else {
//           delete newErrors.description;
//         }
//         break;

//       default:
//         break;
//     }

//     return newErrors;
//   };

//   // Handle field blur
//   const handleBlur = (fieldName) => (e) => {
//     setTouched(prev => ({
//       ...prev,
//       [fieldName]: true
//     }));

//     const value = fieldName === 'description' 
//       ? formData.terms?.description || '' 
//       : e.target.value;

//     const newErrors = validateField(fieldName, value);
//     setErrors(newErrors);
//   };

//   // Handle title change
//   const handleTitleChange = (e) => {
//     const value = e.target.value;
//     updateFormData('terms', { 
//       ...formData.terms, 
//       title: value 
//     });

//     // Validate immediately if field was already touched
//     if (touched.title) {
//       const newErrors = validateField('title', value);
//       setErrors(newErrors);
//     }
//   };

//   // Handle description change from editor
//   const handleDescriptionChange = (content) => {
//     updateFormData('terms', { 
//       ...formData.terms, 
//       description: content 
//     });

//     // Validate immediately if field was already touched
//     if (touched.description) {
//       const newErrors = validateField('description', content);
//       setErrors(newErrors);
//     }
//   };

  

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom color="primary" fontWeight="600" sx={{ mb: 4 }}>
//         Terms & Conditions
//       </Typography>

      

//       <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
//         <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//           Engagement letter or contractual agreement that outlines the terms of the relationship 
//           between your firm and clients. The section title can be renamed.
//         </Typography>

//         <TextField
//           fullWidth
//           label="Terms Title"
//           value={formData.terms?.title || ''}
//           onChange={handleTitleChange}
//           onBlur={handleBlur('title')}
//           error={touched.title && !!errors.title}
//           helperText={touched.title && errors.title}
//           placeholder="Enter terms title"
//           required
//           margin="normal"
//           sx={{ mb: 3 }}
//         />

//         <FormControl fullWidth error={touched.description && !!errors.description}>
         
//           <Box sx={{ mt: 2, mb: 1 }}>
//             <Editor
//               initialContent={formData.terms?.description || ''}
//               onChange={handleDescriptionChange}
//               onBlur={() => handleBlur('description')()}
//             />
//           </Box>
//           {touched.description && errors.description && (
//             <FormHelperText error>{errors.description}</FormHelperText>
//           )}
          
//         </FormControl>
//       </Paper>

//     </Box>
//   );
// };
const TermsStep = ({ formData, updateFormData, nextStep, prevStep, stepErrors, setStepErrors }) => {
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
    updateFormData('terms', { 
      ...formData.terms, 
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
    updateFormData('terms', { 
      ...formData.terms, 
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
      <h2 className="text-2xl font-semibold text-blue-600">Terms & Conditions</h2>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
        <p className="text-sm text-slate-500">
          Engagement letter or contractual agreement that outlines the terms of the relationship
          between your firm and clients. The section title can be renamed.
        </p>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Terms Title *</label>
          <input
            type="text"
            value={formData.terms?.title || ''}
            onChange={handleTitleChange}
            onBlur={() => handleBlur('title')}
            placeholder="Enter terms title"
            required
            className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${stepErrors.title ? 'border-red-400' : 'border-slate-200'}`}
          />
          {stepErrors.title && <p className="text-xs text-red-500">{stepErrors.title}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Terms & Conditions</label>
          <Editor
            initialContent={formData.terms?.description || ''}
            onChange={handleDescriptionChange}
            onBlur={() => handleBlur('description')}
          />
          {stepErrors.description && <p className="text-xs text-red-500">{stepErrors.description}</p>}
        </div>
      </div>
    </div>
  );
};

export default TermsStep;