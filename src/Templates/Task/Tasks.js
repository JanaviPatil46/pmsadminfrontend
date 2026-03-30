import React, { useState, useEffect, useMemo } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  TablePagination,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Editor from "../Texteditor/Editor";
import Priority from "../Priority/Priority";
import Status from "../Status/Status";
import { toast } from "react-toastify";
import axios from "axios";
import debounce from "lodash.debounce";
import { CiMenuKebab } from "react-icons/ci";
import MultiSelectDropdown from "../MultiSelectDropdown";
import TagsMultiSelectDropDown from "../TagsMultiSelectDropDown";
import { FormPage, FormSection, FormField, FormRow, FormGrid } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Checkbox } from "../../components/ui/checkbox";
import { Trash2, Plus, GripVertical, FileText, Calendar, ListChecks } from "lucide-react";

const Tasks = () => {
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

  const navigate = useNavigate();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [templatename, settemplatename] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [startsin, setstartsin] = useState("");
  const [duein, setduein] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("No status");
  const [startsInDuration, setStartsInDuration] = useState("Days");
  const [dueinduration, setdueinduration] = useState("Days");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState();
  const [userData, setUserData] = useState([]);
console.log("starts in number",startsin)
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prevChecked) =>
      prevChecked.includes(id)
        ? prevChecked.filter((checkedId) => checkedId !== id)
        : [...prevChecked, id]
    );
  };

  const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "" }]);
  };
  const handleInputChange = (id, value) => {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, text: value } : subtask
      )
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const handleSubtaskSwitch = (checked) => {
    setSubtaskSwitch(checked);
     if (checked && subtasks.length === 0) {
    setSubtasks([{ id: '1', text: '', checked: false }]);
  }
  };
  const handleDragEnd = (result) => {
    // Ensure a valid drop location
    if (!result.destination) return;
    // Reorder subtasks based on the drag-and-drop result
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);
    // Update the state with the new order of subtasks
    setSubtasks(newSubtasks);
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
  const handleCreateTask = () => {
    setShowForm(true);
  };

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleStatusChange = (status) => {
    setStatus(status);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  // console.log(combinedValues)
  useEffect(() => {
    fetchData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("task assigne", data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

// Add this handler function
const handleUserChange = (newSelectedUsers) => {
  setSelectedUser(newSelectedUsers);
  console.log(newSelectedUsers)
  const selectedValues = newSelectedUsers.map((option) => option.value);
  setCombinedValues(selectedValues);
  console.log(selectedValues)
};
  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState();
  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
   const handleTagChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
    console.log(newSelectedTags)
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedTagsValues(selectedValues);
    console.log(selectedValues)
  };
  const [TaskTemplates, setTaskTemplates] = useState([]);
  useEffect(() => {
    fetchTaskData();
  }, []);
  const [loading, setLoading] = useState(true);
  const fetchTaskData = async () => {
    setLoading(true); // Start loader

    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch task templates");
      }
      const data = await response.json();
      // console.log(data)
      setTaskTemplates(data.TaskTemplates);
    } catch (error) {
      console.error("Error fetching task templates:", error);
    } finally {
      // Wait for the fetch and the 3-second timer to complete
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };
  const createTaskTemp = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,

      checked: checkedSubtasks.includes(id), // Check if ID is in the checkedSubtasks array
    }));

    // console.log(subtaskData);
    if (absoluteDate === true) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        templatename: templatename,
        status: status,
        taskassignees: combinedValues,
        tasktags: combinedTagsValues,
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        comments: "",
        startdate: startDate,
        enddate: dueDate,
        subtasks: subtaskData,
        issubtaskschecked: SubtaskSwitch,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Task Template created successfully");
          resetFields();
          fetchTaskData();
          setShowForm(false);
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Task Template");
        });
    } else if (absoluteDate === false) {
      if (!validateForm()) {
        return; // Prevent form submission if validation fails
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        templatename: templatename,
        status: status,
        taskassignees: combinedValues,
        tasktags: combinedTagsValues,
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        subtasks: subtaskData,
        issubtaskschecked: SubtaskSwitch,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Task Template created successfully");
          resetFields();
          fetchTaskData();
          setShowForm(false);
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Task Template");
        });
    }
  };
  const createSaveTaskTemp = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    
    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,

      checked: checkedSubtasks.includes(id), // Check if ID is in the checkedSubtasks array
    }));

    console.log(subtaskData);

    if (absoluteDate === true) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        templatename: templatename,
        status: status,
        taskassignees: combinedValues,
        tasktags: combinedTagsValues,
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        comments: "",
        startdate: startDate,
        enddate: dueDate,
        subtasks: subtaskData,
        issubtaskschecked: SubtaskSwitch,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Task Template created successfully");
        
          fetchTaskData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Task Template");
        });
    } else if (absoluteDate === false) {
      if (!validateForm()) {
        return; // Prevent form submission if validation fails
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        templatename: templatename,
        status: status,
        taskassignees: combinedValues,
        tasktags: combinedTagsValues,
        priority: priority,
        description: description,
        absolutedates: absoluteDate,
        startsin: startsin,
        startsinduration: startsInDuration,
        duein: duein,
        dueinduration: dueinduration,
        subtasks: subtaskData,
        issubtaskschecked: SubtaskSwitch,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          // Handle success
          toast.success("Task Template created successfully");
          // resetFields();
          fetchTaskData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to create Task Template");
        });
    }
  };
  const resetFields = () => {
    setDescription("");
    setSelectedTags([]);
    setAbsoluteDates(false);
    setStartDate(null);
    setDueDate(null);
    setstartsin("");
    setduein("");
    setPriority("Medium");
    setSelectedUser([]);
    setStartsInDuration("Days");
    settemplatename("");
    setdueinduration("Days");
    setStatus("No status");
    setSubtaskSwitch(false);
    setSubtasks([]);
  };
  const handleEdit = (_id) => {
    navigate("taskTempUpdate/" + _id);
  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task template?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.text();
        })
        .then((result) => {
          // console.log(result);
          toast.success("Item deleted successfully");
          handleMenuClose()
          fetchTaskData();
          // setshowOrganizerTemplateForm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };
  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
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
  const [templateNameError, setTemplateNameError] = useState("");

  const validateForm = () => {
    let isValid = true;
    if (!templatename) {
      setTemplateNameError("Name can't be blank");
      toast.error("Name can't be blank");
      isValid = false;
    } else {
      setTemplateNameError("");
    }

    return isValid;
  };

  const handleTaskCancel = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templatename || priority || description || status || absoluteDate) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templatename, priority, description, status, absoluteDate]);

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
  const paginatedTasks = TaskTemplates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Debounced function to check template name existence
  const checkTemplateName = async (name) => {
      try {
        const res = await axios.get(`${TASK_API}/workflow/tasks/check-name`, {
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {!showForm ? (
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleCreateTask} className="mb-3">
              Create Task Template
            </Button>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <CircularProgress
                  style={{ fontSize: "300px", color: "blue" }}
                />
              </Box>
            ) : (
              
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
                      {paginatedTasks.map((row) => (
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
                  rowsPerPageOptions={[30, 40, 50, 60, 100]}
                  component="div"
                  count={TaskTemplates.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            )}
          
          </Box>
        ) : (
          <FormPage
            title="Create Task Template"
            subtitle="Configure your task template settings"
            actions={
              <>
                <Button variant="outline" onClick={handleTaskCancel}>Cancel</Button>
                <Button variant="secondary" onClick={createSaveTaskTemp}>Save</Button>
                <Button onClick={createTaskTemp}>Save & Exit</Button>
              </>
            }
          >
            <FormGrid>
              {/* ===== LEFT COLUMN: Task Details ===== */}
              <FormGrid.Main>
                <FormSection title="General" icon={<FileText className="h-4 w-4" />}>
                  <FormRow cols={2}>
                    <FormField label="Template Name" error={templateNameError}>
                      <Input
                        name="TemplateName"
                        placeholder="Template Name"
                        value={templatename}
                        onChange={(e) => settemplatename(e.target.value)}
                        error={!!templateNameError}
                      />
                    </FormField>
                    <div>
                      <Status onStatusChange={handleStatusChange} selectedStatus={status} />
                    </div>
                  </FormRow>

                  <FormRow cols={2}>
                    <FormField label="Task Assignee">
                      <MultiSelectDropdown
                        value={selectedUser}
                        onChange={handleUserChange}
                        placeholder="Assignees"
                      />
                    </FormField>
                    <div>
                      <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
                    </div>
                  </FormRow>
                </FormSection>

                <FormSection title="Description">
                  <Editor onChange={handleEditorChange} content={description} />
                </FormSection>

                <FormSection title="Tags">
                  <TagsMultiSelectDropDown
                    value={selectedTags}
                    onChange={handleTagChange}
                    placeholder="Tags"
                  />
                </FormSection>

                <FormSection title="Start and Due Date" icon={<Calendar className="h-4 w-4" />}>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Absolute Date</Label>
                    <Switch
                      checked={absoluteDate}
                      onCheckedChange={handleAbsolutesDates}
                    />
                  </div>

                  {absoluteDate && (
                    <div className="space-y-4 mt-4">
                      <FormField label="Start Date">
                        <DatePicker
                          format="MM/DD/YYYY"
                          sx={{ width: '100%', backgroundColor: '#fff' }}
                          value={startDate}
                          onChange={handleStartDateChange}
                        />
                      </FormField>
                      <FormField label="Due Date">
                        <DatePicker
                          format="MM/DD/YYYY"
                          sx={{ width: '100%', backgroundColor: '#fff' }}
                          value={dueDate}
                          onChange={handleDueDateChange}
                        />
                      </FormField>
                    </div>
                  )}

                  {!absoluteDate && (
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center gap-3">
                        <Label className="w-20 shrink-0 text-sm">Start In</Label>
                        <Input
                          value={startsin}
                          onChange={(e) => setstartsin(e.target.value)}
                          placeholder="0"
                          className="flex-1"
                        />
                        <select
                          className="flex h-10 rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={startsInDuration || ""}
                          onChange={(e) => setStartsInDuration(e.target.value)}
                        >
                          <option value="">Select</option>
                          {dayOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <Label className="w-20 shrink-0 text-sm">Due In</Label>
                        <Input
                          value={duein}
                          onChange={(e) => setduein(e.target.value)}
                          placeholder="0"
                          className="flex-1"
                        />
                        <select
                          className="flex h-10 rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={dueinduration || ""}
                          onChange={(e) => setdueinduration(e.target.value)}
                        >
                          <option value="">Select</option>
                          {dayOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </FormSection>
              </FormGrid.Main>

              {/* ===== RIGHT COLUMN: Subtasks ===== */}
              <FormGrid.Sidebar>
                <FormSection title="Subtasks" icon={<ListChecks className="h-4 w-4" />}>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Enable Subtasks</Label>
                    <Switch
                      checked={SubtaskSwitch}
                      onCheckedChange={handleSubtaskSwitch}
                    />
                  </div>

                  {SubtaskSwitch && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="subtaskList">
                        {(provided) => (
                          <div className="space-y-2 mt-3" {...provided.droppableProps} ref={provided.innerRef}>
                            {subtasks.map((subtask, index) => (
                              <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center gap-2 rounded-lg border border-border bg-white p-2 shadow-sm"
                                  >
                                    <Checkbox
                                      checked={checkedSubtasks.includes(subtask.id)}
                                      onCheckedChange={() => handleCheckboxChange(subtask.id)}
                                    />
                                    <Input
                                      placeholder="Things to do"
                                      value={subtask.text}
                                      onChange={(e) => handleInputChange(subtask.id, e.target.value)}
                                      className="flex-1 border-0 shadow-none focus-visible:ring-0"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubtask(subtask.id)}
                                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleAddSubtask}
                              className="mt-2 w-full text-primary"
                            >
                              <Plus className="h-4 w-4" />
                              Add Subtask
                            </Button>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </FormSection>
              </FormGrid.Sidebar>
            </FormGrid>
          </FormPage>
        )}
      </Box>
    </LocalizationProvider>
  );
};
export default Tasks;
