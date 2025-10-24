// NewTaskDrawer.js
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  InputLabel,
  IconButton,
  Autocomplete,
  TextField,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Checkbox,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import TagsMultiSelectDropDown  from "../Templates/TagsMultiSelectDropDown"
import MultiSelectDropdown from "../Templates/MultiSelectDropdown"
import { IoChevronBackOutline } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import Editor from "../Templates/Texteditor/Editor";
import Grid from "@mui/material/Unstable_Grid2";
import Priority from "../Templates/Priority/Priority";
import Status from "../Templates/Status/Status";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const NewTaskDrawer = ({ open, onClose, isEditMode, taskData }) => {

 
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  //****************Accounts */
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState(null);

  const handleAccountChange = (selectedOptions) => {
    setSelectedaccount(selectedOptions);
    console.log("aacounts", selectedOptions);

      fetchJobList(selectedOptions.value); // Fetch jobs based on selected account ID
  
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/account/accountdetailslist/true`);
      const data = await response.json();
      setaccountdata(data.accountlist);
      console.log("accountlist",data.accountlist)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // console.log(userdata);
  const accountoptions = accountdata.map((account) => ({
    value: account.id,
    label: account.Name,
  }));

  //   *********joblist*******
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [joblist, setJoblist] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobChange = async (selectedOptions) => {
    setSelectedJob(selectedOptions)
    console.log(selectedOptions.value)
  }

  const fetchJobList = async (accountId) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `${JOBS_API}/workflow/jobs/accountjoblist/${accountId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setJoblist(result.jobList);
      })
      .catch((error) => console.error(error));
  };
  const jobsoptions = joblist.map((job) => ({
    value: job.id,
    label: job.Name,
    group: job.Pipeline,
  }));

  //   ******TASK TEMP ******
  const [taskTemplates, setTaskTemplates] = useState([]);
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const fetchTaskTemplates = async () => {
    try {
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      const response = await fetch(url);
      const data = await response.json();
      setTaskTemplates(data.TaskTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const taskTemplateOptions = taskTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  useEffect(() => {
    fetchTaskTemplates();
  }, []);
  const [selectedtemp, setselectedTemp] = useState(null);
  const [tempNameNew, setTempNameNew] = useState("");
  const [tagsNew, setTagsNew] = useState([]);
 

  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("No status");
  const [StartsDateNew, setStartsDateNew] = useState(null);
  const [DueDateNew, setDueDateNew] = useState(null);

  const [subtasks, setSubtasks] = useState([]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  // const handleCheckboxChange = (subtaskId) => {
  //   setSubtasks((prevSubtasks) =>
  //     prevSubtasks.map((subtask) =>
  //       subtask.id === subtaskId
  //         ? { ...subtask, checked: true } // Always set checked to true
  //         : subtask
  //     )
  //   );
  
  //   setCheckedSubtasks((prevCheckedSubtasks) =>
  //     prevCheckedSubtasks.includes(subtaskId)
  //       ? prevCheckedSubtasks // Keep already checked items
  //       : [...prevCheckedSubtasks, subtaskId] // Add new checked item
  //   );
  // };

// Fixed checkbox handler - properly toggles checked state
  const handleCheckboxChange = (subtaskId) => {
    setSubtasks(prevSubtasks =>
      prevSubtasks.map(subtask =>
        subtask.id === subtaskId
          ? { ...subtask, checked: !subtask.checked } // Toggle checked state
          : subtask
      )
    );
  };
    // Fixed add subtask function
  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);// Use timestamp for unique ID
    setSubtasks([...subtasks, { 
      id: newId, 
      text: "", 
      checked: false // Initialize with unchecked state
    }]);
  };
  // const handleAddSubtask = () => {
  //   const newId = String(subtasks.length + 1);
  //   setSubtasks([...subtasks, { id: newId, text: "" }]);
  // };

  // const handleDragEnd = (result) => {
  //   // Ensure a valid drop location
  //   if (!result.destination) return;

  //   // Reorder subtasks based on the drag-and-drop result
  //   const newSubtasks = Array.from(subtasks);
  //   const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
  //   newSubtasks.splice(result.destination.index, 0, reorderedItem);

  //   // Update the state with the new order of subtasks
  //   setSubtasks(newSubtasks);
  // };
 // Fixed drag end handler
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);

    setSubtasks(newSubtasks);
  }
  // const handleInputChange = (id, value) => {
  //   setSubtasks(
  //     subtasks.map((subtask) =>
  //       subtask.id === id ? { ...subtask, text: value } : subtask
  //     )
  //   );
  // };
 // Fixed input change handler
  const handleInputChange = (id, value) => {
    setSubtasks(subtasks.map(subtask =>
      subtask.id === id ? { ...subtask, text: value } : subtask
    ));
  };
  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const handleSubtaskSwitch = (checked) => {
    setSubtaskSwitch(checked);
  };

  const handleStartDateChange = (date) => {
    setStartsDateNew(date);
  };
  const handleDueDateChange = (date) => {
    setDueDateNew(date);
  };

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleStatusChange = (status) => {
    setStatus(status);
    console.log(status);
  };
  // const [description, setDescription] = useState('');
  const handleEditorChange = (content) => {
    setTaskDescription(content);
  };
  const [taskDiscription, setTaskDescription] = useState();
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

    const [selectedUser, setSelectedUser] = useState([]);
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers)
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues)
  };
  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState();
  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const url = ` ${TAGS_API}/tags/`;

      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
      //   console.log(data.tags)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
 
  const handleTagChange = (newSelectedTags) => {
    setTagsNew(newSelectedTags);
    console.log(newSelectedTags)
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedTagsValues(selectedValues);
    console.log(selectedValues)
  };
 
  const [tempvalues, setTempValues] = useState();

  const handletemp = async (event, newValue) => {
    setselectedTemp(newValue);
    if (newValue && newValue.value) {
      const templateId = newValue.value;
      try {
        const response = await fetch(
          `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${templateId}`
        );
        const data = await response.json();
        
        console.log("tasktemp",data)
        if (data.taskTemplate && Array.isArray(data.taskTemplate.taskassignees)) {
          // Flatten the array in case of unnecessary nesting
          const flatAssignees = data.taskTemplate.taskassignees.flat();
      
          if (flatAssignees.length > 0) {
              const assigneesData = flatAssignees.map(assignee => ({
                  value: assignee._id,
                  label: assignee.username,
              }));
      
              setSelectedUser(assigneesData);
      
              const selectedValues = assigneesData.map(option => option.value);
              setCombinedValues(selectedValues);
          } else {
              console.log("taskassignees contains an unexpected structure.");
          }
      }
        // Process tasktags
        if (
          data.taskTemplate.tasktags &&
          Array.isArray(data.taskTemplate.tasktags)
        ) {
          const tagsData = data.taskTemplate.tasktags.map((tag) => ({
            value: tag._id,
            label: tag.tagName,
            color: tag.tagColour, // Include color if needed
            customTagStyle: {
              backgroundColor: tag.tagColour,
              color: "#fff",
              borderRadius: "30px",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "5px",
              padding: "2px,8px",
              fontSize: "10px",
              // width: ${calculateWidth(tag.tagName)}px,
              margin: "7px",
              cursor: "pointer",
            },
          }));
          // console.log("Tags Data:", tagsData); // Log the processed tagsData

          setTagsNew(tagsData); // Assuming you have a setTags function to update your state
          const selectedTagsValues = tagsData.map((option) => option.value);
          setCombinedTagsValues(selectedTagsValues);
          console.log("Tags Data:", selectedTagsValues);
        } else {
          console.log("tasktags is not defined or not an array.");
        }

        setTempValues(data.taskTemplate);
        tempallvalue();

        // Extract and process subtasks
         // FIXED: Process subtasks with proper structure
        if (data.taskTemplate && Array.isArray(data.taskTemplate.subtasks)) {
          const formattedSubtasks = data.taskTemplate.subtasks.map((subtask, index) => ({
            id: subtask.id || `subtask-${index}-${Date.now()}`, // Ensure unique ID
            text: subtask.text || "",
            checked: subtask.checked || false // Ensure checked property exists
          }));
          console.log("Formatted Subtasks:", formattedSubtasks);
          setSubtasks(formattedSubtasks);
        } else {
          console.log("subtasks is not defined or not an array.");
          setSubtasks([]); // Reset to empty array if no subtasks
        }
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    }
  };
  useEffect(() => {
    if (tempvalues) {
      tempallvalue();
    }
  }, [tempvalues]);
  const tempallvalue = () => {
    if (tempvalues) {
      console.log(tempvalues);
      setTempNameNew(tempvalues.templatename || "");
      setStatus(tempvalues.status || "");
      setTaskDescription(tempvalues.description || "");
      setPriority(tempvalues.priority || "");

      setStartsDateNew(dayjs(tempvalues.startdate) || null);
      setDueDateNew(dayjs(tempvalues.enddate) || null);

      setSubtaskSwitch(tempvalues.issubtaskschecked || false);
      // console.log(tempvalues.isclienttaskchecked)
      setSubtasks(tempvalues.subtasks);
    }
  };

  useEffect(() => {
    if (isEditMode && taskData) {

      console.log("tasksData",taskData)
      
      // Pre-fill form fields with taskData
      setTempNameNew(taskData.taskList.Name  || "");
      setStatus(taskData.taskList.Status  || "");
      setTaskDescription(taskData.taskList.Descriptions || "");
      setPriority(taskData.taskList.Priority || "");
      setStartsDateNew(dayjs(taskData.taskList.StartDate) || null);
      setDueDateNew(dayjs(taskData.taskList.DueDate ) || null);
      setSubtaskSwitch(taskData.taskList.SubtaskCheck || false);

      // Pre-fill assignees
      if (taskData.taskList && taskData.taskList.Assignees) {
        const assigneesData = taskData.taskList.Assignees.map((assignee) => ({
            value: assignee._id,
            label: assignee.username,
        }));
    
        setSelectedUser(assigneesData);
    
        const selectedValues = assigneesData.map((option) => option.value);
        setCombinedValues(selectedValues);
    }
   
      // Pre-fill tags
      if (taskData.taskList && Array.isArray(taskData.taskList.Tags)) {
        const tagsData = taskData.taskList.Tags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          color: tag.tagColour,
        }));
        setTagsNew(tagsData);
        setCombinedTagsValues(tagsData.map((option) => option.value));
      }

     if (taskData.taskList.SubtaskList && Array.isArray(taskData.taskList.SubtaskList)) {
        const formattedSubtasks = taskData.taskList.SubtaskList.map((subtask, index) => ({
          id: subtask.id || `edit-subtask-${index}-${Date.now()}`,
          text: subtask.text || "",
          checked: subtask.checked || false // Ensure checked property exists
        }));
        setSubtasks(formattedSubtasks);
      } else {
        setSubtasks([]);
      }

      if (taskData.taskList && taskData.taskList.Accounts) {
        const accountData = {
          value: taskData.taskList.Accounts._id,
          label: taskData.taskList.Accounts.accountName  ,
        };
       
        console.log(accountData);
        setSelectedaccount(accountData)
      }

      if (taskData.taskList && taskData.taskList.Job) {
        const jobData = {
          value: taskData.taskList.Job._id,
          label: taskData.taskList.Job.Name ,
        };
       
        console.log(jobData);
        setSelectedJob(jobData)
      }
      if (taskData.taskList && taskData.taskList.TaskTemp) {
        const taskTempData = {
          value: taskData.taskList.TaskTemp._id,
          label: taskData.taskList.TaskTemp.Name ,
        };
       
        console.log(taskTempData);
        setselectedTemp(taskTempData)
      }
    }
  }, [isEditMode, taskData]);
console.log("accounts",selectedaccount)


  const navigate = useNavigate();
const [errors, setErrors] = useState({ account: false, template: false });

const createTask = async () => {
let hasError = false;

  if (!selectedaccount?.value) {
    setErrors((prev) => ({ ...prev, account: true }));
    hasError = true;
  } else {
    setErrors((prev) => ({ ...prev, account: false }));
  }

  if (!selectedtemp?.value) {
    setErrors((prev) => ({ ...prev, template: true }));
    hasError = true;
  } else {
    setErrors((prev) => ({ ...prev, template: false }));
  }

  if (hasError) {
    toast.error("Please fill in the required fields");
    return;
  }
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // const subtaskData = subtasks.map(({ id, text }) => ({
  //   id,
  //   text,
  //   checked: checkedSubtasks.includes(id),
  // }));
    const subtaskData = subtasks.map(({ id, text, checked }) => ({
    id,
    text,
    checked: checked || false, // Use the checked property from subtask, default to false if undefined
  }));
  console.log("Subtask data being saved:", subtaskData);
  const raw = JSON.stringify({
    accounts: selectedaccount?.value,
    job: selectedJob?.value,
    templatename: selectedtemp?.value,
    taskname: tempNameNew,
    status: status,
    taskassignees: combinedValues,
    priority: priority,
    description: taskDiscription,
    tasktags: combinedTagsValues,
    issubtaskschecked: SubtaskSwitch,
    startdate: StartsDateNew,
    enddate: DueDateNew,
    subtasks: subtaskData,
  });
console.log("rew",raw)
  const requestOptions = {
    method: isEditMode ? "PATCH" : "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const url = isEditMode
    ? `${ACCOUNT_TASKS_API}/accountstasks/updatatasks/${taskData.taskList.id}`
    : `${ACCOUNT_TASKS_API}/accountstasks/newtask`;

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("jaja",result);
      toast.success(isEditMode ? "Task Updated successfully" : "Task Created successfully");
      onClose();
      

      if (!isEditMode) {
         // Navigate to the workflow page after task creation
         if (selectedaccount?.value) {
          navigate(`/clients/accounts/accountsdash/workflow/${selectedaccount.value}/pendingtasks`);
        }

        // Clear all fields after successful submission
        setselectedTemp(null);
        setSelectedJob(null);
        setSelectedaccount(null);
        setTempNameNew("");
        setStatus("");
        setCombinedValues([]);
        setSelectedUser([]);
        setPriority("");
        setTaskDescription("");
        setCombinedTagsValues([]);
        setSubtaskSwitch(false);
        setStartsDateNew(null);
        setDueDateNew(null);
        setSubtasks([]);
        setCheckedSubtasks([]);
      }
    })
    .catch((error) => console.error(error));
};
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={1.5}
        >
          <Typography variant="h6">
          {isEditMode ? "Edit Task" : "New Task"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: "0 10px", height: "83vh", overflowY: "auto" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box mt={2}>
              <Box>
                <InputLabel sx={{ color: "black" }}>
                Accounts
                </InputLabel>

                <Autocomplete
                  options={accountoptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedaccount}
                  onChange={(event, newValue) => {
    handleAccountChange(newValue);
    // clear error if value selected
    setErrors((prev) => ({ ...prev, account: !newValue }));
  }}
                  // onChange={(event, newValue) => handleAccountChange(newValue)}
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
                      placeholder="Select Account"
                      variant="outlined"
                      size="small"
                      sx={{ backgroundColor: "#fff" }}  error={errors.account}
      helperText={errors.account ? "Account is required" : ""}
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                />
              </Box>
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Job</InputLabel>
                <Autocomplete
                  options={jobsoptions}
                  groupBy={(option) => option.group} // Group by pipeline name
                  value={selectedJob}
                  disabled={!selectedaccount}
                  onChange={(event, newValue) =>
                    handleJobChange(newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Job"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  getOptionLabel={(option) => option.label}
                  sx={{ width: "100%", mt: 1 }}
                />
              </Box>
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Template</InputLabel>
                <Autocomplete
                  options={taskTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  // onChange={handletemp}
                   onChange={(event, newValue) => {
    handletemp(event, newValue); // pass both args properly
    // clear error if value selected
    setErrors((prev) => ({ ...prev, template: !newValue }));
  }}
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
                    <>
                      <TextField
                        {...params}
                        // helperText={templateError}
                        sx={{ backgroundColor: "#fff" }}
                        placeholder="Select Template"
                        variant="outlined"
                        size="small"  error={errors.template}
      helperText={errors.template ? "Template is required" : ""}
                      />
                    </>
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape // Enable clearable functionality
                />
              </Box>

              <Box sx={{ width: "100%", mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} pr={3}>
                    <Box>
                      <InputLabel sx={{ color: "black" }}>
                        Task Assignee
                      </InputLabel>
                      
                      <MultiSelectDropdown 
                        value={selectedUser}
                        onChange={handleUserChange}
                        placeholder="Assignees"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Status
                        onStatusChange={handleStatusChange}
                        selectedStatus={status}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ width: "100%", mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <label className="task-input-label">Template Name</label>
                      <TextField
                        fullWidth
                        name="TemplateName"
                        placeholder="Template Name"
                        size="small"
                        margin="normal"
                        sx={{ background: "#fff" }}
                        onChange={(e) => setTempNameNew(e.target.value)}
                        value={tempNameNew}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Priority
                        onPriorityChange={handlePriorityChange}
                        selectedPriority={priority}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mt: 2, mb: 7 }}>
                <InputLabel sx={{ color: "black", mb: 2 }}>
                  Description
                </InputLabel>
                <Editor
                  initialContent={taskDiscription}
                  onChange={handleEditorChange}
                />
              </Box>
              <Box mt={2} mr={1}>
                <InputLabel sx={{ color: "black", mb: 1 }}>Tags</InputLabel>
               
                                   <TagsMultiSelectDropDown 
                  value={tagsNew}
                  onChange={handleTagChange}
                  placeholder="Tags"
                />
              </Box>
              <Box mt={2}>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography className="task-input-label">
                    Start Date
                  </Typography>
                  <DatePicker
                     format="MM/DD/YYYY"
                    sx={{ width: "100%", backgroundColor: "#fff" }}
                    value={StartsDateNew}
                    onChange={handleStartDateChange}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography className="task-input-label">Due Date</Typography>
                  <DatePicker
                  format="MM/DD/YYYY"
                    sx={{ width: "100%", backgroundColor: "#fff" }}
                    value={DueDateNew}
                    onChange={handleDueDateChange}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                </Box>
              </Box>
              <Box mt={2}>
                {/* <DragDropContext onDragEnd={handleDragEnd}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">Subtasks</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(event) =>
                            handleSubtaskSwitch(event.target.checked)
                          }
                          checked={SubtaskSwitch}
                          color="primary"
                        />
                      }
                    />
                  </Box>

                  {SubtaskSwitch && (
                    <Droppable droppableId="subtaskList">
                      {(provided) => (
                        <div
                          className="subtask-input"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {(subtasks.length > 0
                            ? subtasks
                            : [{ id: "default", text: "" }]
                          ).map((subtask, index) => (
                            <Draggable
                              key={subtask.id}
                              draggableId={subtask.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Box
                                    display="flex"
                                    gap="30px"
                                    alignItems="center"
                                  >
                                    <Checkbox
                                      style={{ cursor: "pointer" }}
                                      // checked={checkedSubtasks.includes(subtask.id)}
                                      checked={subtask.checked}
                                      onChange={() =>
                                        handleCheckboxChange(subtask.id)
                                      }
                                    />
                                    <TextField
                                      placeholder="Things To do"
                                      value={subtask.text}
                                      size="small"
                                      margin="normal"
                                      fullWidth
                                      onChange={(e) =>
                                        handleInputChange(
                                          subtask.id,
                                          e.target.value
                                        )
                                      }
                                      variant="outlined"
                                    />
                                    <IconButton
                                      onClick={() =>
                                        handleDeleteSubtask(subtask.id)
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <RiDeleteBin6Line />
                                    </IconButton>
                                    <IconButton style={{ cursor: "move" }}>
                                      <PiDotsSixVerticalBold />
                                    </IconButton>
                                  </Box>
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                          <Box
                            sx={{ cursor: "pointer" }}
                            onClick={handleAddSubtask}
                            style={{ margin: "10px", color: "#1976d3" }}
                          >
                            <FiPlusCircle /> Add Subtasks
                          </Box>
                        </div>
                      )}
                    </Droppable>
                  )}
                </DragDropContext> */}
                 <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <Typography variant="h6">Subtasks</Typography>
              <FormControlLabel
                control={
                  <Switch
                    onChange={(event) => handleSubtaskSwitch(event.target.checked)}
                    checked={SubtaskSwitch}
                    color="primary"
                  />
                }
              />
            </Box>

            {SubtaskSwitch && (
              <Droppable droppableId="subtaskList">
                {(provided) => (
                  <div
                    className="subtask-input"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {subtasks.map((subtask, index) => (
                      <Draggable
                        key={subtask.id} // Use the actual ID from state
                        draggableId={subtask.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Box
                              display="flex"
                              gap="30px"
                              alignItems="center"
                              sx={{
                                textDecoration: subtask.checked ? 'line-through' : 'none',
                                opacity: subtask.checked ? 0.7 : 1
                              }}
                            >
                              <Checkbox
                                style={{ cursor: "pointer" }}
                                checked={subtask.checked || false}
                                onChange={() => handleCheckboxChange(subtask.id)}
                              />
                              <TextField
                                placeholder="Things To do"
                                value={subtask.text}
                                size="small"
                                margin="normal"
                                fullWidth
                                onChange={(e) => handleInputChange(subtask.id, e.target.value)}
                                variant="outlined"
                                sx={{
                                  '& .MuiInputBase-input': {
                                    textDecoration: subtask.checked ? 'line-through' : 'none',
                                  }
                                }}
                                disabled={subtask.checked} // Optional: disable input when checked
                              />
                              <IconButton
                                onClick={() => handleDeleteSubtask(subtask.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <RiDeleteBin6Line />
                              </IconButton>
                              <IconButton 
                                style={{ cursor: "move" }}
                                {...provided.dragHandleProps}
                              >
                                <PiDotsSixVerticalBold />
                              </IconButton>
                            </Box>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={handleAddSubtask}
                      style={{ margin: "10px", color: "#1976d3" }}
                    >
                      <FiPlusCircle /> Add Subtasks
                    </Box>
                  </div>
                )}
              </Droppable>
            )}
          </DragDropContext>
              </Box>
            </Box>
          </LocalizationProvider>
        </Box>
        <Box mt={2} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button onClick={onClose}>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {" "}
              <IoChevronBackOutline />
              Back
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--color-save-btn)", // Normal background

              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              },
              borderRadius: "15px",
            }}
            onClick={createTask}
          >
           {isEditMode ? "Update Task" : "Create Task"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NewTaskDrawer;
