// import React, { useState, useEffect, useContext } from "react";
// import { Box, Button, Typography, Paper, Divider } from "@mui/material";
// import NewChatDrawer from "./NewChat";
// import { useTheme } from "@mui/material/styles";
// import axios from "axios";
// import ChatDetails from "./ChatDetails.js";
// import { LoginContext } from "../../Sidebar/Context/Context";
// const InternalCommunication = () => {
//   const INTERNALCHAT = process.env.REACT_APP_INTERNALCHAT_API;
//   const theme = useTheme();
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const [chatList, setChatList] = useState([]);
//   const [time, setTime] = useState();
//   const [chatId, setChatId] = useState("");
//   const [selectedChat, setSelectedChat] = useState(null);


//   const { logindata } = useContext(LoginContext);

//   const [loginUserId, setLoginUserId] = useState();

//   useEffect(() => {
//     if (logindata?.user?.id) {
//       setLoginUserId(logindata.user.id);
//     }
//   }, [logindata]);
//   const getsChatlist = () => {
//     const loginUserId = logindata?.user?.id;

//     if (!loginUserId) return;

//     const url = `${INTERNALCHAT}/api/internalchat/user/${loginUserId}`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((result) => {
//         let chatsData = [];

//         if (Array.isArray(result.chats)) {
//           chatsData = result.chats;
//         }

//         setChatList(chatsData);
//         console.log("internal chat", chatsData);

//         if (chatsData.length > 0) {
//           chatsData.forEach((chat) => {
//             setTime(chat.updatedAt);
//           });
//         }
//       })
//       .catch((error) => console.error("Error fetching chat list:", error));
//   };

//   useEffect(() => {
//     getsChatlist();
//   }, []);
 
//   const countUnreadMessages = (chat) => {
//     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//     const loginUserId = storedData?.teammember?.userid || logindata?.user?.id;

//     if (!chat.description || !Array.isArray(chat.description)) return 0;

//     const unreadCount = chat.description.reduce((count, message) => {
//       // Count only messages:
//       // - not read
//       // - and NOT sent by the current user
//       if (
//         message.isRead === false &&
//         message.senderid &&
//         message.senderid._id !== loginUserId
//       ) {
//         return count + 1;
//       }
//       return count;
//     }, 0);

//     return unreadCount;
//   };

//   const formattedTime = new Date(time)
//     .toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//     })
//     .replace(",", "");
//   const handleShowChat = async (chatId) => {
//     try {
//       // Mark as read
//       await axios.patch(`${INTERNALCHAT}/api/internalchat/${chatId}/markAllRead
// `);

//       getsChatlist();
//       const chat = chatList.find((c) => c._id === chatId);
//       setSelectedChat(chat);
//       setChatId(chatId);
//     } catch (error) {
//       console.error("Error marking message as read:", error);
//     }
//   };

//   const getsChatDetails = async () => {
//     try {
//       const url = `${INTERNALCHAT}/api/internalchat/${chatId}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setSelectedChat(data.chat);
//     } catch (error) {
//       console.error("Error fetching chat details:", error);
//     }
//   };

//   return (
//     <Box mt={2}>
//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="space-between"
//         mb={2}
//       >
//         <Typography variant="h5">Communications</Typography>
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "var(--color-save-btn)",
//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)",
//             },
//             borderRadius: "15px",
//           }}
//           onClick={handleOpen}
//         >
//           New Communication
//         </Button>
//       </Box>

//       <Box display="flex" height="90vh" gap={2} p={1}>
//         {/* Chat list */}
//         <Box
//           width="30%"
//           height="100%"
//           overflow="auto"
//           pr={1}
//           borderRight="1px solid #ddd"
//         >
//           {chatList.length > 0 ? (
//             chatList.map((chat, index) => {
//               // 👇 Get the other participant
//               const receiver = chat.participants.find(
//                 (participant) => participant._id !== loginUserId
//               );
//               const unreadCount = countUnreadMessages(chat);
//               return (
//                 <Box key={index}>
//                   <Paper
//                     sx={{ p: 1, cursor: "pointer" }}
//                     onClick={() => handleShowChat(chat._id)}
//                   >
//                     <Box
//                       display="flex"
//                       alignItems="center"
//                       justifyContent="space-between"
//                       mb={1}
//                     >
//                       <Box display="flex" alignItems="center" gap={1}>
//                         <Typography variant="caption" color="text.secondary">
//                           Chat with <b>{receiver?.username || "Unknown"}</b>
//                         </Typography>
//                       </Box>
//                       <Box display="flex" alignItems="center" gap={1}>
//                         {/* Show unread count badge if there are unread messages */}
//                         {unreadCount > 0 && (
//                           <Box
//                             sx={{
//                               backgroundColor: theme.palette.success.main,
//                               color: "white",
//                               borderRadius: "50%",
//                               width: 20,
//                               height: 20,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               fontSize: "0.75rem",
//                             }}
//                           >
//                             {unreadCount}
//                           </Box>
//                         )}
//                       </Box>
//                     </Box>

//                     <Typography variant="caption">
//                       {(() => {
//                         const messages = chat.description || [];
//                         const latest = messages[messages.length - 1];
//                         if (!latest) return "No messages yet";

//                         const clean =
//                           latest.message?.replace(/<[^>]+>/g, "") || "";
//                         const sender =
//                           latest.fromwhome === "Admin"
//                             ? "You"
//                             : latest.senderid?.username || "";

//                         return `${sender}: ${
//                           clean.length > 35 ? clean.slice(0, 35) + "..." : clean
//                         }`;
//                       })()}
//                     </Typography>

//                     <Box textAlign="right">
//                       <Typography variant="caption" color="text.secondary">
//                         {formattedTime}
//                       </Typography>
//                     </Box>
//                   </Paper>
//                   <Divider sx={{ my: 1 }} />
//                 </Box>
//               );
//             })
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No chats to display
//             </Typography>
//           )}
//         </Box>

//         {/* Chat details */}
//         <Box width="70%" height="100%" overflow="auto">
//           {selectedChat ? (
//             <ChatDetails
//               chat={selectedChat}
//               getsChatDetails={getsChatDetails}
//               getsChatlist={getsChatlist}
//               onChatAction={() => setSelectedChat(null)}
//             />
//           ) : (
//             <Typography variant="body1" mt={2}>
//               Select a chat to view details
//             </Typography>
//           )}
//         </Box>
//       </Box>

//       <NewChatDrawer
//         handleClose={handleClose}
//         open={open}
//         getsChatlist={getsChatlist}
//       />
//     </Box>
//   );
// };

// export default InternalCommunication;


import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, Paper, Divider, IconButton, Menu, MenuItem, List, ListItem, ListItemText, TextField, Checkbox, Grid } from "@mui/material";
import NewChatDrawer from "./NewChat";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { LoginContext } from "../../Sidebar/Context/Context";

import ChatDetails from "./ChatDetails";
const InternalCommunication = () => {
  const INTERNALCHAT = process.env.REACT_APP_INTERNALCHAT_API;
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [time, setTime] = useState();
  const [chatId, setChatId] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const { logindata } = useContext(LoginContext);
  const [loginUserId, setLoginUserId] = useState();

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  const getsChatlist = () => {
    const loginUserId = logindata?.user?.id;
    if (!loginUserId) return;

    const url = `${INTERNALCHAT}/api/internalchat/user/${loginUserId}`;
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        let chatsData = Array.isArray(result.chats) ? result.chats : [];
        setChatList(chatsData);
        if (chatsData.length > 0) {
          setTime(chatsData[0].updatedAt);
        }
      })
      .catch((error) => console.error("Error fetching chat list:", error));
  };

  useEffect(() => {
    getsChatlist();
  }, []);

  const countUnreadMessages = (chat) => {
    const loginUserId = logindata?.user?.id;
    if (!chat.description || !Array.isArray(chat.description)) return 0;

    return chat.description.reduce((count, message) => {
      if (message.isRead === false && message.senderid?._id !== loginUserId) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const handleShowChat = async (chatId) => {
    try {
      await axios.patch(`${INTERNALCHAT}/api/internalchat/${chatId}/markAllRead`);
      const chat = chatList.find((c) => c._id === chatId);
      setSelectedChat(chat);
      setChatId(chatId);
      getsChatlist();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const getsChatDetails = async () => {
    try {
      const response = await fetch(`${INTERNALCHAT}/api/internalchat/${chatId}`);
      const data = await response.json();
      setSelectedChat(data.chat);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  const formattedTime = time ? new Date(time).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  }).replace(",", "") : "";

  return (
    <Box mt={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Communications</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
            borderRadius: "15px",
          }}
          onClick={() => setOpen(true)}
        >
          New Communication
        </Button>
      </Box>

      {chatList.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="70vh">
          <Typography variant="h6" gutterBottom>No Communications Found</Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Start a new communication to collaborate with your team
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--color-save-btn)",
              "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
              borderRadius: "15px",
            }}
            onClick={() => setOpen(true)}
          >
            Create New Communication
          </Button>
        </Box>
      ) : (
        <Box display="flex" height="90vh" gap={2} p={1}>
          <Box width="30%" height="100%" overflow="auto" pr={1} borderRight="1px solid #ddd">
            {chatList.map((chat, index) => {
              const receiver = chat.participants.find(p => p._id !== loginUserId);
              const unreadCount = countUnreadMessages(chat);
              const latestMessage = chat.description?.[chat.description.length - 1];
              const previewText = latestMessage?.message?.replace(/<[^>]+>/g, "") || "";
              
              return (
                <Box key={index}>
                  <Paper sx={{ p: 1, cursor: "pointer" }} onClick={() => handleShowChat(chat._id)}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" color="text.secondary">
                        Chat with <b>{receiver?.username || "Unknown"}</b>
                      </Typography>
                      {unreadCount > 0 && (
                        <Box sx={{
                          backgroundColor: theme.palette.success.main,
                          color: "white",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                        }}>
                          {unreadCount}
                        </Box>
                      )}
                    </Box>
                    <Typography variant="caption">
                      {latestMessage ? 
                        `${latestMessage.fromwhome === "Admin" ? "You" : latestMessage.senderid?.username || ""}: ${previewText.slice(0, 35)}${previewText.length > 35 ? "..." : ""}`
                        : "No messages yet"}
                    </Typography>
                    <Box textAlign="right">
                      <Typography variant="caption" color="text.secondary">
                        {formattedTime}
                      </Typography>
                    </Box>
                  </Paper>
                  <Divider sx={{ my: 1 }} />
                </Box>
              );
            })}
          </Box>

          <Box width="70%" height="100%" overflow="auto">
            {selectedChat ? (
              <ChatDetails 
                chat={selectedChat} 
                getsChatDetails={getsChatDetails} 
                getsChatlist={getsChatlist}
                onChatAction={() => setSelectedChat(null)}
                loginUserId={loginUserId}
              />
            ) : (
              <Typography variant="body1" mt={2}>Select a chat to view details</Typography>
            )}
          </Box>
        </Box>
      )}

      <NewChatDrawer open={open} handleClose={() => setOpen(false)} getsChatlist={getsChatlist} />
    </Box>
  );
};









export default InternalCommunication;