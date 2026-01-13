

// import React, { useContext, useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Collapse,
//   Typography,
//   IconButton,
//   Drawer,
//   Checkbox,
//   FormGroup,
//   FormControlLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
// } from "@mui/material";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import { LoginContext } from "../Sidebar/Context/Context";
// import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
// import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";

// import Divider from "@mui/material/Divider";
// import Tooltip from "@mui/material/Tooltip";
// import { toast } from "react-toastify";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import ImageIcon from "@mui/icons-material/Image";
// import DescriptionIcon from "@mui/icons-material/Description";
// import TableChartIcon from "@mui/icons-material/TableChart";
// import FolderZipIcon from "@mui/icons-material/FolderZip";
// const Inboxplus = () => {
//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const EMAIL_SYNC = process.env.REACT_APP_EMAILSYNC_API;
//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   const [tab, setTab] = useState("active"); // active | archived

//   const { logindata } = useContext(LoginContext);
//   const [loginuserid, setLoginUserId] = useState();
//   const [userdata, setuserdata] = useState();
//   const [emailSyncEmail, setEmailSyncEmail] = useState("");
//   const [loadingEmails, setLoadingEmails] = useState(false);
//   const [fetchError, setFetchError] = useState("");
//   const [emailList, setEmailList] = useState([]);
//   const [selectedEmail, setSelectedEmail] = useState(null);
//   const [userRole, setUserRole] = useState("");
//   const [accountIds, setAccountIds] = useState([]);
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
//   const [openPdf, setOpenPdf] = useState(false);
//   const [activeAttachment, setActiveAttachment] = useState(null);

//   const [checkedItems, setCheckedItems] = useState({
//     invoice: false,
//     proposal: false,
//     document: false,
//     documentSigned: false,
//     message: false,
//     organizer: false,
//   });

//   // Redirect to Google login if needed
//   const handleGoogleLogin = () => {
//     window.location.href = `${EMAIL_SYNC}/emailsync/auth/google`;
//   };

//   useEffect(() => {
//     if (logindata?.user?.id) setLoginUserId(logindata.user.id);
//   }, [logindata]);

//   useEffect(() => {
//     if (loginuserid) fetchUserData();
//   }, [loginuserid]);

//   const fetchUserData = async () => {
//     try {
//       const url = `${LOGIN_API}/common/user/${loginuserid}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setuserdata(data);
//       setEmailSyncEmail(data.emailSyncEmail);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const getEmailType = (subject) => {
//     if (!subject) return null;
//     const lower = subject.toLowerCase();
//     if (lower.includes("invoice")) return "invoice";
//     if (lower.includes("proposal")) return "proposal";
//     if (lower.includes("document signed")) return "documentSigned";
//     if (lower.includes("document")) return "document";
//     if (lower.includes("message")) return "message";
//     if (lower.includes("organizer")) return "organizer";
//     return null;
//   };

//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//     const role = localStorage.getItem("userRole");
//     console.log("User role from localStorage:", role);
//     console.log("Stored team member data:", storedData);
//     setUserRole(role);
//     if (role === "TeamMember") {
//       fetchTeamMemberAccounts(storedData?.teammember?.userid);
//       console.log("Fetching accounts for TeamMember with ID:", storedData?.teammember?.userid);
//     }
//   }, []);

//   const fetchTeamMemberAccounts = async (userId) => {
//     console.log("Fetching team member accounts for userId:", userId);
//     try {
//       const response = await axios.get(
//        `https://www.snptaxes.com/api/accounts/byTeam?userId=${userId}&active=true`
//       );
//       const ids = response.data.accountlist?.map((a) => a._id) || [];
//       setAccountIds(ids);
//       console.log("Fetched account IDs:", ids);
//     } catch (error) {
//       console.error("Error fetching team member accounts:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchEmails = async () => {
//       if (!emailSyncEmail) return;
//       setLoadingEmails(true);
//       setFetchError("");
//       try {
//         const res = await axios.get(
//           `${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}?type=${tab}`
//         );
//         let emails = res.data.emails || [];
// console.log("Fetched emails:", emails);
//         if (userRole === "TeamMember" && accountIds.length > 0) {
//           emails = emails.filter((email) =>
//             accountIds.some((id) => email.subject?.includes(id))
//           );
//         }

//         setEmailList(emails);
//       } catch (err) {
//         console.error("Error fetching emails", err);
//         if (err.response?.data?.error?.includes("Refresh token missing")) {
//           setFetchError("Your Gmail session expired. Please log in again.");
//         } else {
//           setFetchError("Failed to fetch emails. Please try again.");
//         }
//       } finally {
//         setLoadingEmails(false);
//       }
//     };

//     fetchEmails();
//   }, [userRole, accountIds, emailSyncEmail, tab]);

//   const toggleFilterDrawer = (open) => () => {
//     setFilterDrawerOpen(open);
//   };

//   const handleCheckboxChange = (e) => {
//     setCheckedItems({
//       ...checkedItems,
//       [e.target.name]: e.target.checked,
//     });
//   };

//   const handleClearAll = () => {
//     const cleared = Object.keys(checkedItems).reduce((acc, key) => {
//       acc[key] = false;
//       return acc;
//     }, {});
//     setCheckedItems(cleared);
//   };
//   const removeMongoIdFromSubject = (subject = "") => {
//     // Matches MongoDB ObjectId at the beginning followed by space
//     return subject.replace(/^[a-fA-F0-9]{24}\s*/, "");
//   };
//   const getCleanSubject = (subject = "") => {
//     let clean = subject.startsWith("#") ? subject.slice(1).trim() : subject;
//     clean = removeMongoIdFromSubject(clean);
//     return clean;
//   };

//   // const filteredEmails = emailList.filter((email) => {
//   //   if (!email.subject?.startsWith("#")) return false;

//   //   if (userRole === "TeamMember" && accountIds.length > 0) {
//   //     const hasAccountId = accountIds.some((id) => email.subject.includes(id));
//   //     if (!hasAccountId) return false;
//   //   }

//   //   const activeFilters = Object.values(checkedItems).some(Boolean);
//   //   if (activeFilters) {
//   //     const type = getEmailType(email.subject);
//   //     if (!type || !checkedItems[type]) return false;
//   //   }

//   //   return true;
//   // });

//   const filteredEmails = emailList.filter((email) => {
//   const subject = email.subject || "";

//   // Must start with #
//   if (!subject.startsWith("#")) return false;

//   // ✅ TeamMember account filter
//   if (userRole === "TeamMember" && accountIds.length > 0) {
//     const hasAccountId = accountIds.some(
//       (id) => subject.startsWith(`#${id}`)
//     );
//     if (!hasAccountId) return false;
//   }

//   // ✅ Type filters
//   const activeFilters = Object.values(checkedItems).some(Boolean);
//   if (activeFilters) {
//     const type = getEmailType(subject);
//     if (!type || !checkedItems[type]) return false;
//   }

//   return true;
// });

//   const handleArchiveToggle = async () => {
//     if (!selectedEmail) return;

//     const endpoint =
//       tab === "active"
//         ? `${EMAIL_SYNC}/emailsync/user/archive`
//         : `${EMAIL_SYNC}/emailsync/user/unarchive`;

//     await axios.post(endpoint, {
//       email: emailSyncEmail,
//       messageId: selectedEmail.id,
//     });

//     // Remove from current list instantly
//     setEmailList((prev) => prev.filter((e) => e.id !== selectedEmail.id));

//     setSelectedEmail(null);
//     toast.success(
//       tab === "active"
//         ? "Email archived successfully"
//         : "Email moved to Inbox successfully"
//     );
//   };

//   const getAttachmentType = (att) => {
//     const name = att?.filename?.toLowerCase() || "";
//     const mime = att?.mimeType || "";
  
//     if (mime.includes("pdf") || name.endsWith(".pdf")) return "pdf";
//     if (mime.includes("image") || /\.(jpg|jpeg|png|gif|webp)$/.test(name))
//       return "image";
//     if (mime.includes("word") || /\.(doc|docx)$/.test(name)) return "word";
//     if (mime.includes("excel") || /\.(xls|xlsx)$/.test(name)) return "excel";
//     if (mime.includes("zip") || /\.(zip|rar)$/.test(name)) return "zip";
  
//     return "file";
//   };
//   const getAttachmentIcon = (type) => {
//     switch (type) {
//       case "pdf":
//         return <PictureAsPdfIcon color="error" />;
//       case "image":
//         return <ImageIcon color="primary" />;
//       case "word":
//         return <DescriptionIcon color="info" />;
//       case "excel":
//         return <TableChartIcon color="success" />;
//       case "zip":
//         return <FolderZipIcon color="warning" />;
//       default:
//         return <DescriptionIcon />;
//     }
//   };
//   const handleAttachmentClick = (att) => {
//     const type = getAttachmentType(att);
  
//     const fileUrl = `${EMAIL_SYNC}/emailsync/user/attachment/${emailSyncEmail}/${selectedEmail.id}/${att.attachmentId}`;
  
//     // Preview only image & PDF
//     if (type === "image" || type === "pdf") {
//       setActiveAttachment(att);
//       setOpenPdf(true);
//       return;
//     }
  
//     // Excel / Word / others → download
//     downloadFile(fileUrl, att.filename);
//   };
  
//   const downloadFile = async (url, filename) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
  
//       const blobUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
  
//       link.href = blobUrl;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
  
//       link.remove();
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (err) {
//       console.error("Download failed", err);
//     }
//   };

//   return (
//     <>
//       {loadingEmails ? (
//         <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
//           <CircularProgress />
//           <Typography sx={{ ml: 2 }}>Fetching emails...</Typography>
//         </Box>
//       ) : fetchError ? (
//         <Box textAlign="center" mt={4}>
//           <Typography color="error">{fetchError}</Typography>
//           <Button variant="contained" onClick={handleGoogleLogin}>
//             Reconnect Gmail
//           </Button>
//         </Box>
//       ) : (
//         <>
//           <Box display="flex" gap={2} mb={2}>
//             <Button
//               variant={tab === "active" ? "contained" : "outlined"}
//               onClick={() => {
//                 setSelectedEmail(null);
//                 setTab("active");
//               }}
//             >
//               Active
//             </Button>

//             <Button
//               variant={tab === "archived" ? "contained" : "outlined"}
//               onClick={() => {
//                 setSelectedEmail(null);
//                 setTab("archived");
//               }}
//             >
//               Archived
//             </Button>
//           </Box>

//           <Box display="flex" height="80vh" mt={3}>
//             {/* Left side — Email Cards */}
//             <Box width="45%" borderRight="1px solid #ddd" overflow="auto" p={2}>
//               <Box display="flex" justifyContent="space-between" mb={2}>
//                 <Typography variant="h5">📨 Emails</Typography>
//                 <Button
//                   variant="contained"
//                   startIcon={<FilterListIcon />}
//                   onClick={toggleFilterDrawer(true)}
//                 >
//                   Filter
//                 </Button>
//               </Box>

//               {filteredEmails.length === 0 ? (
//                 <Typography textAlign="center" mt={3}>
//                   No emails found.
//                 </Typography>
//               ) : (
//                 filteredEmails.map((email, idx) => {
//                   const emailType = getEmailType(email.subject);
//                   const isSelected = selectedEmail === email;
//                   return (
//                     <Card
//                       key={idx}
//                       variant="outlined"
//                       sx={{
//                         mb: 2,
//                         cursor: "pointer",
//                         backgroundColor: isSelected ? "#f1f8e9" : "white",
//                         transition: "0.2s",
//                         "&:hover": { boxShadow: 4 },
//                       }}
//                       onClick={() => setSelectedEmail(email)}
//                     >
//                       <CardContent>
//                         {/* <Typography variant="subtitle1" fontWeight="bold">
//                         {email.subject?.slice(1).trim() || "(No Subject)"}
//                       </Typography> */}
//                         <Typography variant="subtitle1" fontWeight="bold">
//                           {getCleanSubject(email.subject) || "(No Subject)"}
//                         </Typography>

//                         {/* <Typography
//                         variant="body2"
//                         color="textSecondary"
//                         sx={{ mt: 0.5 }}
//                       >
//                         From: {email.from || "Unknown"}
//                       </Typography> */}
//                       </CardContent>
//                     </Card>
//                   );
//                 })
//               )}
//             </Box>

//             {/* Right side — Email Viewer */}

//             <Box width="55%" p={0} overflow="auto">
//               {selectedEmail ? (
//                 <Card variant="outlined" sx={{ height: "100%" }}>
//                   {/* HEADER */}
//                   <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     px={3}
//                     py={2}
//                     sx={{ backgroundColor: "#f9fafb" }}
//                   >
//                     <Box>
//                       {/* <Typography variant="h6">
//             {selectedEmail.subject?.slice(1).trim()}
//           </Typography> */}
//                       <Typography variant="h6">
//                         {getCleanSubject(selectedEmail.subject)}
//                       </Typography>

//                       {/* <Typography variant="body2" color="text.secondary">
//             From: {selectedEmail.from}
//           </Typography> */}
//                     </Box>

//                     <Tooltip
//                       title={tab === "active" ? "Archive" : "Move to Inbox"}
//                     >
//                       <IconButton onClick={handleArchiveToggle}>
//                         {tab === "active" ? (
//                           <ArchiveOutlinedIcon />
//                         ) : (
//                           <UnarchiveOutlinedIcon />
//                         )}
//                       </IconButton>
//                     </Tooltip>
                    
//                   </Box>

//                   <Divider />

//                   {/* BODY */}
//                   <CardContent>
//                     <Box
//                       sx={{
//                         whiteSpace: "pre-wrap",
//                         lineHeight: 1.7,
//                       }}
//                       dangerouslySetInnerHTML={{
//                         __html:
//                           typeof selectedEmail.body === "string"
//                             ? selectedEmail.body
//                             : "No content available",
//                       }}
//                     />
//                     {/* ATTACHMENTS */}
//                     {/* {selectedEmail.attachments?.length > 0 && (
//                       <>
//                         <Divider sx={{ my: 3 }} />

//                         <Typography
//                           variant="subtitle2"
//                           color="text.secondary"
//                           mb={1}
//                         >
//                           {selectedEmail.attachments.length} attachment ·
//                           Scanned by Gmail
//                         </Typography>

//                         <Box display="flex" gap={2} flexWrap="wrap">
//                           {selectedEmail.attachments.map((att, i) => (
//                             <Card
//                               key={i}
//                               sx={{
//                                 width: 160,
//                                 cursor: "pointer",
//                                 border: "1px solid #e0e0e0",
//                               }}
//                               onClick={() => {
//                                 setActiveAttachment(att);
//                                 setOpenPdf(true);
//                               }}
//                             >
//                               <CardContent>
//                                 <Typography variant="body2" noWrap>
//                                   📄 {att.filename}
//                                 </Typography>
//                                 <Typography
//                                   variant="caption"
//                                   color="text.secondary"
//                                 >
//                                   PDF
//                                 </Typography>
//                               </CardContent>
//                             </Card>
//                           ))}
//                         </Box>
//                       </>
//                     )} */}
//                      {selectedEmail.attachments?.length > 0 && (
//                       <>
//                         <Divider sx={{ my: 3 }} />

//                         <Typography
//                           variant="subtitle2"
//                           color="text.secondary"
//                           mb={1}
//                         >
//                           {selectedEmail.attachments.length} attachment ·
//                           Scanned by Gmail
//                         </Typography>

//                   <Box display="flex" gap={2} flexWrap="wrap">
//   {selectedEmail.attachments.map((att, i) => {
//     const type = getAttachmentType(att);
//     const isImage = type === "image";

//     const previewUrl = isImage
//       ? `${EMAIL_SYNC}/emailsync/user/attachment/${emailSyncEmail}/${selectedEmail.id}/${att.attachmentId}`
//       : null;

//     return (
//       <Card
//         key={i}
//         sx={{
//           width: 160,
//           cursor: "pointer",
//           border: "1px solid #e0e0e0",
//           overflow: "hidden",
//         }}
//         // onClick={() => {
//         //   setActiveAttachment(att);
//         //   setOpenPdf(true);
//         // }}
//          onClick={() => handleAttachmentClick(att)}
//       >
//         {/* IMAGE PREVIEW */}
//         {isImage ? (
//           <Box
//             sx={{
//               height: 110,
//               backgroundColor: "#f5f5f5",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <img
//               src={previewUrl}
//               alt={att.filename}
//               style={{
//                 maxWidth: "100%",
//                 maxHeight: "100%",
//                 objectFit: "cover",
//               }}
//             />
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               height: 110,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backgroundColor: "#fafafa",
//             }}
//           >
//             {getAttachmentIcon(type)}
//           </Box>
//         )}

//         {/* FOOTER */}
//         <CardContent sx={{ p: 1.5 }}>
//           <Typography variant="body2" noWrap>
//             {att.filename}
//           </Typography>

//           <Typography
//             variant="caption"
//             color="text.secondary"
//             sx={{ textTransform: "uppercase" }}
//           >
//             {type}
//           </Typography>
//         </CardContent>
//       </Card>
//     );
//   })}
// </Box>


//                       </>
//                     )}
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Box
//                   height="100%"
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="center"
//                 >
//                   <Typography color="text.secondary">
//                     Select an email to read
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </>
//       )}
//       <Dialog
//         open={openPdf}
//         onClose={() => setOpenPdf(false)}
//         fullWidth
//         maxWidth="lg"
//       >
//         <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//           {activeAttachment?.filename}
//           <IconButton onClick={() => setOpenPdf(false)}>✕</IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ height: "80vh", p: 0 }}>
//           {activeAttachment && (
//             <iframe
//               src={`${EMAIL_SYNC}/emailsync/user/attachment/${emailSyncEmail}/${selectedEmail.id}/${activeAttachment.attachmentId}`}
//               title="PDF Viewer"
//               width="100%"
//               height="100%"
//               style={{ border: "none" }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Drawer — Filters */}
//       <Drawer
//         anchor="right"
//         open={filterDrawerOpen}
//         onClose={toggleFilterDrawer(false)}
//       >
//         <Box sx={{ width: 400, p: 3 }}>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="h6">Filters</Typography>
//             <IconButton onClick={toggleFilterDrawer(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <FormGroup>
//             {Object.keys(checkedItems).map((key) => (
//               <FormControlLabel
//                 key={key}
//                 control={
//                   <Checkbox
//                     checked={checkedItems[key]}
//                     onChange={handleCheckboxChange}
//                     name={key}
//                   />
//                 }
//                 label={key.charAt(0).toUpperCase() + key.slice(1)}
//               />
//             ))}
//           </FormGroup>

//           <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
//             <Button variant="contained" onClick={toggleFilterDrawer(false)}>
//               Apply
//             </Button>
//             <Button variant="outlined" onClick={handleClearAll}>
//               Clear
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default Inboxplus;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore, AttachFile } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";

// const EmailViewer = () => {
//   const [emails, setEmails] = useState([]);
//   const [expandedEmailId, setExpandedEmailId] = useState(null);

//   useEffect(() => {
//     fetchEmails();
//   }, []);

//   const fetchEmails = async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8015/emailsync/messagesList/messages"
//       );
//       setEmails(response.data.emails || []);
//       console.log("Fetched emails:", response.data.emails);
//     } catch (err) {
//       console.error("Error fetching emails:", err);
//     }
//   };

//   const handleExpand = (id) => {
//     setExpandedEmailId(expandedEmailId === id ? null : id);
//   };

//   return (
//     <Box sx={{ maxWidth: 900, margin: "20px auto", bgcolor: "#f9f9f9", p: 2, borderRadius: 2 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Email Inbox
//       </Typography>
//       <List>
//         {emails.map((email) => (
//           <React.Fragment key={email.messageId}>
//             <ListItemButton onClick={() => handleExpand(email.messageId)}>
//               <ListItemText
//                 primary={
//                   <Typography
//                     variant="subtitle1"
//                     sx={{ fontWeight: email.read ? "normal" : "bold" }}
//                   >
//                     {email.subject || "(No Subject)"}
//                   </Typography>
//                 }
//                 secondary={
//                   <>
//                     <Typography variant="body2">
//                       From: {email.from}
//                     </Typography>
//                     {email.accountEmailList?.map((ae, idx) => (
//                       <Chip
//                         key={idx}
//                         label={`${ae.accountName} (${ae.email})`}
//                         size="small"
//                         sx={{ mr: 1, mt: 0.5 }}
//                       />
//                     ))}
//                   </>
//                 }
//               />
//               {expandedEmailId === email.messageId ? <ExpandLess /> : <ExpandMore />}
//             </ListItemButton>
//             <Collapse in={expandedEmailId === email.messageId} timeout="auto" unmountOnExit>
//               <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 1, mb: 1 }}>
//                 <Typography
//                   variant="body2"
//                   sx={{ mb: 1 }}
//                   dangerouslySetInnerHTML={{ __html: email.body }}
//                 />
//                 {email.attachments?.length > 0 && (
//                   <Box sx={{ mt: 1 }}>
//                     {email.attachments.map((att, idx) => (
//                       <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
//                         <AttachFile fontSize="small" sx={{ mr: 0.5 }} />
//                         <Typography variant="body2">{att.filename}</Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 )}
//               </Box>
//             </Collapse>
//             <Divider />
//           </React.Fragment>
//         ))}
//       </List>
//     </Box>
//   );
// };
const EmailViewer = () => {
  const [threads, setThreads] = useState([]);
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
const [replyBox, setReplyBox] = useState(null);
const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8015/emailsync/messagesList/messages"
      );
      setThreads(response.data.threads || []);
    } catch (err) {
      console.error("Error fetching emails:", err);
    }
  };

  const handleExpandThread = (threadId) => {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
    setExpandedMessageId(null); // reset message expansion
  };

  const handleExpandMessage = (messageId) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  const getPreview = (html, length = 120) => {
    const text = html.replace(/<[^>]*>?/gm, "");
    return text.length > length ? text.slice(0, length) + "..." : text;
  };
const extractEmail = (from) => {
  const match = from.match(/<(.+?)>/);
  return match ? match[1] : from;
};

  return (
    <Box sx={{ maxWidth: 900, margin: "20px auto", bgcolor: "#f9f9f9", p: 2, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Email Inbox
      </Typography>

      <List>
        {threads.map((thread) => {
          const latest = thread.latest;

          return (
            <React.Fragment key={thread._id}>
              {/* Thread Header */}
              <ListItemButton onClick={() => handleExpandThread(thread._id)}>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: latest.read ? "normal" : "bold" }}
                    >
                      {latest.subject || "(No Subject)"}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">
                        From: {latest.from}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(latest.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                {expandedThreadId === thread._id ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              {/* Thread Messages */}
              <Collapse in={expandedThreadId === thread._id} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 1, mb: 1 }}>
                  {thread.messages.map((email) => {
                    const isExpanded = expandedMessageId === email.messageId;

                    return (
                      <Box
                        key={email.messageId}
                        sx={{
                          mb: 2,
                          p: 1.5,
                          border: "1px solid #eee",
                          borderRadius: 1,
                          cursor: "pointer"
                        }}
                        onClick={() => handleExpandMessage(email.messageId)}
                      >
                        <Typography variant="subtitle2">
                          {email.from}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {new Date(email.createdAt).toLocaleString()}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ mt: 1 }}
                          dangerouslySetInnerHTML={{
                            __html: isExpanded
                              ? email.body
                              : getPreview(email.body)
                          }}
                        />

                        {email.attachments?.length > 0 && isExpanded && (
                          <Box sx={{ mt: 1 }}>
                            {email.attachments.map((att, idx) => (
                              <Box
                                key={idx}
                                sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                              >
                                <AttachFile fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="body2">{att.filename}</Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {/* <Typography
                          variant="caption"
                          color="primary"
                          sx={{ display: "block", mt: 1 }}
                        >
                          {isExpanded ? "Click to collapse" : "Click to expand"}
                        </Typography> */}
                        <Typography
  variant="caption"
  color="primary"
  sx={{ display: "block", mt: 1 }}
>
  {isExpanded ? "Click to collapse" : "Click to expand"}
</Typography>

{/* REPLY SECTION */}
{isExpanded && (
  <Box sx={{ mt: 2 }}>
    <Button
      size="small"
      variant="outlined"
      onClick={(e) => {
        e.stopPropagation();
        setReplyBox(email.messageId);
      }}
    >
      Reply
    </Button>

    {replyBox === email.messageId && (
      <Box sx={{ mt: 1 }}>
       <TextField
  fullWidth
  multiline
  rows={3}
  placeholder="Type your reply..."
  value={replyText}
  onChange={(e) => setReplyText(e.target.value)}
  onClick={(e) => e.stopPropagation()}   // 👈 IMPORTANT
/>


       <Button
  variant="contained"
  size="small"
  sx={{ mt: 1 }}
  onClick={async (e) => {
    e.stopPropagation();  // 👈 IMPORTANT

    try {
      await axios.post("http://127.0.0.1:8015/emailsync/user/reply", {
       to: extractEmail(email.from),

        subject: email.subject || "No Subject",
        message: replyText
      });

      setReplyText("");
      setReplyBox(null);
      alert("Reply Sent Successfully!");
    } catch (err) {
      console.error("Reply failed", err);
      alert("Failed to send reply");
    }
  }}
>
  Send Reply
</Button>

      </Box>
    )}
  </Box>
)}

                      </Box>
                    );
                  })}
                </Box>
              </Collapse>

              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};


export default EmailViewer;



