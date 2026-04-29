import { toast } from "react-toastify";
import React, { useEffect, useState, useRef, useContext } from "react";
import { MoreVertical, X } from "lucide-react";
import Editor from "./TextEditor";
import { LoginContext } from "../../Sidebar/Context/Context";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const ChatDetails = ({ chat, getsChatDetails, onChatAction, getsChatlist }) => {
  const INTERNALCHAT = process.env.REACT_APP_INTERNALCHAT_API;
  const [chatId] = useState(chat._id);
  const { logindata } = useContext(LoginContext);
  const [loginUserId, setLoginUserId] = useState();
  const messageRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);
      fetchUserData(id);
    }
  }, [logindata]);

  const fetchUserData = async (id) => {
    const requestOptions = { method: "GET", headers: new Headers(), redirect: "follow" };
    fetch(`${LOGIN_API}/common/user/${id}`, requestOptions)
      .then((r) => r.json())
      .then((result) => { console.log("id", result); });
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.description]);

  const handleEditorChange = (content) => setEditorContent(content);

  const updateChatDescription = (message = "") => {
    const contentToSend = message.trim() || editorContent.trim();
    if (!contentToSend || !chat?._id) return;

    const userRole = localStorage.getItem("userRole");
    const userId = logindata?.user?.id;

    const newDescription = {
      message: contentToSend,
      fromwhome: userRole,
      senderid: userId,
      isRead: false,
      time: new Date(),
    };

    if (replyTo) newDescription.replyTo = replyTo._id;

    fetch(`${INTERNALCHAT}/api/internalchat/${chat._id}/message`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageData: newDescription }),
    })
      .then((r) => { if (!r.ok) throw new Error("Failed to send"); return r.json(); })
      .then(() => {
        toast.success("Message sent");
        setEditorContent("");
        setReplyTo(null);
        getsChatlist();
        getsChatDetails();
      })
      .catch(() => toast.error("Send failed"));
  };

  const handleDeleteMessage = async (messageToDelete) => {
    try {
      const response = await fetch(
        `${INTERNALCHAT}/api/internalchat/${chatId}/message/bymessageid/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, messageId: messageToDelete._id }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete message");
      toast.success("Message deleted successfully");
      getsChatDetails();
      getsChatlist();
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
      <div className="flex-1 overflow-y-auto mb-3 max-h-[40vh]">
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
          <Button onClick={() => updateChatDescription()} className="rounded-full px-5 self-end shrink-0">
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
  setReplyTo,
  formatDate,
  loginUserId,
  handleDeleteMessage,
}) => {
  const isClient = desc.fromwhome?.toLowerCase() === "teammember";
  const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
  const messageTime = desc.time ? formatDate(desc.time) : "Just now";

  const isCurrentUser =
    (desc.senderid?._id === loginUserId) ||
    (desc.senderid === loginUserId);

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

  return (
    <div
      ref={(el) => { if (desc._id) messageRefs.current[desc._id] = el; }}
      className={`flex mb-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl shadow-sm p-3 ${
          desc._id === highlightedId
            ? "bg-amber-100 dark:bg-amber-900/30"
            : isAdmin
            ? "bg-primary/10"
            : "bg-muted"
        }`}
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
          <span className="text-sm font-semibold text-foreground">{senderDisplayName}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setReplyTo(desc)}>
                Reply
              </DropdownMenuItem>
              {isCurrentUser && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteMessage(desc)}
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          className="text-sm text-foreground whitespace-pre-wrap mt-1"
          dangerouslySetInnerHTML={{
            __html: typeof desc.message === "string" ? desc.message : "No message available",
          }}
        />
        <div className="text-right mt-1">
          <span className="text-xs text-muted-foreground">{messageTime}</span>
        </div>
      </div>
    </div>
  );
};

const ReplyPreviewItem = ({ desc, chat, messageRefs, setHighlightedId }) => {
  const repliedMsg = chat.description.find((msg) => msg._id === desc.replyTo);
  if (!repliedMsg) return null;

  return (
    <div className="bg-background border-l-[3px] border-primary px-2 py-1 mb-2 rounded">
      <button
        className="text-xs font-bold text-primary cursor-pointer hover:underline block mb-0.5"
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
        className="text-xs italic text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: repliedMsg.message?.length > 100
            ? repliedMsg.message.slice(0, 100) + "..."
            : repliedMsg.message,
        }}
      />
    </div>
  );
};

const ReplyPreview = ({ replyTo, setReplyTo }) => (
  <div className="relative bg-muted border-l-4 border-primary rounded p-3">
    <p className="text-xs font-bold text-foreground mb-1">
      Replying to:{" "}
      {replyTo.fromwhome === "client" ? replyTo.senderid?.username : "You" || "Admin"}
    </p>
    <div
      className="text-xs italic text-muted-foreground whitespace-pre-wrap pr-6"
      dangerouslySetInnerHTML={{
        __html: replyTo.message?.length > 100
          ? `${replyTo.message.slice(0, 100)}...`
          : replyTo.message,
      }}
    />
    <button
      onClick={() => setReplyTo(null)}
      className="absolute top-2 right-2 p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
);

export default ChatDetails;
  