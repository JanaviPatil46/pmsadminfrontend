

// import React, { useState, useEffect } from 'react';
// import Editor from '../components/Editor'; // Adjust the import path as needed

// const IntroductionStep = ({ formData, updateFormData, nextStep, prevStep }) => {
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   // Validation rules
//   const validateField = (name, value) => {
//     const newErrors = { ...errors };

//     switch (name) {
//       case 'title':
//         if (!value || value.trim() === '') {
//           newErrors.title = 'Title is required';
//         }  else {
//           delete newErrors.title;
//         }
//         break;

//       case 'description':
//         // Remove HTML tags for validation
//         const textContent = value.replace(/<[^>]*>/g, '').trim();
//         if (!textContent) {
//           newErrors.description = 'Description is required';
//         }  else {
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
//       ? formData.introduction?.description || '' 
//       : e.target.value;

//     const newErrors = validateField(fieldName, value);
//     setErrors(newErrors);
//   };

//   // Handle title change
//   const handleTitleChange = (e) => {
//     const value = e.target.value;
//     updateFormData('introduction', { 
//       ...formData.introduction, 
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
//     updateFormData('introduction', { 
//       ...formData.introduction, 
//       description: content 
//     });

//     // Validate immediately if field was already touched
//     if (touched.description) {
//       const newErrors = validateField('description', content);
//       setErrors(newErrors);
//     }
//   };

//   // Validate all fields before proceeding
//   const handleNext = () => {
//     // Mark all fields as touched
//     const allTouched = {
//       title: true,
//       description: true
//     };
//     setTouched(allTouched);

//     // Validate all fields
//     const titleErrors = validateField('title', formData.introduction?.title || '');
//     const descriptionErrors = validateField('description', formData.introduction?.description || '');
    
//     const allErrors = { ...titleErrors, ...descriptionErrors };

//     if (Object.keys(allErrors).length === 0) {
//       nextStep();
//     } else {
//       setErrors(allErrors);
//     }
//   };

//   // Check if form is valid
//   const isFormValid = () => {
//     return Object.keys(errors).length === 0;
//   };

//   return (
//     <div className="step-container">
//       <h2>Introduction</h2>
      
//       <div className="form-group">
//         <label htmlFor="title">Title *</label>
//         <input
//           id="title"
//           type="text"
//           value={formData.introduction?.title || ''}
//           onChange={handleTitleChange}
//           onBlur={handleBlur('title')}
//           placeholder="Enter introduction title"
//           className={touched.title && errors.title ? 'error' : ''}
//         />
//         {touched.title && errors.title && (
//           <div className="error-text">{errors.title}</div>
//         )}
//       </div>

//       <div className="form-group">
//         <label htmlFor="description">Description *</label>
//         <Editor
//           initialContent={formData.introduction?.description || ''}
//           onChange={handleDescriptionChange}
//           onBlur={() => handleBlur('description')()}
//         />
//         {touched.description && errors.description && (
//           <div className="error-text">{errors.description}</div>
//         )}
//         {/* <div className="character-count">
//           {formData.introduction?.description 
//             ? `Characters: ${formData.introduction.description.replace(/<[^>]*>/g, '').length}`
//             : 'Characters: 0'
//           }
//         </div> */}
//       </div>

//       <div className="navigation-buttons">
//         <button onClick={prevStep} className="btn-secondary">
//           Previous
//         </button>
//         <button 
//           onClick={handleNext} 
//           className="btn-primary"
//           disabled={!isFormValid()}
//         >
//           Next
//         </button>
//       </div>
// import Editor from '../components/Editor'; // Adjust the import path as needed


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
//           newErrors.description = 'Description is required';
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
//       ? formData.introduction?.description || '' 
//       : e.target.value;

//     const newErrors = validateField(fieldName, value);
//     setErrors(newErrors);
//   };

//   // Handle title change
//   const handleTitleChange = (e) => {
//     const value = e.target.value;
//     updateFormData('introduction', { 
//       ...formData.introduction, 
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
//     updateFormData('introduction', { 
//       ...formData.introduction, 
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
//         Introduction
//       </Typography>

  

//       <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
//         <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//           Explain to your clients who you are, what services you provide, the value you bring, 
//           and any other information you want to share.
//         </Typography>

//         <TextField
//           fullWidth
//           label="Introduction Title"
//           value={formData.introduction?.title || ''}
//           onChange={handleTitleChange}
//           onBlur={handleBlur('title')}
//           error={touched.title && !!errors.title}
//           helperText={touched.title && errors.title}
//           placeholder="Enter introduction title"
//           required
//           margin="normal"
//           sx={{ mb: 3 }}
//         />

//         <FormControl fullWidth error={touched.description && !!errors.description}>
          
//           <Box sx={{ mt: 2, mb: 1 }}>
//             <Editor
//               initialContent={formData.introduction?.description || ''}
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
import React, { useState } from 'react';
import Editor from '../components/Editor';

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
          <label className="text-sm font-medium text-slate-700">Introduction Title *</label>
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

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Description</label>
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