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
import {
  FormDrawer,
  FormDrawerFooter,
  FormSection,
  FormField,
  FormRow,
  FormSelect,
  FormDatePicker,
  FormSwitchRow,
  FormSubtaskItem,
  FormSubtaskAdd,
} from "../components/ui/form-layout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowLeft, ListChecks, Calendar, Users, FileText, Tag } from "lucide-react";
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

    console.log("Fetching accounts from:", url);

    const response = await fetch(url);
    const data = await response.json();

    // Handle both response formats (Admin & TeamMember)
    const accounts = Array.isArray(data.accountlist)
      ? data.accountlist
      : Array.isArray(data.teamAccounts)
      ? data.teamAccounts
      : [];

    console.log("Account list:", accounts);

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

  // useEffect(() => {
  //   fetchAccountData();
  // }, []);

  // const fetchAccountData = async () => {
  //   try {
  //     // const response = await fetch(`${ACCOUNT_API}/accounts/account/accountdetailslist/true`);
  //      const url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
  //         const response = await fetch(url);
  //         const data = await response.json();
  //     setaccountdata(data.accounts);
  //     console.log("accountlist",data.accounts)
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // console.log(userdata);
  // const accountoptions = accountdata.map((account) => ({
  //   value: account._id,
  //   label: account.accountName,
  // }));

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
        // Update only the checked state of the specific subtask being changed
        setSubtasks(prevSubtasks => 
            prevSubtasks.map(subtask => 
                subtask.id === subtaskId 
                    ? { ...subtask, checked: !subtask.checked } // Toggle checked state for the clicked subtask
                    : subtask // Keep other subtasks the same
            )
        );
    
        // Update checkedSubtasks to only reflect the clicked subtask's change
        setCheckedSubtasks(prevCheckedSubtasks => {
            // const isChecked = prevCheckedSubtasks.includes(subtaskId);
    
            // If the subtask is already checked, we want to remove it from the list
            // if (isChecked) {
            //     return prevCheckedSubtasks.filter(id => id !== subtaskId); // Remove if already checked
            // }
    
            // If it is not checked, we add it to the checked list
            return [...prevCheckedSubtasks, subtaskId]; // Add if not checked
        });
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
        // if (data.taskTemplate && Array.isArray(data.taskTemplate.subtasks)) {
        //   const formattedSubtasks = data.taskTemplate.subtasks.map((subtask, index) => ({
        //     id: subtask.id || `subtask-${index}-${Date.now()}`, // Ensure unique ID
        //     text: subtask.text || "",
        //     checked: subtask.checked || false // Ensure checked property exists
        //   }));
        //   console.log("Formatted Subtasks:", formattedSubtasks);
        //   setSubtasks(formattedSubtasks);
        // } else {
        //   console.log("subtasks is not defined or not an array.");
        //   setSubtasks([]); // Reset to empty array if no subtasks
        // }
         setSubtasks(data.taskTemplate.subtasks)
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
    <FormDrawer
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Task" : "New Task"}
      description={isEditMode ? "Update task details" : "Create a new task"}
      width="lg"
    >
      {/* ── Source Section ── */}
      <FormSection title="Source" icon={<FileText className="h-4 w-4" />}>
        <FormField label="Account" required error={errors.account ? "Account is required" : ""}>
          <FormSelect
            value={selectedaccount?.value || ""}
            onChange={(e) => {
              const newValue = accountoptions.find((o) => o.value === e.target.value) || null;
              handleAccountChange(newValue);
              setErrors((prev) => ({ ...prev, account: !newValue }));
            }}
            error={errors.account}
          >
            <option value="">Select Account</option>
            {accountoptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label="Job">
          <FormSelect
            disabled={!selectedaccount}
            value={selectedJob?.value || ""}
            onChange={(e) => {
              const newValue = jobsoptions.find((o) => o.value === e.target.value) || null;
              handleJobChange(newValue);
            }}
          >
            <option value="">Select Job</option>
            {jobsoptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label="Template" required error={errors.template ? "Template is required" : ""}>
          <FormSelect
            value={selectedtemp?.value || ""}
            onChange={(e) => {
              const newValue = taskTemplateOptions.find((o) => o.value === e.target.value) || null;
              handletemp(e, newValue);
              setErrors((prev) => ({ ...prev, template: !newValue }));
            }}
            error={errors.template}
          >
            <option value="">Select Template</option>
            {taskTemplateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </FormSelect>
        </FormField>
      </FormSection>

      {/* ── Assignment & Status ── */}
      <FormSection title="Assignment" icon={<Users className="h-4 w-4" />}>
        <FormRow cols={2}>
          <FormField label="Task Assignee">
            <MultiSelectDropdown
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Assignees"
            />
          </FormField>
          <FormField label="Status">
            <Status
              onStatusChange={handleStatusChange}
              selectedStatus={status}
            />
          </FormField>
        </FormRow>

        <FormRow cols={2}>
          <FormField label="Task Name">
            <Input
              name="TemplateName"
              placeholder="Task Name"
              onChange={(e) => setTempNameNew(e.target.value)}
              value={tempNameNew}
            />
          </FormField>
          <FormField label="Priority">
            <Priority
              onPriorityChange={handlePriorityChange}
              selectedPriority={priority}
            />
          </FormField>
        </FormRow>
      </FormSection>

      {/* ── Description ── */}
      <FormSection title="Description">
        <Editor
          initialContent={taskDiscription}
          onChange={handleEditorChange}
        />
      </FormSection>

      {/* ── Tags ── */}
      <FormSection title="Tags" icon={<Tag className="h-4 w-4" />}>
        <TagsMultiSelectDropDown
          value={tagsNew}
          onChange={handleTagChange}
          placeholder="Tags"
        />
      </FormSection>

      {/* ── Dates ── */}
      <FormSection title="Dates" icon={<Calendar className="h-4 w-4" />}>
        <FormRow cols={2}>
          <FormField label="Start Date">
            <FormDatePicker
              value={StartsDateNew ? dayjs(StartsDateNew).format("YYYY-MM-DD") : ""}
              onChange={(val) => handleStartDateChange(val ? dayjs(val) : null)}
            />
          </FormField>
          <FormField label="Due Date">
            <FormDatePicker
              value={DueDateNew ? dayjs(DueDateNew).format("YYYY-MM-DD") : ""}
              onChange={(val) => handleDueDateChange(val ? dayjs(val) : null)}
            />
          </FormField>
        </FormRow>
      </FormSection>

      {/* ── Subtasks ── */}
      <FormSection title="Subtasks" icon={<ListChecks className="h-4 w-4" />}>
        <FormSwitchRow
          label="Enable Subtasks"
          description="Break this task into smaller steps"
          checked={SubtaskSwitch}
          onCheckedChange={handleSubtaskSwitch}
        />

        {SubtaskSwitch && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subtaskList">
              {(provided) => (
                <div className="space-y-2" {...provided.droppableProps} ref={provided.innerRef}>
                  {subtasks.map((subtask, index) => (
                    <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <FormSubtaskItem
                            text={subtask.text}
                            checked={subtask.checked}
                            onTextChange={(val) => handleInputChange(subtask.id, val)}
                            onCheckedChange={() => handleCheckboxChange(subtask.id)}
                            onDelete={() => handleDeleteSubtask(subtask.id)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <FormSubtaskAdd onClick={handleAddSubtask} />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </FormSection>

      {/* ── Footer Actions ── */}
      <FormDrawerFooter>
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={createTask}>
          {isEditMode ? "Update Task" : "Create Task"}
        </Button>
      </FormDrawerFooter>
    </FormDrawer>
  );
};

export default NewTaskDrawer;
