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

// const EmailViewer = () => {
//   const { data } = useParams();

//   const [threads, setThreads] = useState([]);
//   const [selectedThreadId, setSelectedThreadId] = useState(null);
//   const [replyText, setReplyText] = useState("");
//   const [previewFile, setPreviewFile] = useState(null);

//   useEffect(() => {
//     fetchEmailSyncedContactsAndEmails();
//   }, []);

//   // 🔹 Fetch Emails
//   const fetchEmailSyncedContactsAndEmails = async () => {
//     try {
//       const contactsRes = await axios.get(
//         `https://www.snptaxes.com/api/accounts/${data}/contacts`,
//       );

//       const syncedEmails = (contactsRes.data.data || [])
//         .filter((item) => item.canEmailSync && item.contact?.email)
//         .map((item) => item.contact.email);

//       if (!syncedEmails.length) return;

//       const emailsRes = await axios.post(
//         "http://127.0.0.1:8015/emailsync/messagesList/messages",
//         { emails: syncedEmails },
//       );

//       setThreads(emailsRes.data.threads || []);
//     } catch (error) {
//       console.error("Error fetching emails", error);
//     }
//   };

//   // 🔹 Extract only name
//   const getName = (from) => from?.replace(/<.*?>/g, "").trim();

//   // 🔹 Gmail-style thread title: "vinayak, me 2"
//   const formatThreadTitle = (thread) => {
//     const names = new Set();

//     thread.messages.forEach((msg) => {
//       const name = getName(msg.from);

//       if (name?.toLowerCase().includes("support@snptaxandfinancials.com")) {
//         names.add("me");
//       } else {
//         names.add(name?.split(" ")[0].toLowerCase());
//       }
//     });

//     // return `${[...names].join(", ")} ${thread.messages.length}`;
//     const count = thread.messages.length;

//     return count > 1
//       ? `${[...names].join(", ")} ${count}`
//       : `${[...names].join(", ")}`;
//   };

//   // 🔹 Preview text
//   const getPreview = (html, length = 80) => {
//     const text = html.replace(/<[^>]*>?/gm, "");
//     return text.length > length ? text.slice(0, length) + "..." : text;
//   };

//   // 🔹 Attachment Preview
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

//   const selectedThread = threads.find((t) => t._id === selectedThreadId);
//   const markThreadAsRead = async (threadId) => {
//     try {
//       await axios.patch(
//         "http://127.0.0.1:8015/emailsync/messagesList/threads/mark-read",
//         { threadId },
//       );

//       fetchEmailSyncedContactsAndEmails(); // refresh inbox UI
//     } catch (err) {
//       console.error("Mark read failed", err);
//     }
//   };
//   const [openDrawer, setOpenDrawer] = useState(false);
//   return (
//     <>
//       <Box
//         sx={{
//           height: "60px",
//           border: "1px solid #ddd",
//           borderRadius: 2,
//           mb: 3,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "flex-end", // 👈 move button to right
//           px: 2,
//         }}
//       >
//         <Button variant="contained" onClick={() => setOpenDrawer(true)}>
//           New Email
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           height: "90vh",
//           bgcolor: "#fff",
//           border: "1px solid #ddd",
//           borderRadius: 2,
//         }}
//       >
//         {/* LEFT: Inbox */}
//         <Box
//           sx={{
//             width: "35%",
//             borderRight: "1px solid #ddd",
//             overflowY: "auto",
//           }}
//         >
//           {/* <Typography variant="h6" sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
//           Inbox
//         </Typography> */}

//           <List>
//             {threads.map((thread) => {
//               const latest = thread.latest;

//               return (
//                 // <ListItemButton
//                 //   key={thread._id}
//                 //   onClick={() => setSelectedThreadId(thread._id)}
//                 //   sx={{
//                 //     borderBottom: "1px solid #eee",
//                 //     "&:hover": { bgcolor: "#f5f5f5" },
//                 //     bgcolor:
//                 //       selectedThreadId === thread._id ? "#f0f4ff" : "transparent",
//                 //   }}
//                 // >
//                 //   <Box>
//                 //     <Typography fontWeight={latest.read ? 400 : 700}>
//                 //       {formatThreadTitle(thread)}
//                 //     </Typography>

//                 //     <Typography fontWeight={latest.read ? 400 : 600}>
//                 //       {latest.subject || "(No Subject)"}
//                 //     </Typography>

//                 //     <Typography variant="caption" color="text.secondary">
//                 //       {getPreview(latest.body)}
//                 //     </Typography>
//                 //   </Box>
//                 // </ListItemButton>
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
//                     <Typography fontWeight={latest.read ? 400 : 700}>
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
//               {/* <Typography variant="h6" sx={{ mb: 2 }}>
//               {selectedThread.latest.subject}
//             </Typography> */}
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

//                   {/* Attachments */}
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

//               {/* Reply Box */}
//               <Box sx={{ mt: 3 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   placeholder="Reply..."
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                 />

//                 <Button variant="contained" sx={{ mt: 1 }} onClick={sendReply}>
//                   Send
//                 </Button>
//               </Box>
//             </>
//           ) : (
//             <Typography color="text.secondary">
//               Select an email to read
//             </Typography>
//           )}
//         </Box>

//         {/* Attachment Preview */}
//         {previewFile && (
//           <Box
//             onClick={() => setPreviewFile(null)}
//             sx={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               bgcolor: "rgba(0,0,0,0.7)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 9999,
//             }}
//           >
//             <Box
//               onClick={(e) => e.stopPropagation()}
//               sx={{
//                 width: "85%",
//                 height: "90%",
//                 bgcolor: "#fff",
//                 borderRadius: 2,
//                 overflow: "hidden",
//               }}
//             >
//               <Box
//                 sx={{
//                   p: 1,
//                   borderBottom: "1px solid #ddd",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Typography fontWeight="bold">
//                   {previewFile.filename}
//                 </Typography>
//                 <Button onClick={() => setPreviewFile(null)}>Close</Button>
//               </Box>

//               <Box sx={{ height: "100%" }}>
//                 {previewFile.mimeType.startsWith("image/") && (
//                   <img
//                     src={previewFile.url}
//                     alt=""
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "contain",
//                     }}
//                   />
//                 )}

//                 {previewFile.mimeType === "application/pdf" && (
//                   <iframe
//                     src={previewFile.url}
//                     style={{ width: "100%", height: "100%", border: "none" }}
//                     title="PDF"
//                   />
//                 )}

//                 {!previewFile.mimeType.startsWith("image/") &&
//                   previewFile.mimeType !== "application/pdf" && (
//                     <iframe
//                       src={previewFile.url}
//                       style={{ width: "100%", height: "100%", border: "none" }}
//                       title="File"
//                     />
//                   )}
//               </Box>
//             </Box>
//           </Box>
//         )}
//       </Box>

//       {/* Drawer */}
//       <Drawer
//         anchor="right"
//         open={openDrawer}
//         onClose={() => setOpenDrawer(false)}
//       >
//         <Box sx={{ width: 400, p: 3 }}>
//           {/* Header */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <Typography variant="h6">Compose Email</Typography>
//             <IconButton onClick={() => setOpenDrawer(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           {/* Content */}
//           <Typography variant="body2">Email draft form goes here…</Typography>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default EmailViewer;

import EmailViewer from "./EmailViewer";

const Inbox = () => {
  return <EmailViewer type="inbox" />;
};

export default Inbox;
