import React, { useState, useEffect, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown.js";

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const ContactForm = ({
  onContactUpdated,
  selectedContact,
  handleClose,
  isSmallScreen,
}) => {
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [tagsNew, setTagsNew] = useState([]);
  const [contactId, setContactId] = useState(null);
  const [combinedTagsValues, setCombinedTagsValues] = useState(null);

  const options = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    if (selectedContact) {
      setFirstName(selectedContact.firstName || "");
      setMiddleName(selectedContact.middleName || "");
      setLastName(selectedContact.lastName || "");
      setContactName(selectedContact.contactName || "");
      setCompanyName(selectedContact.companyName || "");
      setNote(selectedContact.note || "");
      setSsn(selectedContact.ssn || "");
      setEmail(selectedContact.email || "");
      setSelectedCountry({
        value: selectedContact.country?.code,
        label: selectedContact.country?.name,
      });
      setStreetAddress(selectedContact.streetAddress || "");
      setCity(selectedContact.city || "");
      setState(selectedContact.state || "");
      setPostalCode(selectedContact.postalCode || "");
      setContactId(selectedContact._id || null);

      const flatPhoneNumbers = selectedContact.phoneNumbers || [];
      setPhoneNumbers(
        flatPhoneNumbers.map((phone) => ({
          id: Date.now() + Math.random(),
          phone: phone.toString().startsWith("+") ? phone.toString() : `+${phone}`,
          isPrimary: false,
          country: "us",
        }))
      );

      const tags = selectedContact.tags;
      const tagList = tags.map((tag) => ({
        value: tag._id,
        label: tag.tagName,
        color: tag.tagColour,
      }));
      setTagsNew(tagList);
      setCombinedTagsValues(tagList.map((option) => option.value));
    }
  }, [selectedContact]);

  const handlePhoneNumberChange = (phoneValue, countryData, id) => {
    setPhoneNumbers((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, phone: phoneValue, countryCode: countryData.dialCode, country: countryData.countryCode.toLowerCase() }
          : item
      )
    );
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers((prev) => [...prev, { id: Date.now(), phone: "", country: "us", isPrimary: false }]);
  };

  const handleDeletePhoneNumber = (id) => {
    setPhoneNumbers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTagChange = (newSelectedTags) => {
    setTagsNew(newSelectedTags);
    setCombinedTagsValues(newSelectedTags.map((option) => option.value));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formattedPhoneNumbers = phoneNumbers.map((item) => item.phone);
    const countryPayload = selectedCountry
      ? { name: selectedCountry.label, code: selectedCountry.value }
      : null;

    const payload = JSON.stringify({
      firstName, middleName, lastName, contactName, companyName,
      note, ssn, email, tags: combinedTagsValues,
      country: countryPayload, streetAddress, city, state, postalCode,
      phoneNumbers: formattedPhoneNumbers,
    });

    fetch(`https://www.snptaxes.com/api/contacts/contact/${contactId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((res) => { if (!res.ok) throw new Error("Request failed"); return res.json(); })
      .then(() => { toast.success("Contact updated successfully!"); handleClose(); onContactUpdated(); })
      .catch(() => { toast.error("Failed to update contact"); });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-5 space-y-5 bg-background">

      {/* ── Basic Info ── */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Basic Info</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>First Name</label>
            <input className={inputCls} name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
          </div>
          <div>
            <label className={labelCls}>Middle Name</label>
            <input className={inputCls} name="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle Name" />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input className={inputCls} name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
          </div>
        </div>
      </div>

      {/* ── Contact Details ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Contact Name</label>
          <input className={inputCls} name="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact Name" />
        </div>
        <div>
          <label className={labelCls}>Company Name</label>
          <input className={inputCls} name="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input className={inputCls} type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div>
          <label className={labelCls}>SSN</label>
          <input className={inputCls} name="ssn" value={ssn} onChange={(e) => setSsn(e.target.value)} placeholder="SSN" />
        </div>
      </div>

      {/* ── Note ── */}
      <div>
        <label className={labelCls}>Note</label>
        <textarea className={`${inputCls} min-h-[72px] resize-none`} name="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
      </div>

      {/* ── Tags ── */}
      <div>
        <label className={labelCls}>Tags</label>
        <TagsMultiSelectDropDown value={tagsNew} onChange={handleTagChange} placeholder="Tags" />
      </div>

      {/* ── Phone Numbers ── */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Phone Numbers</p>
        <div className="space-y-2">
          {phoneNumbers.map((phone) => (
            <div key={phone.id} className="flex items-center gap-2">
              {phone.isPrimary && (
                <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">Primary</span>
              )}
              <div className="flex-1">
                <PhoneInput
                  country="us"
                  value={phone.phone}
                  onChange={(value, country) => handlePhoneNumberChange(value, country, phone.id)}
                  inputStyle={{ width: "100%", height: "36px", fontSize: "14px", borderRadius: "6px", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
                  buttonStyle={{ borderRadius: "6px 0 0 6px", border: "1px solid hsl(var(--border))", background: "hsl(var(--muted))" }}
                  containerStyle={{ width: "100%" }}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeletePhoneNumber(phone.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddPhoneNumber}
          className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <Plus size={13} /> Add phone number
        </button>
      </div>

      {/* ── Address ── */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Address</p>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Country</label>
            <select
              className={inputCls}
              value={selectedCountry?.value || ""}
              onChange={(e) => {
                const opt = options.find((o) => o.value === e.target.value);
                setSelectedCountry(opt || null);
              }}
            >
              <option value="">Select Country</option>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Street Address</label>
            <input className={inputCls} name="streetAddress" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Street Address" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input className={inputCls} name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input className={inputCls} name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
            </div>
            <div>
              <label className={labelCls}>Postal Code</label>
              <input className={inputCls} name="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center gap-3 pt-2 pb-6">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
      </div>

    </div>
  );
};

export default ContactForm;
