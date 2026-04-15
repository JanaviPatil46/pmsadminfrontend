
import React, { useState, useEffect, useContext } from "react";
import NewChatDrawer from "./NewChatDrawer";
import { useParams } from "react-router-dom";
import ChatDetails from "./ChatDetails";
import axios from "axios";
import { toast } from "react-toastify";
import { LoginContext } from "../../../Sidebar/Context/Context";
import { MdOutlineArchive, MdDeleteOutline } from "react-icons/md";
import { FaTelegram } from "react-icons/fa";
const Commuication = () => {
  const { logindata } = useContext(LoginContext);
  const [loginUserId, setLoginUserId] = useState();
  const { data } = useParams();

  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;

  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true); // Toggle state
  const [accountName, setAccountName] = useState("");

  const [time, setTime] = useState();

       const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${data}`
      );
      // setAccount(res.data);
      setAccountName(res.data.accounts.accountName)
      console.log("result", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };


 useEffect(() => {
    // if (loginUserId) {
      fetchAccountDetails();
    // }
  }, [data]);
  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  useEffect(() => {
    accountwiseChatlist(data, isActiveTrue);
  }, [isActiveTrue, data]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const accountwiseChatlist = (accId, active) => {
    const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/isactivechat/${accId}/${active}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setChatList(result.chataccountwise || []);
        if (result.chataccountwise?.length > 0) {
          result.chataccountwise.forEach((chat) => {
            setTime(chat.updatedAt);
          });
        }
      })
      .catch((error) => console.error("Error fetching chat list:", error));
  };
  // Function to count unread admin messages
const countUnreadAdminMessages = (chat) => {
  if (!chat.description || !Array.isArray(chat.description)) return 0;
  
  const unreadCount = chat.description.reduce((count, message) => {
    // Check if message is unread and from Admin
    if (message.isRead === false && message.fromwhome === "client") {
      return count + 1;
    }
    return count;
  }, 0);

  console.log(`Unread count for chat ${chat._id}:`, unreadCount);
  return unreadCount;
};
  const formattedTime = new Date(time)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })
    .replace(",", "");

  // const handleShowChat = (chatId) => {
  //   const chat = chatList.find((c) => c._id === chatId);
  //   setSelectedChat(chat);
  //   setChatId(chatId);
    
  // };

  const handleShowChat = async (chatId) => {
  try {
    // Mark as read
    await axios.patch(`${CHATTOCLIENT_API}/chats/mark-all-read/${chatId}/accounts/${data}/Admin`);
    
    // // Navigate to the chat
    // navigate(`/updatechat/${chatId}`);
    accountwiseChatlist(data, isActiveTrue);
    // Update local state
    const chat = chatList.find((c) => c._id === chatId);
    setSelectedChat(chat);
    setChatId(chatId);
    
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
};


  const getsChatDetails = async () => {
    try {
      const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`;
      const response = await fetch(url);
      const data = await response.json();
      setSelectedChat(data.chat);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  const handleCheckboxChange = (chatId) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const isChatSelected = (chatId) => selectedChatIds.includes(chatId);

  const handleBulkDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected chats?"
    );
    if (isConfirmed) {
      try {
        await Promise.all(
          selectedChatIds.map((id) =>
            fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/${id}`, {
              method: "DELETE",
            })
          )
        );
        toast.success("Chats deleted successfully!");
        setSelectedChatIds([]);
        accountwiseChatlist(data, isActiveTrue);
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected chats");
      }
    }
  };

  const handleBulkArchive = () => {
    selectedChatIds.forEach((id) => handleArchiveJob(id));
  };

  const handleArchiveJob = (chatId) => {
    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !isActiveTrue }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Chat archived successfully");
        setSelectedChatIds([]);
        accountwiseChatlist(data, isActiveTrue);
      })
      .catch((err) => {
        console.error("Archive Error:", err);
        toast.error("Failed to archive chat");
      });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-1 pb-3 border-b border-border">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-base font-semibold text-foreground">Chats &amp; Tasks</span>

          {/* Active / Archived toggle pill */}
          <div className="flex items-center bg-muted rounded-xl p-1 gap-0.5">
            {[{ label: "Active", value: true }, { label: "Archived", value: false }].map(({ label, value }) => (
              <button key={label} type="button"
                onClick={() => { if (isActiveTrue !== value) { setSelectedChat(null); setIsActiveTrue(value); } }}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActiveTrue === value
                    ? 'bg-card shadow-sm text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >{label}</button>
            ))}
          </div>

          {/* Bulk actions */}
          {selectedChatIds.length > 0 && (
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <span className="text-xs text-muted-foreground">{selectedChatIds.length} selected</span>
              <button type="button" onClick={handleBulkDelete}
                className="flex items-center gap-1 text-xs font-medium text-destructive hover:text-destructive/80 bg-destructive/10 hover:bg-destructive/20 rounded-lg px-2.5 py-1.5 transition-colors">
                <MdDeleteOutline size={14} /> Delete
              </button>
              <button type="button" onClick={handleBulkArchive}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/70 rounded-lg px-2.5 py-1.5 transition-colors">
                <MdOutlineArchive size={14} /> {isActiveTrue ? "Archive" : "Unarchive"}
              </button>
            </div>
          )}
        </div>

        <button type="button" onClick={handleOpen}
          className="rounded-lg px-4 py-2 text-xs font-semibold text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors shrink-0">
          + New Chat
        </button>
      </div>

      {/* Content area */}
      <div className="flex gap-0 flex-1 min-h-0 pt-3" style={{ height: 'calc(100vh - 130px)' }}>

        {/* Chat list sidebar */}
        <div className="w-[280px] shrink-0 h-full overflow-y-auto border-r border-border pr-2 space-y-1">
          {chatList.length > 0 ? (
            chatList.map((chat, index) => {
              const unreadCount = countUnreadAdminMessages(chat);
              const isSelected = selectedChat?._id === chat._id;
              return (
                <div
                  key={index}
                  onClick={() => handleShowChat(chat._id)}
                  className={`group relative rounded-xl px-3 py-3 cursor-pointer transition-colors border ${
                    isSelected
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-card border-border hover:bg-muted/50 hover:border-border'
                  }`}
                >
                  {/* Row 1: checkbox + icon + account name + unread badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-border accent-primary"
                        checked={isChatSelected(chat._id)}
                        onChange={() => handleCheckboxChange(chat._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <FaTelegram size={13} className={chat.chatstatus ? 'text-primary' : 'text-success'} />
                      <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">{chat.accountid?.accountName}</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-success text-white text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {/* Row 2: subject */}
                  <p className={`text-sm font-semibold truncate ${
                    unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'
                  }`}>{chat.chatsubject}</p>
                  {/* Row 3: last message preview */}
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {(() => {
                      const messages = chat.description || [];
                      const latest = messages[messages.length - 1];
                      if (!latest) return "No messages yet";
                      const clean = latest.message?.replace(/<[^>]+>/g, "") || "";
                      const sender = latest.fromwhome === "Admin" ? "You" : latest.senderid || "";
                      return `${sender}: ${clean.length > 40 ? clean.slice(0, 40) + "…" : clean}`;
                    })()}
                  </p>
                  {/* Row 4: time */}
                  <p className="text-[10px] text-muted-foreground text-right mt-1">{formattedTime}</p>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <FaTelegram size={28} className="text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">No chats to display</p>
            </div>
          )}
        </div>

        {/* Chat details panel */}
        <div className="flex-1 h-full overflow-y-auto pl-3">
          {selectedChat ? (
            <ChatDetails
              chat={selectedChat}
              getsChatDetails={getsChatDetails}
              accountwiseChatlist={accountwiseChatlist}
              data={data}
              accountName={accountName}
              isActiveTrue={isActiveTrue}
              onChatAction={() => setSelectedChat(null)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <FaTelegram size={24} className="text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Select a chat to view details</p>
            </div>
          )}
        </div>
      </div>

      <NewChatDrawer
        handleClose={handleClose}
        open={open}
        accountwiseChatlist={accountwiseChatlist}
        data={data}
        isActiveTrue={isActiveTrue}
      />
    </div>
  );
};

export default Commuication;
