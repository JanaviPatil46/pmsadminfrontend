import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { SideSheet } from "../../components/ui/side-sheet";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { X, Mail, ChevronDown, Check, Send } from "lucide-react";

const ComposeEmailDrawer = ({ open, onClose }) => {
  const { data } = useParams();
const [sending, setSending] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
   const [emailTemplate, setEmailTemplate] = useState("");
    const [emailTemplatedata, setEmailTemplateData] = useState([]);
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
    const fetchemailTemplateData = async () => {
      try {
        const url = `${EMAIL_API}/workflow/emailtemplate`;
        const response = await fetch(url);
        const data = await response.json();
        setEmailTemplateData(data.emailTemplate);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    useEffect(() => {
      fetchemailTemplateData();
    }, []);
    const emailoptions = emailTemplatedata.map((emailtemplate) => ({
      value: emailtemplate._id,
      label: emailtemplate.templatename,
    }));
  
    const handleEmailtemp = (event, selectedOption) => {
      if (selectedOption && selectedOption.value) {
        setEmailTemplate(selectedOption);
        fetchDataemaildetails(selectedOption.value);
      }
    };
  
    const fetchDataemaildetails = async (selecttempId) => {
      try {
        const url = `${EMAIL_API}/workflow/emailtemplate/${selecttempId}`;
        const response = await fetch(url);
        const data = await response.json();
  
        setDescription(data.emailTemplate.emailbody);
      
  
        setSubject(data.emailTemplate.emailsubject);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
  const handleEditorChange = (content) => {
    setDescription(content);
  };

  // 🔹 Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${data}/contacts`,
      );

      const formatted = (res.data.data || [])

        .filter((c) => c.canEmailSync && c.contact?.email)
        .map((c) => ({
          label: c.contact.contactName || c.contact.email,
          email: c.contact.email,
          }));

      setContacts(formatted);
    } catch (err) {
      console.error("Failed to load contacts", err);
    }
  };

  const handleSend = async () => {
  if (!selectedContacts.length) {
    alert("Please select at least one contact");
    return;
  }

  const payload = {
    clientEmail: selectedContacts.map((c) => c.email),
    accountId: data,
    emailsubject: subject,
    emailbody: description,
  };

  try {
    setSending(true); // 🔒 disable button

    await fetch("https://www.snptaxes.com/api/accounts/sendComposeEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    alert("Email sent successfully!");

    setSelectedContacts([]);
    setDescription("");
    setSubject("");
    setEmailTemplate("");
    onClose();
  } catch (err) {
    console.error("Send failed", err);
    alert("Failed to send email");
  } finally {
    setSending(false); // 🔓 enable button again
  }
};

  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const contactDropdownRef = useRef(null);

  const filteredContacts = contacts.filter(
    (c) =>
      c.label.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const toggleContact = (contact) => {
    setSelectedContacts((prev) =>
      prev.some((c) => c.email === contact.email)
        ? prev.filter((c) => c.email !== contact.email)
        : [...prev, contact]
    );
  };

  const fieldCls = "w-full rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";
  const labelCls = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5";

  return (
    <SideSheet
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title={
        <span className="flex items-center gap-2">
          <Mail size={16} className="text-primary" />
          Compose Email
        </span>
      }
      size="lg"
      hideDefaultFooter
      footer={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleSend}
            disabled={sending}
          >
            <Send size={12} />
            {sending ? "Sending…" : "Send Email"}
          </Button>
        </div>
      }
    >
        <div className="flex flex-col gap-4">

          {/* Email Template */}
          <div>
            <label className={labelCls}>Template</label>
            <select
              value={emailTemplate?.value || ""}
              onChange={(e) => {
                const opt = emailoptions.find(o => o.value === e.target.value);
                if (opt) handleEmailtemp(null, opt);
                else handleEmailtemp(null, null);
              }}
              className={fieldCls}
            >
              <option value="">Select a template (optional)</option>
              {emailoptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <Separator className="opacity-50" />

          {/* To field — custom multi-select */}
          <div ref={contactDropdownRef}>
            <label className={labelCls}>To</label>
            <div
              className="min-h-[38px] w-full rounded-lg border border-input bg-muted/30 px-2 py-1.5 flex flex-wrap gap-1 cursor-pointer focus-within:ring-2 focus-within:ring-ring"
              onClick={() => setContactDropdownOpen((p) => !p)}
            >
              {selectedContacts.map((c) => (
                <span key={c.email} className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-[11px] font-medium px-2 py-0.5 rounded-md">
                  {c.label}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleContact(c); }}
                    className="text-primary/60 hover:text-primary"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {selectedContacts.length === 0 && (
                <span className="text-sm text-muted-foreground py-0.5 pl-1">Select contacts…</span>
              )}
              <ChevronDown size={14} className="ml-auto self-center text-muted-foreground" />
            </div>
            {contactDropdownOpen && (
              <div className="mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
                <div className="px-2 pt-2 pb-1">
                  <Input
                    placeholder="Search contacts…"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 text-xs"
                    autoFocus
                  />
                </div>
                {filteredContacts.length === 0 && (
                  <p className="text-xs text-muted-foreground px-3 py-2">No contacts found</p>
                )}
                {filteredContacts.map((c) => {
                  const isSelected = selectedContacts.some((s) => s.email === c.email);
                  return (
                    <button
                      key={c.email}
                      type="button"
                      onClick={() => toggleContact(c)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/60 text-left ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? "bg-primary border-primary" : "border-border"
                      }`}>
                        {isSelected && <Check size={10} className="text-primary-foreground" />}
                      </span>
                      <span className="font-medium text-foreground">{c.label}</span>
                      <span className="text-muted-foreground text-xs ml-auto">{c.email}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className={labelCls}>Subject</label>
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Body */}
          <div>
            <label className={labelCls}>Message</label>
            <Editor onChange={handleEditorChange} initialContent={description} />
          </div>
        </div>
    </SideSheet>
  );
};

export default ComposeEmailDrawer;
