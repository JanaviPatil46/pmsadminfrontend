// NewTaskDrawer.js
import React, { useState, useEffect } from "react";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import Editor from "../Templates/Texteditor/Editor";
import Priority from "../Templates/Priority/Priority";
import Status from "../Templates/Status/Status";
import dayjs from "dayjs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";
import { GripVertical, Trash2, PlusCircle } from "lucide-react";
import { SideSheet } from "../components/ui/side-sheet";
const NewTaskDrawer = ({ open, onClose, isEditMode, taskData }) => {

 
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState(null);

  const handleAccountChange = (selectedOptions) => {
    setSelectedaccount(selectedOptions);
    fetchJobList(selectedOptions.value);
  };

  useEffect(() => {
    fetchAccountData();
  }, []);
const fetchAccountData = async () => {
  try {
    const storedUserRole = localStorage.getItem("userRole");
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginuserid = storedData?.teammember?.userid;
    const viewAllAccounts = storedData?.teammember?.viewallAccounts;

    let url = "";

    // === ROLE-BASED URL LOGIC ===
    if (storedUserRole === "Admin") {
      url =
        "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
    } else {
      // Team Member
      url =
        viewAllAccounts === true
          ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
    }

    const response = await fetch(url);
    const data = await response.json();

    const accounts = Array.isArray(data.accountlist)
      ? data.accountlist
      : Array.isArray(data.teamAccounts)
      ? data.teamAccounts
      : [];

    setaccountdata(accounts);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Convert to dropdown options
const accountoptions = accountdata.map((account) => ({
  value: account._id,
  label: account.accountName,
}));

  //   *********joblist*******
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [joblist, setJoblist] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobChange = (selectedOptions) => {
    setSelectedJob(selectedOptions);
  };

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
  const handleCheckboxChange = (subtaskId) => {
    setSubtasks(prevSubtasks =>
      prevSubtasks.map(subtask =>
        subtask.id === subtaskId
          ? { ...subtask, checked: !subtask.checked }
          : subtask
      )
    );
    setCheckedSubtasks(prev => [...prev, subtaskId]);
  };

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "", checked: false }]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);
    setSubtasks(newSubtasks);
  };

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
    if (checked && subtasks.length === 0) {
    setSubtasks([{ id: '1', text: '', checked: false }]);
  }
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
  };
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
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
 
  const handleTagChange = (newSelectedTags) => {
    setTagsNew(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedTagsValues(selectedValues);
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
        
        if (data.taskTemplate && Array.isArray(data.taskTemplate.taskassignees)) {
          const flatAssignees = data.taskTemplate.taskassignees.flat();
          if (flatAssignees.length > 0) {
            const assigneesData = flatAssignees.map(assignee => ({
              value: assignee._id,
              label: assignee.username,
            }));
            setSelectedUser(assigneesData);
            setCombinedValues(assigneesData.map(o => o.value));
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
            color: tag.tagColour,
          }));
          setTagsNew(tagsData);
          setCombinedTagsValues(tagsData.map((o) => o.value));
        }

        setTempValues(data.taskTemplate);
        tempallvalue();
        setSubtasks(data.taskTemplate.subtasks || []);
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
      setTempNameNew(tempvalues.templatename || "");
      setStatus(tempvalues.status || "");
      setTaskDescription(tempvalues.description || "");
      setPriority(tempvalues.priority || "");

      setStartsDateNew(dayjs(tempvalues.startdate) || null);
      setDueDateNew(dayjs(tempvalues.enddate) || null);

      setSubtaskSwitch(tempvalues.issubtaskschecked || false);
      setSubtasks(tempvalues.subtasks);
    }
  };

  useEffect(() => {
    if (isEditMode && taskData) {
      setTempNameNew(taskData.taskList.Name  || "");
      setStatus(taskData.taskList.Status  || "");
      setTaskDescription(taskData.taskList.Descriptions || "");
      setPriority(taskData.taskList.Priority || "");
      setStartsDateNew(dayjs(taskData.taskList.StartDate) || null);
      setDueDateNew(dayjs(taskData.taskList.DueDate ) || null);
      setSubtaskSwitch(taskData.taskList.SubtaskCheck || false);

        if (taskData.taskList?.Assignees) {
        const assigneesData = taskData.taskList.Assignees.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setSelectedUser(assigneesData);
        setCombinedValues(assigneesData.map((o) => o.value));
      }
   
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

      if (taskData.taskList?.Accounts) {
        setSelectedaccount({
          value: taskData.taskList.Accounts._id,
          label: taskData.taskList.Accounts.accountName,
        });
      }
      if (taskData.taskList?.Job) {
        setSelectedJob({
          value: taskData.taskList.Job._id,
          label: taskData.taskList.Job.Name,
        });
      }
      if (taskData.taskList?.TaskTemp) {
        setselectedTemp({
          value: taskData.taskList.TaskTemp._id,
          label: taskData.taskList.TaskTemp.Name,
        });
      }
    }
  }, [isEditMode, taskData]);

  const navigate = useNavigate();
  const [errors, setErrors] = useState({ account: false, template: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTask = async () => {
    if (isSubmitting) return;
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
    setIsSubmitting(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const subtaskData = subtasks.map(({ id, text, checked }) => ({
      id,
      text,
      checked: checked || false,
    }));
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
      .then(() => {
        toast.success(isEditMode ? "Task updated successfully" : "Task created successfully");
        onClose();
        if (!isEditMode) {
          if (selectedaccount?.value) {
            navigate(`/clients/accounts/accountsdash/workflow/${selectedaccount.value}/pendingtasks`);
          }
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
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
  };
  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <SideSheet
      open={open}
      onOpenChange={(v) => !v && onClose?.()}
      title={isEditMode ? "Edit Task" : "New Task"}
      description={isEditMode ? "Update task details below" : "Fill in the details to create a new task"}
      size="lg"
      hideDefaultFooter
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={createTask} disabled={isSubmitting}>
            {isSubmitting
              ? (isEditMode ? "Saving..." : "Creating...")
              : (isEditMode ? "Save Changes" : "Create Task")
            }
          </Button>
        </div>
      }
    >
      <div className="space-y-5">

        {/* ── Source ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Source</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nt-account">
                Account <span className="text-destructive">*</span>
              </Label>
              <select
                id="nt-account"
                value={selectedaccount?.value || ""}
                onChange={(e) => {
                  const newValue = accountoptions.find((o) => o.value === e.target.value) || null;
                  handleAccountChange(newValue);
                  setErrors((prev) => ({ ...prev, account: !newValue }));
                }}
                className={selectCls + (errors.account ? " border-destructive" : "")}
              >
                <option value="">Select account</option>
                {accountoptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.account && <p className="text-xs text-destructive">Account is required</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nt-job">Job</Label>
              <select
                id="nt-job"
                disabled={!selectedaccount}
                value={selectedJob?.value || ""}
                onChange={(e) => {
                  const newValue = jobsoptions.find((o) => o.value === e.target.value) || null;
                  handleJobChange(newValue);
                }}
                className={selectCls + " disabled:opacity-50 disabled:cursor-not-allowed"}
              >
                <option value="">Select job</option>
                {jobsoptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5 mt-4">
            <Label htmlFor="nt-template">
              Template <span className="text-destructive">*</span>
            </Label>
            <select
              id="nt-template"
              value={selectedtemp?.value || ""}
              onChange={(e) => {
                const newValue = taskTemplateOptions.find((o) => o.value === e.target.value) || null;
                handletemp(e, newValue);
                setErrors((prev) => ({ ...prev, template: !newValue }));
              }}
              className={selectCls + (errors.template ? " border-destructive" : "")}
            >
              <option value="">Select template</option>
              {taskTemplateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.template && <p className="text-xs text-destructive">Template is required</p>}
          </div>
        </div>

        {/* ── Assignment ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Assignment</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nt-taskname">Task Name</Label>
              <Input
                id="nt-taskname"
                placeholder="Enter task name"
                value={tempNameNew}
                onChange={(e) => setTempNameNew(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Assignees</Label>
              <MultiSelectDropdown
                value={selectedUser}
                onChange={handleUserChange}
                placeholder="Select assignees"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Status onStatusChange={handleStatusChange} selectedStatus={status} />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Details</p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Editor initialContent={taskDiscription} onChange={handleEditorChange} />
            </div>

            <div className="space-y-1.5">
              <Label>Tags</Label>
              <TagsMultiSelectDropDown
                value={tagsNew}
                onChange={handleTagChange}
                placeholder="Select or search tags"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={StartsDateNew ? dayjs(StartsDateNew).format("YYYY-MM-DD") : ""}
                  onChange={(e) => handleStartDateChange(e.target.value ? dayjs(e.target.value) : null)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={DueDateNew ? dayjs(DueDateNew).format("YYYY-MM-DD") : ""}
                  onChange={(e) => handleDueDateChange(e.target.value ? dayjs(e.target.value) : null)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Subtasks ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subtasks</p>
            </div>
            <Switch checked={SubtaskSwitch} onCheckedChange={handleSubtaskSwitch} />
          </div>

          {SubtaskSwitch && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="subtaskList">
                {(provided) => (
                  <div
                    className="space-y-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {subtasks.map((subtask, index) => (
                      <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-2 rounded-lg border border-border bg-card p-2"
                          >
                            <Checkbox
                              checked={subtask.checked || false}
                              onCheckedChange={() => handleCheckboxChange(subtask.id)}
                            />
                            <Input
                              placeholder="Subtask description"
                              value={subtask.text}
                              onChange={(e) => handleInputChange(subtask.id, e.target.value)}
                              className="flex-1 h-8 text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteSubtask(subtask.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            <div {...provided.dragHandleProps} className="cursor-grab text-muted-foreground hover:text-foreground">
                              <GripVertical className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-1"
                    >
                      <PlusCircle className="h-4 w-4" /> Add Subtask
                    </button>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

      </div>
    </SideSheet>
  );
};

export default NewTaskDrawer;
