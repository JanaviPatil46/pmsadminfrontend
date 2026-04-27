import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import { LoginContext } from "../Sidebar/Context/Context";
import debounce from "lodash.debounce";
import { CheckCircle2, ChevronRight, ChevronDown, MoreVertical, Plus, Trash2, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../components/ui/sheet";
const AccountForm = ({ handleNewDrawerClose, handleDrawerClose }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const { logindata } = useContext(LoginContext);

  const [loginUserId, setLoginUserId] = useState();

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Account Info");
  const [accountType, setAccountType] = useState("Individual");
  const [accountName, setaccountName] = useState("");
  const [companyname, setcompanyname] = useState("");

  const [countries, setCountries] = useState([]);
  const [newUserId, setNewUserId] = useState("");
  // const [state, setstate] = useState('')
  const [cStreetAddress, SetCStreetAddress] = useState("");
  const [cCity, setCcity] = useState("");
  const [cStateProvince, SetCStateProvince] = useState("");
  const [cZipPostalCode, SetCZipPostalCode] = useState("");
  const [activeStep, setActiveStep] = useState("Account Info");

  // validation
  const [accountNameError, setAccountNameError] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [foldertemplateError, setFolderTemplateError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmaileError] = useState("");

  const validateForm = () => {
    let isValid = true;
    if (!accountName) {
      setAccountNameError("Account name is required");

      isValid = false;
    } else {
      setAccountNameError("");
    }
    if (accountType === "Company") {
      if (!companyname) {
        setCompanyNameError("Company Name is required.");
        isValid = false;
      } else {
        setCompanyNameError("");
      }
    }

    if (!selectedTemplate) {
      setFolderTemplateError("Folder Temaplte is required.");
      isValid = false;
    } else {
      setFolderTemplateError("");
    }

    return isValid;
  };

  const validateContactForm = () => {
    let isValid = true;

    // Validate all contacts in the list
    contacts.forEach((contact) => {
      if (!contact.firstName || !contact.firstName.trim()) {
        setFirstNameError("First name is required.");
        isValid = false;
      } else {
        setFirstNameError("");
      }

      if (!contact.lastName || !contact.lastName.trim()) {
        setLastNameError("Last name is required.");
        isValid = false;
      } else {
        setLastNameError("");
      }

      if (!contact.email || !contact.email.trim()) {
        setEmaileError("Email is required.");
        isValid = false;
      } else {
        setEmaileError("");
      }
    });

    return isValid;
  };

  const handleOptionChange = (event, value) => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

    setSelectedOption(value || event.target.value);
    setActiveStep(value || event.target.value);
    handleSubmit();
  };

  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedTeamMemberValues, setCombinedTeamMemberValues] = useState([]);
  const [userData, setUserData] = useState([]);

  // console.log(combinedValues)
  useEffect(() => {
    fetchUserData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserData = async () => {
    try {
      // const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedTeamMemberValues(selectedValues);
    console.log(selectedValues);
  };

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

  const [selectedTags, setSelectedTags] = useState([]);
  const [combinedValues, setCombinedValues] = useState();

  const handleTagChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
    console.log(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  //Tag FetchData ================
  const [tags, setTags] = useState([]);
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
  //  for tags
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
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
      padding: "2px 8px",
      fontSize: "10px",
      width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      // padding: "2px",
      fontSize: "10px",
      cursor: "pointer",
    },
  }));

  // folder templates
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchFolderData();
  }, []);

  const fetchFolderData = async () => {
    try {
      const url = `${API_KEY}/foldertemp/folder`;
      const response = await fetch(url);
      const data = await response.json();
      setFolderTemplates(data.folderTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelectTemplate = (selectedOptions) => {
    setSelectedTemplate(selectedOptions);
    if (selectedOptions) {
      setFolderTemplateError("");
    }
  };
  const optionfolder = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));
  const [AccountId, setAccountId] = useState();
  const [folderTempId, setFolderTempId] = useState();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const SEVER_PORT = process.env.REACT_APP_SERVER_URI;
  const CLIENT_PORT = process.env.REACT_APP_CLIENT_SERVER_URI;

  const updateAcountUserId = (UserId, accountuserid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userid: UserId,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const Url = `${ACCOUNT_API}/accounts/accountdetails/${accountuserid}`;
    console.log(Url);

    fetch(Url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })

      .catch((error) => console.error(error));
  };

  const handleSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accountType === "Individual") {
      const raw = JSON.stringify({
        clientType: accountType, // Default to empty string if null or undefined
        accountName: accountName, // Default to empty string if null or undefined
        tags: combinedValues || [], // Default to an empty array if null or undefined
        teamMember: combinedTeamMemberValues || [], // Default to an empty array if null or undefined
        foldertemplate: selectedTemplate?.value || null, // Default to empty string if null or undefined
        adminUserId: loginUserId,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${ACCOUNT_API}/accounts/accountdetails`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          const newAccountId = result.newAccount._id;
          console.log(result.newAccount._id); // Log the result
          setAccountId(result.newAccount._id);
          console.log(result.newAccount.foldertemplate);
          setFolderTempId(result.newAccount.foldertemplate);
          addFolderTemplate(newAccountId);

          // Assign the folder template after creating the account
          assignfoldertemp(newAccountId, result.newAccount.foldertemplate);
          setAccountData(result.newAccount);
          fetchAccountDataById(result.newAccount._id);
          // updateContactsAccountId(result.newAccount._id);
          toast.success("Form submitted successfully"); // Display success toast
        })
        .catch((error) => {
          console.error(error); // Log the error
          toast.error("An error occurred while submitting the form"); // Display error toast
        });
    } else if (accountType === "Company") {
      const raw = JSON.stringify({
        clientType: accountType, // Default to empty string if null or undefined
        accountName: accountName, // Default to empty string if null or undefined
        tags: combinedValues || [], // Default to an empty array if null or undefined
        teamMember: combinedTeamMemberValues || [], // Default to an empty array if null or undefined
        companyName: companyname, // Default to empty string if null or undefined
        country: selectedCountry || "", // Default to empty string if null or undefined
        streetAddress: cStreetAddress || "", // Default to empty string if null or undefined
        state: cStateProvince || "", // Default to empty string if null or undefined
        city: cCity || "", // Default to empty string if null or undefined
        postalCode: cZipPostalCode || "", // Default to empty string if null or undefined
        foldertemplate: selectedTemplate?.value || null, // Default to empty string if null or undefined
        adminUserId: loginUserId,
      });
      console.log(raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${ACCOUNT_API}/accounts/accountdetails`;
      console.log(url);
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result); // Log the result
          console.log(result.newAccount._id);
          const newAccountId = result.newAccount._id;
          setAccountId(result.newAccount._id);
          addFolderTemplate(result.newAccount._id);
          assignfoldertemp(newAccountId, result.newAccount.foldertemplate);
          setAccountData(result.newAccount);
          fetchAccountDataById(result.newAccount._id);
          // updateContactsAccountId(result.newAccount._id);
          toast.success("Form submitted successfully"); // Display success toast
        })
        .catch((error) => {
          console.error(error); // Log the error
          toast.error("An error occurred while submitting the form"); // Display error toast
        });
    }
    //todo contact
  };
  const CLIENT_DOCS_API = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const addFolderTemplate = (accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: accountId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    console.log("Creating folder for account:", accountId);
    fetch(`${CLIENT_DOCS_API}/clientdocs/clients`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const assignfoldertemp = (accountId, foldertempId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: accountId,
      foldertempId: foldertempId || null,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);
    fetch(`${CLIENT_DOCS_API}/clientdocs/accountfoldertemp`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  // const handleDeletePhoneNumber = (phoneIndex) => {
  //   setPhoneNumbers((prevPhoneNumbers) => {
  //     // Create a new array excluding the phone number at the specified index
  //     return prevPhoneNumbers.filter((_, index) => index !== phoneIndex);
  //   });
  // };

  //for creating multiple forms when click on Add New Contact
  const [contactCount, setContactCount] = useState(1);

  const [contacts, setContacts] = useState([]);

  const addNewContact = () => {
    setContacts([
      ...contacts,
      {
        firstName: "",
        middleName: "",
        lastName: "",
        contactName: "",
        companyName: "",
        note: "",
        ssn: "",
        email: "",
        login: "false",
        notify: "false",
        emailSync: "false",
        tags: [],
        phoneNumbers: [],
        country: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        accountid: AccountId,
      },
    ]);
    setContactCount(contactCount + 1);
  };
  // ✅ Remove a contact
  const handleDeleteContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };
  const handleContactInputChange = (index, event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    const updatedContacts = [...contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [name]: trimmedValue,
    };

    // Automatically update the contact name based on first, middle, and last names
    const firstName = updatedContacts[index].firstName || "";
    const middleName = updatedContacts[index].middleName || "";
    const lastName = updatedContacts[index].lastName || "";
    // updatedContacts[index].contactName =
    // `${firstName} ${middleName} ${lastName}`.trim();
    updatedContacts[index].contactName =
      `${firstName} ${middleName} ${lastName}`.trim();

    setContacts(updatedContacts);

    if (name === "firstName") {
      setFirstNameError(trimmedValue ? "" : "First name is required.");
    }

    if (name === "lastName") {
      setLastNameError(trimmedValue ? "" : "Last name is required.");
    }

    if (name === "email") {
      setEmaileError(trimmedValue ? "" : "Email is required.");
    }
  };

  const handleContactSwitchChange = (index, fieldName, checked) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [fieldName]: checked ? "true" : "false",
    };
    setContacts(updatedContacts);
  };
  // const handleContactPhoneNumberChange = (
  //   index,
  //   phoneIndex,
  //   phoneValue,
  //   countryData
  // ) => {
  //   setContacts((prevContacts) => {
  //     const updatedContacts = [...prevContacts];
  //     const contact = { ...updatedContacts[index] }; // clone contact

  //     let phoneNumbers = [...(contact.phoneNumbers || [])];

  //     // Ensure phoneNumbers array is large enough
  //     if (phoneNumbers.length <= phoneIndex) {
  //       phoneNumbers = [
  //         ...phoneNumbers,
  //         ...Array(phoneIndex + 1 - phoneNumbers.length).fill({
  //           phone: "",
  //           countryCode: "",
  //           country: "",
  //         }),
  //       ];
  //     }

  //     // Update the specific phone object
  //     phoneNumbers[phoneIndex] = {
  //       ...phoneNumbers[phoneIndex],
  //       phone: phoneValue,
  //       countryCode: countryData.dialCode,
  //       country: countryData.countryCode.toLowerCase(),
  //     };

  //     // Set back into the contact and then into contacts
  //     contact.phoneNumbers = phoneNumbers;
  //     updatedContacts[index] = contact;

  //     return updatedContacts;
  //   });
  // };
  const handleContactAddressChange = (index, field, value) => {
    setContacts((prevContacts) => {
      const updatedContacts = [...prevContacts];
      updatedContacts[index] = {
        ...updatedContacts[index],
        [field]: value, // Set the field (streetAddress, city, etc.) to the new value
      };
      return updatedContacts;
    });
  };

  const handleContactTagChange = (index, event, newValue) => {
    // Map newValue to get an array of option values
    const selectedTags = newValue.map((option) => option.value);

    // Update the contacts state
    setContacts((prevContacts) => {
      const updatedContacts = [...prevContacts];
      updatedContacts[index].tags = selectedTags;
      return updatedContacts;
    });

    // Log the selected tags
    console.log("Selected Tags for contact", index, ":", selectedTags);

    // Update combined values
    setCombinedValues((prevCombinedValues) => [
      ...prevCombinedValues,
      ...selectedTags,
    ]);
  };
  const clientalldata = (userId, email, firstName, middleName, lastName) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const password = `${firstName}@123`;
    const raw = JSON.stringify({
      email: email,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      userid: userId,

      // phoneNumber: phoneNumber,
      accountName: accountName,
      password: password,
      cpassword: password,
    });
    console.log("clientalldata", raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    const url = `${LOGIN_API}/admin/clientsignup/`;
    console.log(url);
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        console.log(result.client._id);

        // setClientIdUpdate(result.client._id)
        // newUser(result.client._id);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error signing up. Please try again.");
      });
  };
  // const newUser = (accountid, email, firstName, middleName, lastName) => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   const password = `${firstName}@123`;
  //   const raw = JSON.stringify({
  //     username: firstName, // Use the first name as username
  //     email, // Use the provided email
  //     password: password, // Replace with a dynamic password logic if needed
  //     role: "Client",
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };
  //   console.log("rawec", raw);
  //   const url = `${LOGIN_API}/common/login/signup`;

  //   fetch(url, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       console.log(result._id);
  //       setNewUserId(result._id);
  //       // Update account with the newly created user ID
  //       updateAcountUserId(result._id, accountid);
  //       clientalldata(result._id, email, firstName, middleName, lastName);

  //       // clientemail to activate client portal
  //       clientCreatedmail(email, personalMessage, result._id);
  //     })
  //     .catch((error) => console.error(error));
  // };
// const newUser = (
//   accountid,
//   email,
//   firstName,
//   middleName,
//   lastName,
//   contactName,
//   login,
//   notify,
//   emailSync,
  
// ) => {
//   if (!login) return; // safety check, only run if login === true

//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   const password = `${firstName}@123`;

//   const raw = JSON.stringify({
//     username: contactName, // Full name as username
//     email,
//     password,
//     role: "Client",
//     login,
//     notify,
//     emailSync,
//   });

//   const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//     redirect: "follow",
//   };

//   console.log("New User Payload:", raw);

//   const url = `${LOGIN_API}/common/login/signup`;

//   fetch(url, requestOptions)
//     .then((response) => response.json())
//     .then((result) => {
//       console.log(result);
//       if (result._id) {
//         setNewUserId(result._id);

//         // Update account with the newly created user ID
//         updateAcountUserId(result._id, accountid);

//         // Store client info
//         clientalldata(result._id, email, firstName, middleName, lastName);

//         // Send activation mail
//         clientCreatedmail(email, personalMessage, result._id);
//       }
//     })
//     .catch((error) => console.error(error));
// };
const newUser = (
  contactId,    // ✅ added
  accountid,
  email,
  firstName,
  middleName,
  lastName,
  contactName,
  login,
  notify,
  emailSync
) => {
  if (!login) return; // safety check

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const password = `${firstName}@123`;

  const raw = JSON.stringify({
    username: contactName,
    email,
    password,
    role: "Client",
    login,
    notify,
    emailSync,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  console.log("New User Payload:", raw);

  const url = `${LOGIN_API}/common/login/signup`;

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result._id) {
        setNewUserId(result._id);

        // ✅ Update contact with created userId
        fetch(`${CONTACT_API}/contacts/${contactId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid: result._id ,login:false,notify:false,emailSync:false}),
        })
          .then((res) => res.json())
          .then((updatedContact) => {
            console.log("Contact updated with userId:", updatedContact);
          })
          .catch((err) => console.error("Error updating contact with userId:", err));

        // Update account with the newly created user ID
        updateAcountUserId(result._id, accountid);

        // Store client info
        clientalldata(result._id, email, firstName, middleName, lastName);

        // Send activation mail
        clientCreatedmail(email, personalMessage, result._id);
      }
    })
    .catch((error) => console.error(error));
};

  console.log(newUserId);

  // const handleContactAddPhoneNumber = () => {
  //   setPhoneNumbers((prevPhoneNumbers) => [
  //     ...prevPhoneNumbers,
  //     { id: Date.now(), phone: "", isPrimary: false },
  //   ]);
  // };
  // ✅ Add phone number for a specific contact
  const handleContactAddPhoneNumber = (contactIndex) => {
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex].phoneNumbers.push({
      id: Date.now(),
      phone: "",
      country: "us",
      isPrimary: updatedContacts[contactIndex].phoneNumbers.length === 0, // first one is primary
    });
    setContacts(updatedContacts);
  };

  // ✅ Change phone number for a specific contact
  const handleContactPhoneNumberChange = (
    contactIndex,
    phoneIndex,
    value,
    country
  ) => {
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex].phoneNumbers[phoneIndex].phone = value;
    updatedContacts[contactIndex].phoneNumbers[phoneIndex].country =
      country?.countryCode || "us";
    setContacts(updatedContacts);
  };

  // ✅ Delete phone number for a specific contact
  const handleDeletePhoneNumber = (contactIndex, phoneIndex) => {
    const updatedContacts = [...contacts];
    updatedContacts[contactIndex].phoneNumbers.splice(phoneIndex, 1);
    setContacts(updatedContacts);
  };

  const handlesubmitContact = () => {
  console.log("nghjg", contacts);

  fetch(`${CONTACT_API}/contacts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contacts),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      handleDrawerClose();
      handleNewDrawerClose();

      const contactIds = data.newContacts.map((contact) => contact._id);
      updateContactstoAccount(contactIds);

      // 🔑 Now match submitted contacts with created contacts (so we get _id)
      const loginContacts = data.newContacts.filter((contact) => contact.login);

      console.log("Contacts with login true:", loginContacts);

      loginContacts.forEach((contact) => {
        const contactName = `${contact.firstName || ""} ${contact.middleName || ""} ${contact.lastName || ""}`.trim();

        // ✅ Pass contact._id also to newUser
        newUser(
          contact._id,        // contactId
          contact.accountid,
          contact.email,
          contact.firstName,
          contact.middleName,
          contact.lastName,
          contactName,
          contact.login,
          contact.notify,
          contact.emailSync
        );
      });

      toast.success("Contact created successfully!");
      navigate("/clients/accounts/activeaccounts");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

//   const handlesubmitContact = () => {
//   console.log("nghjg", contacts);

//   fetch(`${CONTACT_API}/contacts/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(contacts),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Success:", data);
//       handleDrawerClose();
//       handleNewDrawerClose();

//       const contactIds = data.newContacts.map((contact) => contact._id);
//       updateContactstoAccount(contactIds);

//       // 🔑 Use the contacts you submitted, not the response
//       const loginContacts = contacts.filter((contact) => contact.login);

//       console.log("Contacts with login true:", loginContacts);

//       loginContacts.forEach((contact) => {
//         const contactName = `${contact.firstName || ""} ${contact.middleName || ""} ${contact.lastName || ""}`.trim();

//         newUser(
//           contact.accountid,
//           contact.email,
//           contact.firstName,
//           contact.middleName,
//           contact.lastName,
//           contactName,
//           contact.login,
//           contact.notify,
//           contact.emailSync
//         );
//       });

//       toast.success("Contact created successfully!");
//       navigate("/clients/accounts/activeaccounts");
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// };
  // const handlesubmitContact = () => {
  //   console.log("nghjg", contacts);
  //   //  const url =`${CONTACT_API}/contacts/`

  //   fetch(`${CONTACT_API}/contacts/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(contacts),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Success:", data);
  //       handleDrawerClose();
  //       handleNewDrawerClose();
  //       const contactIds = data.newContacts.map((contact) => contact._id);
  //       updateContactstoAccount(contactIds);

  //       const filteredContacts = data.newContacts.filter(
  //         (contact) => contact.login
  //       );

  //       console.log("Filtered Contacts:", filteredContacts);

  //       filteredContacts.forEach((contact) => {
  //         newUser(
  //           contact.accountid,
  //           contact.email,
  //           contact.firstName,
  //           contact.middleName,
  //           contact.lastName
  //         );
  //       });

  //       // toast.success("Contact created successfully!");
  //       toast.success("Contact created successfully!");

  //       navigate("/clients/accounts/activeaccounts");
  //       // Handle successful submission (e.g., clear forms, show success message)
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       // Handle errors (e.g., show error message)
  //     });
  // };
  const handleopendialog = () => {
    // validateContactForm()
    if (!validateContactForm()) {
      return; // Prevent form submission if validation fails
    }

    // if (!contacts || contacts.length === 0) {
    //   toast.error("There is no contact available! Enter atleast one contact");
    //   setIsModalVisible(false);
    // } else {
    //   console.log(contacts);
    //   setIsModalVisible(true);
    // }
    setIsModalVisible(true);
    //
  };
  const [comfirmationOpen, setComfirmationOpen] = useState(false);

  const handleOpen = () => setComfirmationOpen(true);
  const handleClose = () => setComfirmationOpen(false);
  // Open modal and set AccountId properly
  const handleOpenModal = (id) => {
    setAccountId(id);
    setComfirmationOpen(true);
  };
  // const handleDeleteData =()=>{

  // }
  const handleDeleteData = () => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/${AccountId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        setComfirmationOpen(false);
        handleNewDrawerClose();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete item");
      });
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");

  const handleCloseModal = () => {
    setIsModalVisible(false); // Hide the modal when close is clicked
  };

  const handleMessageChange = (event) => {
    setPersonalMessage(event.target.value); // Update personal message input
  };
  const updateContactstoAccount = (contactsIds) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const existingContactIds = contactData.map((contact) => contact._id);
    const combinedContacts = [
      ...new Set([...existingContactIds, ...contactsIds]),
    ];

    const raw = JSON.stringify({
      contacts: combinedContacts,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/${AccountId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  // link existing contacts
  const [open, setOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedContact, setExpandedContact] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactName, setContactName] = useState(null);
  const [contactData, setContactData] = useState([]);
  const [accountData, setAccountData] = useState(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null); // Reset selected contact when menu closes
  };

  const handleExpandClick = (contactId) => {
    // Toggle between expanding and collapsing the selected contact
    setExpandedContact((prevExpanded) =>
      prevExpanded === contactId ? null : contactId
    );
  };

  const handleMenuClick = (event, id, contactName) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(id); // Set the selected contact ID here
    setContactName(contactName);
  };

  const handleEditDescription = async () => {
    handleMenuClose();
    console.log(selectedContact);
    try {
      const url = `${CONTACT_API}/contacts/${selectedContact}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSelectedContact(data.contact);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleUnlink = () => {
    removecontactidfromaccount(selectedContact);
    handleMenuClose();
  };

  const handleContactUpdated = () => {
    fetchAccountDataById(accountDatabyid._id); // Refetch contacts when updated
  };

  const [allContactData, setAllContactData] = useState([]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${CONTACT_API}/contacts/contactlist/list/`
      );
      const flattenedContacts = response.data.contactlist.map((contact) => ({
        ...contact,
        phoneNumbers: contact.phoneNumbers
          .flat()
          .map((phoneObj) => phoneObj.phone),
        tags: contact.tags.flat().map((tagObj) => ({
          _id: tagObj._id,
          tagName: tagObj.tagName,
          tagColour: tagObj.tagColour,
        })),
      }));
      setAllContactData(flattenedContacts);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const removecontactidfromaccount = (contactId) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch(
      `${ACCOUNT_API}/accounts/accountdetails/removecontactfromaccount/${AccountId}/${contactId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        handleContactUpdated();
      })
      .catch((error) => console.error(error));
  };

  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [accountDatabyid, setAccountDatabyid] = useState([]);

  const fetchAccountDataById = (accountId) => {
    fetch(
      `${ACCOUNT_API}/accounts/accountdetails/getAccountbyIdAll/${accountId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setAccountDatabyid(result.account);
        setContactData(result.account.contacts);
      })
      .catch((error) => console.error(error));
  };

  const getSelectedIds = () => selectedContacts.join(", ");

  const setFilteredContact = () => {
    console.log("Search Query:", searchQuery);
    console.log("All Contacts Data:", allContactData);

    if (!searchQuery) {
      console.warn("Search query is empty");
      setFilteredContacts(allContactData); // Show all contacts if there's no search query
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = allContactData.filter((contact) => {
      const emailMatch =
        contact.email && contact.email.toLowerCase().includes(lowerCaseQuery);

      return emailMatch;
    });

    setFilteredContacts(filtered);
    console.log("Filtered Contacts news:", filtered);
  };

  console.log(allContactData);
  console.log(filteredContacts);
  const handleClickOpen = () => {
    setOpen(true);
    fetchContacts();
    // setFilteredContact();
  };
  useEffect(() => {
    setFilteredContact();
  }, [searchQuery, allContactData]);

  const handleLinkAccounts = () => {
    linkContactsToAccount(selectedContacts);
  };
const handleLoginToggle = (checked, contact) => {
  // Update UI state for immediate feedback
  const updatedContacts = contactData.map((c) =>
    c._id === contact._id ? { ...c, login: checked } : c
  );
  setContactData(updatedContacts);

  // If login is toggled ON -> create user
  if (checked) {
    const contactName = `${contact.firstName || ""} ${contact.middleName || ""} ${contact.lastName || ""}`.trim();

    newUser(
      contact._id,
      accountDatabyid._id,
      contact.email,
      contact.firstName,
      contact.middleName,
      contact.lastName,
      contactName,
      true,                // login
      contact.notify || false,
      contact.emailSync || false
    );
  } else {
    console.log("Login disabled for contact:", contact.email);
    // optional: handle disabling user
  }
};

  const handleDialogClose = () => {
    setOpen(false);
  };

  const clientCreatedmail = (email, personalMessage, userid) => {
    const port = window.location.port;
    const urlportlogin = `${CLIENT_PORT}/client/client/updatepassword`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const url = urlportlogin;
    const raw = JSON.stringify({
      email: email,
      personalMessage: personalMessage,
      url: url,
      AccountId: userid,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const urlusersavedmail = `${LOGIN_API}/clientmail/clientsavedemail/`;
    console.log(urlusersavedmail);
    fetch(urlusersavedmail, requestOptions)
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
        // createNewSidebarData()
      })
      .catch((error) => console.error(error));
  };

  const linkContactsToAccount = (selectedContacts) => {
    const existingContactIds = contactData.map((contact) => contact._id);
    const combinedContacts = [
      ...new Set([...existingContactIds, ...selectedContacts]),
    ]; // Deduplicate contacts
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts: combinedContacts }),
    };
    console.log(requestOptions.body);
    fetch(
      `${ACCOUNT_API}/accounts/accountdetails/${accountDatabyid._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        handleDialogClose();
        fetchAccountDataById(accountDatabyid._id);
        toast.success("Contact added successfully");

        
      })

      .catch((error) => console.error(error));
  };

  // Debounced function to check template name existence
  const checkTemplateName = async (name) => {
    try {
      const res = await axios.get(`${ACCOUNT_API}/accounts/check-name`, {
        params: { name },
      });
      if (res.data.exists) {
        setAccountNameError("Account name taken");
      } else {
        setAccountNameError("");
      }
    } catch (err) {
      console.error(err);
      setAccountNameError("");
    }
  };
// Create new users for the selected contacts

        // Fetch details for each selected contact
        // const fetchPromises = selectedContacts.map((contactId) =>
        //   fetch(`${CONTACT_API}/contacts/${contactId}`)
        //     .then((response) => response.json())
        //     .then((data) => {
        //       // Access the contact data from the response
        //       const contact = data.contact;
        //       const { email, firstName, middleName, lastName } = contact;
        //       console.log("Creating user for contact:", contact);
        //       newUser(
        //         accountDatabyid._id,
        //         email,
        //         firstName,
        //         middleName,
        //         lastName
        //       );
        //       console.log(
        //         "newuserdata",
        //         accountDatabyid._id,
        //         email,
        //         firstName,
        //         middleName,
        //         lastName
        //       );
        //     })
        //     .catch((error) => {
        //       console.error(`Failed to fetch contact ${contactId}:`, error);
        //     })
        // );

        // return Promise.all(fetchPromises);
        // ✅ Fetch details for each contact in combinedContacts
      // const fetchPromises = combinedContacts.map((contactId) =>
      //   fetch(`${CONTACT_API}/contacts/${contactId}`)
      //     .then((response) => response.json())
      //     .then((data) => {
      //       const contact = data.contact;
      //       console.log("Fetched contact:", contact);

      //       // ✅ Only create user if login === true
      //       if (contact.login) {
      //         const contactName = `${contact.firstName || ""} ${contact.middleName || ""} ${contact.lastName || ""}`.trim();

      //         newUser(
      //           accountDatabyid._id,
      //           contact.email,
      //           contact.firstName,
      //           contact.middleName,
      //           contact.lastName,
      //           contactName,
      //           contact.login,
      //           contact.notify,
      //           contact.emailSync
      //         );

      //         console.log("New user created for contact:", {
      //           accountId: accountDatabyid._id,
      //           email: contact.email,
      //           username: contactName,
      //           login: contact.login,
      //           notify: contact.notify,
      //           emailSync: contact.emailSync,
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       console.error(`Failed to fetch contact ${contactId}:`, error);
      //     })
      // );

      // return Promise.all(fetchPromises);
  const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else setAccountNameError("");
  }, 500);

  useEffect(() => {
    debouncedCheck(accountName);
    return debouncedCheck.cancel;
  }, [accountName]);
  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

  const isContactStep = activeStep === "Contact Info";
  const stepTitle = isContactStep ? "Contact Info" : "Account Info";
  const stepDescription = isContactStep
    ? "Add or link contacts for this account."
    : "Fill in the account details below.";

  return (
    <div className="flex flex-col h-full">
      {/* Step header using Sheet primitives */}
      <SheetHeader className="px-0 pb-4 border-b border-border/40 space-y-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => !isContactStep ? null : handleOptionChange(null, "Account Info")}
            className={[
              "flex items-center gap-1.5",
              isContactStep
                ? "text-primary cursor-pointer hover:text-primary/80 transition-colors"
                : "cursor-default",
            ].join(" ")}>
            <span className={[
              "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
              isContactStep ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground ring-2 ring-primary/20",
            ].join(" ")}>
              {isContactStep ? <CheckCircle2 className="h-3 w-3" /> : "1"}
            </span>
            <span className={"text-sm font-medium" + (isContactStep ? " text-primary" : " text-foreground font-semibold")}>Account Info</span>
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="flex items-center gap-1.5">
            <span className={[
              "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
              isContactStep ? "bg-primary text-primary-foreground ring-2 ring-primary/20" : "border border-border text-muted-foreground",
            ].join(" ")}>2</span>
            <span className={"text-sm font-medium" + (isContactStep ? " text-foreground font-semibold" : " text-muted-foreground")}>
              Contact Info
            </span>
          </span>
        </div>
        <SheetTitle className="text-base font-semibold">{stepTitle}</SheetTitle>
        <SheetDescription className="text-xs text-muted-foreground">{stepDescription}</SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto pt-4">

        {selectedOption === "Account Info" && (
          <div className="space-y-5 pb-4">
            {/* Client Type */}
            <div className="space-y-2">
              <SheetHeader className="px-0 py-0 space-y-0.5">
                <SheetTitle className="text-sm font-semibold">Client Type</SheetTitle>
                <SheetDescription className="text-xs">Select whether this is an individual or company account.</SheetDescription>
              </SheetHeader>
              <div className="flex items-center gap-5">
                {["Individual", "Company"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="accountType" value={type}
                      checked={accountType === type} onChange={handleAccountTypeChange}
                      className="h-4 w-4 accent-primary" />
                    <span className="text-sm text-foreground">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Account Info fields — shared for Individual & Company */}
            <div className="space-y-3">
              <SheetHeader className="px-0 py-0 space-y-0.5">
                <SheetTitle className="text-sm font-semibold">Account Info</SheetTitle>
                <SheetDescription className="text-xs">Enter the primary account details.</SheetDescription>
              </SheetHeader>
              <div className="space-y-1.5">
                <Label>Account Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Account Name"
                  value={accountName}
                  className={accountNameError ? "border-destructive" : ""}
                  onChange={(e) => { setaccountName(e.target.value); if (e.target.value.trim()) setAccountNameError(""); }}
                />
                {accountNameError && <p className="text-xs text-destructive">{accountNameError}</p>}
              </div>
              {accountType === "Company" && (
                <div className="space-y-1.5">
                  <Label>Company Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Company Name"
                    value={companyname}
                    className={companyNameError ? "border-destructive" : ""}
                    onChange={(e) => { setcompanyname(e.target.value); if (e.target.value.trim()) setCompanyNameError(""); }}
                  />
                  {companyNameError && <p className="text-xs text-destructive">{companyNameError}</p>}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label>Tags</Label>
              <TagsMultiSelectDropDown value={selectedTags} onChange={handleTagChange} placeholder="Tags" />
            </div>

            {/* Team Member */}
            <div className="space-y-1.5">
              <Label>Team Member</Label>
              <MultiSelectDropdown value={selectedUser} onChange={handleUserChange} placeholder="Assignees" />
            </div>

            {/* Folder Template */}
            <div className="space-y-1.5">
              <Label>Folder Template <span className="text-destructive">*</span></Label>
              <select
                value={selectedTemplate?.value || ""}
                onChange={(e) => handleSelectTemplate(optionfolder.find(f => f.value === e.target.value) || null)}
                className={`${selectCls} ${foldertemplateError ? "border-destructive" : ""}`}
              >
                <option value="">Select folder template</option>
                {optionfolder.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              {foldertemplateError && <p className="text-xs text-destructive">{foldertemplateError}</p>}
            </div>

            {/* Address (Company only) */}
            {accountType === "Company" && (
              <div className="space-y-3">
                <SheetHeader className="px-0 py-0 space-y-0.5">
                  <SheetTitle className="text-sm font-semibold">Address</SheetTitle>
                  <SheetDescription className="text-xs">Company billing or mailing address.</SheetDescription>
                </SheetHeader>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <select
                    value={selectedCountry?.code || ""}
                    onChange={(e) => setSelectedCountry(countries.find(c => c.code === e.target.value) || null)}
                    className={selectCls}
                  >
                    <option value="">Select Country</option>
                    {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Street Address</Label>
                  <Input placeholder="Street address" value={cStreetAddress} onChange={(e) => SetCStreetAddress(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input placeholder="City" value={cCity} onChange={(e) => setCcity(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>State/Province</Label>
                    <Input placeholder="State/Province" value={cStateProvince} onChange={(e) => SetCStateProvince(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>ZIP/Postal Code</Label>
                    <Input placeholder="ZIP/Postal Code" value={cZipPostalCode} onChange={(e) => SetCZipPostalCode(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {selectedOption === "Contact Info" && (
          <div className="space-y-5 pb-4">
            {/* Header + link existing */}
            <div className="flex items-center justify-between">
              <SheetTitle className="text-sm font-semibold">Contacts</SheetTitle>
              <button type="button" onClick={handleClickOpen}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                <UserPlus className="h-3.5 w-3.5" />
                Link existing contact
              </button>
            </div>

            {/* Linked contacts list */}
            {contactData.length > 0 ? (
              <div className="space-y-2">
                {contactData.map((contact) => (
                  <div key={contact._id} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => handleExpandClick(contact._id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        {expandedContact === contact._id
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        {contact.firstName} {contact.middleName} {contact.lastName}
                      </button>
                      <div className="relative">
                        <button type="button"
                          onClick={(e) => handleMenuClick(e, contact._id, contactName)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {menuOpen && anchorEl && (
                          <div className="absolute right-0 top-8 z-50 min-w-[140px] rounded-md border border-border bg-popover shadow-md py-1">
                            <button type="button" onClick={handleEditDescription}
                              className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted transition-colors">Edit Contact</button>
                            <button type="button" onClick={handleUnlink}
                              className="w-full px-3 py-1.5 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors">Unlink</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 pl-5 space-y-1">
                      {contact.companyName && <p className="text-xs text-muted-foreground">{contact.companyName}</p>}
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                      <div className="flex items-center gap-4 pt-1">
                        {[{field: "login", label: "Login", onChange: (checked) => handleLoginToggle(checked, contact)},
                          {field: "notify", label: "Notify", disabled: true},
                          {field: "emailSync", label: "Email Sync"}].map(({field, label, onChange, disabled}) => (
                          <label key={field} className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={!!contact[field]}
                              disabled={disabled}
                              onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
                              className="h-3.5 w-3.5 rounded accent-primary" />
                            <span className="text-xs text-foreground">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {expandedContact === contact._id && (
                      <div className="mt-3 pl-5 space-y-2 border-t border-border/40 pt-3">
                        {contact.note && (
                          <div><p className="text-xs font-medium text-muted-foreground">Note</p><p className="text-xs text-foreground">{contact.note}</p></div>
                        )}
                        {contact.ssn && (
                          <div><p className="text-xs font-medium text-muted-foreground">SSN</p><p className="text-xs text-foreground">{contact.ssn}</p></div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Address</p>
                          <p className="text-xs text-foreground">{contact.country?.name}</p>
                          <p className="text-xs text-foreground">{contact.streetAddress || "N/A"}</p>
                          <p className="text-xs text-foreground">{[contact.city, contact.state, contact.postalCode].filter(Boolean).join(", ") || "N/A"}</p>
                        </div>
                        {contact.tags?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Tags</p>
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.map((tag, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                                  style={{ backgroundColor: tag.tagColour || "#6b7280" }}>{accountData?.accountName}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border py-8 text-center">
                <p className="text-sm font-medium text-foreground">No linked contacts</p>
                <p className="text-xs text-muted-foreground mt-1">Link an existing contact or add a new one below.</p>
              </div>
            )}

            {/* New contact forms */}
            {contacts.map((contact, index) => (
              <div key={index} className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-sm font-semibold">Contact {index + 1}</SheetTitle>
                  <button type="button" onClick={() => handleDeleteContact(index)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>First Name <span className="text-destructive">*</span></Label>
                    <Input name="firstName" placeholder="First Name"
                      className={firstNameError ? "border-destructive" : ""}
                      onChange={(e) => handleContactInputChange(index, e)} />
                    {firstNameError && <p className="text-xs text-destructive">{firstNameError}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>Middle Name</Label>
                    <Input name="middleName" placeholder="Middle Name"
                      onChange={(e) => handleContactInputChange(index, e)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Last Name <span className="text-destructive">*</span></Label>
                    <Input name="lastName" placeholder="Last Name"
                      className={lastNameError ? "border-destructive" : ""}
                      onChange={(e) => handleContactInputChange(index, e)} />
                    {lastNameError && <p className="text-xs text-destructive">{lastNameError}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Contact Name</Label>
                  <Input name="contactName" placeholder="Contact Name"
                    value={contact.contactName} onChange={(e) => handleContactInputChange(index, e)} />
                </div>
                <div className="space-y-1">
                  <Label>Company Name</Label>
                  <Input name="companyName" placeholder="Company Name"
                    onChange={(e) => handleContactInputChange(index, e)} />
                </div>
                <div className="space-y-1">
                  <Label>Note</Label>
                  <textarea name="note" placeholder="Note" rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    onChange={(e) => handleContactInputChange(index, e)} />
                </div>
                <div className="space-y-1">
                  <Label>SSN</Label>
                  <Input name="ssn" placeholder="SSN"
                    onChange={(e) => handleContactInputChange(index, e)} />
                </div>
                <div className="space-y-1">
                  <Label>Email <span className="text-destructive">*</span></Label>
                  <Input name="email" placeholder="Email" type="email"
                    className={emailError ? "border-destructive" : ""}
                    onChange={(e) => handleContactInputChange(index, e)} />
                  {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-5">
                  {[{field:"login",label:"Login"},{field:"notify",label:"Notify"},{field:"emailSync",label:"Email Sync"}].map(({field,label}) => (
                    <label key={field} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={contact[field] === "true"}
                        onChange={(e) => handleContactSwitchChange(index, field, e.target.checked)}
                        className="h-3.5 w-3.5 rounded accent-primary" />
                      <span className="text-xs text-foreground">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <Label>Tags</Label>
                  <TagsMultiSelectDropDown
                    value={tagsOptions.filter(o => (contact.tags || []).includes(o.value))}
                    onChange={(newVal) => handleContactTagChange(index, null, newVal)}
                    placeholder="Select tags"
                  />
                </div>

                {/* Phone Numbers */}
                <div className="space-y-2">
                  <SheetHeader className="px-0 py-0 space-y-0">
                    <SheetTitle className="text-xs font-semibold">Phone Numbers</SheetTitle>
                  </SheetHeader>
                  {contact.phoneNumbers.map((phone, phoneIndex) => (
                    <div key={phone.id} className="flex items-center gap-2">
                      {phone.isPrimary && (
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">Primary</span>
                      )}
                      <div className="flex-1">
                        <PhoneInput country={phone.country || "us"} value={phone.phone}
                          onChange={(value, country) => handleContactPhoneNumberChange(index, phoneIndex, value, country)}
                          inputStyle={{ width: "100%", height: "36px", fontSize: "14px" }}
                          buttonStyle={{ borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }} />
                      </div>
                      <button type="button" onClick={() => handleDeletePhoneNumber(index, phoneIndex)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleContactAddPhoneNumber(index)}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                    Add phone number
                  </button>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <SheetHeader className="px-0 py-0 space-y-0">
                    <SheetTitle className="text-xs font-semibold">Address</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-1">
                    <Label>Country</Label>
                    <select
                      value={contact.country?.code || ""}
                      onChange={(e) => {
                        const found = countries.find(c => c.code === e.target.value) || null;
                        setContacts(prev => { const u = [...prev]; u[index] = {...u[index], country: found}; return u; });
                      }}
                      className={selectCls}>
                      <option value="">Select Country</option>
                      {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Street Address</Label>
                    <Input name="streetAddress" placeholder="Street address"
                      onChange={(e) => handleContactAddressChange(index, "streetAddress", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>City</Label>
                      <Input placeholder="City"
                        onChange={(e) => handleContactAddressChange(index, "city", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>State/Province</Label>
                      <Input placeholder="State/Province"
                        onChange={(e) => handleContactAddressChange(index, "state", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label>ZIP/Postal Code</Label>
                      <Input placeholder="ZIP/Postal Code"
                        onChange={(e) => handleContactAddressChange(index, "postalCode", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new contact */}
            <button type="button" onClick={addNewContact}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <Plus className="h-4 w-4" />
              Add New Contact
            </button>


            {/* Confirm deletion modal */}
            {comfirmationOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-80 rounded-xl border border-border bg-background p-6 shadow-xl">
                  <SheetTitle className="text-base font-semibold mb-2">Confirm Deletion</SheetTitle>
                  <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this data?</p>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteData}>Delete</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Portal access modal */}
            {isModalVisible && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-96 rounded-xl border border-border bg-background p-6 shadow-xl">
                  <SheetTitle className="text-base font-semibold mb-2">Add portal access</SheetTitle>
                  <p className="text-sm text-muted-foreground mb-1">You are adding portal access for the following users:</p>
                  <p className="text-sm text-foreground mb-4">{contacts.email}</p>
                  <div className="space-y-1.5 mb-4">
                    <Label>Personal message</Label>
                    <textarea rows={3} value={personalMessage} onChange={handleMessageChange}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCloseModal}>Skip</Button>
                    <Button size="sm" onClick={handlesubmitContact}>Send</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Link contact dialog */}
            {open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-[480px] rounded-xl border border-border bg-background p-6 shadow-xl">
                  <SheetTitle className="text-base font-semibold mb-1">Search for a Contact</SheetTitle>
                  <p className="text-xs text-muted-foreground mb-4">Search by name, phone, or email. If the contact doesn't exist, cancel and create one first.</p>
                  <div className="space-y-1.5 mb-4">
                    <Label>Search</Label>
                    <Input
                      placeholder="Search contacts..."
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {filteredContacts.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-md border border-border mb-4">
                      {filteredContacts.map((c) => (
                        <label key={c.id} className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer">
                          <input type="checkbox"
                            checked={selectedContacts.includes(c.id)}
                            onChange={(e) => setSelectedContacts(prev =>
                              e.target.checked ? [...prev, c.id] : prev.filter(id => id !== c.id)
                            )}
                            className="h-3.5 w-3.5 rounded accent-primary" />
                          <span className="text-sm text-foreground">{c.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{c.email}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleDialogClose}>Cancel</Button>
                    <Button size="sm" onClick={handleLinkAccounts}>Add</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky footer — actions change per step */}
      <SheetFooter className="border-t border-border/40 pt-3 pb-1">
        <div className="flex items-center justify-between w-full">
          {selectedOption === "Account Info" ? (
            <>
              <span />
              <Button size="sm" onClick={() => handleOptionChange(null, "Contact Info")} className="gap-1.5">
                Continue <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleOptionChange(null, "Account Info")}>
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleOpen}>Cancel</Button>
                <Button size="sm" onClick={handleopendialog}>Create</Button>
              </div>
            </>
          )}
        </div>
      </SheetFooter>
    </div>
  );
};

export default AccountForm;
