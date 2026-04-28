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
import Cookies from "js-cookie";
import { GripVertical, Trash2, PlusCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
const AccountTask = ({ handleNewDrawerClose, handleDrawerClose }) => {
  const handleClose = () => {
    handleNewDrawerClose();
    // handleDrawerClose();
  };

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  //****************Accounts */
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState(null);
  const [errorTooltip, setErrorTooltip] = useState("");
  const handleAccountChange = (selectedOptions) => {
    setSelectedaccount(selectedOptions);
    fetchJobList(selectedOptions.value); // Fetch jobs based on selected account ID
  };

//   useEffect(() => {
//     fetchAccountData();
//   }, []);




// const fetchAccountData = async () => {
//   try {
   
//  const url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
//           const response = await fetch(url);
//           const data = await response.json();
//     const accountList = (data.accounts || []).map(account => ({
//       value: account._id,
//       label: account.accountName
//     }));

//     setaccountdata(accountList); // update the state with correct format

//     // Get accountId from cookie
//     const accountIdFromCookie = Cookies.get("accountId");
// console.log("accountList", accountList.map(a => a.value));
// console.log("accountIdFromCookie", accountIdFromCookie);


//     if (accountIdFromCookie) {
//       const matchedAccount = accountList.find(
//         (acc) => acc.value === accountIdFromCookie
//       );
    

//       if (matchedAccount) {
//         setSelectedaccount(matchedAccount);
//         console.log("matchedAccount",matchedAccount)
//         fetchJobList(matchedAccount.value);
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

// const accountoptions = accountdata;
  
 const [userRole, setUserRole] = useState("");
// const [accountData, setaccountdata] = useState([]);
// const [selectedAccount, setSelectedaccount] = useState(null);

const fetchAccountData = async () => {
  try {
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginuserid = storedData?.teammember?.userid;
    const viewAllAccounts = storedData?.teammember?.viewallAccounts;


    // === Choose API URL based on userRole & viewAllAccounts ===
    let url = "";

    if (userRole === "Admin") {
      url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
    } else {
      // Teammember logic
      url =
        viewAllAccounts === true
          ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${true}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    const accounts = (data.accountlist || data.teamAccounts || []).map((acc) => ({
      value: acc._id,
      label: acc.accountName,
    }));

    setaccountdata(accounts);

    // === Read accountId from cookie ===
    const accountIdFromCookie = Cookies.get("accountId");
    if (accountIdFromCookie) {
      const matchedAccount = accounts.find(
        (a) => a.value === accountIdFromCookie
      );

      if (matchedAccount) {
        setSelectedaccount(matchedAccount);
        fetchJobList(matchedAccount.value);
      }
    }

  } catch (error) {
    console.error("Error fetching account data:", error);
  }
};

// STEP 1: Load userRole
useEffect(() => {
  const storedUserRole = localStorage.getItem("userRole") || "";
  setUserRole(storedUserRole);
}, []);

// STEP 2: Once userRole is known, fetch accounts
useEffect(() => {
  if (userRole) {
    fetchAccountData();
  }
}, [userRole]);

// For UI dropdown
const accountoptions = accountdata;


  //   *********joblist*******
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [joblist, setJoblist] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobChange = async (selectedOptions) => {
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
  const [AssigneesNew, setAssigneesNew] = useState([]);

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

  //   setCheckedSubtasks(
  //     (prevCheckedSubtasks) =>
  //       prevCheckedSubtasks.includes(subtaskId)
  //         ? prevCheckedSubtasks // Keep already checked items
  //         : [...prevCheckedSubtasks, subtaskId] // Add new checked item
  //   );
  // };

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
  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "" }]);
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

  const handleInputChange = (id, value) => {
    setSubtasks(
      subtasks.map((subtask) =>
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
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
 
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
      //   console.log(data.tags)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //  for tags
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
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

        console.log("tasktemp", data);

        if (
          data.taskTemplate &&
          Array.isArray(data.taskTemplate.taskassignees)
        ) {
          // Flatten the array in case of unnecessary nesting
          const flatAssignees = data.taskTemplate.taskassignees.flat();

          if (flatAssignees.length > 0) {
            const assigneesData = flatAssignees.map((assignee) => ({
              value: assignee._id,
              label: assignee.username,
            }));

            setSelectedUser(assigneesData);

            const selectedValues = assigneesData.map((option) => option.value);
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
        if (
          data.taskTemplate.subtasks &&
          Array.isArray(data.taskTemplate.subtasks)
        ) {
          const subtasksText = data.taskTemplate.subtasks.map(
            (subtask) => subtask.text
          );
          console.log("Subtasks Text:", subtasksText); // Log the extracted subtasks text

          setSubtasks(subtasksText); // Assuming you have a state setter for this
        } else {
          console.log("subtasks is not defined or not an array.");
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

    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      checked: checkedSubtasks.includes(id),
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
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${ACCOUNT_TASKS_API}/accountstasks/newtask`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        toast.success("Task Created successfully");
        handleClose();
        handleDrawerClose();
        navigate("/tasks/pending");
      })
      .catch((error) => console.error(error));
  };
  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-5">

      {/* ── Source ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Source</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="at-account">
              Account <span className="text-destructive">*</span>
            </Label>
            <select
              id="at-account"
              value={selectedaccount?.value || ""}
              onChange={(e) => {
                const match = accountoptions.find((a) => a.value === e.target.value);
                handleAccountChange(match || null);
                setErrors((prev) => ({ ...prev, account: !match }));
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
            <Label htmlFor="at-job">Job</Label>
            <select
              id="at-job"
              disabled={!selectedaccount}
              value={selectedJob?.value || ""}
              onChange={(e) => {
                const match = jobsoptions.find((j) => j.value === e.target.value);
                handleJobChange(match || null);
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
          <Label htmlFor="at-template">
            Template <span className="text-destructive">*</span>
          </Label>
          <select
            id="at-template"
            value={selectedtemp?.value || ""}
            onChange={(e) => {
              const match = taskTemplateOptions.find((t) => t.value === e.target.value);
              handletemp(e, match || null);
              setErrors((prev) => ({ ...prev, template: !match }));
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
            <Label htmlFor="at-taskname">Task Name</Label>
            <Input
              id="at-taskname"
              placeholder="Enter task name"
              value={tempNameNew}
              onChange={(e) => setTempNameNew(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Assignees</Label>
            <MultiSelectDropdown value={selectedUser} onChange={handleUserChange} placeholder="Select assignees" />
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
            <TagsMultiSelectDropDown value={tagsNew} onChange={handleTagChange} placeholder="Select or search tags" />
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subtasks</p>
          <Switch checked={SubtaskSwitch} onCheckedChange={handleSubtaskSwitch} />
        </div>

        {SubtaskSwitch && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subtaskList">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
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

      {/* ── Footer actions ── */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
        <Button variant="ghost" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={createTask}>
          Create Task
        </Button>
      </div>

    </div>
  );
};

export default AccountTask;
