
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

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import AccountForm from "./AccountForm";
import ContactForm from "./ContactForm";
import axios from "axios";
import { toast } from "react-toastify";
const steps = ["Account Information", "Contact Information"];

export default function AccountContactForm() {
  const [activeStep, setActiveStep] = useState(0);
  const { accountData, contacts,selectedContacts } = useSelector(
    (state) => state.accountContact
  );

  const handleStepClick = (index) => {
    setActiveStep(index); // ✅ allow clicking on steps
  };

  
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



// ======================= Helper Functions =======================
const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const CLIENT_PORT = process.env.REACT_APP_CLIENT_SERVER_URI;
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
const handleSubmit = async () => {
  try {
    // 1. Create Account
    const { data: account } = await axios.post(
      `${ACCOUNT_API}/accounts/accountdetails`,
      {
        clientType: accountData.clientType,
        accountName: accountData.accountName,
        companyName: accountData.companyName,
      }
    );

    // 2. Create NEW Contacts (manually added)
    for (let contact of contacts) {
      if ((contact.firstName || contact.lastName || contact.email) && !contact._id) {
        const { data: newContact } = await axios.post(
          `${ACCOUNT_API}/contacts/new-contact`,
          {
            ...contact,
            accountId: account._id,
          }
        );

        // 3. If contact has login enabled → also create user
        if (contact.login) {
          const { data: newUser } = await axios.post(
            `${LOGIN_API}/common/from-contact`,
            {
              contactId: newContact._id,
              email: contact.email,
              password: "defaultPass123",
            }
          );

          // 🔗 Link User ↔ Account, Save Client Info, Send Mail
          updateAcountUserId(newUser._id, account._id);
          clientalldata(
            newUser._id,
            contact.email,
            contact.firstName,
            contact.middleName,
            contact.lastName,
            account.accountName
          );
          clientCreatedmail(contact.email, "Welcome to our platform!", newUser._id);
        }
      }
    }

    // 4. Update EXISTING contacts
    for (let contact of selectedContacts) {
      await axios.put(
        `http://localhost:5000/api/contacts/${contact._id}`,
        {
          ...contact,
          accountId: account._id,
        }
      );

      if (contact.login) {
        try {
          const { data: existingUser } = await axios.post(
            "http://localhost:5000/api/users/from-contact",
            {
              contactId: contact._id,
              email: contact.email,
              password: "defaultPass123",
            }
          );

          // 🔗 Link User ↔ Account, Save Client Info, Send Mail
          updateAcountUserId(existingUser._id, account._id);
          clientalldata(
            existingUser._id,
            contact.email,
            contact.firstName,
            contact.middleName,
            contact.lastName,
            account.accountName
          );
          clientCreatedmail(contact.email, "Welcome to our platform!", existingUser._id);

        } catch (error) {
          if (error.response?.status === 409) {
            await axios.put(
              `http://localhost:5000/api/users/contact/${contact._id}`,
              { email: contact.email }
            );
          } else {
            throw error;
          }
        }
      }
    }

    // 5. Update Account with all contact references
    const allContactIds = [
      ...contacts
        .filter(c => (c.firstName || c.lastName || c.email) && c._id)
        .map(c => c._id),
      ...selectedContacts.map(c => c._id),
    ];

    if (allContactIds.length > 0) {
      await axios.put(
        `http://localhost:5000/api/accounts/${account._id}`,
        { contacts: allContactIds }
      );
    }

    alert("✅ Account, contacts & users saved!");

  } catch (err) {
    console.error(err);
    if (err.response?.data?.error === "Account name is taken") {
      alert("❌ Account name is already taken. Please choose another.");
    } else {
      alert("❌ Failed to save. Check console.");
    }
  }
};
 // Handle form submission
//   const handleSubmit = async () => {
//   try {
//     // 1. Create Account
//     const { data: account } = await axios.post(
//       "http://localhost:5000/api/accounts",
//       {
//         clientType: accountData.clientType,
//         accountName: accountData.accountName,
//         companyName: accountData.companyName,
//       }
//     );

//     // 2. Create NEW Contacts (manually added)
//     for (let contact of contacts) {
//       // Only create if it's a new contact (has some data and doesn't have _id)
//       if ((contact.firstName || contact.lastName || contact.email) && !contact._id) {
//         const { data: newContact } = await axios.post(
//           "http://localhost:5000/api/contacts",
//           {
//             ...contact,
//             accountId: account._id, // link to account
//           }
//         );

//         // 3. If contact has login enabled → also create user
//         if (contact.login) {
//           await axios.post("http://localhost:5000/api/users/from-contact", {
//             contactId: newContact._id,
//             email: contact.email, 
//             password: "defaultPass123",
//           });
//         }
//       }
//     }

//     // 4. Update EXISTING contacts (selected from backend) with the account ID
//     for (let contact of selectedContacts) {
//       // Update the existing contact with the account ID
//       await axios.put(
//         `http://localhost:5000/api/contacts/${contact._id}`,
//         {
//           ...contact,
//           accountId: account._id, // link contact to account
//         }
//       );

//       // 5. If contact has login enabled → also create/update user
//       if (contact.login) {
//         try {
//           // Try to create user (might already exist)
//           await axios.post("http://localhost:5000/api/users/from-contact", {
//             contactId: contact._id,
//             email: contact.email, 
//             password: "defaultPass123",
//           });
//         } catch (error) {
//           // If user already exists, update it instead
//           if (error.response?.status === 409) {
//             await axios.put(`http://localhost:5000/api/users/contact/${contact._id}`, {
//               email: contact.email,
//             });
//           } else {
//             throw error;
//           }
//         }
//       }
//     }

//     // 6. Also update the account to include references to all contacts
//     // Get all contact IDs (both new and existing)
//     const allContactIds = [
//       ...contacts
//         .filter(contact => (contact.firstName || contact.lastName || contact.email) && contact._id)
//         .map(contact => contact._id),
//       ...selectedContacts.map(contact => contact._id)
//     ];

//     // Update account with all contact references
//     if (allContactIds.length > 0) {
//       await axios.put(
//         `http://localhost:5000/api/accounts/${account._id}`,
//         {
//           contacts: allContactIds
//         }
//       );
//     }

//     alert("✅ Account, contacts & users saved!");
//     // Reset the form
//     // dispatch(resetContacts());
//     // setShowContactForm(false);
//     // onSubmit();
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
  return (
    <Box sx={{ maxWidth: 700, margin: "auto", mt: 5,border:'1px solid red' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{border:'2px solid green',}}>
        {steps.map((label, index) => (
          <Step key={label} >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        {activeStep === 0 && <AccountForm onContinue={() => setActiveStep(1)} />}
        {activeStep === 1 && (
          <ContactForm
            onBack={() => setActiveStep(0)}
            onSubmit={handleSubmit}
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