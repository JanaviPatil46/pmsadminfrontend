


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
} from "../redux/accountContactSlice";
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
  Chip,
  Autocomplete,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import countryList from "react-select-country-list";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ContactSelectionDialog from "./ContactSelectionDialog";
import SelectedContactsDisplay from "./SelectedContactsDisplay";

// Personalization Dialog Component
const PersonalizationDialog = ({
  open,
  onClose,
  contactEmails,
  message,
  onMessageChange,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <div className="px-5 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Add portal access</h2>
      </div>
      <DialogContent>
        <p className="text-sm font-semibold text-slate-700 mb-2">This message will be sent to:</p>
        <div className="max-h-[150px] overflow-y-auto border border-slate-100 rounded-lg p-3 mb-3 bg-slate-50">
          {contactEmails.map((email, index) => (
            <p key={index} className="text-sm text-slate-600 mb-0.5">• {email}</p>
          ))}
        </div>
        <TextField
          autoFocus margin="dense" type="text" fullWidth multiline rows={3} variant="outlined"
          value={message} onChange={onMessageChange}
          placeholder="Enter a message that will be sent to all contacts"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
      </DialogContent>
      <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
        <button onClick={onClose} className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">Send</button>
      </div>
    </Dialog>
  );
};

export default function ContactForm({ onBack, onSubmit, isEditing }) {
  const dispatch = useDispatch();
  const { contacts, selectedContacts } = useSelector(
    (state) => state.accountContact
  );
  
  console.log("selected contacts", contacts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [personalizationDialogOpen, setPersonalizationDialogOpen] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");
  const [showContactForm, setShowContactForm] = useState(contacts.length > 0);
  const [contactErrors, setContactErrors] = useState([]);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  
  // Track newly selected contacts (without _id) and newly added form contacts
  const [newlySelectedContacts, setNewlySelectedContacts] = useState([]);
  const [newFormContacts, setNewFormContacts] = useState([]);

  // Track when new contacts are added via the dialog
  const handleAddExistingContacts = (newContacts) => {
    // Mark these as newly selected contacts (they have _id but are newly linked)
    const contactsWithNewFlag = newContacts.map(contact => ({
      ...contact,
      isNewlySelected: true
    }));
    dispatch(addSelectedContacts(contactsWithNewFlag));
    
    // Store the newly selected contact IDs
    setNewlySelectedContacts(prev => [
      ...prev,
      ...newContacts.map(contact => contact._id)
    ]);
  };

  // Track when new contacts are added via the form
  const handleAddContact = () => {
    dispatch(addContact());
    setShowContactForm(true);
    
    // The last contact in the array is the new one
    const newContactIndex = contacts.length;
    setNewFormContacts(prev => [...prev, newContactIndex]);
  };

  // Check if there are any NEW contacts that need activation (login = true)
  const getNewContactsNeedingActivation = () => {
    const allContacts = [...contacts, ...selectedContacts];
    
    return allContacts.filter(contact => {
      // Contact needs activation
      const needsActivation = contact.login === true;
      
      // Contact is NEW (either newly selected or newly added form contact)
      const isNewContact = 
        // New form contact (no _id and in newFormContacts array)
        (contact._id === undefined && newFormContacts.includes(contacts.indexOf(contact))) ||
        // Newly selected contact (has _id and in newlySelectedContacts array)
        (contact._id && newlySelectedContacts.includes(contact._id));
      
      return needsActivation && isNewContact;
    });
  };

  const getNewContactEmailsNeedingActivation = () => {
    const activationContacts = getNewContactsNeedingActivation();
    return activationContacts.map(contact => contact.email).filter(Boolean);
  };
const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmitWithPersonalization = async (event) => {
    if (event) event.preventDefault();
    
      // Prevent multiple submissions
  if (isSubmitting) return;
    // Check if there are NEW contacts that need activation
    const newActivationContacts = getNewContactsNeedingActivation();
    const newActivationEmails = getNewContactEmailsNeedingActivation();
    
    console.log("New contacts needing activation:", newActivationContacts);
    console.log("New activation emails:", newActivationEmails);
    
    // if (newActivationContacts.length > 0) {
    //   // Show personalization dialog only for NEW contacts
    //   setPendingSubmit(true);
    //   setPersonalizationDialogOpen(true);
    // } else {
    //   // No NEW contacts need activation, submit directly without message
    //   await onSubmit(event, "");
    // }
    if (newActivationContacts.length > 0) {
    // Show personalization dialog only for NEW contacts
    setPendingSubmit(true);
    setPersonalizationDialogOpen(true);
  } else {
    // No NEW contacts need activation, submit directly without message
    setIsSubmitting(true); // Disable button
    try {
      await onSubmit(event, "");
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  }
  };
const handleConfirmPersonalization = async () => {
  setIsSubmitting(true); // Disable button
  setPersonalizationDialogOpen(false);
  
  try {
    // Submit with the personal message
    await onSubmit(null, personalMessage);
    // Reset tracking after successful submission
    setPersonalMessage("");
    setPendingSubmit(false);
    setNewlySelectedContacts([]);
    setNewFormContacts([]);
  } finally {
    setIsSubmitting(false); // Re-enable button
  }
};

const handleCancelPersonalization = () => {
  setPersonalizationDialogOpen(false);
  setPersonalMessage("");
  setPendingSubmit(false);
};
  // const handleConfirmPersonalization = async () => {
  //   setPersonalizationDialogOpen(false);
  //   // Submit with the personal message
  //   await onSubmit(null, personalMessage);
  //   setPersonalMessage("");
  //   setPendingSubmit(false);
    
  //   // Reset tracking after submission
  //   setNewlySelectedContacts([]);
  //   setNewFormContacts([]);
  // };

  // const handleCancelPersonalization = () => {
  //   setPersonalizationDialogOpen(false);
  //   setPersonalMessage("");
  //   setPendingSubmit(false);
  // };

  // Remove contact from tracking when it's removed from form
  const handleRemoveSelectedContact = (index) => {
    const contactToRemove = selectedContacts[index];
    if (contactToRemove && contactToRemove._id) {
      setNewlySelectedContacts(prev => 
        prev.filter(id => id !== contactToRemove._id)
      );
    }
    dispatch(removeSelectedContact(index));
  };

  // Remove form contact from tracking when it's removed
  const handleRemoveContact = (contactIndex) => {
    setNewFormContacts(prev => 
      prev.filter(index => index !== contactIndex).map(index => 
        index > contactIndex ? index - 1 : index
      )
    );
    dispatch(removeContact(contactIndex));
  };

  const formatSSN = (value) => {
    const v = value.replace(/\D/g, "").slice(0, 9);
    if (v.length > 5) return `${v.slice(0, 3)}-${v.slice(3, 5)}-${v.slice(5)}`;
    if (v.length > 3) return `${v.slice(0, 3)}-${v.slice(3)}`;
    return v;
  };

  const validateSSN = (value) => {
    const cleaned = value.replace(/-/g, "");
    if (cleaned.length !== 9) return "SSN must be 9 digits";
    if (/^(000|666|9\d{2})/.test(cleaned)) return "Invalid SSN starting digits";
    if (/^\d{3}00\d{4}$/.test(cleaned)) return "Invalid SSN middle digits";
    if (/^\d{5}0000$/.test(cleaned)) return "Invalid SSN last digits";
    return "";
  };

  const handleSSNChange = (index, e) => {
    const formatted = formatSSN(e.target.value);
    const error = validateSSN(formatted);

    handleChange(index, {
      target: {
        name: "ssn",
        value: formatted,
      },
    });

    handleChange(index, {
      target: {
        name: "ssnError",
        value: error,
      },
    });
  };

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
  
  const options = useMemo(() => countryList().getData(), []);

  return (
    <div className="space-y-5">
      {/* Header & existing contacts selector */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Contact Form</h3>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <AddCircle fontSize="small" />
          Select Existing Contacts
        </button>
      </div>

      <ContactSelectionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelectContacts={handleAddExistingContacts}
      />
      <SelectedContactsDisplay
        contacts={selectedContacts}
        onRemove={handleRemoveSelectedContact}
        onUpdateField={handleUpdateSelectedContactField}
        isEditing={isEditing}
      />

      {/* Add new contacts */}
      <h3 className="text-sm font-semibold text-slate-900">Add New Contacts</h3>
      {showContactForm && (
        <div className="space-y-4">
          {contacts.map((contact, contactIndex) => (
            <div key={contactIndex} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Contact #{contactIndex + 1}</span>
                {newFormContacts.includes(contactIndex) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">New</span>
                )}
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <TextField fullWidth size="small" label="First Name" name="firstName" value={contact.firstName || ""}
                  onChange={(e) => handleChange(contactIndex, e)} error={!!contactErrors[contactIndex]?.firstName}
                  helperText={contactErrors[contactIndex]?.firstName} required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <TextField fullWidth size="small" label="Middle Name" name="middleName" value={contact.middleName || ""}
                  onChange={(e) => handleChange(contactIndex, e)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <TextField fullWidth size="small" label="Last Name" name="lastName" value={contact.lastName || ""}
                  onChange={(e) => handleChange(contactIndex, e)} error={!!contactErrors[contactIndex]?.lastName}
                  helperText={contactErrors[contactIndex]?.lastName} required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </div>

              <TextField fullWidth size="small" label="Contact Name" value={contact.contactName || ""} disabled
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <TextField fullWidth size="small" label="Company Name" name="companyName" value={contact.companyName || ""}
                onChange={(e) => handleChange(contactIndex, e)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <TextField fullWidth size="small" label="Note" name="note" multiline value={contact.note || ""}
                onChange={(e) => handleChange(contactIndex, e)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <TextField fullWidth size="small" label="SSN" name="ssn" value={contact.ssn || ""}
                onChange={(e) => handleSSNChange(contactIndex, e)}
                inputProps={{ maxLength: 11, inputMode: "numeric", pattern: "[0-9]*" }}
                helperText={contact.ssnError ? contact.ssnError : "Format: 123-45-6789"}
                error={!!contact.ssnError}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <TextField fullWidth size="small" label="Email" name="email" value={contact.email || ""}
                onChange={(e) => handleChange(contactIndex, e)} error={!!contactErrors[contactIndex]?.email}
                helperText={contactErrors[contactIndex]?.email} required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              {/* Permissions */}
              <div className="flex items-center gap-4 mt-1">
                <FormControlLabel control={<Checkbox size="small" checked={contact.login || false} disabled onChange={(e) => dispatch(updateContactField({ index: contactIndex, field: "login", value: e.target.checked }))} sx={{ padding: '2px' }} />} label={<span className="text-xs text-slate-600">Login</span>} />
                <FormControlLabel control={<Checkbox size="small" checked={contact.notify || false} disabled onChange={(e) => dispatch(updateContactField({ index: contactIndex, field: "notify", value: e.target.checked }))} sx={{ padding: '2px' }} />} label={<span className="text-xs text-slate-600">Notify</span>} />
                <FormControlLabel control={<Checkbox size="small" checked={contact.emailSync || false} disabled onChange={(e) => dispatch(updateContactField({ index: contactIndex, field: "emailSync", value: e.target.checked }))} sx={{ padding: '2px' }} />} label={<span className="text-xs text-slate-600">Email Sync</span>} />
              </div>

              {/* Tags */}
              <Autocomplete
                multiple options={tags} getOptionLabel={(option) => option.label}
                value={contact.tags || []}
                onChange={(e, newValue) => dispatch(setContactTags({ index: contactIndex, tags: newValue }))}
                filterSelectedOptions
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <span {...getTagProps({ index })} key={option.value} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white mr-1 mb-1" style={{ backgroundColor: option.colour }}>
                      {option.label}
                    </span>
                  ))
                }
                renderOption={(props, option) => (
                  <li {...props}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ backgroundColor: option.colour }}>{option.label}</span>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Select Tags" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                )}
              />

              {/* Phone Numbers */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Phone Numbers</p>
                {contact.phoneNumbers && contact.phoneNumbers.map((phone, phoneIndex) => (
                  <div key={phoneIndex} className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <PhoneInput country={"us"} value={phone}
                        onChange={(value) => dispatch(updatePhoneNumber({ contactIndex, phoneIndex, value }))}
                        inputStyle={{ width: "100%", borderRadius: "8px" }}
                      />
                    </div>
                    <button type="button" onClick={() => dispatch(removePhoneNumber({ contactIndex, phoneIndex }))}
                      disabled={contact.phoneNumbers.length === 1}
                      className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30">
                      <RemoveCircle fontSize="small" />
                    </button>
                    {phoneIndex === contact.phoneNumbers.length - 1 && (
                      <button type="button" onClick={() => dispatch(addPhoneNumber(contactIndex))}
                        className="p-1.5 rounded-md text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors">
                        <AddCircle fontSize="small" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-700">Address</p>
                <Autocomplete options={options} getOptionLabel={(option) => option.label}
                  value={contact.country || null} size="small"
                  onChange={(e, newValue) => dispatch(setContactCountry({ index: contactIndex, country: newValue }))}
                  renderInput={(params) => (<TextField {...params} label="Select Country" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />)}
                />
                <TextField fullWidth size="small" label="Street Address" name="streetAdd" value={contact.streetAdd || ""} onChange={(e) => handleChange(contactIndex, e)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <TextField fullWidth size="small" label="City" name="city" value={contact.city || ""} onChange={(e) => handleChange(contactIndex, e)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <TextField fullWidth size="small" label="State" name="state" value={contact.state || ""} onChange={(e) => handleChange(contactIndex, e)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  <TextField fullWidth size="small" label="Zip Code" name="zipCode" value={contact.zipCode || ""} onChange={(e) => handleChange(contactIndex, e)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                </div>
              </div>

              <button type="button" onClick={() => handleRemoveContact(contactIndex)}
                className="inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors mt-2">
                <RemoveCircle fontSize="small" /> Remove Contact
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={handleAddContact}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
        <AddCircle fontSize="small" /> Add Another Contact
      </button>

      <hr className="border-slate-200" />

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack}
          className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <svg className="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button type="button" onClick={handleSubmitWithPersonalization} disabled={isSubmitting}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      <PersonalizationDialog
        open={personalizationDialogOpen}
        onClose={handleCancelPersonalization}
        contactEmails={getNewContactEmailsNeedingActivation()}
        message={personalMessage}
        onMessageChange={(e) => setPersonalMessage(e.target.value)}
        onConfirm={handleConfirmPersonalization}
      />
    </div>
  );
}