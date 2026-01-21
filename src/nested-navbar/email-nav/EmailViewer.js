import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useParams } from "react-router-dom";

const EmailViewer = ({ type }) => {
  const { data } = useParams();

  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    fetchEmailSyncedContactsAndEmails();
  }, [type]);
const SUPPORT_EMAIL = "support@snptaxandfinancials.com";
const [contactMap, setContactMap] = useState({});

  // 🔹 Fetch Emails
  const fetchEmailSyncedContactsAndEmails = async () => {
    try {
      const contactsRes = await axios.get(
        `https://www.snptaxes.com/api/accounts/${data}/contacts`
      );

      const syncedEmails = (contactsRes.data.data || [])
        .filter((item) => item.canEmailSync && item.contact?.email)
        .map((item) => item.contact.email);
console.log("syncedEmails", syncedEmails);
const contactMap = {};
(contactsRes.data.data || []).forEach(item => {
  if (item.canEmailSync && item.contact?.email) {
    contactMap[item.contact.email.toLowerCase()] = item.contact.contactName || item.contact.email;
  }
});
setContactMap(contactMap);


      if (!syncedEmails.length) return;

    //   const emailsRes = await axios.post(
    //     "http://127.0.0.1:8015/emailsync/messagesList/messages",
    //     { emails: syncedEmails, folder: type }
    //   );

    //   setThreads(emailsRes.data.threads || []);
    const emailsRes = await axios.post(
  "http://127.0.0.1:8015/emailsync/messagesList/messages",
  { emails: syncedEmails, folder: type }
);

const filteredThreads = (emailsRes.data.threads || []).filter(thread => {
  return thread.messages.some(msg => {
    const from = msg.from?.toLowerCase() || "";
    const to = msg.to?.toLowerCase() || "";

    const isFromContact = syncedEmails.some(e => from.includes(e));
    const isToContact = syncedEmails.some(e => to.includes(e));

    const isFromSupport = from.includes(SUPPORT_EMAIL);
    const isToSupport = to.includes(SUPPORT_EMAIL);

    // 📥 INBOX: Contact → Support
    if (type === "inbox") {
      return isFromContact && isToSupport;
    }

    // 📤 SENT: Support → Contact
    if (type === "sent") {
      return isFromSupport && isToContact;
    }

    return false;
  });
});

setThreads(filteredThreads);


    //   console.log("email thredas",emailsRes.data.threads || []);
    console.log("Filtered inbox:", filteredThreads);

    } catch (error) {
      console.error("Error fetching emails", error);
    }
  };

  // 🔹 Extract name
  const getName = (from) => from?.replace(/<.*?>/g, "").trim();

  // 🔹 Thread title
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

//     const count = thread.messages.length;

//     return count > 1
//       ? `${[...names].join(", ")} ${count}`
//       : `${[...names].join(", ")}`;
//   };

const formatThreadTitle = (thread) => {
  let contactEmail = "";
  let contactName = "Unknown";

  thread.messages.forEach(msg => {
    const from = msg.from?.toLowerCase() || "";
    const to = msg.to?.toLowerCase() || "";

    if (from.includes(SUPPORT_EMAIL)) {
      contactEmail = to;
    } else {
      contactEmail = from;
    }
  });

  const email = Object.keys(contactMap).find(e => contactEmail.includes(e));

  if (email) {
    contactName = contactMap[email];
  } else {
    contactName = getName(contactEmail);
  }

  const count = thread.messages.length;

  if (type === "sent") {
    return `me → ${contactName} (${count})`;
  }

  return `${contactName} → me (${count})`;
};


  // 🔹 Preview text
  const getPreview = (html, length = 80) => {
    const text = html.replace(/<[^>]*>?/gm, "");
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  // 🔹 Attachment preview
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

  // 🔹 Send Reply
  const sendReply = async () => {
    const thread = threads.find((t) => t._id === selectedThreadId);
    if (!thread) return;

    const lastEmail = thread.messages[thread.messages.length - 1];

    await axios.post("http://127.0.0.1:8015/emailsync/user/reply", {
      to: lastEmail.from,
      subject: lastEmail.subject || "No Subject",
      message: replyText,
    });

    setReplyText("");
    alert("Reply sent!");
  };

  // 🔹 Mark Read
  const markThreadAsRead = async (threadId) => {
    try {
      await axios.patch(
        "http://127.0.0.1:8015/emailsync/messagesList/threads/mark-read",
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
      {/* Top Bar */}
      <Box
        sx={{
          height: "60px",
          border: "1px solid #ddd",
          borderRadius: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: 2,
        }}
      >
        <Button variant="contained" onClick={() => setOpenDrawer(true)}>
          New Email
        </Button>
      </Box>

      {/* Main Layout */}
      <Box
        sx={{
          display: "flex",
          height: "90vh",
          bgcolor: "#fff",
          border: "1px solid #ddd",
          borderRadius: 2,
        }}
      >
        {/* LEFT: Inbox / Sent */}
        <Box
          sx={{
            width: "35%",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <List>
            {threads.map((thread) => {
              const latest = thread.latest;

              return (
                <ListItemButton
                  key={thread._id}
                  onClick={() => {
                    setSelectedThreadId(thread._id);
                    markThreadAsRead(thread._id);
                  }}
                  sx={{
                    borderBottom: "1px solid #eee",
                    "&:hover": { bgcolor: "#f5f5f5" },
                    bgcolor:
                      selectedThreadId === thread._id
                        ? "#f0f4ff"
                        : "transparent",
                  }}
                >
                  <Box>
                    <Typography fontWeight={latest.read ? 400 : 700} color={"red"}>
                      {formatThreadTitle(thread)}
                    </Typography>

                    <Typography fontWeight={latest.read ? 400 : 600}>
                      {latest.subject || "(No Subject)"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {getPreview(latest.body)}
                    </Typography>
                  </Box>
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* RIGHT: Email Viewer */}
        <Box sx={{ width: "65%", p: 2, overflowY: "auto" }}>
          {selectedThread ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  borderBottom: "1px solid #ddd",
                  pb: 1,
                }}
              >
                <Typography variant="h6">
                  {selectedThread.latest.subject}
                </Typography>

                <CloseIcon
                  sx={{ cursor: "pointer", color: "#555" }}
                  onClick={() => setSelectedThreadId(null)}
                />
              </Box>

              {selectedThread.messages.map((email) => (
                <Box
                  key={email.messageId}
                  sx={{ borderBottom: "1px solid #ddd", mb: 2, pb: 2 }}
                >
                  <Typography fontWeight="bold">
                    {getName(email.from)}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {new Date(email.createdAt).toLocaleString()}
                  </Typography>

                  <Box
                    sx={{ mt: 1 }}
                    dangerouslySetInnerHTML={{ __html: email.body }}
                  />

                  {email.attachments?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography fontWeight="bold">Attachments</Typography>

                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {email.attachments.map((att, i) => (
                          <Box
                            key={i}
                            onClick={() => openAttachment(att)}
                            sx={{
                              border: "1px solid #ddd",
                              borderRadius: 2,
                              p: 1,
                              cursor: "pointer",
                              bgcolor: "#fff",
                              "&:hover": { bgcolor: "#f0f0f0" },
                            }}
                          >
                            <Typography fontSize={13}>
                              {att.filename}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}

              {/* 🔹 Reply Box */}
              {type === "inbox" && (
                <Box sx={{ mt: 3, borderTop: "1px solid #ddd", pt: 2 }}>
                  <Typography fontWeight="bold" mb={1}>
                    Reply
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                  >
                    <Button variant="contained" onClick={sendReply}>
                      Send
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Typography color="text.secondary">
              Select an email to read
            </Typography>
          )}
        </Box>
      </Box>

      {/* Attachment Preview */}
      {previewFile && (
        <Box
          onClick={() => setPreviewFile(null)}
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
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: "85%",
              height: "90%",
              bgcolor: "#fff",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 1,
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography fontWeight="bold">
                {previewFile.filename}
              </Typography>
              <Button onClick={() => setPreviewFile(null)}>Close</Button>
            </Box>

            <Box sx={{ height: "100%" }}>
              <iframe
                src={previewFile.url}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Preview"
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* Compose Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 400, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Compose Email</Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2">
            Email draft form goes here…
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default EmailViewer;
