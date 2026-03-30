import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  TablePagination,
  CircularProgress
} from "@mui/material";
import Priority from "../Priority/Priority";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CiMenuKebab } from "react-icons/ci";
import MultiSelectDropdown from "../MultiSelectDropdown";
import axios from "axios";
import debounce from "lodash.debounce";
import { FormPage, FormSection, FormField, FormRow, FormActions, FormGrid, ShortcodePopover, FormDatePicker, FormSelect } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Trash2, MessageSquarePlus, FileText, Calendar, Users, Globe } from "lucide-react";
dayjs.extend(customParseFormat);

const JobTemp = ({ charLimit = 4000 }) => {
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;

  const navigate = useNavigate();
  const [templatename, settemplatename] = useState("");
  const [priority, setPriority] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [startsin, setstartsin] = useState(0);
  const [duein, setduein] = useState(0);
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [jobName, setJobName] = useState("");
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [startsInDuration, setStartsInDuration] = useState("Days");
  const [dueinduration, setdueinduration] = useState("Days");
  // const [startsinduration, setstartsinduration] = useState("");
  const [description, setDescription] = useState("");

  // client facing integration

  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDecription] = useState(null);
  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [clientDescription, setClientDescription] = useState("");
  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues); // Ensure data is set correctly
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  // useEffect to fetch jobs when the component mounts
  useEffect(() => {
    fetchClientFacingJobsData();
  }, []);

  const handleJobChange = async (event, newValue) => {
    setSelectedJob(newValue);

    if (newValue && newValue.value) {
      const clientjobId = newValue.value;
      try {
        const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientjobId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(data);
        setClientDescription(data.clientfacingjobstatuses.clientfacingdescription);
        console.log(data.clientfacingjobstatuses.clientfacingdescription);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  // const handleDescriptionAddShortcut = (shortcut) => {
  //   const updatedTextValue = clientDescription + `[${shortcut}]`;
  //   if (updatedTextValue.length <= charLimit) {
  //     setClientDescription(updatedTextValue);
  //     setCharCount(updatedTextValue.length);
  //   }
  //   setShowDropdownDescription(false);
  // };
//  const [cursorPosition, setCursorPosition] = useState(0);
  const descriptionFieldRef = useRef(null);
  const handleDescriptionAddShortcut = (shortcut) => {
    setClientDescription((prevText) => {
        const newText =
            prevText.slice(0, cursorPosition) + `[${shortcut}]` + prevText.slice(cursorPosition);
        return newText.length <= charLimit ? newText : prevText;
    });

    setTimeout(() => {
        if (descriptionFieldRef.current) {
            descriptionFieldRef.current.focus();
            descriptionFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
        }
    }, 0);

    setShowDropdownDescription(false);
};

  const handlechatsubject = (e) => {
    const { value,selectionStart  } = e.target;
    setInputText(value);
    setCursorPosition(selectionStart);
  };
  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setClientDescription(value);
      setCharCount(value.length);
    }
  };
  const handleClientFacing = (checked) => {
    setClientFacingStatus(checked);
  };

  const handleJobAddShortcut = (shortcut) => {
    // setInputText((prevText) => prevText + `[${shortcut}]`);
    setInputText((prevText) => {
      const newText =
          prevText.slice(0, cursorPosition) + `[${shortcut}]` + prevText.slice(cursorPosition);
      return newText;
  });

  setTimeout(() => {
      if (textFieldRef.current) {
          textFieldRef.current.focus();
          textFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
      }
  }, 0);
    setShowDropdownClientJob(false);
  };

  const toggleShortcodeDropdown = (event) => {
    setAnchorElClientJob(event.currentTarget);
    setShowDropdownClientJob(!showDropdownClientJob);
  };
  const toggleDescriptionDropdown = (event) => {
    setAnchorElDecription(event.currentTarget);
    setShowDropdownDescription(!showDropdownDescription);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
  // handleDescriptionAddShortcut


  const [cursorPosition, setCursorPosition] = useState(0);
const textFieldRef = useRef(null);

  const handleAddShortcut = (shortcut) => {
    setJobName((prevText) => {
        const newText =
            prevText.slice(0, cursorPosition) + `[${shortcut}]` + prevText.slice(cursorPosition);
        return newText;
    });

    setTimeout(() => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
            textFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
        }
    }, 0);

    setShowDropdown(false);
};
  // const handleAddShortcut = (shortcut) => {
  //   setJobName((prevText) => prevText + `[${shortcut}]`);
  //   setShowDropdown(false);
  // };
  const handleCreateJobTemplate = () => {
    setShowForm(true); // Show the form when button is clicked
  };

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleDueDateChange = (date) => {
    setDueDate(date);
  };
  // const handleCloseJobTemp = () => {

  //     const confirmCancel = window.confirm("You have unsaved changes. are you sure you want to leave without saving?");
  //     if (confirmCancel) {
  //         // If user confirms, clear the form and hide it
  //         setShowForm(false);

  //     }

  // }
  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCloseJobTemp = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templatename || jobName || priority || description || absoluteDate) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templatename, jobName, priority, description, absoluteDate]);
  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  // Handler function to update state when dropdown value changes
  const handleStartInDateChange = (event, newValue) => {
    setStartsInDuration(newValue ? newValue.value : null);
  };
  // Handler function to update state when dropdown value changes
  const handledueindateChange = (event, newValue) => {
    setdueinduration(newValue ? newValue.value : null);
  };

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);
useEffect(() => {
  if (selectedOption === "contacts" || selectedOption === "account") {
    const accountShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
      // { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
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

  // useEffect(() => {
  //   // Set shortcuts based on selected option
  //   if (selectedOption === "contacts") {
  //     const contactShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
  //       { title: "Contact Shortcodes", isBold: true },
  //       { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
  //       { title: "First Name", isBold: false, value: "FIRST_NAME" },
  //       { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
  //       { title: "Last Name", isBold: false, value: "LAST_NAME" },
  //       { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
  //       { title: "Country", isBold: false, value: "COUNTRY" },
  //       { title: "Company name", isBold: false, value: "COMPANY_NAME " },
  //       { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
  //       { title: "City", isBold: false, value: "CITY" },
  //       { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
  //       { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
  //       { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
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
  //     setShortcuts(contactShortcuts);
  //   } else if (selectedOption === "account") {
  //     const accountShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
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
  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setAnchorEl(null);
  };
  const handlejobName = (e) => {
    const { value,selectionStart  } = e.target;
    setJobName(value);
    setCursorPosition(selectionStart);
  };
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState();
  const [userData, setUserData] = useState([]);

  console.log(combinedValues);
  useEffect(() => {
    fetchData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleUserChange = (event, selectedOptions) => {
  //   setSelectedUser(selectedOptions);
  //   const selectedValues = selectedOptions.map((option) => option.value);
  //   setCombinedValues(selectedValues);
  // };
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers)
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues)
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
  //get all templateName Record
  const [JobTemplates, setJobTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    fetchJobTemplatesData();
  }, []);
  const fetchJobTemplatesData = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch job templates");
      }
      const data = await response.json();
      setJobTemplates(data.JobTemplates);
      console.log(data);
    } catch (error) {
      console.error("Error fetching job templates:", error);
    }
    finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  const handleClear = () => {
    settemplatename("");
    setJobName("");
    setSelectedUser([]);
    setPriority("");
    setAbsoluteDates(false);
    setStartDate(null);
    setDueDate(null);
    setInputText("");
    setstartsin("");
    setduein("");
    setClientDescription("");
    setClientFacingStatus(false);
    setComments([]);
  };
  // showinclientportal,jobnameforclient,clientfacingstatus,
  const createjobtemp = () => {
    if (absoluteDate === true) {
      if (!validateForm()) {
        // toast.error("Please fix the validation errors.");
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        templatename: templatename,
        jobname: jobName,
        jobassignees: combinedValues,
        addshortcode: "",
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        comments: comments,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedJob?.value,
        startdate: startDate,
        enddate: dueDate,
        clientfacingDescription: clientDescription,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template created successfully");
          setShowForm(false);
          handleClear();
          fetchJobTemplatesData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Job Template");
        });
    } else if (absoluteDate === false) {
      if (!validateForm()) {
        // toast.error("Please fix the validation errors.");
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        templatename: templatename,
        jobname: jobName,
        jobassignees: combinedValues,
        addshortcode: "",
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        comments: comments,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedJob?.value,
        clientfacingDescription: clientDescription,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template created successfully");
          // setTimeout(() => window.location.reload(), 1000);
          setShowForm(false);
          handleClear();
          fetchJobTemplatesData();
          // Additional logic after successful creation if needed
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Job Template");
        });
    }
  };

  const createsavejobtemp = () => {
    if (absoluteDate === true) {
      if (!validateForm()) {
        // toast.error("Please fix the validation errors.");
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        templatename: templatename,
        jobname: jobName,
        jobassignees: combinedValues,
        addshortcode: "",
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        comments: comments,
        startdate: startDate,
        enddate: dueDate,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedJob?.value,
        clientfacingDescription: clientDescription,
      });
console.log(raw)
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template created successfully");
          // handle;

          fetchJobTemplatesData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Job Template");
        });
    } else if (absoluteDate === false) {
      if (!validateForm()) {
        // toast.error("Please fix the validation errors.");
        return;
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        templatename: templatename,
        jobname: jobName,
        jobassignees: combinedValues,
        addshortcode: "",
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        comments: comments,
        showinclientportal: clientFacingStatus,
        jobnameforclient: inputText,
        clientfacingstatus: selectedJob?.value,
        clientfacingDescription: clientDescription,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Job Template created successfully");

          fetchJobTemplatesData();
          // Additional logic after successful creation if needed
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Job Template");
        });
    }
  };

  //delete template
  const handleEdit = (_id) => {
    navigate("JobTemplateUpdate/" + _id);
  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this Job template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          setShowForm(false);
          handleMenuClose()
          fetchJobTemplatesData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  // const toggleMenu = (_id) => {
  //   setOpenMenuId(openMenuId === _id ? null : _id);
  //   setTempIdGet(_id);
  // };
 const toggleMenu = (event, _id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(_id);
    setTempIdGet(_id);
  };
    const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setTempIdGet(null);
  };
   

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    if (!templatename) tempErrors.templatename = "Template name is required";
    if (!jobName) tempErrors.jobName = "Job name is required";

    setErrors(tempErrors);
    // return isValid;
    return Object.keys(tempErrors).length === 0;
  };

  const [comments, setComments] = useState([]);

  const addCommentField = () => {
    setComments([...comments, ""]); // Add a new empty comment field
  };
  console.log(comments);
  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value; // Update the specific comment field
    setComments(updatedComments);
  };
  const deleteCommentField = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index); // Remove the comment at the specified index
    setComments(updatedComments);
  };


  const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);
  
  
     const handleChangePage = (_, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
     // Compute paginated tasks
     const paginatedJobs = JobTemplates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  const [templateNameError, setTemplateNameError] = useState('');
  const checkTemplateName = async (name) => {
    try {
      const res = await axios.get(`${JOBS_API}/workflow/jobtemplate/check-name`, {
        params: { name },
      });
      if (res.data.exists) {
        setTemplateNameError('Template name already exists');
      } else {
        setTemplateNameError('');
      }
    } catch (err) {
      console.error(err);
      setTemplateNameError('');
    }
  };

 const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else setTemplateNameError('');
  }, 500);

  useEffect(() => {
    debouncedCheck(templatename);
    return debouncedCheck.cancel;
  }, [templatename]);
  
     return (
      <Box>
        {!showForm ? (
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleCreateJobTemplate} className="mb-3">
              Job Template
            </Button>
            {loading ? (
  <Box sx={{display:'flex',alignItems:'center', justifyContent:'center'}}> <CircularProgress style={{fontSize:'300px', color:'blue'}}/></Box>
  ):( 
  // <MaterialReactTable columns={columns} table={table} />
  <Box>
<TableContainer component={Paper} sx={{ overflow: "visible" }}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="250"
                  >
                    Name
                  </TableCell>

                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Settings
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedJobs.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Typography
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                          cursor: "pointer",
                          color: "#3f51b5",
                        }}
                        onClick={() => handleEdit(row._id)}
                      >
                        {row.templatename}
                      </Typography>
                    </TableCell>
 <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                  }}
                >
                  <IconButton
                    onClick={(event) => toggleMenu(event, row._id)}
                    style={{ color: "#2c59fa" }}
                    size="small"
                  >
                    <CiMenuKebab />
                  </IconButton>

                  {/* MUI Menu */}
                
                </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
<Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 3,
            ml: 1,
            boxShadow: 3,
            borderRadius: 1,
            minWidth: 120,
            '& .MuiMenuItem-root': {
              fontSize: '12px',
              padding: '8px 16px',
            }
          }
        }}
      >
        <MenuItem 
          onClick={() => handleEdit(tempIdget)}
          sx={{ 
            fontWeight: "bold",
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => handleDelete(tempIdget)}
          sx={{ 
            color: "error.main", 
            fontWeight: "bold",
            '&:hover': {
              backgroundColor: '#ffebee'
            }
          }}
        >
          Delete
        </MenuItem>
      </Menu>
<TablePagination
rowsPerPageOptions={[30,40,50,60,100]}
component="div"
count={JobTemplates.length}
rowsPerPage={rowsPerPage}
page={page}
onPageChange={handleChangePage}
onRowsPerPageChange={handleChangeRowsPerPage}
/>
</Box>
  )
}
            {/* <MaterialReactTable columns={columns} table={table} /> */}
          </Box>
        ) : (
        <FormPage
          title="Create Job Template"
          subtitle="Configure your new job template"
          actions={
            <>
              <Button variant="outline" onClick={handleCloseJobTemp}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={createsavejobtemp}>
                Save
              </Button>
              <Button onClick={createjobtemp}>
                Save & Exit
              </Button>
            </>
          }
        >
          <FormGrid>
            {/* ===== LEFT COLUMN: Main Form ===== */}
            <FormGrid.Main>
              {/* General Info Section */}
              <FormSection title="General Information" icon={<FileText className="h-4 w-4" />}>
                <FormField label="Template Name" error={templateNameError}>
                  <Input
                    placeholder="Template Name"
                    value={templatename}
                    onChange={(e) => settemplatename(e.target.value)}
                    error={!!templateNameError}
                  />
                </FormField>

                <FormField label="Job Name" error={errors.jobName}>
                  <div className="space-y-2">
                    <Input
                      value={jobName}
                      ref={textFieldRef}
                      onClick={(e) => setCursorPosition(e.target.selectionStart)}
                      onChange={handlejobName}
                      placeholder="Job Name"
                      error={!!errors.jobName}
                    />
                    <ShortcodePopover
                      shortcuts={filteredShortcuts}
                      onSelect={handleAddShortcut}
                    />
                  </div>
                </FormField>
              </FormSection>

              {/* Assignment Section */}
              <FormSection title="Assignment" icon={<Users className="h-4 w-4" />}>
                <FormField label="Job Assignees">
                  <MultiSelectDropdown
                    value={selectedUser}
                    onChange={handleUserChange}
                    placeholder="Job Assignees"
                  />
                </FormField>

                <FormField label="Priority">
                  <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
                </FormField>
              </FormSection>

              {/* Description Section */}
              <FormSection title="Description">
                <EditorShortcodes onChange={handleEditorChange} content={description} />
              </FormSection>

              {/* Scheduling Section */}
              <FormSection title="Start and Due Date" icon={<Calendar className="h-4 w-4" />}>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Use Absolute Dates</Label>
                  <Switch
                    checked={absoluteDate}
                    onCheckedChange={handleAbsolutesDates}
                  />
                </div>

                {absoluteDate && (
                  <FormRow cols={2}>
                    <FormField label="Start Date">
                      <FormDatePicker
                        value={startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => handleStartDateChange(dayjs(e.target.value))}
                      />
                    </FormField>
                    <FormField label="Due Date">
                      <FormDatePicker
                        value={dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => handleDueDateChange(dayjs(e.target.value))}
                      />
                    </FormField>
                  </FormRow>
                )}

                {!absoluteDate && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Label className="w-16 shrink-0 text-sm">Start In</Label>
                      <Input
                        value={startsin}
                        onChange={(e) => setstartsin(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={startsInDuration} onValueChange={(val) => handleStartInDateChange(null, dayOptions.find(o => o.value === val) || null)}>
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {dayOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="w-16 shrink-0 text-sm">Due In</Label>
                      <Input
                        value={duein}
                        onChange={(e) => setduein(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={dueinduration} onValueChange={(val) => handledueindateChange(null, dayOptions.find(o => o.value === val) || null)}>
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {dayOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </FormSection>
            </FormGrid.Main>

            {/* ===== RIGHT COLUMN: Sidebar ===== */}
            <FormGrid.Sidebar>
              {/* Client-Facing Section */}
              <FormSection title="Client-Facing Status" icon={<Globe className="h-4 w-4" />}>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Show in Client Portal</Label>
                  <Switch
                    checked={clientFacingStatus}
                    onCheckedChange={handleClientFacing}
                  />
                </div>

                {clientFacingStatus && (
                  <div className="space-y-4 pt-2">
                    <FormField label="Job Name for Client">
                      <div className="space-y-2">
                        <Input
                          ref={textFieldRef}
                          value={inputText}
                          onChange={handlechatsubject}
                          onClick={(e) => setCursorPosition(e.target.selectionStart)}
                          placeholder="Job name for client"
                        />
                        <ShortcodePopover
                          shortcuts={filteredShortcuts}
                          onSelect={handleJobAddShortcut}
                        />
                      </div>
                    </FormField>

                    <FormField label="Status">
                      <FormSelect
                        value={selectedJob?.value || ""}
                        onChange={(e) => {
                          const selected = optionstatus.find((s) => s.value === e.target.value);
                          handleJobChange(null, selected || null);
                        }}
                      >
                        <option value="">Select Client Facing Job</option>
                        {optionstatus.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </FormSelect>
                    </FormField>

                    <FormField label="Description">
                      <div className="relative">
                        <Textarea
                          ref={descriptionFieldRef}
                          value={clientDescription}
                          onClick={(e) => setCursorPosition(e.target.selectionStart)}
                          onChange={handleChange}
                          placeholder="Description"
                          rows={4}
                        />
                        <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                          {charCount}/{charLimit}
                        </span>
                      </div>
                      <ShortcodePopover
                        shortcuts={filteredShortcuts}
                        onSelect={handleDescriptionAddShortcut}
                      />
                    </FormField>
                  </div>
                )}
              </FormSection>

              {/* Comments Section */}
              <FormSection
                title="Comments"
                icon={<MessageSquarePlus className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  {comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Textarea
                        value={comment}
                        onChange={(e) => handleCommentChange(index, e.target.value)}
                        placeholder={`Comment ${index + 1}`}
                        rows={2}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => deleteCommentField(index)}
                        className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCommentField}
                    className="w-full"
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5" />
                    Add Comment
                  </Button>
                </div>
              </FormSection>
            </FormGrid.Sidebar>
          </FormGrid>
        </FormPage>
        )}
      </Box>
  );
};

export default JobTemp;
