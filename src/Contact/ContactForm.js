import React, { useState, useEffect, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";
import { toast } from "react-toastify";
import countryList from "react-select-country-list";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../components/ui/sheet";
const ContactForm = ({ handleNewDrawerClose, handleDrawerClose }) => {
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
  const [combinedValues, setCombinedValues] = useState();
  const [ssnError, setSsnError] = useState("");
  // SSN auto-formatter
  const formatSSN = (value) => {
    const v = value.replace(/\D/g, "").slice(0, 9); // only digits

    if (v.length > 5) return `${v.slice(0, 3)}-${v.slice(3, 5)}-${v.slice(5)}`;
    if (v.length > 3) return `${v.slice(0, 3)}-${v.slice(3)}`;
    return v;
  };

  // SSN validation rules
  const validateSSN = (value) => {
    const cleaned = value.replace(/-/g, "");

    if (cleaned.length !== 9) return "SSN must be 9 digits";

    if (/^(000|666|9\d{2})/.test(cleaned)) return "Invalid SSN starting digits";
    if (/^\d{3}00\d{4}$/.test(cleaned)) return "Invalid SSN middle digits";
    if (/^\d{5}0000$/.test(cleaned)) return "Invalid SSN last digits";

    return ""; // valid
  };

  // Main change handler
  const handleSSNChange = (e) => {
    const formatted = formatSSN(e.target.value);
    setSsn(formatted);

    const error = validateSSN(formatted);
    setSsnError(error); // "" means no error
  };

  const options = useMemo(() => countryList().getData(), []);

  const handlePhoneNumberChange = (phoneValue, countryData, id) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.map((item) =>
        item.id === id
          ? {
              ...item,
              phone: phoneValue,
              countryCode: countryData.dialCode, // Store country dial code
              country: countryData.countryCode.toLowerCase(), // Store country code (e.g., 'us')
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
    setPhoneNumbers((prevPhoneNumbers) => [
      ...prevPhoneNumbers,
      {
        id: Date.now(),
        phone: "",
        country: "us", // Default country
        isPrimary: false,
      },
    ]);
  };

  const handleDeletePhoneNumber = (id) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.filter((item) => item.id !== id)
    );
  };

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmaileError] = useState("");
  const validateForm = () => {
    let isValid = true;
    if (!firstName) {
      setFirstNameError("First name is required");

      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // Email
    // if (!email?.trim()) {
    //   setEmaileError("Email is required.");
    //   isValid = false;
    // } else if (
    //   !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    // ) {
    //   setEmaileError("Please enter a valid email address.");
    //   isValid = false;
    // } else {
    //   setEmaileError("");
    // }
    
  // ✅ Check: At least Email OR Phone Number
  const hasEmail = email?.trim();
  const hasPhone = phoneNumbers.some(
    (p) => p.phone && p.phone.trim() !== ""
  );

  if (!hasEmail && !hasPhone) {
    toast.info("At least Email or Phone Number is required");
    // setEmaileError("Email or Phone Number is required");
    isValid = false;
  } else {
    setEmaileError("");
  }

  // ✅ If email exists, validate format
  if (hasEmail) {
    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      setEmaileError("Please enter a valid email address.");
      isValid = false;
    }
  }
    return isValid;
  };
  
  const sendingData = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    handleNewDrawerClose();
    handleDrawerClose();

    const formattedPhoneNumbers = phoneNumbers.map((item) => item.phone);

    const countryPayload = selectedCountry
      ? { name: selectedCountry.label, code: selectedCountry.value }
      : null;

    const payload = JSON.stringify({
      firstName,
      middleName,
      lastName,
      contactName,
      companyName,
      note,
      ssn,
      email,
      tags: combinedValues,
      country: countryPayload,
      streetAddress,
      city,
      state,
      postalCode,
      phoneNumbers: formattedPhoneNumbers,
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    };

    fetch("https://www.snptaxes.com/api/contacts", requestOptions)
  .then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      // Email already exists
      if (res.status === 409) {
        setEmaileError(data.error); // show error under email field
        toast.warning("Entered email is already used");
        return;
      }

      throw new Error(data.error || "Request failed");
    }

    toast.success("Contact created successfully!");
    navigate("/clients/contacts");
  })
  .catch((error) => {
    toast.error(error.message || "Failed to create contact");
  });

  };

  const handleClose = () => {
    handleNewDrawerClose();
    handleDrawerClose();
  };

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedValues(selectedValues);
  };
  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-0 pb-4 border-b border-border/40">
        <SheetTitle className="text-base font-semibold">Contact Details</SheetTitle>
        <SheetDescription className="text-xs text-muted-foreground">
          Fill in the contact information below. Fields marked <span className="text-destructive">*</span> are required.
        </SheetDescription>
      </SheetHeader>

      <form className="flex-1 overflow-y-auto space-y-4 pt-4">

        {/* Name Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1.5">
            <Label>First Name <span className="text-destructive">*</span></Label>
            <Input
              name="firstName" value={firstName} placeholder="First Name"
              className={firstNameError ? "border-destructive" : ""}
              onChange={(e) => { setFirstName(e.target.value); if (e.target.value.trim()) setFirstNameError(""); }}
            />
            {!!firstNameError && <p className="text-xs text-destructive">{firstNameError}</p>}
          </div>
          <div className="flex-1 space-y-1.5">
            <Label>Middle Name</Label>
            <Input name="middleName" value={middleName} placeholder="Middle Name"
              onChange={(e) => setMiddleName(e.target.value)} />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label>Last Name <span className="text-destructive">*</span></Label>
            <Input
              name="lastName" value={lastName} placeholder="Last Name"
              className={lastNameError ? "border-destructive" : ""}
              onChange={(e) => { setLastName(e.target.value); if (e.target.value.trim()) setLastNameError(""); }}
            />
            {!!lastNameError && <p className="text-xs text-destructive">{lastNameError}</p>}
          </div>
        </div>

        {/* Contact Name */}
        <div className="space-y-1.5">
          <Label>Contact Name</Label>
          <Input name="contactName" value={contactName} placeholder="Contact Name"
            onChange={(e) => setContactName(e.target.value)} />
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <Label>Company Name</Label>
          <Input name="companyName" value={companyName} placeholder="Company Name"
            onChange={(e) => setCompanyName(e.target.value)} />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label>Email <span className="text-destructive">*</span></Label>
          <Input
            name="email" value={email} placeholder="Email" type="email"
            className={emailError ? "border-destructive" : ""}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              if (!value.trim()) setEmaileError("Email is required.");
              else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) setEmaileError("Please enter a valid email address.");
              else setEmaileError("");
            }}
          />
          {!!emailError && <p className="text-xs text-destructive">{emailError}</p>}
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label>Tags</Label>
          <TagsMultiSelectDropDown value={selectedTags} onChange={handleTagChange} placeholder="Tags" />
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <Label>Note</Label>
          <textarea name="note" value={note} placeholder="Note" rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            onChange={(e) => setNote(e.target.value)} />
        </div>

        {/* SSN */}
        <div className="space-y-1.5">
          <Label>SSN</Label>
          <Input
            name="ssn" value={ssn} placeholder="123-45-6789"
            maxLength={11} inputMode="numeric"
            className={ssnError ? "border-destructive" : ""}
            onChange={handleSSNChange}
          />
          {ssnError
            ? <p className="text-xs text-destructive">{ssnError}</p>
            : <p className="text-xs text-muted-foreground">Format: 123-45-6789</p>}
        </div>

        {/* Phone Numbers */}
        <div className="space-y-2">
          <SheetHeader className="px-0 py-0 space-y-0">
            <SheetTitle className="text-sm font-semibold">Phone Numbers</SheetTitle>
          </SheetHeader>
          <div className="space-y-3">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="flex items-center gap-3">
                {phone.isPrimary && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Primary</span>
                )}
                <div className="flex-1">
                  <PhoneInput
                    country="us" value={phone.phone}
                    onChange={(value, country) => handlePhoneNumberChange(value, country, phone.id)}
                    inputStyle={{ width: "100%", height: "36px", fontSize: "14px" }}
                    buttonStyle={{ borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}
                  />
                </div>
                <button type="button" onClick={() => handleDeletePhoneNumber(phone.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddPhoneNumber}
            className="flex items-center gap-1.5 text-primary text-sm font-medium mt-2 hover:text-primary/80 transition-colors">
            <Plus className="h-4 w-4" /> Add phone number
          </button>
        </div>

        {/* Address */}
        <div className="space-y-3">
          <SheetHeader className="px-0 py-0 space-y-0">
            <SheetTitle className="text-sm font-semibold">Address</SheetTitle>
          </SheetHeader>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <select
              value={selectedCountry?.value || ""}
              onChange={(e) => { const found = options.find(o => o.value === e.target.value); setSelectedCountry(found || null); }}
              className={selectCls}
            >
              <option value="">Select Country</option>
              {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Street Address</Label>
            <Input name="streetAddress" value={streetAddress} placeholder="Street address"
              onChange={(e) => setStreetAddress(e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <Label>City</Label>
              <Input name="city" value={city} placeholder="City" onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label>State / Province</Label>
              <Input name="state" value={state} placeholder="State/Province" onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label>ZIP / Postal Code</Label>
              <Input name="postalCode" value={postalCode} placeholder="ZIP/Postal Code" onChange={(e) => setPostalCode(e.target.value)} />
            </div>
          </div>
        </div>

      </form>

      <SheetFooter className="border-t border-border/40 pt-3 pb-1">
        <div className="flex items-center justify-end gap-2 w-full">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
          <Button type="submit" size="sm" onClick={sendingData}>Create</Button>
        </div>
      </SheetFooter>
    </div>
  );
};

export default ContactForm;
