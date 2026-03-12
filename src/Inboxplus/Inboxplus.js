

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  Tabs,
  Tab,
  Divider,
  Drawer,
  Chip,
  IconButton,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { ExpandLess, ExpandMore, AttachFile } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
// import { Pagination } from "@mui/material";
import { TablePagination } from "@mui/material";




const EmailViewer = () => {
//   const [page, setPage] = useState(1);
// const threadsPerPage = 10;
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
  const [threads, setThreads] = useState([]);
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


//   const handlePageChange = (event, value) => {
//   setPage(value);
// };
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};
const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

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
      (key) => checkedItems[key],
    );

    if (activeFilters.length === 0) return true;

    const lowerSubject = subject.toLowerCase();

    return activeFilters.some((filterKey) =>
      FILTER_KEYWORDS[filterKey]?.some((keyword) =>
        lowerSubject.includes(keyword),
      ),
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

 

  const getPreview = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const extractEmail = (from) => {
    const match = from.match(/<(.+?)>/);
    return match ? match[1] : from;
  };

  
  const hasMongoIdTag = (subject = "") => {
    return /#[a-f0-9]{24}\b/i.test(subject);
  };
  
  const extractMongoId = (subject = "") => {
    const match = subject.match(/#([a-f0-9]{24})\b/i);
    return match ? match[1] : null;
  };

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
          toast.success("Thread marked as read ✅");
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
      toast.success(
      archived ? "Thread archived successfully 📁" : "Thread unarchived successfully 📂"
    );
      fetchEmails(); // refresh UI
    } catch (err) {
      console.error("Archive failed", err);
    }
  };

  const filteredThreads = threads
    .filter((thread) => {
      const isArchived = thread.latest?.archived;
      return tab === 0 ? !isArchived : isArchived;
    })
    .filter((thread) => {
      if (matchesSelectedFilters(thread.latest?.subject)) return true;

      return thread.messages?.some((msg) =>
        matchesSelectedFilters(msg.subject),
      );
    });

      // const startIndex = (page - 1) * threadsPerPage;
// const paginatedThreads = filteredThreads.slice(
//   startIndex,
//   startIndex + threadsPerPage
// );
const paginatedThreads = filteredThreads.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

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
  const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "long" });
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

  return (
    <Box
      sx={{
        maxWidth: 900,
        margin: "20px auto",
        bgcolor: "#f9f9f9",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Email Inbox
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Inbox" />
          <Tab label="Archived" />
        </Tabs>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          {" "}
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={toggleFilterDrawer(true)}
          >
            Filter
          </Button>
        </Box>
      </Box>

      <List>
        {/* {filteredThreads.map((thread) => { */}
         
         {paginatedThreads.map((thread) => {
          const latest = thread.latest;

          return (
            <React.Fragment key={thread._id}>
              {/* Thread Header */}
              <ListItemButton onClick={() => handleExpandThread(thread._id)}>
                <ListItemText
                  primary={
                    
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        color: hasMongoIdTag(latest.subject)
                          ? "#2f3fd3"
                          : "inherit",
                      }}
                    >
                      {renderLinkedSubject(latest.subject, true)}
                    </Typography>
                  }
                  secondary={
    <Typography variant="caption" color="text.secondary">
      {formatDate(latest.threadDate || latest.createdAt)}
    </Typography>
  }
                  
                />
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  {!latest.read && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => markThreadAsRead(thread._id)}
                    >
                      Mark as Read
                    </Button>
                  )}

                  <Button
                    size="small"
                    variant="outlined"
                    color={latest.archived ? "success" : "warning"}
                    onClick={() => archiveThread(thread._id, !latest.archived)}
                  >
                    {latest.archived ? "Unarchive" : "Archive"}
                  </Button>
                </Box>

                {expandedThreadId === thread._id ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItemButton>

              {/* Thread Messages */}
              <Collapse
                in={expandedThreadId === thread._id}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 1, mb: 1 }}>
                  {[...thread.messages]
                    .sort((a, b) => {
                      const aTagged = hasMongoIdTag(a.subject);
                      const bTagged = hasMongoIdTag(b.subject);

                      if (aTagged && !bTagged) return -1;
                      if (!aTagged && bTagged) return 1;
                      return 0;
                    })
                    .map((email) => {
                      const isExpanded = expandedMessageId === email.messageId;

                      return (
                        <Box
                          key={email.messageId}
                          sx={{
                            mb: 2,
                            p: 1.5,
                            border: "1px solid #eee",
                            borderRadius: 1,
                            cursor: "pointer",
                          }}
                          onClick={() => handleExpandMessage(email.messageId)}
                        >
                          

                          <Typography variant="caption" color="text.secondary">
                            {new Date(email.createdAt).toLocaleString()}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ mt: 1 }}
                           
                            dangerouslySetInnerHTML={{
                              __html: email.body,
                            }}
                          />

                         

                          {email.attachments?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2">
                                Attachments({email.attachments.length})
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  flexWrap: "wrap",
                                }}
                              >
                                {email.attachments.map((att, idx) => (
                                  <Box
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openAttachment(att);
                                    }}
                                    sx={{
                                      border: "1px solid #ddd",
                                      borderRadius: 2,
                                      p: 1.5,
                                      minWidth: 180,
                                      cursor: "pointer",
                                      bgcolor: "#fafafa",
                                      "&:hover": { bgcolor: "#f0f0f0" },
                                    }}
                                  >
                                    <Typography fontWeight="bold">
                                      {att.filename}
                                    </Typography>

                                    <Typography variant="caption">
                                      {Math.round(
                                        (att.data.length * 3) / 4 / 1024,
                                      )}{" "}
                                      KB
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                              {previewFile && (
                                <Box
                                  sx={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100vw",
                                    height: "100vh",
                                    bgcolor: "rgba(0,0,0,0.7)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 9999,
                                  }}
                                  onClick={() => setPreviewFile(null)}
                                >
                                  <Box
                                    sx={{
                                      width: "85%",
                                      height: "90%",
                                      bgcolor: "#fff",
                                      borderRadius: 2,
                                      overflow: "hidden",
                                      position: "relative",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Header */}
                                    <Box
                                      sx={{
                                        p: 1,
                                        borderBottom: "1px solid #ddd",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography fontWeight="bold">
                                        {previewFile.filename}
                                      </Typography>

                                      <Button
                                        onClick={() => setPreviewFile(null)}
                                      >
                                        Close
                                      </Button>
                                    </Box>

                                    {/* Preview Area */}
                                    <Box sx={{ height: "100%" }}>
                                      {/* Images */}
                                      {previewFile.mimeType.startsWith(
                                        "image/",
                                      ) && (
                                        <img
                                          src={previewFile.url}
                                          alt={previewFile.filename}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                          }}
                                        />
                                      )}

                                      {/* PDF */}
                                      {previewFile.mimeType ===
                                        "application/pdf" && (
                                        <iframe
                                          src={previewFile.url}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            border: "none",
                                          }}
                                          title="PDF Preview"
                                        />
                                      )}

                                      {/* Excel / Word / Others */}
                                      {!previewFile.mimeType.startsWith(
                                        "image/",
                                      ) &&
                                        previewFile.mimeType !==
                                          "application/pdf" && (
                                          <iframe
                                            src={previewFile.url}
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              border: "none",
                                            }}
                                            title="File Preview"
                                          />
                                        )}
                                    </Box>
                                  </Box>
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
      <Box display="flex" justifyContent="center" mt={3}>
  {/* <Pagination
    count={Math.ceil(filteredThreads.length / threadsPerPage)}
    page={page}
    onChange={handlePageChange}
    color="primary"
  /> */}

  {/* <TablePagination
  component="div"
  count={filteredThreads.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  rowsPerPageOptions={[5, 10, 25, 50]}
/> */}
<Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    mt: 2,
    ml:"50%"
  }}
>
  <TablePagination
    component="div"
    count={filteredThreads.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 25, 50]}
    sx={{ width: "auto" }}
  />
</Box>
</Box>

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
    </Box>
  );
};

export default EmailViewer;
