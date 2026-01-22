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
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Checkbox,
  Chip,
  Drawer,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import axios from "axios";
import { useParams } from "react-router-dom";
import Editor from "./Editor";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ComposeEmailDrawer = ({ open, onClose }) => {
  const { data } = useParams();

  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [subject, setSubject] = useState("");
   const [description, setDescription] = useState("");
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
        `https://www.snptaxes.com/api/accounts/${data}/contacts`
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
console.log("Sending email with payload:", payload);
    try {
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
    //   setHtmlContent("");
      onClose();
    } catch (err) {
      console.error("Send failed", err);
      alert("Failed to send email");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600, p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Compose Email</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* To Field */}
       <Autocomplete
  multiple
  options={contacts}
  value={selectedContacts}
  onChange={(e, newValue) => setSelectedContacts(newValue)}
  disableCloseOnSelect

  // 🔥 IMPORTANT FIX
  isOptionEqualToValue={(option, value) =>
    option.email === value.email
  }

  getOptionLabel={(option) => `${option.label} (${option.email})`}

  renderOption={(props, option, { selected }) => (
    <li {...props}>
      <Checkbox
        icon={icon}
        checkedIcon={checkedIcon}
        checked={selected}
        sx={{ mr: 1 }}
      />
      {option.label} ({option.email})
    </li>
  )}

  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        label={option.label}
        {...getTagProps({ index })}
        key={option.email}
      />
    ))
  }

  renderInput={(params) => (
    <TextField {...params} label="To" placeholder="Select contacts" />
  )}
  sx={{ mb: 2 }}
/>


        {/* Subject */}
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ mb: 2 }}
        />

       <Editor
                               onChange={handleEditorChange}
                               content={description}
                             />

        {/* Send Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ComposeEmailDrawer;
