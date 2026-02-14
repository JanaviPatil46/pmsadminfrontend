import {
  Drawer,
  Checkbox,
  Chip,
  InputLabel,
  List,
  Box,
  InputAdornment,
  IconButton,
  Popover,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Typography,
  TextField,
  label,
  Switch,
  FormControlLabel,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
// import Priority from '../Templates/Priority/Priority';
import Priority from "../../Templates/Priority/Priority";
// import Editor from '../Templates/Texteditor/Editor';
import Editor from "../../Templates/Texteditor/Editor";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown";
import AccountMultiSelectDropdown from "../../Templates/AccountMultiSelectDropdown";
import { LoginContext } from "../../Sidebar/Context/Context";
// Initialize the plugin
dayjs.extend(customParseFormat);

const CreateBulkJob = ({ selectedAccounts, onClose, charLimit = 4000 }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  console.log("selectedAccounts in create bulk job:", selectedAccounts);
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const JOBS_TEMP_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const [userRole, setUserRole] = useState("");
const [loading, setLoading] = useState(false);
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
 const [username, setUsername] = useState("");
  const fetchUserData = async (id) => {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);

        // console.log(userData)
        setUsername(result.username);
      });
  };
    useEffect(() => {
      fetchUserData(loginuserid);
    }, []);
  useEffect(() => {
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  // State to keep track of selected values
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [jobName, setJobName] = useState("");
  const [priority, setPriority] = useState("");
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [startsin, setstartsin] = useState(0);
  const [startsInDuration, setStartsInDuration] = useState("Days");
  const [dueinduration, setdueinduration] = useState("Days");
  const [duein, setduein] = useState(0);

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];
  const handleEditorChange = (content) => {
    setDescription(content);
  };

  // Handler function to update state when dropdown value changes
  const handleStartInDateChange = (event, newValue) => {
    setStartsInDuration(newValue ? newValue.value : null);
  };
  // Handler function to update state when dropdown value changes
  const handleDueInDateChange = (event, newValue) => {
    setdueinduration(newValue ? newValue.value : null);
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

  //****************Accounts */
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState([]);
  const [combinedaccountValues, setCombinedaccountValues] = useState();

  // const handleAccountChange = (event, newValue) => {
  //   setSelectedaccount(newValue);
  //   console.log("Selected Options:", newValue); // Log full option objects
  //   console.log(
  //     "Selected Values:",
  //     newValue.map((option) => option.value)
  //   ); // Log just the values

  //   // If you need to set combined account values separately
  //   setCombinedaccountValues(newValue.map((option) => option.value));
  // };
  const handleAccountChange = (newSelectedAcc) => {
    setSelectedaccount(newSelectedAcc);
    console.log(newSelectedAcc);
    const selectedValues = newSelectedAcc.map((option) => option.value);
    setCombinedaccountValues(selectedValues);
    console.log(selectedValues);
  };
 

  const [accountoptions, setAccountOptions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("active"); 
  const [accountData, setAccountData] = useState([]);
  // const fetchAccountData = async () => {
  //   try {
    
  //     const response = await fetch("https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true")
  //     const data = await response.json();
  //     setaccountdata(data.accounts);

  //     // Map accounts to options
  //     const options = data.accounts.map((account) => ({
  //       value: account._id,
  //       label: account.accountName,
  //     }));
  //     setAccountOptions(options);

  //     // Filter options based on selectedAccounts
  //     const selectedOptions = options.filter((option) =>
  //       selectedAccounts.includes(option.value)
  //     );
  //     console.log("Selected Options:", selectedOptions);
  //     setSelectedaccount(selectedOptions);
  //     setCombinedaccountValues(selectedOptions.map((option) => option.value));
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAccountData();
  // }, []);
// const [loading, setLoading] = useState(false);

const fetchAccountData = async () => {
  setLoading(true);
  try {
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginuserid = storedData?.teammember?.userid;
    const viewAllAccounts = storedData?.teammember?.viewallAccounts;

    console.log("UserRole:", userRole);
    console.log("Team Member userId:", loginuserid);
    console.log("viewAllAccounts:", viewAllAccounts);

    let url = "";

    // --- Same logic pattern as pipeline data ---
    if (userRole === "Admin") {
      url = `https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true`;
    } else {
      // TeamMember
      url =
        viewAllAccounts === true
          ? `https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true`
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`;
    }

    console.log("Fetching accounts from:", url);

    const response = await fetch(url);
    const data = await response.json();

    const accounts = data.accountlist || data.teamAccounts || [];

    setaccountdata(accounts);

    // Convert to dropdown options
    const options = accounts.map((acc) => ({
      value: acc._id,
      label: acc.accountName,
    }));
    setAccountOptions(options);

    // Pre-select previously chosen accounts
    const selectedOptions = options.filter((option) =>
      selectedAccounts.includes(option.value)
    );
    setSelectedaccount(selectedOptions);
    setCombinedaccountValues(selectedOptions.map((opt) => opt.value));

  } catch (error) {
    console.error("Error fetching account data:", error);
  } finally {
    setLoading(false);
  }
};

// STEP 1 — Fetch userRole first
useEffect(() => {
  const storedUserRole = localStorage.getItem("userRole") || "";
  console.log("UserRole from localStorage:", storedUserRole);
  setUserRole(storedUserRole);
}, []);

// STEP 2 — After userRole is loaded, fetch account list
useEffect(() => {
  if (userRole) {
    fetchAccountData();
  }
}, [userRole, filterStatus]);
  const [userData, setUserData] = useState([]);
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

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedAssigneesValues, setCombinedAssigneesValues] = useState();
  // const handleUserChange = (event, selectedOptions) => {
  //   setSelectedUser(selectedOptions);
  //   const selectedValues = selectedOptions.map((option) => option.value);
  //   setCombinedAssigneesValues(selectedValues);
  // };
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedAssigneesValues(selectedValues);
    console.log(selectedValues);
  };
  const assigneesoptions = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get
  const [jobTemp, setJobTemp] = useState([]);
  const [selectedtemp, setselectedTemp] = useState();

  const handletemp = async (event, newValue) => {
    setselectedTemp(newValue);
    if (newValue && newValue.value) {
      const templateId = newValue.value;
      try {
        const response = await fetch(
          `${JOBS_TEMP_API}/workflow/jobtemplate/jobtemplate/jobtemplatelist/${templateId}`
        );
        const data = await response.json();
        const template = data.jobTemplate;

        // Populate the form fields with template data
        setJobName(template.jobname);

        const jobAssignees = template.jobassignees.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setSelectedUser(jobAssignees);
        const selectedValues = jobAssignees.map((option) => option.value);
        setCombinedAssigneesValues(selectedValues);
        // setSelecteAssigneesdUser(template.jobassignees.map(assignee => assignee._id));
        setPriority(template.priority);
        console.log(template.priority);
        setDescription(template.description);
        setAbsoluteDates(template.absolutedates);
        setStartDate(template.absolutedates ? dayjs(template.startdate) : null);
        setDueDate(template.absolutedates ? dayjs(template.enddate) : null);
        setstartsin(template.startsin); // You might need to adjust this
        setduein(template.duein); // You might need to adjust this
        setStartsInDuration(template.startsinduration);
        setdueinduration(template.dueinduration);

        setClientFacingStatus(template.showinclientportal);
        setInputText(template.jobnameforclient);
        if (template.clientfacingstatus && template.clientfacingstatus) {
          const clientStatusData = {
            value: template.clientfacingstatus._id,
            label: template.clientfacingstatus.clientfacingName,
            clientfacingColour: template.clientfacingstatus.clientfacingColour,
          };

          setSelectedJob(clientStatusData);
        }
        setClientDescription(template.clientfacingDescription);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    }
  };

  useEffect(() => {
    fetchtemp();
  }, []);

  const fetchtemp = async () => {
    try {
      const url = `${JOBS_TEMP_API}/workflow/jobtemplate/jobtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setJobTemp(data.JobTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optiontemp = jobTemp.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  // pipeline data
  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setselectedPipeline] = useState();
  const [stages, setstagesData] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [stagesoptions, setStagesOptions] = useState([]);
  const [selectedPipelineDetails, setSelectedPipelineDetails] = useState(null);
  // const stagesoptions = stages.map(stage => ({ value: stage._id, label: stage.name }));

  const handleStageChange = (event, newValue) => {
    setSelectedStage(newValue);
  };

  const handlePipelineChange = async (selectedOptions) => {
    console.log(selectedOptions);
    setselectedPipeline(selectedOptions);
    if (selectedOptions) {
      try {
        const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${selectedOptions.value}`;
        const response = await fetch(url);
        const data = await response.json();
        setSelectedPipelineDetails(data);
        console.log("Pipeline details:", data);
      } catch (error) {
        console.error("Error fetching pipeline details:", error);
      }
    }
    fetchPipelineDataByID(selectedOptions.value);
  };

  // useEffect(() => {
  //   fetchPipelineData();
  // }, []);

  const fetchPipelineDataByID = async (pipelineid) => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineid}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.pipeline);

      // Map stages for Autocomplete
      const stageOptions = data.pipeline.stages.map((stage) => ({
        label: stage.name,
        value: stage._id,
      }));

      setStagesOptions(stageOptions);
      setSelectedStage(stageOptions[0]);

      // setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


const fetchPipelineData = async () => {
  setLoading(true);
  try {
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginuserid = storedData?.teammember?.userid;

    console.log("User role:", userRole);
    console.log("TeamMember userId:", loginuserid);

    // If Admin → fetch all pipelines
    // If Teammember → fetch only user's pipelines
    const url =
      userRole === "Admin"
        ? `${PIPELINE_API}/workflow/pipeline/pipelines`
        : `${PIPELINE_API}/workflow/pipeline/pipelines/${loginuserid}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("Pipeline data:", data);

    setPipelineData(data.pipeline || []);
  } catch (error) {
    console.error("Error fetching pipeline data:", error);
  } finally {
    setLoading(false);
  }
};

// Fetch userRole first
useEffect(() => {
  const storedUserRole = localStorage.getItem("userRole") || "";
  console.log("UserRole from localStorage:", storedUserRole);
  setUserRole(storedUserRole);
}, []);

// After userRole is updated, fetch pipeline list
useEffect(() => {
  if (userRole) {
    fetchPipelineData();
  }
}, [userRole]);
  // const fetchPipelineData = async () => {
  //   try {
  //     const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setPipelineData(data.pipeline);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const optionpipeline = pipelineData.map((pipelineData) => ({
    value: pipelineData._id,
    label: pipelineData.pipelineName,
  }));
 

  const handleJobFormClose = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
    setTimeout(() => {}, 1000);
  };

  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
        },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        {
          title: "Custom field:Email",
          isBold: false,
          value: "CONTACT_CUSTOM_FIELD:Email",
        },
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
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
        },
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
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);
  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setAnchorEl(null);
  };
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
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
      );
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
        const response = await fetch(
          `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientjobId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(data);
        setClientDescription(
          data.clientfacingjobstatuses.clientfacingdescription
        );
        console.log(data.clientfacingjobstatuses.clientfacingdescription);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleDescriptionAddShortcut = (shortcut) => {
    const updatedTextValue = clientDescription + `[${shortcut}]`;
    if (updatedTextValue.length <= charLimit) {
      setClientDescription(updatedTextValue);
      setCharCount(updatedTextValue.length);
    }
    setShowDropdownDescription(false);
  };
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
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
    setInputText((prevText) => prevText + `[${shortcut}]`);
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

  const [automations, setAutomations] = useState([]);
  const createjob = () => {
   
  // Find the details of the selected stage
  const selectedStageDetails = selectedPipelineDetails?.pipeline?.stages?.find(
    (stage) => stage._id === selectedStage?.value
  );

  // Check if the selected stage contains automations
  if (selectedStageDetails?.automations?.length > 0) {
    const automationsData = selectedStageDetails.automations || [];
    console.log("janavi", automationsData);
    setAutomations(automationsData);

    // Open the drawer with automations data
    setDrawerOpen(true);
    return; // Stop further execution of createjob
  }
    const myHeaders = {
      "Content-Type": "application/json",
    };

    const data = {
      accounts: combinedaccountValues,
        stageid: selectedStage.value,
      pipeline: selectedPipeline.value,
      templatename: selectedtemp.value,
      jobname: jobName,
      jobassignees: combinedAssigneesValues,
      priority: priority,
      description: description,
      absolutedates: absoluteDate,
      startsin: startsin,
      startsinduration: startsInDuration,
      duein: duein,
      dueinduration: dueinduration,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob?.value,
      clientfacingDescription: clientDescription,
      startdate: startDate,
      enddate: dueDate,
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/newjob`,
      headers: myHeaders,
      data: JSON.stringify(data),
    };

    // axios
    //   .request(config)
    //   .then((response) => {
    //     console.log("Job created successfully");
    //     toast.success("Job created successfully");
    //     navigate("/jobs/activejob");
    //   })
    //   .catch((error) => {
    //     console.error("Failed to create Job Template:", error);
    //     toast.error("Failed to create Job");
    //   });

     axios
          .request(config)
          .then((response) => {
            console.log("Job created successfully",response.data);
            toast.success("Jobs started successfully");
            // handleClose();
            onClose(); // Close the form after successful creation
            // handleDrawerClose();
            navigate("/jobs/activejob");
            // fetchjobData();
          })
          .catch((error) => {
            console.error("Failed to create Job Template:", error);
            toast.error("Failed to create Job");
          });
  };
  const [drawerOpen, setDrawerOpen] = useState(false);

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("tags dtata", data.tags);
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);

  const tagsoptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,
    customStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      borderRadius: "8px",
      alignItems: "center",
      textAlign: "center",
      marginBottom: "5px",
      padding: "2px,8px",
      fontSize: "10px",
      width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
      cursor: "pointer",
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      padding: "2px,8px",
      fontSize: "10px",
      cursor: "pointer",
    },
  }));

  const handleTagChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs

    setAutomations((prev) => {
      const updatedAutomations = [...prev];

      // Get the correct tag options list
      const tagOptions = tagsoptions;

      // Map selected tag IDs to tag objects with _id, tagName, and tagColour
      const selectedTags = value
        .map((tagId) => {
          const tag = tagOptions.find((t) => t.value === tagId);
          return tag
            ? { _id: tag.value, tagName: tag.label, tagColour: tag.colour }
            : null;
        })
        .filter(Boolean); // Remove null values

      // Prevent duplicate selections
      const uniqueTags = selectedTags.filter(
        (tag, idx, self) => self.findIndex((t) => t._id === tag._id) === idx
      );

      // Ensure the tag is removed from the opposite category
      if (type === "addTags") {
        updatedAutomations[index].removeTags = updatedAutomations[
          index
        ].removeTags.filter(
          (tag) => !uniqueTags.some((t) => t._id === tag._id)
        );
      } else if (type === "removeTags") {
        updatedAutomations[index].addTags = updatedAutomations[
          index
        ].addTags.filter((tag) => !uniqueTags.some((t) => t._id === tag._id));
      }

      updatedAutomations[index] = {
        ...updatedAutomations[index],
        [type]: uniqueTags,
      };

      return updatedAutomations;
    });
  };
     const [assignee, setAssignee] = useState([]);
    const [selectedAssignees, setSelectedAssignees] = useState([]);
    const [assigneesToRemove, setAssigneesToRemove] = useState([]);
    useEffect(() => {
      const fetchAssignees = async () => {
        try {
          const response = await axios.get(`${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`);
          console.log("assigness data",response.data)
          setAssignee(response.data);
        } catch (error) {
          console.error("Error fetching assignees:", error);
        }
      };
      
      fetchAssignees();
    }, []);
    const assigneeOptions = assignee.map((ass)=>({
       value: ass._id,
        label: ass.username,
    }))
     const handleAssigneeChange = (index, type, event) => {
      const { value } = event.target; // Array of selected tag IDs
  
      setAutomations((prev) => {
        const updatedAutomations = [...prev];
  
        // Get the correct tag options list
        const assigneeoptions = assigneeOptions;
  
        // Map selected tag IDs to tag objects with _id, tagName, and tagColour
        const selectedTags = value
          .map((assId) => {
            const ass = assigneeoptions.find((t) => t.value === assId);
            return ass
              ? { _id: ass.value, username: ass.label,  }
              : null;
          })
          .filter(Boolean); // Remove null values
  
        // Prevent duplicate selections
        const uniqueTags = selectedTags.filter(
          (ass, idx, self) => self.findIndex((t) => t._id === ass._id) === idx
        );
  
        // Ensure the tag is removed from the opposite category
        if (type === "addAssignees") {
          updatedAutomations[index].removeAssignees = updatedAutomations[
            index
          ].removeAssignees.filter(
            (ass) => !uniqueTags.some((t) => t._id === ass._id)
          );
        } else if (type === "removeAssignees") {
          updatedAutomations[index].addAssignees = updatedAutomations[
            index
          ].addAssignees.filter((tag) => !uniqueTags.some((t) => t._id === tag._id));
        }
  
        updatedAutomations[index] = {
          ...updatedAutomations[index],
          [type]: uniqueTags,
        };
  
        return updatedAutomations;
      });
    };
 
  const DrawerContent = () => {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: "auto",
        },
      },
    };

    // Get the tags for the selected accounts
    const accountTags = combinedaccountValues
      .map((accountId) => {
        console.log("combinedaccountValues", combinedaccountValues);
        const account = accountdata.find(
          (account) => account._id === accountId
        );
        return account ? account.tags || [] : [];
      })
      .flat();
    console.log("Account Tags:", accountTags);

    // API endpoints
    const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
    const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
    const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
    const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
    const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
    const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
    const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
    const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
    const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
    const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
    const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
    const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
    // State

    const [adminusername, setAdminUsername] = useState("");
    const [selectedAutomations, setSelectedAutomations] = useState([]);
    const [templateData, setTemplateData] = useState({});
    const [tagData, setTagData] = useState({});

    // Fetch template data for display
    const fetchTemplateData = async (templateId, templateType) => {
      if (!templateId) return null;

      try {
        let url = "";
        let response;

        switch (templateType) {
          case "EmailTemplate":
            url = `${EMAIL_API}/workflow/emailtemplate/${templateId}`;
            break;
          case "TaskTemplate":
            url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${templateId}`;
            break;
          case "InvoiceTemplate":
            url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${templateId}`;
            break;
          case "ChatTemplate":
            url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${templateId}`;
            break;
          case "ProposalTemplate":
            url = `https://www.snptaxes.com/api/proposals/${templateId}`;
            break;
          case "OrganizerTemplate":
            url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${templateId}`;
            break;
          case "FolderTemplate":
            url = `https://www.snptaxes.com/api/foldertemp/${templateId}`;
            break;
          default:
            return null;
        }

        const requestOptions = { method: "GET", redirect: "follow" };
        response = await fetch(url, requestOptions);
        const result = await response.json();

        switch (templateType) {
          case "EmailTemplate":
            return (
              result.emailTemplate?.templatename || "Unknown Email Template"
            );
          case "TaskTemplate":
            return result.taskTemplate?.templatename || "Unknown Task Template";
          case "InvoiceTemplate":
            return (
              result.invoiceTemplate?.templatename || "Unknown Invoice Template"
            );
          case "ChatTemplate":
            return result.chatTemplate?.templatename || "Unknown Chat Template";
          case "ProposalTemplate":
            return result.templatename || "Unknown Proposal Template";
          case "OrganizerTemplate":
            return (
              result.organizerTemplate?.templatename ||
              "Unknown Organizer Template"
            );
          case "FolderTemplate":
            return result.template?.templatename || "Unknown Folder Template";
          default:
            return "Unknown Template";
        }
      } catch (error) {
        console.error(`Error fetching ${templateType}:`, error);
        return "Error loading template";
      }
    };
const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const clientStatusOptions = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));
   useEffect(() => {
    fetchClientFacingJobsData();
  }, []);
    // Fetch tag details for display
    const fetchTagDetails = async (tagIds) => {
      if (!tagIds || tagIds.length === 0) return [];

      try {
        const tagDetails = await Promise.all(
          tagIds.map(async (tagId) => {
            try {
              const response = await fetch(
                `${TAGS_API}/tags/${tagId}`
              );
              const result = await response.json();
              return result.tag;
            } catch (error) {
              console.error(`Error fetching tag ${tagId}:`, error);
              return null;
            }
          })
        );
        return tagDetails.filter((tag) => tag !== null);
      } catch (error) {
        console.error("Error fetching tag details:", error);
        return [];
      }
    };

    // Initialize template and tag data
    useEffect(() => {
      const initializeAutomationData = async () => {
        const templatePromises = automations.map(async (automation, index) => {
          if (automation.selectedtemp && automation.refModel) {
            const templateName = await fetchTemplateData(
              automation.selectedtemp,
              automation.refModel
            );
            return { index, templateName };
          }
          return { index, templateName: null };
        });

        const tagPromises = automations.map(async (automation, index) => {
          const selectedTags = await fetchTagDetails(automation.selectedTags);
          const addTags = await fetchTagDetails(automation.addTags);
          const removeTags = await fetchTagDetails(automation.removeTags);

          return {
            index,
            selectedTags,
            addTags,
            removeTags,
          };
        });

        const templateResults = await Promise.all(templatePromises);
        const tagResults = await Promise.all(tagPromises);

        const newTemplateData = {};
        templateResults.forEach((result) => {
          newTemplateData[result.index] = result.templateName;
        });

        const newTagData = {};
        tagResults.forEach((result) => {
          newTagData[result.index] = {
            selectedTags: result.selectedTags,
            addTags: result.addTags,
            removeTags: result.removeTags,
          };
        });

        setTemplateData(newTemplateData);
        setTagData(newTagData);
      };

      initializeAutomationData();
    }, [automations]);

    // Initialize selectedAutomations to include all indices
    useEffect(() => {
      const allIndices = automations.map((_, index) => index);
      setSelectedAutomations(allIndices);
    }, [automations]);

    // API functions (keep your existing functions)
    const fetchinvoicetempbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("Fetched invoice template:", result.invoiceTemplate);
        return result.invoiceTemplate;
      } catch (error) {
        console.error("Error fetching invoice template:", error);
        throw error;
      }
    };

    const fetchchattempbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("Fetched chat template:", result.chatTemplate);
        return result.chatTemplate;
      } catch (error) {
        console.error("Error fetching chat template:", error);
        throw error;
      }
    };

    const fetchtasktempbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("Fetched task template:", result.taskTemplate);
        return result.taskTemplate;
      } catch (error) {
        console.error("Error fetching task template:", error);
        throw error;
      }
    };

    const fetchproposalbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log(
          "Fetched proposal template:",
          result.proposalesAndElsTemplate
        );
        return result.proposalesAndElsTemplate;
      } catch (error) {
        console.error("Error fetching proposal template:", error);
        throw error;
      }
    };

    const fetchorganizertempbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("Fetched organizer template:", result.organizerTemplate);
        return result.organizerTemplate;
      } catch (error) {
        console.error("Error fetching organizer template:", error);
        throw error;
      }
    };

    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Assignment functions (keep your existing functions)
    const assignInvoiceToAccount = (invoiceData, automationTemp, accountId) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        account: accountId,
        invoicenumber: "",
        invoicedate: getCurrentDate(),
        description: invoiceData.description || "",
        invoicetemplate: automationTemp,
        paymentMethod: invoiceData.paymentMethod || "",
        teammember: loginuserid,
        payInvoicewithcredits: invoiceData.payInvoicewithcredits || false,
        emailinvoicetoclient: invoiceData.sendEmailWhenInvCreated || false,
        reminders: invoiceData.sendReminderstoClients || false,
        daysuntilnextreminder: invoiceData.daysuntilnextreminder || null,
        numberOfreminder: invoiceData.numberOfreminder || null,
        scheduleinvoice: false,
        scheduleinvoicedate: new Date(),
        scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
          hour12: false,
        }),
        lineItems: invoiceData.lineItems.map((item) => ({
          productorService: item.productorService || "",
          description: item.description || "",
          rate: item.rate || 0,
          quantity: item.quantity || 0,
          amount: item.amount || 0,
          tax: item.tax || false,
        })),
        summary: {
          subtotal: invoiceData.summary.subtotal || 0,
          taxRate: invoiceData.summary.taxRate || 0,
          taxTotal: invoiceData.summary.taxTotal || 0,
          total: invoiceData.summary.total || 0,
        },
      paidAmount: 0,
        invoiceStatus: "Pending",
        balanceDueAmount: "",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${INVOICE_NEW}/workflow/invoices/invoice`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log("Invoice assigned successfully:", result))
        .catch((error) => console.error("Error assigning invoice:", error));
    };

    const sendChatToAccount = (
      chatData,
      automationTemp,
      automationAccountId
    ) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const subtaskData =
        chatData.clienttasks?.map(({ id, text, checked }) => ({
          id,
          text,
          checked: checked !== undefined ? checked : false,
        })) || [];

      const messageData = [
        {
          message: chatData.description,
          fromwhome: "Admin",
          senderid: username,
          isRead: false,
        },
      ];

      const raw = JSON.stringify({
        accountids: [automationAccountId],
        chattemplateid: automationTemp,
        chatsubject: chatData.chatsubject,
        description: messageData || "",
        templatename: chatData.templatename,
        from: username,
        sendreminderstoclient: chatData.sendreminderstoclient,
        daysuntilnextreminder: chatData.daysuntilnextreminder,
        numberofreminders: chatData.numberofreminders,
        clienttasks: subtaskData,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
        .then((response) => response.json())
        .then((result) =>
          console.log("Send chat to account successfully:", result)
        )
        .catch((error) => console.error("Error assigning chat:", error));
    };

    const assignTaskToAccount = (
      taskData,
      automationTemp,
      automationAccountId,
      jobId
    ) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accounts: automationAccountId,
        job: jobId,
        templatename: automationTemp,
        taskname: taskData.templatename,
        status: taskData.status,
        taskassignees: taskData.taskassignees,
        priority: taskData.priority,
        description: taskData.description,
        tasktags: taskData.tasktags,
        issubtaskschecked: taskData.issubtaskschecked,
        startdate: taskData.startdate,
        enddate: taskData.enddate,
        subtasks: taskData.subtasks,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${ACCOUNT_TASKS_API}/accountstasks/newtask`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log("Task created:", result))
        .catch((error) => console.error("Error creating task:", error));
    };

    const assignProposalToAccount = async (
      automationTemp,
      automationAccountId
    ) => {
      console.log("Assigning proposal to account:", automationTemp, automationAccountId);
      try {
        const response = await fetch(
          "https://www.snptaxes.com/account/proposals/automation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              proposalTemp: automationTemp,
              account: [automationAccountId],
            }),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log("✅ Success:", result);
      } catch (error) {
        console.error("❌ Error sending proposal automation:", error);
      }
    };

    const assignOrganizerToAccount = (
      organizerData,
      automationTemp,
      accountId
    ) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountid: accountId,
        organizertemplateid: automationTemp,
        organizerName: organizerData.organizerName,
        reminders: organizerData.reminders,
        noofreminders: organizerData.noOfReminder,
        daysuntilnextreminder: organizerData.daysuntilNextReminder,
        sections: organizerData.sections,
        status: "Pending",
        active: true,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => console.log("Organizer assigned:", result))
        .catch((error) => console.error("Error assigning organizer:", error));
    };

    const assignfoldertemp = (accountId, automationTemp) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountId: accountId,
        templateId: automationTemp,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `https://www.snptaxes.com/api/docManagement/apply-template`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => console.log("Folder template applied:", result))
        .catch((error) =>
          console.error("Error applying folder template:", error)
        );
    };

    // Main automation execution function
    const selectAutomationApi = async (
      automationType,
      automationTemp,
      automationAccountId,
      automation,
      jobId = null
    ) => {
      console.log("Processing automation:", automationType, automation);

      if (!automationType || !automationAccountId) {
        console.error("Missing required parameters");
        return;
      }

      try {
        switch (automationType) {
          case "Update account tags":
            await handleAccountTagsUpdate(automationAccountId, automation);
            break;

          case "Send Invoice":
            const invoiceData = await fetchinvoicetempbyid(automationTemp);
            assignInvoiceToAccount(
              invoiceData,
              automationTemp,
              automationAccountId
            );
            break;

          case "Send message":
            const chatData = await fetchchattempbyid(automationTemp);
            sendChatToAccount(chatData, automationTemp, automationAccountId);
            break;

          case "Create Task":
            const taskData = await fetchtasktempbyid(automationTemp);
            assignTaskToAccount(
              taskData,
              automationTemp,
              automationAccountId,
              jobId
            );
            break;

          case "Apply folder template":
            await assignfoldertemp(automationAccountId, automationTemp);
            break;

          case "Create Organizer":
            const organizerData = await fetchorganizertempbyid(automationTemp);
            assignOrganizerToAccount(
              organizerData,
              automationTemp,
              automationAccountId
            );
            break;

          case "Send Proposal/Els":
            await assignProposalToAccount(automationTemp, automationAccountId);
            break;

          case "Send Email":
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
              automationType,
              templateId: automationTemp,
              accountId: automationAccountId,
            });

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            await fetch(`${AUTOMATION_API}/automations/`, requestOptions);
            break;

          default:
            console.warn(`Unhandled automation type: ${automationType}`);
            break;
        }
      } catch (error) {
        console.error(`Error processing ${automationType}:`, error);
        throw error;
      }
    };

    // Account tags update handler
    const handleAccountTagsUpdate = async (accountId, automation) => {
      console.log(`Updating account tags for Account ID: ${accountId}`);

      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${accountId}`
      );
      const accountsData = res.data;

      let currentTags = accountsData.tags || [];
      const addTagIds = automation?.addTags || [];
      const removeTagIds = automation?.removeTags || [];

      let updatedTags = currentTags.filter(
        (tagId) => !removeTagIds.includes(tagId)
      );
      updatedTags = [...new Set([...updatedTags, ...addTagIds])];

      const updateResponse = await fetch(
        `https://www.snptaxes.com/api/accounts/accountdetails/updateaccounttags/${accountId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tags: updatedTags }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update account tags");
      console.log("Account tags updated successfully");
    };

    // Checkbox handler
    const handleCheckboxChange = (index) => {
      setSelectedAutomations((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((i) => i !== index)
          : [...prevSelected, index]
      );
    };
 const [accountsWithTags, setAccountsWithTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch complete account data with tags using your API
  useEffect(() => {
    const fetchAccountsWithTags = async () => {
      if (!combinedaccountValues || combinedaccountValues.length === 0) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://www.snptaxes.com/api/accounts/multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: combinedaccountValues })
        });

        if (!response.ok) throw new Error('Failed to fetch accounts');
        
        const accountsData = await response.json();
        setAccountsWithTags(accountsData);
        console.log('Fetched accounts with tags:', accountsData);
      } catch (error) {
        console.error('Error fetching accounts with tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsWithTags();
  }, [combinedaccountValues]);

  // Get tags for selected accounts from the properly fetched data
  const getAccountTags = (accountId) => {
    const account = accountsWithTags.find(acc => acc._id === accountId);
    return account ? account.tags || [] : [];
  };

  // Check if automation tags match account tags
  const checkTagMatch = (automationSelectedTags, accountId) => {
    if (!automationSelectedTags || automationSelectedTags.length === 0) {
      return true; // No condition tags means always match
    }

    const accountTags = getAccountTags(accountId);
    console.log(`Checking tags for account ${accountId}:`, {
      automationTags: automationSelectedTags,
      accountTags: accountTags
    });

    // Check if at least one automation tag exists in account tags
    const hasMatch = automationSelectedTags.some(automationTagId => 
      accountTags.includes(automationTagId)
    );

    console.log(`Tag match result for account ${accountId}:`, hasMatch);
    return hasMatch;
  };
  const [isProcessing, setIsProcessing] = useState(false);
    // Move handler
  //   const handleMove = async () => {
  //       if (isProcessing) return; // safety guard

  // setIsProcessing(true);
  //     try {
  //       const { accountJobMap } = await createJob();
  //       console.log("Job mapping created:", accountJobMap);

  //       const automationResults = await Promise.allSettled(
  //         combinedaccountValues.map(async (accountId) => {
  //           const jobId = accountJobMap[accountId];
  //           if (!jobId)
  //             throw new Error(`No job ID found for account ${accountId}`);

  //           await Promise.all(
  //             selectedAutomations.map(async (automationIndex) => {
  //               const automation = automations[automationIndex];
  //               if (!automation || !automation.type) {
  //                 throw new Error(
  //                   `Invalid automation at index ${automationIndex}`
  //                 );
  //               }

  //                 // Check tag matching using the proper function
  //             const hasMatchingTags = checkTagMatch(automation.selectedTags, accountId);
              
  //             if (!hasMatchingTags) {
  //               console.warn(
  //                 `Tags do not match for automation "${automation.type}" and account ID: ${accountId}. Skipping.`
  //               );
  //               return;
  //             }

  //               await selectAutomationApi(
  //                 automation.type,
  //                 automation.selectedtemp,
  //                 accountId,
  //                 automation,
  //                 automation.type === "Create Task" ? jobId : null
  //               );
  //             })
  //           );
  //         })
  //       );

  //       const failedResults = automationResults.filter(
  //         (r) => r.status === "rejected"
  //       );
  //       if (failedResults.length > 0) {
  //         console.error("Some automations failed:", failedResults);
  //         toast.error(
  //           `${failedResults.length} automations failed (job was created)`
  //         );
  //       } else {
  //         toast.success("Job created successfully");
  //         // handleDrawerClose();
  //         navigate("/jobs/activejob");
  //       }

  //       setDrawerOpen(false);
  //       // handleNewDrawerClose();
  //     } catch (error) {
  //       console.error("Operation failed:", error);
  //       toast.error(`Operation failed: ${error.message}`);
  //     }
  //   };
//     const handleMove = async () => {
//   if (isProcessing) return;

//   setIsProcessing(true);

//   try {
//     // 🔹 Extract data for API
//     const accounts = combinedaccountValues;
//     const autos = selectedAutomations
//       .map((index) => automations[index])
//       .filter(Boolean);

// console.log("Selected automations:", autos);
// const payload = {


//   accounts,
//           automations: autos,
//           stageid: selectedStage.value,
//           pipeline: selectedPipeline.value,
//           jobTemplate: selectedtemp.value,
//           jobname: jobName,
//           description: description,
//           username,
//           jobassignees: combinedAssigneesValues,
//           priority: priority,
//           absolutedates: absoluteDate,
//           startsin: startsin,
//           startsinduration: startsInDuration,
//           duein: duein,
//           dueinduration: dueinduration,
//           showinclientportal: clientFacingStatus,
//           jobnameforclient: inputText,
//           clientfacingstatus: selectedJob,
//           clientfacingDescription: clientDescription,
//           startdate: startDate,
//           enddate: dueDate,
// };
// console.log("📤 Sending JSON:", JSON.stringify(payload));
//     // 🔹 Call backend API
//     await fetch("https://www.snptaxes.com/workflow/jobs/create-job", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
     
//        body: JSON.stringify(payload),
//     });

//     alert("Jobs started");

  
//     setDrawerOpen(false);
//   } catch (error) {
//     console.error("Operation failed:", error);
//   } finally {
//     setIsProcessing(false);
//   }
// };


  const handleMove = async () => {
  if (isProcessing) return;

  setIsProcessing(true);

  try {
    const accounts = combinedaccountValues;
    const autos = selectedAutomations
      .map((index) => automations[index])
      .filter(Boolean);

    const payload = {
      accounts,
      automations: autos,
      stageid: selectedStage.value,
      pipeline: selectedPipeline.value,
      jobTemplate: selectedtemp.value,
      jobname: jobName,
      description,
      username,
      jobassignees: combinedAssigneesValues,
      priority,
      absolutedates: absoluteDate,
      startsin,
      startsinduration: startsInDuration,
      duein,
      dueinduration,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob,
      clientfacingDescription: clientDescription,
      startdate: startDate,
      enddate: dueDate,
    };

    const res = await fetch(
      "https://www.snptaxes.com/workflow/jobs/create-job",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
toast.success("Jobs started successfully");
    // const data = await res.json();

    // if (!res.ok) {
    //   throw new Error(data?.message || "Failed to create jobs");
    // }

    // ✅ SUCCESS TOAST
    // toast.success("Jobs started successfully");
      // ✅ Show toast here based on response
          // if (data?.success) {
          //   toast.success(data.message || "Jobs started successfully");
          // } else {
          //   toast.error(data.message || "Failed to start jobs");
          // }

    onClose();
    setDrawerOpen(false);
    navigate("/jobs/activejob");
  } catch (error) {
    console.error("Operation failed:", error);

    // ❌ ERROR TOAST
    toast.error(error.message || "Something went wrong");
  } finally {
    setIsProcessing(false);
  }
};
    // Create job function
    const createJob = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const clientStatusAutomation = automations.find(
        (automation) => automation.type === "Update client-facing job status"
      );

      const assigneesAutomation = automations.find(
        (automation) => automation.type === "Update job assignees"
      );

      const jobCreationPromises = combinedaccountValues.map(
        async (accountId) => {
          let finalAssignees = [...combinedAssigneesValues];

          if (assigneesAutomation) {
            assigneesAutomation.addAssignees?.forEach((assignee) => {
              if (!finalAssignees.includes(assignee._id)) {
                finalAssignees.push(assignee._id);
              }
            });

            finalAssignees = finalAssignees.filter(
              (assigneeId) =>
                !assigneesAutomation.removeAssignees?.some(
                  (removeAssignee) => removeAssignee._id === assigneeId
                )
            );
          }

          const jobData = {
            accounts: [accountId],
            stageid: selectedStage.value,
            pipeline: selectedPipeline.value,
            templatename: selectedtemp.value,
            jobname: jobName,
            jobassignees: finalAssignees,
            priority: priority,
            description: description,
            absolutedates: absoluteDate,
            startsin: startsin,
            startsinduration: startsInDuration,
            duein: duein,
            dueinduration: dueinduration,
            showinclientportal: clientStatusAutomation
              ? clientStatusAutomation.status
              : false,
            jobnameforclient: inputText,
            clientfacingstatus: clientStatusAutomation
              ? clientStatusAutomation.selectedClientStatus
              : null,
            clientfacingDescription: clientStatusAutomation
              ? clientStatusAutomation.clientDescription
              : clientDescription,
            startdate: startDate,
            enddate: dueDate,
          };

          const response = await fetch(`${JOBS_API}/workflow/jobs/newjob`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(jobData),
          });

          // if (!response.ok) {
          //   const error = await response.json();
          //   throw new Error(
          //     `Failed to create job for account ${accountId}: ${error.message}`
          //   );
          // }

          const result = await response.json();
          if (!result.createdJobs || result.createdJobs.length === 0) {
            throw new Error(`No job created for account ${accountId}`);
          }

          return {
            accountId,
            jobId: result.createdJobs[0]._id,
            jobData: result.createdJobs[0],
          };
        }
      );

      try {
        const jobResults = await Promise.all(jobCreationPromises);
        const accountJobMap = {};
        jobResults.forEach((result) => {
          accountJobMap[result.accountId] = result.jobId;
        });

        return {
          success: true,
          accountJobMap,
          jobs: jobResults.map((r) => r.jobData),
        };
      } catch (error) {
        console.error("Job creation failed:", error);
        throw error;
      }
    };

    // Fetch login user data
    const fetchLoginUserData = async (loginuserid) => {
      const myHeaders = new Headers();
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/common/user/${loginuserid}`, requestOptions)
        .then((response) => response.json())
        .then((result) => setAdminUsername(result.username))
        .catch((error) => console.error("Error fetching user data:", error));
    };

    useEffect(() => {
      fetchLoginUserData(loginuserid);
    }, [loginuserid]);

    // Render function
    return (
      <Box p={2}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          Automations for{" "}
          <Typography variant="h6" ml={1}>
            {combinedaccountValues
              .map((accountId) => {
                const account = accountdata.find(
                  (account) => account._id === accountId
                );
                return account ? account.accountName : null;
              })
              .join(", ")}
          </Typography>
        </Typography>

        <Box>
          {automations.map((automation, index) => {
            const currentTagData = tagData[index] || {};
            const templateName = templateData[index] || "Loading...";

           
            return (
              <Box
                key={index}
                sx={{
                  marginBottom: 2,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedAutomations.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                    />
                    }
                    label={
                      <Typography variant="h6" component="span">
                        {automation.type}
                      </Typography>
                    }
                  />
                  
                </Box>

                {/* Template Information */}
                {automation.selectedtemp && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Template:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {templateName}
                    </Typography>
                   
                  </Box>
                )}

                {/* Selected Tags (Condition Tags) */}
                {currentTagData.selectedTags &&
                  currentTagData.selectedTags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Condition Tags:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {currentTagData.selectedTags.map((tag) => (
                          <Chip
                            key={tag._id}
                            label={tag.tagName}
                            sx={{
                              backgroundColor: tag.tagColour,
                              color: "#fff",
                              fontWeight: "500",
                              borderRadius: "20px",
                            }}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                {/* Add Tags */}
                {automation.type === "Update account tags" &&
                  currentTagData.addTags &&
                  currentTagData.addTags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="success.main"
                      >
                        Add Tags:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {currentTagData.addTags.map((tag) => (
                          <Chip
                            key={tag._id}
                            label={tag.tagName}
                            sx={{
                              backgroundColor: tag.tagColour,
                              color: "#fff",
                              fontWeight: "500",
                              borderRadius: "20px",
                              border: "2px solid #4caf50",
                            }}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                {/* Remove Tags */}
                {automation.type === "Update account tags" &&
                  currentTagData.removeTags &&
                  currentTagData.removeTags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="error.main"
                      >
                        Remove Tags:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {currentTagData.removeTags.map((tag) => (
                          <Chip
                            key={tag._id}
                            label={tag.tagName}
                            sx={{
                              backgroundColor: tag.tagColour,
                              color: "#fff",
                              fontWeight: "500",
                              borderRadius: "20px",
                              border: "2px solid #f44336",
                              textDecoration: "line-through",
                            }}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                {/* Client Status Information */}
                {automation.type === "Update client-facing job status" && (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle1" fontWeight="bold">
      Client Status:
    </Typography>
    
    {/* Display status with colored dot */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
      {automation.selectedClientStatus && (
        <>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: clientStatusOptions?.find(
                opt => opt.value === automation.selectedClientStatus
              )?.clientfacingColour || '#ccc'
            }}
          />
          <Typography variant="body2">
            {clientStatusOptions?.find(
              opt => opt.value === automation.selectedClientStatus
            )?.label || automation.selectedClientStatus || "Not set"}
          </Typography>
        </>
      )}
    </Box>

    {/* Display visibility setting */}
    <Typography variant="body2" sx={{ mt: 1 }}>
      Visibility: {automation.status ? "Visible to client" : "Hidden from client"}
    </Typography>

    {/* Display status description if available */}
    {automation.statusDescription && (
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        Description: {automation.statusDescription}
      </Typography>
    )}
  </Box>
)}

                {/* Warning for Account Tags Automation */}
                {automation.type === "Update account tags" && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    This automation can affect conditions for automations below
                  </Alert>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 5 }}>
          <Button
            variant="contained"
            onClick={handleMove}
              disabled={isProcessing}
            sx={{
              backgroundColor: "var(--color-save-btn)",
              "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
              borderRadius: "15px",
              width: "80px",
            }}
          >
            Move
          </Button>
          <Button
            variant="outlined"
            onClick={() => setDrawerOpen(false)}
            sx={{
              borderColor: "var(--color-border-cancel-btn)",
              color: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)",
                color: "#fff",
                border: "none",
              },
              width: "80px",
              borderRadius: "15px",
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    );
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <form>
          <Box mt={2} mb={1}>
            <hr />
          </Box>
          <Box
            className="bulk-job-form"
            sx={{ height: "88vh", overflowY: "auto" }}
          >
            <Grid spacing={2}>
              <Grid padding={1}>
                <Box>
                  <InputLabel sx={{ color: "black" }}>
                    Select Accounts
                  </InputLabel>
                  <AccountMultiSelectDropdown
                    value={selectedaccount}
                    onChange={handleAccountChange}
                    placeholder="Accounts"
                    options={accountoptions}
                  />
                  
                </Box>

                <Box mt={2}>
                  <label className="job-input-label">Pipeline</label>

                  <Autocomplete
                    options={optionpipeline}
                    getOptionLabel={(option) => option.label}
                    value={selectedPipeline}
                    onChange={(event, newValue) =>
                      handlePipelineChange(newValue)
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                      >
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ backgroundColor: "#fff" }}
                        placeholder="Pipeline"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    sx={{ width: "100%", marginTop: "8px" }}
                    // clearOnEscape // Enable clearable functionality
                  />
                </Box>

                <Box mt={2}>
                  <label className="job-input-label">Stage</label>
                  <Autocomplete
                    // disabled // Disable the Autocomplete input
                    size="small"
                    options={stagesoptions}
                    getOptionLabel={(option) => option.label}
                    value={selectedStage}
                    onChange={handleStageChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Stages"
                        variant="outlined"
                        className="add-jobs-select-dropdown"
                      />
                    )}
                    sx={{ width: "100%", marginTop: "8px" }}
                  />
                </Box>
                <Box mt={2}>
                  <label className="job-input-label">Job Template</label>
                  <Autocomplete
                    options={optiontemp}
                    getOptionLabel={(option) => option.label}
                    value={selectedtemp}
                    onChange={handletemp}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                      >
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ backgroundColor: "#fff" }}
                        placeholder="Job Template"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    sx={{ width: "100%", marginTop: "8px" }}
                    clearOnEscape // Enable clearable functionality
                  />
                </Box>
                <Box mt={2}>
                  <label className="job-input-label">Name</label>
                  <TextField
                    fullWidth
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    margin="normal"
                    size="small"
                    placeholder="Job Name"
                    sx={{ backgroundColor: "#fff" }}
                  />
                </Box>
                <Box mt={2}>
                  <label className="job-input-label">Job Assignees</label>
                  {/* <Autocomplete
                    multiple
                    sx={{ marginTop: "8px" }}
                    options={assigneesoptions}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    value={selectedUser}
                    onChange={handleUserChange}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                      >
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Job Assignees"
                        sx={{ backgroundColor: "#fff" }}
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                  /> */}
                  <MultiSelectDropdown
                    value={selectedUser}
                    onChange={handleUserChange}
                    placeholder="Job Assignees"
                  />
                </Box>
                <Box mt={2}>
                  <Priority
                    onPriorityChange={handlePriorityChange}
                    selectedPriority={priority}
                  />
                </Box>
                <Box mt={3}>
                  <Editor
                    initialContent={description}
                    onChange={handleEditorChange}
                  />
                </Box>
                <Box mt={7}>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="h6">Start and Due Date</Typography>
                    <Box className="absolutes-dates">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={absoluteDate}
                            // onChange={handleAbsolutesDates}
                            onChange={(event) =>
                              handleAbsolutesDates(event.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={"Absolute Date"}
                      />
                    </Box>
                  </Box>
                </Box>
                {absoluteDate && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <Typography>Start Date</Typography>
                      <DatePicker
                         format="MM/DD/YYYY"
                        sx={{ width: "100%", backgroundColor: "#fff" }}
                        // value={startDate}
                        // onChange={handleStartDateChange}
                        value={startDate}
                        onChange={handleStartDateChange}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <Typography>Due Date</Typography>
                      <DatePicker
                         format="MM/DD/YYYY"
                        sx={{ width: "100%", backgroundColor: "#fff" }}
                        // value={dueDate}
                        // onChange={handleDueDateChange}
                        value={dueDate}
                        onChange={handleDueDateChange}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                      />
                    </Box>
                  </>
                )}
                {!absoluteDate && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography>Start In</Typography>
                      <TextField
                        size="small"
                        margin="normal"
                        fullWidth
                        placeholder="0"
                        sx={{ ml: 1, backgroundColor: "#fff" }}
                        value={startsin}
                        onChange={(e) => setstartsin(e.target.value)}
                      />
                      <Autocomplete
                        options={dayOptions}
                        size="small"
                        getOptionLabel={(option) => option.label}
                        value={
                          startsInDuration
                            ? dayOptions.find(
                                (option) => option.value === startsInDuration
                              )
                            : null
                        }
                        onChange={handleStartInDateChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            sx={{ backgroundColor: "#fff" }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ cursor: "pointer", margin: "5px 10px" }}
                          >
                            {option.label}
                          </Box>
                        )}
                        // value={dayOptions.find((option) => option.value === startsInDuration) || null}
                        className="job-template-select-dropdown"
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography>Due In</Typography>
                      <TextField
                        size="small"
                        margin="normal"
                        fullWidth
                        sx={{ ml: 1.5, backgroundColor: "#fff" }}
                        value={duein}
                        placeholder="0"
                        onChange={(e) => setduein(e.target.value)}
                        // onChange={(e) => setduein(e.target.value)}
                      />

                      <Autocomplete
                        options={dayOptions}
                        getOptionLabel={(option) => option.label}
                        // onChange={handledueindateChange}
                        value={
                          dueinduration
                            ? dayOptions.find(
                                (option) => option.value === dueinduration
                              )
                            : null
                        }
                        onChange={handleDueInDateChange}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            sx={{ backgroundColor: "#fff" }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ cursor: "pointer", margin: "5px 10px" }}
                          >
                            {option.label}
                          </Box>
                        )}
                        // value={dayOptions.find((option) => option.value === dueinduration) || null}
                        className="job-template-select-dropdown"
                      />
                    </Box>
                  </>
                )}

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box mt={2}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      {/* <EditCalendarRoundedIcon sx={{ fontSize: '120px', color: '#c6c7c7', }} /> */}
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body">
                            <b>Client-facing status</b>
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                onChange={(event) =>
                                  handleClientFacing(event.target.checked)
                                }
                                checked={clientFacingStatus}
                                color="primary"
                              />
                            }
                            label="Show in Client portal"
                          />
                        </Box>
                        <Box>
                          {clientFacingStatus && (
                            <>
                              <Typography>Job name for client</Typography>
                              <TextField
                                fullWidth
                                name="subject"
                                value={inputText + selectedJobShortcut}
                                onChange={handlechatsubject}
                                placeholder="Job name for client"
                                size="small"
                                sx={{ background: "#fff", mt: 2 }}
                              />

                              <Box mt={2}>
                                <Typography>Status</Typography>
                                <Autocomplete
                                  options={optionstatus}
                                  size="small"
                                  sx={{ mt: 1 }}
                                  value={selectedJob}
                                  onChange={handleJobChange}
                                  getOptionLabel={(option) => option.label}
                                  isOptionEqualToValue={(option, value) =>
                                    option.value === value.value
                                  }
                                  renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                      {/* Color dot */}
                                      <Chip
                                        size="small"
                                        style={{
                                          backgroundColor:
                                            option.clientfacingColour,
                                          marginRight: 8,
                                          marginLeft: 8,
                                          borderRadius: "50%",
                                          height: "15px",
                                        }}
                                      />
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Client Facing Job"
                                      InputProps={{
                                        ...params.InputProps,
                                        startAdornment:
                                          params.inputProps.value &&
                                          clientFacingJobs.length > 0 ? (
                                            <Chip
                                              size="small"
                                              style={{
                                                backgroundColor:
                                                  clientFacingJobs.find(
                                                    (job) =>
                                                      job.clientfacingName ===
                                                      params.inputProps.value
                                                  )?.clientfacingColour, // Set color from selection
                                                marginRight: 8,
                                                marginLeft: 2,
                                                borderRadius: "50%",
                                                height: "15px",
                                              }}
                                            />
                                          ) : null,
                                      }}
                                    />
                                  )}
                                />
                              </Box>
                              <Box sx={{ position: "relative", mt: 2 }}>
                                <InputLabel sx={{ color: "black" }}>
                                  Description
                                </InputLabel>
                                <TextField
                                  fullWidth
                                  size="small"
                                  margin="normal"
                                  type="text"
                                  multiline
                                  value={clientDescription}
                                  onChange={handleChange}
                                  placeholder="Description"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <Typography
                                          sx={{
                                            color: "gray",
                                            fontSize: "12px",
                                            position: "absolute",
                                            bottom: "15px",
                                            right: "15px",
                                          }}
                                        >
                                          {charCount}/{charLimit}
                                        </Typography>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Box>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box mt={3}>
              <hr />
            </Box>

            <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={createjob}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  width: "80px",
                  borderRadius: "15px",
                }}
              >
                Add
              </Button>
              {/* <Link to='/'><Button variant="outlined" onClick={handleJobFormClose}>Cancel</Button></Link> */}
              <Button
                onClick={handleJobFormClose}
                variant="outlined"
                sx={{
                  borderColor: "var(--color-border-cancel-btn)", // Normal background
                  color: "var(--color-save-btn)",
                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    color: "#fff",
                    border: "none",
                  },
                  width: "80px",
                  borderRadius: "15px",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {/* <Box sx={{ width: 400, padding: 2 }}>
                <Typography variant="h6">Automations</Typography>
                {automations.length > 0 && (
                  <Box>
                    {automations.map((automation, index) => (
                      <Box key={index}>
                        <Typography variant="body1">
                          <strong>Type:</strong> {automation.type}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Template:</strong> {automation.template.label}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Tags:</strong>
                        </Typography>
                        {automation.tags.map((tag) => (
                          <Box
                            key={tag._id}
                            sx={{
                              display: "inline-block",
                              backgroundColor: tag.tagColour,
                              color: "white",
                              borderRadius: "8px",
                              padding: "2px 6px",
                              marginRight: "4px",
                            }}
                          >
                            {tag.tagName}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                  }}
                >
                  Proceed
                </Button>
              </Box> */}
        <Box sx={{ width: 550 }}>
          <DrawerContent selectedAccounts={combinedaccountValues} />
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default CreateBulkJob;
