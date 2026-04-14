import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { AiOutlinePlusCircle as AddCircle } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import TagsMultiSelectDropDown from "../../Templates/TagsMultiSelectDropDown"
const ContactUpdateForm = ({ onContactUpdated, selectedContact, handleClose, isSmallScreen }) => {
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
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
  const [selectedCountry, setSelectedCountry] = useState({ name: "", code: "" });
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");

  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [tagsNew, setTagsNew] = useState([]);
  const [tags, setTags] = useState([]);
  const [contactId, setContactId] = useState(null); // Added state for contact ID
  const [combinedTagsValues, setCombinedTagsValues] = useState(null);

  console.log(selectedContact);
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
      // setSelectedCountry(selectedContact.country || '');
      setSelectedCountry({
        name: selectedContact.country?.name || "", // Use name field or an empty string
        code: selectedContact.country?.code || "", // Use code field or an empty string
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
    phone: phone.toString().startsWith("+") ? phone.toString() : `+${phone}`,
    isPrimary: false,
    country: "us", // default since no country info in DB
  }))
);

      
   

     console.log("Tags:", selectedContact.tags);
      const tags = selectedContact.tags; // Since data is nested inside an array
      // console.log("Tags with IDs:", tags);
      const tagList = tags.map(tag => ({
        value: tag._id,
        label: tag.tagName,
        color: tag.tagColour, 
      }));
      setTagsNew(tagList)


      const selectedTagsValues = tagList.map((option) => option.value);
      setCombinedTagsValues(selectedTagsValues);
    }
  }, [selectedContact]);

  const [countries, setCountries] = useState([]);
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((response) => {
        const countryData = response.data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryData);
      })
      .catch((error) => console.error("Error fetching country data:", error));
  }, []);

  const handleCountryChange = (event) => {
    const selectedCode = event.target.value;
    const selectedCountryObj = countries.find((country) => country.code === selectedCode);

    // Set the selected country as an object with name and code
    setSelectedCountry({
      name: selectedCountryObj.name,
      code: selectedCode,
    });
  };

  // const handlePhoneNumberChange = (id, phone) => {
  //   setPhoneNumbers((prevPhoneNumbers) => prevPhoneNumbers.map((item) => (item.id === id ? { ...item, phone } : item)));
  // };
   const handlePhoneNumberChange = (phoneValue, countryData, id) => {
  setPhoneNumbers(prevPhoneNumbers =>
    prevPhoneNumbers.map(item =>
      item.id === id
        ? {
            ...item,
            phone: phoneValue,
            countryCode: countryData.dialCode, // Store country dial code
            country: countryData.countryCode.toLowerCase() // Store country code (e.g., 'us')
          }
        : item
    )
  );
};
    const handleAddPhoneNumber = () => {
  setPhoneNumbers(prevPhoneNumbers => [
    ...prevPhoneNumbers,
    { 
      id: Date.now(), 
      phone: "", 
      country: "us", // Default country
      isPrimary: false 
    },
  ]);
};
 
  const handleDeletePhoneNumber = (id) => {
    setPhoneNumbers((prevPhoneNumbers) => prevPhoneNumbers.filter((item) => item.id !== id));
  };

 
  const handleTagChange = (newSelectedTags) => {
    setTagsNew(newSelectedTags);
    console.log(newSelectedTags)
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedTagsValues(selectedValues);
    console.log(selectedValues)
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [accountDataAll, setAccountDataAll] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${ACCOUNT_API}/accounts/account/accountdetailslist`,
          headers: {},
        };

        const response = await axios.request(config);
        setAccountDataAll(response.data.accountlist);
        console.log(response.data.accountlist);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchData();
  }, []);
  console.log(accountDataAll);

  const calculateWidth = (tagName) => {
    const baseWidth = 10;
    const charWidth = 8;
    const padding = 10;
    return baseWidth + charWidth * tagName.length + padding;
  };

  const tagsOptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,
    customStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      borderRadius: "8px",
      alignItems: "center",
      textAlign: "center",
      marginBottom: "5px",
      padding: "2px,8px",
      fontSize: "10px",
      width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
      cursor: "pointer",
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      padding: "2px,8px",
      fontSize: "15px",
      cursor: "pointer",
    },
  }));

  const handleSave = async () => {
    
  //    const formattedPhoneNumbers = phoneNumbers.map(phone => ({
  //   phone: phone.phone,
  //   country: phone.country,
   
  // }));
   const oldEmail = selectedContact.email;
    const emailChanged = oldEmail !== email;
  const formattedPhoneNumbers = phoneNumbers.map(p => p.phone);
    const updatedContact = {
      firstName,
      middleName,
      lastName,
      contactName,
      companyName,
      note,
      ssn,
      email,
      // phoneNumbers,
      phoneNumbers: formattedPhoneNumbers,
      country: selectedCountry,
      streetAddress,
      city,
      state,
      postalCode,
      tags: combinedTagsValues,
    };
    console.log(updatedContact);
    try {
      const response = await fetch(`${CONTACT_API}/contacts/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Contact updated:", result);

         // If email has changed, update all users with this contactId
      if (emailChanged) {
  await updateUsersEmail(contactId, email);
}

        toast.success("Contact updated successfully!");
        if (onContactUpdated) {
          onContactUpdated(); // Call the callback function
        }
        handleClose(); // Close the form on success
      } 
      else {
        console.error("Failed to update contact:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact");
    }
  };
   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  // Function to update users' email based on contactId
const updateUsersEmail = async (contactId, newEmail) => {
  try {
    const response = await fetch(
      `${LOGIN_API}/common/user/update-email-by-contact/${contactId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("Users email updated:", result);
      // toast.success("Users email updated!");
    } else {
      toast.warning("Contact updated but failed to update users");
    }
  } catch (error) {
    console.error("Error:", error);
    toast.warning("Contact updated but failed to update users");
  }
};


  const [accountdata, SetAccountData] = useState([]);
  const getaccountbycontactid = (contactId) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${ACCOUNT_API}/accounts/accountdetails/accountbycontactid/${contactId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        SetAccountData(result.accounts);
      })
      .catch((error) => console.error(error));
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  // const handleDrawerOpen = () => {
  //     setDrawerOpen(true);
  // };
  const handleDrawerOpen = () => {
    // Initialize checkedAccounts when the drawer opens
    const initialCheckedAccounts = accountDataAll.filter((account) => Array.isArray(account.Contacts) && account.Contacts.some((contact) => contact._id === contactId)).map((account) => account.id);
    setCheckedAccounts(initialCheckedAccounts);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [checkedAccounts, setCheckedAccounts] = useState([]);

  // Function to handle checkbox change
  // const handleCheckboxChange = (accountId) => {
  //     setCheckedAccounts((prev) => {
  //         if (prev.includes(accountId)) {
  //             // If the accountId is already checked, remove it
  //             return prev.filter((id) => id !== accountId);
  //         } else {
  //             // Otherwise, add it to the checked list
  //             return [...prev, accountId];
  //         }
  //     });
  // };
  const handleCheckboxChange = (accountId) => {
    setCheckedAccounts((prev) => {
      if (prev.includes(accountId)) {
        // If already checked, remove from checkedAccounts
        return prev.filter((id) => id !== accountId);
      } else {
        // Otherwise, add to checkedAccounts
        return [...prev, accountId];
      }
    });
  };

  // console.log(checkedAccounts);

  const updatecontactidtoAccounts = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountIds: checkedAccounts,
      contactId: contactId,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/updatecontacts/byaccountIds`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  // const [accountdata, setAccountData] = useState(initialAccountData);

  const handleRemoveAccount = (accountId) => {
    removecontactidfromaccount(accountId);
    const updatedAccountData = accountdata.filter((account) => account._id !== accountId);
    SetAccountData(updatedAccountData); // Update the state to remove the clicked account
  };

  const removecontactidfromaccount = (accountId) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch(`${ACCOUNT_API}/accounts/accountdetails/removecontactfromaccount/${accountId}/${contactId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  const inputCls = "w-full border border-gray-300 rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-blue-400";
  const labelCls = "block text-sm text-gray-700 font-medium";

  return (
    <form style={{ paddingRight: "3%", paddingLeft: "3%", height: "90vh", overflowY: "auto" }} className="contact-form">

      {/* Name row */}
      <div className={`flex ${isSmallScreen ? "flex-col gap-2" : "flex-row gap-5"} mt-4 px-1`}>
        <div className="flex-1">
          <label className={labelCls}>First name</label>
          <input type="text" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className={inputCls} />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Middle Name</label>
          <input type="text" name="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle Name" className={inputCls} />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Last Name</label>
          <input type="text" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputCls} />
        </div>
      </div>

      <div className="mt-3">
        <label className={labelCls}>Contact Name</label>
        <input type="text" name="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact Name" className={inputCls} />
      </div>
      <div className="mt-3">
        <label className={labelCls}>Company Name</label>
        <input type="text" name="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" className={inputCls} />
      </div>
      <div className="mt-3">
        <label className={labelCls}>Note</label>
        <input type="text" name="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" className={inputCls} />
      </div>
      <div className="mt-3">
        <label className={labelCls}>SSN</label>
        <input type="text" name="ssn" value={ssn} onChange={(e) => setSsn(e.target.value)} placeholder="SSN" className={inputCls} />
      </div>
      <div className="mt-3">
        <label className={labelCls}>Email</label>
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputCls} />
      </div>

      <div className="mt-3 mr-2">
        <label className={labelCls + " mb-1"}>Tags</label>
        <TagsMultiSelectDropDown
          value={tagsNew}
          onChange={handleTagChange}
          placeholder="Tags"
        />
      </div>

      <h3 className="ml-1 font-bold mt-6 mb-2 text-base">Phone Numbers</h3>
      {phoneNumbers.map((phone) => (
        <div key={phone.id} className="flex flex-row items-center gap-3 ml-1 mb-3">
          <PhoneInput
            country="us"
            value={phone.phone}
            onChange={(value, country) => handlePhoneNumberChange(value, country, phone.id)}
            inputStyle={{ width: "100%" }}
            buttonStyle={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}
            containerStyle={{ display: "flex", alignItems: "center", gap: "8px" }}
          />
          <AiOutlineDelete onClick={() => handleDeletePhoneNumber(phone.id)} className="cursor-pointer text-red-500 shrink-0" />
        </div>
      ))}
      <div className="flex items-center gap-2 ml-1 cursor-pointer text-blue-600 font-semibold mt-1 mb-3"
        onClick={handleAddPhoneNumber}>
        <AiOutlinePlusCircle className="mt-1" />
        <span>Add phone number</span>
      </div>

      <h3 className="ml-1 font-bold mt-5 mb-2 text-base">Address</h3>
      <div>
        <label className={labelCls}>Country</label>
        <select
          value={selectedCountry.code}
          onChange={handleCountryChange}
          className={inputCls}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>{country.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <label className={labelCls}>Street Address</label>
        <input type="text" name="streetAddress" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Street Address" className={inputCls} />
      </div>
      <div className={`mt-3 flex ${isSmallScreen ? "flex-col gap-2" : "flex-row gap-5"} px-1`}>
        <div className="flex-1">
          <label className={labelCls}>City</label>
          <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputCls} />
        </div>
        <div className="flex-1">
          <label className={labelCls}>State</label>
          <input type="text" name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className={inputCls} />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Postal Code</label>
          <input type="text" name="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" className={inputCls} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm">Linked accounts</span>
          <button type="button" onClick={handleDrawerOpen}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            <AddCircle size={16} /> Link accounts
          </button>
        </div>

        {/* Link Accounts Drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/30" onClick={handleDrawerClose} />
            <div className="absolute right-0 top-0 h-full w-[700px] bg-white shadow-xl overflow-y-auto p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold">Link accounts</h2>
                <button type="button" onClick={handleDrawerClose}>
                  <IoClose className="text-gray-500 text-xl" />
                </button>
              </div>
              <input type="text" placeholder="Search" className={inputCls + " mb-4"} />
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 w-10"></th>
                      <th className="text-left px-3 py-2 text-xs font-bold">ID</th>
                      <th className="text-left px-3 py-2 text-xs font-bold">Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {accountDataAll.map((account) => (
                      <tr key={account.id}>
                        <td className="px-3 py-2">
                          <input type="checkbox" checked={checkedAccounts.includes(account.id)}
                            onChange={() => handleCheckboxChange(account.id)}
                            className="h-4 w-4" />
                        </td>
                        <td className="px-3 py-2 text-xs">{account.id}</td>
                        <td className="px-3 py-2 text-xs">{account.Name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={updatecontactidtoAccounts}
                  className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] w-20">
                  Save
                </button>
                <button type="button" onClick={handleDrawerClose}
                  className="rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white w-20">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Linked accounts table */}
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-bold">Name</th>
                <th className="text-left px-4 py-2 text-xs font-bold">Description</th>
                <th className="px-4 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accountdata.map((account) => (
                <tr key={account._id}>
                  <td className="px-4 py-2">
                    <a href={`/app/clients/${account._id}`} target="_blank" rel="noopener"
                      className="text-blue-600 hover:underline text-sm">
                      {account.accountName}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{account.description}</td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => handleRemoveAccount(account._id)}
                      className="text-gray-400 hover:text-red-500">
                      <IoClose size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3 mt-4 mb-4">
        <button type="button" onClick={handleSave}
          className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] w-20">
          Save
        </button>
        <button type="button" onClick={handleClose}
          className="rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white w-20">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ContactUpdateForm;
