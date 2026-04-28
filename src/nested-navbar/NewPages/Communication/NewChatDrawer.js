import { FiPlusCircle } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useState, useEffect, useContext, useRef } from "react";
import AccountMultiSelectDropdown from "../../../Templates/AccountMultiSelectDropdown";
import EditorShortcodes from "../../../Templates/Texteditor/EditorShortcodes";
import { LoginContext } from "../../../Sidebar/Context/Context";
import { toast } from "react-toastify";
import { SideSheet } from "../../../components/ui/side-sheet";
import { Button } from "../../../components/ui/button";
const NewChatDrawer = ({ open, handleClose, accountwiseChatlist, data,isActiveTrue }) => {
  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { logindata } = useContext(LoginContext);
 const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [loginUserId, setLoginUserId] = useState();
const [username,setUsername]=useState("")
  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
      fetchUserData(logindata.user.id)
    }
  }, [logindata]);

    const fetchUserData = async (id) => {
    const maxLength = 15;
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url , requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.username) {
          setUsername(result.username);
        }
      });
  };

  const [selectedaccount, setSelectedaccount] = useState();

  const [combinedaccountValues, setCombinedaccountValues] = useState();

  const handleAccountChange = (newSelectedAcc) => {
    setSelectedaccount(newSelectedAcc);

    const selectedValues = newSelectedAcc.map((option) => option.value);
    setCombinedaccountValues(selectedValues);
  };
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const [chatTemplates, setChatTemplates] = useState([]);
  const fetchChatTemplates = async () => {
    try {
      const url = `${CHAT_API}/workflow/chats/chattemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setChatTemplates(data.chatTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const chatTemplateOptions = chatTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  useEffect(() => {
    fetchChatTemplates();
  }, []);
  const [selectedtemp, setselectedTemp] = useState("");
  const [templateId, setTemplateId] = useState(null);
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputTextError, setInputTextError] = useState("");
  const [description, setDescription] = useState("");
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [from, setFrom] = useState();
  const [subtasks, setSubtasks] = useState([]);
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
      return updatedCheckedSubtasks;
    });
  };

  const handletemp = async (selectedOptions) => {
    setselectedTemp(selectedOptions);
    if (selectedOptions && selectedOptions.value) {
      const templateId = selectedOptions.value;
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
        setFrom(chatTemplate.from.username);
        setSubtasks(
          chatTemplate.clienttasks.map((task) => ({
            id: task.id,
            text: task.text,
            checked: task.checked,
          }))
        );
      } catch (error) {
        console.error("Error fetching chat template:", error);
      }
    }
  };

  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const handlechatsubject = (e) => {
    const { value, selectionStart } = e.target;
    setInputText(value);
    setCursorPosition(selectionStart);
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");

  const [anchorEl, setAnchorEl] = useState(null);
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
  const handleAddShortcut = (shortcut) => {
    setInputText((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText;
    });

    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2
        );
      }
    }, 0);

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
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };
 

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  ///for drawer save btn
  const saveChat = () => {

       // Validation checks
      if (!selectedOption ) {
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
        senderid: username,
       
        isRead:false
      },
    ];

    const raw = JSON.stringify({
      accountids: selectedAccountIds,
      chattemplateid: selectedOption?.value,
      templatename: templateName,
      from: from,
      chatsubject: inputText + selectedShortcut,
     
      description: messageData,
      // chatstatus: "false",
      sendreminderstoclient: absoluteDate,
      daysuntilnextreminder: daysuntilNextReminder,
      numberofreminders: noOfReminder,
      clienttasks: subtaskData,
      // isclienttaskchecked: SubtaskSwitch,
      active: "true",
      adminUserId:loginUserId
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        toast.success("New Chat created successfully");
        setIsSubmitted(true);
        accountwiseChatlist(data, isActiveTrue);
        handleClose();
        ClearFileds();
      })
      .catch((error) => {
        console.error("Fetch error: ", error.message);
        toast.error("Failed to create new chat. Please try again.");
      });
  };
  const ClearFileds = () => {
    setselectedTemp("");
    setInputText("");
    setSelectedShortcut("");
    setDescription();
    setDaysuntilNextReminder("");
    setNoOfReminder("");
    setCheckedSubtasks([]);
    setAbsoluteDates(false);
    setSubtasks([]);
  };

  const handleCloseDrawer = ()=>{
    handleClose()
    ClearFileds()
  }
  const fieldCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground transition-colors";
  const labelCls = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5";

  return (
    <SideSheet
      open={open}
      onOpenChange={(isOpen) => !isOpen && handleCloseDrawer()}
      title="New Chat"
      description="Create a new chat thread for this account"
      size="lg"
      hideDefaultFooter
      footer={
        <>
          <Button type="button" variant="ghost" size="sm" onClick={handleCloseDrawer}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={saveChat}>
            Create Chat
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        {/* To */}
        <div>
          <label className={labelCls}>To</label>
          <AccountMultiSelectDropdown
            value={selectedaccount}
            onChange={handleAccountChange}
            placeholder="Select accounts"
          />
        </div>

        {/* Template */}
        <div>
          <label className={labelCls}>Template</label>
          <select
            className={fieldCls}
            value={selectedtemp?.value || ""}
            onChange={(e) => {
              const opt = chatTemplateOptions.find(o => o.value === e.target.value);
              handletemp(opt || null);
            }}
          >
            <option value="">Select a template</option>
            {chatTemplateOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className={labelCls}>Subject</label>
          <input
            type="text"
            className={fieldCls}
            ref={textFieldRef}
            name="subject"
            value={inputText}
            onClick={(e) => setCursorPosition(e.target.selectionStart)}
            onChange={handlechatsubject}
            placeholder="Chat subject"
          />
        </div>

        {/* Shortcode */}
        <div className="relative">
          <label className={labelCls}>Shortcodes</label>
          <Button type="button" variant="outline" size="sm" onClick={toggleDropdown}>
            + Add Shortcode
          </Button>
          {showDropdown && (
            <div className="absolute z-50 bg-popover border border-border rounded-xl shadow-lg w-72 max-h-64 overflow-y-auto mt-1">
              {filteredShortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-muted text-sm transition-colors ${
                    shortcut.isBold ? 'font-semibold text-foreground bg-muted/60 border-b border-border' : 'text-muted-foreground'
                  }`}
                  onClick={() => handleAddShortcut(shortcut.value)}
                >
                  {shortcut.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor */}
        <div>
          <label className={labelCls}>Message</label>
          <EditorShortcodes initialContent={description} onChange={handleEditorChange} />
        </div>

        {/* Send reminders toggle */}
        <div className="rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Send reminders to clients</p>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically send follow-up reminders</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={absoluteDate}
              onClick={() => handleAbsolutesDates(!absoluteDate)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                absoluteDate ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                absoluteDate ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
          {absoluteDate && (
            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/60">
              <div>
                <label className={labelCls}>Days until next reminder</label>
                <input type="text" className={fieldCls}
                  name="Daysuntilnextreminder"
                  value={daysuntilNextReminder}
                  onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                  placeholder="e.g. 3"
                />
              </div>
              <div>
                <label className={labelCls}>No. of reminders</label>
                <input type="text" className={fieldCls}
                  name="noOfReminder"
                  value={noOfReminder}
                  onChange={(e) => setNoOfReminder(e.target.value)}
                  placeholder="e.g. 2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Client tasks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelCls}>Client Tasks</label>
            <button type="button" onClick={handleAddSubtask}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              <FiPlusCircle size={13} /> Add Task
            </button>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subtaskList">
              {(provided) => (
                <div className="space-y-1.5" {...provided.droppableProps} ref={provided.innerRef}>
                  {subtasks.map((subtask, index) => (
                    <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <div className="flex items-center gap-2 bg-card rounded-lg border border-border/60 px-2 py-1.5">
                            <span {...provided.dragHandleProps} className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab">
                              <PiDotsSixVerticalBold size={14} />
                            </span>
                            <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-primary cursor-pointer"
                              checked={checkedSubtasks.includes(subtask.id)}
                              onChange={() => handleCheckboxChange(subtask.id, subtask.checked)}
                            />
                            <input type="text"
                              className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
                              placeholder="Task description"
                              value={subtask.text}
                              onChange={(e) => handleInputChange(subtask.id, e.target.value)}
                            />
                            <button type="button" onClick={() => handleDeleteSubtask(subtask.id)}
                              className="text-muted-foreground/40 hover:text-destructive transition-colors">
                              <RiDeleteBin6Line size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {subtasks.length === 0 && (
                    <p className="text-xs text-muted-foreground/50 text-center py-3">No tasks added yet</p>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

      </div>
    </SideSheet>
  );
};

export default NewChatDrawer;
