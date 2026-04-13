import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Priority from "../Priority/Priority";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import dayjs from "dayjs";
import { Switch } from "../../components/ui/switch";
import DatePicker from "react-datepicker";

import customParseFormat from "dayjs/plugin/customParseFormat";
import MultiSelectDropdown from "../MultiSelectDropdown";
import { FormPage, FormSection, FormField, FormRow, FormActions, FormGrid, ShortcodePopover, FormSwitchRow, FormDatePicker, FormSelect, FormComment } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Trash2, MessageSquarePlus, FileText, Calendar, Users, Globe } from "lucide-react";
dayjs.extend(customParseFormat);

const JobTemplateUpdate = ({ charLimit = 4000 }) => {
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;

  const { _id } = useParams(); // Get the job template ID from the URL parameters
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [jobname, setjobname] = useState("");
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [tempNameNew, setTempNameNew] = useState("");
  const [clientStatus, setClientStatus] = useState([]);
  const [AssigneesNew, setAssigneesNew] = useState([]);
  const [PriorityNew, setPriorityNew] = useState();
  const [JobDescriptionNew, setJobDescriptionNew] = useState();
  const [StartsInNew, setStartsInNew] = useState(0);
  const [DueInNew, setDueInNew] = useState(0);
  const [StartsDateNew, setStartsDateNew] = useState(null);
  const [DueDateNew, setDueDateNew] = useState(null);
  const [StartsInDurationNew, setStartsInDurationNew] = useState();
  const [DueInDurationNew, setDueInDurationNew] = useState();
  const [AbsoluteDateNew, setAbsoluteDateNew] = useState();

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);

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

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
  const [cursorPosition, setCursorPosition] = useState(0);
const textFieldRef = useRef(null);
const handleAddShortcut = (shortcut) => {
  setjobname((prevText) => {
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
  //   setjobname((prevText) => prevText + `[${shortcut}]`);
  //   setShowDropdown(false);
  // };
  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  // // Handler function to update state when dropdown value changes
  // const handleStartInDateChange = (event, newValue) => {
  //   setStartsInNew(newValue ? newValue.value : null);
  // };
  // // Handler function to update state when dropdown value changes
  // const handledueindateChange = (event, newValue) => {
  //   setDueInDurationNew(newValue ? newValue.value : null);
  // };
  const handlePriorityChange = (priority) => {
    setPriorityNew(priority);
  };
  const handlejobName = (e) => {
    const { value,selectionStart  } = e.target;
    setjobname(value);
    setCursorPosition(selectionStart);
  };
const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState();
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
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
  // const handleuserChange = (AssigneesNew) => {
  //   setAssigneesNew(AssigneesNew);
  //   // Map selected options to their values and send as an array
  //   const selectedValues = AssigneesNew.map((option) => option.value);
  //   console.log(selectedValues);
  //   setCombinedValues(selectedValues);
  // };
  // const handleuserChange = (event, newValue) => {
  //   setAssigneesNew(newValue);
  //   // Map selected options to their values and send as an array
  //   const selectedValues = newValue.map((option) => option.value);
  //   console.log(selectedValues);
  //   setCombinedValues(selectedValues);
  // };

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers)
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues)
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  const [templateData, setTemplateData] = useState(null);
  const [tempvalues, setTempValues] = useState();
  const [initialData, setInitialData] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [clientDescription, setClientDescription] = useState("");
  useEffect(() => {
    fetchidwiseData();
  }, []);

  //get id wise template Record
  const [clientStatusId, setClientStatusId] = useState("");
  const fetchidwiseData = async () => {
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/jobtemplateList/`;
      const response = await fetch(url + _id);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      console.log("Fetched data:", data);
      setTemplateData(data.jobTemplate);
      setTempValues(data.jobTemplate);

      // Extract assignees data and set it to assigneesOptions state
      if (data.jobTemplate && data.jobTemplate.jobassignees) {
        const assigneesData = data.jobTemplate.jobassignees.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setSelectedUser(assigneesData);

        const selectedValues = assigneesData.map((option) => option.value);
        setCombinedValues(selectedValues);
        console.log(selectedValues);
      }
      
      setClientStatusId(data.jobTemplate.clientfacingstatus._id);
      console.log(data.jobTemplate.clientfacingstatus._id);
      getClientStatusById(data.jobTemplate.clientfacingstatus._id);
      tempallvalue();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(clientStatusId);
  const getClientStatusById = async (clientStatusId) => {
    try {
      const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientStatusId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log(data);
      const formattedStatus = {
        value: data.clientfacingjobstatuses._id,
        label: data.clientfacingjobstatuses.clientfacingName,
        clientfacingColour: data.clientfacingjobstatuses.clientfacingColour,
      };
      setSelectedJob(formattedStatus);
      // setClientDescription(data.clientfacingjobstatuses.clientfacingdescription);
      // console.log(data.clientfacingjobstatuses.clientfacingdescription);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (tempvalues) {
      tempallvalue();
    }
  }, [tempvalues]);

  const tempallvalue = () => {
    setTempNameNew(tempvalues.templatename);
    setjobname(tempvalues.jobname);
    setPriorityNew(tempvalues.priority);
    setJobDescriptionNew(tempvalues.description);
    console.log(tempvalues.description);
    setStartsInNew(tempvalues.startsin);
    setDueInNew(tempvalues.duein);
    setStartsDateNew(dayjs(tempvalues.startdate)); // Ensure this is in the correct format
    setDueDateNew(dayjs(tempvalues.enddate)); // Ensure this is in the correct format
    // setStartsDateNew(tempvalues.startdate);
    // console.log(tempvalues.startdate)
    // setDueDateNew(tempvalues.enddate);
    // console.log(tempvalues.enddate)
    setStartsInDurationNew(tempvalues.startsinduration);
    setDueInDurationNew(tempvalues.dueinduration);
    setAbsoluteDateNew(tempvalues.absolutedates);
    setComments(tempvalues.comments || []);
    setClientFacingStatus(tempvalues.showinclientportal);
    setInputText(tempvalues.jobnameforclient);
    setClientDescription(tempvalues.clientfacingDescription);
    // setSelectedJob(tempvalues.clientfacingstatus.clientfacingName)
  };

  // client facing integration

  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDecription] = useState(null);
  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);

  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);

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
  // const handleDescriptionAddShortcut = (shortcut) => {
  //   const updatedTextValue = clientDescription + `[${shortcut}]`;
  //   if (updatedTextValue.length <= charLimit) {
  //     setClientDescription(updatedTextValue);
  //     console.log(updatedTextValue);
  //     setCharCount(updatedTextValue.length);
  //   }
  //   setShowDropdownDescription(false);
  // };
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

  // const handleJobAddShortcut = (shortcut) => {
  //   setInputText((prevText) => prevText + `[${shortcut}]`);
  //   setShowDropdownClientJob(false);
  // };
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
  const handleEditorChange = (content) => {
    setJobDescriptionNew(content);
  };

  const handleAbsolutesDates = (checked) => {
    setAbsoluteDateNew(checked);
  };

  const handleStartDateChange = (date) => {
    setStartsDateNew(date);
  };

  const handleDueDateChange = (date) => {
    setDueDateNew(date);
  };

  const updatejobtemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: tempNameNew,
      jobname: jobname,
      jobassignees: combinedValues,
      addshortcode: "",
      priority: PriorityNew,
      description: JobDescriptionNew,
      absolutedates: AbsoluteDateNew,
      startsin: StartsInNew,
      startsinduration: StartsInDurationNew,
      duein: DueInNew,
      dueinduration: DueInDurationNew,
      comments: comments,
      startdate: StartsDateNew,
      enddate: DueDateNew,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob?.value,
      clientfacingDescription: clientDescription,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/`;
    fetch(url + _id, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Job Template updated successfully");
        navigate("/firmtemp/templates/jobs");
        // setTimeout(() => navigate("/firmtemplates/jobs"), 1000);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to create Job Template");
      });
  };
  const updatesavejobtemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: tempNameNew,
      jobname: jobname,
      jobassignees: combinedValues,
      addshortcode: "",
      priority: PriorityNew,
      description: JobDescriptionNew,
      absolutedates: AbsoluteDateNew,
      startsin: StartsInNew,
      startsinduration: StartsInDurationNew,
      duein: DueInNew,
      dueinduration: DueInDurationNew,
      comments: comments,
      startdate: StartsDateNew,
      enddate: DueDateNew,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob?.value,
      clientfacingDescription: clientDescription,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/`;
    fetch(url + _id, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((result) => {
        toast.success("Job Template updated successfully");
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to create Job Template");
      });
  };

  const hasUnsavedChanges = () => {
    return tempNameNew !== initialData.templatename || jobname !== initialData.jobname || PriorityNew !== initialData.priority || JobDescriptionNew !== initialData.description || StartsInNew !== initialData.startsin || DueInNew !== initialData.duein || !dayjs(StartsDateNew).isSame(dayjs(initialData.startdate)) || !dayjs(DueDateNew).isSame(dayjs(initialData.enddate)) || StartsInDurationNew !== initialData.startsinduration || DueInDurationNew !== initialData.dueinduration || AbsoluteDateNew !== initialData.absolutedates;
  };

  const handleJobTempCancle = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        navigate("/firmtemp/templates/jobs");
      }
    } else {
      navigate("/firmtemp/templates/jobs");
    }
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

  return (
   
      <FormPage
        title="Edit Job Template"
        subtitle="Update your job template configuration"
        actions={
          <>
            <Button variant="outline" onClick={handleJobTempCancle}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={updatesavejobtemp}>
              Save
            </Button>
            <Button onClick={updatejobtemp}>
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
              <FormField label="Template Name">
                <Input
                  placeholder="Template Name"
                  onChange={(e) => setTempNameNew(e.target.value)}
                  value={tempNameNew}
                />
              </FormField>

              <FormField label="Job Name">
                <div className="space-y-2">
                  <Input
                    value={jobname}
                    ref={textFieldRef}
                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                    onChange={handlejobName}
                    placeholder="Job Name"
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
                <Priority onPriorityChange={handlePriorityChange} selectedPriority={PriorityNew} />
              </FormField>
            </FormSection>

            {/* Description Section */}
            <FormSection title="Description">
              <EditorShortcodes initialContent={JobDescriptionNew} onChange={handleEditorChange} />
            </FormSection>

            {/* Scheduling Section */}
            <FormSection title="Start and Due Date" icon={<Calendar className="h-4 w-4" />}>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Use Absolute Dates</Label>
                <Switch
                  checked={AbsoluteDateNew}
                  onCheckedChange={handleAbsolutesDates}
                />
              </div>

              {AbsoluteDateNew && (
                <FormRow cols={2}>
                  <FormField label="Start Date">
                    <DatePicker format="MM/DD/YYYY" sx={{ width: "100%" }} value={StartsDateNew} onChange={handleStartDateChange} slotProps={{ textField: { size: "small" } }} />
                  </FormField>
                  <FormField label="Due Date">
                    <DatePicker format="MM/DD/YYYY" sx={{ width: "100%" }} value={DueDateNew} onChange={handleDueDateChange} slotProps={{ textField: { size: "small" } }} />
                  </FormField>
                </FormRow>
              )}

              {!AbsoluteDateNew && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Label className="w-16 shrink-0 text-sm">Start In</Label>
                    <Input
                      value={StartsInNew}
                      onChange={(e) => setStartsInNew(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={StartsInDurationNew} onValueChange={setStartsInDurationNew}>
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
                      value={DueInNew}
                      onChange={(e) => setDueInNew(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={DueInDurationNew} onValueChange={setDueInDurationNew}>
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
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    </select>
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
   
  );
};

export default JobTemplateUpdate;
