import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Switch,
  FormControlLabel,
  OutlinedInput,
} from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { IoMdArrowRoundBack } from 'react-icons/io';

const AutomationDrawer = ({
  open,
  mode,
  automationData,
  onSave,
  onClose,
  templates,
  tags,
  statusOptions,
  users,
}) => {
  const [formData, setFormData] = useState({
    type: '',
    template: null,
    addTags: [],
    removeTags: [],
    addAssignees: [],
    removeAssignees: [],
    visibilityForClient: false,
    selectedClientStatus: null,
    statusDescription: '',
    conditions: [],
    reminderEnabled: false,
    daysUntilNextReminder: '',
    noOfReminders: '',
  });

  const [currentStep, setCurrentStep] = useState('type'); // 'type', 'config', 'conditions'

  // Initialize form when drawer opens or data changes
  useEffect(() => {
    if (open && mode === 'edit' && automationData) {
      setFormData(automationData);
    } else if (open && mode === 'add') {
      setFormData({
        type: '',
        template: null,
        addTags: [],
        removeTags: [],
        addAssignees: [],
        removeAssignees: [],
        visibilityForClient: false,
        selectedClientStatus: null,
        statusDescription: '',
        conditions: [],
        reminderEnabled: false,
        daysUntilNextReminder: '',
        noOfReminders: '',
      });
      setCurrentStep('type');
    }
  }, [open, mode, automationData]);

  const automationTypes = [
    'Send Email',
    'Send Invoice',
    'Send Proposal/Estimate',
    'Create Organizer',
    'Apply Folder Template',
    'Update Account Tags',
    'Update Job Assignees',
    'Create Task',
    'Send Message',
    'Update Client-facing Job Status',
  ];

  const handleSave = () => {
    // Validate based on automation type
    if (!formData.type) {
      alert('Please select automation type');
      return;
    }

    if (requiresTemplate() && !formData.template) {
      alert('Please select a template');
      return;
    }

    onSave(formData);
  };

  const requiresTemplate = () => {
    const templateRequiredTypes = [
      'Send Email',
      'Send Invoice',
      'Send Proposal/Estimate',
      'Create Organizer',
      'Apply Folder Template',
      'Create Task',
      'Send Message',
    ];
    return templateRequiredTypes.includes(formData.type);
  };

  const renderTypeSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Automation Type
      </Typography>
      <Grid container spacing={1}>
        {automationTypes.map((type) => (
          <Grid item xs={6} key={type}>
            <Button
              variant={formData.type === type ? 'contained' : 'outlined'}
              fullWidth
              onClick={() => {
                setFormData(prev => ({ ...prev, type }));
                setCurrentStep('config');
              }}
              sx={{ height: '60px', whiteSpace: 'normal' }}
            >
              {type}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderConfiguration = () => {
    switch (formData.type) {
      case 'Update Account Tags':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Update Account Tags
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Add Tags</InputLabel>
                  <Select
                    multiple
                    value={formData.addTags}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      addTags: e.target.value 
                    }))}
                    input={<OutlinedInput label="Add Tags" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((tagId) => {
                          const tag = tags.find(t => t._id === tagId);
                          return tag ? (
                            <Chip
                              key={tagId}
                              label={tag.tagName}
                              size="small"
                              sx={{ backgroundColor: tag.tagColour, color: 'white' }}
                            />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag._id} value={tag._id}>
                        <Chip
                          label={tag.tagName}
                          size="small"
                          sx={{ backgroundColor: tag.tagColour, color: 'white' }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Remove Tags</InputLabel>
                  <Select
                    multiple
                    value={formData.removeTags}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      removeTags: e.target.value 
                    }))}
                    input={<OutlinedInput label="Remove Tags" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((tagId) => {
                          const tag = tags.find(t => t._id === tagId);
                          return tag ? (
                            <Chip
                              key={tagId}
                              label={tag.tagName}
                              size="small"
                              sx={{ backgroundColor: tag.tagColour, color: 'white' }}
                            />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag._id} value={tag._id}>
                        <Chip
                          label={tag.tagName}
                          size="small"
                          sx={{ backgroundColor: tag.tagColour, color: 'white' }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 'Update Job Assignees':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Update Job Assignees
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Add Assignees</InputLabel>
                  <Select
                    multiple
                    value={formData.addAssignees}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      addAssignees: e.target.value 
                    }))}
                    input={<OutlinedInput label="Add Assignees" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((userId) => {
                          const user = users.find(u => u._id === userId);
                          return user ? (
                            <Chip key={userId} label={user.name} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Remove Assignees</InputLabel>
                  <Select
                    multiple
                    value={formData.removeAssignees}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      removeAssignees: e.target.value 
                    }))}
                    input={<OutlinedInput label="Remove Assignees" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((userId) => {
                          const user = users.find(u => u._id === userId);
                          return user ? (
                            <Chip key={userId} label={user.name} size="small" />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 'Update Client-facing Job Status':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Update Client-facing Job Status
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.visibilityForClient}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    visibilityForClient: e.target.checked 
                  }))}
                />
              }
              label="Show status to client"
            />
            
            {formData.visibilityForClient && (
              <Box mt={2}>
                <Autocomplete
                  options={statusOptions}
                  getOptionLabel={(option) => option.label}
                  value={formData.selectedClientStatus}
                  onChange={(event, newValue) => setFormData(prev => ({ 
                    ...prev, 
                    selectedClientStatus: newValue 
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Status" size="small" />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: option.color,
                          }}
                        />
                        {option.label}
                      </Box>
                    </li>
                  )}
                />
                
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Status Description"
                  value={formData.statusDescription}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    statusDescription: e.target.value 
                  }))}
                  sx={{ mt: 2 }}
                  helperText={`${formData.statusDescription.length}/500`}
                />
              </Box>
            )}
          </Box>
        );

      default:
        if (requiresTemplate()) {
          return (
            <Box>
              <Typography variant="h6" gutterBottom>
                {formData.type}
              </Typography>
              
              <Autocomplete
                options={templates}
                getOptionLabel={(option) => option.name}
                value={formData.template}
                onChange={(event, newValue) => setFormData(prev => ({ 
                  ...prev, 
                  template: newValue 
                }))}
                renderInput={(params) => (
                  <TextField {...params} label="Select Template" size="small" />
                )}
              />
              
              {(formData.type === 'Send Message') && (
                <Box mt={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.reminderEnabled}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          reminderEnabled: e.target.checked 
                        }))}
                      />
                    }
                    label="Enable Reminders"
                  />
                  
                  {formData.reminderEnabled && (
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Days Until Next Reminder"
                          type="number"
                          value={formData.daysUntilNextReminder}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            daysUntilNextReminder: e.target.value 
                          }))}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Number of Reminders"
                          type="number"
                          value={formData.noOfReminders}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            noOfReminders: e.target.value 
                          }))}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>
              )}
            </Box>
          );
        }
        return null;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 500 } }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <Typography variant="h6">
          {mode === 'add' ? 'Add Automation' : 'Edit Automation'}
        </Typography>
        <IconButton onClick={onClose}>
          <RxCross2 />
        </IconButton>
      </Box>

      {/* Content */}
      <Box p={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {currentStep === 'type' && renderTypeSelection()}
        
        {currentStep === 'config' && (
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <IconButton onClick={() => setCurrentStep('type')} size="small">
                <IoMdArrowRoundBack />
              </IconButton>
              <Typography variant="body2">Back to types</Typography>
            </Box>
            
            {renderConfiguration()}
          </Box>
        )}

        {/* Action Buttons */}
        <Box mt="auto" pt={2} display="flex" gap={1}>
          {currentStep === 'config' && (
            <Button
              variant="outlined"
              onClick={() => setCurrentStep('type')}
              fullWidth
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSave}
            fullWidth
            disabled={currentStep === 'type' || (requiresTemplate() && !formData.template)}
          >
            {mode === 'add' ? 'Add Automation' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AutomationDrawer;