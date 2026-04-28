import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { SideSheet } from "../../components/ui/side-sheet";
import { SheetTitle } from "../../components/ui/sheet";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { Check, ChevronDown, Mail, Send, X } from "lucide-react";
import { cn } from "../../lib/utils";
// import { SheetTitle } from "@/components/ui/sheet";

const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;

const ComposeEmailDrawer = ({ open, onClose }) => {
  const { data: accountId } = useParams();

  const [contacts, setContacts] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [sending, setSending] = useState(false);

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templateOpen, setTemplateOpen] = useState(false);

  const [contactSearch, setContactSearch] = useState("");
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    axios
      .get(`https://www.snptaxes.com/api/accounts/${accountId}/contacts`)
      .then((res) => {
        const formatted = (res.data.data || [])
          .filter((c) => c.canEmailSync && c.contact?.email)
          .map((c) => ({
            label: c.contact.contactName || c.contact.email,
            email: c.contact.email,
          }));
        setContacts(formatted);
      })
      .catch((err) => console.error("Failed to load contacts", err));
  }, [accountId]);

  useEffect(() => {
    fetch(`${EMAIL_API}/workflow/emailtemplate`)
      .then((res) => res.json())
      .then((d) => setEmailTemplates(d.emailTemplate || []))
      .catch((err) => console.error("Failed to load templates", err));
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (contactRef.current && !contactRef.current.contains(e.target)) {
        setContactDropdownOpen(false);
      }
    };
    if (contactDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [contactDropdownOpen]);

  const applyTemplate = useCallback(
    (id) => {
      setTemplateId(id);
      setTemplateOpen(false);
      if (!id) return;
      fetch(`${EMAIL_API}/workflow/emailtemplate/${id}`)
        .then((res) => res.json())
        .then((d) => {
          setSubject(d.emailTemplate?.emailsubject || "");
          setBody(d.emailTemplate?.emailbody || "");
        })
        .catch((err) => console.error("Failed to load template detail", err));
    },
    []
  );

  const toggleContact = (email) => {
    setSelectedContacts((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const removeContact = (email) => {
    setSelectedContacts((prev) => prev.filter((e) => e !== email));
  };

  const reset = () => {
    setSelectedContacts([]);
    setSubject("");
    setBody("");
    setTemplateId("");
    setContactSearch("");
    setContactDropdownOpen(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSend = async () => {
    if (!selectedContacts.length) return;
    try {
      setSending(true);
      await fetch("https://www.snptaxes.com/api/accounts/sendComposeEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail: selectedContacts,
          accountId,
          emailsubject: subject,
          emailbody: body,
        }),
      });
      reset();
      onClose();
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.label.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const selectedTemplateName =
    emailTemplates.find((t) => t._id === templateId)?.templatename ?? null;

  const labelCls = "text-sm font-medium text-foreground";

  return (
    <SideSheet
      open={open}
      onOpenChange={(o) => !o && handleClose()}
      title={
        <span className="flex items-center gap-2 text-foreground">
          {/* <Mail size={15} className="text-primary" /> */}
          Compose Email
        </span>
      }
      size="lg"
      hideDefaultFooter
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={sending}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={onSend}
            disabled={sending || !selectedContacts.length}
          >
            <Send size={13} />
            {sending ? "Sending…" : "Send Email"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">

        {/* ── TEMPLATE ── Command+Popover searchable */}
        <div className="space-y-1.5">
          <label className={labelCls}>Template</label>
          {/* <SheetTitle>Template</SheetTitle> */}
          <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors",
                  "hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring",
                  !selectedTemplateName && "text-muted-foreground"
                )}
              >
                <span className="truncate">
                  {selectedTemplateName ?? "Select a template (optional)"}
                </span>
                <ChevronDown size={14} className="shrink-0 ml-2 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-[--radix-popover-trigger-width]"
              align="start"
              sideOffset={4}
            >
              <Command>
                <CommandInput placeholder="Search templates…" className="h-9 text-sm" />
                <CommandList className="max-h-64 overflow-y-auto">
                  <CommandEmpty>
                    <span className="text-xs text-muted-foreground">No templates found</span>
                  </CommandEmpty>
                  <CommandGroup>
                    {emailTemplates.map((t) => (
                      <CommandItem
                        key={t._id}
                        value={t.templatename}
                        onSelect={() => applyTemplate(t._id)}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            templateId === t._id
                              ? "border-primary bg-primary"
                              : "border-border"
                          )}
                        >
                          {templateId === t._id && (
                            <Check size={10} className="text-primary-foreground" />
                          )}
                        </span>
                        <span className="truncate">{t.templatename}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* ── TO (multi-select contacts) ── */}
        <div className="space-y-1.5" ref={contactRef}>
          <label className={labelCls}>To</label>
          <div
            className={cn(
              "rounded-lg border border-input bg-background",
              contactDropdownOpen && "ring-2 ring-ring"
            )}
          >
            {/* Selected tags */}
            {selectedContacts.length > 0 && (
              <div className="flex flex-wrap gap-1 px-2 pt-2">
                {selectedContacts.map((email) => {
                  const contact = contacts.find((c) => c.email === email);
                  return (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                    >
                      {contact?.label ?? email}
                      <button
                        type="button"
                        onClick={() => removeContact(email)}
                        className="text-primary/60 hover:text-primary transition-colors"
                      >
                        <X size={9} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Search input */}
            <div className="px-2 py-1.5">
              <Input
                placeholder={
                  selectedContacts.length ? "Add more…" : "Search contacts…"
                }
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                onFocus={() => setContactDropdownOpen(true)}
                className="border-0 bg-transparent p-0 h-7 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
              />
            </div>

            {/* Dropdown list */}
            {contactDropdownOpen && (
              <div className="border-t border-border max-h-48 overflow-y-auto rounded-b-lg">
                {filteredContacts.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    No contacts found
                  </p>
                ) : (
                  filteredContacts.map((c) => {
                    const isSelected = selectedContacts.includes(c.email);
                    return (
                      <button
                        key={c.email}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          toggleContact(c.email);
                          setContactSearch("");
                        }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors",
                          "hover:bg-muted/60",
                          isSelected && "bg-primary/5"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            isSelected ? "border-primary bg-primary" : "border-border"
                          )}
                        >
                          {isSelected && (
                            <Check size={10} className="text-primary-foreground" />
                          )}
                        </span>
                        <span className="font-medium text-foreground truncate">
                          {c.label}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground shrink-0">
                          {c.email}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── SUBJECT ── */}
        <div className="space-y-1.5">
          <label className={labelCls}>Subject</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="bg-background"
          />
        </div>

        {/* ── MESSAGE ── */}
        <div className="space-y-1.5">
          <label className={labelCls}>Message</label>
          <Editor initialContent={body} onChange={setBody} />
        </div>

      </div>
    </SideSheet>
  );
};

export default ComposeEmailDrawer;