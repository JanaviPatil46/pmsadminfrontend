

// import React,{useState,useEffect,useMemo} from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setAccountData } from "../redux/accountContactSlice";
// import {Autocomplete, FormLabel, Box, Button, TextField, Typography,FormControl,Radio,FormControlLabel,RadioGroup } from "@mui/material";

// import countryList from "react-select-country-list";
// import MultiSelectDropdown from "../Templates/MultiSelectDropdown"
// import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown"

// export default function AccountForm({ onContinue }) {
//   const dispatch = useDispatch();
//   const { accountData } = useSelector((state) => state.accountContact);
//    console.log("accountdata",accountData)
//   const [errors, setErrors] = useState({});
//   const handleChange = (e) => {
//     dispatch(setAccountData({ [e.target.name]: e.target.value }));
//   };
//   const [teamMembers, setTeamMembers] = useState([]);
//     const [tags, setTags] = useState([]);
//     const [folderTemp, setFolderTemp] = useState([]);
//     const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//     const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//     const API_KEY = process.env.REACT_APP_FOLDER_URL;
    
//  // Fetch Team Members
//   useEffect(() => {
//     const fetchTeamMembers = async () => {
//       try {
//         const res = await fetch(
//           `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
//         );
//         const data = await res.json();
//         setTeamMembers(
//           data.map((user) => ({
//             value: user._id,
//             label: user.username,
//           }))
//         );
//       } catch (err) {
//         console.error("Error fetching team members:", err);
//       }
//     };
//     fetchTeamMembers();
//   }, []);
//   useEffect(() => {
//     const fetchFolderTemps = async () => {
//       try {
//         // const res = await fetch(`${API_KEY}/foldertemp/folder`);
//         const res = await fetch(`https://www.snptaxes.com/api/foldertemp/templatelist`);
//         const data = await res.json();
//         setFolderTemp(
//           data.folderTemplates.map((folder) => ({
//             value: folder._id,
//             label: folder.templatename,
//           }))
//         );
//       } catch (err) {
//         console.error("Error fetching folders:", err);
//       }
//     };
//     fetchFolderTemps();
//   }, []);
//   // Fetch Tags
//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const res = await fetch(`${TAGS_API}/tags/`);
//         const data = await res.json();
//         setTags(
//           data.tags.map((tag) => ({
//             value: tag._id,
//             label: tag.tagName,
//             colour: tag.tagColour,
//           }))
//         );
//       } catch (err) {
//         console.error("Error fetching tags:", err);
//       }
//     };
//     fetchTags();
//   }, []);
//   const handleAutocompleteChange = (field, newValue) => {
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//     dispatch(setAccountData({ [field]: newValue }));
//   };
  
//    const options = useMemo(() => countryList().getData(), []);
//   return (
//     <Box>

//       <FormControl component="fieldset" margin="normal" fullWidth>
//         <Typography sx={{ color: "black", fontSize: "20px" }}>
//           Client Type
//         </Typography>
//         <RadioGroup
//           row // remove this if you want them vertically stacked
//           name="clientType"
//           value={accountData.clientType || ""}
//           onChange={handleChange}
//         >
//           <FormControlLabel
//             value="Individual"
//             control={<Radio />}
//             label="Individual"
//           />
//           <FormControlLabel
//             value="Company"
//             control={<Radio />}
//             label="Company"
//           />
//         </RadioGroup>
//       </FormControl>

//       <FormLabel component="legend" sx={{ color: "black", fontSize: "20px" }}>
//         Account Info
//       </FormLabel>
//       <TextField
//        size="small"
//         fullWidth margin="normal" label="Account Name" name="accountName"
//         value={accountData.accountName} onChange={handleChange}
//        error={!!errors.accountName}
//         helperText={errors.accountName}
//         required />
      
//      {accountData.clientType === "Company" && (
//         <TextField
//           fullWidth
//           margin="normal"
//           size="small"
//           label="Company Name"
//           name="companyName"
//           value={accountData.companyName || ""}
//           onChange={handleChange}
//            error={!!errors.companyName}
//           helperText={errors.companyName}
//           required
//         />
//       )}

//       <MultiSelectDropdown
//   value={accountData.teamMembers || []}
//   onChange={(newValue) => dispatch(setAccountData({ teamMembers: newValue }))}
//   options={teamMembers} // You can omit this prop to let it fetch internally
//   placeholder="Select Team Members"
//   width="100%"
// />

// <TagsMultiSelectDropDown
//   value={accountData.tags || []}
//   onChange={(newValue) => dispatch(setAccountData({ tags: newValue }))}
//   options={tags} // Pass if tags are already loaded; else remove to fetch internally
//   placeholder="Select tags"
//   // width="100%"
// />

// <Box mt={1}>
// {/* Folder Template */}
//       <Autocomplete
//         options={folderTemp}
//         getOptionLabel={(option) => option.label}
//         value={accountData.folderTemp || null} // full object, like tags
       
//          onChange={(e, newValue) => handleAutocompleteChange('folderTemp', newValue)}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             margin="normal"
//             label="Select Folder Template"
//             size="small"
//             //  error={!!errors.folderTemp}
//             // helperText={errors.folderTemp}
//             required
//           />
//         )}
//       />
// </Box>
//     {accountData.clientType === "Company" && (
//   <Box>
//     <FormLabel
//       component="legend"
//       sx={{ color: "black", fontSize: "20px" }}
//     >
//       Address
//     </FormLabel>

//     {/* Country */}
//     <Autocomplete
//     fullWidth
//       options={options}
//       getOptionLabel={(option) => option.label}
//       value={accountData.country || null}
//       onChange={(event, newValue) =>
//         dispatch(setAccountData({ country: newValue }))
//       }
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           margin="normal"
//           label="Select Country"
//           size="small"
//         />
//       )}
//       sx={{  mt: 1 }}
//     />

//     {/* Street Address */}
//     <TextField
//       fullWidth
//       margin="normal"
//       size="small"
//       label="Street Address"
//       name="streetAdd"
//       value={accountData.streetAdd || ""}
//       onChange={handleChange}
//     />

//     {/* City */}
//     <TextField
//       fullWidth
//       margin="normal"
//       size="small"
//       label="City"
//       name="city"
//       value={accountData.city || ""}
//       onChange={handleChange}
//     />

//     {/* State */}
//     <TextField
//       fullWidth
//       margin="normal"
//       size="small"
//       label="State"
//       name="state"
//       value={accountData.state || ""}
//       onChange={handleChange}
//     />

//     {/* Zip Code */}
//     <TextField
//       fullWidth
//       margin="normal"
//       size="small"
//       label="Zip Code"
//       name="zipCode"
//       value={accountData.zipCode || ""}
//       onChange={handleChange}
//     />
//   </Box>
// )}
//       <Button variant="contained" sx={{ mt: 2 }} onClick={onContinue}>
//         Continue
//       </Button>
//     </Box>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountData } from "../redux/accountContactSlice";
import { Autocomplete, FormLabel, Box, Button, TextField, Typography, FormControl, Radio, FormControlLabel, RadioGroup } from "@mui/material";
import countryList from "react-select-country-list";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";

export default function AccountForm({ onContinue }) {
  const dispatch = useDispatch();
  const { accountData } = useSelector((state) => state.accountContact);
  const [errors, setErrors] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [tags, setTags] = useState([]);
  const [folderTemp, setFolderTemp] = useState([]);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  
  console.log("accountdata", accountData);

  const handleChange = (e) => {
    dispatch(setAccountData({ [e.target.name]: e.target.value }));
  };

  // Fetch Team Members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch(
          `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
        );
        const data = await res.json();
        const teamMembersOptions = data.map((user) => ({
          value: user._id,
          label: user.username,
        }));
        setTeamMembers(teamMembersOptions);

        // If editing and we have teamMember IDs, map them to the correct format
        if (accountData.teamMember && accountData.teamMember.length > 0) {
          const selectedTeamMembers = teamMembersOptions.filter(member =>
            accountData.teamMember.includes(member.value)
          );
          dispatch(setAccountData({ teamMembers: selectedTeamMembers }));
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };
    fetchTeamMembers();
  }, [accountData.teamMember]);

  // Fetch Folder Templates
  useEffect(() => {
    const fetchFolderTemps = async () => {
      try {
        const res = await fetch(`https://www.snptaxes.com/api/foldertemp/templatelist`);
        const data = await res.json();
        const folderOptions = data.folderTemplates.map((folder) => ({
          value: folder._id,
          label: folder.templatename,
        }));
        setFolderTemp(folderOptions);

        // If editing and we have folderTemp ID, map it to the correct format
        if (accountData.folderTemp && typeof accountData.folderTemp === 'string') {
          const selectedFolder = folderOptions.find(
            folder => folder.value === accountData.folderTemp
          );
          if (selectedFolder) {
            dispatch(setAccountData({ folderTemp: selectedFolder }));
          }
        }
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };
    fetchFolderTemps();
  }, [accountData.folderTemp]);

  // Fetch Tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${TAGS_API}/tags/`);
        const data = await res.json();
        const tagsOptions = data.tags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));
        setTags(tagsOptions);

        // If editing and we have tag IDs, map them to the correct format
        if (accountData.tags && accountData.tags.length > 0 && typeof accountData.tags[0] === 'string') {
          const selectedTags = tagsOptions.filter(tag =>
            accountData.tags.includes(tag.value)
          );
          dispatch(setAccountData({ tags: selectedTags }));
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, [accountData.tags]);

  const handleAutocompleteChange = (field, newValue) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    dispatch(setAccountData({ [field]: newValue }));
  };

  const options = useMemo(() => countryList().getData(), []);

  return (
    <Box>
      <FormControl component="fieldset" margin="normal" fullWidth>
        <Typography sx={{ color: "black", fontSize: "20px" }}>
          Client Type
        </Typography>
        <RadioGroup
          row
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
        size="small"
        fullWidth
        margin="normal"
        label="Account Name"
        name="accountName"
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

      <MultiSelectDropdown
        value={accountData.teamMembers || []}
        onChange={(newValue) => dispatch(setAccountData({ teamMembers: newValue }))}
        options={teamMembers}
        placeholder="Select Team Members"
        width="100%"
      />

      <TagsMultiSelectDropDown
        value={accountData.tags || []}
        onChange={(newValue) => dispatch(setAccountData({ tags: newValue }))}
        options={tags}
        placeholder="Select tags"
      />

      <Box mt={1}>
        <Autocomplete
          options={folderTemp}
          getOptionLabel={(option) => option?.label || ""}
          value={accountData.folderTemp || null}
          onChange={(e, newValue) => handleAutocompleteChange('folderTemp', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Select Folder Template"
              size="small"
              required
            />
          )}
        />
      </Box>

      {accountData.clientType === "Company" && (
        <Box>
          <FormLabel component="legend" sx={{ color: "black", fontSize: "20px" }}>
            Address
          </FormLabel>

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
            sx={{ mt: 1 }}
          />

          <TextField
            fullWidth
            margin="normal"
            size="small"
            label="Street Address"
            name="streetAdd"
            value={accountData.streetAddress  || ""}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            size="small"
            label="City"
            name="city"
            value={accountData.city || ""}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            size="small"
            label="State"
            name="state"
            value={accountData.state || ""}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            size="small"
            label="Zip Code"
            name="zipCode"
            value={accountData.postalCode  || ""}
            onChange={handleChange}
          />
        </Box>
      )}

      <Button variant="contained" sx={{ mt: 2 }} onClick={onContinue}>
        Continue
      </Button>
    </Box>
  );
}