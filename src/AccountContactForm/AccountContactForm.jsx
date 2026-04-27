import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../components/ui/sheet";
import AccountForm from "./AccountForm";
import ContactForm from "./ContactForm";
import axios from "axios";
import { toast } from "react-toastify";
import { LoginContext } from "../Sidebar/Context/Context";
import { Check } from "lucide-react";

const steps = ["Account Information", "Contact Information"];

export default function AccountContactForm({
  isEditing,
  accountId,
  onCloseDrawer,

  handleDrawerClose,
}) {
  // Add these state declarations with your other useState hooks

  const [activeStep, setActiveStep] = useState(0);
  const { accountData, contacts, selectedContacts } = useSelector(
    (state) => state.accountContact,
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
      requestOptions,
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
  // Add a shared submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    // if (allContacts.length === 0) {
    //   toast.warning("At least one contact is required");
    //   setActiveStep(1);
    //   isValid = false;
    //   return;
    // }

    // for (let contact of allContacts) {
    //   if (
    //     !contact.firstName?.trim() ||
    //     !contact.lastName?.trim() ||
    //     !contact.email?.trim()
    //   ) {
    //     toast.warning(
    //       "All contacts must have First Name, Last Name, and Email",
    //     );
    //     setActiveStep(1);
    //     isValid = false;
    //     return;
    //   }
    // }

    if (!isValid) return;

    try {
      // STEP 1: Check for duplicate emails
      const allContactEmails = [
        ...contacts.map((c) => c.email?.toLowerCase().trim()),
        ...selectedContacts.map((c) => c.email?.toLowerCase().trim()),
      ].filter((email) => email);

      const duplicateEmails = allContactEmails.filter(
        (email, index) => allContactEmails.indexOf(email) !== index,
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
            accountData.accountName,
          );

          // Try method 1: Direct API check
          const checkResponse = await axios.get(
            `https://www.snptaxes.com/api/accounts/check-name/${encodeURIComponent(accountData.accountName.trim())}`,
          );

          console.log("Check response:", checkResponse.data);

          // If account name exists, show error and return
          if (checkResponse.data.exists === true) {
            toast.error(
              `Account name "${accountData.accountName}" already exists. Please use a different account name.`,
            );
            setActiveStep(0);
            return;
          }
        } catch (checkError) {
          console.log(
            "Check endpoint failed, trying alternative method:",
            checkError,
          );

          // Alternative method: Get all accounts and check manually
          try {
            const allAccountsResponse = await axios.get(
              "https://www.snptaxes.com/api/accounts",
            );
            const existingAccount = allAccountsResponse.data.find(
              (account) =>
                account.accountName?.toLowerCase().trim() ===
                accountData.accountName.toLowerCase().trim(),
            );

            if (existingAccount) {
              toast.error(
                `Account name "${accountData.accountName}" already exists. Please use a different account name.`,
              );
              setActiveStep(0);
              return;
            }
          } catch (searchError) {
            console.warn(
              "Both account check methods failed, proceeding with creation:",
              searchError,
            );
          }
        }
      }

      // STEP 3: Identify NEW contacts that need activation BEFORE creating them
      const newContactsNeedingActivation = contacts.filter(
        (contact) => contact.login === true && !contact._id, // No _id means it's a new contact
      );

      const newSelectedContactsNeedingActivation = selectedContacts.filter(
        (contact) => contact.login === true && contact.isNewlySelected, // Use the flag we set when selecting
      );

      const allNewContactsForActivation = [
        ...newContactsNeedingActivation,
        ...newSelectedContactsNeedingActivation,
      ];

      // STEP 4: Create Contacts FIRST - PASS personalMessage to API
      const contactsWithActivation = [];
      const createdContacts = [];
      const updatedContacts = [...contacts];

      // Create new contacts
      for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        // 🚨 FRONTEND VALIDATION (ADD THIS)
//   const hasValidPhone =
//   contact.phoneNumbers?.some(p => p && p.trim() !== "");

// if (!contact.email?.trim() && !hasValidPhone) {
//   toast.error(
//     `Contact ${contact.firstName || ""} ${contact.lastName || ""} must have either Email or Phone Number`
//   );
//   setActiveStep(1);
//   // throw new Error("Contact validation failed");
// }

        if (contact.firstName || contact.lastName || contact.email) {
          let payload = {
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            contactName:
              contact.contactName || `${contact.firstName} ${contact.lastName}`,
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
            personalMessage:
              contact.login && !contact._id ? personalMessage : "",
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
              payload,
            );
            // createdContacts.push(resp.data);
            const savedContact = resp.data;

            // 🧠 BACKEND AUTO-RENAMED contactName
            if (savedContact.suggestedContactName) {
              // Update local contacts state
              updatedContacts[i] = {
                ...contact,
                _id: savedContact._id,
                contactName: savedContact.suggestedContactName,
              };

              toast.info(
                `Contact name already existed. Saved as "${savedContact.suggestedContactName}".`,
              );
            } else {
              updatedContacts[i] = {
                ...contact,
                _id: savedContact._id,
                contactName: savedContact.contactName,
              };
            }

            createdContacts.push(savedContact);
            updatedContacts[i] = { ...contact, _id: resp.data._id };
          } 
          catch (contactError) {
            if (contactError.response?.status === 409) {
              toast.error(
                `Contact email "${contact.email}" already exists. Please use a different email.`,
              );
              throw contactError;
            } 
            else {
              throw contactError;
            }
          }
         
        }
      }

      // STEP 5: Prepare ALL contacts for account creation
      const allContactsForAccount = [...createdContacts, ...selectedContacts];

      const accountContacts = allContactsForAccount.map((contact) => {
        const originalContact = [...contacts, ...selectedContacts].find(
          (c) => c.email === contact.email,
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
            accountPayload,
          );
          account = data;
          finalAccountId = accountId;
        } else {
          const { data } = await axios.post(
            "https://www.snptaxes.com/api/accounts",
            accountPayload,
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
              `Account name "${accountData.accountName}" already exists. Please use a different account name.`,
            );
            setActiveStep(0);

            if (createdContacts.length > 0) {
              for (let contact of createdContacts) {
                try {
                  await axios.delete(
                    `https://www.snptaxes.com/api/contacts/${contact._id}`,
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
            (c) => c._id === contactId,
          );
          const currentAccountIds = contact?.accountIds || [];

          if (!currentAccountIds.includes(finalAccountId)) {
            await axios.put(
              `https://www.snptaxes.com/api/contacts/${contactId}`,
              {
                accountIds: [...currentAccountIds, finalAccountId],
                accountId: finalAccountId,
              },
            );
          }
        } catch (updateError) {
          console.error(`Failed to update contact ${contactId}:`, updateError);
        }
      }

      // STEP 8: Verify account
      try {
        const verifyResponse = await axios.get(
          `https://www.snptaxes.com/api/accounts/${finalAccountId}`,
        );

        if (
          !verifyResponse.data.contacts ||
          verifyResponse.data.contacts.length === 0
        ) {
          await axios.put(
            `https://www.snptaxes.com/api/accounts/${finalAccountId}`,
            { contacts: accountContacts },
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
          (contact) => contact.login === true && contact.isNewlySelected,
        );

        console.log(
          "Newly selected contacts needing activation:",
          newlySelectedForActivation,
        );

        for (let contact of newlySelectedForActivation) {
          await sendActivationEmail({ contact }, personalMessage);
        }
      } catch (error) {
        console.error(
          "Activation email sending for selected contacts failed:",
          error,
        );
      }

      // STEP 10: Handle folder template assignment
      if (accountData.folderTemp && accountData.folderTemp.value) {
        await assignfoldertemp(finalAccountId, accountData.folderTemp.value);
      }

      // toast.success("Account and contacts saved successfully!");

      //    if (onCloseDrawer) {
      //   onCloseDrawer();
      // } else if (handleDrawerClose) {
      //   handleDrawerClose();
      // }

      //  onCloseDrawer();handleDrawerClose();
      //  fetchAccountsList();
      toast.success("Account and contacts saved successfully!");
      // 🚀 FIRST refresh the account list
      if (fetchAccountsList) await fetchAccountsList();
      // await fetchAccountsList();
      if (onCloseDrawer) onCloseDrawer();
      if (handleDrawerClose) handleDrawerClose();

      // fetchAccountsList();
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

  // Send activation email function
  const sendActivationEmail = async (contact, personalMessage = "") => {
    // console.log("contact",contact)
    const ContactId = contact.contact._id;
    try {
      const response = await axios.post(
        `https://www.snptaxes.com/api/contacts/${ContactId}/resend-activation`,
        {
          email: contact.contact.email,
          contactId: ContactId,
          personalMessage: personalMessage,
        },
      );
      console.log("Activation email sent successfully:", response.data);
      return true;
    } catch (error) {
      console.error("Error sending activation email:", error);
      return false;
    }
  };

  const stepDescription = activeStep === 0
    ? "Fill in the account details to continue"
    : "Add or link contacts for this account";

  return (
    <div className="flex flex-col h-full">
      {/* Step header */}
      <SheetHeader className="px-0 pb-4 border-b border-border/40 space-y-3">
        {/* Step breadcrumb */}
        <div className="flex items-center gap-2">
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={[
                  "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-200",
                  index < activeStep
                    ? "bg-primary text-primary-foreground"
                    : index === activeStep
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground",
                ].join(" ")}>
                  {index < activeStep
                    ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    : index + 1}
                </div>
                <SheetTitle className={[
                  "text-sm font-medium leading-none",
                  index <= activeStep ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}>
                  {label}
                </SheetTitle>
              </div>
              {index < steps.length - 1 && (
                <div className={[
                  "flex-1 h-px mx-1",
                  index < activeStep ? "bg-primary" : "bg-border",
                ].join(" ")} />
              )}
            </React.Fragment>
          ))}
        </div>
        <SheetDescription className="text-xs text-muted-foreground">
          {stepDescription}
        </SheetDescription>
      </SheetHeader>

      {/* Scrollable step content */}
      <div className="flex-1 overflow-y-auto pt-5">
        {activeStep === 0 && (
          <AccountForm
            onContinue={() => setActiveStep(1)}
            isEditing={isEditing}
          />
        )}
        {activeStep === 1 && (
          <ContactForm
            onBack={() => setActiveStep(0)}
            onSubmit={handleSubmit}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        )}
      </div>
    </div>
  );
}
