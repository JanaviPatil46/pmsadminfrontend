


// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
// import AccountForm from "./AccountForm";
// import ContactForm from "./ContactForm";
// import axios from "axios";
// const steps = ["Account Information", "Contact Information"];

// export default function AccountContactForm({ isEditing, accountId, onCloseDrawer }) {
//   const [activeStep, setActiveStep] = useState(0);
//   const { accountData, contacts,selectedContacts } = useSelector(
//     (state) => state.accountContact
//   );

// const handleSubmit = async () => {
//   try {
//     // 1. Create Account
//     const { data: account } = await axios.post("http://localhost:5000:8022/api/accounts", {
//       accountName: accountData.accountName,
//       clientType: accountData.clientType,
//       companyName: accountData.companyName,
//     });

//     // 2. Create NEW Contacts immutably and capture new _id
//     let updatedContacts = [...contacts];
//     const defaultPassword = "defaultPassword123";

//     for (let i = 0; i < contacts.length; i++) {
//       let contact = contacts[i];
//       if (contact.firstName || contact.lastName || contact.email) {
//         let payload = { ...contact, accountId: account._id };

//         if (contact.login) {
//           payload.password = defaultPassword;
//         } else {
//           delete payload.password;
//         }

//         const resp = await axios.post("http://localhost:5000:8022/api/contacts", payload);

//         // Save _id returned from backend
//         updatedContacts[i] = { ...contact, _id: resp.data._id };
//       }
//     }
//  // 3. Update accountId in existing selected contacts that don't have the new accountId
//     for (let i = 0; i < selectedContacts.length; i++) {
//       let contact = selectedContacts[i];
//       if (contact.accountId !== account._id) {
//         await axios.put(`http://localhost:5000:8022/api/contacts/${contact._id}`, {
//           ...contact,
//           accountId: account._id,
//         });
//       }
//     }
//     // 3. Combine newly created contacts and selected existing contacts
//     const allContacts = [
//       ...updatedContacts.filter(c => c._id), // new contacts with _id
//       ...selectedContacts // existing contacts selected from backend
//     ];

//     // 4. Map to API expected format { contact: _id, canLogin: bool }
//     const accContacts = allContacts.map(c => ({
//       contact: c._id,
//       canLogin: c.login || false,
//     }));

//     // 5. Update account with full contacts list
//     await axios.put(`http://localhost:5000:8022/api/accounts/${account._id}`, {
//       contacts: accContacts,
//     });

//     alert("Account, contacts saved!");
   

//   } catch (err) {
//     console.error(err);
//     alert("Failed to save. Check console.");
//   }
// };

//   return (
//     <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
//       <Stepper activeStep={activeStep} alternativeLabel>
//         {steps.map((label, index) => (
//           <Step key={label} >
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       <Box sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
//         {activeStep === 0 && <AccountForm onContinue={() => setActiveStep(1)} />}
//         {activeStep === 1 && (
//           <ContactForm
//             onBack={() => setActiveStep(0)}
//             onSubmit={handleSubmit}
//           />
//         )}
//       </Box>

     
//     </Box>
//   );
// }


import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import AccountForm from "./AccountForm";
import ContactForm from "./ContactForm";
import axios from "axios";

const steps = ["Account Information", "Contact Information"];

export default function AccountContactForm({ isEditing, accountId, onCloseDrawer }) {
  const [activeStep, setActiveStep] = useState(0);
  const { accountData, contacts, selectedContacts } = useSelector((state) => state.accountContact);

  const handleSubmit = async (event) => {
     if (event) event.preventDefault(); 
    try {
      // 1. Create or Update Account
      let account;
      if (isEditing && accountId) {
        const { data } = await axios.put(`https://www.snptaxes.com/api/accounts/${accountId}`, {
          ...accountData,
        });
        account = data;
      } else {
        const { data } = await axios.post("https://www.snptaxes.com/api/accounts", {
          accountName: accountData.accountName,
          clientType: accountData.clientType,
          companyName: accountData.companyName,
        });
        account = data;
      }

      // 2. Handle new Contacts
      let updatedContacts = [...contacts];
      const defaultPassword = "defaultPassword123";

      for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        if (contact.firstName || contact.lastName || contact.email) {
          let payload = { ...contact, accountId: account._id };
          if (contact.login) {
            payload.password = defaultPassword;
          } else {
            delete payload.password;
          }
          const resp = await axios.post("https://www.snptaxes.com/api/contacts", payload);
          updatedContacts[i] = { ...contact, _id: resp.data._id };
        }
      }


// 3. Update selected existing contacts
for (let i = 0; i < selectedContacts.length; i++) {
   let contact = selectedContacts[i];
  let shouldUpdate = (contact.accountId !== account._id) || contact.login;
if (shouldUpdate) {
  let payload = { ...contact, accountId: account._id };
  if (contact.login) {
    payload.password = defaultPassword;
  } else {
    delete payload.password;
  }
  await axios.put(`https://www.snptaxes.com/api/contacts/${contact._id}`, payload);
}

}

      // 4. Combine contacts for linking
      const allContacts = [
        ...updatedContacts.filter(c => c._id),
        ...selectedContacts
      ];
      const accContacts = allContacts.map(c => ({
        contact: c._id,
        canLogin: c.login || false,
        canNotify: c.notify || false,
        canEmailSync: c.emailSync || false
      }));
   // ✅ 5. Correct PUT for linking contacts
    const finalAccountId = isEditing && accountId ? accountId : account._id;
      // 5. Update account with contacts (API expects contact links)
      // await axios.put(`https://www.snptaxes.com/api/accounts/${account._id}`, {
      //   contacts: accContacts,
      // });
  await axios.put(`https://www.snptaxes.com/api/accounts/${finalAccountId}`, {
      contacts: accContacts,
    });
      alert("Account, contacts saved!");
      console.log("accountdata",account)
      if (onCloseDrawer) onCloseDrawer();
    } catch (err) {
      console.error(err);
      alert("Failed to save. Check console.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        {activeStep === 0 && <AccountForm onContinue={() => setActiveStep(1)} />}
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


