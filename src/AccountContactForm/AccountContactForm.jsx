import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import AccountForm from "./AccountForm";
import ContactForm from "./ContactForm";
import axios from "axios";
import { toast } from "react-toastify";
import { LoginContext } from "../Sidebar/Context/Context";

const steps = ["Account Information", "Contact Information"];

export default function AccountContactForm({
  isEditing,
  accountId,
  onCloseDrawer,
  handleNewDrawerClose,
  handleDrawerClose,
  // onClose,
  // fetchAccountsList,
}) {
   // Add these state declarations with your other useState hooks
  const [newlySelectedContacts, setNewlySelectedContacts] = useState([]);
  const [newFormContacts, setNewFormContacts] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const { accountData, contacts, selectedContacts } = useSelector(
    (state) => state.accountContact
  );
  console.log("accountdatainfo", selectedContacts);
  const { logindata } = useContext(LoginContext);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [loginUserId, setLoginUserId] = useState();
  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  const CLIENT_DOCS_API = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  const assignfoldertemp = (accountId, foldertempId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log("assignfoldertemp", accountId);
    console.log("assignfoldertemp", foldertempId);
    const raw = JSON.stringify({
      accountId: accountId,
      templateId: foldertempId || null,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);
    fetch(
      `https://www.snptaxes.com/api/docManagement/apply-template`,
      requestOptions
    )
      // fetch(`${CLIENT_DOCS_API}/clientdocs/accountfoldertemp`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  
  const [userRole, setUserRole] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("active");
  const [viewAllAccounts, setViewAllAccounts] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);
  const fetchAccountsList = async () => {
    setLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);

      const loginuserid = storedData?.teammember?.userid;
      // const userRole = storedData?.teammember?.userrole || "Admin";
      console.log("User role is:", userRole);

      let url;

      if (userRole === "Admin") {
        url = `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`;
      } else if (userRole === "TeamMember") {
        const viewAll = storedData?.teammember?.viewallAccounts || false;
        setViewAllAccounts(viewAll);

        if (viewAll) {
          url = `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`;
        } else {
          url = `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`;
        }
      }

      console.log("Fetching from URL:", url);
      const response = await axios.get(url);
      setAccountList(response.data.accountlist || []);
    } catch (err) {
      console.error("Error loading accounts:", err);
      setAccountList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsList();
  }, [filterStatus, userRole]);
const handleSubmit = async (event, personalMessage = "") => {
  if (event) event.preventDefault();

  // Your existing validation code
  let isValid = true;
  if (!accountData.accountName?.trim()) {
    toast.warning("Account Name is required");
    setActiveStep(0);
    isValid = false;
    return;
  }

  if (
    accountData.clientType === "Company" &&
    !accountData.companyName?.trim()
  ) {
    toast.warning("Company Name is required");
    setActiveStep(0);
    isValid = false;
    return;
  }

  if (!accountData.folderTemp) {
    toast.warning("Folder Template is required");
    setActiveStep(0);
    isValid = false;
    return;
  }

  const allContacts = [...contacts, ...selectedContacts];
  if (allContacts.length === 0) {
    toast.warning("At least one contact is required");
    setActiveStep(1);
    isValid = false;
    return;
  }

  for (let contact of allContacts) {
    if (
      !contact.firstName?.trim() ||
      !contact.lastName?.trim() ||
      !contact.email?.trim()
    ) {
      toast.warning(
        "All contacts must have First Name, Last Name, and Email"
      );
      setActiveStep(1);
      isValid = false;
      return;
    }
  }

  if (!isValid) return;

  try {
    // STEP 1: Check for duplicate emails
    const allContactEmails = [
      ...contacts.map((c) => c.email?.toLowerCase().trim()),
      ...selectedContacts.map((c) => c.email?.toLowerCase().trim()),
    ].filter((email) => email);

    const duplicateEmails = allContactEmails.filter(
      (email, index) => allContactEmails.indexOf(email) !== index
    );

    if (duplicateEmails.length > 0) {
      toast.error(`Duplicate emails found: ${duplicateEmails.join(", ")}`);
      return;
    }

    // STEP 2: Check if account name already exists (only for new accounts)
    if (!isEditing) {
      try {
        console.log(
          "Checking if account name exists:",
          accountData.accountName
        );

        // Try method 1: Direct API check
        const checkResponse = await axios.get(
          `https://www.snptaxes.com/api/accounts/check-name/${encodeURIComponent(accountData.accountName.trim())}`
        );

        console.log("Check response:", checkResponse.data);

        // If account name exists, show error and return
        if (checkResponse.data.exists === true) {
          toast.error(
            `Account name "${accountData.accountName}" already exists. Please use a different account name.`
          );
          setActiveStep(0);
          return;
        }
      } catch (checkError) {
        console.log(
          "Check endpoint failed, trying alternative method:",
          checkError
        );

        // Alternative method: Get all accounts and check manually
        try {
          const allAccountsResponse = await axios.get(
            "https://www.snptaxes.com/api/accounts"
          );
          const existingAccount = allAccountsResponse.data.find(
            (account) =>
              account.accountName?.toLowerCase().trim() ===
              accountData.accountName.toLowerCase().trim()
          );

          if (existingAccount) {
            toast.error(
              `Account name "${accountData.accountName}" already exists. Please use a different account name.`
            );
            setActiveStep(0);
            return;
          }
        } catch (searchError) {
          console.warn(
            "Both account check methods failed, proceeding with creation:",
            searchError
          );
        }
      }
    }

    // STEP 3: Identify NEW contacts that need activation BEFORE creating them
    const newContactsNeedingActivation = contacts.filter(contact => 
      contact.login === true && 
      (!contact._id) // No _id means it's a new contact
    );

    const newSelectedContactsNeedingActivation = selectedContacts.filter(contact => 
      contact.login === true && 
      contact.isNewlySelected // Use the flag we set when selecting
    );

    const allNewContactsForActivation = [
      ...newContactsNeedingActivation,
      ...newSelectedContactsNeedingActivation
    ];

    // STEP 4: Create Contacts FIRST - PASS personalMessage to API
    const contactsWithActivation = [];
    const createdContacts = [];
    const updatedContacts = [...contacts];

    // Create new contacts
    for (let i = 0; i < contacts.length; i++) {
      let contact = contacts[i];
      if (contact.firstName || contact.lastName || contact.email) {
        let payload = {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          contactName: contact.contactName || `${contact.firstName} ${contact.lastName}`,
          companyName: contact.companyName || "",
          note: contact.note || "",
          tags: contact.tags ? contact.tags.map((tag) => tag.value) : [],
          country: contact.country ? { name: contact.country.label } : {},
          streetAddress: contact.streetAddress || "",
          city: contact.city || "",
          state: contact.state || "",
          postalCode: contact.postalCode || "",
          phoneNumbers: contact.phoneNumbers || [],
          login: contact.login || false,
          active: true,
          // ⭐⭐ ADD personalMessage to payload for NEW contacts that need activation ⭐⭐
          personalMessage: contact.login && !contact._id ? personalMessage : ""
        };

        if (contact.login) {
          contactsWithActivation.push(contact);
          delete payload.password;
        } else {
          delete payload.password;
        }

        try {
          const resp = await axios.post(
            "https://www.snptaxes.com/api/contacts",
            payload
          );
          createdContacts.push(resp.data);
          updatedContacts[i] = { ...contact, _id: resp.data._id };
        } catch (contactError) {
          if (contactError.response?.status === 409) {
            toast.error(
              `Contact email "${contact.email}" already exists. Please use a different email.`
            );
            throw contactError;
          } else {
            throw contactError;
          }
        }
      }
    }

    // STEP 5: Prepare ALL contacts for account creation
    const allContactsForAccount = [
      ...createdContacts,
      ...selectedContacts,
    ];

    const accountContacts = allContactsForAccount.map((contact) => {
      const originalContact = [...contacts, ...selectedContacts].find(
        (c) => c.email === contact.email
      );

      return {
        contact: contact._id,
        canLogin: originalContact?.login || false,
        canNotify: originalContact?.notify || false,
        canEmailSync: originalContact?.emailSync || false,
      };
    });

    console.log("Account contacts to be created:", accountContacts);

    // STEP 6: Create Account with ALL contacts
    const accountPayload = {
      accountName: accountData.accountName,
      clientType: accountData.clientType,
      companyName: accountData.companyName || "",
      teamMember: accountData.teamMembers
        ? accountData.teamMembers.map((member) => member.value)
        : [],
      tags: accountData.tags ? accountData.tags.map((tag) => tag.value) : [],
      folderTemp: accountData.folderTemp
        ? accountData.folderTemp.value
        : null,
      country: accountData.country ? { name: accountData.country.label } : {},
      streetAddress: accountData.streetAddress || "",
      city: accountData.city || "",
      state: accountData.state || "",
      postalCode: accountData.postalCode || "",
      adminUserId: loginUserId || "",
      contacts: accountContacts, 
      active: true,
    };

    console.log("Final account payload:", accountPayload);

    let account;
    let finalAccountId;

    try {
      // Create or Update Account
      if (isEditing && accountId) {
        const { data } = await axios.put(
          `https://www.snptaxes.com/api/accounts/${accountId}`,
          accountPayload
        );
        account = data;
        finalAccountId = accountId;
      } else {
        const { data } = await axios.post(
          "https://www.snptaxes.com/api/accounts",
          accountPayload
        );
        account = data;
        finalAccountId = account._id;
      }

      console.log("Account created with ID:", finalAccountId);
      console.log("Account contacts after creation:", account.contacts);
    } catch (accountError) {
      console.error("Account creation error:", accountError);

      if (
        accountError.response?.status === 409 ||
        accountError.response?.status === 400
      ) {
        const errorMessage =
          accountError.response?.data?.message ||
          accountError.response?.data?.error ||
          JSON.stringify(accountError.response?.data);

        if (
          errorMessage?.toLowerCase().includes("unique") ||
          errorMessage?.toLowerCase().includes("already exists") ||
          errorMessage?.toLowerCase().includes("duplicate")
        ) {
          toast.error(
            `Account name "${accountData.accountName}" already exists. Please use a different account name.`
          );
          setActiveStep(0);

          if (createdContacts.length > 0) {
            for (let contact of createdContacts) {
              try {
                await axios.delete(
                  `https://www.snptaxes.com/api/contacts/${contact._id}`
                );
              } catch (deleteError) {
                console.error("Failed to cleanup contact:", deleteError);
              }
            }
          }
          return;
        }
      }

      toast.error("Failed to create account. Please try again.");
      throw accountError;
    }

    // STEP 7: Update Contacts with accountId
    const allContactIdsToUpdate = [
      ...createdContacts.map((c) => c._id),
      ...selectedContacts.map((c) => c._id),
    ];

    for (let contactId of allContactIdsToUpdate) {
      try {
        const contact = allContactsForAccount.find(
          (c) => c._id === contactId
        );
        const currentAccountIds = contact?.accountIds || [];

        if (!currentAccountIds.includes(finalAccountId)) {
          await axios.put(
            `https://www.snptaxes.com/api/contacts/${contactId}`,
            {
              accountIds: [...currentAccountIds, finalAccountId],
              accountId: finalAccountId,
            }
          );
        }
      } catch (updateError) {
        console.error(`Failed to update contact ${contactId}:`, updateError);
      }
    }

    // STEP 8: Verify account
    try {
      const verifyResponse = await axios.get(
        `https://www.snptaxes.com/api/accounts/${finalAccountId}`
      );

      if (
        !verifyResponse.data.contacts ||
        verifyResponse.data.contacts.length === 0
      ) {
        await axios.put(
          `https://www.snptaxes.com/api/accounts/${finalAccountId}`,
          { contacts: accountContacts }
        );
      }
    } catch (verifyError) {
      console.error("Error verifying account:", verifyError);
    }

    // STEP 9: Send activation emails for NEWLY SELECTED contacts
    // (Form contacts already got their emails in the creation step)
    try {
      console.log("Sending activation emails for newly selected contacts...");
      
      const newlySelectedForActivation = selectedContacts.filter(
        contact => contact.login === true && contact.isNewlySelected
      );

      console.log("Newly selected contacts needing activation:", newlySelectedForActivation);

      for (let contact of newlySelectedForActivation) {
        await sendActivationEmail({ contact }, personalMessage);
      }
    } catch (error) {
      console.error("Activation email sending for selected contacts failed:", error);
    }

    // STEP 10: Handle folder template assignment
    if (accountData.folderTemp && accountData.folderTemp.value) {
      await assignfoldertemp(finalAccountId, accountData.folderTemp.value);
    }

    toast.success("Account and contacts saved successfully!");

    if (onCloseDrawer) {
      onCloseDrawer();
    } else {
      handleDrawerClose();
      handleNewDrawerClose();
    }

    // Reset tracking after successful submission
    // setNewlySelectedContacts([]);
    // setNewFormContacts([]);

  } catch (err) {
    console.error("Error saving account:", err);

    if (err.response?.status === 409) {
      // Email conflict error - already handled above
    } else if (err.response?.data?.error) {
      toast.error(`Failed to save: ${err.response.data.error}`);
    } else {
      toast.error("Failed to save account and contacts. Please try again.");
    }
  }
};
  
// const handleSubmit = async (event, personalMessage = "") => {
//     if (event) event.preventDefault();

//     // Your existing validation code
//     let isValid = true;
//     if (!accountData.accountName?.trim()) {
//       toast.warning("Account Name is required");
//       setActiveStep(0);
//       isValid = false;
//       return;
//     }

//     if (
//       accountData.clientType === "Company" &&
//       !accountData.companyName?.trim()
//     ) {
//       toast.warning("Company Name is required");
//       setActiveStep(0);
//       isValid = false;
//       return;
//     }

//     if (!accountData.folderTemp) {
//       toast.warning("Folder Template is required");
//       setActiveStep(0);
//       isValid = false;
//       return;
//     }

//     const allContacts = [...contacts, ...selectedContacts];
//     if (allContacts.length === 0) {
//       toast.warning("At least one contact is required");
//       setActiveStep(1);
//       isValid = false;
//       return;
//     }

//     for (let contact of allContacts) {
//       if (
//         !contact.firstName?.trim() ||
//         !contact.lastName?.trim() ||
//         !contact.email?.trim()
//       ) {
//         toast.warning(
//           "All contacts must have First Name, Last Name, and Email"
//         );
//         setActiveStep(1);
//         isValid = false;
//         return;
//       }
//     }

//     if (!isValid) return;

//     try {
//       // STEP 1: Check for duplicate emails
//       const allContactEmails = [
//         ...contacts.map((c) => c.email?.toLowerCase().trim()),
//         ...selectedContacts.map((c) => c.email?.toLowerCase().trim()),
//       ].filter((email) => email);

//       const duplicateEmails = allContactEmails.filter(
//         (email, index) => allContactEmails.indexOf(email) !== index
//       );

//       if (duplicateEmails.length > 0) {
//         toast.error(`Duplicate emails found: ${duplicateEmails.join(", ")}`);
//         return;
//       }

//       // STEP 2: Check if account name already exists (only for new accounts)
//       if (!isEditing) {
//         try {
//           console.log(
//             "Checking if account name exists:",
//             accountData.accountName
//           );

//           // Try method 1: Direct API check
//           const checkResponse = await axios.get(
//             `https://www.snptaxes.com/api/accounts/check-name/${encodeURIComponent(accountData.accountName.trim())}`
//           );

//           console.log("Check response:", checkResponse.data);

//           // If account name exists, show error and return
//           if (checkResponse.data.exists === true) {
//             toast.error(
//               `Account name "${accountData.accountName}" already exists. Please use a different account name.`
//             );
//             setActiveStep(0);
//             return;
//           }
//         } catch (checkError) {
//           console.log(
//             "Check endpoint failed, trying alternative method:",
//             checkError
//           );

//           // Alternative method: Get all accounts and check manually
//           try {
//             const allAccountsResponse = await axios.get(
//               "https://www.snptaxes.com/api/accounts"
//             );
//             const existingAccount = allAccountsResponse.data.find(
//               (account) =>
//                 account.accountName?.toLowerCase().trim() ===
//                 accountData.accountName.toLowerCase().trim()
//             );

//             if (existingAccount) {
//               toast.error(
//                 `Account name "${accountData.accountName}" already exists. Please use a different account name.`
//               );
//               setActiveStep(0);
//               return;
//             }
//           } catch (searchError) {
//             console.warn(
//               "Both account check methods failed, proceeding with creation:",
//               searchError
//             );
//           }
//         }
//       }

//       // STEP 3: Create Contacts FIRST
//       const contactsWithActivation = [];
//       const createdContacts = []; // Store full contact objects with IDs
//       const updatedContacts = [...contacts];

//       // Create new contacts
//       for (let i = 0; i < contacts.length; i++) {
//         let contact = contacts[i];
//         if (contact.firstName || contact.lastName || contact.email) {
//           let payload = {
//             firstName: contact.firstName,
//             lastName: contact.lastName,
//             email: contact.email,
//             contactName:
//               contact.contactName || `${contact.firstName} ${contact.lastName}`,
//             companyName: contact.companyName || "",
//             note: contact.note || "",
//             tags: contact.tags ? contact.tags.map((tag) => tag.value) : [],
//             country: contact.country ? { name: contact.country.label } : {},
//             streetAddress: contact.streetAddress || "",
//             city: contact.city || "",
//             state: contact.state || "",
//             postalCode: contact.postalCode || "",
//             phoneNumbers: contact.phoneNumbers || [],
//             login: contact.login || false,
//             active: true,
//           };

//           if (contact.login) {
//             contactsWithActivation.push(contact);
//             delete payload.password;
//           } else {
//             delete payload.password;
//           }

//           try {
//             const resp = await axios.post(
//               "https://www.snptaxes.com/api/contacts",
//               payload
//             );
//             createdContacts.push(resp.data); // Store the full created contact
//             updatedContacts[i] = { ...contact, _id: resp.data._id };
//           } catch (contactError) {
//             if (contactError.response?.status === 409) {
//               toast.error(
//                 `Contact email "${contact.email}" already exists. Please use a different email.`
//               );
//               throw contactError;
//             } else {
//               throw contactError;
//             }
//           }
//         }
//       }

//       // STEP 4: Prepare ALL contacts for account creation
//       const allContactsForAccount = [
//         ...createdContacts, // Newly created contacts with _id
//         ...selectedContacts, // Existing contacts with _id
//       ];

//       // Create the contacts array for account schema
//       const accountContacts = allContactsForAccount.map((contact) => {
//         const originalContact = [...contacts, ...selectedContacts].find(
//           (c) => c.email === contact.email
//         );

//         return {
//           contact: contact._id,
//           canLogin: originalContact?.login || false,
//           canNotify: originalContact?.notify || false,
//           canEmailSync: originalContact?.emailSync || false,
//         };
//       });

//       console.log("Account contacts to be created:", accountContacts);

//       // STEP 5: Create Account with ALL contacts
//       const accountPayload = {
//         accountName: accountData.accountName,
//         clientType: accountData.clientType,
//         companyName: accountData.companyName || "",
//         teamMember: accountData.teamMembers
//           ? accountData.teamMembers.map((member) => member.value)
//           : [],
//         tags: accountData.tags ? accountData.tags.map((tag) => tag.value) : [],
//         folderTemp: accountData.folderTemp
//           ? accountData.folderTemp.value
//           : null,
//         country: accountData.country ? { name: accountData.country.label } : {},
//         streetAddress: accountData.streetAddress || "",
//         city: accountData.city || "",
//         state: accountData.state || "",
//         postalCode: accountData.postalCode || "",
//         adminUserId: loginUserId || "",
//         contacts: accountContacts, 
//         active: true,
//       };

//       console.log("Final account payload:", accountPayload);

//       let account;
//       let finalAccountId;

//       try {
//         // Create or Update Account
//         if (isEditing && accountId) {
//           const { data } = await axios.put(
//             `https://www.snptaxes.com/api/accounts/${accountId}`,
//             accountPayload
//           );
//           account = data;
//           finalAccountId = accountId;
//         } else {
//           const { data } = await axios.post(
//             "https://www.snptaxes.com/api/accounts",
//             accountPayload
//           );
//           account = data;
//           finalAccountId = account._id;
//         }

//         console.log("Account created with ID:", finalAccountId);
//         console.log("Account contacts after creation:", account.contacts);
//       } catch (accountError) {
//         console.error("Account creation error:", accountError);

//         if (
//           accountError.response?.status === 409 ||
//           accountError.response?.status === 400
//         ) {
//           const errorMessage =
//             accountError.response?.data?.message ||
//             accountError.response?.data?.error ||
//             JSON.stringify(accountError.response?.data);

//           if (
//             errorMessage?.toLowerCase().includes("unique") ||
//             errorMessage?.toLowerCase().includes("already exists") ||
//             errorMessage?.toLowerCase().includes("duplicate")
//           ) {
//             toast.error(
//               `Account name "${accountData.accountName}" already exists. Please use a different account name.`
//             );
//             setActiveStep(0);

//             if (createdContacts.length > 0) {
//               for (let contact of createdContacts) {
//                 try {
//                   await axios.delete(
//                     `https://www.snptaxes.com/api/contacts/${contact._id}`
//                   );
//                 } catch (deleteError) {
//                   console.error("Failed to cleanup contact:", deleteError);
//                 }
//               }
//             }
//             return;
//           }
//         }

//         toast.error("Failed to create account. Please try again.");
//         throw accountError;
//       }

//       // STEP 6: Update Contacts with accountId
//       const allContactIdsToUpdate = [
//         ...createdContacts.map((c) => c._id),
//         ...selectedContacts.map((c) => c._id),
//       ];

//       for (let contactId of allContactIdsToUpdate) {
//         try {
//           const contact = allContactsForAccount.find(
//             (c) => c._id === contactId
//           );
//           const currentAccountIds = contact?.accountIds || [];

//           if (!currentAccountIds.includes(finalAccountId)) {
//             await axios.put(
//               `https://www.snptaxes.com/api/contacts/${contactId}`,
//               {
//                 accountIds: [...currentAccountIds, finalAccountId],
//                 accountId: finalAccountId,
//               }
//             );
//           }
//         } catch (updateError) {
//           console.error(`Failed to update contact ${contactId}:`, updateError);
//         }
//       }

//       // STEP 7: Verify account
//       try {
//         const verifyResponse = await axios.get(
//           `https://www.snptaxes.com/api/accounts/${finalAccountId}`
//         );

//         if (
//           !verifyResponse.data.contacts ||
//           verifyResponse.data.contacts.length === 0
//         ) {
//           await axios.put(
//             `https://www.snptaxes.com/api/accounts/${finalAccountId}`,
//             { contacts: accountContacts }
//           );
//         }
//       } catch (verifyError) {
//         console.error("Error verifying account:", verifyError);
//       }

//       // ⭐⭐⭐ ADDED BLOCK — STEP 7.5 ⭐⭐⭐
//       // Send activation email ONLY for newly selected contacts (not form contacts)
//       try {
//         console.log("Checking newly selected contacts for activation emails...");

//         // 1. Re-fetch updated account to get current linked contacts
//         const accRes = await axios.get(
//           `https://www.snptaxes.com/api/accounts/${finalAccountId}`
//         );
//         const updatedAcc = accRes.data;

//         // 2. Get IDs already linked to account
//         const existingLinkedIds =
//           updatedAcc.contacts?.map((c) => c.contact) || [];

//         // 3. Find newly selected contacts (only from selectedContacts[])
//         const newSelectedContacts = selectedContacts.filter(
//           (sc) => !existingLinkedIds.includes(sc._id)
//         );

//         // 4. Filter only those with login = true
//         const activationTargets = newSelectedContacts.filter(
//           (c) => c.login === true
//         );

//         console.log(
//           "New selected contacts needing activation:",
//           activationTargets
//         );

//         // 5. Send activation email for each
//         for (let contact of activationTargets) {
//           await sendActivationEmail({ contact }, personalMessage);
//         }
//       } catch (error) {
//         console.error("Activation email sending failed:", error);
//       }
//       // ⭐⭐⭐ END — STEP 7.5 ⭐⭐⭐

//       // STEP 8: Handle folder template assignment
//       if (accountData.folderTemp && accountData.folderTemp.value) {
//         await assignfoldertemp(finalAccountId, accountData.folderTemp.value);
//       }

//       toast.success("Account and contacts saved successfully!");

//       if (onCloseDrawer) {
//         onCloseDrawer();
//       } else {
//         handleDrawerClose();
//         handleNewDrawerClose();
//       }

//     } catch (err) {
//       console.error("Error saving account:", err);

//       if (err.response?.status === 409) {
//         // Email conflict error - already handled above
//       } else if (err.response?.data?.error) {
//         toast.error(`Failed to save: ${err.response.data.error}`);
//       } else {
//         toast.error("Failed to save account and contacts. Please try again.");
//       }
//     }
//   };
 // Send activation email function
  const sendActivationEmail = async (contact,personalMessage="") => {
    // console.log("contact",contact)
    const ContactId = contact.contact._id;
    try {
      const response = await axios.post(
        `https://www.snptaxes.com/api/contacts/${ContactId}/resend-activation`,
        {
          email: contact.contact.email,
          contactId: ContactId,
          personalMessage: personalMessage,
        }
      );
      console.log("Activation email sent successfully:", response.data);
      return true;
    } catch (error) {
      console.error("Error sending activation email:", error);
      return false;
    }
  };
  // const handleSubmit = async (event, personalMessage = "") => {
  //   if (event) event.preventDefault();
  //   let isValid = true;

  //   // Validate account data (your existing validation code)
  //   if (!accountData.accountName?.trim()) {
  //     toast.warning("Account Name is required");
  //     setActiveStep(0);
  //     isValid = false;
  //     return;
  //   }
  //   if (
  //     accountData.clientType === "Company" &&
  //     !accountData.companyName?.trim()
  //   ) {
  //     toast.warning("Company Name is required");
  //     setActiveStep(0);
  //     isValid = false;
  //     return;
  //   }
  //   if (!accountData.folderTemp) {
  //     toast.warning("Folder Template is required");
  //     setActiveStep(0);
  //     isValid = false;
  //     return;
  //   }

  //   // Validate contacts (your existing validation code)
  //   const allContacts = [...contacts, ...selectedContacts];
  //   if (allContacts.length === 0) {
  //     toast.warning("At least one contact is required");
  //     setActiveStep(1);
  //     isValid = false;
  //     return;
  //   }
  //   for (let contact of allContacts) {
  //     if (
  //       !contact.firstName?.trim() ||
  //       !contact.lastName?.trim() ||
  //       !contact.email?.trim()
  //     ) {
  //       toast.warning(
  //         "All contacts must have First Name, Last Name, and Email"
  //       );
  //       setActiveStep(1);
  //       isValid = false;
  //       return;
  //     }
  //   }

  //   if (!isValid) return;

  //   try {
  //     // Prepare the complete account data for backend
  //     const accountPayload = {
  //       accountName: accountData.accountName,
  //       clientType: accountData.clientType,
  //       companyName: accountData.companyName || "",

  //       // Add the missing fields
  //       teamMember: accountData.teamMembers
  //         ? accountData.teamMembers.map((member) => member.value)
  //         : [],
  //       tags: accountData.tags ? accountData.tags.map((tag) => tag.value) : [],
  //       folderTemp: accountData.folderTemp
  //         ? accountData.folderTemp.value
  //         : null,

  //       // Address fields
  //       country: accountData.country ? accountData.country.label : "",
  //       streetAddress: accountData.streetAddress || "",
  //       city: accountData.city || "",
  //       state: accountData.state || "",
  //       postalCode: accountData.postalCode || "",

  //       // Admin user ID
  //       adminUserId: loginUserId || "",
  //       active: true,
  //     };
  //     console.log("accountpayload", accountPayload);
  //     let account;

  //     // 1. Create or Update Account with complete data
  //     if (isEditing && accountId) {
  //       const { data } = await axios.put(
  //         `https://www.snptaxes.com/api/accounts/${accountId}`,
  //         accountPayload
  //       );
  //       account = data;
  //     } else {
  //       const { data } = await axios.post(
  //         "https://www.snptaxes.com/api/accounts",
  //         accountPayload
  //       );
  //       account = data;
  //     }
  //  // ✅ after account is created or updated
  //     const finalAccountId = isEditing && accountId ? accountId : account._id;
  //     // 2. Handle new Contacts (your existing code)
  //     let updatedContacts = [...contacts];
  //     const contactsWithActivation = [];

  //     for (let i = 0; i < contacts.length; i++) {
  //       let contact = contacts[i];
  //       if (contact.firstName || contact.lastName || contact.email) {
  //         let payload = {
  //           ...contact,
  //           accountIds: finalAccountId,
  //           contactName: contact.contactName,
  //           accountId: account._id,
  //           tags: contact.tags ? contact.tags.map((tag) => tag.value) : [],
  //           // Include address fields
  //           country: contact.country ? contact.country.label : "",
  //           streetAddress: contact.streetAddress || "",
  //           city: contact.city || "",
  //           state: contact.state || "",
  //           postalCode: contact.postalCode || "",
  //           login: contact.login || false,
  //         };

  //         if (contact.login) {
  //           // Track new contacts that need activation
  //           contactsWithActivation.push(contact);
  //           delete payload.password;
  //         } else {
  //           delete payload.password;
  //         }

  //         const resp = await axios.post(
  //           "https://www.snptaxes.com/api/contacts",
  //           payload
  //         );
  //         updatedContacts[i] = { ...contact, _id: resp.data._id };
  //       }
  //     }

  //     // 3. Update selected existing contacts - FIXED SECTION
  //     for (let i = 0; i < selectedContacts.length; i++) {
  //       let contact = selectedContacts[i];
  //       let shouldUpdate = contact.accountId !== account._id || contact.login;

  //       if (shouldUpdate) {
  //         let payload = {
  //           ...contact,
  //           accountId: account._id,
  //           login: contact.login || false,
  //         };

  //         // Check if login status changed to true (needs activation)
  //         const needsActivation = contact.login &&
  //           (!contact.previousLoginStatus || contact.previousLoginStatus === false);

  //         if (contact.login) {
  //           // Track contacts that need activation email
  //           if (needsActivation) {
  //             contactsWithActivation.push(contact);
  //           }
  //           delete payload.password;
  //         } else {
  //           delete payload.password;
  //         }

  //         await axios.put(
  //           `https://www.snptaxes.com/api/contacts/${contact._id}`,
  //           payload
  //         );
  //       }
  //     }

  //     // 4. Combine contacts for linking (your existing code)
  //     const allFinalContacts = [
  //       ...updatedContacts.filter((c) => c._id),
  //       ...selectedContacts,
  //     ];
  //     const accContacts = allFinalContacts.map((c) => ({
  //       contact: c._id,
  //       canLogin: c.login || false,
  //       canNotify: c.notify || false,
  //       canEmailSync: c.emailSync || false,
  //     }));

  //     await axios.put(
  //       `https://www.snptaxes.com/api/accounts/${finalAccountId}`,
  //       { contacts: accContacts }
  //     );

  //     // 6. Handle folder template assignment if needed
  //     if (accountData.folderTemp && accountData.folderTemp.value) {
  //       assignfoldertemp(finalAccountId, accountData.folderTemp.value);
  //     }

  //  toast.success("Account and contacts saved successfully!");
  //  fetchAccountsList(); // Refresh account list after save
      // if (onCloseDrawer) {
      //   onCloseDrawer();
      // } else {
      //   onClose();
      // }
  //   } catch (err) {
  //     console.error("Error saving account:", err);

  //     // More specific error handling
  //     if (err.response?.status === 409) {
  //       toast.error(
  //         "Contact email already exists. Please use a different email."
  //       );
  //     } else if (err.response?.data?.error) {
  //       toast.error(`Failed to save: ${err.response.data.error}`);
  //     } else {
  //       toast.error("Failed to save account and contacts. Please try again.");
  //     }
  //   }
  // };
  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 2 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        {activeStep === 0 && (
          <AccountForm onContinue={() => setActiveStep(1)} />
        )}
        {activeStep === 1 && (
          <ContactForm
            onBack={() => setActiveStep(0)}
            onSubmit={handleSubmit}
            isEditing={isEditing}
          />
        )}
      </Box>
    </Box>
  );
}
