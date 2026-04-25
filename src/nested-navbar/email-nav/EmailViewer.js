

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ComposeEmailDrawer from "./ComposeDrawer";
import { Avatar as ShadAvatar, AvatarFallback } from "../../components/ui/avatar";
import { Button as ShadButton } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Search, Reply, X, Pencil, Paperclip, Send as SendIcon,
  ChevronDown, ChevronUp, Mail,
} from "lucide-react";

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
  const [threadTab, setThreadTab] = useState(0); // 0 = All, 1 = Unread
  const [replyText, setReplyText] = useState("");
  const [replyingToMessageId, setReplyingToMessageId] = useState(null);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
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

  const visibleThreads = threads.filter((t) => {
    if (threadTab === 1) return !t.latest?.read;
    return true;
  });

  return (
    <div className="flex h-full overflow-hidden bg-background">

      {/* ══════════════════════════════════
          PANEL 1 — Thread List
      ══════════════════════════════════ */}
      <div className="w-[300px] shrink-0 flex flex-col border-r border-border/40 h-full overflow-hidden bg-background">

        {/* Header */}
        <div className="px-4 pt-4 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[15px] font-semibold text-foreground tracking-tight capitalize">{type}</h1>
            <ShadButton
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setOpenDrawer(true)}
              title="Compose"
            >
              <Pencil className="h-3.5 w-3.5" />
            </ShadButton>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search…"
              className="pl-8 h-8 text-[12px] rounded-md border-0 bg-muted/50 focus-visible:bg-muted focus-visible:ring-1 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/40 -mx-4 px-4">
            {["All", "Unread"].map((label, i) => (
              <button
                key={label}
                onClick={() => setThreadTab(i)}
                className={`px-3 py-2 text-[12px] font-medium border-b-2 -mb-px transition-colors duration-150 ${
                  threadTab === i
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {i === 1 && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold px-1">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Thread rows */}
        <div className="flex-1 overflow-y-auto">
          {visibleThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Mail className="h-8 w-8 text-muted-foreground/20" />
              <p className="text-[12px] text-muted-foreground">No emails found</p>
            </div>
          ) : (
            visibleThreads.map((thread) => {
              const latest = thread.latest;
              const isSelected = selectedThreadId === thread._id;
              const isUnread = !latest?.read;

              return (
                <div
                  key={thread._id}
                  onClick={() => { setSelectedThreadId(thread._id); setExpandedMessageId(null); setReplyingToMessageId(null); markThreadAsRead(thread._id); }}
                  className={`group flex items-start gap-2.5 px-4 py-2.5 cursor-pointer transition-colors duration-150 ${
                    isSelected ? "bg-muted" : "hover:bg-muted/40"
                  }`}
                >
                  {/* Unread dot */}
                  <div className="shrink-0 mt-[7px]">
                    <div className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isUnread ? "bg-primary" : "bg-transparent"
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`text-[12.5px] truncate ${
                        isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/70"
                      }`}>
                        {formatThreadTitle(thread)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0 tabular-nums">
                        {getRelativeTime(latest?.createdAt || latest?.date)}
                      </span>
                    </div>
                    <div className={`text-[12px] truncate ${
                      isUnread ? "font-semibold text-foreground" : "font-normal text-muted-foreground"
                    }`}>
                      {latest?.subject || "(No Subject)"}
                    </div>
                    <div className="text-[11px] text-muted-foreground/55 truncate">
                      {getPreview(latest?.body || "", 60)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          PANEL 2 — Email Content
      ══════════════════════════════════ */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
        {selectedThread ? (
          <>
            {/* Header: subject left, actions right */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0 gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-semibold text-foreground leading-tight truncate">
                  {selectedThread.latest?.subject || "(No Subject)"}
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
                  {selectedThread.messages.length} message{selectedThread.messages.length !== 1 ? "s" : ""}
                  {" · "}
                  {getName(selectedThread.latest?.from)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ShadButton variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => setSelectedThreadId(null)}>
                  <X className="h-3.5 w-3.5" />
                </ShadButton>
              </div>
            </div>

            {/* Scrollable messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4">
                {selectedThread.messages.map((email, idx) => {
                  const isExpanded = expandedMessageId === (email.messageId || idx);
                  const emailAvatarBg = getAvatarColor(email.from || "");
                  const emailInitials = getInitialsFromStr(email.from || "");

                  return (
                    <div
                      key={email.messageId || idx}
                      className={`${idx < selectedThread.messages.length - 1 ? "border-b border-border/40" : ""}`}
                    >
                      {/* Collapsed row */}
                      <div
                        onClick={() => setExpandedMessageId(isExpanded ? null : (email.messageId || idx))}
                        className={`flex items-start gap-3 py-3 cursor-pointer transition-colors duration-100 rounded-md ${
                          isExpanded ? "" : "hover:bg-muted/40"
                        }`}
                      >
                        <ShadAvatar className="h-8 w-8 shrink-0">
                          <AvatarFallback style={{ backgroundColor: emailAvatarBg }} className="text-white text-[10px] font-bold">
                            {emailInitials}
                          </AvatarFallback>
                        </ShadAvatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between">
                            <div className="min-w-0 flex items-baseline gap-2">
                              <span className="text-[13px] font-semibold text-foreground">{getName(email.from)}</span>
                              <span className="text-[11px] text-muted-foreground truncate">
                                to {Array.isArray(email.to) ? email.to.join(", ") : email.to}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-3">
                              <span className="text-[11px] text-muted-foreground tabular-nums">
                                {new Date(email.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                              </span>
                              {isExpanded
                                ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                                : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                              }
                            </div>
                          </div>
                          {!isExpanded && (
                            <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                              {getPreview(email.body || "", 120)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Expanded body */}
                      {isExpanded && (
                        <div className="ml-11 pb-4">
                          <div
                            className="text-[13px] leading-6 text-foreground break-words [&_p]:mb-3 [&_a]:text-primary [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: email.body }}
                          />

                          {/* Attachments */}
                          {email.attachments?.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border/40">
                              <p className="flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                <Paperclip className="h-2.5 w-2.5" />
                                {email.attachments.length} Attachment{email.attachments.length > 1 ? "s" : ""}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {email.attachments.map((att, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => openAttachment(att)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/60 bg-muted/30 hover:bg-muted hover:border-border transition-colors text-left"
                                  >
                                    <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="text-[11px] font-medium text-foreground truncate max-w-[160px]">{att.filename}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Per-email reply */}
                          {replyingToMessageId === (email.messageId || idx) ? (
                            <div className="mt-3 rounded-lg border border-border bg-muted/20 overflow-hidden">
                              <textarea
                                autoFocus
                                placeholder={`Reply to ${getName(email.from)}…`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={3}
                                className="w-full bg-transparent px-4 pt-3 pb-1 text-[13px] text-foreground resize-none outline-none placeholder:text-muted-foreground/50"
                              />
                              <div className="flex items-center justify-between px-3 py-2 border-t border-border/40">
                                <ShadButton variant="ghost" size="sm" className="h-7 text-[11.5px] rounded-md text-muted-foreground hover:text-foreground" onClick={() => { setReplyingToMessageId(null); setReplyText(""); }}>
                                  Cancel
                                </ShadButton>
                                <ShadButton size="sm" className="h-7 px-4 text-[12px] rounded-md gap-1.5 font-medium" onClick={() => { sendReply(); setReplyingToMessageId(null); }}>
                                  <SendIcon className="h-3.5 w-3.5" /> Send
                                </ShadButton>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3">
                              <ShadButton variant="outline" size="sm" className="h-7 px-3 text-[12px] rounded-md gap-1.5" onClick={() => { setReplyingToMessageId(email.messageId || idx); setReplyText(""); }}>
                                <Reply className="h-3.5 w-3.5" /> Reply
                              </ShadButton>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Mail className="h-8 w-8 text-muted-foreground/20" />
            <p className="text-[13px] font-medium text-foreground/60">Select a thread to read</p>
          </div>
        )}
      </div>

      {/* ── Attachment preview modal ── */}
      {previewFile && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="w-[85%] h-[90%] bg-card rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-[13px] font-semibold text-foreground">{previewFile.filename}</span>
              <ShadButton variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg" onClick={() => setPreviewFile(null)}>
                <X className="h-4 w-4" />
              </ShadButton>
            </div>
            <div className="flex-1 overflow-hidden">
              {previewFile.mimeType?.startsWith("image/") && (
                <img src={previewFile.url} alt={previewFile.filename} className="w-full h-full object-contain" />
              )}
              {!previewFile.mimeType?.startsWith("image/") && (
                <iframe src={previewFile.url} className="w-full h-full border-none" title="Preview" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compose drawer */}
      <ComposeEmailDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      />
    </div>
  );
};

export default EmailViewer;
