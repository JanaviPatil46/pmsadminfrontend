import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Editor from '../Texteditor/EditorShortcodes';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FormPage, FormSection, FormField, FormRow, FormGrid, ShortcodePopover } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Trash2, Plus, GripVertical, MessageCircle, User, Bell, ListChecks } from "lucide-react";
const ChatTempUpdate = () => {

    const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
   
    const [selectedShortcut, setSelectedShortcut] = useState('');
   
    const [absoluteDate, setAbsoluteDates] = useState(false);
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };
  const [initialData, setInitialData] = useState({});
  const hasUnsavedChanges = () => {
    return (
        templateName !== initialData.templateName ||
        selecteduser.value !== initialData.selectedUser.value ||
        inputText !== initialData.inputText ||
        description !== initialData.description ||
        absoluteDate !== initialData.absoluteDate ||
        daysuntilNextReminder !== initialData.daysuntilNextReminder ||
        noOfReminder !== initialData.noOfReminder
    );
};
    // const handleCloseChatTemp = () => {
    //     if (hasUnsavedChanges()) {
    //         if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
    //             navigate("/firmtemp/templates/chats");
    //         }
    //     } else {
    //         navigate("/firmtemp/templates/chats");
    //     }
    //     // navigate("/firmtemp/templates/chats");
    // };
    
    const navigate = useNavigate();
    //  for shortcodes
    const [showDropdown, setShowDropdown] = useState(false);
    const [shortcuts, setShortcuts] = useState([]);
    const [filteredShortcuts, setFilteredShortcuts] = useState([]);
    const [selectedOption, setSelectedOption] = useState('contacts');
    
    const [anchorEl, setAnchorEl] = useState(null);
    const toggleDropdown = (event) => {
        setAnchorEl(event.currentTarget);
        setShowDropdown(!showDropdown);
    };
    const [cursorPosition, setCursorPosition] = useState(0);
      const textFieldRef = useRef(null);
      const handlesubject = (e) => {
        const { value,selectionStart  } = e.target;
        setInputText(value);
        setCursorPosition(selectionStart);
      };
      const handleAddShortcut = (shortcut) => {
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
    
        setShowDropdown(false);
    };
    // const handleAddShortcut = (shortcut) => {
    //     setInputText((prevText) => prevText + `[${shortcut}]`);
    //     setShowDropdown(false);
    // };

    useEffect(() => {
        // Simulate filtered shortcuts based on some logic (e.g., search)
        setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes('')));
    }, [shortcuts]);
useEffect(() => {
  if (selectedOption === "contacts" || selectedOption === "account") {
    const accountShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    //   { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
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

    // useEffect(() => {
    //     // Set shortcuts based on selected option
    //     if (selectedOption === 'contacts') {
    //         const contactShortcuts = [
    //             { title: 'Account Shortcodes', isBold: true },
    //             { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
    //             { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
    //             { title: 'Contact Shortcodes', isBold: true, },
    //             { title: 'Contact Name', isBold: false, value: 'CONTACT_NAME' },
    //             { title: 'First Name', isBold: false, value: 'FIRST_NAME' },
    //             { title: 'Middle Name', isBold: false, value: 'MIDDLE_NAME' },
    //             { title: 'Last Name', isBold: false, value: 'LAST_NAME' },
    //             { title: 'Phone number', isBold: false, value: 'PHONE_NUMBER' },
    //             { title: 'Country', isBold: false, value: 'COUNTRY' },
    //             { title: 'Company name', isBold: false, value: 'COMPANY_NAME ' },
    //             { title: 'Street address', isBold: false, value: 'STREET_ADDRESS' },
    //             { title: 'City', isBold: false, value: 'CITY' },
    //             { title: 'State/Province', isBold: false, value: 'STATE / PROVINCE' },
    //             { title: 'Zip/Postal code', isBold: false, value: 'ZIP / POSTAL CODE' },
    //             { title: 'Custom field:Email', isBold: false, value: 'CONTACT_CUSTOM_FIELD:Email' },
    //             { title: 'Date Shortcodes', isBold: true },
    //             { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
    //             { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
    //             { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
    //             { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
    //             { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
    //             { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
    //             { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
    //             { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
    //             { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
    //             { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
    //             { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
    //             { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
    //             { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
    //             { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
    //             { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
    //             { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
    //             { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
    //             { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
    //             { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
    //             { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
    //             { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
    //             { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
    //             { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
    //             { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
    //         ];
    //         setShortcuts(contactShortcuts);
    //     } else if (selectedOption === 'account') {
    //         const accountShortcuts = [
    //             { title: 'Account Shortcodes', isBold: true },
    //             { title: 'Account Name', isBold: false, value: 'ACCOUNT_NAME' },
    //             { title: 'Custom field:Website', isBold: false, value: 'ACCOUNT_CUSTOM_FIELD:Website' },
    //             { title: 'Date Shortcodes', isBold: true },
    //             { title: 'Current day full date', isBold: false, value: 'CURRENT_DAY_FULL_DATE' },
    //             { title: 'Current day number', isBold: false, value: 'CURRENT_DAY_NUMBER' },
    //             { title: 'Current day name', isBold: false, value: 'CURRENT_DAY_NAME' },
    //             { title: 'Current week', isBold: false, value: 'CURRENT_WEEK' },
    //             { title: 'Current month number', isBold: false, value: 'CURRENT_MONTH_NUMBER' },
    //             { title: 'Current month name', isBold: false, value: 'CURRENT_MONTH_NAME' },
    //             { title: 'Current quarter', isBold: false, value: 'CURRENT_QUARTER' },
    //             { title: 'Current year', isBold: false, value: 'CURRENT_YEAR' },
    //             { title: 'Last day full date', isBold: false, value: 'LAST_DAY_FULL_DATE' },
    //             { title: 'Last day number', isBold: false, value: 'LAST_DAY_NUMBER' },
    //             { title: 'Last day name', isBold: false, value: 'LAST_DAY_NAME' },
    //             { title: 'Last week', isBold: false, value: 'LAST_WEEK' },
    //             { title: 'Last month number', isBold: false, value: 'LAST_MONTH_NUMBER' },
    //             { title: 'Last month name', isBold: false, value: 'LAST_MONTH_NAME' },
    //             { title: 'Last quarter', isBold: false, value: 'LAST_QUARTER' },
    //             { title: 'Last_year', isBold: false, value: 'LAST_YEAR' },
    //             { title: 'Next day full date', isBold: false, value: 'NEXT_DAY_FULL_DATE' },
    //             { title: 'Next day number', isBold: false, value: 'NEXT_DAY_NUMBER' },
    //             { title: 'Next day name', isBold: false, value: 'NEXT_DAY_NAME' },
    //             { title: 'Next week', isBold: false, value: 'NEXT_WEEK' },
    //             { title: 'Next month number', isBold: false, value: 'NEXT_MONTH_NUMBER' },
    //             { title: 'Next month name', isBold: false, value: 'NEXT_MONTH_NAME' },
    //             { title: 'Next quarter', isBold: false, value: 'NEXT_QUARTER' },
    //             { title: 'Next year', isBold: false, value: 'NEXT_YEAR' }
    //         ];
    //         setShortcuts(accountShortcuts);
    //     }
    // }, [selectedOption]);
    // console.log(selectedOption)
    const handleCloseDropdown = () => {
        setAnchorEl(null);
        setShowDropdown(false);
    };
    //Integration 
    const { id } = useParams();
    // const [chatTemplates, setChatTemplates] = useState([]);
    const [templateName, setTemplateName] = useState('');
    const [selecteduser, setSelectedUser] = useState('');
    const [inputText, setInputText] = useState('');
    const [userData, setUserData] = useState([]);

    const [daysuntilNextReminder, setDaysuntilNextReminder] = useState();
    const [noOfReminder, setNoOfReminder] = useState();
    const [description, setDescription] = useState('');
    
    const handlechatsubject = (e) => {
        const { value } = e.target;
        setInputText(value);
    };

    const options = userData.map((user) => ({
        value: user._id,
        label: user.username,
    }));

    const handleuserChange = (event, selectedOptions) => {
        setSelectedUser(selectedOptions);

    };
    


    const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
    const handleEditorChange = (content) => {
        setDescription(content);
    };
   
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

    useEffect(() => {
        fetchData();
      }, []);
  
    const fetchChatTemplate = async () => {
        try {
            const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${id}`;
            const response = await fetch(url);
            const result = await response.json();
    
            const chatTemplate = result.chatTemplate;
            
            if (chatTemplate && chatTemplate.from) {
                setSelectedUser({
                    label: chatTemplate.from.username,
                    value: chatTemplate.from._id
                });
            }
            setAbsoluteDates(chatTemplate.sendreminderstoclient)
            console.log(chatTemplate.sendreminderstoclient)
            setTemplateName(chatTemplate.templatename) ;
            setInputText(chatTemplate.chatsubject);
            setDescription(chatTemplate.description);
            
            setDaysuntilNextReminder(chatTemplate.daysuntilnextreminder);
            setNoOfReminder(chatTemplate.numberofreminders);

            setSubtaskSwitch(chatTemplate.isclienttaskchecked)
            setSubtasks(chatTemplate.clienttasks)
            setInitialData({
                templateName: chatTemplate.templatename,
                selectedUser: {
                    label: chatTemplate.from.username,
                    value: chatTemplate.from._id
                },
                inputText: chatTemplate.chatsubject,
                description: chatTemplate.description,
                absoluteDate: chatTemplate.sendreminderstoclient,
                daysuntilNextReminder: chatTemplate.daysuntilnextreminder,
                noOfReminder: chatTemplate.numberofreminders,
                SubtaskSwitch: chatTemplate.isclienttaskchecked,
                subtasks:chatTemplate.clienttasks
            });
        } catch (error) {
            console.error("Error fetching chat template:", error);
        }
    };
    
    useEffect(() => {
        fetchChatTemplate();
    }, [id]);

    const [subtasks, setSubtasks] = useState([]);
    const [checkedSubtasks, setCheckedSubtasks] = useState([]);

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
    useEffect(() => {
        console.log("Updated checkedSubtasks:", checkedSubtasks);
        console.log("Updated subtasks:", subtasks);
    }, [checkedSubtasks, subtasks]);

    // const handleAddSubtask = () => {
    //     const newId = String(subtasks.length + 1);
    //     setSubtasks([...subtasks, { id: newId, text: "" }]);
    // };
const handleAddSubtask = () => {
  const newId = subtasks.length + 1;   // this will be number
  setSubtasks([...subtasks, { id: newId, text: "", checked: false }]);
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

    const savechat = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const subtaskData = subtasks.map(({ id, text, checked }) => ({
            id,
            text,
            checked: checked !== undefined ? checked : false // Ensure checked is either true or false
        }));
        const raw = JSON.stringify({
            templatename:  templateName,
            from: selecteduser.value,
            chatsubject: inputText,
            description: description,
            sendreminderstoclient: absoluteDate,
            daysuntilnextreminder: daysuntilNextReminder,
            numberofreminders: noOfReminder,
            clienttasks: subtaskData,
            isclienttaskchecked:SubtaskSwitch,
            active: "true"
        });
    
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        const url = `${CHAT_API}/workflow/chats/chattemplate/` + id;
        
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((result) => {
                console.log(result.message);
                if (result && result.message === "ChatTemplate Updated successfully") {
                    toast.success("ChatTemplate updated successfully");
                    navigate("/firmtemp/templates/chats");
                
                } else {
                    toast.error(result.message || "Failed to update Chat Template");
                }
            })
            .catch((error) => console.error(error));
    }
    const saveSchat= async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const subtaskData = subtasks.map(({ id, text, checked }) => ({
            id,
            text,
            checked: checked !== undefined ? checked : false // Ensure checked is either true or false
        }));
        const raw = JSON.stringify({
            templatename:  templateName,
            from: selecteduser.value,
            chatsubject: inputText,
            description: description,
            sendreminderstoclient: absoluteDate,
            daysuntilnextreminder: daysuntilNextReminder,
            numberofreminders: noOfReminder,
            clienttasks: subtaskData,
            isclienttaskchecked:SubtaskSwitch,
            active: "true"
        });
    
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        const url = `${CHAT_API}/workflow/chats/chattemplate/` + id;
        
        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((result) => {
                console.log(result.message);
                if (result && result.message === "ChatTemplate Updated successfully") {
                    toast.success("ChatTemplate updated successfully");
                 
                
                } else {
                    toast.error(result.message || "Failed to update Chat Template");
                }
            })
            .catch((error) => console.error(error));
    }
  
 
    const [isFormFilled, setIsFormFilled] = useState(false);
    const handleCloseChatTemp = () => {
        if (isFormFilled) {
            const confirmCancel = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
            if (confirmCancel) {
                navigate("/firmtemp/templates/chats");
            }
        } else {
            navigate("/firmtemp/templates/chats");
        }
    };

    useEffect(() => {
        // Check if form is filled
        const checkIfFormFilled = () => {
            if (templateName || inputText || description || selecteduser || daysuntilNextReminder || noOfReminder ||absoluteDate) {
                setIsFormFilled(true);
            } else {
                setIsFormFilled(false);
            }
        };

        checkIfFormFilled();
    }, [templateName ,inputText ,description ,selecteduser,daysuntilNextReminder,noOfReminder,absoluteDate]); 
       
    return (
        <FormPage
            title="Edit Chat Template"
            subtitle="Configure your chat template settings"
            actions={
                <>
                    <Button variant="outline" onClick={handleCloseChatTemp}>
                        Cancel
                    </Button>
                    <Button variant="secondary" onClick={saveSchat}>
                        Save
                    </Button>
                    <Button onClick={savechat}>
                        Save & Exit
                    </Button>
                </>
            }
        >
            <FormGrid>
                {/* ===== LEFT COLUMN: Chat Form ===== */}
                <FormGrid.Main>
                    <FormSection title="Template Details" icon={<MessageCircle className="h-4 w-4" />}>
                        <FormField label="Name">
                            <Input
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                name="TemplateName"
                                placeholder="Template Name"
                            />
                        </FormField>

                        <FormField label="From">
                            <select
                                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={selecteduser?.value || ""}
                                onChange={(e) => {
                                    const selected = options.find((o) => o.value === e.target.value) || null;
                                    handleuserChange(null, selected);
                                }}
                            >
                                <option value="">Select Sender</option>
                                {options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Subject">
                            <div className="space-y-2">
                                <Input
                                    name="subject"
                                    ref={textFieldRef}
                                    value={inputText}
                                    onChange={handlesubject}
                                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                    placeholder="Subject"
                                />
                                <ShortcodePopover
                                    shortcuts={filteredShortcuts}
                                    onSelect={handleAddShortcut}
                                />
                            </div>
                        </FormField>
                    </FormSection>

                    {/* Description */}
                    <FormSection title="Description">
                        <Editor onChange={handleEditorChange} initialContent={description} />
                    </FormSection>

                    {/* Reminders */}
                    <FormSection title="Reminders" icon={<Bell className="h-4 w-4" />}>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Send reminders to clients</Label>
                            <Switch
                                checked={absoluteDate}
                                onCheckedChange={handleAbsolutesDates}
                            />
                        </div>

                        {absoluteDate && (
                            <FormRow cols={2}>
                                <FormField label="Days until next reminder">
                                    <Input
                                        name="Daysuntilnextreminder"
                                        value={daysuntilNextReminder}
                                        onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                                        placeholder="Days until next reminder"
                                    />
                                </FormField>
                                <FormField label="No. of reminders">
                                    <Input
                                        name="NoOfreminders"
                                        value={noOfReminder}
                                        onChange={(e) => setNoOfReminder(e.target.value)}
                                        placeholder="Number of reminders"
                                    />
                                </FormField>
                            </FormRow>
                        )}
                    </FormSection>
                </FormGrid.Main>

                {/* ===== RIGHT COLUMN: Client Tasks ===== */}
                <FormGrid.Sidebar>
                    <FormSection title="Client Tasks" icon={<ListChecks className="h-4 w-4" />}>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Enable Client Tasks</Label>
                            <Switch
                                checked={SubtaskSwitch}
                                onCheckedChange={handleSubtaskSwitch}
                            />
                        </div>

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
                                                            className="flex items-center gap-2 rounded-lg border border-border bg-white p-2 shadow-sm"
                                                        >
                                                            <Checkbox
                                                                checked={checkedSubtasks.includes(subtask.id)}
                                                                onCheckedChange={() => handleCheckboxChange(subtask.id, subtask.checked)}
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
    );
};

export default ChatTempUpdate;



