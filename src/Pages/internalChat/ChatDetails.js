

import {
    Box,
    Typography,
    Divider,
    Grid,
    Checkbox,
    IconButton,
    Button,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    TextField,
  } from "@mui/material";
  import { toast } from "react-toastify";
  import React, { useEffect, useState, useRef, useContext } from "react";
  import MoreVertIcon from "@mui/icons-material/MoreVert";
  import CloseIcon from "@mui/icons-material/Close";
  import Editor from "./TextEditor"
  import { LoginContext } from "../../Sidebar/Context/Context";
  import axios from "axios";
  import DeleteIcon from "@mui/icons-material/Delete";
  import AddIcon from "@mui/icons-material/Add";
  
  
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
  
  
  
  
 
    // const updateChatDescription = (message = "") => {
    //     const contentToSend = message.trim() || editorContent.trim();
    //     if (!contentToSend) return;
    //     const userRole = localStorage.getItem("userRole");
    //     const newDescription = {
    //       message: contentToSend,
    //       fromwhome: userRole,
    //       senderid: loginUserId,
    //     };
    
    //     if (replyTo) {
    //       newDescription.replyTo = replyTo._id;
    //     }
    
      
    //     const raw = JSON.stringify({
    //         // teammemberid:chat.teammemberid._id,
    //       description: [newDescription],
    //     });
    

    //     console.log("rae new message",raw)
    //     fetch(
    //       `http://127.0.0.1:8016/api/internalchat/send`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: raw,
    //       }
    //     )
    //       .then((response) => {
    //         if (!response.ok) throw new Error("Failed to update");
    //         return response.json();
    //       })
    //       .then(() => {
    //         toast.success("Message sent");
    //         setEditorContent("");
    //         setReplyTo(null);
    //         //  securemessagechatsend(chatId);
    //         // updatechatStatus(chatId);
    //     getsChatlist()
    //         getsChatDetails();
    //       })
    //       .catch(() => {
    //         toast.error("Send failed");
    //       });
    //   };
  

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
          `${INTERNALCHAT}/api/internalchat/bymessageid/delete`,
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
      <Box sx={{ display: "flex" }}>
        {/* Main Chat Area */}
        <Box sx={{ flex: 1, overflow: "hidden", pr: showTasks ? 2 : 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* <Box>
              <Typography variant="h6" gutterBottom>
                {chat.teammemberid.username}
              </Typography>
             
            </Box> */}
            
          </Box>
  
          <Divider sx={{ my: 1 }} />
  
          <Box height={"40vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
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
          </Box>
  
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 2,
              alignItems: "start",
            }}
          >
            {replyTo && (
              <ReplyPreview replyTo={replyTo} setReplyTo={setReplyTo} />
            )}
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              {" "}
              <Editor onChange={handleEditorChange} value={editorContent} />
              <Button
                onClick={() => updateChatDescription()}
                variant="contained"
                sx={{ height: "fit-content", alignSelf: "end" }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
  
      
       
      </Box>
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
  
    let senderDisplayName = "";
    if (isClient && desc.senderid?.username) {
      senderDisplayName = desc.senderid.username;
    } else if (isAdmin && desc.senderid?.username) {
      senderDisplayName = "You";
    }
  
    return (
      <Box
        ref={(el) => {
          if (desc._id) {
            messageRefs.current[desc._id] = el;
          }
        }}
        sx={{
          display: "flex",
          justifyContent: isClient ? "flex-start" : "flex-end",
          mb: 2,
          position: "relative",
        }}
      >
        <Box
          sx={{
            maxWidth: "75%",
            backgroundColor:
              desc._id === highlightedId
                ? "#fff2b3"
                : isAdmin
                  ? "#ffe6e6"
                  : "#e6f0ff",
            p: 2,
            borderRadius: 2,
            borderTopLeftRadius: isClient ? 16 : 4,
            borderTopRightRadius: isClient ? 4 : 16,
            boxShadow: 1,
            position: "relative",
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
  
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              color: "#333",
            }}
          >
            <Typography
              variant="subtitle2"
              component="p"
              gutterBottom
              sx={{ fontWeight: "600" }}
            >
              {senderDisplayName}
            </Typography>
  
            <MoreVertIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={(e) => handleMenuClick(e, desc)}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                elevation: 1,
                sx: {
                  boxShadow: "none",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  setReplyTo(selectedMessage);
                  setAnchorEl(null);
                }}
              >
                Reply
              </MenuItem>
              {selectedMessage?.fromwhome?.toLowerCase() === "admin" && (
                <MenuItem
                  onClick={() => {
                    handleDeleteMessage(selectedMessage);
                    setAnchorEl(null);
                  }}
                >
                  Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
  
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", color: "#333" }}
            dangerouslySetInnerHTML={{
              __html:
                typeof desc.message === "string"
                  ? desc.message
                  : "No message available",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "right",
              color: "gray",
              mt: 1,
            }}
          >
            {messageTime}
          </Typography>
        </Box>
      </Box>
    );
  };
  
  const ReplyPreviewItem = ({ desc, chat, messageRefs, setHighlightedId }) => {
    const repliedMsg = chat.description.find((msg) => msg._id === desc.replyTo);
    if (!repliedMsg) return null;
  
    return (
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderLeft: "3px solid #1976d2",
          px: 1,
          py: 0.5,
          mb: 1,
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ cursor: "pointer", color: "#1976d2" }}
          onClick={() => {
            const el = messageRefs.current[desc.replyTo];
            if (el) {
              el.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              setHighlightedId(desc.replyTo);
              setTimeout(() => setHighlightedId(null), 2000);
            }
          }}
        >
          {repliedMsg.fromwhome === "teammember"
            ? repliedMsg.senderid?.username
            : "You"}
        </Typography>
  
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", color: "#555" }}
          dangerouslySetInnerHTML={{
            __html:
              repliedMsg.message?.length > 100
                ? repliedMsg.message.slice(0, 100) + "..."
                : repliedMsg.message,
          }}
        />
      </Box>
    );
  };
  
  const ReplyPreview = ({ replyTo, setReplyTo }) => (
    <Box
      sx={{
        gridColumn: "1 / -1",
        mb: 1,
        p: 1.5,
        backgroundColor: "#f4f6f8",
        borderLeft: "4px solid #1976d2",
        borderRadius: 1,
        position: "relative",
      }}
    >
      <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
        Replying to:{" "}
        {replyTo.fromwhome === "client"
          ? replyTo.senderid?.username
          : "You" || "Admin"}
      </Typography>
  
      <Typography
        variant="body2"
        sx={{ fontStyle: "italic", whiteSpace: "pre-wrap", pr: 4 }}
        dangerouslySetInnerHTML={{
          __html:
            replyTo.message?.length > 100
              ? `${replyTo.message.slice(0, 100)}...`
              : replyTo.message,
        }}
      />
  
      <IconButton
        size="small"
        onClick={() => setReplyTo(null)}
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          color: "#777",
          "&:hover": { color: "#000" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
  
  export default ChatDetails;
  