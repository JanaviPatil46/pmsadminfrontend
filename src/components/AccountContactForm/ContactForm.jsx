// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setContactData,
//   addPhoneNumber,
//   updatePhoneNumber,
//   removePhoneNumber,
// } from "../../redux/accountContactSlice";

// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Grid,
//   IconButton,
// } from "@mui/material";
// import { AddCircle, RemoveCircle } from "@mui/icons-material";

// export default function ContactForm({ onBack, onSubmit }) {
//   const dispatch = useDispatch();
//   const { contactData } = useSelector((state) => state.accountContact);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let updated = { [name]: value };

//     if (["firstName", "middleName", "lastName"].includes(name)) {
//       updated.contactName = `${name === "firstName" ? value : contactData.firstName} ${name === "middleName" ? value : contactData.middleName} ${name === "lastName" ? value : contactData.lastName}`.trim();
//     }

//     dispatch(setContactData(updated));
//   };

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Contact Form
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={4}>
//           <TextField
//             fullWidth
//             label="First Name"
//             name="firstName"
//             value={contactData.firstName}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={4}>
//           <TextField
//             fullWidth
//             label="Middle Name"
//             name="middleName"
//             value={contactData.middleName}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={4}>
//           <TextField
//             fullWidth
//             label="Last Name"
//             name="lastName"
//             value={contactData.lastName}
//             onChange={handleChange}
//           />
//         </Grid>
//       </Grid>

//       <TextField
//         fullWidth
//         margin="normal"
//         label="Contact Name"
//         value={contactData.contactName}
//         disabled
//       />

//       <TextField
//         fullWidth
//         margin="normal"
//         label="Email"
//         name="email"
//         value={contactData.email}
//         onChange={handleChange}
//       />

//       <Typography variant="subtitle1" sx={{ mt: 2 }}>
//         Phone Numbers
//       </Typography>
//       {contactData.phoneNumbers.map((phone, index) => (
//         <Box key={index} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
//           <TextField
//             fullWidth
//             label={`Phone ${index + 1}`}
//             value={phone}
//             onChange={(e) =>
//               dispatch(updatePhoneNumber({ index, value: e.target.value }))
//             }
//           />
//           <IconButton
//             color="error"
//             onClick={() => dispatch(removePhoneNumber(index))}
//             disabled={contactData.phoneNumbers.length === 1}
//           >
//             <RemoveCircle />
//           </IconButton>
//           {index === contactData.phoneNumbers.length - 1 && (
//             <IconButton color="primary" onClick={() => dispatch(addPhoneNumber())}>
//               <AddCircle />
//             </IconButton>
//           )}
//         </Box>
//       ))}

//       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//         <Button variant="outlined" onClick={onBack}>
//           Back
//         </Button>
//         <Button variant="contained" onClick={onSubmit}>
//           Submit
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// working code withput exsiting contacts
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setContactData,
//   addContact,
//   removeContact,
//   addPhoneNumber,
//   updatePhoneNumber,
//   removePhoneNumber,updateContactField
// } from "../../redux/accountContactSlice";

// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Grid,
//   IconButton,
//   Divider,FormControlLabel,Checkbox,FormGroup
// } from "@mui/material";
// import { AddCircle, RemoveCircle } from "@mui/icons-material";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// export default function ContactForm({ onBack, onSubmit }) {
//   const dispatch = useDispatch();
//   const { contacts } = useSelector((state) => state.accountContact);

//   const handleChange = (index, e) => {
//     const { name, value } = e.target;
//     let updated = { [name]: value };

//     if (["firstName", "middleName", "lastName"].includes(name)) {
//       const c = { ...contacts[index], [name]: value };
//       updated.contactName = `${c.firstName} ${c.middleName} ${c.lastName}`.trim();
//     }

//     dispatch(setContactData({ index, data: updated }));
//   };

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Contact Form (Multiple)
//       </Typography>

//       {contacts.map((contact, contactIndex) => (
//         <Box
//           key={contactIndex}
//           sx={{
//             border: "1px solid #ccc",
//             borderRadius: 2,
//             p: 2,
//             mb: 3,
//             background: "#fafafa",
//           }}
//         >
//           <Typography variant="subtitle1" gutterBottom>
//             Contact #{contactIndex + 1}
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="firstName"
//                 value={contact.firstName}
//                 onChange={(e) => handleChange(contactIndex, e)}
//               />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="Middle Name"
//                 name="middleName"
//                 value={contact.middleName}
//                 onChange={(e) => handleChange(contactIndex, e)}
//               />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="lastName"
//                 value={contact.lastName}
//                 onChange={(e) => handleChange(contactIndex, e)}
//               />
//             </Grid>
//           </Grid>

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Contact Name"
//             value={contact.contactName}
//             disabled
//           />

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Email"
//             name="email"
//             value={contact.email}
//             onChange={(e) => handleChange(contactIndex, e)}
//           />

//           <Typography variant="subtitle1" sx={{ mt: 2 }}>
//             Phone Numbers
//           </Typography>
//           {/* {contact.phoneNumbers.map((phone, phoneIndex) => (
//             <Box
//               key={phoneIndex}
//               sx={{ display: "flex", alignItems: "center", mt: 1 }}
//             >
//               <TextField
//                 fullWidth
//                 label={`Phone ${phoneIndex + 1}`}
//                 value={phone}
//                 onChange={(e) =>
//                   dispatch(
//                     updatePhoneNumber({
//                       contactIndex,
//                       phoneIndex,
//                       value: e.target.value,
//                     })
//                   )
//                 }
//               />
//               <IconButton
//                 color="error"
//                 onClick={() =>
//                   dispatch(removePhoneNumber({ contactIndex, phoneIndex }))
//                 }
//                 disabled={contact.phoneNumbers.length === 1}
//               >
//                 <RemoveCircle />
//               </IconButton>
//               {phoneIndex === contact.phoneNumbers.length - 1 && (
//                 <IconButton
//                   color="primary"
//                   onClick={() => dispatch(addPhoneNumber(contactIndex))}
//                 >
//                   <AddCircle />
//                 </IconButton>
//               )}
//             </Box>
//           ))} */}
// {/* <Typography variant="subtitle1" sx={{ mt: 2 }}>
//   Phone Numbers
// </Typography> */}
// {contact.phoneNumbers.map((phone, phoneIndex) => (
//   <Box
//     key={phoneIndex}
//     sx={{ display: "flex", alignItems: "center", mt: 1 }}
//   >
//     <PhoneInput
//       country={"us"} // you can change default
//       value={phone}
//       onChange={(value) =>
//         dispatch(
//           updatePhoneNumber({
//             contactIndex,
//             phoneIndex,
//             value,
//           })
//         )
//       }
//       inputStyle={{ width: "100%" }}
//     />
//     <IconButton
//       color="error"
//       onClick={() =>
//         dispatch(removePhoneNumber({ contactIndex, phoneIndex }))
//       }
//       disabled={contact.phoneNumbers.length === 1}
//     >
//       <RemoveCircle />
//     </IconButton>
//     {phoneIndex === contact.phoneNumbers.length - 1 && (
//       <IconButton
//         color="primary"
//         onClick={() => dispatch(addPhoneNumber(contactIndex))}
//       >
//         <AddCircle />
//       </IconButton>
//     )}
//   </Box>
// ))}
// <FormGroup row sx={{ mt: 2 }}>
//   <FormControlLabel
//     control={
//       <Checkbox
//         checked={contact.login}
//         onChange={(e) =>
//           dispatch(
//             updateContactField({
//               index: contactIndex,
//               field: "login",
//               value: e.target.checked,
//             })
//           )
//         }
//       />
//     }
//     label="Login"
//   />

//   <FormControlLabel
//     control={
//       <Checkbox
//         checked={contact.notify}
//         onChange={(e) =>
//           dispatch(
//             updateContactField({
//               index: contactIndex,
//               field: "notify",
//               value: e.target.checked,
//             })
//           )
//         }
//       />
//     }
//     label="Notify"
//   />

//   <FormControlLabel
//     control={
//       <Checkbox
//         checked={contact.emailSync}
//         onChange={(e) =>
//           dispatch(
//             updateContactField({
//               index: contactIndex,
//               field: "emailSync",
//               value: e.target.checked,
//             })
//           )
//         }
//       />
//     }
//     label="Email Sync"
//   />
// </FormGroup>

//           {contacts.length > 1 && (
//             <Button
//               color="error"
//               sx={{ mt: 2 }}
//               onClick={() => dispatch(removeContact(contactIndex))}
//             >
//               Remove Contact
//             </Button>
//           )}
//         </Box>
//       ))}

//       <Button
//         variant="outlined"
//         startIcon={<AddCircle />}
//         onClick={() => dispatch(addContact())}
//         sx={{ mb: 3 }}
//       >
//         Add Another Contact
//       </Button>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//         <Button variant="outlined" onClick={onBack}>
//           Back
//         </Button>
//         <Button variant="contained" onClick={onSubmit}>
//           Submit
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setContactData,
//   addContact,
//   removeContact,
//   addPhoneNumber,
//   updatePhoneNumber,
//   removePhoneNumber,
//   updateContactField,
//   addSelectedContacts,
//   removeSelectedContact,
//   updateSelectedContactField,
// } from "../../redux/accountContactSlice";

// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Grid,
//   IconButton,
//   Divider,
//   FormControlLabel,
//   Checkbox,
//   FormGroup,
//   Chip,
//   Card,
//   CardContent,List,ListItemText,ListItem,DialogActions,Dialog,DialogTitle,ListItemButton,DialogContent
// } from "@mui/material";
// import { AddCircle, RemoveCircle, Close } from "@mui/icons-material";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// // Contact selection dialog component
// const ContactSelectionDialog = ({ open, onClose, onSelectContacts }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [availableContacts, setAvailableContacts] = useState([]);
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch contacts from backend API
//   React.useEffect(() => {
//     if (open) {
//       fetchContacts();
//     }
//   }, [open]);

//   const fetchContacts = async () => {
//     setLoading(true);
//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch("http://localhost:5000/api/contacts");
//       const data = await response.json();
//       setAvailableContacts(data);
//     } catch (error) {
//       console.error("Error fetching contacts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleToggleContact = (contact) => {
//     const currentIndex = selectedContacts.findIndex(c => c._id === contact._id);
//     const newSelected = [...selectedContacts];

//     if (currentIndex === -1) {
//       newSelected.push(contact);
//     } else {
//       newSelected.splice(currentIndex, 1);
//     }

//     setSelectedContacts(newSelected);
//   };

//   const handleRemoveChip = (contactId) => {
//     const newSelected = selectedContacts.filter(c => c._id !== contactId);
//     setSelectedContacts(newSelected);
//   };

//   const handleSubmit = () => {
//     onSelectContacts(selectedContacts);
//     setSelectedContacts([]);
//     setSearchTerm("");
//     onClose();
//   };

//   const handleCancel = () => {
//     setSelectedContacts([]);
//     setSearchTerm("");
//     onClose();
//   };

//   // Filter contacts based on search term
//   const filteredContacts = availableContacts.filter(contact =>
//     contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (contact.contactName && contact.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (contact.firstName && contact.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (contact.lastName && contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
//       <DialogTitle>Select Existing Contacts</DialogTitle>
//       <DialogContent>
//         <Box sx={{ mt: 1 }}>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Search by email or name"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mr: 1 }}>
//                   {selectedContacts.map(contact => (
//                     <Chip
//                       key={contact._id}
//                       size="small"
//                       label={contact.contactName || `${contact.firstName} ${contact.lastName}`}
//                       onDelete={() => handleRemoveChip(contact._id)}
//                     />
//                   ))}
//                 </Box>
//               ),
//             }}
//           />
//         </Box>

//         <Box sx={{ mt: 2, height: 300, overflow: 'auto' }}>
//           {loading ? (
//             <Typography>Loading contacts...</Typography>
//           ) : filteredContacts.length === 0 ? (
//             <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
//               {searchTerm ? 'No contacts found' : 'No contacts available'}
//             </Typography>
//           ) : (
//             <List>
//               {filteredContacts.map((contact) => {
//                 const isSelected = selectedContacts.some(c => c._id === contact._id);
//                 return (
//                   <ListItem key={contact._id} disablePadding>
//                     <ListItemButton onClick={() => handleToggleContact(contact)}>
//                       <Checkbox
//                         edge="start"
//                         checked={isSelected}
//                         tabIndex={-1}
//                         disableRipple
//                       />
//                       <ListItemText
//                         primary={contact.contactName || `${contact.firstName} ${contact.lastName}`}
//                         secondary={contact.email}
//                       />
//                     </ListItemButton>
//                   </ListItem>
//                 );
//               })}
//             </List>
//           )}
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleCancel}>Cancel</Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={selectedContacts.length === 0}
//         >
//           Add Selected Contacts
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
// // Selected contacts display component
// const SelectedContactsDisplay = ({ contacts, onRemove, onUpdateField }) => {
//   if (contacts.length === 0) return null;

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Selected Existing Contacts
//       </Typography>

//       {contacts.map((contact, index) => (
//         <Card key={index} sx={{ mb: 2 }}>
//           <CardContent>
//             <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//               <Box flexGrow={1}>
//                 <Typography variant="h6">
//                   {contact.contactName || `${contact.firstName} ${contact.lastName}`}
//                 </Typography>
//                 <Typography color="textSecondary">{contact.email}</Typography>

//                 <FormGroup row sx={{ mt: 1 }}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={contact.login || false}
//                         onChange={(e) => onUpdateField(index, "login", e.target.checked)}
//                       />
//                     }
//                     label="Login"
//                   />

//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={contact.notify || false}
//                         onChange={(e) => onUpdateField(index, "notify", e.target.checked)}
//                       />
//                     }
//                     label="Notify"
//                   />

//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={contact.emailSync || false}
//                         onChange={(e) => onUpdateField(index, "emailSync", e.target.checked)}
//                       />
//                     }
//                     label="Email Sync"
//                   />
//                 </FormGroup>
//               </Box>

//               <IconButton
//                 onClick={() => onRemove(index)}
//                 color="error"
//               >
//                 <Close />
//               </IconButton>
//             </Box>
//           </CardContent>
//         </Card>
//       ))}
//     </Box>
//   );
// };

// export default function ContactForm({ onBack, onSubmit }) {
//   const dispatch = useDispatch();
//   const { contacts, selectedContacts } = useSelector((state) => state.accountContact);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [showContactForm,setShowContactForm]=useState(false)
//   const handleChange = (index, e) => {
//     const { name, value } = e.target;
//     let updated = { [name]: value };

//     if (["firstName", "middleName", "lastName"].includes(name)) {
//       const c = { ...contacts[index], [name]: value };
//       updated.contactName = `${c.firstName} ${c.middleName} ${c.lastName}`.trim();
//     }

//     dispatch(setContactData({ index, data: updated }));
//   };
//   // Handle adding existing contacts from the dialog
//   const handleAddExistingContacts = (newContacts) => {
//     dispatch(addSelectedContacts(newContacts));
//   };

//   // Handle removing a selected contact
//   const handleRemoveSelectedContact = (index) => {
//     dispatch(removeSelectedContact(index));
//   };

//   // Handle updating a field for a selected contact
//   const handleUpdateSelectedContactField = (index, field, value) => {
//     dispatch(updateSelectedContactField({ index, field, value }));
//   };

//    // Handle adding a new contact form
//   const handleAddContact = () => {
//     // Only add a new contact if we don't have any or if the last one has some data
//     if (contacts.length === 0 || contacts[contacts.length - 1].firstName ||
//         contacts[contacts.length - 1].lastName || contacts[contacts.length - 1].email) {
//       dispatch(addContact());
//     }
//     setShowContactForm(true);
//   };

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Contact Form
//       </Typography>

//       {/* Add Existing Contacts Button */}
//       <Button
//         variant="outlined"
//         startIcon={<AddCircle />}
//         onClick={() => setDialogOpen(true)}
//         sx={{ mb: 3, mr: 2 }}
//       >
//         Select Existing Contacts
//       </Button>

//       {/* Contact Selection Dialog */}
//       <ContactSelectionDialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         onSelectContacts={handleAddExistingContacts}
//       />

//       {/* Display selected contacts */}
//       <SelectedContactsDisplay
//         contacts={selectedContacts}
//         onRemove={handleRemoveSelectedContact}
//         onUpdateField={handleUpdateSelectedContactField}
//       />

//       {/* Manual contact form */}
//       <Typography variant="h6" gutterBottom>
//         Add New Contacts
//       </Typography>
// {showContactForm && (
//   <>
//       {contacts.map((contact, contactIndex) => (
//         <Box
//           key={contactIndex}
//           sx={{
//             border: "1px solid #ccc",
//             borderRadius: 2,
//             p: 2,
//             mb: 3,
//             background: "#fafafa",
//           }}
//         >
//           <Typography variant="subtitle1" gutterBottom>
//             Contact #{contactIndex + 1}
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="firstName"
//                 value={contact.firstName}
//                 onChange={(e) => handleChange(contactIndex, e)}
//               />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="Middle Name"
//                 name="middleName"
//                 value={contact.middleName}
//                 onChange={(e) => handleChange(contactIndex, e)}
//               />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="lastName"
//                 value={contact.lastName}
//                 onChange={(e) => handleChange(contactIndex, e)}
//               />
//             </Grid>
//           </Grid>

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Contact Name"
//             value={contact.contactName}
//             disabled
//           />

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Email"
//             name="email"
//             value={contact.email}
//             onChange={(e) => handleChange(contactIndex, e)}
//           />

//           <Typography variant="subtitle1" sx={{ mt: 2 }}>
//             Phone Numbers
//           </Typography>

//           {contact.phoneNumbers.map((phone, phoneIndex) => (
//             <Box
//               key={phoneIndex}
//               sx={{ display: "flex", alignItems: "center", mt: 1 }}
//             >
//               <PhoneInput
//                 country={"us"}
//                 value={phone}
//                 onChange={(value) =>
//                   dispatch(
//                     updatePhoneNumber({
//                       contactIndex,
//                       phoneIndex,
//                       value,
//                     })
//                   )
//                 }
//                 inputStyle={{ width: "100%" }}
//               />
//               <IconButton
//                 color="error"
//                 onClick={() =>
//                   dispatch(removePhoneNumber({ contactIndex, phoneIndex }))
//                 }
//                 disabled={contact.phoneNumbers.length === 1}
//               >
//                 <RemoveCircle />
//               </IconButton>
//               {phoneIndex === contact.phoneNumbers.length - 1 && (
//                 <IconButton
//                   color="primary"
//                   onClick={() => dispatch(addPhoneNumber(contactIndex))}
//                 >
//                   <AddCircle />
//                 </IconButton>
//               )}
//             </Box>
//           ))}

//           <FormGroup row sx={{ mt: 2 }}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={contact.login}
//                   onChange={(e) =>
//                     dispatch(
//                       updateContactField({
//                         index: contactIndex,
//                         field: "login",
//                         value: e.target.checked,
//                       })
//                     )
//                   }
//                 />
//               }
//               label="Login"
//             />

//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={contact.notify}
//                   onChange={(e) =>
//                     dispatch(
//                       updateContactField({
//                         index: contactIndex,
//                         field: "notify",
//                         value: e.target.checked,
//                       })
//                     )
//                   }
//                 />
//               }
//               label="Notify"
//             />

//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={contact.emailSync}
//                   onChange={(e) =>
//                     dispatch(
//                       updateContactField({
//                         index: contactIndex,
//                         field: "emailSync",
//                         value: e.target.checked,
//                       })
//                     )
//                   }
//                 />
//               }
//               label="Email Sync"
//             />
//           </FormGroup>

//           {contacts.length > 1 && (
//             <Button
//               color="error"
//               sx={{ mt: 2 }}
//               onClick={() => dispatch(removeContact(contactIndex))}
//             >
//               Remove Contact
//             </Button>
//           )}
//         </Box>
//       ))}
//       </>
//     )}
//       <Button
//         variant="outlined"
//         startIcon={<AddCircle />}
//         // onClick={() => dispatch(addContact())}
//           onClick={handleAddContact}
//         sx={{ mb: 3 }}
//       >
//         Add Another Contact
//       </Button>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//         <Button variant="outlined" onClick={onBack}>
//           Back
//         </Button>
//         <Button variant="contained" onClick={onSubmit}>
//           Submit
//         </Button>
//       </Box>
//     </Box>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setContactData,
  addContact,
  removeContact,
  addPhoneNumber,
  updatePhoneNumber,
  removePhoneNumber,
  updateContactField,
  addSelectedContacts,
  removeSelectedContact,
  updateSelectedContactField,
  setContactTags,
  setContactCountry,
  // resetContacts,
} from "../../redux/accountContactSlice";

import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Autocomplete,
  FormLabel,
  Chip,
  Card,
  CardContent,
  List,
  ListItemText,
  ListItem,
  DialogActions,
  Dialog,
  DialogTitle,
  ListItemButton,
  DialogContent,
} from "@mui/material";
import { AddCircle, RemoveCircle, Close } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import axios from "axios";

// Contact selection dialog component
const ContactSelectionDialog = ({ open, onClose, onSelectContacts , existingContactIds = [] , accountUserIds = []}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  // Fetch contacts from backend API
  React.useEffect(() => {
    if (open) {
      fetchContacts();
    }
  }, [open]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${ACCOUNT_API}/contacts/`);
      const data = await response.json();
      console.log("contactlist", data.contacts);
      setAvailableContacts(data.contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // const handleToggleContact = (contact) => {
  //   const currentIndex = selectedContacts.findIndex(
  //     (c) => c._id === contact._id
  //   );
  //   const newSelected = [...selectedContacts];

  //   if (currentIndex === -1) {
  //     newSelected.push(contact);
  //   } else {
  //     newSelected.splice(currentIndex, 1);
  //   }

  //   setSelectedContacts(newSelected);
  // };
//  const handleToggleContact = (contact) => {
//     const currentIndex = selectedContacts.findIndex(
//       (c) => c._id === contact._id
//     );
//     const newSelected = [...selectedContacts];

//     if (currentIndex === -1) {
//       // Mark as newly added if not already in the account
//       const isExistingContact = existingContactIds.includes(contact._id);
//       newSelected.push({
//         ...contact, 
//         existingUser: contact.userid && contact.userid.length > 0, // Mark if this contact already has a user
//         existingContact: isExistingContact // Mark if this contact is already associated with the account
//       });
//     } else {
//       newSelected.splice(currentIndex, 1);
//     }

//     setSelectedContacts(newSelected);
//   };
const handleToggleContact = (contact) => {
    const currentIndex = selectedContacts.findIndex(
      (c) => c._id === contact._id
    );
    const newSelected = [...selectedContacts];

    if (currentIndex === -1) {
      // Mark as newly added if not already in the account
      const isExistingContact = existingContactIds.includes(contact._id);
      // Check if this contact has a user account associated with THIS account
      const hasUserForThisAccount = accountUserIds.some(userId => 
        contact.userid && contact.userid.includes(userId)
      );
      
      newSelected.push({
        ...contact, 
        existingUser: hasUserForThisAccount, // Mark if this contact has a user for THIS account
        existingContact: isExistingContact // Mark if this contact is already associated with the account
      });
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedContacts(newSelected);
  };
  const handleRemoveChip = (contactId) => {
    const newSelected = selectedContacts.filter((c) => c._id !== contactId);
    setSelectedContacts(newSelected);
  };

  const handleSubmit = () => {
    onSelectContacts(selectedContacts);
    setSelectedContacts([]);
    setSearchTerm("");
    onClose();
  };

  const handleCancel = () => {
    setSelectedContacts([]);
    setSearchTerm("");
    onClose();
  };

  // Only filter when searchTerm has value
  const filteredContacts = searchTerm
    ? availableContacts.filter((contact) => {
        const fullName =
          `${contact.firstName || ""} ${contact.lastName || ""} ${contact.contactName || ""}`.toLowerCase();
        const email = (contact.email || "").toLowerCase();
        const term = searchTerm.toLowerCase();

        return fullName.includes(term) || email.includes(term);
      })
    : [];

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Select Existing Contacts</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Search by email or name"
            type="text"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mr: 1 }}
                >
                  {selectedContacts.map((contact) => (
                    <Chip
                      key={contact._id}
                      size="small"
                      label={
                        contact.contactName ||
                        `${contact.firstName} ${contact.lastName}`
                      }
                      onDelete={() => handleRemoveChip(contact._id)}
                    />
                  ))}
                </Box>
              ),
            }}
          />
        </Box>

        <Box sx={{ mt: 2, height: 300, overflow: "auto" }}>
          {loading ? (
            <Typography>Loading contacts...</Typography>
          ) : filteredContacts.length === 0 ? (
            <Typography
              sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
            >
              {searchTerm ? "No contacts found" : "No contacts available"}
            </Typography>
          ) : (
            <List>
              {filteredContacts.map((contact) => {
                const isSelected = selectedContacts.some(
                  (c) => c._id === contact._id
                );
                return (
                  <ListItem key={contact._id} disablePadding>
                    <ListItemButton
                      onClick={() => handleToggleContact(contact)}
                    >
                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                      />
                      <ListItemText
                        primary={
                          contact.contactName ||
                          `${contact.firstName} ${contact.lastName}`
                        }
                        secondary={contact.email}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={selectedContacts.length === 0}
        >
          Add Selected Contacts
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Selected contacts display component
const SelectedContactsDisplay = ({ contacts, onRemove, onUpdateField, isEditing = false }) => {
  if (contacts.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Selected Existing Contacts
      </Typography>

      {contacts.map((contact, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box flexGrow={1}>
                <Typography variant="h6">
                  {contact.contactName ||
                    `${contact.firstName} ${contact.lastName}`}
                </Typography>
                <Typography color="textSecondary">{contact.companyName}</Typography>
                <Typography color="textSecondary">{contact.email}</Typography>
{contact.existingUser && (
                  <Chip 
                    label="Has User Account" 
                    size="small" 
                    color="success" 
                    sx={{ mt: 1 }}
                  />
                )}

                <FormGroup row sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={contact.login || false}
                        onChange={(e) =>
                          onUpdateField(index, "login", e.target.checked)
                        }
                        disabled={contact.existingUser}
                      />
                    }
                    label="Login"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={contact.notify || false}
                        onChange={(e) =>
                          onUpdateField(index, "notify", e.target.checked)
                        }
                      />
                    }
                    label="Notify"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={contact.emailSync || false}
                        onChange={(e) =>
                          onUpdateField(index, "emailSync", e.target.checked)
                        }
                      />
                    }
                    label="Email Sync"
                  />
                </FormGroup>
              </Box>

              <IconButton onClick={() => onRemove(index)} color="error">
                <Close />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default function ContactForm({ onBack, onSubmit,isEditing = false  }) {
  const dispatch = useDispatch();
  const { contacts, selectedContacts, accountData } = useSelector(
    (state) => state.accountContact
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    let updated = { [name]: value };

    if (["firstName", "middleName", "lastName"].includes(name)) {
      const c = { ...contacts[index], [name]: value };
      updated.contactName =
        `${c.firstName} ${c.middleName} ${c.lastName}`.trim();
    }

    dispatch(setContactData({ index, data: updated }));
  };
useEffect(() => {
    console.log("Selected Contacts:", selectedContacts);
    console.log("Contacts:", contacts);
  }, [selectedContacts, contacts]);
  // Handle adding existing contacts from the dialog
  const handleAddExistingContacts = (newContacts) => {
    dispatch(addSelectedContacts(newContacts));
  };

  // Handle removing a selected contact
  const handleRemoveSelectedContact = (index) => {
    dispatch(removeSelectedContact(index));
  };

  // Handle updating a field for a selected contact
  const handleUpdateSelectedContactField = (index, field, value) => {
    dispatch(updateSelectedContactField({ index, field, value }));
  };

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${TAGS_API}/tags/`);
        const data = await res.json();
        setTags(
          data.tags.map((tag) => ({
            value: tag._id,
            label: tag.tagName,
            colour: tag.tagColour,
          }))
        );
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, [TAGS_API]);
  // Get country list once (memoized)
  const options = useMemo(() => countryList().getData(), []);
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contact Form
      </Typography>

      {/* Add Existing Contacts Button */}
      <Button
        variant="outlined"
        startIcon={<AddCircle />}
        onClick={() => setDialogOpen(true)}
        sx={{ mb: 3, mr: 2 }}
      >
        Select Existing Contacts
      </Button>

      {/* Contact Selection Dialog */}
      <ContactSelectionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelectContacts={handleAddExistingContacts}
      />

      {/* Display selected contacts */}
      <SelectedContactsDisplay
        contacts={selectedContacts}
        onRemove={handleRemoveSelectedContact}
        onUpdateField={handleUpdateSelectedContactField}
        isEditing={isEditing}
      />

      {/* Manual contact form */}
      <Typography variant="h6" gutterBottom>
        Add New Contacts
      </Typography>

      {/* {showContactForm && ( */}
      <>
        {contacts.map((contact, contactIndex) => (
          <Box
            key={contactIndex}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              mb: 3,
              background: "#fafafa",
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Contact #{contactIndex + 1}
            </Typography>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={3.7} ml={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={contact.firstName || ""}
                  onChange={(e) => handleChange(contactIndex, e)}
                />
              </Grid>
              <Grid item xs={3.7} ml={1}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middleName"
                  value={contact.middleName || ""}
                  onChange={(e) => handleChange(contactIndex, e)}
                />
              </Grid>
              <Grid item xs={3.9} ml={1}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={contact.lastName || ""}
                  onChange={(e) => handleChange(contactIndex, e)}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              margin="normal"
              label="Contact Name"
              value={contact.contactName || ""}
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Company Name"
              name="companyName"
              value={contact.companyName || ""}
              onChange={(e) => handleChange(contactIndex, e)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Note"
              name="note"
                multiline
//  maxRows={20}
              value={contact.note || ""}
              onChange={(e) => handleChange(contactIndex, e)}
            />
            <TextField
  fullWidth
  margin="normal"
  label="SSN"
  name="ssn"
  value={contact.ssn || ""}
  onChange={(e) => handleChange(contactIndex, e)}
  type="number"
  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
  />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={contact.email || ""}
              onChange={(e) => handleChange(contactIndex, e)}
            />
            <FormGroup row sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={contact.login || false}
                    onChange={(e) =>
                      dispatch(
                        updateContactField({
                          index: contactIndex,
                          field: "login",
                          value: e.target.checked,
                        })
                      )
                    }
                  />
                }
                label="Login"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={contact.notify || false}
                    onChange={(e) =>
                      dispatch(
                        updateContactField({
                          index: contactIndex,
                          field: "notify",
                          value: e.target.checked,
                        })
                      )
                    }
                  />
                }
                label="Notify"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={contact.emailSync || false}
                    onChange={(e) =>
                      dispatch(
                        updateContactField({
                          index: contactIndex,
                          field: "emailSync",
                          value: e.target.checked,
                        })
                      )
                    }
                  />
                }
                label="Email Sync"
              />
            </FormGroup>

            <Autocomplete
              multiple
              options={tags}
              getOptionLabel={(option) => option.label}
              value={contact.tags || []}
              onChange={(e, newValue) =>
                dispatch(
                  setContactTags({ index: contactIndex, tags: newValue })
                )
              }
              filterSelectedOptions
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.value}
                    label={option.label}
                    sx={{
                      backgroundColor: option.colour,
                      color: "#fff",
                      // m:1.5,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  />
                ))
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    backgroundColor: option.colour,
                    color: "#fff",
                    borderRadius: "15px",
                    px: 1,
                    py: 0.5,
                    my: 0.5,
                    width: "fit-content",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                >
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  label="Select Tags"
                  size="small"
                />
              )}
            />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Phone Numbers
            </Typography>

            {contact.phoneNumbers &&
              contact.phoneNumbers.map((phone, phoneIndex) => (
                <Box
                  key={phoneIndex}
                  sx={{ display: "flex", alignItems: "center", mt: 1 }}
                >
                  <PhoneInput
                    country={"us"}
                    value={phone}
                    onChange={(value) =>
                      dispatch(
                        updatePhoneNumber({
                          contactIndex,
                          phoneIndex,
                          value,
                        })
                      )
                    }
                    inputStyle={{ width: "100%" }}
                  />
                  <IconButton
                    color="error"
                    onClick={() =>
                      dispatch(removePhoneNumber({ contactIndex, phoneIndex }))
                    }
                    disabled={contact.phoneNumbers.length === 1}
                  >
                    <RemoveCircle />
                  </IconButton>
                  {phoneIndex === contact.phoneNumbers.length - 1 && (
                    <IconButton
                      color="primary"
                      onClick={() => dispatch(addPhoneNumber(contactIndex))}
                    >
                      <AddCircle />
                    </IconButton>
                  )}
                </Box>
              ))}

            <Box>
              <FormLabel
                component="legend"
                sx={{ color: "black", fontSize: "20px" }}
              >
                Address
              </FormLabel>

              {/* Country */}
              <Autocomplete
                options={options}
                getOptionLabel={(option) => option.label}
                value={contact.country || null}
                onChange={(e, newValue) =>
                  dispatch(
                    setContactCountry({
                      index: contactIndex,
                      country: newValue,
                    })
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Select Country"
                  />
                )}
              />

              {/* Street Address */}
              <TextField
                fullWidth
                margin="normal"
                size="small"
                label="Street Address"
                name="streetAdd"
                value={contact.streetAdd || ""}
                // onChange={handleChange}
                onChange={(e) => handleChange(contactIndex, e)}
              />

              {/* City */}
              <TextField
                fullWidth
                margin="normal"
                size="small"
                label="City"
                name="city"
                value={contact.city || ""}
                // onChange={handleChange}
                onChange={(e) => handleChange(contactIndex, e)}
              />

              {/* State */}
              <TextField
                fullWidth
                margin="normal"
                size="small"
                label="State"
                name="state"
                value={contact.state || ""}
                // onChange={handleChange}
                onChange={(e) => handleChange(contactIndex, e)}
              />

              {/* Zip Code */}
              <TextField
                fullWidth
                margin="normal"
                size="small"
                label="Zip Code"
                name="zipCode"
                value={contact.zipCode || ""}
                // onChange={handleChange}
                onChange={(e) => handleChange(contactIndex, e)}
              />
            </Box>

            {contacts.length > 1 && (
              <Button
                color="error"
                sx={{ mt: 2 }}
                onClick={() => dispatch(removeContact(contactIndex))}
              >
                Remove Contact
              </Button>
            )}
          </Box>
        ))}
      </>
      {/* )} */}

      <Button
        variant="outlined"
        startIcon={<AddCircle />}
        // onClick={handleAddContact}
        onClick={() => dispatch(addContact())}
        sx={{ mb: 3 }}
      >
        Add Another Contact
      </Button>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
