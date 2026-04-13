

  import { toast } from "react-toastify";
  import React, { useEffect, useState, useRef, useContext } from "react";
  import { MoreVertical, X } from "lucide-react";
  import Editor from "./TextEditor";
  import { LoginContext } from "../../Sidebar/Context/Context";
  import axios from "axios";
  import { Button } from "../../components/ui/button";
  
  
  const ChatDetails = ({ chat, getsChatDetails,onChatAction,getsChatlist  }) => {
    const INTERNALCHAT = process.env.REACT_APP_INTERNALCHAT_API
    const [showTasks, setShowTasks] = useState(false);
    const [chatId, setChatId] = useState(chat._id);
    const [chatTemplate, setChatTemplate]=useState(chat.chattemplateid)
    const { logindata } = useContext(LoginContext);
    const [loginUserId, setLoginUserId] = useState();
    const messageRefs = useRef({});
    const [highlightedId, setHighlightedId] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const messagesEndRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editorContent, setEditorContent] = useState("");
    const [tasks, setTasks] = useState([]);
    const [chatanchorEl, setChatAnchorEl] = useState(null);
    const handleChatMenuClose = () => {
      setChatAnchorEl(null);
    };
    useEffect(() => {
      if (logindata?.user?.id) {
        const id = logindata.user.id;
        setLoginUserId(id);
        // setLoginUserId(logindata.user.id);
        fetchUserData(id)
      }
      if (chat.clienttasks) {
        setTasks(chat.clienttasks.flat());
      }
    }, [logindata, chat.clienttasks]);
     const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
     const [senderEmail,setSenderEmail]= useState("")
     const [senderName,setSenderName]=useState("")
   const fetchUserData = async (id) => {
    
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
          console.log("id", result);
          setSenderEmail(result.email)
  setSenderName(result.username)
        });
    };
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
    };
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [chat.description]);
  
    const handleMenuClick = (event, message) => {
      setAnchorEl(event.currentTarget);
      setSelectedMessage(message);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setSelectedMessage(null);
    };
  
    const handleEditorChange = (content) => {
      setEditorContent(content);
    };
  
  
  
  
 
   
    const updateChatDescription = (message = "") => {
      const contentToSend = message.trim() || editorContent.trim();
      if (!contentToSend || !chat?._id) return;
    
      const userRole = localStorage.getItem("userRole");
      const loginUserId = logindata?.user?.id;
    
      const newDescription = {
        message: contentToSend,
        fromwhome: userRole,
        senderid: loginUserId,
        isRead: false,
        time: new Date(),
      };
    
      if (replyTo) {
        newDescription.replyTo = replyTo._id;
      }
    
      const raw = JSON.stringify({
        messageData: newDescription,
      });
    
      console.log("sending message", raw);
    
      fetch(`${INTERNALCHAT}/api/internalchat/${chat._id}/message`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to send");
          return response.json();
        })
        .then(() => {
          toast.success("Message sent");
          setEditorContent("");
          setReplyTo(null);
          getsChatlist();
          getsChatDetails(); // Refresh selected chat
        })
        .catch(() => {
          toast.error("Send failed");
        });
    };
    
  
  
    const handleDeleteMessage = async (messageToDelete) => {
      try {
        const raw = JSON.stringify({
          chatId: chatId,
          messageId: messageToDelete._id,
        });
  
        const response = await fetch(
          `${INTERNALCHAT}/api/internalchat/${chatId}/message/bymessageid/delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: raw,
          }
        );
  
        if (!response.ok) throw new Error("Failed to delete message");
  
        toast.success("Message deleted successfully");
        getsChatDetails();
        getsChatlist()
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete message");
      }
    };
  
  
   
  
    if (!chat) return null;
  
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-border mb-2" />
  
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto mb-3" style={{ maxHeight: "40vh" }}>
          {Array.isArray(chat.description) &&
            chat.description.length > 0 &&
            chat.description.map((desc, index) => (
              <MessageItem
                key={desc._id || index}
                desc={desc}
                chat={chat}
                messageRefs={messageRefs}
                highlightedId={highlightedId}
                setHighlightedId={setHighlightedId}
                handleMenuClick={handleMenuClick}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                selectedMessage={selectedMessage}
                setReplyTo={setReplyTo}
                formatDate={formatDate}
                loginUserId={loginUserId}
                handleDeleteMessage={handleDeleteMessage}
              />
            ))}
          <div ref={messagesEndRef} />
        </div>
  
        {/* Reply preview + editor */}
        <div className="space-y-2">
          {replyTo && <ReplyPreview replyTo={replyTo} setReplyTo={setReplyTo} />}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Editor onChange={handleEditorChange} value={editorContent} />
            </div>
            <Button
              onClick={() => updateChatDescription()}
              className="rounded-full px-5 self-end"
              style={{ backgroundColor: "var(--color-save-btn)" }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const MessageItem = ({
    desc,
    chat,
    messageRefs,
    highlightedId,
    setHighlightedId,
    handleMenuClick,
    anchorEl,
    setAnchorEl,
    selectedMessage,
    setReplyTo,
    formatDate,
    loginUserId,
    handleDeleteMessage,
  }) => {
    const isClient = desc.fromwhome?.toLowerCase() === "teammember";
    const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
    const messageTime = desc.time ? formatDate(desc.time) : "Just now";
  
    // let senderDisplayName = "";
    // if (isClient && desc.senderid?.username) {
    //   senderDisplayName = desc.senderid.username;
    // } else if (isAdmin && desc.senderid?.username) {
    //   senderDisplayName = "You";
    // }

    // Determine if the sender is the current user
  const isCurrentUser = 
    (desc.senderid?._id === loginUserId) || 
    (desc.senderid === loginUserId);

  // Your specific sender display name logic
  let senderDisplayName = "";
  if (desc.senderid) {
    if (isCurrentUser) {
      senderDisplayName = "You";
    } else if (isClient && desc.senderid.username) {
      senderDisplayName = desc.senderid.username;
    } else if (isAdmin && desc.senderid.username) {
      senderDisplayName = desc.senderid.username;
    }
  }

  // Determine sender display name
  // let senderDisplayName = "";
  // if (desc.senderid) {
  //   // Check if the message sender is the current logged-in user
  //   if (desc.senderid._id === loginUserId || desc.senderid === loginUserId) {
  //     senderDisplayName = "You";
  //   } else if (isClient && desc.senderid.username) {
  //     senderDisplayName = desc.senderid.username;
  //   } else if (isAdmin && desc.senderid.username) {
  //     senderDisplayName = desc.senderid.username;
  //   }
  // }
    return (
      <div
        ref={(el) => { if (desc._id) messageRefs.current[desc._id] = el; }}
        className={`flex mb-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className="max-w-[75%] rounded-2xl shadow-sm p-3 relative"
          style={{
            backgroundColor: desc._id === highlightedId ? "#fff2b3" : isAdmin ? "#ffe6e6" : "#e6f0ff",
            borderTopLeftRadius: isClient ? "1rem" : "4px",
            borderTopRightRadius: isClient ? "4px" : "1rem",
          }}
        >
          {desc.replyTo && (
            <ReplyPreviewItem
              desc={desc}
              chat={chat}
              messageRefs={messageRefs}
              setHighlightedId={setHighlightedId}
            />
          )}
  
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-gray-800">{senderDisplayName}</span>
            <div className="relative">
              <button
                className="p-0.5 rounded hover:bg-black/10 transition-colors"
                onClick={(e) => handleMenuClick(e, desc)}
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
              {Boolean(anchorEl) && selectedMessage?._id === desc._id && (
                <div className="absolute right-0 top-6 z-50 min-w-[120px] bg-white border rounded-lg shadow-lg py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => { setReplyTo(selectedMessage); setAnchorEl(null); }}
                  >
                    Reply
                  </button>
                  {selectedMessage &&
                    ((selectedMessage.senderid?._id === loginUserId) ||
                      (selectedMessage.senderid === loginUserId)) && (
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => { handleDeleteMessage(selectedMessage); setAnchorEl(null); }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
  
          <div
            className="text-sm text-gray-700 whitespace-pre-wrap mt-1"
            dangerouslySetInnerHTML={{
              __html: typeof desc.message === "string" ? desc.message : "No message available",
            }}
          />
          <div className="text-right mt-1">
            <span className="text-xs text-gray-400">{messageTime}</span>
          </div>
        </div>
      </div>
    );
  };
  
  const ReplyPreviewItem = ({ desc, chat, messageRefs, setHighlightedId }) => {
    const repliedMsg = chat.description.find((msg) => msg._id === desc.replyTo);
    if (!repliedMsg) return null;
  
    return (
      <div className="bg-gray-100 border-l-4 border-indigo-400 px-2 py-1 mb-2 rounded">
        <button
          className="text-xs font-bold text-indigo-600 cursor-pointer hover:underline block mb-0.5"
          onClick={() => {
            const el = messageRefs.current[desc.replyTo];
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              setHighlightedId(desc.replyTo);
              setTimeout(() => setHighlightedId(null), 2000);
            }
          }}
        >
          {repliedMsg.fromwhome === "teammember" ? repliedMsg.senderid?.username : "You"}
        </button>
        <div
          className="text-xs italic text-gray-600"
          dangerouslySetInnerHTML={{
            __html: repliedMsg.message?.length > 100 ? repliedMsg.message.slice(0, 100) + "..." : repliedMsg.message,
          }}
        />
      </div>
    );
  };
  
  const ReplyPreview = ({ replyTo, setReplyTo }) => (
    <div className="relative bg-gray-50 border-l-4 border-indigo-500 rounded p-3">
      <p className="text-xs font-bold text-gray-700 mb-1">
        Replying to:{" "}
        {replyTo.fromwhome === "client" ? replyTo.senderid?.username : "You" || "Admin"}
      </p>
      <div
        className="text-xs italic text-gray-500 whitespace-pre-wrap pr-6"
        dangerouslySetInnerHTML={{
          __html: replyTo.message?.length > 100 ? `${replyTo.message.slice(0, 100)}...` : replyTo.message,
        }}
      />
      <button
        onClick={() => setReplyTo(null)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
  
  export default ChatDetails;
  