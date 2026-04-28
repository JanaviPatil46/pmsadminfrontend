import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, Trash2, PlusCircle, ChevronDown } from "lucide-react";
import AccountMultiSelectDropdown from "../Templates/AccountMultiSelectDropdown";
import { toast } from "react-toastify";
import EditorShortcodes from "../Templates/Texteditor/EditorShortcodes";
import { LoginContext } from "../Sidebar/Context/Context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";
const ChatForm = ({ handleNewDrawerClose, handleDrawerClose }) => {
  const { logindata } = useContext(LoginContext);
  console.log("login data", logindata);
  const [loginUserId, setLoginUserId] = useState();

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  console.log("Login User ID:", loginUserId);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [username, setUsername] = useState("");
  console.log(logindata);
  const fetchUserData = async (id) => {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);

        // console.log(userData)
        setUsername(result.username);
      });
  };
  const handleClose = () => {
    handleNewDrawerClose();
    // handleDrawerClose();
  };
  const [selectedaccount, setSelectedaccount] = useState();

  const [combinedaccountValues, setCombinedaccountValues] = useState();
  const handleAccountChange = (newSelectedAcc) => {
    setSelectedaccount(newSelectedAcc);
    console.log(newSelectedAcc);
    const selectedValues = newSelectedAcc.map((option) => option.value);
    setCombinedaccountValues(selectedValues);
    console.log(selectedValues);
  };
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const [chatTemplates, setChatTemplates] = useState([]);
  const fetchChatTemplates = async () => {
    try {
      const url = `${CHAT_API}/workflow/chats/chattemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch ChatTemplate");
      }
      const data = await response.json();
      setChatTemplates(data.chatTemplate);
    } catch (error) {
      console.error("Error fetching ChatTemplate:", error);
    }
  };

  const invoiceoptions = chatTemplates.map((Chat) => ({
    value: Chat._id,
    label: Chat.templatename,
  }));

  //chattemps

  useEffect(() => {
    fetchChatTemplates();
    fetchUserData(logindata.user.id);
  }, []);
  //for shortcode
  const [inputText, setInputText] = useState("");
  const [inputTextError, setInputTextError] = useState("");

  const [selectedShortcut, setSelectedShortcut] = useState("");
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");

  const shortcodeRef = useRef(null);
  const toggleDropdown = (event) => {
    setShowDropdown(!showDropdown);
  };
  const handleAddShortcut = (shortcut) => {
    setInputText((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };
  useEffect(() => {
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
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
  // useEffect(() => {
  //   // Set shortcuts based on selected option
  //   if (selectedOption === "contacts") {
  //     const contactShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       {
  //         title: "Custom field:Website",
  //         isBold: false,
  //         value: "ACCOUNT_CUSTOM_FIELD:Website",
  //       },
  //       { title: "Contact Shortcodes", isBold: true },
  //       { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
  //       { title: "First Name", isBold: false, value: "FIRST_NAME" },
  //       { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
  //       { title: "Last Name", isBold: false, value: "LAST_NAME" },
  //       { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
  //       { title: "Country", isBold: false, value: "COUNTRY" },
  //       { title: "Company name", isBold: false, value: "COMPANY_NAME " },
  //       { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
  //       { title: "City", isBold: false, value: "CITY" },
  //       { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
  //       { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
  //       {
  //         title: "Custom field:Email",
  //         isBold: false,
  //         value: "CONTACT_CUSTOM_FIELD:Email",
  //       },
  //       { title: "Date Shortcodes", isBold: true },
  //       {
  //         title: "Current day full date",
  //         isBold: false,
  //         value: "CURRENT_DAY_FULL_DATE",
  //       },
  //       {
  //         title: "Current day number",
  //         isBold: false,
  //         value: "CURRENT_DAY_NUMBER",
  //       },
  //       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  //       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  //       {
  //         title: "Current month number",
  //         isBold: false,
  //         value: "CURRENT_MONTH_NUMBER",
  //       },
  //       {
  //         title: "Current month name",
  //         isBold: false,
  //         value: "CURRENT_MONTH_NAME",
  //       },
  //       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  //       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  //       {
  //         title: "Last day full date",
  //         isBold: false,
  //         value: "LAST_DAY_FULL_DATE",
  //       },
  //       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  //       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  //       { title: "Last week", isBold: false, value: "LAST_WEEK" },
  //       {
  //         title: "Last month number",
  //         isBold: false,
  //         value: "LAST_MONTH_NUMBER",
  //       },
  //       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  //       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  //       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  //       {
  //         title: "Next day full date",
  //         isBold: false,
  //         value: "NEXT_DAY_FULL_DATE",
  //       },
  //       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  //       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  //       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  //       {
  //         title: "Next month number",
  //         isBold: false,
  //         value: "NEXT_MONTH_NUMBER",
  //       },
  //       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  //       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  //       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  //     ];
  //     setShortcuts(contactShortcuts);
  //   } else if (selectedOption === "account") {
  //     const accountShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       {
  //         title: "Custom field:Website",
  //         isBold: false,
  //         value: "ACCOUNT_CUSTOM_FIELD:Website",
  //       },
  //       { title: "Date Shortcodes", isBold: true },
  //       {
  //         title: "Current day full date",
  //         isBold: false,
  //         value: "CURRENT_DAY_FULL_DATE",
  //       },
  //       {
  //         title: "Current day number",
  //         isBold: false,
  //         value: "CURRENT_DAY_NUMBER",
  //       },
  //       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  //       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  //       {
  //         title: "Current month number",
  //         isBold: false,
  //         value: "CURRENT_MONTH_NUMBER",
  //       },
  //       {
  //         title: "Current month name",
  //         isBold: false,
  //         value: "CURRENT_MONTH_NAME",
  //       },
  //       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  //       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  //       {
  //         title: "Last day full date",
  //         isBold: false,
  //         value: "LAST_DAY_FULL_DATE",
  //       },
  //       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  //       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  //       { title: "Last week", isBold: false, value: "LAST_WEEK" },
  //       {
  //         title: "Last month number",
  //         isBold: false,
  //         value: "LAST_MONTH_NUMBER",
  //       },
  //       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  //       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  //       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  //       {
  //         title: "Next day full date",
  //         isBold: false,
  //         value: "NEXT_DAY_FULL_DATE",
  //       },
  //       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  //       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  //       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  //       {
  //         title: "Next month number",
  //         isBold: false,
  //         value: "NEXT_MONTH_NUMBER",
  //       },
  //       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  //       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  //       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  //     ];
  //     setShortcuts(accountShortcuts);
  //   }
  // }, [selectedOption]);
  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  //for texteditor.
  const [description, setDescription] = useState("");
  const handleEditorChange = (content) => {
    setDescription(content);
  };
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };
  ///clienttask

  const [subtasks, setSubtasks] = useState([
   
  ]);
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);
    setSubtasks(newSubtasks);
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

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

  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const handleCheckboxChange = (id, description) => {
    setCheckedSubtasks((prevCheckedSubtasks) => {
      const updatedCheckedSubtasks = prevCheckedSubtasks.includes(id)
        ? prevCheckedSubtasks.filter((checkedId) => checkedId !== id)
        : [...prevCheckedSubtasks, id];
      console.log(updatedCheckedSubtasks);
      return updatedCheckedSubtasks;
    });
  };
  const [selectInvoiceTemp, setSelectedInvoiceTemp] = useState("");
  const [templateId, setTemplateId] = useState(null);

  const handleInvoiceTempChange = async (event, newValue) => {
    setSelectedInvoiceTemp(newValue);
    if (newValue && newValue.value) {
      const templateId = newValue.value;
      setTemplateId(templateId);
      try {
        const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${templateId}`;
        const response = await fetch(url);
        const result = await response.json();
        const chatTemplate = result.chatTemplate;

        setAbsoluteDates(chatTemplate.sendreminderstoclient);
        setTemplateName(chatTemplate.templatename);
        setInputText(chatTemplate.chatsubject);
        setDescription(chatTemplate.description);
        setDaysuntilNextReminder(chatTemplate.daysuntilnextreminder);
        setNoOfReminder(chatTemplate.numberofreminders);
        setSubtasks(
          chatTemplate.clienttasks.flat().map((task) => ({
            id: task.id,
            text: task.text,
            checked: task.checked,
          }))
        );
        console.log("Subtasks updated:", subtasks);
      } catch (error) {
        console.error("Error fetching chat template:", error);
      }
    }
  };

  const [templateName, setTemplateName] = useState("");

  ///for drawer save btn
  const saveChat = () => {
     // Validation checks
  if (!selectInvoiceTemp || !selectInvoiceTemp.value) {
    toast.error("Please select a template before saving the chat.");
    return;
  }

  if (!inputText.trim() && !selectedShortcut.trim()) {
    toast.error("Please enter a subject before saving the chat.");
    return;
  }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const selectedAccountIds = selectedaccount.map((account) => account.value);
    const subtaskData = subtasks.map(({ id, text, checked }) => ({
      id,
      text,
      checked: checked !== undefined ? checked : false, // Ensure checked is either true or false
    }));
    const messageData = [
      {
        message: description,
        fromwhome: "Admin",
      },
    ];

    const raw = JSON.stringify({
      accountids: selectedAccountIds,
      chattemplateid: selectInvoiceTemp?.value,
      templatename: templateName,
      // from: "65e7149c570b4c1aba9fcfd4",
      chatsubject: inputText + selectedShortcut,
      // description: description,
      description: messageData,
      sendreminderstoclient: absoluteDate,
      daysuntilnextreminder: daysuntilNextReminder,
      numberofreminders: noOfReminder,
      clienttasks: subtaskData,
      // isclienttaskchecked: SubtaskSwitch,
      active: "true",
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // console.log("chat id",result.newChats._id)
        // setChatId(result.newChats._id)
        toast.success("New Chat created successfully");
        
        handleClose();
        setSelectedInvoiceTemp("")
        setSelectedaccount()
        setDescription("")
        setInputText("")
        setNoOfReminder(1)
        setDaysuntilNextReminder(3)
        setAbsoluteDates(false)
      })
      .catch((error) => {
        console.error("Fetch error: ", error.message);
        toast.error("Failed to create new chat. Please try again.");
      });
  };
  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
  // mail for drawer btn
  const sendSaveChatMail = (chatId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const selectedAccountIds = selectedaccount.map((account) => account.value);
    console.log("cjksdf", selectedAccountIds);
    const raw = JSON.stringify({
      accountid: selectedAccountIds,
      chattemplateid: templateId,
      username: username,
      chatId: chatId,
      viewchatlink: "/login",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    fetch(`${CHATTOCLIENT_API}/chatsend/securechatsend`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-5">

      {/* ── Recipients ── */}
      <div className="space-y-1.5">
        <Label>To</Label>
        <AccountMultiSelectDropdown
          value={selectedaccount}
          onChange={handleAccountChange}
          placeholder="Select accounts"
        />
      </div>

      {/* ── Template ── */}
      <div className="space-y-1.5">
        <Label htmlFor="cf-template">Template</Label>
        <select
          id="cf-template"
          className={selectCls}
          value={selectInvoiceTemp?.value || ""}
          onChange={(e) => {
            const opt = invoiceoptions.find(o => o.value === e.target.value);
            handleInvoiceTempChange(null, opt || null);
          }}
        >
          <option value="">Select template</option>
          {invoiceoptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── Subject ── */}
      <div className="space-y-1.5">
        <Label htmlFor="cf-subject">Subject</Label>
        <Input
          id="cf-subject"
          name="subject"
          value={inputText + selectedShortcut}
          onChange={handlechatsubject}
          placeholder="Enter subject"
          className={inputTextError ? "border-destructive" : ""}
        />
      </div>

      {/* ── Shortcode picker ── */}
      <div className="relative" ref={shortcodeRef}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleDropdown}
        >
          Add Shortcode <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>

        {showDropdown && (
          <div className="absolute left-0 top-full mt-1 z-50 w-72 max-h-64 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
            {filteredShortcuts.map((shortcut, index) => (
              <div
                key={index}
                onClick={() => handleAddShortcut(shortcut.value)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors ${
                  shortcut.isBold ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {shortcut.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Message body ── */}
      <div className="space-y-1.5">
        <Label>Message</Label>
        <EditorShortcodes
          initialContent={description}
          onChange={handleEditorChange}
        />
      </div>

      {/* ── Reminders ── */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Send reminders to clients</p>
            <p className="text-xs text-muted-foreground">Automatically follow up with clients</p>
          </div>
          <Switch checked={absoluteDate} onCheckedChange={handleAbsolutesDates} />
        </div>

        {absoluteDate && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="cf-days">Days until next reminder</Label>
              <Input
                id="cf-days"
                type="number"
                value={daysuntilNextReminder}
                onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf-count">Number of reminders</Label>
              <Input
                id="cf-count"
                type="number"
                value={noOfReminder}
                onChange={(e) => setNoOfReminder(e.target.value)}
                placeholder="e.g. 2"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Client tasks ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client Tasks</p>
          <button
            type="button"
            onClick={handleAddSubtask}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Add Task
          </button>
        </div>

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
                          checked={checkedSubtasks.includes(subtask.id)}
                          onCheckedChange={() => handleCheckboxChange(subtask.id, subtask.checked)}
                        />
                        <Input
                          placeholder="Things to do"
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
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* ── Footer actions ── */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
        <Button variant="ghost" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={saveChat}>
          Create Chat
        </Button>
      </div>

    </div>
  );
};

export default ChatForm;
