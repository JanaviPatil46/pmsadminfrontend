import {
  Box,
  ListItem,
  Chip,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  RadioGroup,
  Radio,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiArchiveOut } from "react-icons/bi";
import { LuUserCircle2 } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  Drawer,
  useMediaQuery,
  Menu,
  MenuItem,
  TextField,
  Select,
  Checkbox,
  ListItemText,FormGroup
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContactUpdateForm from "./contactupdate";
import axios from "axios";
import { useTheme } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Accountupdate from "./accountupdate";
import ChevronDownIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import AccountDrawer from "../../components/AccountContactForm/Drawer";
const Info = () => {
  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const { data } = useParams();
  const [accountData, setaccountData] = useState();
  const [accName, setAccName] = useState();
  const [usertype, setUserType] = useState();
  const [tags, setTags] = useState([]);
  const [teams, setTeams] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [accountDatabyid, setAccountDatabyid] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contact, setContact] = useState(null);
  const [personalMessage, setPersonalMessage] = useState("");
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState(null);


  const [selectedUser, setSelectedUser] = useState(null);

  const handleSimpleSwitchChange = async (field, user) => {
    try {
      // If the switch is "login", we show dialogs instead of direct toggle
      if (field === "login") {
        if (user.login) {
          // Currently true → turning OFF login (remove access)
          setSelectedUser(user); // store user for dialog reference
          setOpenRemoveDialog(true);
        } else {
          // Currently false → turning ON login (add access)
          setSelectedUser(user);
          setOpenDialog(true);
        }
      } else {
        // For other fields (notify, emailSync) → direct update
        const updatedUser = { ...user, [field]: !user[field] };

        const response = await fetch(
          `${LOGIN_API}/common/user/${user._id}`, // ✅ your API endpoint
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [field]: updatedUser[field] }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        }
// fetchAccount()
        // Update local state so switch reflects change instantly
        setUserDetails((prev) =>
          prev.map((u) => (u._id === user._id ? updatedUser : u))
        );
        fetchAccount()
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

 

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog
  };
  const handleMessageChange = (event) => {
    setPersonalMessage(event.target.value); // Update personal message input
  };
  
  const handleSave = () => {
    if (!selectedUser) return;

    console.log("Saving portal access for:", selectedUser);

    const { contactId, email, firstName, middleName, lastName } = selectedUser;

    // Call your newUser function
    newUser(data, contactId, email, firstName, middleName, lastName);

    // Close dialog
    setOpenDialog(false);
    setPersonalMessage("");
    setSelectedUser(null);
    fetchAccount()
  
  };

  

  const handleConfirmRemoveAccess = async () => {
    if (!contact) return;

    try {
      await axios.patch(`${CONTACT_API}/contacts/${contact._id}`, {
        login: false,
      });

      // 2. Get user by email
      const userRes = await axios.get(
        `${LOGIN_API}/common/user/email/getuserbyemail/${contact.email}`
      );
      const user = userRes.data?.user?.[0];

      if (user && user._id) {
        // 3. Update user: set active to false
        await axios.patch(`${LOGIN_API}/common/user/${user._id}`, {
          active: false,
        });
      } else {
        console.warn("User not found for email:", contact.email);
      }

      // Optionally refresh the list or contact data
      fetchAccount();
      fetchContacts();
    } catch (err) {
      console.error("Failed to remove access", err);
    }

    setOpenRemoveDialog(false);
    setSelectedContact(null);
  };

  const updateContacts = (_id, userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      login: false,
      userid: userid,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${CONTACT_API}/contacts/${_id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchAccount();
      })
      .catch((error) => console.error(error));
  };
  const handleMenuOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    // fetchAccountData();
    fetchContacts();
    fetchAccount();
  }, []);

  const fetchAccount = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/`;
    fetch(url + data, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("accountlist", result);
        setaccountData(result.accountlist);
        setAccName(result.accountlist.Name);
        setUserType(result.accountlist.Type);
        setTags(result.accountlist.Tags.flat());
        setTeams(result.accountlist.Team);

        // setDescription()
        if (result && result.accountlist) {
          setContacts(result.accountlist.Contacts);
          setDescription(result.accountlist.Contacts.description);
          setUserDetails(result.accountlist.Users);
        }
        fetchaccountdatabyid(result.accountlist.id);
      })
      .catch((error) => console.error(error));
  };

  console.log(contacts);
  console.log(accountDatabyid);

  const fetchaccountdatabyid = (accountid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${ACCOUNT_API}/accounts/accountdetails/getAccountbyIdAll/${accountid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setAccountDatabyid(result.account);
      })
      .catch((error) => console.error(error));
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleClick = async (_id) => {
    try {
      const url = `${CONTACT_API}/contacts/${_id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setSelectedContact(data.contact);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [contactData, setContactData] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);

  const handleContactUpdated = () => {
    fetchContacts(); // Refetch contacts when updated
  };
  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${CONTACT_API}/contacts/contactlist/list/`
      );
      setContactData(response.data.contactlist);
      console.log(response.data.contactlist);
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  console.log(contactData);

  const contactOptions = contactData.map((contact) => ({
    value: contact._id,
    label: contact.name,
  }));

  const [anchorEl, setAnchorEl] = useState(null);
  const [contactName, setContactName] = useState(null);

  const [contactdescription, setContactDescription] = useState(null);
  // Derived state for menu open/close
  const menuOpen = Boolean(anchorEl);

  

  const handleMenuClick = (
    event,
    contactId,
    contactName,
    contactEmail,
    user
  ) => {
    console.log("Selected contact:", { contactId, contactName, contactEmail });
    console.log("Selected user:", { userId: user?._id, email: user?.email });

    setAnchorEl(event.currentTarget);
    setSelectedContact(contactId);
    setContactName(contactName);
    setContactEmail(contactEmail);
    setSelectedUser(user); // Save selected user for Unlink or Reset Password
  };
  console.log("seraccountcontact", selectedContact);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null); // Reset selected contact when menu closes
  };


  const [contactId, setContactId] = useState();
  const handleEditDescription = () => {
    const contact = contacts.find((c) => c._id === selectedContact);
    console.log("selecteconatct", contact);
    if (!contact) return;
    setContactId(contact._id);
    setContactName(contact.contactName);
    setDescription(contact.description || "");
    setDescriptionModalOpen(true);
    handleMenuClose();
  };

  
  const handleDescriptionSave = async () => {
    console.log("Save clicked", contactId);
    if (!contactId) return;

    // Log selected contact ID
    console.log("selectedContact ID:", contactId);

    // Build URL and body
    const url = `${ACCOUNT_API}/contacts/${contactId}`;
    const bodyData = { description: description };

    // Log URL and data
    console.log("PATCH URL:", url);
    console.log("PATCH body:", bodyData);

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) throw new Error("Failed to update description");

      // Optional: log response data
      const responseData = await response.json();
      console.log("PATCH response:", responseData);

      // Update local state
      setContacts((prev) =>
        prev.map((c) => (c._id === contactId ? { ...c, description } : c))
      );

      setDescriptionModalOpen(false);
      setSelectedContact(null);
      setDescription("");
    } catch (error) {
      console.error("Error updating contact description:", error);
    }
  };

  const updateDescriptiontoAccount = (description) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      description: description,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/${data}`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const updateDescriptiontoContact = (selectedContact, description) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      description: description,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${CONTACT_API}/contacts/${selectedContact}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Contact decription Updated successfully!");
        fetchAccount();
        handleMenuClose();
      })
      .catch((error) => console.error(error));
  };

  const handleDescriptionCancel = () => {
    setDescriptionModalOpen(false);
    handleMenuClose();
    setDescription(""); // Clear the description if cancelled
  };

  const removeUserFromContactAndAccount = (contactId, userId) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch(
      `${ACCOUNT_API}/accounts/accountdetails/removecontactfromaccount/${data}/${contactId}/${userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("unlinked contact", result);

        // deleteUserByContactId(contactId);
        handleContactUpdated();
        toast.success("contact is unlinked");
        fetchAccount();
      })
      .catch((error) => console.error(error));
  };
 
  const handleUnlink = () => {
    if (!selectedContact || !selectedUser) return;
    console.log(
      "selectedContact, selectedUser._id",
      selectedContact,
      selectedUser._id
    );
    removeUserFromContactAndAccount(selectedContact, selectedUser._id);

    handleMenuClose();
  };

  //edit right side form
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  //********************Add Contacts */
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isDrawerOpenForAddContact, setIsDrawerOpenForAddContact] =
    useState(false);
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  // Effect to filter contacts based on search term
  const getSelectedIds = () => {
    return selectedContacts.join(", "); // Just join the IDs array into a string
  };
  // Handler for the reset password menu item
  const handleResetPassword = () => {
    setResetPasswordDialogOpen(true);
    handleMenuClose();
  };
  const SEVER_PORT = process.env.REACT_APP_CLIENT_SERVER_URI;
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  // Handler for confirming password reset
  const confirmResetPassword = async (e) => {
    if (e) e.preventDefault();

    // Validation
    if (!contactEmail) {
      setEmailError(true);
      setEmailErrorMessage("Email is required");
      return;
    } else if (!contactEmail.includes("@")) {
      setEmailError(true);
      setEmailErrorMessage("Email must include @");
      return;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    try {
      const clientResetURL = `${SEVER_PORT}/client/client/resetpassword`;
      const apiURL = `${LOGIN_API}/resetpass/forgotpassword/`;

      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contactEmail, // Fixed syntax here
          url: clientResetURL,
        }),
      });

      const res = await response.json();

      if (response.status === 200) {
        localStorage.setItem("resetpasstoken", res.result.token);
        Cookies.set("resetpasstoken", res.result.token);
        toast.success("Check your email for the reset link.");
        setResetPasswordDialogOpen(false); // Close the dialog on success
      } else if (response.status === 400) {
        toast.error("Invalid user!");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Network error. Please try again.");
    }
  };
  // useEffect(() => {
  //   setFilteredContacts(
  //     contactData.filter((contact) =>
  //       contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  //   );
  // }, [searchQuery, contactData]);
useEffect(() => {
  setFilteredContacts(
    contactData.filter((contact) => {
      const fullName = `${contact.firstName || ""} ${contact.middleName || ""} ${contact.lastName || ""}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    })
  );
}, [searchQuery, contactData]);

  const handleAddContactDrawer = () => {
    setIsDrawerOpenForAddContact(true);
  };

  const handleCloseDrawerofAddContact = () => {
    setIsDrawerOpenForAddContact(false);
  };
  const [newUserId, setNewUserId] = useState("");
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const CLIENT_PORT = process.env.REACT_APP_CLIENT_SERVER_URI;
  const clientalldata = (userId, email, firstName, middleName, lastName) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // const password = `${firstName}@123`;
    const raw = JSON.stringify({
      email: email,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      userid: userId,

      // phoneNumber: phoneNumber,
      accountName: accName,
      password: "defaultPass123",
      cpassword: "defaultPass123",
    });

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
      .then((response) => {response.json()
        fetchAccount()
      
      })

      .catch((error) => console.error(error));
  };
  const newUser = (
    data,
    selectedContact,
    email,
    firstName,
    middleName,
    lastName
  ) => {
    console.log("acc", data, email, firstName, middleName, lastName);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: accName, // Use the first name as username
      email, // Use the provided email
      password: "defaultPass123", // Replace with a dynamic password logic if needed
      role: "Client",
      contactId: selectedContact,
      login: true,
      notify: false,
      emailSync: false,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/common/login/signup`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result._id);
        setNewUserId(result._id);

        updateAcountUserId(result._id, data);
        clientalldata(result._id, email, firstName, middleName, lastName);
        clientCreatedmail(email, "", result._id);
      })
      .catch((error) => console.error(error));
  };

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

  
  // const handleLinkAccounts = () => {
  //   updateContactstoAccount(selectedContacts);
   
  // };
  // console.log(selectedContacts);

  // const updateContactstoAccount = (selectedContacts) => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   const existingContactIds = accountDatabyid.contacts.map(
  //     (contact) => contact._id
  //   );
  //   // Combine existing contact IDs with the new ones
  //   const combinedContacts = [...existingContactIds, ...selectedContacts];
  //   console.log(combinedContacts);
  //   const raw = JSON.stringify({
  //     contacts: combinedContacts,
  //   });
  //   console.log(raw);
  //   const requestOptions = {
  //     method: "PATCH",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };
  //   fetch(
  //     `${ACCOUNT_API}/accounts/accountdetails/${accountDatabyid._id}`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       handleCloseDrawerofAddContact();
  //       toast.success("contact added successfully");
  //       fetchAccount();
  //       setSelectedContacts([])
  //     })
  //     .catch((error) => console.error(error));
  // };
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
const [contactDetails, setContactDetails] = useState([]);

const handleLinkAccounts = () => {
  // First, get detailed information about selected contacts
  const selectedContactDetails = filteredContacts.filter(contact => 
    selectedContacts.includes(contact.id)
  );
  
  // Map to the format needed for the confirmation dialog
  const contactData = selectedContactDetails.map(contact => ({
    id: contact.id,
    contactName: contact.name,
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    middleName: contact.middleName || '',
    email: contact.email || '',
    companyName: contact.companyName || '',
    
    login:  false, // Default to true if existing user
    notify: false, // Default values
    emailSync: false
  }));
  
  setContactDetails(contactData);
  console.log("contactData",contactData)
  setIsConfirmDialogOpen(true);
};

const handleConfirmLink = () => {
  // First, create users for contacts where login is true
  contactDetails.forEach(contact => {
    if (contact.login ) {
      newUser({
        // Your user data structure
        data,
  contactId:contact.id,
        email: contact.email,
        firstName: contact.firstName,
        middleName: contact.middleName,
        lastName: contact.lastName,
        // ... other user fields
      });
    }
  });
  
  // Then update the contacts to account
  updateContactstoAccount(selectedContacts);
  setIsConfirmDialogOpen(false);
};

const handleUpdateField = (index, field, value) => {
  setContactDetails(prev => {
    const updated = [...prev];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    return updated;
  });
};

const updateContactstoAccount = (selectedContacts) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const existingContactIds = accountDatabyid.contacts.map(
    (contact) => contact._id
  );
  
  const combinedContacts = [...existingContactIds, ...selectedContacts];
  
  const raw = JSON.stringify({
    contacts: combinedContacts,
  });
  
  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  
  fetch(
    `${ACCOUNT_API}/accounts/accountdetails/${accountDatabyid._id}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      handleCloseDrawerofAddContact();
      toast.success("contact added successfully");
      fetchAccount();
      setSelectedContacts([]);
    })
    .catch((error) => console.error(error));
};
  const navigate = useNavigate();
  const handleArchive = (accId) => {
    if (!accId) return;

    const confirmArchive = window.confirm(
      "Are you sure you want to archive this account?"
    );
    if (!confirmArchive) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      active: false, // archiving → set active to false
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${ACCOUNT_API}/accounts/accountdetails/${accId}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Account archived successfully");
        navigate("/clients/accounts/archivedaccounts");
        fetchAccount(); // Refresh account details after archive
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while archiving the account");
      });
  };
  const handleDrawerClose = () => {
    setIsNewDrawerOpen(false);
    fetchAccount()
  };

  return (
    <Box sx={{ width: "100%", padding: 2, mt: 4 }}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, mr: 5 }}>
            <CardContent>
             
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  p: 2,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: (theme) => theme.shadows[1],
                }}
              >
                <Typography variant="h5" fontWeight={600} color="text.primary">
                  Account Details
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    sx={{
                      color: "text.secondary",
                      transition: "all 0.2s",
                      "&:hover": {
                        color: "primary.main",
                        transform: "scale(1.1)",
                      },
                    }}
                    onClick={() => handleArchive(data)}
                  >
                    <BiArchiveOut size={22} />
                  </IconButton>

                  <IconButton
                    sx={{
                      color: "text.secondary",
                      transition: "all 0.2s",
                      "&:hover": {
                        color: "primary.main",
                        transform: "scale(1.1)",
                      },
                    }}
                    // onClick={() => setIsNewDrawerOpen(true)}
                    onClick={() => {
                      setIsNewDrawerOpen(true);
                      // Pass the account ID to the drawer for editing
                      setEditingAccountId(data); // You'll need state for this
                    }}
                    disabled={storedData?.teammember?.manageAccounts === false}
                  >
                    <MdEdit size={22} />
                  </IconButton>
                </Box>

                <Drawer
                  anchor="right"
                  open={isNewDrawerOpen}
                  onClose={() => setIsNewDrawerOpen(false)}
                  PaperProps={{
                    sx: {
                      borderRadius: isSmallScreen ? 0 : "10px 0 0 10px",
                      width: isSmallScreen ? "100%" : 650,
                    },
                  }}
                >
                 
                  {isNewDrawerOpen && (
                    <AccountDrawer
                      handleNewDrawerClose={handleDrawerClose}
                      // handleDrawerClose={handleDrawerClose}
                      editingAccountId={data}
                    />
                  )}
                </Drawer>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Profile section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 4,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LuUserCircle2
                    style={{
                      width: "60px",
                      height: "60px",
                      color: "#757575",
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        lineHeight: 1.2,
                      }}
                    >
                      {accName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "15px",
                        color: "text.secondary",
                      }}
                    >
                      {usertype}
                    </Typography>
                  </Box>
                </Box>
               
              </Box>

              {/* Account Info section */}
              <Box mt={3}>
                <Typography fontWeight="bold" sx={{ mb: 2 }}>
                  Account Info
                </Typography>

                {/* Tags section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "20px",
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      minWidth: "120px",
                      color: "text.secondary",
                    }}
                  >
                    Tags
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <Typography
                          key={tag._id}
                          sx={{
                            backgroundColor: tag.tagColour,
                            color: "white",
                            borderRadius: "60px",
                            padding: "0.2rem 0.8rem",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            fontSize: "12px",
                          }}
                        >
                          {tag.tagName}
                        </Typography>
                      ))
                    ) : (
                      <Typography sx={{ color: "text.secondary" }}>
                        No tags
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Team Members section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "20px",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      minWidth: "120px",
                      color: "text.secondary",
                    }}
                  >
                    Team Members
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {teams && teams.length > 0 ? (
                      teams.map((team, index) => (
                        <Typography
                          key={index}
                          sx={{
                            backgroundColor: "#e0e0e0",
                            color: "black",
                            borderRadius: "60px",
                            padding: "0.2rem 0.8rem",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "12px",
                          }}
                        >
                          {team.username || "Sample User"}
                        </Typography>
                      ))
                    ) : (
                      <Typography sx={{ color: "text.secondary" }}>
                        No team members
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Contacts
                </Typography>

                {/* Button aligned to the right side */}
                <Button
                  color="primary"
                  sx={{ ml: "auto" }}
                  onClick={handleAddContactDrawer} // Handle add contact logic
                >
                  Add Contact
                </Button>
              </Box>

              <Drawer
                anchor="right"
                open={isDrawerOpenForAddContact}
                onClose={handleCloseDrawerofAddContact}
                PaperProps={{
                  sx: { width: 700 },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Link Contacts
                  </Typography>
                  <IconButton
                    onClick={handleCloseDrawerofAddContact}
                    sx={{ color: "#1876d3" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Content Section */}
                <Box
                  sx={{
                    p: 2,
                    flex: "1 1 auto",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Autocomplete
                    multiple // Enable multiple selections
                    options={filteredContacts}
                    getOptionLabel={(option) => option.name} // Specify how to display the option
                    // onInputChange={(event, newValue) => {
                    //   setSearchQuery(newValue);
                    // }}
                    onChange={(event, newValue) => {
                      // Update selected contacts with only IDs
                      const ids = newValue.map((contact) => contact.id); // Extract IDs from selected contacts
                      setSelectedContacts(ids); // Update selectedContacts with IDs
                      console.log(getSelectedIds()); // Log the comma-separated IDs
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Search contacts..."
                        onFocus={(e) => e.stopPropagation()} // Prevent dropdown from closing
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    fullWidth
                    disableClearable // Prevents clearing the input by clicking the clear button
                    value={filteredContacts.filter((contact) =>
                      selectedContacts.includes(contact.id)
                    )} // Control the selected value
                  />
                </Box>

                {/* Footer */}
                <Box
                  sx={{
                    borderTop: "1px solid #e0e0e0",
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleLinkAccounts}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      width: "80px",
                      borderRadius: "15px",
                    }}
                  >
                    Link
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCloseDrawerofAddContact}
                    sx={{
                      borderColor: "var(--color-border-cancel-btn)", // Normal background
                      color: "var(--color-save-btn)",
                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                        color: "#fff",
                        border: "none",
                      },
                      width: "80px",
                      borderRadius: "15px",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Drawer>
<Dialog
    open={isConfirmDialogOpen}
    onClose={() => setIsConfirmDialogOpen(false)}
    maxWidth="md"
    fullWidth
  >
    <DialogTitle>
      <Typography variant="h6" fontWeight="bold">
        Confirm Contact Linking
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Review and configure settings for the selected contacts
      </Typography>
    </DialogTitle>
    
    <DialogContent>
      <Box sx={{ mt: 2 }}>
        {contactDetails.map((contact, index) => (
          <Card key={contact.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box flexGrow={1}>
                  <Typography variant="h6">
                    {contact.contactName }
                  </Typography>
                  <Typography color="textSecondary">
                    {contact.companyName}
                  </Typography>
                  <Typography color="textSecondary">{contact.email}</Typography>
                  {contact.existingUser && (
                    <Chip
                      label="Has User Account"
                      size="small"
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  )}

                  <FormGroup row sx={{ mt: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={contact.login || false}
                          onChange={(e) =>
                            handleUpdateField(index, "login", e.target.checked)
                          }
                          disabled={contact.existingUser}
                        />
                      }
                      label="Login"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={contact.notify || false}
                          onChange={(e) =>
                            handleUpdateField(index, "notify", e.target.checked)
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
                            handleUpdateField(index, "emailSync", e.target.checked)
                          }
                        />
                      }
                      label="Email Sync"
                    />
                  </FormGroup>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </DialogContent>
    
    <DialogActions sx={{ p: 3, gap: 2 }}>
      <Button
        variant="outlined"
        onClick={() => setIsConfirmDialogOpen(false)}
        sx={{
          borderColor: "var(--color-border-cancel-btn)",
          color: "var(--color-save-btn)",
          "&:hover": {
            backgroundColor: "var(--color-save-hover-btn)",
            color: "#fff",
            border: "none",
          },
          width: "100px",
          borderRadius: "15px",
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleConfirmLink}
        sx={{
          backgroundColor: "var(--color-save-btn)",
          "&:hover": {
            backgroundColor: "var(--color-save-hover-btn)",
          },
          width: "100px",
          borderRadius: "15px",
        }}
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
              <Box sx={{ mt: 1 }}>
                <Divider />
              </Box>

              <Box mt={2}>
               
              </Box>
              
              <Box mt={2}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Login</TableCell>
                        <TableCell>Notify</TableCell>
                        <TableCell>Email Sync</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {contacts.map((contact) => {
                        // filter users belonging to this contact
                        const contactUsers = userDetails.filter(
                          (user) => user.contactId === contact._id
                        );

                        return (
                          <React.Fragment key={contact._id}>
                            <TableRow>
                              <TableCell colSpan={4}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: "bold",
                                      fontSize: "15px",
                                      display: "inline-block",
                                      color: "#1976d2",
                                    }}
                                    onClick={() => handleClick(contact._id)}
                                  >
                                    {contact.contactName}
                                  </Typography>
                                </Box>

                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#757575",
                                    marginTop: "4px",
                                  }}
                                >
                                  {contact.description || "-"}
                                </Typography>
                              </TableCell>
                            </TableRow>

                            {contactUsers.length > 0 ? (
                              contactUsers.map((user) => (
                                <TableRow key={user._id}>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>
                                    <Switch
                                      checked={user.login}
                                      onChange={() =>
                                        handleSimpleSwitchChange("login", user)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Switch
                                      checked={user.notify}
                                      disabled={!user.login} 
                                      onChange={() =>
                                        handleSimpleSwitchChange("notify", user)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Switch
                                      checked={user.emailSync}
                                      disabled={!user.login} 
                                      onChange={() =>
                                        handleSimpleSwitchChange(
                                          "emailSync",
                                          user
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      size="small"
                                      onClick={(e) =>
                                        handleMenuClick(
                                          e,
                                          contact._id, // contactId
                                          contact.contactName, // contactName
                                          user.email, // contactEmail
                                          user // user object
                                        )
                                      }
                                    >
                                      <MoreVertIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>
                                  <Switch
                                    checked={false} // default since no user is linked
                                    onChange={() =>
                                      handleSimpleSwitchChange("login", {
                                        contactId: contact._id,
                                        email: contact.email,
                                        firstName: contact.firstName,
                                        middleName: contact.middleName,
                                        lastName: contact.lastName
                                      })
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Switch checked={false} disabled />
                                </TableCell>
                                <TableCell>
                                  <Switch checked={false} disabled />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={(e) =>
                                      handleMenuClick(
                                        e,
                                        contact._id,
                                        contact.contactName,
                                        contact.email,
                                        null // no user object
                                      )
                                    }
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen} // Use derived state here
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleEditDescription}>
                    Edit Description
                  </MenuItem>

                  <MenuItem onClick={handleUnlink} disabled={!selectedUser}>
                    Unlink
                  </MenuItem>
                  <MenuItem onClick={handleResetPassword}>
                    {" "}
                    Reset Password
                  </MenuItem>
                </Menu>

                <Dialog
                  open={resetPasswordDialogOpen}
                  onClose={() => setResetPasswordDialogOpen(false)}
                  aria-labelledby="reset-password-dialog-title"
                >
                  <DialogTitle id="reset-password-dialog-title">
                    Reset Password
                    <Button
                      onClick={() => setResetPasswordDialogOpen(false)}
                      color="secondary"
                    >
                      X
                    </Button>
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      Are you sure you want to reset the password for{" "}
                      <strong>{contactEmail}</strong>?
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      The user will receive an email with instructions to set a
                      new password.
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setResetPasswordDialogOpen(false)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmResetPassword}
                      color="primary"
                      variant="contained"
                    >
                      Reset Password
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={descriptionModalOpen}
                  onClose={handleDescriptionCancel}
                  aria-labelledby="form-dialog-title"
                  PaperProps={{
                    style: { width: "800px" }, // Adjust the width as needed
                  }}
                >
                  <DialogTitle id="form-dialog-title">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {" "}
                        {`Description for: ${contactName}`}
                      </Typography>
                      <Button
                        onClick={handleDescriptionCancel}
                        color="secondary"
                      >
                        X
                      </Button>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Typography variant="h5" fontWeight="bold">
                      Description
                    </Typography>
                    <TextField
                      autoFocus
                      margin="dense"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                      data-test="contact-notes-input"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDescriptionSave} color="primary">
                      Save
                    </Button>

                    <Button onClick={handleDescriptionCancel} color="primary">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={openDialog}
                  onClose={handleCloseDialog}
                  aria-labelledby="form-dialog-title"
                  PaperProps={{
                    style: { width: "800px" },
                  }}
                >
                  <DialogTitle>
                    <Typography variant="h6">Add portal access</Typography>
                    <Button onClick={handleCloseDialog} color="secondary">
                      X
                    </Button>
                  </DialogTitle>
                  <DialogContent>
                    <p>You are adding portal access for the following users:</p>
                    <div>{selectedUser?.email}</div>
                    <TextField
                      label="Personal message"
                      variant="outlined"
                      fullWidth
                      value={personalMessage}
                      onChange={handleMessageChange}
                      // onChange={(e) => handleContactInputChange(index, e)}
                      sx={{ mt: 2 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={handleSave}>
                      Save
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  open={openRemoveDialog}
                  onClose={() => setOpenRemoveDialog(false)}
                  aria-labelledby="remove-access-dialog-title"
                  PaperProps={{
                    style: { width: "600px" },
                  }}
                >
                  <DialogTitle
                    id="remove-access-dialog-title"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">Remove Portal Access</Typography>
                    <Button
                      onClick={() => setOpenRemoveDialog(false)}
                      color="secondary"
                    >
                      X
                    </Button>
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      You are removing portal access for{" "}
                      <strong>{selectedUser?.email}</strong> to{" "}
                      <strong>{selectedUser?.contactName}</strong>.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      If you decide to enable login for this email in the
                      future, they will be sent a new invite.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      Are you sure you want to remove portal access for{" "}
                      <strong>{selectedUser?.email}</strong>?
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setOpenRemoveDialog(false)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmRemoveAccess}
                      color="error"
                      variant="contained"
                    >
                      Remove Access
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{ width: 600 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            ml: 1,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} variant="h6">
            Edit Contact
          </Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {selectedContact && (
          <ContactUpdateForm
            selectedContact={selectedContact}
            uniqueTags={uniqueTags}
            // Pass additional props needed by ContactForm
            handleTagChange={() => {}}
            handlePhoneNumberChange={() => {}}
            handleDeletePhoneNumber={() => {}}
            handleAddPhoneNumber={() => {}}
            handleCountryChange={() => {}}
            sendingData={() => {}}
            handleClose={() => setIsDrawerOpen(false)}
            isSmallScreen={isMobile}
            onContactUpdated={handleContactUpdated}
          />
        )}
      </Drawer>
    </Box>
  );
};

export default Info;
