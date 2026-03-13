// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   IconButton,
//   Drawer,
//   List,
//   ListItemButton,
//   TextField,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import ComposeEmailDrawer from "./ComposeDrawer";

// const EmailViewer = ({ type }) => {
//   const { data } = useParams();
// const navigate = useNavigate();


//   const [threads, setThreads] = useState([]);
//   const [selectedThreadId, setSelectedThreadId] = useState(null);
//   const [replyText, setReplyText] = useState("");
//   const [previewFile, setPreviewFile] = useState(null);
//   const [openDrawer, setOpenDrawer] = useState(false);

//   useEffect(() => {
//     fetchEmailSyncedContactsAndEmails();
//   }, [type]);
//   const SUPPORT_EMAIL = "support@snptaxandfinancials.com";
//   const [contactMap, setContactMap] = useState({});

//   // 🔹 Fetch Emails
//   const fetchEmailSyncedContactsAndEmails = async () => {
//     try {
//       const contactsRes = await axios.get(
//         `https://www.snptaxes.com/api/accounts/${data}/contacts`,
//       );
// console.log("contactsRes", contactsRes.data.data);
//       const syncedEmails = (contactsRes.data.data || [])
//         .filter((item) => item.canEmailSync && item.contact?.email)
//         .map((item) => item.contact.email);
//       console.log("syncedEmails", syncedEmails);
//       const contactMap = {};
//       (contactsRes.data.data || []).forEach((item) => {
//         if (item.canEmailSync && item.contact?.email) {
//           contactMap[item.contact.email.toLowerCase()] =
//             item.contact.contactName || item.contact.email;
//         }
//       });
//       setContactMap(contactMap);

//       if (!syncedEmails.length) return;

//       //   const emailsRes = await axios.post(
//       //     "http://127.0.0.1:8015/emailsync/messagesList/messages",
//       //     { emails: syncedEmails, folder: type }
//       //   );

//       //   setThreads(emailsRes.data.threads || []);
//       const emailsRes = await axios.post(
//         "http://127.0.0.1:8015/emailsync/messagesList/messages",
//         { emails: syncedEmails, folder: type },
//       );

//       const filteredThreads = (emailsRes.data.threads || []).filter(
//         (thread) => {
//           return thread.messages.some((msg) => {
//             const from = msg.from?.toLowerCase() || "";
//             const to = msg.to?.toLowerCase() || "";

//             const isFromContact = syncedEmails.some((e) => from.includes(e));
//             const isToContact = syncedEmails.some((e) => to.includes(e));

//             const isFromSupport = from.includes(SUPPORT_EMAIL);
//             const isToSupport = to.includes(SUPPORT_EMAIL);

//             // 📥 INBOX: Contact → Support
//             if (type === "inbox") {
//               return isFromContact && isToSupport;
//             }

//             // 📤 SENT: Support → Contact
//             if (type === "sent") {
//               return isFromSupport && isToContact;
//             }

//             return false;
//           });
//         },
//       );

//       setThreads(filteredThreads);

//       //   console.log("email thredas",emailsRes.data.threads || []);
//       console.log("Filtered inbox:", filteredThreads);
//     } catch (error) {
//       console.error("Error fetching emails", error);
//     }
//   };
// const unreadCount = threads.filter(t => !t.latest?.read).length;
// useEffect(() => {
//   navigate(".", { state: { unreadCount } });
// }, [unreadCount]);
//   // 🔹 Extract name
//   const getName = (from) => from?.replace(/<.*?>/g, "").trim();

//   // 🔹 Thread title
//   //   const formatThreadTitle = (thread) => {
//   //     const names = new Set();

//   //     thread.messages.forEach((msg) => {
//   //       const name = getName(msg.from);

//   //       if (name?.toLowerCase().includes("support@snptaxandfinancials.com")) {
//   //         names.add("me");
//   //       } else {
//   //         names.add(name?.split(" ")[0].toLowerCase());
//   //       }
//   //     });

//   //     const count = thread.messages.length;

//   //     return count > 1
//   //       ? `${[...names].join(", ")} ${count}`
//   //       : `${[...names].join(", ")}`;
//   //   };

//   const formatThreadTitle = (thread) => {
//     let contactEmail = "";
//     let contactName = "Unknown";

//     thread.messages.forEach((msg) => {
//       const from = msg.from?.toLowerCase() || "";
//       const to = msg.to?.toLowerCase() || "";

//       if (from.includes(SUPPORT_EMAIL)) {
//         contactEmail = to;
//       } else {
//         contactEmail = from;
//       }
//     });

//     const email = Object.keys(contactMap).find((e) => contactEmail.includes(e));

//     if (email) {
//       contactName = contactMap[email];
//     } else {
//       contactName = getName(contactEmail);
//     }

//     const count = thread.messages.length;

//     if (type === "sent") {
//       return `me → ${contactName} (${count})`;
//     }

//     return `${contactName} → me (${count})`;
//   };

//   // 🔹 Preview text
//   const getPreview = (html, length = 80) => {
//     const text = html.replace(/<[^>]*>?/gm, "");
//     return text.length > length ? text.slice(0, length) + "..." : text;
//   };

//   // 🔹 Attachment preview
//   const openAttachment = (attachment) => {
//     const byteCharacters = atob(attachment.data);
//     const byteNumbers = new Array(byteCharacters.length);

//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }

//     const blob = new Blob([new Uint8Array(byteNumbers)], {
//       type: attachment.mimeType,
//     });

//     setPreviewFile({
//       ...attachment,
//       url: URL.createObjectURL(blob),
//     });
//   };

//   // 🔹 Send Reply
//   const sendReply = async () => {
//     const thread = threads.find((t) => t._id === selectedThreadId);
//     if (!thread) return;

//     const lastEmail = thread.messages[thread.messages.length - 1];

//     await axios.post("http://127.0.0.1:8015/emailsync/user/reply", {
//       to: lastEmail.from,
//       subject: lastEmail.subject || "No Subject",
//       message: replyText,
//     });

//     setReplyText("");
//     alert("Reply sent!");
//   };

//   // 🔹 Mark Read
//   const markThreadAsRead = async (threadId) => {
//     try {
//       await axios.patch(
//         "http://127.0.0.1:8015/emailsync/messagesList/threads/mark-read",
//         { threadId },
//       );

//       fetchEmailSyncedContactsAndEmails();
//     } catch (err) {
//       console.error("Mark read failed", err);
//     }
//   };

//   const selectedThread = threads.find((t) => t._id === selectedThreadId);

//   return (
//     <>
//       {/* Top Bar */}
//       <Box
//         sx={{
//           height: "60px",
//           border: "1px solid #ddd",
//           borderRadius: 2,
//           mb: 3,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "flex-end",
//           px: 2,
//         }}
//       >
//         <Button variant="contained" onClick={() => setOpenDrawer(true)}>
//           New Email
//         </Button>
//       </Box>

//       {/* Main Layout */}
//       <Box
//         sx={{
//           display: "flex",
//           height: "90vh",
//           bgcolor: "#fff",
//           border: "1px solid #ddd",
//           borderRadius: 2,
//         }}
//       >
//         {/* LEFT: Inbox / Sent */}
//         <Box
//           sx={{
//             width: "35%",
//             borderRight: "1px solid #ddd",
//             overflowY: "auto",
//           }}
//         >
//           <List>
//             {threads.map((thread) => {
//               const latest = thread.latest;

//               return (
//                 <ListItemButton
//                   key={thread._id}
//                   onClick={() => {
//                     setSelectedThreadId(thread._id);
//                     markThreadAsRead(thread._id);
//                   }}
//                   sx={{
//                     borderBottom: "1px solid #eee",
//                     "&:hover": { bgcolor: "#f5f5f5" },
//                     bgcolor:
//                       selectedThreadId === thread._id
//                         ? "#f0f4ff"
//                         : "transparent",
//                   }}
//                 >
//                   <Box>
//                     <Typography
//                       fontWeight={latest.read ? 400 : 700}
//                       color={"red"}
//                     >
//                       {formatThreadTitle(thread)}
//                     </Typography>

//                     <Typography fontWeight={latest.read ? 400 : 600}>
//                       {latest.subject || "(No Subject)"}
//                     </Typography>

//                     <Typography variant="caption" color="text.secondary">
//                       {getPreview(latest.body)}
//                     </Typography>
//                   </Box>
//                 </ListItemButton>
//               );
//             })}
//           </List>
//         </Box>

//         {/* RIGHT: Email Viewer */}
//         <Box sx={{ width: "65%", p: 2, overflowY: "auto" }}>
//           {selectedThread ? (
//             <>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 2,
//                   borderBottom: "1px solid #ddd",
//                   pb: 1,
//                 }}
//               >
//                 <Typography variant="h6">
//                   {selectedThread.latest.subject}
//                 </Typography>

//                 <CloseIcon
//                   sx={{ cursor: "pointer", color: "#555" }}
//                   onClick={() => setSelectedThreadId(null)}
//                 />
//               </Box>

//               {selectedThread.messages.map((email) => (
//                 <Box
//                   key={email.messageId}
//                   sx={{ borderBottom: "1px solid #ddd", mb: 2, pb: 2 }}
//                 >
//                   <Typography fontWeight="bold">
//                     {getName(email.from)}
//                   </Typography>

//                   <Typography variant="caption" color="text.secondary">
//                     {new Date(email.createdAt).toLocaleString()}
//                   </Typography>

//                   <Box
//                     sx={{ mt: 1 }}
//                     dangerouslySetInnerHTML={{ __html: email.body }}
//                   />

//                   {email.attachments?.length > 0 && (
//                     <Box sx={{ mt: 2 }}>
//                       <Typography fontWeight="bold">Attachments</Typography>

//                       <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//                         {email.attachments.map((att, i) => (
//                           <Box
//                             key={i}
//                             onClick={() => openAttachment(att)}
//                             sx={{
//                               border: "1px solid #ddd",
//                               borderRadius: 2,
//                               p: 1,
//                               cursor: "pointer",
//                               bgcolor: "#fff",
//                               "&:hover": { bgcolor: "#f0f0f0" },
//                             }}
//                           >
//                             <Typography fontSize={13}>
//                               {att.filename}
//                             </Typography>
//                           </Box>
//                         ))}
//                       </Box>
//                     </Box>
//                   )}
//                 </Box>
//               ))}

//               {/* 🔹 Reply Box */}
//               {type === "inbox" && (
//                 <Box sx={{ mt: 3, borderTop: "1px solid #ddd", pt: 2 }}>
//                   <Typography fontWeight="bold" mb={1}>
//                     Reply
//                   </Typography>

//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={5}
//                     placeholder="Write your reply..."
//                     value={replyText}
//                     onChange={(e) => setReplyText(e.target.value)}
//                   />

//                   <Box
//                     sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
//                   >
//                     <Button variant="contained" onClick={sendReply}>
//                       Send
//                     </Button>
//                   </Box>
//                 </Box>
//               )}
//             </>
//           ) : (
//             <Typography color="text.secondary">
//               Select an email to read
//             </Typography>
//           )}
//         </Box>
//       </Box>

//       {/* Attachment Preview */}
//       {previewFile && (
//         <Box
//           onClick={() => setPreviewFile(null)}
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             bgcolor: "rgba(0,0,0,0.7)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 9999,
//           }}
//         >
//           <Box
//             onClick={(e) => e.stopPropagation()}
//             sx={{
//               width: "85%",
//               height: "90%",
//               bgcolor: "#fff",
//               borderRadius: 2,
//               overflow: "hidden",
//             }}
//           >
//             <Box
//               sx={{
//                 p: 1,
//                 borderBottom: "1px solid #ddd",
//                 display: "flex",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Typography fontWeight="bold">{previewFile.filename}</Typography>
//               <Button onClick={() => setPreviewFile(null)}>Close</Button>
//             </Box>

//             <Box sx={{ height: "100%" }}>
//               <iframe
//                 src={previewFile.url}
//                 style={{ width: "100%", height: "100%", border: "none" }}
//                 title="Preview"
//               />
//             </Box>
//           </Box>
//         </Box>
//       )}

//       {/* Compose Drawer */}
//       <ComposeEmailDrawer
//   open={openDrawer}
//   onClose={() => setOpenDrawer(false)}
// />

//     </>
//   );
// };

// export default EmailViewer;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ComposeEmailDrawer from "./ComposeDrawer";
import { Avatar as ShadAvatar, AvatarFallback } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { Button as ShadButton } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Reply, Trash2, X, Pencil, Paperclip, Send as SendIcon } from "lucide-react";

const AVATAR_COLORS = ["#00ACC1","#7C3AED","#16A34A","#DC2626","#D97706","#2563EB","#DB2777"];
const getAvatarColor = (str = "") => {
  const hash = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};
const getInitialsFromStr = (str = "") => {
  const clean = str.replace(/<.*?>/g, "").trim();
  const parts = clean.split(/[\s@]+/);
  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
};
const getRelativeTime = (dateStr) => {
  if (!dateStr) return "";
  const diffDays = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1D";
  return `${diffDays}D`;
};

const EmailViewer = ({ type }) => {
  const { data } = useParams();
  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [contactMap, setContactMap] = useState({});

  // const SUPPORT_EMAIL = "support@snptaxandfinancials.com";
  const SUPPORT_EMAIL = "silpa@snptaxandfinancials.com";

  useEffect(() => {
    fetchEmailSyncedContactsAndEmails();
  }, [type]);

  // 🔹 Fetch Emails
  const fetchEmailSyncedContactsAndEmails = async () => {
    try {
      const contactsRes = await axios.get(
        `https://www.snptaxes.com/api/accounts/${data}/contacts`
      );

      const syncedEmails = (contactsRes.data.data || [])
        .filter((item) => item.canEmailSync && item.contact?.email)
        .map((item) => item.contact.email.toLowerCase());

      const contactMapTemp = {};
      (contactsRes.data.data || []).forEach((item) => {
        if (item.canEmailSync && item.contact?.email) {
          contactMapTemp[item.contact.email.toLowerCase()] =
            item.contact.contactName || item.contact.email;
        }
      });

      setContactMap(contactMapTemp);

      if (!syncedEmails.length) return;

      const emailsRes = await axios.post(
        "https://www.snptaxes.com/emailsync/messagesList/messages",
        { emails: syncedEmails, folder: type }
      );

      const filteredThreads = (emailsRes.data.threads || []).filter((thread) =>
        thread.messages.some((msg) => {
          const from = msg.from?.toLowerCase() || "";
          const toList = Array.isArray(msg.to) ? msg.to : [msg.to || ""];

          const isFromContact = syncedEmails.some((e) => from.includes(e));
          const isToContact = toList.some((t) => syncedEmails.includes(t));

          const isFromSupport = from.includes(SUPPORT_EMAIL);
          const isToSupport = toList.some((t) => t.includes(SUPPORT_EMAIL));

          if (type === "inbox") return isFromContact && isToSupport;
          if (type === "sent") return isFromSupport && isToContact;

          return false;
        })
      );

      setThreads(filteredThreads);
      console.log("Filtered threads:", filteredThreads);
    } catch (error) {
      console.error("Error fetching emails", error);
    }
  };

  const unreadCount = threads.filter((t) => !t.latest?.read).length;

  useEffect(() => {
    navigate(".", { state: { unreadCount } });
  }, [unreadCount]);

  // 🔹 Helpers
  const getName = (from) => from?.replace(/<.*?>/g, "").trim();
const formatThreadTitle = (thread) => {
  let recipients = new Set();

  const normalize = (email) =>
    email
      ?.toLowerCase()
      .replace(/<.*?>/g, "")
      .trim();

  thread.messages.forEach((msg) => {
    const from = normalize(msg.from);
    const toList = Array.isArray(msg.to) ? msg.to : [msg.to || ""];

    if (from.includes(SUPPORT_EMAIL)) {
      toList.forEach((email) => {
        const clean = normalize(email);
        if (clean && !clean.includes(SUPPORT_EMAIL)) {
          recipients.add(clean);
        }
      });
    } else {
      if (from && !from.includes(SUPPORT_EMAIL)) {
        recipients.add(from);
      }
    }
  });

  // Convert emails to display names
  const names = Array.from(recipients).map((email) => {
    const key = Object.keys(contactMap).find((e) => email.includes(e));
    return key ? contactMap[key] : getName(email);
  });

  const messageCount = thread.messages.length;
  const countText = messageCount > 1 ? ` (${messageCount})` : "";

  const displayNames =
    names.length > 1 ? names.join(", ") : names[0] || "Unknown";

  return type === "sent"
    ? `me → ${displayNames}${countText}`
    : `${displayNames} → me${countText}`;
};

  // const formatThreadTitle = (thread) => {
  //   let contactEmail = "";
  //   let contactName = "Unknown";

  //   thread.messages.forEach((msg) => {
  //     const from = msg.from?.toLowerCase() || "";
  //     const toList = Array.isArray(msg.to) ? msg.to : [msg.to || ""];

  //     if (from.includes(SUPPORT_EMAIL)) {
  //       contactEmail =
  //         toList.find((e) => !e.includes(SUPPORT_EMAIL)) || toList[0];
  //     } else {
  //       contactEmail = from;
  //     }
  //   });

  //   const emailKey = Object.keys(contactMap).find((e) =>
  //     contactEmail.includes(e)
  //   );

  //   if (emailKey) contactName = contactMap[emailKey];
  //   else contactName = getName(contactEmail);

  //   const count = thread.messages.length;

  //   return type === "sent"
  //     ? `me → ${contactName} (${count})`
  //     : `${contactName} → me (${count})`;
  // };
// const formatThreadTitle = (thread) => {
//   let recipients = new Set();

//   thread.messages.forEach((msg) => {
//     const from = msg.from?.toLowerCase() || "";
//     const toList = Array.isArray(msg.to) ? msg.to : [msg.to || ""];

//     if (from.includes(SUPPORT_EMAIL)) {
//       toList.forEach((email) => {
//         if (!email.includes(SUPPORT_EMAIL)) {
//           recipients.add(email.toLowerCase());
//         }
//       });
//     } else {
//       recipients.add(from);
//     }
//   });

//   const names = Array.from(recipients).map((email) => {
//     const key = Object.keys(contactMap).find((e) => email.includes(e));
//     return key ? contactMap[key] : getName(email);
//   });

//   const messageCount = thread.messages.length;

//   // 🔹 Only show count if more than 1 message
//   const countText = messageCount > 1 ? ` (${messageCount})` : "";

//   const displayNames =
//     names.length > 1 ? names.join(", ") : names[0] || "Unknown";

//   return type === "sent"
//     ? `me → ${displayNames}${countText}`
//     : `${displayNames} → me${countText}`;
// };


  const getPreview = (html, length = 80) => {
    const text = html.replace(/<[^>]*>?/gm, "");
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  const openAttachment = (attachment) => {
    const byteCharacters = atob(attachment.data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([new Uint8Array(byteNumbers)], {
      type: attachment.mimeType,
    });

    setPreviewFile({
      ...attachment,
      url: URL.createObjectURL(blob),
    });
  };

 const sendReply = async () => {
  const thread = threads.find((t) => t._id === selectedThreadId);
  if (!thread) return;

  const lastEmail = thread.messages[thread.messages.length - 1];

  // ✅ Pick only the LAST email from the "to" array
  const toList = Array.isArray(lastEmail.to) ? lastEmail.to : [lastEmail.to];
  const replyTo = toList[toList.length - 1];

  console.log("Sending reply to:", replyTo);

  await axios.post("https://www.snptaxes.com/emailsync/user/reply", {
    to: replyTo,
    subject: `Re: ${lastEmail.subject || "No Subject"}`,
    message: replyText,
    threadId: thread._id,
  });

  setReplyText("");
  alert("Reply sent!");
};


  const markThreadAsRead = async (threadId) => {
    try {
      await axios.patch(
        "https://www.snptaxes.com/emailsync/messagesList/threads/mark-read",
        { threadId }
      );
      fetchEmailSyncedContactsAndEmails();
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  const selectedThread = threads.find((t) => t._id === selectedThreadId);

  return (
    <>
      <div style={{ display: "flex", height: "100%", overflow: "hidden", backgroundColor: "#fff" }}>

        {/* ── LEFT: Thread list panel ── */}
        <div style={{ width: 340, minWidth: 340, display: "flex", flexDirection: "column", borderRight: "1px solid #f0f0f0", height: "100%", overflow: "hidden" }}>

          {/* Search + Compose header */}
          <div style={{ padding: "12px 12px 10px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none" }} />
              <Input
                placeholder="Search"
                style={{ paddingLeft: 30, height: 32, fontSize: 12, borderRadius: 8, border: "1px solid #eee", backgroundColor: "#fafafa" }}
              />
            </div>
            <ShadButton
              size="sm"
              className="w-full h-8 text-xs rounded-lg gap-1.5"
              style={{ backgroundColor: "#00ACC1", color: "#fff" }}
              onClick={() => setOpenDrawer(true)}
            >
              <Pencil size={11} />
              Compose
            </ShadButton>
          </div>

          {/* Thread list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {threads.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#bbb", fontSize: 13 }}>
                No emails found
              </div>
            ) : (
              threads.map((thread) => {
                const latest = thread.latest;
                const isSelected = selectedThreadId === thread._id;
                const isUnread = !latest?.read;
                const senderRaw = type === "sent"
                  ? (Array.isArray(latest?.to) ? latest.to[0] : latest?.to)
                  : latest?.from;
                const avatarBg = getAvatarColor(senderRaw || "");
                const initials = getInitialsFromStr(senderRaw || "");

                return (
                  <div
                    key={thread._id}
                    onClick={() => { setSelectedThreadId(thread._id); markThreadAsRead(thread._id); }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "11px 14px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f8f8f8",
                      borderLeft: isSelected ? "3px solid #00ACC1" : "3px solid transparent",
                      backgroundColor: isSelected ? "rgba(0,172,193,0.05)" : "transparent",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {/* Colored initials avatar */}
                    <ShadAvatar className="h-9 w-9 shrink-0 mt-0.5">
                      <AvatarFallback style={{ backgroundColor: avatarBg, color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>
                        {initials}
                      </AvatarFallback>
                    </ShadAvatar>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontSize: 12.5, fontWeight: isUnread ? 700 : 500, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 168 }}>
                          {formatThreadTitle(thread)}
                        </span>
                        <span style={{ fontSize: 10.5, color: "#bbb", flexShrink: 0, marginLeft: 4 }}>
                          {getRelativeTime(latest?.createdAt || latest?.date)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: isUnread ? 600 : 400, color: "#333", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {latest?.subject || "(No Subject)"}
                      </div>
                      <div style={{ fontSize: 11, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {getPreview(latest?.body || "", 60)}
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {isUnread && (
                      <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#00ACC1", flexShrink: 0, marginTop: 5 }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT: Email viewer panel ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff" }}>
          {selectedThread ? (
            <>
              {/* Subject + action buttons */}
              <div style={{ padding: "16px 22px 12px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", margin: 0, flex: 1, marginRight: 16, lineHeight: 1.3 }}>
                  {selectedThread.latest?.subject || "(No Subject)"}
                </h2>
                <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <ShadButton variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                    <Reply size={15} />
                  </ShadButton>
                  <ShadButton variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 size={15} />
                  </ShadButton>
                  <ShadButton variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100" onClick={() => setSelectedThreadId(null)}>
                    <X size={15} />
                  </ShadButton>
                </div>
              </div>

              {/* Messages — scrollable area */}
              <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 16px" }}>
                {selectedThread.messages.map((email, idx) => (
                  <div key={email.messageId || idx}>
                    {/* From / To header */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 0 10px" }}>
                      <ShadAvatar className="h-9 w-9 shrink-0">
                        <AvatarFallback style={{ backgroundColor: getAvatarColor(email.from || ""), color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>
                          {getInitialsFromStr(email.from || "")}
                        </AvatarFallback>
                      </ShadAvatar>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{getName(email.from)}</span>
                            <span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>
                              to {Array.isArray(email.to) ? email.to.join(", ") : email.to}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: "#bbb", flexShrink: 0 }}>
                            {new Date(email.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator style={{ opacity: 0.5 }} />

                    {/* Email body */}
                    <div
                      style={{ padding: "14px 0 8px", fontSize: 14, color: "#333", lineHeight: 1.75 }}
                      dangerouslySetInnerHTML={{ __html: email.body }}
                    />

                    {/* Attachments */}
                    {email.attachments?.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#777", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                          <Paperclip size={12} /> Attachments
                        </p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {email.attachments.map((att, i) => (
                            <div
                              key={i}
                              onClick={() => openAttachment(att)}
                              style={{ border: "1px solid #eee", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: "#555", backgroundColor: "#fafafa" }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
                            >
                              {att.filename}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {idx < selectedThread.messages.length - 1 && (
                      <Separator style={{ margin: "8px 0", opacity: 0.3 }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Reply box */}
              {type === "inbox" && (
                <div style={{ borderTop: "1px solid #f0f0f0", padding: "12px 22px 14px", flexShrink: 0 }}>
                  <textarea
                    placeholder="Type your response.."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: 72,
                      border: "1px solid #eee",
                      borderRadius: 10,
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#333",
                      resize: "none",
                      outline: "none",
                      fontFamily: "inherit",
                      backgroundColor: "#fafafa",
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <ShadButton
                      size="sm"
                      className="h-8 px-4 text-xs rounded-lg gap-1.5"
                      style={{ backgroundColor: "#00ACC1", color: "#fff" }}
                      onClick={sendReply}
                    >
                      <SendIcon size={12} />
                      Send Reply
                    </ShadButton>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>✉</div>
              <p style={{ fontSize: 13, color: "#bbb" }}>Select an email to read</p>
            </div>
          )}
        </div>
      </div>

      {/* Attachment preview modal */}
      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "85%", height: "90%", backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{previewFile.filename}</span>
              <ShadButton variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPreviewFile(null)}>
                <X size={15} />
              </ShadButton>
            </div>
            <iframe
              src={previewFile.url}
              style={{ flex: 1, border: "none" }}
              title="Preview"
            />
          </div>
        </div>
      )}

      {/* Compose drawer */}
      <ComposeEmailDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      />
    </>
  );
};

export default EmailViewer;
