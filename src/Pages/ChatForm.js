import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { FiPlusCircle } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { X } from "lucide-react";
import AccountMultiSelectDropdown from "../Templates/AccountMultiSelectDropdown";
import { toast } from "react-toastify";
import EditorShortcodes from "../Templates/Texteditor/EditorShortcodes";
import { LoginContext } from "../Sidebar/Context/Context";
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
  const inputCls = "w-full border border-border rounded px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/40";
  const labelCls = "block text-sm font-medium text-foreground mb-1";

  return (
    <>
      <div>
        <div className="flex justify-between items-center px-4 py-3 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">New Chat</h2>
          <button type="button" onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="px-2.5 overflow-y-auto" style={{ height: "83vh" }}>
          <div className="p-1 space-y-4">

            <div className="mx-1 mr-3">
              <label className={labelCls}>To</label>
              <AccountMultiSelectDropdown
                value={selectedaccount}
                onChange={handleAccountChange}
                placeholder="Accounts"
              />
            </div>

            <div className="mx-1">
              <label className={labelCls}>Template</label>
              <select
                className={inputCls + " mt-1"}
                value={selectInvoiceTemp?.value || ""}
                onChange={(e) => {
                  const opt = invoiceoptions.find(o => o.value === e.target.value);
                  handleInvoiceTempChange(null, opt || null);
                }}
              >
                <option value="">Job Template</option>
                {invoiceoptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="mx-1">
              <label className={labelCls}>Subject</label>
              <input
                className={inputCls + " mt-1" + (inputTextError ? " border-destructive" : "")}
                name="subject"
                value={inputText + selectedShortcut}
                onChange={handlechatsubject}
                placeholder="Subject"
              />
            </div>

            <div className="mx-1 relative" ref={shortcodeRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Add Shortcode
              </button>

              {showDropdown && (
                <div className="absolute left-0 top-full mt-1 z-50 w-[300px] max-h-[300px] overflow-y-auto bg-card border border-border rounded-lg shadow-lg">
                  {filteredShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddShortcut(shortcut.value)}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-muted ${
                        shortcut.isBold ? "font-bold text-foreground" : "font-normal text-muted-foreground"
                      }`}
                    >
                      {shortcut.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mx-1">
              <EditorShortcodes
                initialContent={description}
                onChange={handleEditorChange}
              />
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={absoluteDate}
                    onChange={(e) => handleAbsolutesDates(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-base font-semibold text-foreground">Send reminders to clients</span>
              </div>
              {absoluteDate && (
                <div className="flex items-center gap-4 mt-3 mx-1">
                  <div className="flex-1">
                    <label className={labelCls}>Days until next reminder</label>
                    <input
                      className={inputCls + " mt-1"}
                      name="Daysuntilnextreminder"
                      value={daysuntilNextReminder}
                      onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                      placeholder="Days until next reminder"
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelCls}>No Of reminders</label>
                    <input
                      className={inputCls + " mt-1"}
                      name="No Of reminders"
                      value={noOfReminder}
                      onChange={(e) => setNoOfReminder(e.target.value)}
                      placeholder="No of reminders"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* <DragDropContext onDragEnd={handleDragEnd}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  m: 2,
                }}
              >
                <Typography variant="h6">Client tasks</Typography>
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={handleAddSubtask}
                  style={{ margin: "10px", color: "#1976d3" }}
                >
                  <FiPlusCircle /> Add Subtasks
                </Box>
              </Box>

              <Droppable droppableId="subtaskList">
                {(provided) => (
                  <div
                    className="subtask-input"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {(subtasks.length > 0
                      ? subtasks
                      : [{ id: "default", text: "" }]
                    ).map((subtask, index) => (
                      <Draggable
                        key={subtask.id}
                        draggableId={subtask.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Box
                              display="flex"
                              gap="30px"
                              alignItems="center"
                              m={1}
                            >
                              <Checkbox
                                style={{ cursor: "pointer" }}
                                checked={checkedSubtasks.includes(subtask.id)}
                                onChange={() =>
                                  handleCheckboxChange(
                                    subtask.id,
                                    subtask.checked
                                  )
                                }
                              />
                              <TextField
                                placeholder="Things To do"
                                value={subtask.text}
                                size="small"
                                margin="normal"
                                fullWidth
                                onChange={(e) =>
                                  handleInputChange(subtask.id, e.target.value)
                                }
                                variant="outlined"
                              />
                              <IconButton
                                onClick={() => handleDeleteSubtask(subtask.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <RiDeleteBin6Line />
                              </IconButton>
                              <IconButton style={{ cursor: "move" }}>
                                <PiDotsSixVerticalBold />
                              </IconButton>
                            </Box>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext> */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex items-center justify-between mx-2 my-2">
                <span className="text-base font-semibold text-foreground">Client tasks</span>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 cursor-pointer"
                >
                  <FiPlusCircle /> Add Subtasks
                </button>
              </div>

              <Droppable droppableId="subtaskList">
                {(provided) => (
                  <div
                    className="subtask-input"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {(subtasks.length > 0 ? subtasks : []).map((subtask, index) => (
                      <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="flex items-center gap-4 mx-1 my-1">
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary cursor-pointer shrink-0"
                                checked={checkedSubtasks.includes(subtask.id)}
                                onChange={() => handleCheckboxChange(subtask.id, subtask.checked)}
                              />
                              <input
                                className={inputCls}
                                placeholder="Things To do"
                                value={subtask.text}
                                onChange={(e) => handleInputChange(subtask.id, e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteSubtask(subtask.id)}
                                className="text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                              >
                                <RiDeleteBin6Line size={16} />
                              </button>
                              <span className="text-muted-foreground cursor-move shrink-0">
                                <PiDotsSixVerticalBold size={16} />
                              </span>
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
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
          <button
            type="button"
            onClick={saveChat}
            className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Create Chat
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full px-5 py-1.5 text-sm font-medium border border-border text-primary hover:bg-primary hover:text-white hover:border-transparent transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatForm;
