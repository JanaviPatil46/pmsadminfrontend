

import React, { useState, useEffect, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountData } from "../redux/accountContactSlice";
import countryList from "react-select-country-list";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";
import { LoginContext } from "../Sidebar/Context/Context";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../components/ui/sheet";
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
  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-2">

        {/* Client Type */}
        <div className="space-y-3">
          <SheetHeader className="px-0 py-0 space-y-0.5">
            <SheetTitle className="text-sm font-semibold">Client Type</SheetTitle>
            <SheetDescription className="text-xs">Select whether this is an individual or company account.</SheetDescription>
          </SheetHeader>
          <div className="flex items-center gap-6">
            {["Individual", "Company"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio" name="clientType" value={type}
                  checked={(accountData.clientType || "") === type}
                  onChange={handleChange}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm text-foreground">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-3">
          <SheetHeader className="px-0 py-0 space-y-0.5">
            <SheetTitle className="text-sm font-semibold">Account Info</SheetTitle>
            <SheetDescription className="text-xs">Enter the primary account details.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Account Name <span className="text-destructive">*</span></Label>
              <Input
                name="accountName"
                value={accountData.accountName || ""}
                placeholder="Account Name"
                className={errors.accountName ? "border-destructive" : ""}
                onChange={handleChange}
              />
              {errors.accountName && <p className="text-xs text-destructive">{errors.accountName}</p>}
            </div>
            {accountData.clientType === "Company" && (
              <div className="space-y-1.5">
                <Label>Company Name <span className="text-destructive">*</span></Label>
                <Input
                  name="companyName"
                  value={accountData.companyName || ""}
                  placeholder="Company Name"
                  className={errors.companyName ? "border-destructive" : ""}
                  onChange={handleChange}
                />
                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Team, Tags & Folder */}
        <div className="space-y-3">
          <SheetHeader className="px-0 py-0 space-y-0.5">
            <SheetTitle className="text-sm font-semibold">Assignment</SheetTitle>
            <SheetDescription className="text-xs">Assign team members, tags and a folder template.</SheetDescription>
          </SheetHeader>
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
            <div className="space-y-1.5">
              <Label>Folder Template <span className="text-destructive">*</span></Label>
              <select
                value={accountData.folderTemp?.value || ""}
                onChange={(e) => {
                  const opt = folderTemp.find(f => f.value === e.target.value) || null;
                  handleAutocompleteChange("folderTemp", opt);
                }}
                className={selectCls}
              >
                <option value="">Select Folder Template</option>
                {folderTemp.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Address (Company only) */}
        {accountData.clientType === "Company" && (
          <div className="space-y-3">
            <SheetHeader className="px-0 py-0 space-y-0.5">
              <SheetTitle className="text-sm font-semibold">Address</SheetTitle>
              <SheetDescription className="text-xs">Company billing or mailing address.</SheetDescription>
            </SheetHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Country</Label>
                <select
                  value={options.find(o => o.label === accountData?.country?.label)?.value || ""}
                  onChange={(e) => {
                    const found = options.find(o => o.value === e.target.value) || null;
                    dispatch(setAccountData({ country: found }));
                  }}
                  className={selectCls}
                >
                  <option value="">Select Country</option>
                  {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Street Address</Label>
                <Input name="streetAddress" value={accountData.streetAddress || ""} placeholder="Street address" onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input name="city" value={accountData.city || ""} placeholder="City" onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <Label>State</Label>
                  <Input name="state" value={accountData.state || ""} placeholder="State" onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <Label>ZIP Code</Label>
                  <Input name="postalCode" value={accountData.postalCode || ""} placeholder="ZIP Code" onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <SheetFooter className="border-t border-border/40 pt-3 pb-1">
        <div className="flex justify-end w-full">
          <Button size="sm" onClick={onContinue} className="gap-1.5">
            Continue
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </SheetFooter>
    </div>
  );
}