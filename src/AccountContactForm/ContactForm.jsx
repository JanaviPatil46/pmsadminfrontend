

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setContactData, addContact, removeContact, addPhoneNumber, updatePhoneNumber,
  removePhoneNumber, updateContactField, addSelectedContacts, removeSelectedContact,
  updateSelectedContactField
} from "../redux/accountContactSlice";
import {
  Box, Button, TextField, Typography, Grid, IconButton, Divider,
  FormControlLabel, Checkbox, FormGroup
} from "@mui/material";
import { AddCircle, RemoveCircle, Close } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ContactSelectionDialog from "./ContactSelectionDialog";
import SelectedContactsDisplay from "./SelectedContactsDisplay";

export default function ContactForm({ onBack, onSubmit, isEditing }) {
  const dispatch = useDispatch();
  const { contacts, selectedContacts } = useSelector((state) => state.accountContact);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(contacts.length > 0);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    let updated = { [name]: value };
    if (["firstName", "middleName", "lastName"].includes(name)) {
      const c = { ...contacts[index], [name]: value };
      updated.contactName = `${c.firstName} ${c.middleName} ${c.lastName}`.trim();
    }
    dispatch(setContactData({ index, data: updated }));
  };

  const handleAddExistingContacts = (newContacts) => {
    dispatch(addSelectedContacts(newContacts));
  };
  const handleRemoveSelectedContact = (index) => {
    dispatch(removeSelectedContact(index));
  };
  const handleUpdateSelectedContactField = (index, field, value) => {
    dispatch(updateSelectedContactField({ index, field, value }));
  };
 const handleAddContact = () => {
  
    dispatch(addContact());
    setShowContactForm(true);
 
};


  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contact Form
      </Typography>
      <Button
        variant="outlined"
        startIcon={<AddCircle />}
        onClick={() => setDialogOpen(true)}
        sx={{ mb: 3, mr: 2 }}
      >
        Select Existing Contacts
      </Button>
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
      <Typography variant="h6" gutterBottom>
        Add New Contacts
      </Typography>
      {showContactForm && (
        <>
          {contacts.map((contact, contactIndex) => (
            <Box
              key={contactIndex}
              sx={{
                border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 3, background: "#fafafa"
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Contact #{contactIndex + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth label="First Name" name="firstName"
                    value={contact.firstName || ""} onChange={(e) => handleChange(contactIndex, e)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth label="Middle Name" name="middleName"
                    value={contact.middleName || ""} onChange={(e) => handleChange(contactIndex, e)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth label="Last Name" name="lastName"
                    value={contact.lastName || ""} onChange={(e) => handleChange(contactIndex, e)}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth margin="normal" label="Contact Name"
                value={contact.contactName || ""} disabled
              />
              <TextField
                fullWidth margin="normal" label="Email" name="email"
                value={contact.email || ""} onChange={(e) => handleChange(contactIndex, e)}
              />
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Phone Numbers
              </Typography>
              {contact.phoneNumbers && contact.phoneNumbers.map((phone, phoneIndex) => (
                <Box key={phoneIndex} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <PhoneInput
                    country={"us"} value={phone}
                    onChange={(value) =>
                      dispatch(updatePhoneNumber({ contactIndex, phoneIndex, value }))
                    }
                    inputStyle={{ width: "100%" }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => dispatch(removePhoneNumber({ contactIndex, phoneIndex }))}
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
              <FormGroup row sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={contact.login || false}
                      onChange={e =>
                        dispatch(
                          updateContactField({
                            index: contactIndex,
                            field: "login",
                            value: e.target.checked
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
                      onChange={e =>
                        dispatch(
                          updateContactField({
                            index: contactIndex,
                            field: "notify",
                            value: e.target.checked
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
                      onChange={e =>
                        dispatch(
                          updateContactField({
                            index: contactIndex,
                            field: "emailSync",
                            value: e.target.checked
                          })
                        )
                      }
                    />
                  }
                  label="Email Sync"
                />
              </FormGroup>
              {contacts.length > 1 && (
                <Button color="error" sx={{ mt: 2 }} onClick={() => dispatch(removeContact(contactIndex))}>
                  Remove Contact
                </Button>
              )}
            </Box>
          ))}
        </>
      )}
      <Button
        variant="outlined"
        startIcon={<AddCircle />}
        onClick={handleAddContact}
        sx={{ mb: 3 }}
      >
        Add Another Contact
      </Button>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onSubmit}>Submit</Button>
      </Box>
    </Box>
  );
}
