


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
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Plus, Minus, UserPlus, Trash2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../components/ui/sheet";
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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-border bg-background shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <SheetTitle className="text-base font-semibold">Add portal access</SheetTitle>
          <button onClick={onClose} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm font-medium text-foreground">This message will be sent to:</p>
          <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-muted/30 p-3 space-y-0.5">
            {contactEmails.map((email, i) => (
              <p key={i} className="text-sm text-muted-foreground">• {email}</p>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label>Personal Message</Label>
            <textarea
              autoFocus rows={3} value={message} onChange={onMessageChange}
              placeholder="Enter a message that will be sent to all contacts"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border/40">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onConfirm}>Send</Button>
        </div>
      </div>
    </div>
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

  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="flex flex-col h-full">
      {/* Section header */}
      <SheetHeader className="px-0 pb-4 border-b border-border/40 space-y-0.5">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-sm font-semibold">Contacts</SheetTitle>
          <Button variant="outline" size="sm" type="button" onClick={() => setDialogOpen(true)} className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            Link Existing
          </Button>
        </div>
        <SheetDescription className="text-xs">Add new contacts or link existing ones to this account.</SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto pt-4 space-y-5">

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

      {/* New contact forms */}
      <div className="space-y-3">
        <SheetHeader className="px-0 py-0 space-y-0.5">
          <SheetTitle className="text-sm font-semibold">New Contacts</SheetTitle>
          <SheetDescription className="text-xs">Fill in details for any new contacts to create.</SheetDescription>
        </SheetHeader>
        {showContactForm && contacts.map((contact, contactIndex) => (
          <div key={contactIndex} className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-sm font-semibold">Contact #{contactIndex + 1}</SheetTitle>
                {newFormContacts.includes(contactIndex) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">New</span>
                )}
              </div>
              <button type="button" onClick={() => handleRemoveContact(contactIndex)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>First Name <span className="text-destructive">*</span></Label>
                <Input name="firstName" value={contact.firstName || ""}
                  placeholder="First Name"
                  className={contactErrors[contactIndex]?.firstName ? "border-destructive" : ""}
                  onChange={(e) => handleChange(contactIndex, e)} />
                {contactErrors[contactIndex]?.firstName && <p className="text-xs text-destructive">{contactErrors[contactIndex].firstName}</p>}
              </div>
              <div className="space-y-1">
                <Label>Middle Name</Label>
                <Input name="middleName" value={contact.middleName || ""} placeholder="Middle Name" onChange={(e) => handleChange(contactIndex, e)} />
              </div>
              <div className="space-y-1">
                <Label>Last Name <span className="text-destructive">*</span></Label>
                <Input name="lastName" value={contact.lastName || ""}
                  placeholder="Last Name"
                  className={contactErrors[contactIndex]?.lastName ? "border-destructive" : ""}
                  onChange={(e) => handleChange(contactIndex, e)} />
                {contactErrors[contactIndex]?.lastName && <p className="text-xs text-destructive">{contactErrors[contactIndex].lastName}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Contact Name</Label>
              <Input value={contact.contactName || ""} disabled className="bg-muted/40 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <Label>Company Name</Label>
              <Input name="companyName" value={contact.companyName || ""} placeholder="Company Name" onChange={(e) => handleChange(contactIndex, e)} />
            </div>
            <div className="space-y-1">
              <Label>Note</Label>
              <textarea name="note" value={contact.note || ""} placeholder="Note" rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                onChange={(e) => handleChange(contactIndex, e)} />
            </div>
            <div className="space-y-1">
              <Label>SSN</Label>
              <Input name="ssn" value={contact.ssn || ""} placeholder="123-45-6789" maxLength={11} inputMode="numeric"
                className={contact.ssnError ? "border-destructive" : ""}
                onChange={(e) => handleSSNChange(contactIndex, e)} />
              {contact.ssnError
                ? <p className="text-xs text-destructive">{contact.ssnError}</p>
                : <p className="text-xs text-muted-foreground">Format: 123-45-6789</p>}
            </div>
            <div className="space-y-1">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input name="email" value={contact.email || ""} placeholder="Email" type="email"
                className={contactErrors[contactIndex]?.email ? "border-destructive" : ""}
                onChange={(e) => handleChange(contactIndex, e)} />
              {contactErrors[contactIndex]?.email && <p className="text-xs text-destructive">{contactErrors[contactIndex].email}</p>}
            </div>

            {/* Permissions */}
            <div className="flex items-center gap-5">
              {[{field:"login",label:"Login"},{field:"notify",label:"Notify"},{field:"emailSync",label:"Email Sync"}].map(({field,label}) => (
                <label key={field} className="flex items-center gap-1.5 cursor-not-allowed opacity-60">
                  <input type="checkbox" checked={contact[field] || false} disabled
                    onChange={(e) => dispatch(updateContactField({ index: contactIndex, field, value: e.target.checked }))}
                    className="h-3.5 w-3.5 rounded accent-primary" />
                  <span className="text-xs text-foreground">{label}</span>
                </label>
              ))}
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <Label>Tags</Label>
              <TagsMultiSelectDropDown
                options={tags}
                value={contact.tags || []}
                onChange={(newValue) => dispatch(setContactTags({ index: contactIndex, tags: newValue }))}
                placeholder="Select tags"
              />
            </div>

            {/* Phone Numbers */}
            <div className="space-y-2">
              <SheetHeader className="px-0 py-0 space-y-0">
                <SheetTitle className="text-xs font-semibold">Phone Numbers</SheetTitle>
              </SheetHeader>
              {contact.phoneNumbers && contact.phoneNumbers.map((phone, phoneIndex) => (
                <div key={phoneIndex} className="flex items-center gap-2">
                  <div className="flex-1">
                    <PhoneInput country="us" value={phone}
                      onChange={(value) => dispatch(updatePhoneNumber({ contactIndex, phoneIndex, value }))}
                      inputStyle={{ width: "100%", height: "36px", fontSize: "14px" }}
                      buttonStyle={{ borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}
                    />
                  </div>
                  <button type="button" onClick={() => dispatch(removePhoneNumber({ contactIndex, phoneIndex }))}
                    disabled={contact.phoneNumbers.length === 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  {phoneIndex === contact.phoneNumbers.length - 1 && (
                    <button type="button" onClick={() => dispatch(addPhoneNumber(contactIndex))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <SheetHeader className="px-0 py-0 space-y-0">
                <SheetTitle className="text-xs font-semibold">Address</SheetTitle>
              </SheetHeader>
              <div className="space-y-1">
                <Label>Country</Label>
                <select
                  value={contact.country?.value || ""}
                  onChange={(e) => dispatch(setContactCountry({ index: contactIndex, country: options.find(o => o.value === e.target.value) || null }))}
                  className={selectCls}>
                  <option value="">Select Country</option>
                  {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Street Address</Label>
                <Input name="streetAdd" value={contact.streetAdd || ""} placeholder="Street address" onChange={(e) => handleChange(contactIndex, e)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1"><Label>City</Label><Input name="city" value={contact.city || ""} placeholder="City" onChange={(e) => handleChange(contactIndex, e)} /></div>
                <div className="space-y-1"><Label>State</Label><Input name="state" value={contact.state || ""} placeholder="State" onChange={(e) => handleChange(contactIndex, e)} /></div>
                <div className="space-y-1"><Label>ZIP Code</Label><Input name="zipCode" value={contact.zipCode || ""} placeholder="ZIP Code" onChange={(e) => handleChange(contactIndex, e)} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

        <Button variant="outline" size="sm" type="button" onClick={handleAddContact} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Contact
        </Button>
      </div>

      {/* Footer actions */}
      <SheetFooter className="border-t border-border/40 pt-3 pb-1">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" type="button" onClick={onBack} className="gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </Button>
          <Button size="sm" type="button" onClick={handleSubmitWithPersonalization} disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </SheetFooter>

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