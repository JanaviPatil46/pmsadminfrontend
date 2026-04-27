import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, Plus, Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import TagsMultiSelectDropDown from "./TagsMultiSelectDropDown";
import { SideSheet } from "../components/ui/side-sheet";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";

const ContactForm = ({ open, onClose, contact, onSave }) => {
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const navigate = useNavigate();

  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Individual state hooks for form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [combinedValues, setCombinedValues] = useState([]);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = useMemo(() => countryList().getData(), []);

  // Initialize form with contact data when component mounts or contact changes
  useEffect(() => {
    if (contact) {
      // Editing existing contact
      setFirstName(contact.firstName || "");
      setMiddleName(contact.middleName || "");
      setLastName(contact.lastName || "");
      setContactName(contact.contactName || "");
      setCompanyName(contact.companyName || "");
      setNote(contact.note || "");
      setSsn(contact.ssn || "");
      setEmail(contact.email || "");
      setStreetAddress(contact.streetAddress || "");
      setCity(contact.city || "");
      setState(contact.state || "");
      setPostalCode(contact.postalCode || "");
      setCombinedValues(contact.tags || []);

      // Set country if available
      if (contact.country) {
        const countryOption = options.find(
          (opt) => opt.value === contact.country.code || opt.label === contact.country.name
        );
        setSelectedCountry(countryOption || null);
      }

      // Set phone numbers if available
      if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        const formattedPhoneNumbers = contact.phoneNumbers.map((phone, index) => ({
          id: Date.now() + index,
          phone: phone || "",
          country: "us",
          isPrimary: index === 0 // Set first phone as primary
        }));
        setPhoneNumbers(formattedPhoneNumbers);
      } else {
        setPhoneNumbers([{ id: Date.now(), phone: "", country: "us", isPrimary: false }]);
      }

      // Set tags if available
      if (contact.tags) {
        const tagOptions = contact.tags.map(tag => ({ value: tag, label: tag }));
        setSelectedTags(tagOptions);
      }
    } else {
      // Creating new contact - reset form
      resetForm();
    }
  }, [contact, options]);

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setContactName("");
    setCompanyName("");
    setNote("");
    setSsn("");
    setEmail("");
    setStreetAddress("");
    setCity("");
    setState("");
    setPostalCode("");
    setCombinedValues([]);
    setSelectedCountry(null);
    setPhoneNumbers([{ id: Date.now(), phone: "", country: "us", isPrimary: false }]);
    setSelectedTags([]);
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
  };

  const handlePhoneNumberChange = (phoneValue, countryData, id) => {
    setPhoneNumbers(prevPhoneNumbers =>
      prevPhoneNumbers.map(item =>
        item.id === id
          ? {
              ...item,
              phone: phoneValue,
              countryCode: countryData.dialCode,
              country: countryData.countryCode.toLowerCase()
            }
          : item
      )
    );
  };

  // Update contactName when firstName, middleName, or lastName changes
  useEffect(() => {
    setContactName(`${firstName} ${middleName} ${lastName}`.trim());
  }, [firstName, middleName, lastName]);

  const handleAddPhoneNumber = () => {
    setPhoneNumbers(prevPhoneNumbers => [
      ...prevPhoneNumbers,
      { 
        id: Date.now(), 
        phone: "", 
        country: "us",
        isPrimary: false 
      },
    ]);
  };

  const handleDeletePhoneNumber = (id) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers((prevPhoneNumbers) =>
        prevPhoneNumbers.filter((item) => item.id !== id)
      );
    } else {
      toast.warning("At least one phone number is required");
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!firstName?.trim()) {
      setFirstNameError("First name is required");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName?.trim()) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }
    
    // Email validation
    if (!email?.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    return isValid;
  };

  const sendingData = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const formattedPhoneNumbers = phoneNumbers
      .map((item) => item.phone)
      .filter(phone => phone.trim() !== "");

    const countryPayload = selectedCountry
      ? { name: selectedCountry.label, code: selectedCountry.value }
      : null;

    const payload = {
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      contactName: contactName.trim(),
      companyName: companyName.trim(),
      note: note.trim(),
      ssn: ssn.trim(),
      email: email.trim(),
      tags: combinedValues,
      country: countryPayload,
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      phoneNumbers: formattedPhoneNumbers,
    };

    const requestOptions = {
      method: contact ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact ? [payload] : payload) // Adjust based on your API
    };

    const url = contact 
      ? `https://www.snptaxes.com/api/contacts/${contact.id}` // Adjust endpoint for update
      : "https://www.snptaxes.com/api/contacts";

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) throw new Error("Request failed");
      
      const result = await response.json();
      
      toast.success(`Contact ${contact ? 'updated' : 'created'} successfully!`);
      
      if (onSave) {
        onSave(result); // Callback for parent component
      }
      
      navigate("/clients/contacts");
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to ${contact ? 'update' : 'create'} contact`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedValues(selectedValues);
  };

  const fieldCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";
  const countriesList = useMemo(() => countryList().getData(), []);

  return (
    <SideSheet
      open={open}
      onOpenChange={(v) => !v && handleClose()}
      title={contact ? 'Edit Contact' : 'New Contact'}
      size="lg"
      hideDefaultFooter
    >
      <form onSubmit={sendingData} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>First Name <span className="text-destructive">*</span></Label>
            <Input value={firstName} placeholder="First Name"
              className={!!firstNameError ? "border-destructive" : ""}
              onChange={(e) => { setFirstName(e.target.value); if (e.target.value.trim()) setFirstNameError(""); }}
            />
            {!!firstNameError && <p className="text-xs text-destructive">{firstNameError}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Middle Name</Label>
            <Input value={middleName} placeholder="Middle Name" onChange={(e) => setMiddleName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Last Name <span className="text-destructive">*</span></Label>
            <Input value={lastName} placeholder="Last Name"
              className={!!lastNameError ? "border-destructive" : ""}
              onChange={(e) => { setLastName(e.target.value); if (e.target.value.trim()) setLastNameError(""); }}
            />
            {!!lastNameError && <p className="text-xs text-destructive">{lastNameError}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Contact Name</Label>
          <Input value={contactName} placeholder="Contact Name" onChange={(e) => setContactName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Company Name</Label>
          <Input value={companyName} placeholder="Company Name" onChange={(e) => setCompanyName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Email <span className="text-destructive">*</span></Label>
          <Input value={email} placeholder="Email" type="email"
            className={!!emailError ? "border-destructive" : ""}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              if (!value.trim()) setEmailError("Email is required.");
              else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) setEmailError("Please enter a valid email address.");
              else setEmailError("");
            }}
          />
          {!!emailError && <p className="text-xs text-destructive">{emailError}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Tags</Label>
          <TagsMultiSelectDropDown value={selectedTags} onChange={handleTagChange} placeholder="Tags" />
        </div>

        <div className="space-y-1.5">
          <Label>Note</Label>
          <Textarea value={note} placeholder="Note" rows={3} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>SS</Label>
          <Input value={ssn} placeholder="SSN" onChange={(e) => setSsn(e.target.value)} />
        </div>

        {/* Phone Numbers */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Phone Numbers</p>
          <div className="space-y-2">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="flex items-center gap-2 relative">
                {phone.isPrimary && (
                  <span className="absolute -top-2 left-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">Primary</span>
                )}
                <div className="flex-1">
                  <PhoneInput
                    country="us"
                    value={phone.phone}
                    onChange={(value, country) => handlePhoneNumberChange(value, country, phone.id)}
                    inputStyle={{ width: "100%", borderRadius: "6px", height: "36px", fontSize: "14px" }}
                    buttonStyle={{ borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}
                  />
                </div>
                <button type="button" onClick={() => handleDeletePhoneNumber(phone.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={handleAddPhoneNumber} className="h-8 gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add phone number
          </Button>
        </div>

        {/* Address */}
        <div className="space-y-3 pt-1">
          <p className="text-sm font-semibold text-foreground">Address</p>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <select
              value={selectedCountry?.value || ""}
              onChange={(e) => {
                const opt = countriesList.find(c => c.value === e.target.value) || null;
                setSelectedCountry(opt);
              }}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Select Country</option>
              {countriesList.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Street Address</Label>
            <Input value={streetAddress} placeholder="Street address" onChange={(e) => setStreetAddress(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input value={city} placeholder="City" onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>State/Province</Label>
              <Input value={state} placeholder="State/Province" onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>ZIP/Postal Code</Label>
              <Input value={postalCode} placeholder="ZIP/Postal Code" onChange={(e) => setPostalCode(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Sticky footer actions */}
        <div className="flex items-center justify-end gap-2 pt-4 pb-2 border-t border-border/40 sticky bottom-0 bg-background">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : (contact ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </SideSheet>
  );
};

export default ContactForm;