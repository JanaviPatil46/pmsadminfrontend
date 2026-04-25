import React, { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
import Priority from "../Templates/Priority/Priority";
import Editor from "../Templates/Texteditor/Editor";
import { LoginContext } from "../Sidebar/Context/Context";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import AccountMultiSelectDropdown from "../Templates/AccountMultiSelectDropdown";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const AddJobs = ({
  charLimit = 4000,
  stages,
  pipelineId,
  handleDrawerClose,
  fetchJobData,
}) => {
  console.log("janavi stage ", stages);
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
  }, []);

  // console.log("teammenber", loginuserid);
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const JOBS_TEMP_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleDueDateChange = (date) => {
    setDueDate(date);
  };
  const handleStartInDateChange = (event, newValue) => {
    setStartsInDuration(newValue ? newValue.value : null);
  };
  // Handler function to update state when dropdown value changes
  const handleDueInDateChange = (event, newValue) => {
    setdueinduration(newValue ? newValue.value : null);
  };
  //****************Accounts */
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState();
  const [combinedaccountValues, setCombinedaccountValues] = useState();
const [userRole, setUserRole] = useState("");
const [loading, setLoading] = useState(false);
  // const handleAccountChange = (event, newValue) => {
  //   setSelectedaccount(newValue.map((option) => option.value));
  //   // Map selected options to their values and send as an array
  //   console.log(
  //     "Selected Values:",
  //     newValue.map((option) => option.value)
  //   );
  //   setCombinedaccountValues(newValue.map((option) => option.value));
  // };
  const handleAccountChange = (newSelectedAcc) => {
    setSelectedaccount(newSelectedAcc);
    console.log(newSelectedAcc);
    const selectedValues = newSelectedAcc.map((option) => option.value);
    setCombinedaccountValues(selectedValues);
    console.log(selectedValues);
  };
    const [filterStatus, setFilterStatus] = useState("active"); 
      const [accountoptions, setAccountOptions] = useState([]);
    const [accountData, setAccountData] = useState([]);
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
  
      // // Pre-select previously chosen accounts
      // const selectedOptions = options.filter((option) =>
      //   selectedAccounts.includes(option.value)
      // );
      // setSelectedaccount(selectedOptions);
      // setCombinedaccountValues(selectedOptions.map((opt) => opt.value));
  
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
  // useEffect(() => {
  //   fetchAccountData();
  // }, []);

  // const fetchAccountData = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
  //     );
  //     const data = await response.json();
  //     setaccountdata(data.accounts);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // console.log(userdata);
  // const accountoptions = accountdata.map((account) => ({
  //   value: account._id,
  //   label: account.accountName,
  // }));

  //   stages

  const [selectedStage, setSelectedStage] = useState(null);
  const stagesoptions = stages.map((stage) => ({
    value: stage._id,
    label: stage.name,
  }));
  const handleStageChange = (event, newValue) => {
    setSelectedStage(newValue);
  };

  // user

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
  const [combinedValues, setCombinedValues] = useState();
  const [combinedAssigneesValues, setCombinedAssigneesValues] = useState([]);
  // const handleUserChange = (event, selectedOptions) => {
  //   setSelectedUser(selectedOptions);
  //   const selectedValues = selectedOptions.map((option) => option.value);
  //   setCombinedAssigneesValues(selectedValues);
  // };
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  const assigneesoptions = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get
  const [description, setDescription] = useState("");
  const [jobName, setJobName] = useState("");
  const [priority, setPriority] = useState("");
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [startsin, setstartsin] = useState(0);
  const [startsInDuration, setStartsInDuration] = useState(null);
  const [dueinduration, setdueinduration] = useState("");
  const [duein, setduein] = useState(0);
  const [jobTemp, setJobTemp] = useState([]);
  const [selectedtemp, setselectedTemp] = useState();
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
        setCombinedValues(selectedValues);
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
  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];


  // State for drawer visibility and automations
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [stageAutomations, setStageAutomations] = useState([]);

  // Function to handle creating a job
  const createjob = () => {
    if (!selectedStage?.value) {
      toast.error("Please select a stage.");
      return;
    }
    if (!selectedtemp?.value) {
      toast.error("Please select a job template.");
      return;
    }

    // Check if selected stage has automations
    const stage = stages.find((stage) => stage._id === selectedStage.value);
    if (stage?.automations?.length) {
      setStageAutomations(stage.automations); // Store automations in state
      setIsDrawerOpen(true); // Open the drawer
      return;
    }

    // If no automations, proceed with job creation
    const myHeaders = {
      "Content-Type": "application/json",
    };

    const data = {
      accounts: combinedaccountValues,
      stageid: selectedStage?.value,
      pipeline: pipelineId,
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

    // console.log(data);

    axios
      .request(config)
      .then((response) => {
        console.log("Job created successfully");
        console.log("");
        toast.success("Job created successfully");
        handleDrawerClose();
        fetchJobData();
      })
      .catch((error) => {
        console.error("Failed to create Job Template:", error);
        toast.error("Failed to create Job");
      });
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

    setStageAutomations((prev) => {
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

    setStageAutomations((prev) => {
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
  const DrawerContent = () => {
const [isProcessing, setIsProcessing] = useState(false);

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
    const [adminusername, setAdminUsername] = useState("");
    const [selectedAutomations, setSelectedAutomations] = useState([]);
    const [templateData, setTemplateData] = useState({});
    const [tagData, setTagData] = useState({});

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
    useEffect(() => {
      const initializeAutomationData = async () => {
        const templatePromises = stageAutomations.map(
          async (automation, index) => {
            if (automation.selectedtemp && automation.refModel) {
              const templateName = await fetchTemplateData(
                automation.selectedtemp,
                automation.refModel
              );
              return { index, templateName };
            }
            return { index, templateName: null };
          }
        );

        const tagPromises = stageAutomations.map(async (automation, index) => {
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
    }, [stageAutomations]);

    useEffect(() => {
      const allIndices = stageAutomations.map((_, index) => index);
      setSelectedAutomations(allIndices);
    }, [stageAutomations]);

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
                const automation = stageAutomations[automationIndex];
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
          // navigate("/jobs/activejob");
        }

        setIsDrawerOpen(false);
        // handleNewDrawerClose();
      } catch (error) {
        console.error("Operation failed:", error);
        toast.error(`Operation failed: ${error.message}`);
      }
      finally {
    setIsProcessing(false); // 🔑 ENABLE BUTTONS AGAIN
  }
    };

    const createJob = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const clientStatusAutomation = stageAutomations.find(
        (automation) => automation.type === "Update client-facing job status"
      );

      const assigneesAutomation = stageAutomations.find(
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
            pipeline: pipelineId,
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

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Stage Automations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(combinedaccountValues || []).map((accountId) => {
                const account = accountdata.find((a) => a._id === accountId);
                return account ? account.accountName : null;
              }).filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {stageAutomations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <svg className="h-8 w-8 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <p className="text-sm font-medium text-muted-foreground">No automations for this stage</p>
            </div>
          ) : (
            stageAutomations.map((automation, index) => {
              const currentTagData = tagData[index] || {};
              const templateName = templateData[index] || "Loading...";
              const allAccountsHaveMatchingTags = (combinedaccountValues || []).every(
                (accountId) => checkTagMatch(automation.selectedTags, accountId)
              );
              return (
                <div key={index} className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedAutomations.includes(index)}
                      onCheckedChange={() => handleCheckboxChange(index)}
                      disabled={!allAccountsHaveMatchingTags}
                    />
                    <span className="text-sm font-semibold text-foreground">{automation.type}</span>
                    {!allAccountsHaveMatchingTags && (
                      <span className="ml-auto text-xs text-destructive">Tags do not match</span>
                    )}
                  </div>

                  {automation.selectedtemp && (
                    <div className="pl-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Template</p>
                      <p className="text-sm text-foreground mt-0.5">{templateName}</p>
                    </div>
                  )}

                  {currentTagData.selectedTags?.length > 0 && (
                    <div className="pl-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Condition Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {currentTagData.selectedTags.map((tag) => (
                          <span key={tag._id} className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {automation.type === "Update account tags" && currentTagData.addTags?.length > 0 && (
                    <div className="pl-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Adding Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {currentTagData.addTags.map((tag) => (
                          <span key={tag._id} className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ring-1 ring-emerald-400/60" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {automation.type === "Update account tags" && currentTagData.removeTags?.length > 0 && (
                    <div className="pl-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Removing Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {currentTagData.removeTags.map((tag) => (
                          <span key={tag._id} className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white line-through ring-1 ring-destructive/40" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {automation.type === "Update client-facing job status" && (
                    <div className="pl-6 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Client Status</p>
                      {automation.selectedClientStatus && (
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: clientStatusOptions?.find((opt) => opt.value === automation.selectedClientStatus)?.clientfacingColour || "hsl(var(--muted-foreground))" }} />
                          <span className="text-sm text-foreground">{clientStatusOptions?.find((opt) => opt.value === automation.selectedClientStatus)?.label || "Not set"}</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{automation.status ? "Visible to client" : "Hidden from client"}</p>
                      {automation.statusDescription && <p className="text-xs text-muted-foreground">{automation.statusDescription}</p>}
                    </div>
                  )}

                  {automation.type === "Update account tags" && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border text-sm">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                      <span className="text-muted-foreground">This automation can affect conditions for automations below</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-border px-5 py-4 flex items-center gap-3">
          <Button onClick={handleMove} disabled={isProcessing}>Move Job</Button>
          <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
        </div>
      </div>
    );
  };
  const selectClass = "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5";

  return (
    <>
      <div className="overflow-y-auto p-5 jobs-add-container space-y-5">

        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Job Details</p>

          <div>
            <label className={labelClass}>Accounts</label>
            <AccountMultiSelectDropdown
              value={selectedaccount}
              onChange={handleAccountChange}
              placeholder="Select accounts"
              options={accountoptions}
            />
          </div>

          <div>
            <label className={labelClass}>Stage</label>
            <select
              value={selectedStage?.value || ""}
              onChange={(e) => {
                const opt = stagesoptions.find((o) => o.value === e.target.value);
                handleStageChange(e, opt);
              }}
              className={selectClass}
            >
              <option value="" disabled>Select a stage</option>
              {stagesoptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Template</label>
            <select
              value={selectedtemp?.value || ""}
              onChange={(e) => {
                const opt = optiontemp.find((o) => o.value === e.target.value);
                handletemp(e, opt);
              }}
              className={selectClass}
            >
              <option value="" disabled>Select a job template</option>
              {optiontemp.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Job Name</label>
            <Input
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="Enter job name"
            />
          </div>

          <div>
            <label className={labelClass}>Assignees</label>
            <MultiSelectDropdown
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Select assignees"
            />
          </div>

          <div>
            <Priority
              onPriorityChange={handlePriorityChange}
              selectedPriority={priority}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <Editor
              initialContent={description}
              onChange={handleEditorChange}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dates</p>
            <div className="flex items-center gap-2">
              <Switch checked={absoluteDate} onCheckedChange={handleAbsolutesDates} />
              <span className="text-xs text-muted-foreground">Absolute dates</span>
            </div>
          </div>

          {absoluteDate ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date</label>
                <Input
                  type="date"
                  value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""}
                  onChange={(e) => handleStartDateChange(e.target.value ? dayjs(e.target.value) : null)}
                />
              </div>
              <div>
                <label className={labelClass}>Due Date</label>
                <Input
                  type="date"
                  value={dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : ""}
                  onChange={(e) => handleDueDateChange(e.target.value ? dayjs(e.target.value) : null)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Starts In</label>
                <div className="flex gap-2">
                  <Input
                    value={startsin}
                    onChange={(e) => setstartsin(e.target.value)}
                    className="w-20"
                    placeholder="0"
                  />
                  <select
                    value={startsInDuration || ""}
                    onChange={(e) => { const opt = dayOptions.find((o) => o.value === e.target.value); handleStartInDateChange(e, opt); }}
                    className={selectClass}
                  >
                    <option value="" disabled>Unit</option>
                    {dayOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Due In</label>
                <div className="flex gap-2">
                  <Input
                    value={duein}
                    onChange={(e) => setduein(e.target.value)}
                    className="w-20"
                    placeholder="0"
                  />
                  <select
                    value={dueinduration || ""}
                    onChange={(e) => { const opt = dayOptions.find((o) => o.value === e.target.value); handleDueInDateChange(e, opt); }}
                    className={selectClass}
                  >
                    <option value="" disabled>Unit</option>
                    {dayOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client Portal</p>
            <div className="flex items-center gap-2">
              <Switch checked={clientFacingStatus} onCheckedChange={handleClientFacing} />
              <span className="text-xs text-muted-foreground">Show in client portal</span>
            </div>
          </div>

          {clientFacingStatus && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Job name for client</label>
                <Input
                  name="subject"
                  value={inputText + selectedJobShortcut}
                  onChange={handlechatsubject}
                  placeholder="Visible job name in client portal"
                />
              </div>

              <div>
                <label className={labelClass}>Client status</label>
                <select
                  value={selectedJob?.value || ""}
                  onChange={(e) => { const opt = optionstatus.find((o) => o.value === e.target.value); handleJobChange(e, opt); }}
                  className={selectClass}
                >
                  <option value="" disabled>Select client-facing status</option>
                  {optionstatus.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Client description</label>
                <div className="relative">
                  <textarea
                    value={clientDescription}
                    onChange={handleChange}
                    placeholder="Description visible to client"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-muted-foreground pointer-events-none">
                    {charCount}/{charLimit}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pb-4">
          <Button onClick={createjob}>Save Job</Button>
          <Button variant="outline" onClick={handleDrawerClose}>Cancel</Button>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="ml-auto relative z-50 w-full max-w-[520px] bg-background h-full flex flex-col shadow-2xl">
            <DrawerContent selectedAccounts={combinedaccountValues} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddJobs;
