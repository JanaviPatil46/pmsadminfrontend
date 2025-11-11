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
  onClose,
}) {
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

  //     // 2. Handle new Contacts (your existing code)
  //     let updatedContacts = [...contacts];
  //     const contactsWithActivation = [];
  //     const defaultPassword = "defaultPassword123";
  //     for (let i = 0; i < contacts.length; i++) {
  //       let contact = contacts[i];
  //       if (contact.firstName || contact.lastName || contact.email) {
  //         let payload = {
  //           ...contact,
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
  //         // if (contact.login) {
  //         //   payload.password = defaultPassword;
  //         // } else {
  //         //   delete payload.password;
  //         // }
  //         if (contact.login) {
  //           // Don't send password - backend will handle activation
  //           delete payload.password;
  //           // Track this contact for activation email notification
  //           contactsWithActivation.push(contact);
  //         } else {
  //           // For non-login contacts, you can set a default password or leave empty
  //           // payload.password = "defaultPassword123"; // Optional
  //           delete payload.password;
  //         }
  //         const resp = await axios.post(
  //           "https://www.snptaxes.com/api/contacts",
  //           payload
  //         );
  //         updatedContacts[i] = { ...contact, _id: resp.data._id };
  //       }
  //     }

  //     // 3. Update selected existing contacts (your existing code)
  //     for (let i = 0; i < selectedContacts.length; i++) {
  //       let contact = selectedContacts[i];
  //       let shouldUpdate = contact.accountId !== account._id || contact.login;
  //       if (shouldUpdate) {
  //         let payload = {
  //           ...contact,
  //           accountId: account._id,
  //           login: contact.login || false,
  //         };
  //         // if (contact.login) {
  //         //   payload.password = defaultPassword;
  //         // } else {
  //         //   delete payload.password;
  //         // }
  //         // For login-enabled contacts, handle activation
  //         if (contact.login) {
  //           // If this contact didn't have login before, they need activation
  //           // if (!contact._id || !contact.isActivated) {
  //             contactsWithActivation.push(contact);
  //           // }
  //           // Don't send password in update
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

  //     // 5. Update account with contacts
  //     const finalAccountId = isEditing && accountId ? accountId : account._id;
  //     await axios.put(
  //       `https://www.snptaxes.com/api/accounts/${finalAccountId}`,
  //       { contacts: accContacts }
  //     );

  //     // 6. Handle folder template assignment if needed
  //     if (accountData.folderTemp && accountData.folderTemp.value) {
  //       assignfoldertemp(finalAccountId, accountData.folderTemp.value);
  //     }
  //     // 7. Show success messages with activation email notifications
  //     if (contactsWithActivation.length > 0) {
  //       const activationEmails = contactsWithActivation
  //         .map((c) => c.email)
  //         .join(", ");
  //       toast.success(
  //         `Account and contacts saved! Activation emails sent to: ${activationEmails}`
  //       );
  //     } else {
  //       toast.success("Account and contacts saved successfully!");
  //     }

  //     // alert("Account, contacts saved!");
  //     console.log("accountdata", account);
  //     //  if (onCloseDrawer)
  //     //  onCloseDrawer();
  //     // onClose()
  //     if (onCloseDrawer) {
  //       onCloseDrawer();
  //     } else {
  //       onClose();
  //     }
  //   } catch (err) {
  //     //   console.error("Error saving account:", err);
  //     //   alert("Failed to save. Check console.");
  //     // }
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
const handleSubmit = async (event, personalMessage = "") => {
  if (event) event.preventDefault();
  let isValid = true;

  // Validate account data (your existing validation code)
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

  // Validate contacts (your existing validation code)
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
    // Prepare the complete account data for backend
    const accountPayload = {
      accountName: accountData.accountName,
      clientType: accountData.clientType,
      companyName: accountData.companyName || "",

      // Add the missing fields
      teamMember: accountData.teamMembers
        ? accountData.teamMembers.map((member) => member.value)
        : [],
      tags: accountData.tags ? accountData.tags.map((tag) => tag.value) : [],
      folderTemp: accountData.folderTemp
        ? accountData.folderTemp.value
        : null,

      // Address fields
      country: accountData.country ? accountData.country.label : "",
      streetAddress: accountData.streetAddress || "",
      city: accountData.city || "",
      state: accountData.state || "",
      postalCode: accountData.postalCode || "",

      // Admin user ID
      adminUserId: loginUserId || "",
      active: true,
    };
    console.log("accountpayload", accountPayload);
    let account;

    // 1. Create or Update Account with complete data
    if (isEditing && accountId) {
      const { data } = await axios.put(
        `https://www.snptaxes.com/api/accounts/${accountId}`,
        accountPayload
      );
      account = data;
    } else {
      const { data } = await axios.post(
        "https://www.snptaxes.com/api/accounts",
        accountPayload
      );
      account = data;
    }
 // ✅ after account is created or updated
    const finalAccountId = isEditing && accountId ? accountId : account._id;
    // 2. Handle new Contacts (your existing code)
    let updatedContacts = [...contacts];
    const contactsWithActivation = [];
    
    for (let i = 0; i < contacts.length; i++) {
      let contact = contacts[i];
      if (contact.firstName || contact.lastName || contact.email) {
        let payload = {
          ...contact,
          accountIds: finalAccountId, 
          contactName: contact.contactName,
          accountId: account._id,
          tags: contact.tags ? contact.tags.map((tag) => tag.value) : [],
          // Include address fields
          country: contact.country ? contact.country.label : "",
          streetAddress: contact.streetAddress || "",
          city: contact.city || "",
          state: contact.state || "",
          postalCode: contact.postalCode || "",
          login: contact.login || false,
        };
        
        if (contact.login) {
          // Track new contacts that need activation
          contactsWithActivation.push(contact);
          delete payload.password;
        } else {
          delete payload.password;
        }
        
        const resp = await axios.post(
          "https://www.snptaxes.com/api/contacts",
          payload
        );
        updatedContacts[i] = { ...contact, _id: resp.data._id };
      }
    }

    // 3. Update selected existing contacts - FIXED SECTION
    for (let i = 0; i < selectedContacts.length; i++) {
      let contact = selectedContacts[i];
      let shouldUpdate = contact.accountId !== account._id || contact.login;
      
      if (shouldUpdate) {
        let payload = {
          ...contact,
          accountId: account._id,
          login: contact.login || false,
        };

        // Check if login status changed to true (needs activation)
        const needsActivation = contact.login && 
          (!contact.previousLoginStatus || contact.previousLoginStatus === false);
        
        if (contact.login) {
          // Track contacts that need activation email
          if (needsActivation) {
            contactsWithActivation.push(contact);
          }
          delete payload.password;
        } else {
          delete payload.password;
        }
        
        await axios.put(
          `https://www.snptaxes.com/api/contacts/${contact._id}`,
          payload
        );
      }
    }

    // 4. Combine contacts for linking (your existing code)
    const allFinalContacts = [
      ...updatedContacts.filter((c) => c._id),
      ...selectedContacts,
    ];
    const accContacts = allFinalContacts.map((c) => ({
      contact: c._id,
      canLogin: c.login || false,
      canNotify: c.notify || false,
      canEmailSync: c.emailSync || false,
    }));

   
    await axios.put(
      `https://www.snptaxes.com/api/accounts/${finalAccountId}`,
      { contacts: accContacts }
    );

    // 6. Handle folder template assignment if needed
    if (accountData.folderTemp && accountData.folderTemp.value) {
      assignfoldertemp(finalAccountId, accountData.folderTemp.value);
    }

    // 7. Show success messages with activation email notifications
    // if (contactsWithActivation.length > 0) {
    //   const activationEmails = contactsWithActivation
    //     .map((c) => c.email)
    //     .join(", ");
    //   toast.success(
    //     `Account and contacts saved! Activation emails sent to: ${activationEmails}`
    //   );
    // } else {
    //   toast.success("Account and contacts saved successfully!");
    // }
 toast.success("Account and contacts saved successfully!");
    if (onCloseDrawer) {
      onCloseDrawer();
    } else {
      onClose();
    }
  } catch (err) {
    console.error("Error saving account:", err);

    // More specific error handling
    if (err.response?.status === 409) {
      toast.error(
        "Contact email already exists. Please use a different email."
      );
    } else if (err.response?.data?.error) {
      toast.error(`Failed to save: ${err.response.data.error}`);
    } else {
      toast.error("Failed to save account and contacts. Please try again.");
    }
  }
};
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
