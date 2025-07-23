import React ,{useState,useEffect,useContext}from 'react'
import {Box, Button, Typography,Paper,Divider} from "@mui/material"
import NewChatDrawer from "./NewChat"
import { useTheme } from "@mui/material/styles";
import axios from "axios"
import ChatDetails from "./ChatDetails.js"
import { LoginContext } from "../../Sidebar/Context/Context";
const InternalCommunication = () => {
  const INTERNALCHAT = process.env.REACT_APP_INTERNALCHAT_API
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [chatList, setChatList] = useState([]);
  const [time, setTime] = useState();
  const [chatId, setChatId] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  // const getsChatlist = () => {
  //   const url = `http://127.0.0.1:8016/api/internalchat/`;

  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setChatList(result.chats || []);
  //       console.log("internal chat",result.chats)
  //       if (result.chats?.length > 0) {
  //         result.chats.forEach((chat) => {
  //           setTime(chat.updatedAt);
  //         });
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching chat list:", error));
  // };
  // const getsChatlist = () => {
  //   const userRole = localStorage.getItem("userRole");
  //   const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  // console.log("userrole",userRole)
  // console.log("userid",storedData?.teammember.userid)
  //   // Determine API URL based on user role
  //   const url =
  //     userRole === "TeamMember" && storedData?.teammember.userid
  //       ? `http://127.0.0.1:8016/api/internalchat/chatbyteam/${storedData.teammember.userid}`
  //       : `http://127.0.0.1:8016/api/internalchat/`;
  // console.log("url",url)
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setChatList(result.chats || []);
  //       console.log("internal chat", result.chats);
        
  //       if (result.chats?.length > 0) {
  //         // Optional: Set the latest updated time (can be improved to sort and get latest)
  //         result.chats.forEach((chat) => {
  //           setTime(chat.updatedAt);
  //         });
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching chat list:", error));
  // };
  
  // const getsChatlist = () => {
  //   const userRole = localStorage.getItem("userRole");
  //   const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  
  //   const url =
  //     userRole === "TeamMember" && storedData?.teammember.userid
  //       ? `http://127.0.0.1:8016/api/internalchat/chatbyteam/${storedData.teammember.userid}`
  //       : `http://127.0.0.1:8016/api/internalchat/`;
  
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       // Normalize the response
  //       let chatsData = [];
  
  //       if (Array.isArray(result.chats)) {
  //         chatsData = result.chats;
  //       } else if (result.chats && typeof result.chats === "object") {
  //         chatsData = [result.chats]; // wrap single object in array
  //       }
  
  //       setChatList(chatsData);
  //       console.log("internal chat", chatsData);
  
  //       if (chatsData.length > 0) {
  //         chatsData.forEach((chat) => {
  //           setTime(chat.updatedAt);
  //         });
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching chat list:", error));
  // };
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
        let chatsData = [];
  
        if (Array.isArray(result.chats)) {
          chatsData = result.chats;
        }
  
        setChatList(chatsData);
        console.log("internal chat", chatsData);
  
        if (chatsData.length > 0) {
          chatsData.forEach((chat) => {
            setTime(chat.updatedAt);
          });
        }
      })
      .catch((error) => console.error("Error fetching chat list:", error));
  };
  
  
  useEffect(() => {
    getsChatlist()
  }, []);
  // const countUnreadMessages = (chat) => {
  //   const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  //   const userRole = localStorage.getItem("userRole");
  
  //   if (!chat.description || !Array.isArray(chat.description)) return 0;
  
  //   // Determine the sender role based on the current user role
  //   const oppositeRole = userRole === "Admin" ? "Teammember" : "Admin";
  
  //   const unreadCount = chat.description.reduce((count, message) => {
  //     if (message.isRead === false && message.fromwhome === oppositeRole) {
  //       return count + 1;
  //     }
  //     return count;
  //   }, 0);
  
  //   console.log(`Unread count for chat ${chat._id}:`, unreadCount);
  //   return unreadCount;
  // };
  

  const countUnreadMessages = (chat) => {
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginUserId = storedData?.teammember?.userid || logindata?.user?.id;
  
    if (!chat.description || !Array.isArray(chat.description)) return 0;
  
    const unreadCount = chat.description.reduce((count, message) => {
      // Count only messages:
      // - not read
      // - and NOT sent by the current user
      if (
        message.isRead === false &&
        message.senderid &&
        message.senderid._id !== loginUserId
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  
    return unreadCount;
  };
  
  // const countUnreadAdminMessages = (chat) => {
  //   if (!chat.description || !Array.isArray(chat.description)) return 0;
    
  //   const unreadCount = chat.description.reduce((count, message) => {
  //     // Check if message is unread and from Admin
  //     if (message.isRead === false && message.fromwhome === "Admin") {
  //       return count + 1;
  //     }
  //     return count;
  //   }, 0);
  
  //   console.log(`Unread count for chat ${chat._id}:`, unreadCount);
  //   return unreadCount;
  // };
    const formattedTime = new Date(time)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      })
      .replace(",", "");
      const handleShowChat = async (chatId) => {
        try {
          // Mark as read
          await axios.patch(`${INTERNALCHAT}/api/internalchat/${chatId}/markAllRead
`);
          
        getsChatlist()
          const chat = chatList.find((c) => c._id === chatId);
          setSelectedChat(chat);
          setChatId(chatId);
          
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      };
      
      
        const getsChatDetails = async () => {
          try {
            const url = `${INTERNALCHAT}/api/internalchat/${chatId}`;
            const response = await fetch(url);
            const data = await response.json();
            setSelectedChat(data.chat);
          } catch (error) {
            console.error("Error fetching chat details:", error);
          }
        };
      
  return (
    <Box mt={2}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5">Communications</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)",
            },
            borderRadius: "15px",
          }}
          onClick={handleOpen}
        >
          New Communication
        </Button>
      </Box>


      <Box display="flex" height="90vh" gap={2} p={1}>
        {/* Chat list */}
        <Box
          width="30%"
          height="100%"
          overflow="auto"
          pr={1}
          borderRight="1px solid #ddd"
        >
          {chatList.length > 0 ? (
            chatList.map((chat, index) => {
 // 👇 Get the other participant
 const receiver = chat.participants.find(
  (participant) => participant._id !== loginUserId
);
               const unreadCount = countUnreadMessages(chat);
                return (
              <Box key={index}>
                <Paper
                  sx={{ p: 1, cursor: "pointer" }}
                  onClick={() => handleShowChat(chat._id)}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                     
                     
                      <Typography variant="caption" color="text.secondary">
                      Chat with <b>{receiver?.username || "Unknown"}</b>
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {/* Show unread count badge if there are unread messages */}
                      {unreadCount > 0 && (
                        <Box
                          sx={{
                            backgroundColor: theme.palette.success.main,
                            color: "white",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                          }}
                        >
                          {unreadCount}
                        </Box>
                      )}
                     
                    </Box>
                  </Box>

                  
                  <Typography variant="caption">
                    {(() => {
                      const messages = chat.description || [];
                      const latest = messages[messages.length - 1];
                      if (!latest) return "No messages yet";

                      const clean =
                        latest.message?.replace(/<[^>]+>/g, "") || "";
                      const sender =
                        latest.fromwhome === "Admin"
                          ? "You"
                          : latest.senderid?.username || "";

                      return `${sender}: ${
                        clean.length > 35 ? clean.slice(0, 35) + "..." : clean
                      }`;
                    })()}
                  </Typography>

                  <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary">
                      {formattedTime}
                    </Typography>
                  </Box>
                </Paper>
                <Divider sx={{ my: 1 }} />
              </Box>
                )
})
          ) : (
            <Typography variant="body2" color="text.secondary">
              No chats to display
            </Typography>
          )}
        </Box>

        {/* Chat details */}
        <Box width="70%" height="100%" overflow="auto">
          {selectedChat ? (
            <ChatDetails
              chat={selectedChat}
              getsChatDetails={getsChatDetails}
              getsChatlist={getsChatlist}
             
              onChatAction={() => setSelectedChat(null)}
            />
          ) : (
            <Typography variant="body1" mt={2}>
              Select a chat to view details
            </Typography>
          )}
        </Box>
      </Box>

      <NewChatDrawer handleClose={handleClose} open={open} getsChatlist={getsChatlist}/>
    </Box>
  );
};

export default InternalCommunication;
