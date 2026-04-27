import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, } from "react-router-dom";
import Editor from '../Texteditor/EditorShortcodes';
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from "axios";
import debounce from "lodash.debounce";
import { FormPage, FormSection, FormField, FormRow, FormGrid, ShortcodePopover, FormSelect } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Trash2, Plus, GripVertical, ListChecks, Pencil, Loader2 } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
const ChatTemp = () => {
  const navigate = useNavigate();
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const [chatTemplates, setChatTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [selecteduser, setSelectedUser] = useState('');
  const [inputText, setInputText] = useState('');
  const [userData, setUserData] = useState([]);

  // const [emailBody, setEmailBody] = useState('');
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState('3');
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState('');
  const handleCreateChat = () => {
    setShowForm(true);
  };

  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prevChecked) => 
      prevChecked.includes(id) 
        ? prevChecked.filter(checkedId => checkedId !== id) 
        : [...prevChecked, id]
    );
  };
  
  const [subtasks, setSubtasks] = useState([]);

  const handleAddSubtask = () => {
  const newId = subtasks.length + 1;   // this will be number
  setSubtasks([...subtasks, { id: newId, text: "", checked: false }]);
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

  const handleCloseChatTemp = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templateName || selecteduser || description) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templateName, selecteduser, description]);

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

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes('')));
  }, [shortcuts]);
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

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };
  //Integration 

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
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

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
  useEffect(() => {
    fetchData();
  }, []);
  const [loading, setLoading] = useState(true); // Loader state
  const fetchChatTemplates = async () => {
    setLoading(true); // Start loader

    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${CHAT_API}/workflow/chats/chattemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch Chat templates');
      }
      const data = await response.json();
      setChatTemplates(data.chatTemplate);


    } catch (error) {
      console.error('Error fetching Chat templates:', error);
    }
    finally {
      // Wait for the fetch and the 3-second timer to complete
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };
  useEffect(() => {
    fetchChatTemplates();
  }, []);

  const handleClearTemplate = () => {
    setTemplateName('');
    setSelectedUser('');
    setInputText('');
    setNoOfReminder('');
    setSubtaskSwitch(false)
    setDescription('');
    setDaysuntilNextReminder('');
    // subtasks([])
    setCheckedSubtasks([])
  }
const savechat = async () => {
  if (!validateForm()) {
    return; // Prevent form submission if validation fails
  }
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const subtaskData = subtasks.map(({ id, text }) => ({
    id,
    text,
    checked: checkedSubtasks.includes(id),
  }));

  const raw = JSON.stringify({
    templatename: templateName,
    from: selecteduser.value,
    chatsubject: inputText,
    description: description,
    sendreminderstoclient: absoluteDate,
    daysuntilnextreminder: daysuntilNextReminder,
    numberofreminders: noOfReminder,
    clienttasks: subtaskData,
    isclienttaskchecked: SubtaskSwitch,
    active: "true"
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const url = `${CHAT_API}/workflow/chats/chattemplate`;
  
  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to save Chat Template");
    }

    if (result.message === "ChatTemplate created successfully" || 
        result.message === "ChatTemplate updated successfully") {
      toast.success(result.message);
      handleClearTemplate();
      fetchChatTemplates();
      setShowForm(false);
    } else {
      toast.error(result.message || "Unexpected response from server");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Error saving Chat Template");
  }
}

const saveSchat = async () => {
  if (!validateForm()) {
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
    templatename: templateName,
    from: selecteduser.value,
    chatsubject: inputText,
    description: description,
    sendreminderstoclient: absoluteDate,
    daysuntilnextreminder: daysuntilNextReminder,
    numberofreminders: noOfReminder,
    clienttasks: subtaskData,
    isclienttaskchecked: SubtaskSwitch,
    active: "true"
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const url = `${CHAT_API}/workflow/chats/chattemplate`;
  
  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to save Chat Template");
    }

    if (result.message === "ChatTemplate created successfully" || 
        result.message === "ChatTemplate updated successfully") {
      toast.success(result.message);
      fetchChatTemplates();
    } else {
      toast.error(result.message || "Unexpected response from server");
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Error saving Chat Template");
  }
}
  //Edit
  const handleEdit = (_id) => {
    navigate("chatTemplateUpdate/" + _id);
  };

  //delete template
  const handleDelete = (_id) => {

    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this chat template?");
        
    // Proceed with deletion if confirmed
    if (isConfirmed) {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow"
    };

    // Ensure the URL is correct, with _id appended correctly
    const url = `${CHAT_API}/workflow/chats/chattemplate/${_id}`;

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete item');
        }
        return response.json();
      })
      .then(() => {
        toast.success('Item deleted successfully');
        fetchChatTemplates();
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to delete item');
      });
    }

  };
  const [globalFilter, setGlobalFilter] = useState("");

  const chatColumns = useMemo(() => [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);
  const [templateNameError, setTemplateNameError] = useState('');
  const [selectedUserError, setSelectedUserError] = useState('');
  const [inputTextError, setInputTextError] = useState('');

// Debounced function to check template name existence
const checkTemplateName = async (name) => {
    try {
      const res = await axios.get(`${CHAT_API}/workflow/chats/check-name`, {
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
    debouncedCheck(templateName);
    return debouncedCheck.cancel;
  }, [templateName]);
  const validateForm = () => {
    let isValid = true;

  
    if (!templateName) {
      setTemplateNameError("Template name is required");
      
      isValid = false;
    } else {
      setTemplateNameError('');
    }

    if (!selecteduser) {
      setSelectedUserError('Please select a user');
      isValid = false;
    } else {
      setSelectedUserError('');
    }

    if (inputText.trim() === '') {
      setInputTextError('Chat subject is required');
      isValid = false;
    } else {
      setInputTextError('');
    }



    return isValid;
  };


  return (
    <div>
      {!showForm ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreateChat}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Chat
            </Button>
          </div>
          <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
          <DataTable
            columns={chatColumns}
            data={chatTemplates}
            loading={loading}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            enableRowSelection={false}
            getRowId={(row) => row._id}
            emptyMessage="No chat templates found"
            emptyDescription="Create your first chat template to get started"
            pageSize={30}
          />
        </div>
      ) : (
        <FormPage
          title="Create Chat Template"
          subtitle="Configure your new chat template"
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
              <FormSection title="Template Details">
                <FormField label="Name" error={templateNameError}>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    name="TemplateName"
                    placeholder="Template Name"
                    error={!!templateNameError}
                  />
                </FormField>

                <FormField label="From" error={selectedUserError}>
                  <FormSelect
                    value={selecteduser?.value || ""}
                    onChange={(e) => {
                      const selected = options.find((o) => o.value === e.target.value) || null;
                      handleuserChange(null, selected);
                    }}
                    error={!!selectedUserError}
                  >
                    <option value="">Select Sender</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </FormSelect>
                </FormField>

                <FormField label="Subject" error={inputTextError}>
                  <div className="space-y-2">
                    <Input
                      name="subject"
                      ref={textFieldRef}
                      value={inputText}
                      onChange={handlesubject}
                      onClick={(e) => setCursorPosition(e.target.selectionStart)}
                      placeholder="Subject"
                      error={!!inputTextError}
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
                <Editor onChange={handleEditorChange} />
              </FormSection>

              {/* Reminders */}
              <FormSection title="Reminders">
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
              <FormSection title="Client Tasks">
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
                            <Draggable key={subtask.id} draggableId={String(subtask.id)} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-sm"
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
      )}
    </div>
  );
};

export default ChatTemp;