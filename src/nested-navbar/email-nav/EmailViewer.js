

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
      <div className="flex h-full overflow-hidden bg-card">

        {/* ── LEFT: Thread list panel ── */}
        <div className="w-[320px] shrink-0 flex flex-col border-r border-border h-full overflow-hidden">

          {/* Search + Compose header */}
          <div className="px-3 pt-3 pb-2.5 border-b border-border shrink-0 space-y-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search"
                className="pl-8 h-8 text-xs rounded-lg border-border bg-muted"
              />
            </div>
            <ShadButton
              size="sm"
              className="w-full h-8 text-xs rounded-lg gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setOpenDrawer(true)}
            >
              <Pencil size={11} />
              Compose
            </ShadButton>
          </div>

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <span className="text-3xl opacity-20">✉</span>
                <p className="text-xs text-muted-foreground">No emails found</p>
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
                    className={`flex items-start gap-2.5 px-3.5 py-3 cursor-pointer border-b border-border transition-colors ${
                      isSelected
                        ? "border-l-2 border-l-primary bg-primary/5"
                        : "border-l-2 border-l-transparent hover:bg-muted/50"
                    }`}
                  >
                    {/* Avatar */}
                    <ShadAvatar className="h-8 w-8 shrink-0 mt-0.5">
                      <AvatarFallback style={{ backgroundColor: avatarBg }} className="text-white text-[10px] font-bold">
                        {initials}
                      </AvatarFallback>
                    </ShadAvatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-[12px] truncate max-w-[140px] ${
                          isUnread ? "font-bold text-foreground" : "font-medium text-foreground/80"
                        }`}>
                          {formatThreadTitle(thread)}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                          {getRelativeTime(latest?.createdAt || latest?.date)}
                        </span>
                      </div>
                      <div className={`text-[11.5px] truncate mb-0.5 ${
                        isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}>
                        {latest?.subject || "(No Subject)"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {getPreview(latest?.body || "", 55)}
                      </div>
                    </div>

                    {/* Unread dot */}
                    {isUnread && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT: Email viewer panel ── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-card">
          {selectedThread ? (
            <>
              {/* Subject + action bar */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
                <h2 className="text-base font-bold text-foreground leading-snug flex-1 mr-4 truncate">
                  {selectedThread.latest?.subject || "(No Subject)"}
                </h2>
                <div className="flex items-center gap-0.5 shrink-0">
                  <ShadButton variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                    <Reply size={15} />
                  </ShadButton>
                  <ShadButton variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 size={15} />
                  </ShadButton>
                  <ShadButton variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => setSelectedThreadId(null)}>
                    <X size={15} />
                  </ShadButton>
                </div>
              </div>

              {/* Messages — scrollable */}
              <div className="flex-1 overflow-y-auto px-5 pb-4">
                {selectedThread.messages.map((email, idx) => (
                  <div key={email.messageId || idx}>
                    {/* From / To header */}
                    <div className="flex items-start gap-3 py-4">
                      <ShadAvatar className="h-9 w-9 shrink-0">
                        <AvatarFallback style={{ backgroundColor: getAvatarColor(email.from || "") }} className="text-white text-[10px] font-bold">
                          {getInitialsFromStr(email.from || "")}
                        </AvatarFallback>
                      </ShadAvatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{getName(email.from)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              to {Array.isArray(email.to) ? email.to.join(", ") : email.to}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                            {new Date(email.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Email body */}
                    <div
                      className="py-4 text-sm text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: email.body }}
                    />

                    {/* Attachments */}
                    {email.attachments?.length > 0 && (
                      <div className="mb-3">
                        <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-2">
                          <Paperclip size={12} /> Attachments
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {email.attachments.map((att, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => openAttachment(att)}
                              className="border border-border rounded-lg px-3 py-1.5 text-xs text-foreground bg-muted hover:bg-muted/70 transition-colors"
                            >
                              {att.filename}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {idx < selectedThread.messages.length - 1 && (
                      <Separator className="my-2 opacity-30" />
                    )}
                  </div>
                ))}
              </div>

              {/* Reply box */}
              {type === "inbox" && (
                <div className="border-t border-border px-5 py-3 shrink-0">
                  <textarea
                    placeholder="Type your response…"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full min-h-[72px] rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-foreground resize-none outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground transition-colors"
                  />
                  <div className="flex justify-end mt-2">
                    <ShadButton
                      size="sm"
                      className="h-8 px-4 text-xs rounded-lg gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
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
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <span className="text-5xl opacity-20">✉</span>
              <p className="text-sm text-muted-foreground">Select an email to read</p>
            </div>
          )}
        </div>
      </div>

      {/* Attachment preview modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="w-[85%] h-[90%] bg-card rounded-xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
              <span className="text-sm font-semibold text-foreground">{previewFile.filename}</span>
              <ShadButton variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg" onClick={() => setPreviewFile(null)}>
                <X size={15} />
              </ShadButton>
            </div>
            <iframe src={previewFile.url} className="flex-1 border-none" title="Preview" />
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
