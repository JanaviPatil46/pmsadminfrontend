import React, { useState, useEffect, useMemo } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import Editor from "../Texteditor/Editor";
import Priority from "../Priority/Priority";
import Status from "../Status/Status";
import { toast } from "react-toastify";

import axios from "axios";
import debounce from "lodash.debounce";
import MultiSelectDropdown from "../MultiSelectDropdown";
import TagsMultiSelectDropDown from "../TagsMultiSelectDropDown";
import { FormPage, FormSection, FormField, FormRow, FormGrid } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Checkbox } from "../../components/ui/checkbox";
import { Trash2, Plus, GripVertical, FileText, Calendar, ListChecks, MoreVertical, Pencil, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

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
      <div>
        {!showForm ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Button onClick={handleCreateTask}>
                {/* <ListChecks className="mr-2 h-4 w-4" />  */}
                 <Plus className="h-4 w-4" />
                Create New Task
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

                {/* ── Mobile card list (< sm) ── */}
                <div className="sm:hidden">
                  {paginatedTasks.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-muted-foreground">No task templates found.</p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {paginatedTasks.map((row) => (
                        <li key={row._id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                          <button
                            onClick={() => handleEdit(row._id)}
                            className="flex-1 text-left text-sm font-medium text-primary hover:underline truncate"
                          >
                            {row.templatename}
                          </button>
                          <div className="relative shrink-0">
                            <button
                              onClick={(event) => toggleMenu(event, row._id)}
                              className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {openMenuId === row._id && (
                              <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-lg">
                                <button
                                  onClick={() => { handleEdit(tempIdget); handleMenuClose(); }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                                >
                                  <Pencil className="h-3.5 w-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => { handleDelete(tempIdget); }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ── Desktop / tablet table (sm+) ── */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedTasks.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-4 py-10 text-center text-sm text-muted-foreground">No task templates found.</td>
                        </tr>
                      ) : (
                        paginatedTasks.map((row) => (
                          <tr key={row._id} className="group transition-colors hover:bg-muted/50">
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleEdit(row._id)}
                                className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors truncate max-w-xs md:max-w-md lg:max-w-none block"
                              >
                                {row.templatename}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="relative inline-block">
                                <button
                                  onClick={(event) => toggleMenu(event, row._id)}
                                  className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                {openMenuId === row._id && (
                                  <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                                    <button
                                      onClick={() => { handleEdit(tempIdget); handleMenuClose(); }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                                    >
                                      <Pencil className="h-3.5 w-3.5" /> Edit
                                    </button>
                                    <button
                                      onClick={() => { handleDelete(tempIdget); }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {TaskTemplates.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Showing <span className="font-semibold text-foreground">{page * rowsPerPage + 1}</span>–<span className="font-semibold text-foreground">{Math.min((page + 1) * rowsPerPage, TaskTemplates.length)}</span> of{" "}
                      <span className="font-semibold text-foreground">{TaskTemplates.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <select
                        value={rowsPerPage}
                        onChange={(e) => handleChangeRowsPerPage({ target: { value: e.target.value } })}
                        className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {[30, 40, 50, 60, 100].map((opt) => (
                          <option key={opt} value={opt}>{opt} / page</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleChangePage(null, page - 1)}
                          disabled={page === 0}
                          className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="min-w-[3rem] text-center text-xs font-medium text-muted-foreground">
                          {page + 1} / {Math.max(1, Math.ceil(TaskTemplates.length / rowsPerPage))}
                        </span>
                        <button
                          onClick={() => handleChangePage(null, page + 1)}
                          disabled={(page + 1) * rowsPerPage >= TaskTemplates.length}
                          className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
                          className="flex h-10 rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                          className="flex h-10 rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                    className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-sm"
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
      </div>
    </LocalizationProvider>
  );
};
export default Tasks;
