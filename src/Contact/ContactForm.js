import React, { useState, useEffect, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Plus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./contact.css";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";
import { toast } from "react-toastify";
import countryList from "react-select-country-list";
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
  const inputCls = "w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow shadow-sm";
  const labelCls = "block text-sm font-medium text-foreground mb-1.5";
  const btnPrimary = "inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors shadow-sm";
  const btnOutline = "inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors";
  const errorCls = "text-destructive text-xs mt-1";

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">New Contact</h2>
        <button type="button" onClick={handleNewDrawerClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form className="contact-form px-5 py-4 h-[90vh] overflow-y-auto space-y-4">

        {/* Name Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={labelCls}>First Name <span className="text-destructive">*</span></label>
            <input
              name="firstName"
              value={firstName}
              placeholder="First Name"
              className={`${inputCls} ${firstNameError ? "border-destructive" : ""}`}
              onChange={(e) => { setFirstName(e.target.value); if (e.target.value.trim()) setFirstNameError(""); }}
            />
            {!!firstNameError && <p className={errorCls}>{firstNameError}</p>}
          </div>
          <div className="flex-1">
            <label className={labelCls}>Middle Name</label>
            <input name="middleName" value={middleName} placeholder="Middle Name" className={inputCls}
              onChange={(e) => setMiddleName(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className={labelCls}>Last Name <span className="text-destructive">*</span></label>
            <input
              name="lastName"
              value={lastName}
              placeholder="Last Name"
              className={`${inputCls} ${lastNameError ? "border-destructive" : ""}`}
              onChange={(e) => { setLastName(e.target.value); if (e.target.value.trim()) setLastNameError(""); }}
            />
            {!!lastNameError && <p className={errorCls}>{lastNameError}</p>}
          </div>
        </div>

        {/* Contact Name */}
        <div>
          <label className={labelCls}>Contact Name</label>
          <input name="contactName" value={contactName} placeholder="Contact Name" className={inputCls}
            onChange={(e) => setContactName(e.target.value)} />
        </div>

        {/* Company Name */}
        <div>
          <label className={labelCls}>Company Name</label>
          <input name="companyName" value={companyName} placeholder="Company Name" className={inputCls}
            onChange={(e) => setCompanyName(e.target.value)} />
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>Email <span className="text-destructive">*</span></label>
          <input
            name="email"
            value={email}
            placeholder="Email"
            className={`${inputCls} ${emailError ? "border-destructive" : ""}`}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              if (!value.trim()) setEmaileError("Email is required.");
              else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) setEmaileError("Please enter a valid email address.");
              else setEmaileError("");
            }}
          />
          {!!emailError && <p className={errorCls}>{emailError}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className={labelCls}>Tags</label>
          <TagsMultiSelectDropDown value={selectedTags} onChange={handleTagChange} placeholder="Tags" />
        </div>

        {/* Note */}
        <div>
          <label className={labelCls}>Note</label>
          <textarea name="note" value={note} placeholder="Note" rows={3}
            className={`${inputCls} resize-none`} onChange={(e) => setNote(e.target.value)} />
        </div>

        {/* SSN */}
        <div>
          <label className={labelCls}>SSN</label>
          <input
            name="ssn"
            value={ssn}
            placeholder="123-45-6789"
            maxLength={11}
            inputMode="numeric"
            className={`${inputCls} ${ssnError ? "border-destructive" : ""}`}
            onChange={handleSSNChange}
          />
          {ssnError
            ? <p className={errorCls}>{ssnError}</p>
            : <p className="text-muted-foreground text-xs mt-1">Format: 123-45-6789</p>}
        </div>

        {/* Phone Numbers */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Phone Numbers</h3>
          <div className="space-y-3">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="flex items-center gap-3">
                {phone.isPrimary && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Primary</span>
                )}
                <div className="flex-1">
                  <PhoneInput
                    country={"us"}
                    value={phone.phone}
                    onChange={(value, country) => handlePhoneNumberChange(value, country, phone.id)}
                    inputStyle={{ width: "100%" }}
                    buttonStyle={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}
                  />
                </div>
                <button type="button" onClick={() => handleDeletePhoneNumber(phone.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 flex-shrink-0 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddPhoneNumber}
            className="flex items-center gap-1.5 text-primary text-sm font-medium mt-3 hover:text-primary/80 transition-colors">
            <Plus className="h-4 w-4" /> Add phone number
          </button>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Address</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Country</label>
              <select
                value={selectedCountry?.value || ""}
                onChange={(e) => {
                  const found = options.find(o => o.value === e.target.value);
                  setSelectedCountry(found || null);
                }}
                className={inputCls}
              >
                <option value="">Select Country</option>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Street Address</label>
              <input name="streetAddress" value={streetAddress} placeholder="Street address" className={inputCls}
                onChange={(e) => setStreetAddress(e.target.value)} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className={labelCls}>City</label>
                <input name="city" value={city} placeholder="City" className={inputCls}
                  onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className={labelCls}>State / Province</label>
                <input name="state" value={state} placeholder="State/Province" className={inputCls}
                  onChange={(e) => setState(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className={labelCls}>ZIP / Postal Code</label>
                <input name="postalCode" value={postalCode} placeholder="ZIP/Postal Code" className={inputCls}
                  onChange={(e) => setPostalCode(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2 pb-6">
          <button type="submit" className={btnPrimary} onClick={sendingData}>Create</button>
          <button type="button" className={btnOutline} onClick={handleClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
