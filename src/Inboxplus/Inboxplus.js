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

// const [checkedItems, setCheckedItems] = useState({
//   invoice: false,
//   proposal: false,
//   document: false,
//   documentSigned: false,
//   message: false,
//   organizer: false,
// });

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
import { Avatar as ShadAvatar, AvatarFallback } from "../components/ui/avatar";
import { Button as ShadButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import {
  Search, SlidersHorizontal, Archive, ArchiveRestore,
  ChevronDown, ChevronUp, Paperclip, X, Mail, CheckCheck,
} from "lucide-react";

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
const hasMongoIdTag = (subject = "") => {
  return /#([a-f0-9]{24})#/i.test(subject);
};

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
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// const EmailViewer = () => {
//   const [threads, setThreads] = useState([]);
//   const [expandedThreadId, setExpandedThreadId] = useState(null);
//   const [expandedMessageId, setExpandedMessageId] = useState(null);
//   const [replyBox, setReplyBox] = useState(null);
//   const [replyText, setReplyText] = useState("");

//   useEffect(() => {
//     fetchEmails();
//   }, []);

//   const fetchEmails = async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8015/emailsync/messagesList/messagesnotification"
//       );
//       setThreads(response.data.threads || []);
//     } catch (err) {
//       console.error("Error fetching emails:", err);
//     }
//   };

//   const handleExpandThread = (threadId) => {
//     setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
//     setExpandedMessageId(null); // reset message expansion
//   };

//   const handleExpandMessage = (messageId) => {
//     setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
//   };

//   const getPreview = (html, length = 120) => {
//     const text = html.replace(/<[^>]*>?/gm, "");
//     return text.length > length ? text.slice(0, length) + "..." : text;
//   };
//   const extractEmail = (from) => {
//     const match = from.match(/<(.+?)>/);
//     return match ? match[1] : from;
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 900,
//         margin: "20px auto",
//         bgcolor: "#f9f9f9",
//         p: 2,
//         borderRadius: 2,
//       }}
//     >
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Email Inbox
//       </Typography>

//       <List>
//         {threads.map((thread) => {
//           const latest = thread.latest;

//           return (
//             <React.Fragment key={thread._id}>
//               {/* Thread Header */}
//               <ListItemButton onClick={() => handleExpandThread(thread._id)}>
//                 <ListItemText
//                   primary={
//                     <Typography
//                       variant="subtitle1"
//                       sx={{ fontWeight: latest.read ? "normal" : "bold" }}
//                     >
//                       {latest.subject || "(No Subject)"}
//                     </Typography>
//                   }
//                   secondary={
//                     <>
//                       <Typography variant="body2">
//                         From: {latest.from}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {new Date(latest.createdAt).toLocaleString()}
//                       </Typography>
//                     </>
//                   }
//                 />
//                 {expandedThreadId === thread._id ? (
//                   <ExpandLess />
//                 ) : (
//                   <ExpandMore />
//                 )}
//               </ListItemButton>

//               {/* Thread Messages */}
//               <Collapse
//                 in={expandedThreadId === thread._id}
//                 timeout="auto"
//                 unmountOnExit
//               >
//                 <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 1, mb: 1 }}>
//                   {thread.messages.map((email) => {
//                     const isExpanded = expandedMessageId === email.messageId;

//                     return (
//                       <Box
//                         key={email.messageId}
//                         sx={{
//                           mb: 2,
//                           p: 1.5,
//                           border: "1px solid #eee",
//                           borderRadius: 1,
//                           cursor: "pointer",
//                         }}
//                         onClick={() => handleExpandMessage(email.messageId)}
//                       >
//                         <Typography variant="subtitle2">
//                           {email.from}
//                         </Typography>

//                         <Typography variant="caption" color="text.secondary">
//                           {new Date(email.createdAt).toLocaleString()}
//                         </Typography>

//                         <Typography
//                           variant="body2"
//                           sx={{ mt: 1 }}
//                           dangerouslySetInnerHTML={{
//                             __html: isExpanded
//                               ? email.body
//                               : getPreview(email.body),
//                           }}
//                         />

//                         {email.attachments?.length > 0 && isExpanded && (
//                           <Box sx={{ mt: 1 }}>
//                             {email.attachments.map((att, idx) => (
//                               <Box
//                                 key={idx}
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   mb: 0.5,
//                                 }}
//                               >
//                                 <AttachFile fontSize="small" sx={{ mr: 0.5 }} />
//                                 <Typography variant="body2">
//                                   {att.filename}
//                                 </Typography>
//                               </Box>
//                             ))}
//                           </Box>
//                         )}

//                         {/* <Typography
//                           variant="caption"
//                           color="primary"
//                           sx={{ display: "block", mt: 1 }}
//                         >
//                           {isExpanded ? "Click to collapse" : "Click to expand"}
//                         </Typography> */}
//                         <Typography
//                           variant="caption"
//                           color="primary"
//                           sx={{ display: "block", mt: 1 }}
//                         >
//                           {isExpanded ? "Click to collapse" : "Click to expand"}
//                         </Typography>

//                         {/* REPLY SECTION */}
//                         {isExpanded && (
//                           <Box sx={{ mt: 2 }}>
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setReplyBox(email.messageId);
//                               }}
//                             >
//                               Reply
//                             </Button>

//                             {replyBox === email.messageId && (
//                               <Box sx={{ mt: 1 }}>
//                                 <TextField
//                                   fullWidth
//                                   multiline
//                                   rows={3}
//                                   placeholder="Type your reply..."
//                                   value={replyText}
//                                   onChange={(e) => setReplyText(e.target.value)}
//                                   onClick={(e) => e.stopPropagation()} // 👈 IMPORTANT
//                                 />

//                                 <Button
//                                   variant="contained"
//                                   size="small"
//                                   sx={{ mt: 1 }}
//                                   onClick={async (e) => {
//                                     e.stopPropagation(); // 👈 IMPORTANT

//                                     try {
//                                       await axios.post(
//                                         "http://127.0.0.1:8015/emailsync/user/reply",
//                                         {
//                                           to: extractEmail(email.from),

//                                           subject:
//                                             email.subject || "No Subject",
//                                           message: replyText,
//                                         }
//                                       );

//                                       setReplyText("");
//                                       setReplyBox(null);
//                                       alert("Reply Sent Successfully!");
//                                     } catch (err) {
//                                       console.error("Reply failed", err);
//                                       alert("Failed to send reply");
//                                     }
//                                   }}
//                                 >
//                                   Send Reply
//                                 </Button>
//                               </Box>
//                             )}
//                           </Box>
//                         )}
//                       </Box>
//                     );
//                   })}
//                 </Box>
//               </Collapse>

//               <Divider />
//             </React.Fragment>
//           );
//         })}
//       </List>
//     </Box>
//   );
// };

// const EmailViewer = () => {
//   const [threads, setThreads] = useState([]);
//   const [expandedThreadId, setExpandedThreadId] = useState(null);
//   const [expandedMessageId, setExpandedMessageId] = useState(null);
//   const [replyBox, setReplyBox] = useState(null);
//   const [replyText, setReplyText] = useState("");

//   useEffect(() => {
//     fetchEmails();
//   }, []);

//   const fetchEmails = async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8015/emailsync/messagesList/messagesnotification"
//       );
//       setThreads(response.data.threads || []);
//     } catch (err) {
//       console.error("Error fetching emails:", err);
//     }
//   };

//   const handleExpandThread = (threadId) => {
//     setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
//     setExpandedMessageId(null);
//   };

//   const handleExpandMessage = (messageId) => {
//     setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
//   };

//   const getPreview = (html, length = 120) => {
//     const text = html.replace(/<[^>]*>?/gm, "");
//     return text.length > length ? text.slice(0, length) + "..." : text;
//   };

//   const extractEmail = (from) => {
//     const match = from.match(/<(.+?)>/);
//     return match ? match[1] : from;
//   };

//   // ✅ Detect MongoDB ID tag in subject
//   const hasMongoIdTag = (subject = "") => {
//     return subject.startsWith("#") && /#[a-f0-9]{24}#/i.test(subject);
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 900,
//         margin: "20px auto",
//         bgcolor: "#f9f9f9",
//         p: 2,
//         borderRadius: 2,
//       }}
//     >
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Email Inbox
//       </Typography>

//       <List>
//         {threads.map((thread) => {
//           const latest = thread.latest;

//           return (
//             <React.Fragment key={thread._id}>
//               {/* Thread Header */}
//               <ListItemButton onClick={() => handleExpandThread(thread._id)}>
//                 <ListItemText
//                   primary={
//                     <Typography
//                       variant="subtitle1"
//                       sx={{ fontWeight: latest.read ? "normal" : "bold" }}
//                     >
//                       {latest.subject || "(No Subject)"}
//                     </Typography>
//                   }
//                   secondary={
//                     <>
//                       <Typography variant="body2">
//                         From: {latest.from}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {new Date(latest.createdAt).toLocaleString()}
//                       </Typography>
//                     </>
//                   }
//                 />
//                 {expandedThreadId === thread._id ? (
//                   <ExpandLess />
//                 ) : (
//                   <ExpandMore />
//                 )}
//               </ListItemButton>

//               {/* Thread Messages */}
//               <Collapse
//                 in={expandedThreadId === thread._id}
//                 timeout="auto"
//                 unmountOnExit
//               >
//                 <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 1, mb: 1 }}>
//                   {[...thread.messages]
//                     .sort((a, b) => {
//                       const aTagged = hasMongoIdTag(a.subject);
//                       const bTagged = hasMongoIdTag(b.subject);

//                       if (aTagged && !bTagged) return -1;
//                       if (!aTagged && bTagged) return 1;
//                       return 0;
//                     })
//                     .map((email) => {
//                       const isExpanded =
//                         expandedMessageId === email.messageId;

//                       return (
//                         <Box
//                           key={email.messageId}
//                           sx={{
//                             mb: 2,
//                             p: 1.5,
//                             border: "1px solid #eee",
//                             borderRadius: 1,
//                             cursor: "pointer",
//                           }}
//                           onClick={() =>
//                             handleExpandMessage(email.messageId)
//                           }
//                         >
//                           {/* 🔴 Highlight ONLY the subject */}
//                           {email.subject && (
//                             <Typography
//                               variant="subtitle2"
//                               sx={{
//                                 fontWeight: "bold",
//                                 color: hasMongoIdTag(email.subject)
//                                   ? "#D32F2F"
//                                   : "inherit",
//                                 backgroundColor: hasMongoIdTag(email.subject)
//                                   ? "#FFEBEE"
//                                   : "transparent",
//                                 px: hasMongoIdTag(email.subject) ? 1 : 0,
//                                 borderRadius: 1,
//                                 display: "inline-block",
//                               }}
//                             >
//                               {email.subject}
//                             </Typography>
//                           )}

//                           <Typography variant="body2" sx={{ mt: 0.5 }}>
//                             From: {email.from}
//                           </Typography>

//                           <Typography
//                             variant="caption"
//                             color="text.secondary"
//                           >
//                             {new Date(email.createdAt).toLocaleString()}
//                           </Typography>

//                           <Typography
//                             variant="body2"
//                             sx={{ mt: 1 }}
//                             dangerouslySetInnerHTML={{
//                               __html: isExpanded
//                                 ? email.body
//                                 : getPreview(email.body),
//                             }}
//                           />

//                           {email.attachments?.length > 0 &&
//                             isExpanded && (
//                               <Box sx={{ mt: 1 }}>
//                                 {email.attachments.map((att, idx) => (
//                                   <Box
//                                     key={idx}
//                                     sx={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                       mb: 0.5,
//                                     }}
//                                   >
//                                     <AttachFile
//                                       fontSize="small"
//                                       sx={{ mr: 0.5 }}
//                                     />
//                                     <Typography variant="body2">
//                                       {att.filename}
//                                     </Typography>
//                                   </Box>
//                                 ))}
//                               </Box>
//                             )}

//                           <Typography
//                             variant="caption"
//                             color="primary"
//                             sx={{ display: "block", mt: 1 }}
//                           >
//                             {isExpanded
//                               ? "Click to collapse"
//                               : "Click to expand"}
//                           </Typography>

//                           {/* REPLY SECTION */}
//                           {isExpanded && (
//                             <Box sx={{ mt: 2 }}>
//                               <Button
//                                 size="small"
//                                 variant="outlined"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setReplyBox(email.messageId);
//                                 }}
//                               >
//                                 Reply
//                               </Button>

//                               {replyBox === email.messageId && (
//                                 <Box sx={{ mt: 1 }}>
//                                   <TextField
//                                     fullWidth
//                                     multiline
//                                     rows={3}
//                                     placeholder="Type your reply..."
//                                     value={replyText}
//                                     onChange={(e) =>
//                                       setReplyText(e.target.value)
//                                     }
//                                     onClick={(e) =>
//                                       e.stopPropagation()
//                                     }
//                                   />

//                                   <Button
//                                     variant="contained"
//                                     size="small"
//                                     sx={{ mt: 1 }}
//                                     onClick={async (e) => {
//                                       e.stopPropagation();

//                                       try {
//                                         await axios.post(
//                                           "http://127.0.0.1:8015/emailsync/user/reply",
//                                           {
//                                             to: extractEmail(
//                                               email.from
//                                             ),
//                                             subject:
//                                               email.subject ||
//                                               "No Subject",
//                                             message: replyText,
//                                           }
//                                         );

//                                         setReplyText("");
//                                         setReplyBox(null);
//                                         alert(
//                                           "Reply Sent Successfully!"
//                                         );
//                                       } catch (err) {
//                                         console.error(
//                                           "Reply failed",
//                                           err
//                                         );
//                                         alert(
//                                           "Failed to send reply"
//                                         );
//                                       }
//                                     }}
//                                   >
//                                     Send Reply
//                                   </Button>
//                                 </Box>
//                               )}
//                             </Box>
//                           )}
//                         </Box>
//                       );
//                     })}
//                 </Box>
//               </Collapse>

//               <Divider />
//             </React.Fragment>
//           );
//         })}
//       </List>
//     </Box>
//   );
// };

const EmailViewer = () => {
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [tab, setTab] = useState(0); // 0 = Inbox, 1 = Archived
  const [previewFile, setPreviewFile] = useState(null);
  const [checkedItems, setCheckedItems] = useState({
    invoice: false,
    proposal: false,
    document: false,
    documentSigned: false,
    message: false,
    organizer: false,
  });
 /* ================= FILTER CONFIG ================= */

  const FILTER_KEYWORDS = {
    invoice: ["invoice"],
    proposal: ["proposal"],
    document: ["document"],
    documentSigned: ["signed", "document signed"],
    message: ["message"],
    organizer: ["organizer"],
  };

  const matchesSelectedFilters = (subject = "") => {
    const activeFilters = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );

    if (activeFilters.length === 0) return true;

    const lowerSubject = subject.toLowerCase();

    return activeFilters.some((filterKey) =>
      FILTER_KEYWORDS[filterKey]?.some((keyword) =>
        lowerSubject.includes(keyword)
      )
    );
  };
  const toggleFilterDrawer = (open) => () => {
    setFilterDrawerOpen(open);
  };

  const handleCheckboxChange = (e) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.name]: e.target.checked,
    });
  };
  const handleClearAll = () => {
    const cleared = Object.keys(checkedItems).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setCheckedItems(cleared);
    setFilterDrawerOpen(false);
  };
  // const openAttachment = (attachment) => {
  //   const byteCharacters = atob(attachment.data);
  //   const byteNumbers = new Array(byteCharacters.length);

  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }

  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: attachment.mimeType });

  //   const url = URL.createObjectURL(blob);

  //   setPreviewFile({
  //     ...attachment,
  //     url
  //   });
  // };
  const openAttachment = (attachment) => {
    const byteCharacters = atob(attachment.data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: attachment.mimeType });

    const url = URL.createObjectURL(blob);

    setPreviewFile({
      ...attachment,
      url,
    });
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(
        "https://www.snptaxes.com/emailsync/messagesList/messagesnotification",
      );
      setThreads(response.data.threads || []);
      console.log("Fetched threads:", response.data.threads);
    } catch (err) {
      console.error("Error fetching emails:", err);
    }
  };

  const handleExpandThread = (threadId) => {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
    setExpandedMessageId(null);
  };

  const handleExpandMessage = (messageId) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  // const getPreview = (html, length = 120) => {
  //   const text = html.replace(/<[^>]*>?/gm, "");
  //   return text.length > length ? text.slice(0, length) + "..." : text;
  // };

  const getPreview = (html) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  const extractEmail = (from) => {
    const match = from.match(/<(.+?)>/);
    return match ? match[1] : from;
  };

  // const hasMongoIdTag = (subject = "") => {
  //   return subject.startsWith("#") && /#[a-f0-9]{24}#/i.test(subject);
  // };
const hasMongoIdTag = (subject = "") => {
  return /#[a-f0-9]{24}\b/i.test(subject);
};
  // const extractMongoId = (subject = "") => {
  //   const match = subject.match(/#([a-f0-9]{24})/i);
  //   return match ? match[1] : null;
  // };
const extractMongoId = (subject = "") => {
  const match = subject.match(/#([a-f0-9]{24})\b/i);
  return match ? match[1] : null;
};

  // const cleanSubjectText = (subject = "") => {
  //   return subject.replace(/#[a-f0-9]{24} /i, "").trim();
  // };
const cleanSubjectText = (subject = "") => {
  return subject.replace(/#[a-f0-9]{24}\b/i, "").trim();
};

  const buildAccountLink = (mongoId) => {
    return `/clients/accounts/accountsdash/overview/${mongoId}`;
  };
  const markThreadAsRead = async (threadId) => {
    try {
      await axios.patch(
        "https://www.snptaxes.com/emailsync/messagesList/threads/mark-read",
        {
          threadId,
        },
      );
      fetchEmails(); // refresh UI
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  const archiveThread = async (threadId, archived) => {
    try {
      await axios.patch(
        "https://www.snptaxes.com/emailsync/messagesList/threads/archive",
        {
          threadId,
          archived,
        },
      );
      fetchEmails(); // refresh UI
    } catch (err) {
      console.error("Archive failed", err);
    }
  };

  // const filteredThreads = threads.filter((thread) => {
  //   const isArchived = thread.latest?.archived;
  //   return tab === 0 ? !isArchived : isArchived;
  // });

  const filteredThreads = threads
    .filter((thread) => {
      const isArchived = thread.latest?.archived;
      return tab === 0 ? !isArchived : isArchived;
    })
    .filter((thread) => {
      if (matchesSelectedFilters(thread.latest?.subject)) return true;
      return thread.messages?.some((msg) => matchesSelectedFilters(msg.subject));
    })
    .filter((thread) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const latest = thread.latest;
      if (latest?.from?.toLowerCase().includes(q)) return true;
      if (cleanSubjectText(latest?.subject || "").toLowerCase().includes(q)) return true;
      if (getPreview(latest?.body || "").toLowerCase().includes(q)) return true;
      return thread.messages?.some(
        (msg) =>
          msg.from?.toLowerCase().includes(q) ||
          cleanSubjectText(msg.subject || "").toLowerCase().includes(q) ||
          getPreview(msg.body || "").toLowerCase().includes(q)
      );
    });
  const renderLinkedSubject = (subject, isBold = false) => {
    const mongoId = extractMongoId(subject);
    const text = cleanSubjectText(subject) || "linktext";

    if (!mongoId) return subject || "(No Subject)";

    return (
      <a
        href={buildAccountLink(mongoId)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#2f3fd3",
          fontWeight: isBold ? "bold" : "normal",
          textDecoration: "none",
        }}
      >
        {text}
      </a>
    );
  };

  const selectedThread = threads.find((t) => t._id === expandedThreadId);

  return (
    <>
      <div style={{ display: "flex", height: "100%", overflow: "hidden", backgroundColor: "#fff" }}>

        {/* ── LEFT: Thread list panel ── */}
        <div style={{ width: 340, minWidth: 340, display: "flex", flexDirection: "column", borderRight: "1px solid #f0f0f0", height: "100%", overflow: "hidden" }}>

          {/* Search + tabs + filter header */}
          <div style={{ padding: "12px 12px 10px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none" }} />
              <Input
                placeholder="Search emails"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 30, height: 32, fontSize: 12, borderRadius: 8, border: "1px solid #eee", backgroundColor: "#fafafa" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 2 }}>
                <button
                  onClick={() => setTab(0)}
                  style={{ padding: "3px 14px", borderRadius: 20, fontSize: 11.5, fontWeight: 500, border: "none", cursor: "pointer", backgroundColor: tab === 0 ? "#00ACC1" : "transparent", color: tab === 0 ? "#fff" : "#666", transition: "all 0.2s" }}
                >
                  Inbox
                </button>
                <button
                  onClick={() => setTab(1)}
                  style={{ padding: "3px 14px", borderRadius: 20, fontSize: 11.5, fontWeight: 500, border: "none", cursor: "pointer", backgroundColor: tab === 1 ? "#00ACC1" : "transparent", color: tab === 1 ? "#fff" : "#666", transition: "all 0.2s" }}
                >
                  Archived
                </button>
              </div>
              <ShadButton
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-lg text-gray-400 hover:text-[#00ACC1] hover:bg-[rgba(0,172,193,0.08)]"
                onClick={toggleFilterDrawer(true)}
              >
                <SlidersHorizontal size={14} />
              </ShadButton>
            </div>
          </div>

          {/* Thread list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredThreads.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#bbb", fontSize: 13 }}>
                <Mail size={32} style={{ margin: "0 auto 10px", opacity: 0.25, display: "block" }} />
                No emails found
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const latest = thread.latest;
                const isSelected = expandedThreadId === thread._id;
                const isUnread = !latest?.read;
                const avatarBg = getAvatarColor(latest?.from || "");
                const initials = getInitialsFromStr(latest?.from || "");

                return (
                  <div
                    key={thread._id}
                    onClick={() => handleExpandThread(thread._id)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 11,
                      padding: "12px 14px 12px 11px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f4f4f5",
                      borderLeft: isSelected ? "3px solid #00ACC1" : "3px solid transparent",
                      backgroundColor: isSelected ? "rgba(0,172,193,0.06)" : "transparent",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = isSelected ? "rgba(0,172,193,0.06)" : "transparent"; }}
                  >
                    <ShadAvatar className="h-8 w-8 shrink-0 mt-0.5">
                      <AvatarFallback style={{ backgroundColor: avatarBg, color: "#fff", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.02em" }}>
                        {initials}
                      </AvatarFallback>
                    </ShadAvatar>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: isUnread ? 700 : 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>
                          {latest?.from?.replace(/<.*?>/g, "").trim() || "Unknown"}
                        </span>
                        <span style={{ fontSize: 11, color: isUnread ? "#00ACC1" : "#9ca3af", flexShrink: 0, marginLeft: 6, fontWeight: isUnread ? 600 : 400 }}>
                          {getRelativeTime(latest?.createdAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: isUnread ? 600 : 400, color: isUnread ? "#1f2937" : "#4b5563", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cleanSubjectText(latest?.subject || "") || "(No Subject)"}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>
                        {getPreview(latest?.body || "").slice(0, 65)}
                      </div>
                    </div>

                    {isUnread && (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#00ACC1", flexShrink: 0, marginTop: 7 }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT: Thread reader panel ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff" }}>
          {selectedThread ? (
            <>
              {/* Subject header + action buttons */}
              <div style={{ padding: "16px 22px 12px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a", margin: 0, flex: 1, marginRight: 16, lineHeight: 1.4 }}>
                  {renderLinkedSubject(selectedThread.latest?.subject, true)}
                </h2>
                <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                  {!selectedThread.latest?.read && (
                    <ShadButton
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs rounded-lg gap-1.5 text-gray-500 hover:text-[#00ACC1] hover:bg-[rgba(0,172,193,0.07)]"
                      onClick={(e) => { e.stopPropagation(); markThreadAsRead(expandedThreadId); }}
                    >
                      <CheckCheck size={14} />
                      Read
                    </ShadButton>
                  )}
                  <ShadButton
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs rounded-lg gap-1.5 text-gray-500 hover:bg-gray-100"
                    onClick={(e) => { e.stopPropagation(); archiveThread(expandedThreadId, !selectedThread.latest?.archived); }}
                  >
                    {selectedThread.latest?.archived
                      ? <><ArchiveRestore size={14} /> Unarchive</>
                      : <><Archive size={14} /> Archive</>
                    }
                  </ShadButton>
                  <ShadButton
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    onClick={() => handleExpandThread(expandedThreadId)}
                  >
                    <X size={15} />
                  </ShadButton>
                </div>
              </div>

              {/* Messages — scrollable */}
              <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 20px" }}>
                {[...selectedThread.messages]
                  .sort((a, b) => {
                    const aTagged = hasMongoIdTag(a.subject);
                    const bTagged = hasMongoIdTag(b.subject);
                    if (aTagged && !bTagged) return -1;
                    if (!aTagged && bTagged) return 1;
                    return 0;
                  })
                  .map((email, idx, arr) => {
                    const isExpanded = expandedMessageId === email.messageId;
                    const emailAvatarBg = getAvatarColor(email.from || "");
                    const emailInitials = getInitialsFromStr(email.from || "");

                    return (
                      <div key={email.messageId} style={{ padding: "4px 0", borderBottom: idx < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        {/* Message header — always visible */}
                        <div
                          onClick={() => handleExpandMessage(email.messageId)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            padding: "12px 12px 12px 0",
                            cursor: "pointer",
                            borderRadius: 8,
                            transition: "background 0.12s",
                          }}
                          onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                        >
                          <ShadAvatar className="h-8 w-8 shrink-0 mt-0.5">
                            <AvatarFallback style={{ backgroundColor: emailAvatarBg, color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>
                              {emailInitials}
                            </AvatarFallback>
                          </ShadAvatar>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>
                                {email.from?.replace(/<.*?>/g, "").trim()}
                              </span>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 10 }}>
                                <span style={{ fontSize: 11, color: "#9ca3af" }}>
                                  {new Date(email.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                                </span>
                                {isExpanded
                                  ? <ChevronUp size={13} style={{ color: "#9ca3af" }} />
                                  : <ChevronDown size={13} style={{ color: "#9ca3af" }} />
                                }
                              </div>
                            </div>
                            {!isExpanded && (
                              <p style={{ fontSize: 12.5, color: "#6b7280", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {getPreview(email.body || "").slice(0, 130)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Expanded body — card wrapper */}
                        {isExpanded && (
                          <div style={{ marginLeft: 44, marginBottom: 12, backgroundColor: "#f9fafb", borderRadius: 10, border: "1px solid #f0f0f0", padding: "16px 18px" }}>
                            {email.subject && hasMongoIdTag(email.subject) && (
                              <div style={{ marginBottom: 10, fontSize: 12.5, fontWeight: 600 }}>
                                {renderLinkedSubject(email.subject, true)}
                              </div>
                            )}
                            <div
                              style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, wordBreak: "break-word" }}
                              dangerouslySetInnerHTML={{ __html: email.body }}
                            />

                            {/* Attachments */}
                            {email.attachments?.length > 0 && (
                              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #e5e7eb" }}>
                                <p style={{ fontSize: 11.5, fontWeight: 600, color: "#6b7280", marginBottom: 10, display: "flex", alignItems: "center", gap: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                  <Paperclip size={11} />
                                  {email.attachments.length} attachment{email.attachments.length > 1 ? "s" : ""}
                                </p>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                  {email.attachments.map((att, i) => (
                                    <div
                                      key={i}
                                      onClick={(e) => { e.stopPropagation(); openAttachment(att); }}
                                      style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", cursor: "pointer", minWidth: 140, backgroundColor: "#fff", transition: "border-color 0.15s, box-shadow 0.15s" }}
                                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00ACC1"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0,172,193,0.1)"; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
                                    >
                                      <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {att.filename}
                                      </p>
                                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0" }}>
                                        {Math.round((att.data.length * 3) / 4 / 1024)} KB
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Mail size={40} style={{ color: "#ddd", marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: "#bbb", margin: 0 }}>Select an email to read</p>
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
            <div style={{ flex: 1, overflow: "hidden" }}>
              {previewFile.mimeType.startsWith("image/") && (
                <img src={previewFile.url} alt={previewFile.filename} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              )}
              {!previewFile.mimeType.startsWith("image/") && (
                <iframe src={previewFile.url} style={{ width: "100%", height: "100%", border: "none" }} title="File Preview" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Sheet */}
      <Sheet open={filterDrawerOpen} onOpenChange={(o) => !o && setFilterDrawerOpen(false)}>
        <SheetContent
          side="right"
          className="p-0 flex flex-col [&>button]:hidden"
          style={{ width: 300 }}
        >
          <SheetHeader
            style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <SheetTitle style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", fontWeight: 600 }}>
              <SlidersHorizontal size={15} style={{ color: "#00ACC1" }} />
              Filters
            </SheetTitle>
            <ShadButton variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600" onClick={() => setFilterDrawerOpen(false)}>
              <X size={15} />
            </ShadButton>
          </SheetHeader>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              Email Type
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {Object.keys(checkedItems).map((key) => (
                <label
                  key={key}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#333", backgroundColor: checkedItems[key] ? "rgba(0,172,193,0.06)" : "transparent", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { if (!checkedItems[key]) e.currentTarget.style.backgroundColor = "#fafafa"; }}
                  onMouseLeave={(e) => { if (!checkedItems[key]) e.currentTarget.style.backgroundColor = checkedItems[key] ? "rgba(0,172,193,0.06)" : "transparent"; }}
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={checkedItems[key]}
                    onChange={handleCheckboxChange}
                    style={{ accentColor: "#00ACC1", width: 14, height: 14, flexShrink: 0 }}
                  />
                  <span style={{ fontWeight: checkedItems[key] ? 600 : 400 }}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", padding: "12px 20px", display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
            <ShadButton
              variant="outline"
              size="sm"
              className="h-8 px-4 text-xs rounded-lg"
              onClick={handleClearAll}
            >
              Clear All
            </ShadButton>
            <ShadButton
              size="sm"
              className="h-8 px-4 text-xs rounded-lg"
              style={{ backgroundColor: "#00ACC1", color: "#fff" }}
              onClick={toggleFilterDrawer(false)}
            >
              Apply
            </ShadButton>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EmailViewer;
