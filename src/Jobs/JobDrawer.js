import React, { useState, useEffect, useContext } from "react";
import Priority from "../Templates/Priority/Priority";
import Editor from "../Templates/Texteditor/Editor";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { LoginContext } from "../Sidebar/Context/Context";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import AccountMultiSelectDropdown from "../Templates/AccountMultiSelectDropdown";
import { format, formatDistanceToNow } from "date-fns";
import { SideSheet } from "../components/ui/side-sheet";
import { Button } from "../components/ui/button";
const JobDrawer = ({
  handleNewDrawerClose,
  handleDrawerClose,
  charLimit = 4000,
}) => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
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
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  useEffect(() => {
    fetchUserData(loginuserid);
  }, [loginuserid]);
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const JOBS_TEMP_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
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
  const [selectedaccount, setSelectedaccount] = useState();

  const [combinedaccountValues, setCombinedaccountValues] = useState();

  const handleAccountChange = (newSelectedAcc) => {
    setSelectedaccount(newSelectedAcc);

    const selectedValues = newSelectedAcc.map((option) => option.value);
    setCombinedaccountValues(selectedValues);
    console.log("combined account", selectedValues);
  };
  useEffect(() => {
    fetchAccountData();
    // fetchAccountDatas("data");
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(
        "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
      );
      const data = await response.json();
      setaccountdata(data.accountlist);
      console.log("account data", data.accountlist);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [userData, setUserData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
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
  const [combinedValues, setCombinedValues] = useState();
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);

    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
  };

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

        console.log(data.jobTemplate);
        // Populate the form fields with template data
        setJobName(template.jobname);

        const jobAssignees = template.jobassignees.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setSelectedUser(jobAssignees);
        const selectedValues = jobAssignees.map((option) => option.value);
        setCombinedValues(selectedValues);

        setPriority(template.priority);
        console.log(template.priority);
        setDescription(template.description);
        setAbsoluteDates(template.absolutedates);
        setStartDate(template.absolutedates ? dayjs(template.startdate) : null);
        setDueDate(template.absolutedates ? dayjs(template.enddate) : null);
        setstartsin(template.startsin || 0); // You might need to adjust this
        setduein(template.duein || 0); // You might need to adjust this
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
  const [selectedPipelineDetails, setSelectedPipelineDetails] = useState(null);

  const handlePipelineChange = async (selectedOptions) => {
    setselectedPipeline(selectedOptions);
    console.log(selectedOptions);
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

  const [selectedStage, setSelectedStage] = useState(null);
  const [stagesoptions, setStagesOptions] = useState([]);
  const handleStageChange = (event, newValue) => {
    setSelectedStage(newValue);
  };

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

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [userRole, setUserRole] = useState("");

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

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole") || "";
    setUserRole(storedUserRole);
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchPipelineData();
    }
  }, [userRole]);

  const optionpipeline = pipelineData.map((pipelineData) => ({
    value: pipelineData._id,
    label: pipelineData.pipelineName,
  }));

  const [automations, setAutomations] = useState([]);
  const createjob = () => {
    if (!selectedPipeline?.value) {
      toast.error("Please select a pipeline.");
      return;
    }
    if (!selectedStage?.value) {
      toast.error("Please select a stage.");
      return;
    }
    if (!selectedtemp?.value) {
      toast.error("Please select a job template.");
      return;
    }
    // Find the details of the selected stage
    const selectedStageDetails =
      selectedPipelineDetails?.pipeline?.stages?.find(
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
      stageid: selectedStage?.value,
      pipeline: selectedPipeline?.value,
      templatename: selectedtemp?.value,
      jobname: jobName,
      jobassignees: combinedValues,
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
    console.log("job creation", data);
    axios
      .request(config)
      .then((response) => {
        console.log("Job created successfully");
        toast.success("Job created successfully");
        handleClose();
        handleDrawerClose();
        navigate("/jobs/activejob");
        fetchjobData();
      })
      .catch((error) => {
        console.error("Failed to create Job Template:", error);
        toast.error("Failed to create Job");
      });
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Function to open the drawer
  const openDrawer = () => {
    // Replace this with your actual drawer opening logic
    console.log("Drawer is now open");
    setDrawerOpen(true); // Example state change
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
      // console.log(data);
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
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await axios.get(
          `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
        );
        console.log("assigness data", response.data);
        setAssignee(response.data);
      } catch (error) {
        console.error("Error fetching assignees:", error);
      }
    };

    fetchAssignees();
  }, []);
  const assigneeOptions = assignee.map((ass) => ({
    value: ass._id,
    label: ass.username,
  }));
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
          return ass ? { _id: ass.value, username: ass.label } : null;
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
        ].addAssignees.filter(
          (tag) => !uniqueTags.some((t) => t._id === tag._id)
        );
      }

      updatedAutomations[index] = {
        ...updatedAutomations[index],
        [type]: uniqueTags,
      };

      return updatedAutomations;
    });
  };
  const [filterStatus, setFilterStatus] = useState("active");
  const [jobData, setJobData] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRole) {
      fetchjobData();
    }
  }, [userRole, isActiveTrue]);
  const fetchjobData = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);

      const loginuserid = storedData?.teammember?.userid;
      const viewAllAccounts = storedData?.teammember?.viewallAccounts;

      console.log("User role is:", userRole);
      console.log("access:", viewAllAccounts);

      let url = "";

      if (userRole === "Admin") {
        // ✅ Fetch active accounts first
        const accountsResponse = await axios.get(
          `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
        );
        console.log("accountsResponse", accountsResponse);
        const accountsData = accountsResponse.data.accountlist;
        console.log("Admin accounts fetched:", accountsData);

        if (!accountsData || accountsData.length === 0) {
          console.warn("No active accounts found for Admin.");
          setJobData([]);
          await loaderDelay;
          setLoading(false);
          return;
        }

        const accountIds = accountsData.map((account) => account._id).join(",");
        url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}/${accountIds}`;
      } else if (userRole === "TeamMember") {
        if (viewAllAccounts) {
          // TeamMember with full access gets all jobs
          // url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}`;
          // ✅ Fetch active accounts first
          const accountsResponse = await axios.get(
            `${ACCOUNT_API}/accounts/account/accountdetailslist/${isActiveTrue}`
          );

          const accountsData = accountsResponse.data.accountlist;
          console.log("Admin accounts fetched:", accountsData);

          if (!accountsData || accountsData.length === 0) {
            console.warn("No active accounts found for Admin.");
            setJobData([]);
            await loaderDelay;
            setLoading(false);
            return;
          }

          const accountIds = accountsData
            .map((account) => account.id)
            .join(",");
          url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}/${accountIds}`;
          console.log("url", url);
        } else {
          // TeamMember with restricted access → fetch user's accounts
          const accountsResponse = await axios.get(
            `${ACCOUNT_API}/accounts/getaccounts/${loginuserid}/${isActiveTrue}`
          );

          const accountsData = accountsResponse.data.accountlist;
          console.log("Accounts fetched:", accountsData);

          if (!accountsData || accountsData.length === 0) {
            console.warn("No accounts found for user.");
            setJobData([]);
            await loaderDelay;
            setLoading(false);
            return;
          }

          const accountIds = accountsData
            .map((account) => account.id)
            .join(",");
          url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}/${accountIds}`;
          console.log("url", url);
        }
      }

      if (!url) {
        await loaderDelay;
        setLoading(false);
        return;
      }

      console.log("Fetching jobs from URL:", url);

      const jobListResponse = await axios.get(url);

      const formattedData = jobListResponse.data.jobList.map((job) => ({
        ...job,
        StartDate: job.StartDate
          ? format(new Date(job.StartDate), "MMMM dd, yyyy")
          : "",
        DueDate: job.DueDate
          ? format(new Date(job.DueDate), "MMMM dd, yyyy")
          : "",
        updatedAt: formatDistanceToNow(new Date(job.updatedAt), {
          addSuffix: true,
        }),
        JobAssignee: Array.isArray(job.JobAssignee)
          ? job.JobAssignee.join(", ")
          : job.JobAssignee,
        clientfacingstatus: {
          statusName: job.ClientFacingStatus?.statusName || "",
          statusColor: job.ClientFacingStatus?.statusColor || "",
        },
      }));

      setJobData(formattedData);
      console.log("Formatted Job Data:", formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      await loaderDelay;
      setLoading(false);
    }
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
const [isProcessing, setIsProcessing] = useState(false);

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

    // Fetch tag details for display
    const fetchTagDetails = async (tagIds) => {
      if (!tagIds || tagIds.length === 0) return [];

      try {
        const tagDetails = await Promise.all(
          tagIds.map(async (tagId) => {
            try {
              const response = await fetch(`${TAGS_API}/tags/${tagId}`);
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
console.log("invoiceData", invoiceData);
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
        .then((response) => {response.json()
          console.log("Response status:", response);
        })
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
console.log("Sending chat to account...", raw);
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
      console.log(
        "Assigning proposal to account:",
        automationTemp,
        automationAccountId
      );
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
      console.log("Automation details:", automation);
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${accountId}`
      );
      const accountsData = res.data;

      let currentTags = accountsData.tags || [];
      const addTagIds = automation?.addTags || [];
      const removeTagIds = automation?.removeTags || [];
      console.log("Current Tags:", currentTags);
      console.log("Add Tag IDs:", addTagIds);
      console.log("Remove Tag IDs:", removeTagIds);
      let updatedTags = currentTags.filter(
        (tagId) => !removeTagIds.includes(tagId)
      );
      updatedTags = [...new Set([...updatedTags, ...addTagIds])];
      console.log("Updated Tags:", updatedTags);
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
        if (!combinedaccountValues || combinedaccountValues.length === 0)
          return;

        setLoading(true);
        try {
          const response = await fetch(
            "https://www.snptaxes.com/api/accounts/multiple",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ids: combinedaccountValues }),
            }
          );

          if (!response.ok) throw new Error("Failed to fetch accounts");

          const accountsData = await response.json();
          setAccountsWithTags(accountsData);
          console.log("Fetched accounts with tags:", accountsData);
        } catch (error) {
          console.error("Error fetching accounts with tags:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAccountsWithTags();
    }, [combinedaccountValues]);

    // Get tags for selected accounts from the properly fetched data
    const getAccountTags = (accountId) => {
      const account = accountsWithTags.find((acc) => acc._id === accountId);
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
        accountTags: accountTags,
      });

      // Check if at least one automation tag exists in account tags
      const hasMatch = automationSelectedTags.some((automationTagId) =>
        accountTags.includes(automationTagId)
      );

      console.log(`Tag match result for account ${accountId}:`, hasMatch);
      return hasMatch;
    };
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
                const hasMatchingTags = checkTagMatch(
                  automation.selectedTags,
                  accountId
                );

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
          handleDrawerClose();
          navigate("/jobs/activejob");
          fetchjobData();
        }

        setDrawerOpen(false);
        handleNewDrawerClose();
      } catch (error) {
        console.error("Operation failed:", error);
        toast.error(`Operation failed: ${error.message}`);
      }finally {
    setIsProcessing(false); // 🔑 ENABLE BUTTONS AGAIN
  }
    };

    // Create job function
    const createJob = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const clientStatusAutomation = automations.find(
        (automation) => automation.type === "Update client-facing job status"
      );
      console.log("clientStatusAutomation", clientStatusAutomation);
      const assigneesAutomation = automations.find(
        (automation) => automation.type === "Update job assignees"
      );

      const jobCreationPromises = combinedaccountValues.map(
        async (accountId) => {
          let finalAssignees = [...combinedValues];

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
        <h2 className="text-base font-semibold text-foreground mb-4 flex flex-wrap gap-1">
          Automations for
          <span className="font-normal text-muted-foreground">
            {combinedaccountValues
              .map((accountId) => {
                const account = accountdata.find((a) => a._id === accountId);
                return account ? account.accountName : null;
              })
              .join(", ")}
          </span>
        </h2>

        <div className="space-y-3">
          {automations.map((automation, index) => {
            const currentTagData = tagData[index] || {};
            const templateName = templateData[index] || "Loading...";
            const allAccountsHaveMatchingTags = combinedaccountValues.every(
              (accountId) => checkTagMatch(automation.selectedTags, accountId)
            );
            return (
              <div key={index} className="border border-border rounded-xl p-4 space-y-3">
                {/* Checkbox + type */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAutomations.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                    disabled={!allAccountsHaveMatchingTags}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm font-semibold text-foreground">{automation.type}</span>
                  {!allAccountsHaveMatchingTags && (
                    <span className="text-xs text-red-500 italic ml-2">The tags do not match the account</span>
                  )}
                </div>

                {/* Template */}
                {automation.selectedtemp && (
                  <div>
                    <p className="text-xs font-bold text-foreground">Template:</p>
                    <p className="text-xs text-muted-foreground">{templateName}</p>
                  </div>
                )}

                {/* Condition Tags */}
                {currentTagData.selectedTags && currentTagData.selectedTags.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-foreground mb-1">Condition Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentTagData.selectedTags.map((tag) => (
                        <span key={tag._id} className="text-xs text-white px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: tag.tagColour }}>
                          {tag.tagName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Tags */}
                {automation.type === "Update account tags" && currentTagData.addTags && currentTagData.addTags.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-green-600 mb-1">Add Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentTagData.addTags.map((tag) => (
                        <span key={tag._id} className="text-xs text-white px-2 py-0.5 rounded-full font-medium border-2 border-green-500"
                          style={{ backgroundColor: tag.tagColour }}>
                          {tag.tagName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Remove Tags */}
                {automation.type === "Update account tags" && currentTagData.removeTags && currentTagData.removeTags.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-red-600 mb-1">Remove Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentTagData.removeTags.map((tag) => (
                        <span key={tag._id} className="text-xs text-white px-2 py-0.5 rounded-full font-medium border-2 border-red-400 line-through"
                          style={{ backgroundColor: tag.tagColour }}>
                          {tag.tagName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client Status */}
                {automation.type === "Update client-facing job status" && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">Client Status:</p>
                    {automation.selectedClientStatus && (
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: clientStatusOptions?.find(o => o.value === automation.selectedClientStatus)?.clientfacingColour || "#ccc" }} />
                        <span className="text-xs text-muted-foreground">
                          {clientStatusOptions?.find(o => o.value === automation.selectedClientStatus)?.label || automation.selectedClientStatus || "Not set"}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Visibility: {automation.status ? "Visible to client" : "Hidden from client"}
                    </p>
                    {automation.statusDescription && (
                      <p className="text-xs text-muted-foreground">Description: {automation.statusDescription}</p>
                    )}
                  </div>
                )}

                {/* Warning */}
                {automation.type === "Update account tags" && (
                  <div className="flex items-start gap-2 bg-warning/10 border border-warning/30 rounded-lg p-3 mt-2">
                    <span className="text-warning text-xs">⚠️ This automation can affect conditions for automations below</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button type="button" onClick={handleMove} disabled={isProcessing}
            className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50">
            Move
          </button>
          <button type="button" onClick={() => setDrawerOpen(false)} disabled={isProcessing}
            className="rounded-full px-5 py-1.5 text-sm font-medium border border-border text-primary hover:bg-primary hover:text-white hover:border-transparent transition-colors disabled:opacity-50">
            Close
          </button>
        </div>
      </div>
    );
  };

  const handleClose = () => {
    handleNewDrawerClose();
  };

  const inputCls = "w-full border border-border rounded px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/40";
  const labelCls = "block text-sm font-medium text-foreground mb-1";

  return (
    <SideSheet
      open
      onOpenChange={(v) => !v && handleClose()}
      title="Add Job"
      size="lg"
      hideDefaultFooter
    >
      <div className="space-y-4">

          {/* Accounts */}
          <div>
            <label className={labelCls}>Accounts</label>
            <AccountMultiSelectDropdown
              value={selectedaccount}
              onChange={handleAccountChange}
              placeholder="Accounts"
            />
          </div>

          {/* Pipeline */}
          <div>
            <label className={labelCls}>Pipeline</label>
            <select
              value={selectedPipeline?.value || ""}
              onChange={(e) => {
                const opt = optionpipeline.find(o => o.value === e.target.value);
                if (opt) handlePipelineChange(opt);
              }}
              className={inputCls + " mt-1"}
            >
              <option value="">Pipeline</option>
              {optionpipeline.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Stage */}
          <div>
            <label className={labelCls}>Stage</label>
            <select
              value={selectedStage?.value || ""}
              onChange={(e) => {
                const opt = stagesoptions.find(o => o.value === e.target.value);
                handleStageChange(null, opt || null);
              }}
              className={inputCls + " mt-1"}
            >
              <option value="">Stages</option>
              {stagesoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Template */}
          <div>
            <label className={labelCls}>Template</label>
            <select
              value={selectedtemp?.value || ""}
              onChange={(e) => {
                const opt = optiontemp.find(o => o.value === e.target.value);
                handletemp(null, opt || null);
              }}
              className={inputCls + " mt-1"}
            >
              <option value="">Job Template</option>
              {optiontemp.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Job Name */}
          <div>
            <label className={labelCls}>Name</label>
            <input
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="Job Name"
              className={inputCls + " mt-1"}
            />
          </div>

          {/* Job Assignees */}
          <div>
            <label className={labelCls}>Job Assignees</label>
            <MultiSelectDropdown
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Job Assignees"
            />
          </div>

          {/* Priority */}
          <div>
            <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
          </div>

          {/* Description editor */}
          <div className="mt-2">
            <Editor initialContent={description} onChange={handleEditorChange} />
          </div>

          {/* Start and Due Date */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Start and Due Date</span>
              <label className="flex items-center gap-2 cursor-pointer absolutes-dates">
                <span className="text-xs text-muted-foreground">Absolute Date</span>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={absoluteDate}
                    onChange={(e) => handleAbsolutesDates(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </div>
              </label>
            </div>

            {absoluteDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20 shrink-0">Start Date</span>
                  <input
                    type="date"
                    className={inputCls}
                    value={startDate ? startDate.format("YYYY-MM-DD") : ""}
                    onChange={(e) => handleStartDateChange(dayjs(e.target.value))}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20 shrink-0">Due Date</span>
                  <input
                    type="date"
                    className={inputCls}
                    value={dueDate ? dueDate.format("YYYY-MM-DD") : ""}
                    onChange={(e) => handleDueDateChange(dayjs(e.target.value))}
                  />
                </div>
              </div>
            )}

            {!absoluteDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20 shrink-0">Start In</span>
                  <input
                    type="text"
                    placeholder="0"
                    value={startsin}
                    onChange={(e) => setstartsin(e.target.value)}
                    className={inputCls}
                  />
                  <select
                    value={startsInDuration || ""}
                    onChange={(e) => handleStartInDateChange(null, dayOptions.find(o => o.value === e.target.value) || null)}
                    className={inputCls + " job-template-select-dropdown"}
                  >
                    {dayOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-20 shrink-0">Due In</span>
                  <input
                    type="text"
                    placeholder="0"
                    value={duein}
                    onChange={(e) => setduein(e.target.value)}
                    className={inputCls}
                  />
                  <select
                    value={dueinduration || ""}
                    onChange={(e) => handleDueInDateChange(null, dayOptions.find(o => o.value === e.target.value) || null)}
                    className={inputCls + " job-template-select-dropdown"}
                  >
                    {dayOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Client-facing status */}
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Client-facing status</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-muted-foreground">Show in Client portal</span>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={clientFacingStatus}
                    onChange={(e) => handleClientFacing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </div>
              </label>
            </div>

            {clientFacingStatus && (
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-sm text-foreground mb-1">Job name for client</p>
                  <input
                    name="subject"
                    value={inputText + selectedJobShortcut}
                    onChange={handlechatsubject}
                    placeholder="Job name for client"
                    className={inputCls}
                  />
                </div>
                <div>
                  <p className="text-sm text-foreground mb-1">Status</p>
                  <select
                    value={selectedJob?.value || ""}
                    onChange={(e) => {
                      const opt = optionstatus.find(o => o.value === e.target.value);
                      handleJobChange(null, opt || null);
                    }}
                    className={inputCls}
                  >
                    <option value="">Select Client Facing Job</option>
                    {optionstatus.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={clientDescription}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={3}
                    className={inputCls}
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">{charCount}/{charLimit}</p>
                </div>
              </div>
            )}
          </div>

      </div>

      {/* Sticky footer inside SideSheet scrollable area */}
      <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-border/40 sticky bottom-0 bg-background">
        <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
        <Button size="sm" onClick={createjob}>Add Job</Button>
      </div>

      {/* Automations nested Sheet */}
      <SideSheet
        open={drawerOpen}
        onOpenChange={(v) => !v && setDrawerOpen(false)}
        title="Stage Automations"
        description="Review automations that will run when this job is created"
        size="lg"
        hideDefaultFooter
      >
        <DrawerContent selectedAccounts={combinedaccountValues} />
      </SideSheet>
    </SideSheet>
  );
};

export default JobDrawer;
