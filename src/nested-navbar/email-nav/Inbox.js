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
import { LoginContext } from "../../Sidebar/Context/Context";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import { useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

const Inboxplus = () => {
  const { data } = useParams();
  console.log("Received data:", data);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const EMAIL_SYNC = process.env.REACT_APP_EMAILSYNC_API;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [tab, setTab] = useState("active"); // active | archived

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
          `${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}?type=${tab}`
        );
        let emails = res.data.emails || [];

        if (userRole === "TeamMember" && accountIds.length > 0) {
          emails = emails.filter((email) =>
            accountIds.some((id) => email.subject?.includes(id))
          );
        }

        setEmailList(emails);
        console.log("Fetched emails:", emails);
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
  }, [userRole, accountIds, emailSyncEmail, tab]);

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
  const removeMongoIdFromSubject = (subject = "") => {
    // Matches MongoDB ObjectId at the beginning followed by space
    return subject.replace(/^[a-fA-F0-9]{24}\s*/, "");
  };
  const getCleanSubject = (subject = "") => {
    let clean = subject.startsWith("#") ? subject.slice(1).trim() : subject;
    clean = removeMongoIdFromSubject(clean);
    return clean;
  };
const extractMongoIdFromSubject = (subject = "") => {
  const match = subject.match(/[a-fA-F0-9]{24}/);
  return match ? match[0] : null;
};

  // const filteredEmails = emailList.filter((email) => {
  //   if (!email.subject?.startsWith("#")) return false;

  //   if (userRole === "TeamMember" && accountIds.length > 0) {
  //     const hasAccountId = accountIds.some((id) => email.subject.includes(id));
  //     if (!hasAccountId) return false;
  //   }

  //   const activeFilters = Object.values(checkedItems).some(Boolean);
  //   if (activeFilters) {
  //     const type = getEmailType(email.subject);
  //     if (!type || !checkedItems[type]) return false;
  //   }

  //   return true;
  // });
const filteredEmails = emailList.filter((email) => {
  if (!email.subject) return false;

  // 1. Extract MongoDB ID from subject
  const subjectMongoId = extractMongoIdFromSubject(email.subject);

  // 2. If route param exists, strictly match it
  if (data && subjectMongoId !== data) return false;

  // 3. TeamMember account restriction (keep your logic)
  if (userRole === "TeamMember" && accountIds.length > 0) {
    const hasAccountId = accountIds.some((id) =>
      email.subject.includes(id)
    );
    if (!hasAccountId) return false;
  }

  // 4. Apply checkbox filters
  const activeFilters = Object.values(checkedItems).some(Boolean);
  if (activeFilters) {
    const type = getEmailType(email.subject);
    if (!type || !checkedItems[type]) return false;
  }

  return true;
});

  const handleArchiveToggle = async () => {
    if (!selectedEmail) return;

    const endpoint =
      tab === "active"
        ? `${EMAIL_SYNC}/emailsync/user/archive`
        : `${EMAIL_SYNC}/emailsync/user/unarchive`;

    await axios.post(endpoint, {
      email: emailSyncEmail,
      messageId: selectedEmail.id,
    });

    // Remove from current list instantly
    setEmailList((prev) => prev.filter((e) => e.id !== selectedEmail.id));

    setSelectedEmail(null);
    toast.success(
      tab === "active"
        ? "Email archived successfully"
        : "Email moved to Inbox successfully"
    );
  };

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
        <>
          <Box display="flex" gap={2} mb={2}>
            <Button
              variant={tab === "active" ? "contained" : "outlined"}
              onClick={() => {
                setSelectedEmail(null);
                setTab("active");
              }}
            >
              Active
            </Button>

            <Button
              variant={tab === "archived" ? "contained" : "outlined"}
              onClick={() => {
                setSelectedEmail(null);
                setTab("archived");
              }}
            >
              Archived
            </Button>
          </Box>

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
                        {/* <Typography variant="subtitle1" fontWeight="bold">
                        {email.subject?.slice(1).trim() || "(No Subject)"}
                      </Typography> */}
                        <Typography variant="subtitle1" fontWeight="bold">
                          {getCleanSubject(email.subject) || "(No Subject)"}
                        </Typography>

                        {/* <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 0.5 }}
                      >
                        From: {email.from || "Unknown"}
                      </Typography> */}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </Box>

            {/* Right side — Email Viewer */}

            <Box width="55%" p={0} overflow="auto">
              {selectedEmail ? (
                <Card variant="outlined" sx={{ height: "100%" }}>
                  {/* HEADER */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    px={3}
                    py={2}
                    sx={{ backgroundColor: "#f9fafb" }}
                  >
                    <Box>
                      {/* <Typography variant="h6">
            {selectedEmail.subject?.slice(1).trim()}
          </Typography> */}
                      <Typography variant="h6">
                        {getCleanSubject(selectedEmail.subject)}
                      </Typography>

                      {/* <Typography variant="body2" color="text.secondary">
            From: {selectedEmail.from}
          </Typography> */}
                    </Box>

                    <Tooltip
                      title={tab === "active" ? "Archive" : "Move to Inbox"}
                    >
                      <IconButton onClick={handleArchiveToggle}>
                        {tab === "active" ? (
                          <ArchiveOutlinedIcon />
                        ) : (
                          <UnarchiveOutlinedIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Divider />

                  {/* BODY */}
                  <CardContent>
                    <Box
                      sx={{
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.7,
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          typeof selectedEmail.body === "string"
                            ? selectedEmail.body
                            : "No content available",
                      }}
                    />
                     {/* ATTACHMENTS */}
  {selectedEmail.attachments?.length > 0 && (
    <>
      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" fontWeight="bold">
        📎 Attachments ({selectedEmail.attachments.length})
      </Typography>

      {selectedEmail.attachments.map((file, index) => (
        <Box
          key={index}
          mt={1.5}
          p={1.5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <Box>
            <Typography fontWeight={500}>{file.filename}</Typography>
            <Typography variant="caption" color="text.secondary">
              {file.mimeType}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              const link = document.createElement("a");
              link.href = `data:${file.mimeType};base64,${file.data}`;
              link.download = file.filename;
              link.click();
            }}
          >
            Download
          </Button>
        </Box>
      ))}
    </>
  )}
                  </CardContent>
                </Card>
              ) : (
                <Box
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="text.secondary">
                    Select an email to read
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* Drawer — Filters */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer(false)}
      >
        <Box sx={{ width: 400, p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
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
