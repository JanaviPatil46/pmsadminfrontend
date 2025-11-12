


import React, { useState,useRef,useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,Autocomplete,CircularProgress,
  Switch,
  Button,
  Paper,
  Card,
  CardContent,
  Alert,Chip,Checkbox,MenuItem,Menu,InputAdornment,IconButton,Popover
} from '@mui/material';
import { FaCaretUp, FaCaretDown,FaTimes ,FaSearch} from "react-icons/fa";
import { InfoOutlined } from '@mui/icons-material';





const GeneralStep = ({ formData, updateFormData, nextStep, stepErrors, setStepErrors }) => {
  const [touched, setTouched] = useState({});
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN || 'https://www.snptaxes.com';

  // Fetch team members data
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
        const response = await fetch(url);
        const data = await response.json();
        const options = data.map(user => ({
          value: user._id,
          label: user.username,
        }));
        setInternalOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team members:", error);
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, [LOGIN_API]);

  // Get selected users objects from stored IDs
  const getSelectedUsers = () => {
    if (!formData.general.teamMembers || formData.general.teamMembers.length === 0) {
      return [];
    }
    
    return formData.general.teamMembers.map(userId => {
      const user = internalOptions.find(opt => opt.value === userId);
      return user || { value: userId, label: `User ${userId}` };
    });
  };

  // Handle team member selection
  const handleTeamMembersChange = (event, newSelectedUsers) => {
    const selectedValues = newSelectedUsers.map(user => user.value);
    
    // Update form data
    updateFormData("general", { 
      teamMembers: selectedValues
    });
    
    console.log("Selected team members:", selectedValues);
  };

  // Handle input changes for other fields
  const handleInputChange = (field, value) => {
    updateFormData('general', { [field]: value });
    
    // Clear error when user starts typing
    if (value.trim() !== '' && stepErrors[field]) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleVisibilityChange = (field, value) => {
    updateFormData('general', { [field]: value });
  };

  // Step Card Component
  const StepCard = ({ title, description, checked, onChange, name }) => (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        borderColor: checked ? 'primary.main' : 'grey.300',
        borderWidth: checked ? 2 : 1,
        backgroundColor: checked ? 'primary.50' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: 1
        }
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={(e) => onChange(name, e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="h6" component="span" color="text.primary">
              {title}
            </Typography>
          }
          sx={{ width: '100%', mb: 1 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: 6 }}>
          <InfoOutlined 
            sx={{ 
              fontSize: 16, 
              color: 'text.secondary', 
              mr: 1, 
              mt: 0.25 
            }} 
          />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom 
        color="primary" 
        fontWeight="600"
        sx={{ mb: 4 }}
      >
        General Information
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Basic Details
        </Typography>
        


       

        <TextField
          fullWidth
          label="Template Name"
          value={formData.general.templateName || ''}
          onChange={(e) => handleInputChange('templateName', e.target.value)}
          onBlur={() => handleBlur('templateName')}
          error={!!stepErrors.templateName}
          helperText={stepErrors.templateName}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
 <TextField
          fullWidth
          label="Proposal Name"
          value={formData.general.proposalName || ''}
          onChange={(e) => handleInputChange('proposalName', e.target.value)}
          onBlur={() => handleBlur('proposalName')}
          error={!!stepErrors.proposalName}
          helperText={stepErrors.proposalName}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Team Members *
          </Typography>
          
          <Autocomplete
            multiple
            options={internalOptions}
            value={getSelectedUsers()}
            onChange={handleTeamMembersChange}
            loading={loading}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select team members..."
                variant="outlined"
                error={!!stepErrors.teamMembers}
                helperText={stepErrors.teamMembers || "Select team members who will be involved in this proposal"}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.label}
                  {...getTagProps({ index })}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    borderRadius: "12px",
                    height: "24px",
                  }}
                />
              ))
            }
            // renderOption={(props, option, { selected }) => (
            //   <li {...props}>
            //     <Checkbox
            //       checked={selected}
            //       sx={{ mr: 1 }}
            //     />
            //     <Typography variant="body2">{option.label}</Typography>
            //   </li>
            // )}
            renderOption={(props, option, { selected }) => (
  <Box 
    component="li" 
    {...props} 
    sx={{ display: 'flex', alignItems: 'center' }}
  >
    <Checkbox
      checked={selected}
      sx={{ mr: 1 }}
    />
    <Typography variant="body2">{option.label}</Typography>
  </Box>
)}
            sx={{
              '& .MuiOutlinedInput-root': {
                padding: '8px',
                minHeight: '40px',
              }
            }}
          />
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Configure Proposal Steps
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize which steps to include in your proposal. Each step helps communicate different aspects of your service to clients.
        </Typography>
        
        <FormGroup>
          <StepCard
            title="Introduction Step"
            description="Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share"
            checked={formData.general.introductionEnabled || false}
            onChange={handleVisibilityChange}
            name="introductionEnabled"
          />
          
          <StepCard
            title="Terms Step"
            description="Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed."
            checked={formData.general.termsEnabled || false}
            onChange={handleVisibilityChange}
            name="termsEnabled"
          />
          
          <StepCard
            title="Services & Invoices Step"
            description="Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically."
            checked={formData.general.servicesEnabled || false}
            onChange={handleVisibilityChange}
            name="servicesEnabled"
          />
        </FormGroup>
      </Paper>
    </Box>
  );
};
export default GeneralStep;