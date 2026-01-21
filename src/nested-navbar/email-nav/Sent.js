// // import React, { useState } from "react";

// // function App() {
// //   const [message, setMessage] = useState("");

// //   const loginWithGoogle = () => {
// //     window.location.href = "http://127.0.0.1:8015/emailsync/auth/google";
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h1>Google Login Demo</h1>

// //       <button style={styles.button} onClick={loginWithGoogle}>
// //         Login with Google
// //       </button>

// //       {message && <p>{message}</p>}
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: {
// //     height: "100vh",
// //     display: "flex",
// //     flexDirection: "column",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     fontFamily: "Arial"
// //   },
// //   button: {
// //     padding: "12px 20px",
// //     fontSize: "16px",
// //     cursor: "pointer",
// //     background: "#4285F4",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "5px"
// //   }
// // };

// // export default App;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   List,
//   ListItemButton,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useParams } from "react-router-dom";

// const Sent = () => {
//   const { data } = useParams();

//   const [threads, setThreads] = useState([]);
//   const [selectedThreadId, setSelectedThreadId] = useState(null);

//   useEffect(() => {
//     fetchSentEmails();
//   }, []);

//   const fetchSentEmails = async () => {
//     try {
//       const contactsRes = await axios.get(
//         `https://www.snptaxes.com/api/accounts/${data}/contacts`
//       );

//       const syncedEmails = (contactsRes.data.data || [])
//         .filter((item) => item.canEmailSync && item.contact?.email)
//         .map((item) => item.contact.email);

//       const emailsRes = await axios.post(
//         "http://127.0.0.1:8015/emailsync/messagesList/messages",
//         { emails: syncedEmails }
//       );

//       const sentThreads = (emailsRes.data.threads || []).filter(
//         (t) => t.latest.direction === "sent"
//       );

//       setThreads(sentThreads);
//     } catch (err) {
//       console.error("Sent fetch failed", err);
//     }
//   };

//   const getPreview = (html, length = 80) => {
//     const text = html.replace(/<[^>]*>?/gm, "");
//     return text.length > length ? text.slice(0, length) + "..." : text;
//   };

//   const selectedThread = threads.find((t) => t._id === selectedThreadId);

//   return (
//     <Box sx={{ display: "flex", height: "90vh" }}>
//       {/* LEFT - Sent Threads */}
//       <Box sx={{ width: "35%", borderRight: "1px solid #ddd" }}>
//         <List>
//           {threads.map((thread) => (
//             <ListItemButton
//               key={thread._id}
//               onClick={() => setSelectedThreadId(thread._id)}
//               sx={{
//                 borderBottom: "1px solid #eee",
//                 bgcolor:
//                   selectedThreadId === thread._id ? "#f0f4ff" : "transparent",
//               }}
//             >
//               <Box>
//                 <Typography fontWeight={700}>
//                   Me → {thread.latest.contactEmail}
//                 </Typography>

//                 <Typography fontWeight={600}>
//                   {thread.latest.subject || "(No Subject)"}
//                 </Typography>

//                 <Typography variant="caption" color="text.secondary">
//                   {getPreview(thread.latest.body)}
//                 </Typography>
//               </Box>
//             </ListItemButton>
//           ))}
//         </List>
//       </Box>

//       {/* RIGHT - Thread View */}
//       <Box sx={{ width: "65%", p: 2, overflowY: "auto" }}>
//         {selectedThread ? (
//           <>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Typography variant="h6">
//                 {selectedThread.latest.subject}
//               </Typography>
//               <CloseIcon
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setSelectedThreadId(null)}
//               />
//             </Box>

//             {selectedThread.messages.map((email) => {
//               const isSent = email.direction === "sent";

//               return (
//                 <Box
//                   key={email.messageId}
//                   sx={{
//                     display: "flex",
//                     justifyContent: isSent ? "flex-end" : "flex-start",
//                     mb: 2,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       maxWidth: "75%",
//                       p: 2,
//                       borderRadius: 2,
//                       bgcolor: isSent ? "#e3f2fd" : "#f5f5f5",
//                       border: "1px solid #ddd",
//                     }}
//                   >
//                     <Typography fontWeight="bold">
//                       {isSent ? "Me" : email.from}
//                     </Typography>

//                     <Typography variant="caption">
//                       {new Date(email.createdAt).toLocaleString()}
//                     </Typography>

//                     <Box
//                       sx={{ mt: 1 }}
//                       dangerouslySetInnerHTML={{ __html: email.body }}
//                     />
//                   </Box>
//                 </Box>
//               );
//             })}
//           </>
//         ) : (
//           <Typography color="text.secondary">
//             Select an email to read
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Sent;

import EmailViewer from "./EmailViewer";

const Sent = () => {
  return <EmailViewer type="sent" />;
};

export default Sent;
