import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Editor from '../Texteditor/EditorShortcodes';
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from "axios";
import debounce from "lodash.debounce";
import { FormPage, FormSection, FormRow, FormGrid, ShortcodePopover, FormSelect } from "../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Trash2, Plus, GripVertical, ListChecks, Pencil, Loader2 } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";

const chatSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),
  selecteduser: z.any().refine((v) => v && v.value, { message: "Please select a sender" }),
  inputText: z.string().min(1, "Chat subject is required"),
  description: z.string().optional(),
  sendReminders: z.boolean().optional(),
  daysuntilNextReminder: z.string().optional(),
  noOfReminder: z.string().optional(),
  SubtaskSwitch: z.boolean().optional(),
});
const ChatTemp = () => {
  const navigate = useNavigate();
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const [chatTemplates, setChatTemplates] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");

  const form = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      templateName: "",
      selecteduser: null,
      inputText: "",
      description: "",
      sendReminders: false,
      daysuntilNextReminder: "3",
      noOfReminder: "1",
      SubtaskSwitch: false,
    },
  });
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

  const handleSubtaskSwitch = (checked) => {
    form.setValue("SubtaskSwitch", checked);
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
    if (form.formState.isDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmClose) return;
    }
    setShowForm(false);
    form.reset();
    setDescription("");
    setSubtasks([]);
    setCheckedSubtasks([]);
  };

  //  for shortcodes
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const handleAddShortcut = (shortcut) => {
    const current = form.getValues("inputText") || "";
    const newText = current.slice(0, cursorPosition) + `[${shortcut}]` + current.slice(cursorPosition);
    form.setValue("inputText", newText, { shouldDirty: true });
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
  {
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
}, []);

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleEditorChange = (content) => {
    setDescription(content);
    form.setValue("description", content, { shouldDirty: true });
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

  const submitChat = async (values, exitAfterSave) => {
    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      checked: checkedSubtasks.includes(id),
    }));

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      templatename: values.templateName,
      from: values.selecteduser.value,
      chatsubject: values.inputText,
      description: description,
      sendreminderstoclient: values.sendReminders,
      daysuntilnextreminder: values.daysuntilNextReminder,
      numberofreminders: values.noOfReminder,
      clienttasks: subtaskData,
      isclienttaskchecked: values.SubtaskSwitch,
      active: "true",
    });

    try {
      const response = await fetch(`${CHAT_API}/workflow/chats/chattemplate`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to save Chat Template");
      toast.success(result.message || "Chat Template saved successfully");
      if (exitAfterSave) {
        setShowForm(false);
        form.reset();
        setDescription("");
        setSubtasks([]);
        setCheckedSubtasks([]);
      }
      fetchChatTemplates();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error saving Chat Template");
    }
  };

  const savechat = form.handleSubmit((values) => submitChat(values, true));
  const saveSchat = form.handleSubmit((values) => submitChat(values, false));
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
  const checkTemplateName = async (name) => {
    try {
      const res = await axios.get(`${CHAT_API}/workflow/chats/check-name`, { params: { name } });
      if (res.data.exists) {
        form.setError("templateName", { type: "manual", message: "Template name already exists" });
      } else {
        form.clearErrors("templateName");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else form.clearErrors("templateName");
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "templateName") debouncedCheck(value.templateName);
    });
    return () => { subscription.unsubscribe(); debouncedCheck.cancel(); };
  }, [form.watch]);


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
        <Form {...form}>
          <FormPage
            title="Create Chat Template"
            subtitle="Configure your new chat template"
            actions={
              <>
                <Button type="button" variant="outline" onClick={handleCloseChatTemp}>Cancel</Button>
                <Button type="button" variant="secondary" onClick={saveSchat}>Save</Button>
                <Button type="button" onClick={savechat}>Save & Exit</Button>
              </>
            }
          >
            <FormGrid>
              {/* ===== LEFT COLUMN ===== */}
              <FormGrid.Main>
                <FormSection title="Template Details">
                  <FormField
                    control={form.control}
                    name="templateName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Template Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selecteduser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <FormSelect
                            value={field.value?.value || ""}
                            onChange={(e) => {
                              const selected = options.find((o) => o.value === e.target.value) || null;
                              field.onChange(selected);
                            }}
                          >
                            <option value="">Select Sender</option>
                            {options.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </FormSelect>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inputText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder="Subject"
                              ref={textFieldRef}
                              onClick={(e) => setCursorPosition(e.target.selectionStart)}
                              {...field}
                              onChange={(e) => { setCursorPosition(e.target.selectionStart); field.onChange(e); }}
                            />
                            <ShortcodePopover shortcuts={filteredShortcuts} onSelect={handleAddShortcut} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Description">
                  <Editor onChange={handleEditorChange} />
                </FormSection>

                <FormSection title="Reminders">
                  <FormField
                    control={form.control}
                    name="sendReminders"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Send reminders to clients</Label>
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("sendReminders") && (
                    <FormRow cols={2}>
                      <FormField
                        control={form.control}
                        name="daysuntilNextReminder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days until next reminder</FormLabel>
                            <FormControl>
                              <Input placeholder="Days until next reminder" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="noOfReminder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>No. of reminders</FormLabel>
                            <FormControl>
                              <Input placeholder="Number of reminders" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormRow>
                  )}
                </FormSection>
              </FormGrid.Main>

              {/* ===== RIGHT COLUMN: Client Tasks ===== */}
              <FormGrid.Sidebar>
                <FormSection title="Client Tasks">
                  <FormField
                    control={form.control}
                    name="SubtaskSwitch"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Enable Client Tasks</Label>
                            <Switch
                              checked={!!field.value}
                              onCheckedChange={(val) => { field.onChange(val); handleSubtaskSwitch(val); }}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("SubtaskSwitch") && (
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
                                    <div {...provided.dragHandleProps} className="cursor-grab rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent">
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <Button type="button" variant="ghost" size="sm" onClick={handleAddSubtask} className="mt-2 w-full text-primary">
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
        </Form>
      )}
    </div>
  );
};

export default ChatTemp;