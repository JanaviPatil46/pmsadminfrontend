import React, { useState,useEffect,useMemo } from "react";
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
  updateSelectedContactField, setContactTags,setContactCountry
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
  FormGroup,Chip,Autocomplete,FormLabel
} from "@mui/material";
import countryList from "react-select-country-list";
import { AddCircle, RemoveCircle, Close } from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ContactSelectionDialog from "./ContactSelectionDialog";
import SelectedContactsDisplay from "./SelectedContactsDisplay";

export default function ContactForm({ onBack, onSubmit, isEditing ,}) {
  const dispatch = useDispatch();
  const { contacts, selectedContacts } = useSelector(
    (state) => state.accountContact
  );
  console.log("selcted contacts",contacts)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(contacts.length > 0);
  const [contactErrors, setContactErrors] = useState([]);
  const formatSSN = (value) => {
  const v = value.replace(/\D/g, "").slice(0, 9); // digits only

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

const handleSSNChange = (index,e) => {
  const formatted = formatSSN(e.target.value);

  const error = validateSSN(formatted);

  // update SSN value
  handleChange(index, {
    target: {
      name: "ssn",
      value: formatted,
    },
  });

  // update SSN error
  handleChange(index, {
    target: {
      name: "ssnError",
      value: error, // "" means no error — helper text goes back to normal
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
                    //  onChange={(e) => handleChange(contactIndex, e)}
                    error={!!contactErrors[contactIndex]?.firstName}
                    helperText={contactErrors[contactIndex]?.firstName}
                    required
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
                    error={!!contactErrors[contactIndex]?.lastName}
                    helperText={contactErrors[contactIndex]?.lastName}
                    required
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
              {/* <TextField
                fullWidth
                margin="normal"
                label="SSN"
                name="ssn"
                value={contact.ssn || ""}
                onChange={(e) => handleChange(contactIndex, e)}
                type="number"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              /> */}
              <TextField
  fullWidth
  margin="normal"
  label="SSN"
  name="ssn"
  value={contact.ssn || ""}
  onChange={(e) => handleSSNChange(contactIndex,e)}
  inputProps={{
    maxLength: 11, // 123-45-6789
    inputMode: "numeric",
    pattern: "[0-9]*",
  }}
   helperText={contact.ssnError ? contact.ssnError : "Format: 123-45-6789"}
  error={!!contact.ssnError}
/>

              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={contact.email || ""}
                onChange={(e) => handleChange(contactIndex, e)}
                error={!!contactErrors[contactIndex]?.email}
                helperText={contactErrors[contactIndex]?.email}
                required
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
                          updatePhoneNumber({ contactIndex, phoneIndex, value })
                        )
                      }
                      inputStyle={{ width: "100%" }}
                    />
                    <IconButton
                      color="error"
                      onClick={() =>
                        dispatch(
                          removePhoneNumber({ contactIndex, phoneIndex })
                        )
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
