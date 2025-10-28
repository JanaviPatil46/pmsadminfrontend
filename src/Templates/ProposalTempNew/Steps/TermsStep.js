

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Alert,
  FormControl,
  FormHelperText,
  InputLabel
} from '@mui/material';

import Editor from '../components/Editor'; // Adjust the import path as needed

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
    <Box>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="600" sx={{ mb: 4 }}>
        Terms & Conditions
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Engagement letter or contractual agreement that outlines the terms of the relationship 
          between your firm and clients. The section title can be renamed.
        </Typography>

        <TextField
          fullWidth
          label="Terms Title"
          value={formData.terms?.title || ''}
          onChange={handleTitleChange}
          onBlur={() => handleBlur('title')}
          error={!!stepErrors.title}
          helperText={stepErrors.title}
          placeholder="Enter terms title"
          required
          margin="normal"
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth error={!!stepErrors.description}>
          <Box sx={{ mt: 2, mb: 1 }}>
            <Editor
              initialContent={formData.terms?.description || ''}
              onChange={handleDescriptionChange}
              onBlur={() => handleBlur('description')}
            />
          </Box>
          {stepErrors.description && (
            <FormHelperText error>{stepErrors.description}</FormHelperText>
          )}
        </FormControl>
      </Paper>
    </Box>
  );
};

export default TermsStep;