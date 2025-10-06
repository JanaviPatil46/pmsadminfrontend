

// import React, { useState, useEffect ,useContext} from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardActions,
//   Collapse,
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Drawer,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,CircularProgress
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import FilterListIcon from "@mui/icons-material/FilterList";


// import { LoginContext } from "../Sidebar/Context/Context";

// const Inboxplus = () => {
//    const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//      const { logindata } = useContext(LoginContext);
//      const [loginuserid, setLoginUserId] = useState();
//      const [userdata, setuserdata] = useState();
//      const [emailSyncEmail,setEmailSyncEmail]= useState("")
    
// const [loadingEmails, setLoadingEmails] = useState(false);
// const [fetchError, setFetchError] = useState("");
//   // redirect to google login
//   const handleGoogleLogin = () => {
//     window.location.href = `${EMAIL_SYNC}/emailsync/auth/google`;
//   };
//      console.log("logged data",logindata)
//      useEffect(() => {
//        if (logindata?.user?.id) {
//          setLoginUserId(logindata.user.id);
//        }
//      }, [logindata]);
//      // Fetch data after loginuserid is set
//      useEffect(() => {
//        if (loginuserid) {
//          fetchData();
//        }
//      }, [loginuserid]);
//       const fetchData = async () => {
//          try {
//            const url = `${LOGIN_API}/common/user/${loginuserid}`;
//            console.log("jjj", url);
//            const response = await fetch(url);
//            const data = await response.json();
     
         
     
//            setuserdata(data);
//            setEmailSyncEmail(data.emailSyncEmail)
//        console.log("Updated emailSyncEmail", data.emailSyncEmail);
          
//          } catch (error) {
//            console.error("Error fetching data:", error);
//          }
//        };
//   const EMAIL_SYNC = process.env.REACT_APP_EMAILSYNC_API;
//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   const [emailList, setEmailList] = useState([]);
//   const [expandedEmailIndex, setExpandedEmailIndex] = useState(null);
//   const [userRole, setUserRole] = useState("");
//   const [accountIds, setAccountIds] = useState([]);
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
//   const [checkedItems, setCheckedItems] = useState({
//     invoice: false,
//     proposal: false,
//     document: false,
//     documentSigned: false,
//     message: false,
//     organizer: false,
//   });

//   const getEmailType = (subject) => {
//     if (!subject) return null;
//     const lowerSubject = subject.toLowerCase();
    
//     if (lowerSubject.includes('invoice')) return 'invoice';
//     if (lowerSubject.includes('proposal')) return 'proposal';
//     if (lowerSubject.includes('document signed')) return 'documentSigned';
//     if (lowerSubject.includes('document')) return 'document';
//     if (lowerSubject.includes('message')) return 'message';
//     if (lowerSubject.includes('organizer')) return 'organizer';
    
//     return null;
//   };

//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//     const userRole = localStorage.getItem("userRole");
//     setUserRole(userRole);

//     if (userRole === "TeamMember") {
//       fetchTeamMemberAccounts(storedData?.teammember?.userid);
//     }
//   }, []);


//   useEffect(() => {
//   const fetchEmails = async () => {
//     if (!emailSyncEmail) return;
//     setLoadingEmails(true);
//     setFetchError("");

//     try {
//       if (userRole === "Admin") {
//         const res = await axios.get(`${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}`);
//         setEmailList(res.data.emails || []);
//       } else if (userRole === "TeamMember" && accountIds.length > 0) {
//         const res = await axios.get(`${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}`);
//         const filteredEmails = (res.data.emails || []).filter((email) =>
//           accountIds.some((accountId) => email.subject?.includes(accountId))
//         );
//         setEmailList(filteredEmails);
//       }
//     } catch (err) {
//       console.error("Error fetching emails", err);
//       if (err.response?.data?.error?.includes("Refresh token missing")) {
//         setFetchError("Your Gmail session expired. Please log in again.");
//       } else {
//         setFetchError("Failed to fetch emails. Please try again.");
//       }
//     } finally {
//       setLoadingEmails(false);
//     }
//   };

//   fetchEmails();
// }, [userRole, accountIds, emailSyncEmail]);
//   const fetchTeamMemberAccounts = async (userId) => {
//     try {
//       const response = await axios.get(
//         `${ACCOUNT_API}/accounts/getaccounts/${userId}/true`
//       );
//       const ids = response.data.accountlist?.map((account) => account.id) || [];
//       setAccountIds(ids);
//     } catch (error) {
//       console.error("Error fetching team member accounts:", error);
//     }
//   };

//   const toggleFilterDrawer = (open) => (event) => {
//     setFilterDrawerOpen(open);
//   };

//   const handleCheckboxChange = (event) => {
//     setCheckedItems({
//       ...checkedItems,
//       [event.target.name]: event.target.checked,
//     });
//   };

//   const handleSelectAll = (select) => {
//     const newState = Object.keys(checkedItems).reduce((acc, key) => {
//       acc[key] = select;
//       return acc;
//     }, {});
//     setCheckedItems(newState);
    
//   };

//   const handleClearAll = () => {
//     handleSelectAll(false);
    
//   };

//   return (
//     <>
      
//           <div>
//   {loadingEmails ? (
//     <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
//       <CircularProgress />
//       <Typography variant="body1" sx={{ ml: 2 }}>
//         Fetching emails...
//       </Typography>
//     </Box>
//   ) : fetchError ? (
//     <Box textAlign="center" mt={4}>
//       <Typography color="error" variant="body1" gutterBottom>
//         {fetchError}
//       </Typography>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleGoogleLogin}
//       >
//         Reconnect Gmail
//       </Button>
//     </Box>
//   ) : (
//     <>
//       {emailList.filter((email) => {
//         if (!email.subject?.startsWith("#")) return false;

//         if (userRole === "TeamMember" && accountIds.length > 0) {
//           const hasAccountId = accountIds.some((accountId) =>
//             email.subject.includes(accountId)
//           );
//           if (!hasAccountId) return false;
//         }

//         const anyFilterActive = Object.values(checkedItems).some(Boolean);
//         if (anyFilterActive) {
//           const emailType = getEmailType(email.subject);
//           if (!emailType || !checkedItems[emailType]) return false;
//         }

//         return true;
//       }).length > 0 ? (
//         <div style={{ marginTop: 20 }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Box>
//               <Typography variant="h5">📨 Emails :</Typography>
//             </Box>
//             <Box display="flex" justifyContent="flex-end" mb={2}>
//               <Button
//                 variant="contained"
//                 startIcon={<FilterListIcon />}
//                 onClick={toggleFilterDrawer(true)}
//               >
//                 Filter
//               </Button>
//             </Box>
//           </Box>

//           <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//             {emailList
//               .filter((email) => {
//                 if (!email.subject?.startsWith("#")) return false;

//                 if (userRole === "TeamMember" && accountIds.length > 0) {
//                   const hasAccountId = accountIds.some((accountId) =>
//                     email.subject.includes(accountId)
//                   );
//                   if (!hasAccountId) return false;
//                 }

//                 const anyFilterActive = Object.values(checkedItems).some(Boolean);
//                 if (anyFilterActive) {
//                   const emailType = getEmailType(email.subject);
//                   if (!emailType || !checkedItems[emailType]) return false;
//                 }

//                 return true;
//               })
//               .map((email, idx) => (
//                 <Card
//                   key={idx}
//                   variant="outlined"
//                   onMouseEnter={() => setExpandedEmailIndex(idx)}
//                   onMouseLeave={() => setExpandedEmailIndex(null)}
//                   sx={{ cursor: "pointer" }}
//                 >
//                   <CardContent
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Typography>{email.subject.slice(1).trim()}</Typography>
//                   </CardContent>

//                   <CardActions disableSpacing></CardActions>

//                   <Collapse
//                     in={expandedEmailIndex === idx}
//                     timeout="auto"
//                     unmountOnExit
//                   >
//                     <CardContent>
//                       <Typography
//                         variant="body2"
//                         color="text.primary"
//                         style={{ whiteSpace: "pre-wrap" }}
//                       >
//                         <Typography
//                           variant="body2"
//                           component="div"
//                           dangerouslySetInnerHTML={{
//                             __html:
//                               typeof email.body === "string"
//                                 ? email.body
//                                 : "No content available",
//                           }}
//                         />
//                       </Typography>
//                     </CardContent>
//                   </Collapse>
//                 </Card>
//               ))}
//           </div>
//         </div>
//       ) : (
//         <Box textAlign="center" mt={4}>
//           <Typography variant="body1">No emails found.</Typography>
//         </Box>
//       )}
//     </>
//   )}
// </div>


//       <Drawer
//         anchor="right"
//         open={filterDrawerOpen}
//         onClose={toggleFilterDrawer(false)}
//       >
//         <Box sx={{ width: 600, padding: 3 }}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Typography variant="h6" gutterBottom>
//               Filters
//             </Typography>
//             <IconButton onClick={toggleFilterDrawer(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <FormGroup>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={checkedItems.invoice}
//                   onChange={handleCheckboxChange}
//                   name="invoice"
//                 />
//               }
//               label="Invoice"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={checkedItems.proposal}
//                   onChange={handleCheckboxChange}
//                   name="proposal"
//                 />
//               }
//               label="Proposal"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={checkedItems.document}
//                   onChange={handleCheckboxChange}
//                   name="document"
//                 />
//               }
//               label="Document"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={checkedItems.documentSigned}
//                   onChange={handleCheckboxChange}
//                   name="documentSigned"
//                 />
//               }
//               label="Document Signed"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={checkedItems.message}
//                   onChange={handleCheckboxChange}
//                   name="message"
//                 />
//               }
//               label="Message"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={checkedItems.organizer}
//                   onChange={handleCheckboxChange}
//                   name="organizer"
//                 />
//               }
//               label="Organizer"
//             />
//           </FormGroup>

//           <Box
//             sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 5 }}
//           >
//             <Button variant="contained" onClick={toggleFilterDrawer(false)}>
//               Apply Filters
//             </Button>
//             <Button variant="outlined" size="small" onClick={handleClearAll}>
//               Clear All
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// };
// export default Inboxplus;

import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Typography,
  IconButton,
  Drawer,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { LoginContext } from "../Sidebar/Context/Context";

const Inboxplus = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const EMAIL_SYNC = process.env.REACT_APP_EMAILSYNC_API;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;

  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState();
  const [userdata, setuserdata] = useState();
  const [emailSyncEmail, setEmailSyncEmail] = useState("");
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [accountIds, setAccountIds] = useState([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({
    invoice: false,
    proposal: false,
    document: false,
    documentSigned: false,
    message: false,
    organizer: false,
  });

  // Redirect to Google login if needed
  const handleGoogleLogin = () => {
    window.location.href = `${EMAIL_SYNC}/emailsync/auth/google`;
  };

  useEffect(() => {
    if (logindata?.user?.id) setLoginUserId(logindata.user.id);
  }, [logindata]);

  useEffect(() => {
    if (loginuserid) fetchUserData();
  }, [loginuserid]);

  const fetchUserData = async () => {
    try {
      const url = `${LOGIN_API}/common/user/${loginuserid}`;
      const response = await fetch(url);
      const data = await response.json();
      setuserdata(data);
      setEmailSyncEmail(data.emailSyncEmail);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getEmailType = (subject) => {
    if (!subject) return null;
    const lower = subject.toLowerCase();
    if (lower.includes("invoice")) return "invoice";
    if (lower.includes("proposal")) return "proposal";
    if (lower.includes("document signed")) return "documentSigned";
    if (lower.includes("document")) return "document";
    if (lower.includes("message")) return "message";
    if (lower.includes("organizer")) return "organizer";
    return null;
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    if (role === "TeamMember") {
      fetchTeamMemberAccounts(storedData?.teammember?.userid);
    }
  }, []);

  const fetchTeamMemberAccounts = async (userId) => {
    try {
      const response = await axios.get(
        `${ACCOUNT_API}/accounts/getaccounts/${userId}/true`
      );
      const ids = response.data.accountlist?.map((a) => a.id) || [];
      setAccountIds(ids);
    } catch (error) {
      console.error("Error fetching team member accounts:", error);
    }
  };

  useEffect(() => {
    const fetchEmails = async () => {
      if (!emailSyncEmail) return;
      setLoadingEmails(true);
      setFetchError("");
      try {
        const res = await axios.get(
          `${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}`
        );
        let emails = res.data.emails || [];

        if (userRole === "TeamMember" && accountIds.length > 0) {
          emails = emails.filter((email) =>
            accountIds.some((id) => email.subject?.includes(id))
          );
        }

        setEmailList(emails);
      } catch (err) {
        console.error("Error fetching emails", err);
        if (err.response?.data?.error?.includes("Refresh token missing")) {
          setFetchError("Your Gmail session expired. Please log in again.");
        } else {
          setFetchError("Failed to fetch emails. Please try again.");
        }
      } finally {
        setLoadingEmails(false);
      }
    };

    fetchEmails();
  }, [userRole, accountIds, emailSyncEmail]);

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
  };

  // Filter logic
  const filteredEmails = emailList.filter((email) => {
    if (!email.subject?.startsWith("#")) return false;
    if (userRole === "TeamMember" && accountIds.length > 0) {
      const hasAccountId = accountIds.some((id) => email.subject.includes(id));
      if (!hasAccountId) return false;
    }

    const activeFilters = Object.values(checkedItems).some(Boolean);
    if (activeFilters) {
      const type = getEmailType(email.subject);
      if (!type || !checkedItems[type]) return false;
    }
    return true;
  });

  return (
    <>
      {loadingEmails ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Fetching emails...</Typography>
        </Box>
      ) : fetchError ? (
        <Box textAlign="center" mt={4}>
          <Typography color="error">{fetchError}</Typography>
          <Button variant="contained" onClick={handleGoogleLogin}>
            Reconnect Gmail
          </Button>
        </Box>
      ) : (
        <Box display="flex" height="80vh" mt={3}>
          {/* Left side — Email Cards */}
          <Box width="45%" borderRight="1px solid #ddd" overflow="auto" p={2}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h5">📨 Emails</Typography>
              <Button
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={toggleFilterDrawer(true)}
              >
                Filter
              </Button>
            </Box>

            {filteredEmails.length === 0 ? (
              <Typography textAlign="center" mt={3}>
                No emails found.
              </Typography>
            ) : (
              filteredEmails.map((email, idx) => {
                const emailType = getEmailType(email.subject);
                const isSelected = selectedEmail === email;
                return (
                  <Card
                    key={idx}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#f1f8e9" : "white",
                      transition: "0.2s",
                      "&:hover": { boxShadow: 4 },
                    }}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {email.subject?.slice(1).trim() || "(No Subject)"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 0.5 }}
                      >
                        From: {email.from || "Unknown"}
                      </Typography>
                      
                      {emailType && (
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1.5,
                            py: 0.3,
                            borderRadius: 1,
                            bgcolor: "#e3f2fd",
                            color: "#1565c0",
                            fontWeight: 500,
                          }}
                        >
                          {emailType.toUpperCase()}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>

          {/* Right side — Email Viewer */}
          <Box width="55%" p={3} overflow="auto">
            {selectedEmail ? (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedEmail.subject?.slice(1).trim()}
                  </Typography>
                  <Typography marginBottom={3} variant="body2" color="textSecondary" gutterBottom>
                    From: {selectedEmail.from}
                  </Typography>
                  
                  <Box
                    sx={{
                      borderTop: "1px solid #ddd",
                      pt: 2,
                      whiteSpace: "pre-wrap",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof selectedEmail.body === "string"
                          ? selectedEmail.body
                          : "No content available",
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Typography color="textSecondary" mt={3}>
                Select an email to view details.
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Drawer — Filters */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer(false)}
      >
        <Box sx={{ width: 400, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleFilterDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormGroup>
            {Object.keys(checkedItems).map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={checkedItems[key]}
                    onChange={handleCheckboxChange}
                    name={key}
                  />
                }
                label={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </FormGroup>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={toggleFilterDrawer(false)}>
              Apply
            </Button>
            <Button variant="outlined" onClick={handleClearAll}>
              Clear
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Inboxplus;























// useEffect(() => {
//   const fetchEmails = async () => {
//     if (!emailSyncEmail) return; // ⛔ stop until we actually have the email
//     try {
//       if (userRole === "Admin") {
//         const res = await axios.get(
//           `${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}`
//         );
//         setEmailList(res.data.emails || []);
//       } else if (userRole === "TeamMember" && accountIds.length > 0) {
//         const res = await axios.get(
//           `${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}`
//         );
//         const filteredEmails = (res.data.emails || []).filter((email) =>
//           accountIds.some((accountId) => email.subject?.includes(accountId))
//         );
//         setEmailList(filteredEmails);
//         console.log("setEmailList",filteredEmails)
//       }
//     } catch (err) {
//       console.error("Error fetching emails", err);
//     }
//   };

//   fetchEmails();
// }, [userRole, accountIds, emailSyncEmail]);
// fetch Gmail emails
  // useEffect(() => {
  //   const fetchEmails = async () => {
  //     if (!emailSyncEmail) return;

  //     try {
  //       const res = await axios.get(
  //         `${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}`
  //       );

  //       // ✅ If success
  //       setAuthError(null);
  //       const allEmails = res.data.emails || [];

  //       if (userRole === "TeamMember" && accountIds.length > 0) {
  //         const filteredEmails = allEmails.filter((email) =>
  //           accountIds.some((accountId) => email.subject?.includes(accountId))
  //         );
  //         setEmailList(filteredEmails);
  //       } else {
  //         setEmailList(allEmails);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching emails:", err);

  //       // ⚠️ Handle reauthentication case
  //       if (err.response?.data?.error?.includes("Please reauthenticate")) {
  //         setAuthError(err.response.data);
  //       } else {
  //         setAuthError({
  //           error: "Failed to load emails. Try again later.",
  //         });
  //       }
  //     }
  //   };

  //   fetchEmails();
  // }, [userRole, accountIds, emailSyncEmail]);