import React, { useState, useEffect, useContext } from "react";
import Priority from "../../Templates/Priority/Priority";
import Editor from "../../Templates/Texteditor/Editor";
import dayjs from "dayjs";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown";
import AccountMultiSelectDropdown from "../../Templates/AccountMultiSelectDropdown";
import { LoginContext } from "../../Sidebar/Context/Context";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
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

    axios
      .request(config)
      .then((response) => {
        console.log("Job created successfully");
        toast.success("Job created successfully");
        navigate("/jobs/activejob");
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
    const handleMove = async () => {
        if (isProcessing) return; // safety guard

  setIsProcessing(true);
      try {
        const { accountJobMap } = await createJob();
        console.log("Job mapping created:", accountJobMap);

        const automationResults = await Promise.allSettled(
          combinedaccountValues.map(async (accountId) => {
            const jobId = accountJobMap[accountId];
            if (!jobId)
              throw new Error(`No job ID found for account ${accountId}`);

            await Promise.all(
              selectedAutomations.map(async (automationIndex) => {
                const automation = automations[automationIndex];
                if (!automation || !automation.type) {
                  throw new Error(
                    `Invalid automation at index ${automationIndex}`
                  );
                }

                  // Check tag matching using the proper function
              const hasMatchingTags = checkTagMatch(automation.selectedTags, accountId);
              
              if (!hasMatchingTags) {
                console.warn(
                  `Tags do not match for automation "${automation.type}" and account ID: ${accountId}. Skipping.`
                );
                return;
              }

                await selectAutomationApi(
                  automation.type,
                  automation.selectedtemp,
                  accountId,
                  automation,
                  automation.type === "Create Task" ? jobId : null
                );
              })
            );
          })
        );

        const failedResults = automationResults.filter(
          (r) => r.status === "rejected"
        );
        if (failedResults.length > 0) {
          console.error("Some automations failed:", failedResults);
          toast.error(
            `${failedResults.length} automations failed (job was created)`
          );
        } else {
          toast.success("Job created successfully");
          // handleDrawerClose();
          navigate("/jobs/activejob");
        }

        setDrawerOpen(false);
        // handleNewDrawerClose();
      } catch (error) {
        console.error("Operation failed:", error);
        toast.error(`Operation failed: ${error.message}`);
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

          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              `Failed to create job for account ${accountId}: ${error.message}`
            );
          }

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
      <div className="p-4">
        <p className="text-base font-semibold text-foreground mb-3">
          Automations for{" "}
          <span className="font-bold">
            {combinedaccountValues
              .map((accountId) => {
                const account = accountdata.find((a) => a._id === accountId);
                return account ? account.accountName : null;
              })
              .join(", ")}
          </span>
        </p>

        <div className="space-y-3">
          {automations.map((automation, index) => {
            const currentTagData = tagData[index] || {};
            const templateName = templateData[index] || "Loading...";
            const allAccountsHaveMatchingTags = combinedaccountValues.every((accountId) =>
              checkTagMatch(automation.selectedTags, accountId)
            );
            return (
              <div key={index} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    checked={selectedAutomations.includes(index)}
                    onCheckedChange={() => handleCheckboxChange(index)}
                    disabled={!allAccountsHaveMatchingTags}
                  />
                  <span className="text-sm font-semibold text-foreground">{automation.type}</span>
                  {!allAccountsHaveMatchingTags && (
                    <span className="text-xs text-red-500 italic ml-2">The tags do not match the account</span>
                  )}
                </div>

                {automation.selectedtemp && (
                  <div className="mb-2">
                    <p className="text-xs font-bold text-foreground">Template:</p>
                    <p className="text-xs text-muted-foreground">{templateName}</p>
                  </div>
                )}

                {currentTagData.selectedTags?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-bold text-foreground">Condition Tags:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentTagData.selectedTags.map((tag) => (
                        <span key={tag._id} className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                      ))}
                    </div>
                  </div>
                )}

                {automation.type === "Update account tags" && currentTagData.addTags?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-bold text-green-600">Add Tags:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentTagData.addTags.map((tag) => (
                        <span key={tag._id} className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white border-2 border-green-500" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                      ))}
                    </div>
                  </div>
                )}

                {automation.type === "Update account tags" && currentTagData.removeTags?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-bold text-red-600">Remove Tags:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentTagData.removeTags.map((tag) => (
                        <span key={tag._id} className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white border-2 border-red-500 line-through" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                      ))}
                    </div>
                  </div>
                )}

                {automation.type === "Update client-facing job status" && (
                  <div className="mb-2">
                    <p className="text-xs font-bold text-foreground">Client Status:</p>
                    {automation.selectedClientStatus && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: clientStatusOptions?.find(o => o.value === automation.selectedClientStatus)?.clientfacingColour || '#ccc' }}></span>
                        <span className="text-xs">{clientStatusOptions?.find(o => o.value === automation.selectedClientStatus)?.label || automation.selectedClientStatus || "Not set"}</span>
                      </div>
                    )}
                    <p className="text-xs text-foreground mt-1">Visibility: {automation.status ? "Visible to client" : "Hidden from client"}</p>
                    {automation.statusDescription && <p className="text-xs text-muted-foreground mt-1">Description: {automation.statusDescription}</p>}
                  </div>
                )}

                {automation.type === "Update account tags" && (
                  <div className="mt-2 rounded bg-yellow-50 border border-yellow-300 px-3 py-2 text-xs text-yellow-800">
                    ⚠ This automation can affect conditions for automations below
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button type="button" variant="default" onClick={handleMove} disabled={isProcessing}>Move</Button>
          <Button type="button" variant="outline" onClick={() => setDrawerOpen(false)}>Close</Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <form>
        <div className="mt-2 mb-1"><hr /></div>
        <div className="bulk-job-form" style={{ height: '88vh', overflowY: 'auto' }}>
          <div className="p-2 space-y-4">
            <div className="space-y-1.5">
              <Label>Select Accounts</Label>
              <AccountMultiSelectDropdown
                value={selectedaccount}
                onChange={handleAccountChange}
                placeholder="Accounts"
                options={accountoptions}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Pipeline</Label>
              <Select value={selectedPipeline?.value || ""} onValueChange={(val) => { const opt = optionpipeline.find(o => o.value === val); if (opt) handlePipelineChange(opt); }}>
                <SelectTrigger><SelectValue placeholder="Pipeline" /></SelectTrigger>
                <SelectContent>
                  {optionpipeline.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select value={selectedStage?.value || ""} onValueChange={(val) => { const opt = stagesoptions.find(o => o.value === val); handleStageChange(null, opt || null); }}>
                <SelectTrigger><SelectValue placeholder="Stages" /></SelectTrigger>
                <SelectContent>
                  {stagesoptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Job Template</Label>
              <Select value={selectedtemp?.value || ""} onValueChange={(val) => { const opt = optiontemp.find(o => o.value === val); if (opt) handletemp(null, opt); }}>
                <SelectTrigger><SelectValue placeholder="Job Template" /></SelectTrigger>
                <SelectContent>
                  {optiontemp.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={jobName} onChange={(e) => setJobName(e.target.value)} placeholder="Job Name" />
            </div>

            <div className="space-y-1.5">
              <Label>Job Assignees</Label>
              <MultiSelectDropdown value={selectedUser} onChange={handleUserChange} placeholder="Job Assignees" />
            </div>

            <div>
              <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
            </div>

            <div>
              <Editor initialContent={description} onChange={handleEditorChange} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Start and Due Date</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-normal text-muted-foreground">Absolute Date</Label>
                  <Switch checked={absoluteDate} onCheckedChange={handleAbsolutesDates} />
                </div>
              </div>
            </div>

            {absoluteDate && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate ? (typeof startDate === 'string' ? startDate : startDate.format?.('YYYY-MM-DD') || '') : ''} onChange={(e) => handleStartDateChange(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Due Date</Label>
                  <Input type="date" value={dueDate ? (typeof dueDate === 'string' ? dueDate : dueDate.format?.('YYYY-MM-DD') || '') : ''} onChange={(e) => handleDueDateChange(e.target.value)} />
                </div>
              </div>
            )}

            {!absoluteDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground whitespace-nowrap">Start In</span>
                  <Input placeholder="0" value={startsin} onChange={(e) => setstartsin(e.target.value)} />
                  <Select value={startsInDuration || ""} onValueChange={(val) => handleStartInDateChange(null, { value: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{dayOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground whitespace-nowrap">Due In</span>
                  <Input placeholder="0" value={duein} onChange={(e) => setduein(e.target.value)} />
                  <Select value={dueinduration || ""} onValueChange={(val) => handleDueInDateChange(null, { value: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{dayOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold">Client-facing status</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-normal text-muted-foreground">Show in Client portal</Label>
                  <Switch checked={clientFacingStatus} onCheckedChange={handleClientFacing} />
                </div>
              </div>

              {clientFacingStatus && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Job name for client</Label>
                    <Input name="subject" value={inputText + selectedJobShortcut} onChange={handlechatsubject} placeholder="Job name for client" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={selectedJob?.value || ""} onValueChange={(val) => { const opt = optionstatus.find(o => o.value === val); if (opt) handleJobChange(null, opt); }}>
                      <SelectTrigger><SelectValue placeholder="Select Client Facing Job" /></SelectTrigger>
                      <SelectContent>
                        {optionstatus.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative space-y-1.5">
                    <Label>Description</Label>
                    <Textarea rows={3} value={clientDescription} onChange={handleChange} placeholder="Description" />
                    <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">{charCount}/{charLimit}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3"><hr /></div>
          <div className="flex items-center gap-3 pt-3 px-2 pb-4">
            <Button type="button" variant="default" onClick={createjob}>Add</Button>
            <Button type="button" variant="outline" onClick={handleJobFormClose}>Cancel</Button>
          </div>
        </div>
      </form>

      {drawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-[550px] bg-background shadow-2xl overflow-y-auto border-l border-border">
          <DrawerContent selectedAccounts={combinedaccountValues} />
        </div>
      )}
    </div>
  );
};

export default CreateBulkJob;
