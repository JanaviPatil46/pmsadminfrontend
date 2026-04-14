import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Button as ShadButton } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { X, Send as SendIcon, Mail, ChevronDown, Check } from "lucide-react";

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

  const fieldCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-400";
  const labelCls = "block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="p-0 flex flex-col [&>button]:hidden"
        style={{ width: 580, maxWidth: "95vw" }}
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-[0.95rem] font-semibold text-gray-800">
            <Mail size={16} className="text-cyan-500" />
            Compose Email
          </SheetTitle>
          <ShadButton
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={15} />
          </ShadButton>
        </SheetHeader>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

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
            {/* Selected chips */}
            <div
              className="min-h-[38px] w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 flex flex-wrap gap-1 cursor-pointer focus-within:ring-2 focus-within:ring-blue-400"
              onClick={() => setContactDropdownOpen((p) => !p)}
            >
              {selectedContacts.map((c) => (
                <span key={c.email} className="inline-flex items-center gap-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-medium px-2 py-0.5 rounded-md">
                  {c.label}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleContact(c); }}
                    className="text-cyan-500 hover:text-cyan-700"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {selectedContacts.length === 0 && (
                <span className="text-sm text-gray-400 py-0.5 pl-1">Select contacts…</span>
              )}
              <ChevronDown size={14} className="ml-auto self-center text-gray-400" />
            </div>
            {/* Dropdown */}
            {contactDropdownOpen && (
              <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
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
                  <p className="text-xs text-gray-400 px-3 py-2">No contacts found</p>
                )}
                {filteredContacts.map((c) => {
                  const isSelected = selectedContacts.some((s) => s.email === c.email);
                  return (
                    <button
                      key={c.email}
                      type="button"
                      onClick={() => toggleContact(c)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left ${
                        isSelected ? "bg-cyan-50" : ""
                      }`}
                    >
                      <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? "bg-cyan-500 border-cyan-500" : "border-gray-300"
                      }`}>
                        {isSelected && <Check size={10} className="text-white" />}
                      </span>
                      <span className="font-medium text-gray-700">{c.label}</span>
                      <span className="text-gray-400 text-xs ml-auto">{c.email}</span>
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
              className="h-9 text-sm bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Body */}
          <div>
            <label className={labelCls}>Message</label>
            <Editor onChange={handleEditorChange} initialContent={description} />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3 flex justify-end gap-2 shrink-0">
          <ShadButton
            variant="outline"
            size="sm"
            className="h-8 px-4 text-xs rounded-lg"
            onClick={onClose}
          >
            Cancel
          </ShadButton>
          <ShadButton
            size="sm"
            className="h-8 px-4 text-xs rounded-lg gap-1.5"
            style={{ backgroundColor: sending ? "#aaa" : "#00ACC1", color: "#fff" }}
            onClick={handleSend}
            disabled={sending}
          >
            <SendIcon size={12} />
            {sending ? "Sending..." : "Send Email"}
          </ShadButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ComposeEmailDrawer;
