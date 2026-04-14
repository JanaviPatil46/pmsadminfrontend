import React, { useState, useEffect, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import countryList from "react-select-country-list";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown.js";
const ContactForm = ({
  onContactUpdated,
  selectedContact,
  handleClose,
  isSmallScreen,
}) => {
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  console.log("selected contact in update form", selectedContact);
  // State variables for form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  console.log("selectedcountry", selectedCountry);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");

  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [tagsNew, setTagsNew] = useState([]);
  // const [tags, setTags] = useState([]);
  const [contactId, setContactId] = useState(null); // Added state for contact ID
  const [combinedTagsValues, setCombinedTagsValues] = useState(null);
  useEffect(() => {
    if (selectedContact) {
      console.log(selectedContact);
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
      setContactId(selectedContact._id || null); // Set contact ID

      const flatPhoneNumbers = selectedContact.phoneNumbers || [];

      setPhoneNumbers(
        flatPhoneNumbers.map((phone) => ({
          id: Date.now() + Math.random(),
          phone: phone.toString().startsWith("+")
            ? phone.toString()
            : `+${phone}`,
          isPrimary: false,
          country: "us", // default since no country info in DB
        }))
      );

      console.log("phone numbers", flatPhoneNumbers);

      const tags = selectedContact.tags; // Since data is nested inside an array
      console.log("Tags with IDs:", tags);
      const tagList = tags.map((tag) => ({
        value: tag._id,
        label: tag.tagName,
        color: tag.tagColour,
      }));
      setTagsNew(tagList);

      const selectedTagsValues = tagList.map((option) => option.value);
      setCombinedTagsValues(selectedTagsValues);
      // console.log("Tags with IDs:", tagList);
    }
  }, [selectedContact]);

  const [countries, setCountries] = useState([]);

  const options = useMemo(() => countryList().getData(), []);

  const handleCountryChange = (event) => {
    const selectedCode = event.target.value;
    const selectedCountryObj = countries.find(
      (country) => country.code === selectedCode
    );

    // Set the selected country as an object with name and code
    setSelectedCountry({
      name: selectedCountryObj.name,
      code: selectedCode,
    });
  };

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

  const handleTagChange = (newSelectedTags) => {
    setTagsNew(newSelectedTags);
    console.log(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedTagsValues(selectedValues);
    console.log(selectedValues);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    // handleNewDrawerClose();
    // handleDrawerClose();

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
      tags: combinedTagsValues,
      country: countryPayload,
      streetAddress,
      city,
      state,
      postalCode,
      phoneNumbers: formattedPhoneNumbers,
    });

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: payload,
    };
    console.log("payload", requestOptions);
    const url = `https://www.snptaxes.com/api/contacts/contact/${contactId}`; // <-- Update existing contact ID

    fetch(url, requestOptions)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(() => {
        toast.success("Contact updated successfully!");
        handleClose();
        onContactUpdated();
        // navigate("/clients/contacts");
      })
      .catch(() => {
        toast.error("Failed to update contact");
      });
  };

  const inputCls = "w-full mt-1 rounded border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelCls = "block text-sm font-medium text-gray-700 mb-0.5";

  return (
    <form
      style={{ paddingRight: "3%", paddingLeft: "3%", height: "90vh", overflowY: "auto" }}
      className="contact-form"
    >
      <div className={`mt-1 flex ${isSmallScreen ? "flex-col gap-2" : "flex-row gap-5"} px-1`}>
        <div className="flex-1">
          <label className={labelCls}>First name</label>
          <input className={inputCls} name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Middle Name</label>
          <input className={inputCls} name="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle Name" />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Last Name</label>
          <input className={inputCls} name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
        </div>
      </div>

      {[{label:"Contact Name",val:contactName,set:setContactName,name:"contactName",ph:"Contact Name"},
        {label:"Company Name",val:companyName,set:setCompanyName,name:"companyName",ph:"Company Name"},
        {label:"Note",val:note,set:setNote,name:"note",ph:"Note"},
        {label:"SSN",val:ssn,set:setSsn,name:"ssn",ph:"SSN"},
        {label:"Email",val:email,set:setEmail,name:"email",ph:"Email"},
      ].map(({label,val,set,name,ph}) => (
        <div key={name} className="mt-2">
          <label className={labelCls}>{label}</label>
          <input className={inputCls} name={name} value={val} onChange={(e) => set(e.target.value)} placeholder={ph} />
        </div>
      ))}

      <div className="mt-2">
        <label className={labelCls}>Tags</label>
        <TagsMultiSelectDropDown value={tagsNew} onChange={handleTagChange} placeholder="Tags" />
      </div>

      <h6 className="ml-1 font-bold mt-5 mb-2 text-base">Phone Numbers</h6>
      {phoneNumbers.map((phone) => (
        <div key={phone.id} className="flex flex-row items-center gap-2 ml-1 mb-3">
          {phone.isPrimary && (
            <span className="absolute -mt-6 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">Primary phone</span>
          )}
          <PhoneInput
            country={"us"}
            value={phone.phone}
            onChange={(value, country) => handlePhoneNumberChange(value, country, phone.id)}
            inputStyle={{ width: "100%" }}
            buttonStyle={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}
            containerStyle={{ display: "flex", alignItems: "center", gap: "8px" }}
          />
          <AiOutlineDelete onClick={() => handleDeletePhoneNumber(phone.id)} style={{ cursor: "pointer", color: "red" }} />
        </div>
      ))}
      <div className="flex gap-2 items-center ml-1 cursor-pointer text-blue-600 font-semibold" onClick={handleAddPhoneNumber}>
        <AiOutlinePlusCircle className="mt-1" />
        <p>Add phone number</p>
      </div>

      <h6 className="ml-1 font-bold mt-5 mb-2 text-base">Address</h6>
      <div className="mt-2">
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
      <div className="mt-2">
        <label className={labelCls}>Street Address</label>
        <input className={inputCls} name="streetAddress" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Street Address" />
      </div>
      <div className={`mt-2 flex ${isSmallScreen ? "flex-col gap-2" : "flex-row gap-5"} px-0.5`}>
        <div className="flex-1">
          <label className={labelCls}>City</label>
          <input className={inputCls} name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
        </div>
        <div className="flex-1">
          <label className={labelCls}>State</label>
          <input className={inputCls} name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Postal Code</label>
          <input className={inputCls} name="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" />
        </div>
      </div>

      <div className="flex gap-3 mt-4 mb-4">
        <button type="button" onClick={handleSave} className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]">
          Save
        </button>
        <button type="button" onClick={handleClose} className="rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
