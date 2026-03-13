// import {
//   Box,
//   Drawer,
//   Typography,
//   IconButton,
//   TextField,
//   Button,
//   Autocomplete,
//   Chip,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const ComposeEmailDrawer = ({ open, onClose }) => {
//   const { data } = useParams(); // account id
//   const [contacts, setContacts] = useState([]);
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");

//   // 🔹 Fetch account contacts
//   useEffect(() => {
//     if (!open) return;

//     const fetchContacts = async () => {
//       const res = await axios.get(
//         `https://www.snptaxes.com/api/accounts/${data}/contacts`
//       );

//       const emailContacts = (res.data.data || [])
//         .filter(item => item.canEmailSync && item.contact?.email)
//         .map(item => ({
//           label: item.contact.contactName || item.contact.email,
//           email: item.contact.email,
//         }));

//       setContacts(emailContacts);
//     };

//     fetchContacts();
//   }, [open, data]);

//   // 🔹 Send Email
//   const sendEmail = async () => {
//     const toEmails = selectedContacts.map(c => c.email);

//     if (!toEmails.length) {
//       alert("Please select at least one recipient");
//       return;
//     }

//     await axios.post("http://127.0.0.1:8015/emailsync/user/send", {
//       to: toEmails,        // multiple emails
//       subject,
//       message,
//     });

//     setSelectedContacts([]);
//     setSubject("");
//     setMessage("");
//     onClose();
//   };

//   return (
//     <Drawer anchor="right" open={open} onClose={onClose}>
//       <Box sx={{ width: 420, p: 3 }}>
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography variant="h6">Compose Email</Typography>
//           <IconButton onClick={onClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         {/* TO (Multi Select) */}
//         <Autocomplete
//           multiple
//           options={contacts}
//           value={selectedContacts}
//           onChange={(e, newValue) => setSelectedContacts(newValue)}
//           getOptionLabel={(option) => `${option.label} (${option.email})`}
//           renderTags={(value, getTagProps) =>
//             value.map((option, index) => (
//               <Chip
//                 label={option.label}
//                 {...getTagProps({ index })}
//                 key={option.email}
//               />
//             ))
//           }
//           renderInput={(params) => (
//             <TextField {...params} label="To" placeholder="Select contacts" />
//           )}
//           sx={{ mb: 2 }}
//         />

//         {/* Subject */}
//         <TextField
//           fullWidth
//           label="Subject"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//           sx={{ mb: 2 }}
//         />

//         {/* Message */}
//         <TextField
//           fullWidth
//           multiline
//           rows={6}
//           label="Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           sx={{ mb: 2 }}
//         />

//         {/* Send Button */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//           <Button variant="contained" onClick={sendEmail}>
//             Send
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default ComposeEmailDrawer;

import React, { useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  Chip,
  Autocomplete,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import axios from "axios";
import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Button as ShadButton } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { X, Send as SendIcon, Mail } from "lucide-react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
        // const url = `${API_KEY}/workflow/emailtemplate/`;
        const url = `${EMAIL_API}/workflow/emailtemplate`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setEmailTemplateData(data.emailTemplate);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
   useEffect(() => {
      // fetchData();
      fetchemailTemplateData();
    }, []);
    const emailoptions = emailTemplatedata.map((emailtemplate) => ({
      value: emailtemplate._id,
      label: emailtemplate.templatename,
    }));
  
    const handleEmailtemp = (event, selectedOption) => {
      console.log(selectedOption);
      if (selectedOption && selectedOption.value) {
        setEmailTemplate(selectedOption);
        fetchDataemaildetails(selectedOption.value);
      } else {
        console.error("Invalid selected option:", selectedOption);
      }
    };
  
    const fetchDataemaildetails = async (selecttempId) => {
      try {
        const url = `${EMAIL_API}/workflow/emailtemplate/${selecttempId}`;
        const response = await fetch(url);
        const data = await response.json();
  
        console.log("data email templates",data);
  
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
          // accountId: c._id, // used for selectedAccounts
        }));

      setContacts(formatted);
      console.log("Contacts loaded:", formatted);
    } catch (err) {
      console.error("Failed to load contacts", err);
    }
  };

  // 🔹 Send Email using YOUR payload
  // const handleSend = async () => {
  //   if (!selectedContacts.length) {
  //     alert("Please select at least one contact");
  //     return;
  //   }

  //   const payload = {
  //     clientEmail: selectedContacts.map((c) => c.email),
  //     accountId: data,
  //     emailsubject: subject,
  //     emailbody: description,
  //   };
  //   console.log("Sending email with payload:", payload);
  //   try {
  //     await fetch("https://www.snptaxes.com/api/accounts/sendComposeEmail", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     alert("Email sent successfully!");

  //     setSelectedContacts([]);
  //     setDescription("");
  //     //   setHtmlContent("");
  //     onClose();
  //   } catch (err) {
  //     console.error("Send failed", err);
  //     alert("Failed to send email");
  //   }
  // };
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

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="p-0 flex flex-col [&>button]:hidden"
        style={{ width: 580, maxWidth: "95vw" }}
      >
        {/* Header */}
        <SheetHeader
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          <SheetTitle
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#1a1a1a",
            }}
          >
            <Mail size={16} style={{ color: "#00ACC1" }} />
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
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Email Template */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
              Template
            </label>
            <Autocomplete
              options={emailoptions}
              size="small"
              value={emailTemplate}
              onChange={handleEmailtemp}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.label || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select a template (optional)"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13, backgroundColor: "#fafafa" },
                  }}
                />
              )}
            />
          </div>

          <Separator style={{ opacity: 0.5 }} />

          {/* To field */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
              To
            </label>
            <Autocomplete
              multiple
              options={contacts}
              value={selectedContacts}
              onChange={(e, newValue) => setSelectedContacts(newValue)}
              disableCloseOnSelect
              isOptionEqualToValue={(option, value) => option.email === value.email}
              getOptionLabel={(option) => `${option.label} (${option.email})`}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} sx={{ mr: 1 }} />
                  {option.label} ({option.email})
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.label}
                    {...getTagProps({ index })}
                    key={option.email}
                    size="small"
                    sx={{ height: 22, fontSize: 11, borderRadius: "6px" }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select contacts"
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13, backgroundColor: "#fafafa" },
                  }}
                />
              )}
            />
          </div>

          {/* Subject */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
              Subject
            </label>
            <TextField
              fullWidth
              size="small"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13, backgroundColor: "#fafafa" },
              }}
            />
          </div>

          {/* Body */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
              Message
            </label>
            <Editor onChange={handleEditorChange} initialContent={description} />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            flexShrink: 0,
          }}
        >
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
