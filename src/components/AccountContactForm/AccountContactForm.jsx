// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   Box,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Typography,
// } from "@mui/material";
// import AccountForm from "./AccountForm";
// import ContactForm from "./ContactForm";

// const steps = ["Account Information", "Contact Information"];

// export default function AccountContactForm() {
//   const [activeStep, setActiveStep] = useState(0);
//   const { accountData, contactData } = useSelector(
//     (state) => state.accountContact
//   );

//   const handleNext = () => setActiveStep((prev) => prev + 1);
//   const handleBack = () => setActiveStep((prev) => prev - 1);

//   const handleSubmit = () => {
//     const finalData = {
//       ...accountData,
//       contacts: [contactData],
//     };
//     console.log("Final Submitted Data:", finalData);
//     alert("Submitted! Check console for data.");
//   };

//   return (
//     <Box sx={{ maxWidth: 700, margin: "auto", mt: 5 }}>
//       {/* Stepper */}
//       <Stepper activeStep={activeStep} alternativeLabel>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       {/* Step Content */}
//       <Box sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
//         {activeStep === 0 && <AccountForm onContinue={handleNext} />}
//         {activeStep === 1 && (
//           <ContactForm onBack={handleBack} onSubmit={handleSubmit} />
//         )}
//       </Box>

//       {/* Finish Message */}
//       {activeStep === steps.length && (
//         <Typography sx={{ mt: 2 }} align="center">
//           🎉 All steps completed – your account and contact are saved!
//         </Typography>
//       )}
//     </Box>
//   );
// }

import React, { useState, useEffect,useContext } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  StepConnector,
  styled,
  Radio,
} from "@mui/material";
import AccountForm from "./AccountForm";
import ContactForm from "./ContactForm";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  resetForm,
  setAccountData,
  setSelectedContacts,
  removeSelectedContact,
} from "../../redux/accountContactSlice";
import { LoginContext } from "../../Sidebar/Context/Context";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useNavigate } from "react-router-dom";
const steps = ["Account Info", "Contact Info"];

export default function AccountContactForm({
  handleNewDrawerClose,
  handleDrawerClose,
  editingAccountId = null,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isEditing, setIsEditing] = useState(!!editingAccountId);
  const [isLoading, setIsLoading] = useState(false);
  const { accountData, contacts, selectedContacts } = useSelector(
    (state) => state.accountContact
  );

  const handleStepClick = (index) => {
    setActiveStep(index); // ✅ allow clicking on steps
  };
const { logindata } = useContext(LoginContext);
  const [loginUserId, setLoginUserId] = useState();
    useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  // ======================= Helper Functions =======================
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const CLIENT_PORT = process.env.REACT_APP_CLIENT_SERVER_URI;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  // Helper function to fetch tag details
  const fetchTagsDetails = async (tagIds) => {
    try {
      const responses = await Promise.all(
        tagIds.map((tagId) => axios.get(`${TAGS_API}/tags/${tagId}`))
      );

      return responses.map((response) => ({
        value: response.data.tag._id,
        label: response.data.tag.tagName,
        colour: response.data.tag.tagColour,
      }));
    } catch (error) {
      console.error("Error fetching tag details:", error);
      return [];
    }
  };

  // Helper function to fetch team member details
  const fetchTeamMembersDetails = async (teamMemberIds) => {
    try {
      const responses = await Promise.all(
        teamMemberIds.map((memberId) =>
          axios.get(`${LOGIN_API}/common/users/${memberId}`)
        )
      );

      return responses.map((response) => ({
        value: response.data.user._id,
        label: response.data.user.username,
      }));
    } catch (error) {
      console.error("Error fetching team member details:", error);
      return [];
    }
  };

  // Helper function to fetch folder template details
  const fetchFolderTemplateDetails = async (folderTemplateId) => {
    try {
      const response = await axios.get(
        `${API_KEY}/foldertemp/folder/${folderTemplateId}`
      );
      return {
        value: response.data.folderTemplate._id,
        label: response.data.folderTemplate.templatename,
      };
    } catch (error) {
      console.error("Error fetching folder template details:", error);
      return null;
    }
  };
  // const fetchAccountData = async (accountId) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${ACCOUNT_API}/accounts/accountdetails/${accountId}`
  //     );
  //     const accountData = response.data.account;
  //     console.log("djhdsfd",accountData)
  //     // Transform the data to match your form structure
  //     const formattedData = {
  //       accountName: accountData.accountName,
  //       clientType: accountData.clientType,
  //       companyName: accountData.companyName || "",
  //       tags: accountData.tags ? accountData.tags.map(tag => ({
  //         value: tag._id,
  //         label: tag.tagName,
  //         colour: tag.tagColour
  //       })) : [],
  //       teamMembers: accountData.teamMember ? accountData.teamMember.map(member => ({
  //         value: member._id,
  //         label: member.username
  //       })) : [],
  //       folderTemp: accountData.foldertemplate ? {
  //         value: accountData.foldertemplate._id,
  //         label: accountData.foldertemplate.templatename
  //       } : null,
  //       country: accountData.country ? {
  //         value: accountData.country.code,
  //         label: accountData.country.name
  //       } : null,
  //       streetAdd: accountData.streetAddress || "",
  //       city: accountData.city || "",
  //       state: accountData.state || "",
  //       zipCode: accountData.postalCode || ""
  //     };
  //     console.log("formattedData",formattedData)
  //     dispatch(setAccountData(formattedData));

  //     // Fetch contacts for this account
  //     // await fetchAccountContacts(accountId);

  //   } catch (error) {
  //     console.error("Error fetching account data:", error);
  //     toast.error("Failed to load account data");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // 1. Link created User to Account
  const updateAcountUserId = (userId, accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ userid: userId });
    console.log("updateAcountUserId Payload:", raw);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const Url = `${ACCOUNT_API}/accounts/accountdetails/${accountId}`;
    console.log("updateAcountUserId URL:", Url);

    fetch(Url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Account updated with UserId:", result);
      })
      .catch((error) => console.error("updateAcountUserId Error:", error));
  };

  // 2. Store client info in client collection
  const clientalldata = (
    userId,
    email,
    firstName,
    middleName,
    lastName,
    accountName
  ) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const password = `${firstName}@123`; // Default password
    const raw = JSON.stringify({
      email,
      firstName,
      middleName,
      lastName,
      userid: userId,
      accountName,
      password,
      cpassword: password,
    });

    console.log("clientalldata Payload:", raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/admin/clientsignup/`;
    console.log("clientalldata URL:", url);

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((result) => {
        console.log("Client data stored:", result);
        console.log("ClientId:", result.client?._id);
      })
      .catch((error) => {
        console.error("clientalldata Error:", error);
        toast.error("Error signing up. Please try again.");
      });
  };

  // 3. Send client activation mail
  const clientCreatedmail = (email, personalMessage, userId) => {
    const urlportlogin = `${CLIENT_PORT}/client/client/updatepassword`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email,
      personalMessage,
      url: urlportlogin,
      AccountId: userId,
    });

    console.log("clientCreatedmail Payload:", raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const urlusersavedmail = `${LOGIN_API}/clientmail/clientsavedemail/`;
    console.log("clientCreatedmail URL:", urlusersavedmail);

    fetch(urlusersavedmail, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Activation mail sent:", result);
      })
      .catch((error) => console.error("clientCreatedmail Error:", error));
  };

  useEffect(() => {
    if (editingAccountId) {
      fetchAccountData(editingAccountId);
    }
  }, [editingAccountId]);
 const [userDetails, setUserDetails] = useState([]);
  // Function to fetch account data for editing
  const fetchAccountData = async (accountId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${ACCOUNT_API}/accounts/accountdetails/${accountId}`
      );
      const accountData = response.data.account;

      // Transform the data to match your form structure
      const formattedData = {
        accountName: accountData.accountName,
        clientType: accountData.clientType,
        companyName: accountData.companyName || "",
        // tags: accountData.tags ? await fetchTagsDetails(accountData.tags) : [],
        // teamMembers: accountData.teamMember
        //   ? await fetchTeamMembersDetails(accountData.teamMember)
        //   : [],
        tags: Array.isArray(accountData.tags)
    ? accountData.tags.map(tag => ({
        value: tag._id,
        label: tag.tagName,
        colour: tag.tagColour,
      }))
    : [],

  teamMembers: Array.isArray(accountData.teamMember)
    ? accountData.teamMember.map(member => ({
        value: member._id,
        label: member.username,
      }))
    : [],
        folderTemp: accountData.foldertemplate
          ? {
              value: accountData.foldertemplate,
              label: "Template Name", // We'll fetch the actual name in the next step
            }
          : null,
        country: accountData.country
          ? {
              value: accountData.country.code,
              label: accountData.country.name,
            }
          : null,
        streetAdd: accountData.streetAddress || "",
        city: accountData.city || "",
        state: accountData.state || "",
        zipCode: accountData.postalCode || "",
      };

      dispatch(setAccountData(formattedData));

      // Fetch folder template name
      if (accountData.foldertemplate) {
        const folderDetails = await fetchFolderTemplateDetails(
          accountData.foldertemplate
        );
        if (folderDetails) {
          dispatch(
            setAccountData({
              folderTemp: folderDetails,
            })
          );
        }
      }
// Set user details from the account data
    setUserDetails(accountData.userid || []);
      // Fetch contacts for this account
      await fetchAccountContacts(accountId, accountData.contacts,accountData.userid || []);
    } catch (error) {
      console.error("Error fetching account data:", error);
      toast.error("Failed to load account data");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch contacts for the account being edited
  // const fetchAccountContacts = async (accountId, accountContacts) => {
  //   try {
  //     // For each contact, check if they have a user and set login status
  //     const contactsWithLoginStatus = await Promise.all(
  //       accountContacts.map(async (contact) => {
  //         // Check if this contact has a user account
  //         const hasUser = contact.userid && contact.userid.length > 0;

  //         return {
  //           _id: contact._id,
  //           firstName: contact.firstName || "",
  //           middleName: contact.middleName || "",
  //           lastName: contact.lastName || "",
  //           contactName: contact.contactName || "",
  //           companyName: contact.companyName || "",
  //           note: contact.note || "",
  //           ssn: contact.ssn || "",
  //           email: contact.email || "",
  //           phoneNumbers: contact.phoneNumbers || [""],
  //           tags: contact.tags ? await fetchTagsDetails(contact.tags) : [],
  //           country: contact.country
  //             ? {
  //                 value: contact.country.code,
  //                 label: contact.country.name,
  //               }
  //             : null,
  //           streetAdd: contact.streetAddress || "",
  //           city: contact.city || "",
  //           state: contact.state || "",
  //           zipCode: contact.postalCode || "",
  //           login: hasUser,
  //           notify: contact.notify || false,
  //           emailSync: contact.emailSync || false,
  //           existingUser: hasUser, // Mark if this contact already has a user
  //           existingContact: true, // Mark as existing contact
  //         };
  //       })
  //     );

  //     dispatch(setSelectedContacts(contactsWithLoginStatus));
  //   } catch (error) {
  //     console.error("Error processing account contacts:", error);
  //   }
  // };
  // Function to fetch contacts for the account being edited
const fetchAccountContacts = async (accountId, accountContacts, accountUsers) => {
  try {
    // For each contact, check if they have a user and set login status
    const contactsWithLoginStatus = await Promise.all(
      accountContacts.map(async (contact) => {
        // Find users associated with this contact
        const contactUsers = accountUsers.filter(user => user.contactId === contact._id);
        const hasUser = contactUsers.length > 0;

        // Get user settings if user exists
        const userSettings = hasUser ? contactUsers[0] : {};

        return {
          _id: contact._id,
          firstName: contact.firstName || "",
          middleName: contact.middleName || "",
          lastName: contact.lastName || "",
          contactName: contact.contactName || "",
          companyName: contact.companyName || "",
          note: contact.note || "",
          ssn: contact.ssn || "",
          email: contact.email || "",
          phoneNumbers: contact.phoneNumbers || [""],
          tags: contact.tags ? await fetchTagsDetails(contact.tags) : [],
          country: contact.country
            ? {
                value: contact.country.code,
                label: contact.country.name,
              }
            : null,
          streetAdd: contact.streetAddress || "",
          city: contact.city || "",
          state: contact.state || "",
          zipCode: contact.postalCode || "",
          login: userSettings.login || false,
          notify: userSettings.notify || false,
          emailSync: userSettings.emailSync || false,
          existingUser: hasUser, // Mark if this contact already has a user
          existingContact: true, // Mark as existing contact
        };
      })
    );

    dispatch(setSelectedContacts(contactsWithLoginStatus));
  } catch (error) {
    console.error("Error processing account contacts:", error);
  }
};

 

const handleSubmit = async (personalMessage = "") => {
  try {
    const finalData = {
      clientType: accountData.clientType,
      accountName: accountData.accountName,
      companyName: accountData.companyName,
      tags: (accountData.tags || []).map((tag) => tag.value),
      teamMember: (accountData.teamMembers || []).map(
        (member) => member.value
      ),
      foldertemplate: accountData.folderTemp
        ? accountData.folderTemp.value
        : null,
      country: accountData.country
        ? {
            code: accountData.country.value,
            name: accountData.country.label,
          }
        : { code: "", name: "" },
      streetAddress: accountData.streetAdd || "",
      city: accountData.city || "",
      state: accountData.state || "",
      postalCode: accountData.zipCode || "",
      adminUserId: loginUserId,
      active: true,
    };

    let accountId;
    let newContactIds = [];

    if (isEditing) {
      // Update existing account
      await axios.patch(
        `${ACCOUNT_API}/accounts/accountdetails/${editingAccountId}`,
        finalData
      );
      accountId = editingAccountId;

      // Update folder template if changed
      if (finalData.foldertemplate) {
        await assignfoldertemp(accountId, finalData.foldertemplate);
      }
    } else {
      // Create new account
      const { data: account } = await axios.post(
        `${ACCOUNT_API}/accounts/accountdetails`,
        finalData
      );
      accountId = account._id;

      // Create root folder structure for this account
      await addFolderTemplate(accountId);

      // Assign selected folder template (if any)
      await assignfoldertemp(accountId, finalData.foldertemplate);
    }

    // Process NEW contacts (manually added)
    for (let contact of contacts) {
      if (
        (contact.firstName || contact.lastName || contact.email) &&
        !contact._id
      ) {
        const { data: newContact } = await axios.post(
          `${ACCOUNT_API}/contacts/new-contact`,
          {
            ...contact,
            tags: (contact.tags || []).map((t) => t.value),
            country: contact.country
              ? {
                  code: contact.country.value,
                  name: contact.country.label,
                }
              : { code: "", name: "" },
            accountId: accountId,
          }
        );
        newContactIds.push(newContact._id);
        
        // If contact has login enabled → also create user (only for new contacts)
        if (contact.login) {
          try {
            const { data: newUser } = await axios.post(
              `${LOGIN_API}/common/from-contact`,
              {
                contactId: newContact._id,
                email: contact.email,
                password: "defaultPass123",
                username: accountData.accountName,
              }
            );

            // Link User ↔ Account, Save Client Info, Send Mail
            updateAcountUserId(newUser.user._id, accountId);
            clientalldata(
              newUser.user._id,
              contact.email,
              contact.firstName,
              contact.middleName,
              contact.lastName,
              accountData.accountName
            );
             const message = personalMessage || "Welcome to our platform!";
            clientCreatedmail(
              contact.email,
              message,
              newUser.user._id
            );
          } catch (error) {
            console.error("Error creating user for contact:", error);
            // Continue even if user creation fails
          }
        }
      }
    }

    // Process SELECTED existing contacts
    for (let contact of selectedContacts) {
      // For existing contacts of the account, update but don't change login settings
      if (contact.existingContact) {
        await axios.patch(`${ACCOUNT_API}/contacts/${contact._id}`, {
          ...contact,
          tags: (contact.tags || []).map((t) => t.value),
          country: contact.country
            ? {
                code: contact.country.value,
                name: contact.country.label,
              }
            : { code: "", name: "" },
          accountId: accountId,
          // Keep original login settings for existing contacts
        });
      } else {
        // For newly added existing contacts (from the contact selection dialog)
        // First update the contact with the account reference
        await axios.patch(`${ACCOUNT_API}/contacts/${contact._id}`, {
          ...contact,
          tags: (contact.tags || []).map((t) => t.value),
          country: contact.country
            ? {
                code: contact.country.value,
                name: contact.country.label,
              }
            : { code: "", name: "" },
          accountId: accountId,
          login: contact.login,
          notify: contact.notify,
          emailSync: contact.emailSync,
        });

        // If login is enabled for this existing contact, create a user account
        if (contact.login && !contact.existingUser) {
          try {
            // Use the /login/signup endpoint instead of /common/from-contact
            const { data: newUser } = await axios.post(
              `${LOGIN_API}/common/login/signup`,
              {
                contactId: contact._id,
                email: contact.email,
                password: "defaultPass123",
                username: accountData.accountName,
                role:"client",
                login:contact.login,
                notify:contact.notify,
                emailSync:contact.emailSync
                // Include any other required fields for the signup endpoint
              }
            );
console.log("newuser",newUser)
  // Add the new user ID to existing user IDs (if any)
            // const existingUserIds = contact.userid ? contact.userid : [];
            // const updatedUserIds = Array.isArray(existingUserIds) 
            //   ? [...existingUserIds, newUser._id] 
            //   : [newUser._id];
            // After creating user, update the contact to set login, notify, emailSync to false
            await axios.patch(`${ACCOUNT_API}/contacts/${contact._id}`, {
              login: false,
              notify: false,
              emailSync: false,
              // userid: updatedUserIds
            });

            // Link User ↔ Account, Save Client Info, Send Mail
            updateAcountUserId(newUser._id, accountId);
            clientalldata(
              newUser._id,
              contact.email,
              contact.firstName,
              contact.middleName,
              contact.lastName,
              accountData.accountName
            );
              const message = personalMessage || "Welcome to our platform!";
            clientCreatedmail(
              contact.email,
            message,
              newUser._id
            );
          } catch (error) {
            console.error("Error creating user for selected contact:", error);
            // Continue even if user creation fails
          }
        }
      }
    }

    // Update Account with all contact references
    const allContactIds = [
      ...newContactIds, // Include IDs of newly created contacts
      ...selectedContacts.map((c) => c._id), // Include IDs of selected contacts
    ];

    if (allContactIds.length > 0) {
      await axios.patch(
        `${ACCOUNT_API}/accounts/accountdetails/${accountId}`,
        { contacts: allContactIds }
      );
    }

    toast.success(
      isEditing
        ? "✅ Account updated successfully!"
        : "✅ Account, contacts & users saved!"
    );
    dispatch(resetForm());
    handleNewDrawerClose();
    if (!isEditing) {
      handleDrawerClose();
      navigate("/clients/accounts/activeaccounts");
    }
  } catch (err) {
    console.error(err);
    if (err.response?.data?.error === "Account name is taken") {
      alert("❌ Account name is already taken. Please choose another.");
    } else {
      alert("❌ Failed to save. Check console.");
    }
  }
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
console.log("assignfoldertemp",accountId)
console.log("assignfoldertemp",foldertempId)
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
      fetch(`https://www.snptaxes.com/api/docManagement/apply-template`, requestOptions)
    // fetch(`${CLIENT_DOCS_API}/clientdocs/accountfoldertemp`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <Box sx={{ maxWidth: 700, margin: "auto", mt: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {steps.map((label, index) => (
          <Box key={label} sx={{ display: "flex", alignItems: "center" }}>
            <Radio
              checked={activeStep === index}
              value={index}
              readOnly
              size="small"
            />
            <Typography>{label}</Typography>

            {index < steps.length - 1 && (
              <Typography sx={{ mx: 1, ml: 3, mt: 1 }}>
                <ChevronRightIcon />
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 3 }}>
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

      {activeStep === steps.length && (
        <Typography sx={{ mt: 2 }} align="center">
          🎉 All steps completed – your account and contacts are saved!
        </Typography>
      )}
    </Box>
  );
}




// const handleSubmit = async () => {
  //   try {
  //     const finalData = {
  //       clientType: accountData.clientType,
  //       accountName: accountData.accountName,
  //       companyName: accountData.companyName,
  //       tags: (accountData.tags || []).map((tag) => tag.value),
  //       teamMember: (accountData.teamMembers || []).map(
  //         (member) => member.value
  //       ),
  //       foldertemplate: accountData.folderTemp
  //         ? accountData.folderTemp.value
  //         : null, // 👈 only ID,
  //       // ✅ Country object (matches backend schema)
  //       country: accountData.country
  //         ? {
  //             code: accountData.country.value, // e.g., "IN"
  //             name: accountData.country.label, // e.g., "India"
  //           }
  //         : { code: "", name: "" },
  //       streetAddress: accountData.streetAdd || "",
  //       city: accountData.city || "",
  //       state: accountData.state || "",
  //       postalCode: accountData.zipCode || "",
  //       active: true,
  //     };

  //     console.log("Final data:", finalData);

  //     const { data: account } = await axios.post(
  //       `${ACCOUNT_API}/accounts/accountdetails`,
  //       finalData
  //     );
  //     const newAccountId = account._id;

  //     // 1.1 Create root folder structure for this account
  //     await addFolderTemplate(newAccountId);

  //     // 1.2 Assign selected folder template (if any)
  //     await assignfoldertemp(newAccountId, finalData.foldertemplate);
  //     // 2. Create NEW Contacts (manually added)
  //     for (let contact of contacts) {
  //       if (
  //         (contact.firstName || contact.lastName || contact.email) &&
  //         !contact._id
  //       ) {
  //         const { data: newContact } = await axios.post(
  //           `${ACCOUNT_API}/contacts/new-contact`,
  //           {
  //             ...contact,
  //              tags: (contact.tags || []).map((t) => t.value),
  //              country: contact.country
  //   ? {
  //       code: contact.country.value,
  //       name: contact.country.label,
  //     }
  //   : { code: "", name: "" },
  //             accountId: account._id,
  //           }
  //         );

  //         // 3. If contact has login enabled → also create user
  //         if (contact.login) {
  //           const { data: newUser } = await axios.post(
  //             `${LOGIN_API}/common/from-contact`,
  //             {
  //               contactId: newContact._id,
  //               email: contact.email,
  //               password: "defaultPass123",
  //             }
  //           );
  //           console.log("newUser", newUser);

  //           // 🔗 Link User ↔ Account, Save Client Info, Send Mail
  //           updateAcountUserId(newUser.user._id, account._id);
  //           clientalldata(
  //             newUser._id,
  //             contact.email,
  //             contact.firstName,
  //             contact.middleName,
  //             contact.lastName,
  //             account.accountName
  //           );
  //           clientCreatedmail(
  //             contact.email,
  //             "Welcome to our platform!",
  //             newUser.user._id
  //           );
  //         }
  //       }
  //     }

  //     // 4. Update EXISTING contacts
  //     for (let contact of selectedContacts) {
  //       await axios.patch(`${ACCOUNT_API}/contacts/${contact._id}`, {
  //         ...contact,
  //         accountId: account._id,
  //       });

  //       if (contact.login) {
  //         try {
  //           const { data: existingUser } = await axios.post(
  //             `${LOGIN_API}/common/from-contact`,
  //             {
  //               contactId: contact._id,
  //               email: contact.email,
  //               password: "defaultPass123",
  //             }
  //           );

  //           // 🔗 Link User ↔ Account, Save Client Info, Send Mail
  //           updateAcountUserId(existingUser.user._id, account._id);
  //           clientalldata(
  //             existingUser._id,
  //             contact.email,
  //             contact.firstName,
  //             contact.middleName,
  //             contact.lastName,
  //             account.accountName
  //           );
  //           clientCreatedmail(
  //             contact.email,
  //             "Welcome to our platform!",
  //             existingUser.user._id
  //           );
  //         } catch (error) {
  //           if (error.response?.status === 409) {
  //             await axios.patch(`${ACCOUNT_API}/contact/${contact._id}`, {
  //               email: contact.email,
  //             });
  //           } else {
  //             throw error;
  //           }
  //         }
  //       }
  //     }

  //     // 5. Update Account with all contact references
  //     const allContactIds = [
  //       ...contacts
  //         .filter((c) => (c.firstName || c.lastName || c.email) && c._id)
  //         .map((c) => c._id),
  //       ...selectedContacts.map((c) => c._id),
  //     ];

  //     if (allContactIds.length > 0) {
  //       await axios.patch(
  //         `${ACCOUNT_API}/accounts/accountdetails/${account._id}`,
  //         { contacts: allContactIds }
  //       );
  //     }

  //     toast.success("✅ Account, contacts & users saved!");
  //     dispatch(resetForm());
  //     handleDrawerClose();
  //     handleNewDrawerClose();
  //     navigate("/clients/accounts/activeaccounts");
  //   } catch (err) {
  //     console.error(err);
  //     if (err.response?.data?.error === "Account name is taken") {
  //       alert("❌ Account name is already taken. Please choose another.");
  //     } else {
  //       alert("❌ Failed to save. Check console.");
  //     }
  //   }
  // };
// const handleSubmit = () => {
//   const finalData = {
//     ...accountData,
//     contacts,
//   };
//   console.log("Final Submitted Data:", finalData);
//   alert("Submitted! Check console for data.");
// };
// const handleSubmit = async () => {
//   const finalData = {
//     ...accountData,
//     contacts,
//   };

//   try {
//     // 1. Create Account
//     const { data: account } = await axios.post(
//       "http://localhost:5000/api/accounts",
//       {
//         clientType: finalData.clientType,
//         accountName: finalData.accountName,
//         companyName: finalData.companyName,
//       }
//     );

//     // 2. Create Contacts for this account
//     for (let c of finalData.contacts) {
//       await axios.post("http://localhost:5000/api/contacts", {
//         ...c,
//         accountId: account._id, // link to account
//       });
//     }

//     alert("✅ Account & contacts saved!");
//     console.log("Saved Data:", finalData);
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to save. Check console.");
//   }
// };

// const handleSubmit = async () => {
//   const finalData = {
//     ...accountData,
//     contacts,
//   };

//   try {
//     // 1. Create Account
//     const { data: account } = await axios.post(
//       "http://localhost:5000/api/accounts",
//       {
//         clientType: finalData.clientType,
//         accountName: finalData.accountName,
//         companyName: finalData.companyName,
//       }
//     );

//     // 2. Create Contacts for this account
//     for (let c of finalData.contacts) {
//       const { data: contact } = await axios.post(
//         "http://localhost:5000/api/contacts",
//         {
//           ...c,
//           accountId: account._id, // link to account
//         }
//       );

//       // 3. If contact has login enabled → also create user
//       if (c.login) {
//         await axios.post("http://localhost:5000/api/users/from-contact", {
//           contactId: contact._id,
//           email: c.email, // or contact.email if saved
//           password: "defaultPass123", // you can generate random or take input
//         });
//       }
//     }

//     alert("✅ Account, contacts & users saved!");
//     console.log("Saved Data:", finalData);
//   } catch (err) {
//     console.error(err);
//     alert("❌ Failed to save. Check console.");
//   }
// };

//   const handleSubmit = async () => {
//   const finalData = {
//     ...accountData,
//     // contacts,
//     contacts: [...contacts, ...selectedContacts],
//   };

//   try {
//     // 1. Create Account
//     const { data: account } = await axios.post(
//       "http://localhost:5000/api/accounts",
//       {
//         clientType: finalData.clientType,
//         accountName: finalData.accountName,
//         companyName: finalData.companyName,
//       }
//     );

//     // 2. Create Contacts for this account
//     for (let c of finalData.contacts) {
//       const { data: contact } = await axios.post(
//         "http://localhost:5000/api/contacts",
//         {
//           ...c,
//           accountId: account._id, // link to account
//         }
//       );

//       // 3. If contact has login enabled → also create user
//       if (c.login) {
//         await axios.post("http://localhost:5000/api/users/from-contact", {
//           contactId: contact._id,
//           email: c.email,
//           password: "defaultPass123", // can generate random or prompt
//         });
//       }
//     }

//     alert("✅ Account, contacts & users saved!");
//     console.log("Saved Data:", finalData);
//   } catch (err) {
//     console.error(err);

//     // ✅ Handle duplicate accountName
//     if (err.response?.data?.error === "Account name is taken") {
//       alert("❌ Account name is already taken. Please choose another.");
//     } else {
//       alert("❌ Failed to save. Check console.");
//     }
//   }
// };

// Modify the handleSubmit function to properly handle existing and new contacts
// const handleSubmit = async () => {
//   const finalData = {
//     ...accountData,
//     contacts: [...contacts], // Only include manually added contacts
//     selectedContacts: [...selectedContacts], // Keep selected contacts separate
//   };

//   try {
//     // 1. Create Account
//     const { data: account } = await axios.post(
//       "http://localhost:5000/api/accounts",
//       {
//         clientType: finalData.clientType,
//         accountName: finalData.accountName,
//         companyName: finalData.companyName,
//       }
//     );

//     // 2. Create NEW Contacts (manually added)
//     for (let c of finalData.contacts) {
//       // Only create if it's a new contact (doesn't have _id)
//       if (!c._id) {
//         const { data: contact } = await axios.post(
//           "http://localhost:5000/api/contacts",
//           {
//             ...c,
//             accountId: account._id, // link to account
//           }
//         );

//         // 3. If contact has login enabled → also create user
//         if (c.login) {
//           await axios.post("http://localhost:5000/api/users/from-contact", {
//             contactId: contact._id,
//             email: c.email,
//             password: "defaultPass123",
//           });
//         }
//       }
//     }

//     // 4. Update EXISTING contacts (selected from backend)
//     for (let c of finalData.selectedContacts) {
//       // Update the existing contact with the account ID
//       await axios.put(
//         `http://localhost:5000/api/contacts/${c._id}`,
//         {
//           ...c,
//           accountId: account._id, // link to account
//         }
//       );

//       // 5. If contact has login enabled → also create/update user
//       if (c.login) {
//         try {
//           // Try to create user (might already exist)
//           await axios.post("http://localhost:5000/api/users/from-contact", {
//             contactId: c._id,
//             email: c.email,
//             password: "defaultPass123",
//           });
//         } catch (error) {
//           // If user already exists, update it instead
//           if (error.response?.status === 409) {
//             await axios.put(`http://localhost:5000/api/users/contact/${c._id}`, {
//               email: c.email,
//             });
//           } else {
//             throw error;
//           }
//         }
//       }
//     }

//     alert("✅ Account, contacts & users saved!");
//     console.log("Saved Data:", finalData);
//   } catch (err) {
//     console.error(err);

//     // ✅ Handle duplicate accountName
//     if (err.response?.data?.error === "Account name is taken") {
//       alert("❌ Account name is already taken. Please choose another.");
//     } else {
//       alert("❌ Failed to save. Check console.");
//     }
//   }
// };
