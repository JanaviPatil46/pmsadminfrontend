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
import NewChatDrawer from "./NewChat";
import axios from "axios";
import { LoginContext } from "../../Sidebar/Context/Context";
import ChatDetails from "./ChatDetails";
import { Button } from "../../components/ui/button";
import { MessageSquare } from "lucide-react";
const InternalCommunication = () => {
  const INTERNALCHAT = process.env.REACT_APP_INTERNALCHAT_API;
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
    <div className="mt-4 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Communications</h1>
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full px-5"
          style={{ backgroundColor: "var(--color-save-btn)" }}
        >
          New Communication
        </Button>
      </div>

      {chatList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">No Communications Found</h2>
            <p className="text-sm text-muted-foreground mt-1">Start a new communication to collaborate with your team</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="rounded-full px-5 mt-2"
            style={{ backgroundColor: "var(--color-save-btn)" }}
          >
            Create New Communication
          </Button>
        </div>
      ) : (
        <div className="flex gap-3" style={{ height: "calc(100vh - 160px)" }}>
          {/* Chat List */}
          <div className="w-[30%] min-w-[220px] flex flex-col gap-2 overflow-y-auto pr-2 border-r border-border">
            {chatList.map((chat, index) => {
              const receiver = chat.participants.find(p => p._id !== loginUserId);
              const unreadCount = countUnreadMessages(chat);
              const latestMessage = chat.description?.[chat.description.length - 1];
              const previewText = latestMessage?.message?.replace(/<[^>]+>/g, "") || "";
              const isSelected = selectedChat?._id === chat._id;

              return (
                <div
                  key={index}
                  onClick={() => handleShowChat(chat._id)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/60 ${
                    isSelected ? "bg-muted border-indigo-300" : "bg-background border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {receiver?.username || "Unknown"}
                    </span>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{formattedTime}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {latestMessage
                      ? `${latestMessage.fromwhome === "Admin" ? "You" : latestMessage.senderid?.username || ""}: ${previewText.slice(0, 45)}${previewText.length > 45 ? "..." : ""}`
                      : "No messages yet"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Chat Details */}
          <div className="flex-1 overflow-y-auto">
            {selectedChat ? (
              <ChatDetails
                chat={selectedChat}
                getsChatDetails={getsChatDetails}
                getsChatlist={getsChatlist}
                onChatAction={() => setSelectedChat(null)}
                loginUserId={loginUserId}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Select a chat to view the conversation</p>
              </div>
            )}
          </div>
        </div>
      )}

      <NewChatDrawer open={open} handleClose={() => setOpen(false)} getsChatlist={getsChatlist} />
    </div>
  );
};









export default InternalCommunication;