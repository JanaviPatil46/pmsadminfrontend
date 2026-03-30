

import React, { useState, useEffect, useMemo,useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountData } from "../redux/accountContactSlice";
import { Autocomplete, FormLabel, Box, Button, TextField, Typography, FormControl, Radio, FormControlLabel, RadioGroup } from "@mui/material";
import countryList from "react-select-country-list";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";
import { LoginContext } from "../Sidebar/Context/Context";
export default function AccountForm({ onContinue, isEditing = false  }) {
  const dispatch = useDispatch();
  const { accountData } = useSelector((state) => state.accountContact);
  const [errors, setErrors] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [tags, setTags] = useState([]);
  const [folderTemp, setFolderTemp] = useState([]);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const { logindata } = useContext(LoginContext);

  console.log("accountdata", accountData);

  const handleChange = (e) => {
    dispatch(setAccountData({ [e.target.name]: e.target.value }));
  };

  // // Fetch Team Members
  // useEffect(() => {
  //   const fetchTeamMembers = async () => {
  //     try {
  //       const res = await fetch(
  //         `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
  //       );
  //       const data = await res.json();
  //       const teamMembersOptions = data.map((user) => ({
  //         value: user._id,
  //         label: user.username,
  //       }));
  //       setTeamMembers(teamMembersOptions);

  //       // If editing and we have teamMember IDs, map them to the correct format
  //       if (accountData.teamMember && accountData.teamMember.length > 0) {
  //         const selectedTeamMembers = teamMembersOptions.filter(member =>
  //           accountData.teamMember.includes(member.value)
  //         );
  //         dispatch(setAccountData({ teamMembers: selectedTeamMembers }));
  //       }
  //     } catch (err) {
  //       console.error("Error fetching team members:", err);
  //     }
  //   };
  //   fetchTeamMembers();
  // }, [accountData.teamMember]);
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

        // For EDITING: show the selected team members
        if (isEditing && accountData.teamMember && accountData.teamMember.length > 0) {
          const selectedTeamMembers = teamMembersOptions.filter(member =>
            accountData.teamMember.includes(member.value)
          );
          dispatch(setAccountData({ teamMembers: selectedTeamMembers }));
        }
        // For NEW ACCOUNT: auto-select the logged-in user
        else if (!isEditing && logindata?.user?.id) {
          const loggedInUser = teamMembersOptions.find(
            member => member.value === logindata.user.id
          );
          if (loggedInUser) {
            console.log("Auto-selecting logged-in user:", loggedInUser);
            dispatch(setAccountData({ teamMembers: [loggedInUser] }));
          }
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };
    fetchTeamMembers();
  }, [isEditing, accountData.teamMember, logindata]);

  // // Fetch Folder Templates
  // useEffect(() => {
  //   const fetchFolderTemps = async () => {
  //     try {
  //       const res = await fetch(`https://www.snptaxes.com/api/foldertemp/templatelist`);
  //       const data = await res.json();
  //       const folderOptions = data.folderTemplates.map((folder) => ({
  //         value: folder._id,
  //         label: folder.templatename,
  //       }));
  //       setFolderTemp(folderOptions);

  //       // If editing and we have folderTemp ID, map it to the correct format
  //       if (accountData.folderTemp && typeof accountData.folderTemp === 'string') {
  //         const selectedFolder = folderOptions.find(
  //           folder => folder.value === accountData.folderTemp
  //         );
  //         if (selectedFolder) {
  //           dispatch(setAccountData({ folderTemp: selectedFolder }));
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error fetching folders:", err);
  //     }
  //   };
  //   fetchFolderTemps();
  // }, [accountData.folderTemp]);
  // Fetch Folder Templates
useEffect(() => {
  const fetchFolderTemps = async () => {
    try {
      const res = await fetch(`https://www.snptaxes.com/api/foldertemp/templatelist`);
      const data = await res.json();
      
      console.log("Folder templates API response:", data); // Debug log
      
      // Check if we have folder templates in the response
      if (data.folderTemplates && data.folderTemplates.length > 0) {
        const folderOptions = data.folderTemplates.map((folder) => ({
          value: folder._id,
          label: folder.templatename,
        }));
        
        console.log("Folder options mapped:", folderOptions); // Debug log
        setFolderTemp(folderOptions);

        // Get the LAST template in the array
        const lastTemplate = folderOptions[folderOptions.length - 1];
        console.log("Last template in array:", lastTemplate);

        // For EDITING: Use the existing folder template
        if (isEditing) {
          console.log("Edit mode - existing folderTemp:", accountData.folderTemp);
          // Check if folderTemp exists and is a string (ID)
          if (accountData.folderTemp && typeof accountData.folderTemp === 'string') {
            const selectedFolder = folderOptions.find(
              folder => folder.value === accountData.folderTemp
            );
            if (selectedFolder) {
              console.log("Found existing folder for edit:", selectedFolder);
              dispatch(setAccountData({ folderTemp: selectedFolder }));
            } else {
              console.log("No matching folder found, using last option");
              dispatch(setAccountData({ folderTemp: lastTemplate }));
            }
          }
          // If editing but no folder template ID exists, use last one
          else if (!accountData.folderTemp) {
            console.log("No folderTemp in edit mode, using last option");
            dispatch(setAccountData({ folderTemp: lastTemplate }));
          }
          // If accountData.folderTemp is already an object, keep it as is
          else if (accountData.folderTemp && typeof accountData.folderTemp === 'object') {
            console.log("FolderTemp is already an object, keeping:", accountData.folderTemp);
            // No dispatch needed as it's already in correct format
          }
        }
        // For NEW ACCOUNT: Set the LAST template as default
        else if (!isEditing) {
          console.log("New account mode - setting LAST template:", lastTemplate);
          dispatch(setAccountData({ folderTemp: lastTemplate }));
        }
      } else {
        console.warn("No folder templates found in API response");
        setFolderTemp([]);
      }
    } catch (err) {
      console.error("Error fetching folders:", err);
    }
  };
  
  fetchFolderTemps();
}, [isEditing, accountData.folderTemp, dispatch]);

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
console.log("country options", options);
  return (
    <div className="space-y-6">
      {/* Client Type section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Client Type</h3>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            row
            name="clientType"
            value={accountData.clientType || ""}
            onChange={handleChange}
          >
            <FormControlLabel value="Individual" control={<Radio size="small" />} label={<span className="text-sm text-slate-700">Individual</span>} />
            <FormControlLabel value="Company" control={<Radio size="small" />} label={<span className="text-sm text-slate-700">Company</span>} />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Account Info section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Account Info</h3>
        <TextField
          size="small" fullWidth label="Account Name" name="accountName"
          value={accountData.accountName || ""} onChange={handleChange}
          error={!!errors.accountName} helperText={errors.accountName} required
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
        {accountData.clientType === "Company" && (
          <TextField
            fullWidth size="small" label="Company Name" name="companyName"
            value={accountData.companyName || ""} onChange={handleChange}
            error={!!errors.companyName} helperText={errors.companyName} required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        )}
      </div>

      {/* Team & Tags */}
      <div className="space-y-3">
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
        <Autocomplete
          options={folderTemp}
          getOptionLabel={(option) => option?.label || ""}
          value={accountData.folderTemp || null}
          onChange={(e, newValue) => handleAutocompleteChange('folderTemp', newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Folder Template" size="small" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          )}
        />
      </div>

      {/* Address section (Company only) */}
      {accountData.clientType === "Company" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Address</h3>
          <Autocomplete
            fullWidth options={options} getOptionLabel={(option) => option.label}
            value={options.find(opt => opt.label === accountData?.country?.label) || null}
            onChange={(event, newValue) => dispatch(setAccountData({ country: newValue }))}
            isOptionEqualToValue={(option, value) => option.label === value?.label}
            renderInput={(params) => (<TextField {...params} label="Select Country" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />)}
          />
          <TextField fullWidth size="small" label="Street Address" name="streetAddress" value={accountData.streetAddress || ""} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextField fullWidth size="small" label="City" name="city" value={accountData.city || ""} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            <TextField fullWidth size="small" label="State" name="state" value={accountData.state || ""} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            <TextField fullWidth size="small" label="Zip Code" name="postalCode" value={accountData.postalCode || ""} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          </div>
        </div>
      )}

      <button
        className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        onClick={onContinue}
      >
        Continue
        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}