
import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Editor from '../Texteditor/Editor';
import Priority from '../Priority/Priority';
import Status from '../Status/Status';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MultiSelectDropdown from "../MultiSelectDropdown";
import TagsMultiSelectDropDown from "../TagsMultiSelectDropDown";
import { FormPage, FormSection, FormField, FormRow, FormGrid, FormSwitchRow, FormSubtaskItem, FormSubtaskAdd } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FileText, Calendar, ListChecks } from "lucide-react";
const Tasks = () => {
    const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
    const USER_API = process.env.REACT_APP_USER_URL;
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

    const navigate = useNavigate();
    const { _id } = useParams();
    const [tempNameNew, setTempNameNew] = useState("");
    const [tagsNew, setTagsNew] = useState([]);
    const [AssigneesNew, setAssigneesNew] = useState([]);
    const [absoluteDate, setAbsoluteDates] = useState(false);
    const [priority, setPriority] = useState('Medium');
    const [status, setStatus] = useState('No status');
    const [StartsDateNew, setStartsDateNew] = useState("");
    const [DueDateNew, setDueDateNew] = useState("");
    const [StartsInDurationNew, setStartsInDurationNew] = useState();
    const [DueInDurationNew, setDueInDurationNew] = useState();
    const [StartsInNew, setStartsInNew] = useState();
    const [DueInNew, setDueInNew] = useState();
    const [subtasks, setSubtasks] = useState([]);
    const [checkedSubtasks, setCheckedSubtasks] = useState([]);

    // const handleCheckboxChange = (subtaskId) => {
    //     // Check if the subtask is already checked
    //     const isChecked = checkedSubtasks.includes(subtaskId);
    
    //     // Update the checkedSubtasks array
    //     const newCheckedSubtasks = isChecked
    //         ? checkedSubtasks.filter(id => id !== subtaskId) // Remove from checkedSubtasks if already checked
    //         : [...checkedSubtasks, subtaskId]; // Add to checkedSubtasks if not checked
    
    //     // Update only the checked state of the specific subtask being changed
    //     const updatedSubtasks = subtasks.map(subtask => 
    //         subtask.id === subtaskId 
    //             ? { ...subtask, checked: !isChecked } // Toggle the checked state
    //             : subtask // Keep other subtasks the same
    //     );
    
    //     console.log("Before update:", { checkedSubtasks, subtasks });
    //     setCheckedSubtasks(newCheckedSubtasks);
    //     setSubtasks(updatedSubtasks);
    //     console.log("After update:", { newCheckedSubtasks, updatedSubtasks });
    // };
    // const handleCheckboxChange = (subtaskId) => {
    //     setCheckedSubtasks(prevCheckedSubtasks => {
    //         const isChecked = prevCheckedSubtasks.includes(subtaskId);
    
    //         // Update the checkedSubtasks array
    //         const newCheckedSubtasks = isChecked
    //             ? prevCheckedSubtasks.filter(id => id !== subtaskId) // Remove if already checked
    //             : [...prevCheckedSubtasks, subtaskId]; // Add if not checked
    
    //         return newCheckedSubtasks;
    //     });
    
    //     setSubtasks(prevSubtasks => 
    //         prevSubtasks.map(subtask => 
    //             subtask.id === subtaskId 
    //                 ? { ...subtask, checked: !subtask.checked } // Toggle checked state
    //                 : subtask
    //         )
    //     );
    // };
    
    // const handleCheckboxChange = (subtaskId) => {
    //     // Update only the checked state of the specific subtask being changed
    //     setSubtasks(prevSubtasks => 
    //         prevSubtasks.map(subtask => 
    //             subtask.id === subtaskId 
    //                 ? { ...subtask, checked: !subtask.checked } // Toggle checked state for the clicked subtask
    //                 : subtask // Keep other subtasks the same
    //         )
    //     );
    
    //     setCheckedSubtasks(prevCheckedSubtasks => {
    //         const isChecked = prevCheckedSubtasks.includes(subtaskId);
    
    //         // Only add the subtask if it is not already checked
    //         if (!isChecked) {
    //             return [...prevCheckedSubtasks, subtaskId]; // Add if not checked
    //         }
    
    //         // If it is already checked, just return the previous state
    //         return prevCheckedSubtasks; 
    //     });
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
    
  
   
    
    // Optional: Use useEffect to log after state updates
    // const handleCheckboxChange = (subtaskId) => {
    //     const isChecked = checkedSubtasks.includes(subtaskId);
    //     const newCheckedSubtasks = isChecked
    //         ? checkedSubtasks.filter(id => id !== subtaskId)
    //         : [...checkedSubtasks, subtaskId];
    
    //     const updatedSubtasks = subtasks.map(subtask => ({
    //         ...subtask,
    //         checked: newCheckedSubtasks.includes(subtask.id)
    //     }));
    
    //     console.log("Before update:", { checkedSubtasks, subtasks });
    //     setCheckedSubtasks(newCheckedSubtasks);
    //     setSubtasks(updatedSubtasks);
    //     console.log("After update:", { newCheckedSubtasks, updatedSubtasks });
    // };
    

    

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
        setSubtasks(subtasks.map((subtask) => (subtask.id === id ? { ...subtask, text: value } : subtask)));
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

    const handleStartDateChange = (e) => {
        setStartsDateNew(e.target.value);
    };
    const handleDueDateChange = (e) => {
        setDueDateNew(e.target.value);
    };
    const handleAbsolutesDates = (checked) => {
        setAbsoluteDates(checked);
    };
    const dayOptions = [
        { label: "Days", value: "Days" },
        { label: "Months", value: "Months" },
        { label: "Years", value: "Years" },
    ];
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
    // const handleuserChange = (event, newValue) => {
    //     setAssigneesNew(newValue);
    //     // Map selected options to their values and send as an array
    //     const selectedValues = newValue.map((option) => option.value);
    //     // console.log(selectedValues);
    //     setCombinedValues(selectedValues);
    // };
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
        return baseWidth + (charWidth * tagName.length) + padding;
    };
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
            fontSize: '10px',
            width: `${calculateWidth(tag.tagName)}px`,
            margin: '7px', cursor: 'pointer',
        },
        customTagStyle: {
            backgroundColor: tag.tagColour,
            color: "#fff",
            alignItems: "center",
            textAlign: "center",
            padding: "2px,8px",
            fontSize: '10px',
            cursor: 'pointer',
        },
    }));

    // const handleTagChange = (event, newValue) => {
    //     setTagsNew(newValue);
    //     // Map selected options to their values and send as an array
    //     const selectedTagsValues = newValue.map((option) => option.value);
    //     // console.log(selectedTagsValues);
    //     setCombinedTagsValues(selectedTagsValues);
    // };

    // const handleTagChange = (event) => {
    //     const { value } = event.target;
        
    //     // Ensure the selected value is stored correctly
    //     setTagsNew(value);
      
    //     // Extract selected tag values
    //     const selectedTagsValues = value.map((val) => {
    //       const option = tagsoptions.find((opt) => opt.value === val);
    //       return option?.value;
    //     });
      
    //     setCombinedTagsValues(selectedTagsValues);
    //   };

    const handleTagChange = (newSelectedTags) => {
        setTagsNew(newSelectedTags);
        const selectedValues = newSelectedTags.map((option) => option.value);
        setCombinedTagsValues(selectedValues);
      };
    const [tempvalues, setTempValues] = useState();
    useEffect(() => {
        fetchidwiseData(_id);
    }, []);
    // const [subtasksNew, setSubtasksNew] = useState([]);

    //get id wise template Record
    const fetchidwiseData = async (_id) => {
        try {
            const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${_id}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
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
                }
            }
            
            // Process tasktags
            if (data.taskTemplate.tasktags && Array.isArray(data.taskTemplate.tasktags)) {
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
                        fontSize: '10px',
                        // width: ${calculateWidth(tag.tagName)}px,
                        margin: '7px', cursor: 'pointer',
                    }
                }));
                // console.log("Tags Data:", tagsData); // Log the processed tagsData

                setTagsNew(tagsData); // Assuming you have a setTags function to update your state
                const selectedTagsValues = tagsData.map((option) => option.value);
                setCombinedTagsValues(selectedTagsValues);
            }

            setTempValues(data.taskTemplate);
            tempallvalue();

            // Extract and process subtasks
            // if (data.taskTemplate.subtasks && Array.isArray(data.taskTemplate.subtasks)) {
            //     const subtasksText = data.taskTemplate.subtasks.map(subtask => subtask.text);
            //     console.log("Subtasks Text:", subtasksText); // Log the extracted subtasks text

            //     setSubtasks(subtasksText); // Assuming you have a state setter for this
            // } else {
            //     console.log("subtasks is not defined or not an array.");
            // }
            setSubtasks(data.taskTemplate.subtasks)
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
        if (tempvalues) {
            setTempNameNew(tempvalues.templatename || '');
            setStatus(tempvalues.status || '');
            setTaskDescription(tempvalues.description || '');
            setPriority(tempvalues.priority || '');
            // setStartsInNew(tempvalues.startsin || '');
            setStartsInNew(String(tempvalues.startsin ?? ''));

            // setDueInNew(tempvalues.duein || '');
            setDueInNew(String(tempvalues.duein ?? ''));

            setStartsDateNew(tempvalues.startdate ? tempvalues.startdate.substring(0, 10) : "");
            setDueDateNew(tempvalues.enddate ? tempvalues.enddate.substring(0, 10) : "");
            setStartsInDurationNew(tempvalues.startsinduration || '');
            setDueInDurationNew(tempvalues.dueinduration || '');
            setAbsoluteDates(tempvalues.absolutedates || false);
            setSubtaskSwitch(tempvalues.issubtaskschecked || false);
            // console.log(tempvalues.isclienttaskchecked)
            // setSubtasks(tempvalues.subtasks)
            
        }
    };

    const updatetasktemp = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // const subtaskData = subtasks.map(({ id, text, checked }) => ({ id, text, checked })); // Prepare subtasks data
        const subtaskData = subtasks.map(({ id, text, checked }) => ({
            id,
            text,
            checked: checked !== undefined ? checked : false // Ensure checked is either true or false
        }));

        const raw = JSON.stringify({
            templatename: tempNameNew,
            status: status,
            tasktags: combinedTagsValues,
            taskassignees: combinedValues,
            priority: priority,
            description: taskDiscription,
            absolutedates: absoluteDate,
            startsin: StartsInNew,
            startsinduration: StartsInDurationNew,
            duein: DueInNew,
            dueinduration: DueInDurationNew,
            comments: "",
            startdate: StartsDateNew,
            enddate: DueDateNew,
            subtasks: subtaskData,
            issubtaskschecked: SubtaskSwitch
        });
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        const url = `${TASK_API}/workflow/tasks/tasktemplate/${_id}`;
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(() => {
                toast.success("Task Template updated successfully");
                navigate("/firmtemp/templates/tasks")

            })
            .catch((error) => {
                // Handle errors
                console.error(error);
                toast.error("Failed to create Job Template");
            });
    };
    const updatesavetasktemp = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // const subtaskData = subtasks.map(({ id, text, checked }) => ({ id, text, checked })); // Prepare subtasks data
        const subtaskData = subtasks.map(({ id, text, checked }) => ({
            id,
            text,
            checked: checked !== undefined ? checked : false // Ensure checked is either true or false
        }));

        const raw = JSON.stringify({
            templatename: tempNameNew,
            status: status,
            tasktags: combinedTagsValues,
            taskassignees: combinedValues,
            priority: priority,
            description: taskDiscription,
            absolutedates: absoluteDate,
            startsin: StartsInNew,
            startsinduration: StartsInDurationNew,
            duein: DueInNew,
            dueinduration: DueInDurationNew,
            comments: "",
            startdate: StartsDateNew,
            enddate: DueDateNew,
            subtasks: subtaskData,
            issubtaskschecked: SubtaskSwitch
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
        fetch(url + _id, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((result) => {
                toast.success("Task Template updated successfully");


            })
            .catch((error) => {
                // Handle errors
                console.error(error);
                toast.error("Failed to create Job Template");
            });
    };
    const handleTaskTempCancle = () => {
        const hasUnsavedChanges =
            tempNameNew !== tempvalues.templatename ||
            status !== tempvalues.status ||
            taskDiscription !== tempvalues.description ||
            priority !== tempvalues.priority ||
            AssigneesNew.length !== tempvalues.taskassignees?.length ||
            tagsNew.length !== tempvalues.tasktags?.length ||
            absoluteDate !== tempvalues.absolutedates ||
            StartsDateNew !== (tempvalues.startdate ? tempvalues.startdate.substring(0, 10) : "") ||
            DueDateNew !== (tempvalues.enddate ? tempvalues.enddate.substring(0, 10) : "");

        if (hasUnsavedChanges) {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave without saving?")) {
                navigate("/firmtemp/templates/tasks");
            }
        } else {
            navigate("/firmtemp/templates/tasks");
        }
    };
    return (
        <FormPage
                title="Edit Task Template"
                subtitle="Configure your task template settings"
                actions={
                    <>
                        <Button variant="outline" onClick={handleTaskTempCancle}>Cancel</Button>
                        <Button variant="secondary" onClick={updatesavetasktemp}>Save</Button>
                        <Button onClick={updatetasktemp}>Save & Exit</Button>
                    </>
                }
            >
                <FormGrid sidebarWidth="sm">
                    {/* ===== LEFT COLUMN (70%): Main form ===== */}
                    <FormGrid.Main>

                        {/* ── General ── */}
                        <FormSection title="General" icon={<FileText className="h-4 w-4" />}>
                            <FormRow cols={2}>
                                <FormField label="Template Name" required>
                                    <Input
                                        name="TemplateName"
                                        placeholder="Enter template name"
                                        value={tempNameNew}
                                        onChange={(e) => setTempNameNew(e.target.value)}
                                    />
                                </FormField>
                                <FormField label="Status">
                                    <Status onStatusChange={handleStatusChange} selectedStatus={status} />
                                </FormField>
                            </FormRow>

                            <FormRow cols={2}>
                                <FormField label="Assignees">
                                    <MultiSelectDropdown
                                        value={selectedUser}
                                        onChange={handleUserChange}
                                        placeholder="Select assignees"
                                    />
                                </FormField>
                                <FormField label="Priority">
                                    <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
                                </FormField>
                            </FormRow>
                        </FormSection>

                        {/* ── Description ── */}
                        <FormSection title="Description">
                            <Editor initialContent={taskDiscription} onChange={handleEditorChange} />
                        </FormSection>

                        {/* ── Tags ── */}
                        <FormSection title="Tags">
                            <TagsMultiSelectDropDown
                                value={tagsNew}
                                onChange={handleTagChange}
                                placeholder="Select or search tags"
                            />
                        </FormSection>

                        {/* ── Dates ── */}
                        <FormSection title="Dates" icon={<Calendar className="h-4 w-4" />}>
                            <FormSwitchRow
                                label="Use absolute dates"
                                description="Set fixed calendar dates instead of relative offsets"
                                checked={absoluteDate}
                                onCheckedChange={handleAbsolutesDates}
                            />

                            {absoluteDate ? (
                                <FormRow cols={2}>
                                    <FormField label="Start Date">
                                        <input
                                            type="date"
                                            value={StartsDateNew}
                                            onChange={handleStartDateChange}
                                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
                                        />
                                    </FormField>
                                    <FormField label="Due Date">
                                        <input
                                            type="date"
                                            value={DueDateNew}
                                            onChange={handleDueDateChange}
                                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
                                        />
                                    </FormField>
                                </FormRow>
                            ) : (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-[80px_1fr_140px] items-center gap-3">
                                        <span className="text-sm font-medium text-foreground">Start in</span>
                                        <Input
                                            value={StartsInNew}
                                            onChange={(e) => setStartsInNew(e.target.value)}
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                        />
                                        <select
                                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                            value={StartsInDurationNew || ""}
                                            onChange={(e) => setStartsInDurationNew(e.target.value)}
                                        >
                                            <option value="">Unit</option>
                                            {dayOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr_140px] items-center gap-3">
                                        <span className="text-sm font-medium text-foreground">Due in</span>
                                        <Input
                                            value={DueInNew}
                                            onChange={(e) => setDueInNew(e.target.value)}
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                        />
                                        <select
                                            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                            value={DueInDurationNew || ""}
                                            onChange={(e) => setDueInDurationNew(e.target.value)}
                                        >
                                            <option value="">Unit</option>
                                            {dayOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </FormSection>

                    </FormGrid.Main>

                    {/* ===== RIGHT COLUMN (30%): Controls panel ===== */}
                    <FormGrid.Sidebar>
                        <FormSection
                            title="Subtasks"
                            icon={<ListChecks className="h-4 w-4" />}
                            description="Add checklist items to this task template"
                        >
                            <FormSwitchRow
                                label="Enable subtasks"
                                description="Show a subtask checklist on every task created from this template"
                                checked={SubtaskSwitch}
                                onCheckedChange={handleSubtaskSwitch}
                            />

                            {SubtaskSwitch && (
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="subtaskList">
                                        {(provided) => (
                                            <div
                                                className="space-y-2 mt-1"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {subtasks.map((subtask, index) => (
                                                    <Draggable
                                                        key={subtask.id}
                                                        draggableId={subtask.id}
                                                        index={index}
                                                    >
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
                    </FormGrid.Sidebar>
                </FormGrid>
            </FormPage>
    );
};

export default Tasks;