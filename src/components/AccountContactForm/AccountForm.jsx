// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setAccountData } from "../../redux/accountContactSlice";
// import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";

// export default function AccountForm({ onContinue }) {
//   const dispatch = useDispatch();
//   const { accountData } = useSelector((state) => state.accountContact);

//   const handleChange = (e) => {
//     dispatch(setAccountData({ [e.target.name]: e.target.value }));
//   };

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Account Form
//       </Typography>

//       <TextField
//         fullWidth
//         margin="normal"
//         label="Account Name"
//         name="accountName"
//         value={accountData.accountName}
//         onChange={handleChange}
//       />

//       <TextField
//         select
//         fullWidth
//         margin="normal"
//         label="Client Type"
//         name="clientType"
//         value={accountData.clientType}
//         onChange={handleChange}
//       >
//         <MenuItem value="Individual">Individual</MenuItem>
//         <MenuItem value="Company">Company</MenuItem>
//       </TextField>

//       {accountData.clientType === "Company" && (
//         <TextField
//           fullWidth
//           margin="normal"
//           label="Company Name"
//           name="companyName"
//           value={accountData.companyName}
//           onChange={handleChange}
//         />
//       )}

//       <Button variant="contained" sx={{ mt: 2 }} onClick={onContinue}>
//         Continue
//       </Button>
//     </Box>
//   );
// }

import React, { useEffect, useState ,useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountData } from "../../redux/accountContactSlice";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import countryList from "react-select-country-list";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown"
import TagsMultiSelectDropDown from "../../Templates/TagsMultiSelectDropDown"
export default function AccountForm({ onContinue }) {
  const dispatch = useDispatch();
  const { accountData } = useSelector((state) => state.accountContact);
console.log("")
  const [teamMembers, setTeamMembers] = useState([]);
  const [tags, setTags] = useState([]);
  const [folderTemp, setFolderTemp] = useState([]);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  // const handleChange = (e) => {
  //   dispatch(setAccountData({ [e.target.name]: e.target.value }));
  // };
 const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    dispatch(setAccountData({ [name]: value }));
  };
  // Fetch Team Members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch(
          `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
        );
        const data = await res.json();
        setTeamMembers(
          data.map((user) => ({
            value: user._id,
            label: user.username,
          }))
        );
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };
    fetchTeamMembers();
  }, [LOGIN_API]);
  useEffect(() => {
    const fetchFolderTemps = async () => {
      try {
        // const res = await fetch(`${API_KEY}/foldertemp/folder`);
        const res = await fetch(`https://www.snptaxes.com/api/foldertemp/templatelist`);
        const data = await res.json();
        setFolderTemp(
          data.folderTemplates.map((folder) => ({
            value: folder._id,
            label: folder.templatename,
          }))
        );
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };
    fetchFolderTemps();
  }, [API_KEY]);
  // Fetch Tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${TAGS_API}/tags/`);
        const data = await res.json();
        setTags(
          data.tags.map((tag) => ({
            value: tag._id,
            label: tag.tagName,
            colour: tag.tagColour,
          }))
        );
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, [TAGS_API]);

// Clear error for Autocomplete fields
  const handleAutocompleteChange = (field, newValue) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    dispatch(setAccountData({ [field]: newValue }));
  };
  // Get country list once (memoized)
  const options = useMemo(() => countryList().getData(), []);
   const [errors, setErrors] = useState({});

  // Validation function
  const validateAccountForm = () => {
    const newErrors = {};

    // Account Name validation
    if (!accountData.accountName?.trim()) {
      newErrors.accountName = 'Account Name is required';
    }

    // Client Type validation
    if (!accountData.clientType) {
      newErrors.clientType = 'Client Type is required';
    }

    // Company Name validation (if client type is Company)
    if (accountData.clientType === 'Company' && !accountData.companyName?.trim()) {
      newErrors.companyName = 'Company Name is required for Company clients';
    }

    // // Folder Template validation
    // if (!accountData.folderTemp) {
    //   newErrors.folderTemp = 'Folder Template is required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateAccountForm()) {
      onContinue();
    }
  };

  return (
    <Box>
    
      <FormControl component="fieldset" margin="normal" fullWidth>
        <Typography sx={{ color: "black", fontSize: "20px" }}>
          Client Type
        </Typography>
        <RadioGroup
          row // remove this if you want them vertically stacked
          name="clientType"
          value={accountData.clientType || ""}
          onChange={handleChange}
        >
          <FormControlLabel
            value="Individual"
            control={<Radio />}
            label="Individual"
          />
          <FormControlLabel
            value="Company"
            control={<Radio />}
            label="Company"
          />
        </RadioGroup>
      </FormControl>

      <FormLabel component="legend" sx={{ color: "black", fontSize: "20px" }}>
        Account Info
      </FormLabel>
      <TextField
        fullWidth
        margin="normal"
        label="Account Name"
        name="accountName"
        size="small"
        value={accountData.accountName || ""}
        onChange={handleChange}
         error={!!errors.accountName}
        helperText={errors.accountName}
        required
      />

   

      {accountData.clientType === "Company" && (
        <TextField
          fullWidth
          margin="normal"
          size="small"
          label="Company Name"
          name="companyName"
          value={accountData.companyName || ""}
          onChange={handleChange}
           error={!!errors.companyName}
          helperText={errors.companyName}
          required
        />
      )}

      {/* Team Members */}
      {/* <Autocomplete
        multiple
        options={teamMembers}
        getOptionLabel={(option) => option.label}
        value={accountData.teamMembers || []}
        onChange={(e, newValue) =>
          dispatch(setAccountData({ teamMembers: newValue }))
        }
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            label="Select Team Members"
            size="small"
          />
        )}
      /> */}
<MultiSelectDropdown
  value={accountData.teamMembers || []}
  onChange={(newValue) => dispatch(setAccountData({ teamMembers: newValue }))}
  options={teamMembers} // You can omit this prop to let it fetch internally
  placeholder="Select Team Members"
  width="100%"
/>

      {/* Tags with colored chips */}
      {/* Tags with colored chips + colored dropdown options */}
      {/* <Autocomplete
        multiple
        options={tags}
        getOptionLabel={(option) => option.label}
        value={accountData.tags || []}
        onChange={(e, newValue) => dispatch(setAccountData({ tags: newValue }))}
        filterSelectedOptions
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              sx={{
                backgroundColor: option.colour,
                color: "#fff",
                // m:1.5,
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "12px",
              }}
            />
          ))
        }
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              backgroundColor: option.colour,
              color: "#fff",
              borderRadius: "15px",
              px: 1,
              py: 0.5,
              my: 0.5,
              width: "fit-content",
              fontSize: "10px",
              cursor: "pointer",
            }}
          >
            {option.label}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            label="Select Tags"
            size="small"
          />
        )}
      /> */}
      <TagsMultiSelectDropDown
  value={accountData.tags || []}
  onChange={(newValue) => dispatch(setAccountData({ tags: newValue }))}
  options={tags} // Pass if tags are already loaded; else remove to fetch internally
  placeholder="Select tags"
  // width="100%"
/>

<Box mt={1}>
{/* Folder Template */}
      <Autocomplete
        options={folderTemp}
        getOptionLabel={(option) => option.label}
        value={accountData.folderTemp || null} // full object, like tags
        // onChange={(e, newValue) =>
        //   dispatch(setAccountData({ folderTemp: newValue || null }))
        // }
         onChange={(e, newValue) => handleAutocompleteChange('folderTemp', newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            label="Select Folder Template"
            size="small"
            //  error={!!errors.folderTemp}
            // helperText={errors.folderTemp}
            required
          />
        )}
      />
</Box>
      

     {accountData.clientType === "Company" && (
  <Box>
    <FormLabel
      component="legend"
      sx={{ color: "black", fontSize: "20px" }}
    >
      Address
    </FormLabel>

    {/* Country */}
    <Autocomplete
    fullWidth
      options={options}
      getOptionLabel={(option) => option.label}
      value={accountData.country || null}
      onChange={(event, newValue) =>
        dispatch(setAccountData({ country: newValue }))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          margin="normal"
          label="Select Country"
          size="small"
        />
      )}
      sx={{  mt: 1 }}
    />

    {/* Street Address */}
    <TextField
      fullWidth
      margin="normal"
      size="small"
      label="Street Address"
      name="streetAdd"
      value={accountData.streetAdd || ""}
      onChange={handleChange}
    />

    {/* City */}
    <TextField
      fullWidth
      margin="normal"
      size="small"
      label="City"
      name="city"
      value={accountData.city || ""}
      onChange={handleChange}
    />

    {/* State */}
    <TextField
      fullWidth
      margin="normal"
      size="small"
      label="State"
      name="state"
      value={accountData.state || ""}
      onChange={handleChange}
    />

    {/* Zip Code */}
    <TextField
      fullWidth
      margin="normal"
      size="small"
      label="Zip Code"
      name="zipCode"
      value={accountData.zipCode || ""}
      onChange={handleChange}
    />
  </Box>
)}


      <Button variant="contained" sx={{ mt: 2 }} onClick={handleContinue}>
        Continue
      </Button>
    </Box>
  );
}
