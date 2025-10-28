import React, { useState,useEffect,useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Card,
  CardContent,
  Alert,Popover,List,ListItem,ListItemText
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import MultiSelectDropdown from "../../MultiSelectDropdown";


// const GeneralStep = ({
//   formData,
//   updateFormData,
//   nextStep,
//   stepErrors,
//   setStepErrors,
// }) => {
//   const [touched, setTouched] = useState({});

//   const handleInputChange = (field, value) => {
//     updateFormData("general", { [field]: value });

//     // Clear error when user starts typing
//     if (value.trim() !== "" && stepErrors[field]) {
//       setStepErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//   };

//   const handleVisibilityChange = (field, value) => {
//     updateFormData("general", { [field]: value });
//   };

//   const StepCard = ({ title, description, checked, onChange, name }) => (
//     <Card
//       variant="outlined"
//       sx={{
//         mb: 2,
//         borderColor: checked ? "primary.main" : "grey.300",
//         borderWidth: checked ? 2 : 1,
//         backgroundColor: checked ? "primary.50" : "background.paper",
//         transition: "all 0.2s ease-in-out",
//         "&:hover": {
//           borderColor: "primary.light",
//           boxShadow: 1,
//         },
//       }}
//     >
//       <CardContent sx={{ "&:last-child": { pb: 2 } }}>
//         <FormControlLabel
//           control={
//             <Switch
//               checked={checked}
//               onChange={(e) => onChange(name, e.target.checked)}
//               color="primary"
//             />
//           }
//           label={
//             <Typography variant="h6" component="span" color="text.primary">
//               {title}
//             </Typography>
//           }
//           sx={{ width: "100%", mb: 1 }}
//         />
//         <Box sx={{ display: "flex", alignItems: "flex-start", ml: 6 }}>
//           <InfoOutlined
//             sx={{
//               fontSize: 16,
//               color: "text.secondary",
//               mr: 1,
//               mt: 0.25,
//             }}
//           />
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{ lineHeight: 1.5 }}
//           >
//             {description}
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );
  
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
// const [shortcuts, setShortcuts] = useState([]);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const [selectedOption, setSelectedOption] = useState("contacts");
//    const toggleDropdown = (event) => {
//     setAnchorEl(event.currentTarget);
//     setShowDropdown(!showDropdown);
//   };
//   const handleAddShortcut = (shortcut) => {
//     setProposalName((prevText) => {
//       const newText =
//         prevText.slice(0, cursorPosition) +
//         `[${shortcut}]` +
//         prevText.slice(cursorPosition);
//       return newText;
//     });

//     setTimeout(() => {
//       if (textFieldRef.current) {
//         textFieldRef.current.focus();
//         textFieldRef.current.setSelectionRange(
//           cursorPosition + shortcut.length + 2,
//           cursorPosition + shortcut.length + 2
//         );
//       }
//     }, 0);

//     setShowDropdown(false);
//   };

//    useEffect(() => {
//     // Simulate filtered shortcuts based on some logic (e.g., search)
//     setFilteredShortcuts(
//       shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
//     );
//   }, [shortcuts]);
//   useEffect(() => {
//   if (selectedOption === "contacts" || selectedOption === "account") {
//     const accountShortcuts = [
//       { title: "Account Shortcodes", isBold: true },
//       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//       // { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
//       { title: "Date Shortcodes", isBold: true },
//       { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
//       { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
//       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//       { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
//       { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
//       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//       { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
//       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//       { title: "Last week", isBold: false, value: "LAST_WEEK" },
//       { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
//       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//       { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
//       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//       { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
//       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//     ];
//     setShortcuts(accountShortcuts);
//   }
// }, [selectedOption]);

//   const handleCloseDropdown = () => {
//     setAnchorEl(null);
//     setShowDropdown(false);
//   };
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const textFieldRef = useRef(null);
//   return (
//     <Box>
//       <Typography
//         variant="h4"
//         gutterBottom
//         color="primary"
//         fontWeight="600"
//         sx={{ mb: 4 }}
//       >
//         General Information
//       </Typography>

//       <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: "grey.50" }}>
//         <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
//           Basic Details
//         </Typography>

// <Box><Typography>Template name (not visible to clients)</Typography>
//         <TextField
//         size="small"
//           fullWidth
//           placeholder="Template name (not visible to clients)"
//           value={formData.general.templateName || ""}
//           onChange={(e) => handleInputChange("templateName", e.target.value)}
//           onBlur={() => handleBlur("templateName")}
//           error={!!stepErrors.templateName}
//           helperText={stepErrors.templateName}
//           margin="normal"
//           required
//         /></Box>
//         <Box>
//           <Typography>Proposal name (visible to clients)</Typography>
// <TextField
// size="small"
//           fullWidth
//           placeholder="Proposal name (visible to clients)"
//           value={formData.general.proposalName || ""}
//           onChange={(e) => handleInputChange("proposalName", e.target.value)}
//           onBlur={() => handleBlur("proposalName")}
//           error={!!stepErrors.proposalName}
//           helperText={stepErrors.proposalName}
//           margin="normal"
//           required
//           sx={{ mb: 2 }}
//         />

//          <Box>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={toggleDropdown}
//                         sx={{
//                           backgroundColor: "var(--color-save-btn)", // Normal background

//                           "&:hover": {
//                             backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//                           },
//                           borderRadius: "15px",
//                           mt: 2,
//                         }}
//                       >
//                         Add Shortcode
//                       </Button>

//                       <Popover
//                         open={showDropdown}
//                         anchorEl={anchorEl}
//                         onClose={handleCloseDropdown}
//                         anchorOrigin={{
//                           vertical: "bottom",
//                           horizontal: "left",
//                         }}
//                         transformOrigin={{
//                           vertical: "top",
//                           horizontal: "left",
//                         }}
//                       >
//                         <Box>
//                           <List
//                             className="dropdown-list"
//                             sx={{
//                               width: "300px",
//                               height: "300px",
//                               cursor: "pointer",
//                             }}
//                           >
//                             {filteredShortcuts.map((shortcut, index) => (
//                               <ListItem
//                                 key={index}
//                                 onClick={() =>
//                                   handleAddShortcut(shortcut.value)
//                                 }
//                               >
//                                 <ListItemText
//                                   primary={shortcut.title}
//                                   primaryTypographyProps={{
//                                     style: {
//                                       fontWeight: shortcut.isBold
//                                         ? "bold"
//                                         : "normal",
//                                     },
//                                   }}
//                                 />
//                               </ListItem>
//                             ))}
//                           </List>
//                         </Box>
//                       </Popover>
//                     </Box>
//         </Box>
        
        
        
//       </Paper>

//       <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider" }}>
//         <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
//           Configure Proposal Steps
//         </Typography>

//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           Customize which steps to include in your proposal. Each step helps
//           communicate different aspects of your service to clients.
//         </Typography>

//         <FormGroup>
//           <StepCard
//             title="Introduction Step"
//             description="Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share"
//             checked={formData.general.introductionEnabled || false}
//             onChange={handleVisibilityChange}
//             name="introductionEnabled"
//           />

//           <StepCard
//             title="Terms Step"
//             description="Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed."
//             checked={formData.general.termsEnabled || false}
//             onChange={handleVisibilityChange}
//             name="termsEnabled"
//           />

//           <StepCard
//             title="Services & Invoices Step"
//             description="Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically."
//             checked={formData.general.servicesEnabled || false}
//             onChange={handleVisibilityChange}
//             name="servicesEnabled"
//           />
//         </FormGroup>
//       </Paper>
//     </Box>
//   );
// };
const GeneralStep = ({
  formData,
  updateFormData,
  nextStep,
  stepErrors,
  setStepErrors,
}) => {
  const [touched, setTouched] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
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

  const handleTextFieldClick = () => {
    if (textFieldRef.current) {
      const position = textFieldRef.current.selectionStart;
      setCursorPosition(position);
    }
  };

  const handleTextFieldChange = (e) => {
    handleInputChange("proposalName", e.target.value);
    
    // Update cursor position
    if (textFieldRef.current) {
      const position = textFieldRef.current.selectionStart;
      setCursorPosition(position);
    }
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
    
    // Update form data with selected team members
    updateFormData("general", { 
      teamMembers: selectedValues,
      selectedTeamMembers: newSelectedUsers 
    });
  };
  const handleAddShortcut = (shortcut) => {
    const currentProposalName = formData.general.proposalName || "";
    
    const newProposalName =
      currentProposalName.slice(0, cursorPosition) +
      `[${shortcut}]` +
      currentProposalName.slice(cursorPosition);

    // Update the form data with the new proposal name containing the shortcut
    handleInputChange("proposalName", newProposalName);

    // Set focus and cursor position after the inserted shortcut
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        const newCursorPosition = cursorPosition + shortcut.length + 2; // +2 for the brackets []
        textFieldRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        setCursorPosition(newCursorPosition);
      }
    }, 0);

    setShowDropdown(false);
  };

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    if (selectedOption === "contacts" || selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);
 // Initialize selectedUser from formData if it exists
  useEffect(() => {
    if (formData.general.selectedTeamMembers) {
      setSelectedUser(formData.general.selectedTeamMembers);
    }
  }, [formData.general.selectedTeamMembers]);
  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

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

        <Box>
          <Typography>Template name (not visible to clients)</Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Template name (not visible to clients)"
            value={formData.general.templateName || ""}
            onChange={(e) => handleInputChange("templateName", e.target.value)}
            onBlur={() => handleBlur("templateName")}
            error={!!stepErrors.templateName}
            helperText={stepErrors.templateName}
            margin="normal"
            required
          />
        </Box>
        
        <Box>
          <Typography>Proposal name (visible to clients)</Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Proposal name (visible to clients)"
            value={formData.general.proposalName || ""}
            onChange={handleTextFieldChange}
            onBlur={() => handleBlur("proposalName")}
            onClick={handleTextFieldClick}
            onKeyUp={handleTextFieldClick}
            error={!!stepErrors.proposalName}
            helperText={stepErrors.proposalName}
            margin="normal"
            required
            sx={{ mb: 2 }}
            inputRef={textFieldRef}
          />

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleDropdown}
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
                },
                borderRadius: "15px",
                mt: 2,
              }}
            >
              Add Shortcode
            </Button>

            <Popover
              open={showDropdown}
              anchorEl={anchorEl}
              onClose={handleCloseDropdown}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box>
                <List
                  className="dropdown-list"
                  sx={{
                    width: "300px",
                    height: "300px",
                    cursor: "pointer",
                    overflow: "auto",
                  }}
                >
                  {filteredShortcuts.map((shortcut, index) => (
                    <ListItem
                      key={index}
                      onClick={() => handleAddShortcut(shortcut.value)}
                      sx={{
                        fontWeight: shortcut.isBold ? "bold" : "normal",
                        backgroundColor: shortcut.isBold ? "grey.100" : "transparent",
                        "&:hover": {
                          backgroundColor: "grey.200",
                        },
                      }}
                    >
                      <ListItemText primary={shortcut.title}  primaryTypographyProps={{
                                    style: {
                                      fontWeight: shortcut.isBold
                                        ? "bold"
                                        : "normal",
                                    },
                                  }}/>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Popover>
          </Box>
        </Box>

         <Box sx={{ mt: 2, minWidth: 200 }}>
              <MultiSelectDropdown
                value={selectedUser}
                onChange={handleUserChange}
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
