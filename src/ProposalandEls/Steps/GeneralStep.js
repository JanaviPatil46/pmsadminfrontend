import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  Switch,
  Button,
  Paper,
  Card,
  CardContent,
  Alert,
  Chip,
  Checkbox,
  MenuItem,
  Menu,
  InputAdornment,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FaCaretUp, FaCaretDown, FaTimes, FaSearch } from "react-icons/fa";
import { InfoOutlined } from "@mui/icons-material";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown"
const GeneralStep = ({
  formData,
  updateFormData,
  nextStep,
  stepErrors,
  setStepErrors,
}) => {
  const [touched, setTouched] = useState({});
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  // === SHORTCODES States ===
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  useEffect(() => {
    const accountShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
      { title: "Date Shortcodes", isBold: true },
      {
        title: "Current day full date",
        isBold: false,
        value: "CURRENT_DAY_FULL_DATE",
      },
      {
        title: "Current day number",
        isBold: false,
        value: "CURRENT_DAY_NUMBER",
      },
      { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
      { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
      {
        title: "Current month number",
        isBold: false,
        value: "CURRENT_MONTH_NUMBER",
      },
      {
        title: "Current month name",
        isBold: false,
        value: "CURRENT_MONTH_NAME",
      },
      { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
      { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
      {
        title: "Last day full date",
        isBold: false,
        value: "LAST_DAY_FULL_DATE",
      },
      { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
      { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
      { title: "Last week", isBold: false, value: "LAST_WEEK" },
      { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
      { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
      { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
      { title: "Last year", isBold: false, value: "LAST_YEAR" },
      {
        title: "Next day full date",
        isBold: false,
        value: "NEXT_DAY_FULL_DATE",
      },
      { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
      { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
      { title: "Next week", isBold: false, value: "NEXT_WEEK" },
      { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
      { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
      { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
      { title: "Next year", isBold: false, value: "NEXT_YEAR" },
    ];
    setShortcuts(accountShortcuts);
    setFilteredShortcuts(accountShortcuts);
  }, []);

  const LOGIN_API =
    process.env.REACT_APP_USER_LOGIN || "https://www.snptaxes.com";

  // Fetch team members data
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
        const response = await fetch(url);
        const data = await response.json();
        const options = data.map((user) => ({
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
    if (
      !formData.general.teamMembers ||
      formData.general.teamMembers.length === 0
    ) {
      return [];
    }

    return formData.general.teamMembers.map((userId) => {
      const user = internalOptions.find((opt) => opt.value === userId);
      return user || { value: userId, label: `User ${userId}` };
    });
  };

  // Handle team member selection
  const handleTeamMembersChange = ( newSelectedUsers) => {
    const selectedValues = newSelectedUsers.map((user) => user.value);

    // Update form data
    updateFormData("general", {
      teamMembers: selectedValues,
    });

    console.log("Selected team members:", selectedValues);
  };

  // Handle input changes for other fields
  const handleInputChange = (field, value) => {
    updateFormData("general", { [field]: value });

    // Clear error when user starts typing
    if (value.trim() !== "" && stepErrors[field]) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleVisibilityChange = (field, value) => {
    updateFormData("general", { [field]: value });
  };
  // Toggle dropdown
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  // Track cursor position inside Proposal Name
  const handleTextFieldClick = () => {
    if (textFieldRef.current) {
      setCursorPosition(textFieldRef.current.selectionStart);
    }
  };

  // Insert shortcode at cursor position
  const handleAddShortcut = (shortcutValue) => {
    const current = formData.general.proposalName || "";

    const newValue =
      current.slice(0, cursorPosition) +
      `[${shortcutValue}]` +
      current.slice(cursorPosition);

    updateFormData("general", { proposalName: newValue });

    setTimeout(() => {
      if (textFieldRef.current) {
        const newCursor = cursorPosition + shortcutValue.length + 2;
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(newCursor, newCursor);
        setCursorPosition(newCursor);
      }
    }, 0);

    setShowDropdown(false);
  };

  // Step Card Component
  const StepCard = ({ title, description, checked, onChange, name }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderColor: checked ? "primary.main" : "grey.300",
        borderWidth: checked ? 2 : 1,
        backgroundColor: checked ? "primary.50" : "background.paper",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
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
          sx={{ width: "100%", mb: 1 }}
        />
        <Box sx={{ display: "flex", alignItems: "flex-start", ml: 6 }}>
          <InfoOutlined
            sx={{
              fontSize: 16,
              color: "text.secondary",
              mr: 1,
              mt: 0.25,
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

      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: "grey.50" }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Basic Details
        </Typography>

        <TextField
          fullWidth
          label="Template Name"
          value={formData.general.templateName || ""}
          onChange={(e) => handleInputChange("templateName", e.target.value)}
          onBlur={() => handleBlur("templateName")}
          error={!!stepErrors.templateName}
          helperText={stepErrors.templateName}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
       
        <TextField
          fullWidth
          // label="Proposal Name"
          label="Proposal name (visible to clients)"
          value={formData.general.proposalName || ""}
          onChange={(e) => {
            handleInputChange("proposalName", e.target.value);
            handleTextFieldClick();
          }}
          onClick={handleTextFieldClick}
          inputRef={textFieldRef}
          margin="normal"
          required
          sx={{ mb: 2 }}
          error={!!stepErrors.proposalName}
          helperText={stepErrors.proposalName}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={toggleDropdown}
          sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
            borderRadius: "15px",
            mt: 1,
          }}
        >
          Add Shortcode
        </Button>

        <Popover
          open={showDropdown}
          anchorEl={anchorEl}
          onClose={handleCloseDropdown}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Box>
            <List
              sx={{
                width: "300px",
                height: "300px",
                overflow: "auto",
                cursor: "pointer",
              }}
            >
              {filteredShortcuts.map((shortcut, index) => (
                <ListItem
                  key={index}
                  onClick={() =>
                    !shortcut.isBold && handleAddShortcut(shortcut.value)
                  }
                  sx={{
                    backgroundColor: shortcut.isBold
                      ? "grey.100"
                      : "transparent",
                    fontWeight: shortcut.isBold ? "bold" : "normal",
                    "&:hover": shortcut.isBold
                      ? {}
                      : { backgroundColor: "grey.200" },
                  }}
                >
                  <ListItemText
                    primary={shortcut.title}
                    primaryTypographyProps={{
                      style: {
                        fontWeight: shortcut.isBold ? "bold" : "normal",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Team Members *
          </Typography>

          {/* <Autocomplete
            multiple
            options={internalOptions}
            value={getSelectedUsers()}
            onChange={handleTeamMembersChange}
            loading={loading}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select team members..."
                variant="outlined"
                error={!!stepErrors.teamMembers}
                helperText={
                  stepErrors.teamMembers ||
                  "Select team members who will be involved in this proposal"
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
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
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox checked={selected} sx={{ mr: 1 }} />
                <Typography variant="body2">{option.label}</Typography>
              </Box>
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: "8px",
                minHeight: "40px",
              },
            }}
          /> */}
           <MultiSelectDropdown
                          value={getSelectedUsers()}
                          onChange={handleTeamMembersChange}
                          placeholder="Team Member"
                        />
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider" }}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
          Configure Proposal Steps
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize which steps to include in your proposal. Each step helps
          communicate different aspects of your service to clients.
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
