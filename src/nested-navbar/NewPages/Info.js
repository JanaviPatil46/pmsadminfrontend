import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Button,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  Avatar,
  IconButton,
  Drawer,
  Autocomplete,
  TextField,Tooltip
} from "@mui/material";

import AccountContactDrawer from "../../AccountContactForm/AccountContactDrawer";
import ContactForm from "../../Pages/UpdateContact";
import MenuDropdown from "./MenuDropdown";
import CloseIcon from "@mui/icons-material/Close";
import UploadProfilePicture from "./UploadProfilePicture";
const AccountDetails = () => {
  const { data } = useParams();
  const [account, setAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newCanLoginValue, setNewCanLoginValue] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${data}`
      );
      setAccount(res.data);
      console.log("account details", res.data.profilePicture);
      console.log("accounts details", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
  // console.log("account profilepicture", account.profilePicture);
  useEffect(() => {
    fetchAccountDetails();
  }, [data]);
  // Fetch available contacts (excluding already linked ones)
  const fetchAvailableContacts = async () => {
    try {
      const res = await axios.get(`https://www.snptaxes.com/api/contacts`);
      const currentContactIds =
        account?.contacts?.map((c) => c.contact._id) || [];
      const filteredContacts = res.data.filter(
        (contact) => !currentContactIds.includes(contact._id)
      );
      setAvailableContacts(filteredContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };
  // Fetch available contacts when account data is loaded and drawer is opened
  useEffect(() => {
    if (addContactDrawerOpen && account) {
      fetchAvailableContacts();
    }
  }, [addContactDrawerOpen, account]);
  const handleSwitchClick = (contact) => {
    setSelectedContact(contact);
    setNewCanLoginValue(!contact.canLogin);
    setDialogOpen(true);
  };

  const handleNotifyToggle = async (contact) => {
    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${contact.contact._id}`,
        { canNotify: !contact.canNotify }
      );
      setAccount((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c) =>
          c.contact._id === contact.contact._id
            ? { ...c, canNotify: !c.canNotify }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error updating canNotify", error);
    }
  };

  const handleEmailSyncToggle = async (contact) => {
    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${contact.contact._id}`,
        { canEmailSync: !contact.canEmailSync }
      );
      setAccount((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c) =>
          c.contact._id === contact.contact._id
            ? { ...c, canEmailSync: !c.canEmailSync }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error updating canEmailSync", error);
    }
  };
  // Send activation email function
  const sendActivationEmail = async (contact) => {
    // console.log("contact",contact)
    const ContactId = contact.contact._id;
    try {
      const response = await axios.post(
        `https://www.snptaxes.com/api/contacts/${ContactId}/resend-activation`,
        {
          email: contact.contact.email,
          contactId: ContactId,
        }
      );
      console.log("Activation email sent successfully:", response.data);
      return true;
    } catch (error) {
      console.error("Error sending activation email:", error);
      return false;
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedContact) return;
    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${selectedContact.contact._id}`,
        { canLogin: newCanLoginValue }
      );
      // If enabling login access, send activation email
      // if (newCanLoginValue) {
      //   const emailSent = await sendActivationEmail(selectedContact);

      //   if (emailSent) {
      //     // Show success message
      //     alert(`Activation email sent to ${selectedContact.contact.email}`);
      //   } else {
      //     alert(
      //       `Failed to send activation email to ${selectedContact.contact.email}`
      //     );
      //   }
      // }
      setAccount((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c) =>
          c.contact._id === selectedContact.contact._id
            ? { ...c, canLogin: newCanLoginValue }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error updating canLogin:", error);
    } finally {
      setDialogOpen(false);
      setSelectedContact(null);
    }
  };

  const handleCancelToggle = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };
  const [tagList, setTagList] = useState([]);
  const [teamMemberList, setTeamMemberList] = useState([]);
  // ✅ Fetch Tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${TAGS_API}/tags/`);
        const data = await res.json();
        setTagList(data.tags);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  // ✅ Fetch Team Members
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(
          `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
        );
        const data = await res.json();
        setTeamMemberList(data);
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };
    fetchTeam();
  }, []);

  // ✅ Always use empty array fallback
  const accountTags = tagList.length
    ? tagList.filter((tag) => account?.tags?.includes(tag._id))
    : [];

  const assignedMembers = teamMemberList.length
    ? teamMemberList.filter((member) =>
        account?.teamMember?.includes(member._id)
      )
    : [];
  // Handle linking selected contacts to account - UPDATED FOR YOUR SCHEMA
  const handleLinkContacts = async () => {
    if (selectedContacts.length === 0) return;

    try {
      // Prepare the contacts data according to your schema
      const contactsToAdd = selectedContacts.map((contact) => ({
        contact: contact._id,
        canLogin: false,
        canNotify: false,
        canEmailSync: false,
      }));

      // Make API call to add contacts to account
      await axios.post(
        `https://www.snptaxes.com/api/accounts/${account._id}/contacts`,
        { contacts: contactsToAdd }
      );

      // Refresh account details
      fetchAccountDetails();
      setAddContactDrawerOpen(false);
      setSelectedContacts([]);
    } catch (error) {
      console.error("Error linking contacts:", error);
    }
  };
  // Handle unlinking contact from account
  const handleUnlinkContact = async (contact) => {
    if (
      !window.confirm(
        `Are you sure you want to unlink ${contact.contact.firstName} ${contact.contact.lastName} from this account?`
      )
    ) {
      return;
    }
    try {
      await axios.delete(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${contact.contact._id}`
      );

      // Refresh account details to reflect the change
      fetchAccountDetails();
    } catch (error) {
      console.error("Error unlinking contact:", error);
    }
  };

  // Handle reset password
  const handleResetPassword = async (contact) => {
    if (!contact.canLogin) {
      alert(
        "This contact does not have login access. Enable login access first."
      );
      return;
    }

    if (
      !window.confirm(
        `Reset password for ${contact.contact.firstName} ${contact.contact.lastName}? They will receive an email with instructions to set a new password.`
      )
    ) {
      return;
    }

    try {
      await axios.post( 'https://www.snptaxes.com/api/auth/forgot-password', {
        email: contact.contact.email,
      });
      alert("Password reset email sent successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error sending password reset email");
    }
  };
  // Separate state for contact edit drawer
  const [contactEditDrawerOpen, setContactEditDrawerOpen] = useState(false);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState(null); // Renamed for clarity

  // Handle opening contact edit drawer
  const handleOpenContactEditDrawer = (contactData) => {
    console.log("Opening drawer with contact:", contactData);
    setSelectedContactForEdit(contactData.contact);
    setContactEditDrawerOpen(true);
  };
  const handleContactUpdated = () => {
    fetchAccountDetails();
  };
  if (!account) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Top bar button */}

      <Grid container spacing={3}>
        {/* ✅ LEFT SIDE - ACCOUNT DETAILS */}
        <Grid item xs={12} md={6} p={2}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {" "}
              <Typography variant="h5" fontWeight="bold">
                Account Details
              </Typography>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={() => setDrawerOpen(true)}
                disabled={storedData?.teammember?.manageAccounts === false}
                sx={{ mb: 3 }}
              >
                Edit Account
              </Button> */}
              <Tooltip
  title={
    storedData?.teammember?.manageAccounts === false
      ? "You don't have permission to edit accounts"
      : ""
  }
  disableHoverListener={storedData?.teammember?.manageAccounts !== false}
>
  <span>
    <Button
      variant="contained"
      onClick={() => setDrawerOpen(true)}
      disabled={storedData?.teammember?.manageAccounts === false}
    >
      Edit
    </Button>
  </span>
</Tooltip>

            </Box>

            <Divider sx={{ my: 2 }} />

{/* Avatar + Name + Profile Upload */}
<Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
  <UploadProfilePicture
    accountId={account._id}
   currentImage={account.profilePicture}
    onUploadSuccess={fetchAccountDetails}
  />
  <Box>
    <Typography variant="h6" fontWeight="bold">
      {account.accountName}
    </Typography>
    <Typography color="text.secondary">
      {account.clientType}
    </Typography>
  </Box>
</Box>


            <Typography variant="h6" sx={{ mt: 3 }}>
              Account Info
            </Typography>

            {/* ✅ TAGS */}
            <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {accountTags?.length > 0 ? (
                accountTags.map((tag) => (
                  <Chip
                    key={tag._id}
                    label={tag.tagName}
                    sx={{
                      backgroundColor: tag.tagColour,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                ))
              ) : (
                <Typography color="text.secondary">—</Typography>
              )}
            </Box>

            {/* ✅ TEAM MEMBERS */}
            <Typography variant="body1" sx={{ mt: 3, fontWeight: "bold" }}>
              Team Members
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {assignedMembers?.length > 0 ? (
                assignedMembers.map((m) => (
                  <Chip key={m._id} label={m.username} variant="outlined" />
                ))
              ) : (
                <Typography color="text.secondary">—</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* ✅ RIGHT SIDE - CONTACTS */}
        <Grid item xs={12} md={6} p={2}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="bold">
                Contacts
              </Typography>

              <Button
                variant="text"
                color="primary"
                onClick={() => setAddContactDrawerOpen(true)}
              >
                ADD CONTACT
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Table Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 2, py: 1, fontWeight: "bold", color: "gray" }}
            >
              <Box flex={1}></Box>
              <Box width={260} display="flex" justifyContent="space-between">
                <Typography>Login</Typography>
                <Typography>Notify</Typography>
                <Typography>Email Sync</Typography>
              </Box>
            </Box>

            <Divider />

            {/* Contact List */}
            {account.contacts?.length > 0 ? (
              account.contacts.map((c) => (
                <Box key={c.contact._id}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ px: 2, py: 2 }}
                  >
                    {/* Contact name/email */}
                    <Box flex={1}>
                      {/* <Typography
                        fontWeight="bold"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleOpenContactEditDrawer(c)}
                        
                      >
                        {c.contact.contactName}
                      </Typography> */}
                      <Tooltip
  title={
    storedData?.teammember?.manageContacts === false
      ? "You don't have permission to edit contacts"
      : ""
  }
  disableHoverListener={storedData?.teammember?.manageContacts !== false}
>
  <span>
    <Typography
      fontWeight="bold"
      sx={{
        cursor:
          storedData?.teammember?.manageContacts === false
            ? "not-allowed"
            : "pointer",
        color:
          storedData?.teammember?.manageContacts === false
            ? "gray"
            : "inherit",
        opacity: storedData?.teammember?.manageContacts === false ? 0.6 : 1,
      }}
      onClick={() => {
        if (storedData?.teammember?.manageContacts === false) return; // 🚫 Block click
        handleOpenContactEditDrawer(c); // ✅ Allowed
      }}
    >
      {c.contact.contactName}
    </Typography>
  </span>
</Tooltip>

                      <Typography color="text.secondary" fontSize={14}>
                        {c.contact.email || "-"}
                      </Typography>
                    </Box>

                    {/* Switches */}
                    <Box
                      width={260}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Switch
                        checked={c.canLogin}
                        onChange={() => handleSwitchClick(c)}
                        color="primary"
                        disabled
                      />
                      <Switch
                        checked={c.canNotify}
                        onChange={() => handleNotifyToggle(c)}
                        color="primary"
                        disabled
                      />
                      <Switch
                        checked={c.canEmailSync}
                        onChange={() => handleEmailSyncToggle(c)}
                        color="primary"
                        // disabled
                      />
                      <MenuDropdown
                        contact={c}
                        onUnlink={handleUnlinkContact}
                        onResetPassword={handleResetPassword}
                      />
                    </Box>
                  </Box>

                  <Divider />
                </Box>
              ))
            ) : (
              <Typography sx={{ p: 2 }}>No contacts found</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Drawer */}
      <AccountContactDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          fetchAccountDetails();
        }}
        accountId={account._id}
      />

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancelToggle}>
        <DialogTitle>Confirm Access Change</DialogTitle>
        <DialogContent>
          <Typography>
            {newCanLoginValue
              ? `Give portal access to ${selectedContact?.contact.email}?`
              : `Remove portal access from ${selectedContact?.contact.email}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelToggle} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmToggle}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Contact Drawer */}
      <Drawer
        anchor="right"
        open={addContactDrawerOpen}
        onClose={() => {
          setAddContactDrawerOpen(false);
          setSelectedContacts([]);
        }}
        PaperProps={{ sx: { width: 500, p: 5 } }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Add Contacts to Account
          </Typography>

          <Autocomplete
            multiple
            options={availableContacts}
            getOptionLabel={(option) =>
              `${option.contactName} (${option.email})`
            }
            value={selectedContacts}
            onChange={(event, newValue) => {
              setSelectedContacts(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                // label="Select Contacts"
                placeholder="Search contacts..."
                variant="outlined"
                fullWidth
              />
            )}
            sx={{ mb: 2 }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setAddContactDrawerOpen(false);
                setSelectedContacts([]);
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLinkContacts}
              variant="contained"
              disabled={selectedContacts.length === 0}
            >
              Link Contacts ({selectedContacts.length})
            </Button>
          </Box>
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={contactEditDrawerOpen}
        onClose={() => setContactEditDrawerOpen(false)}
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
          <IconButton onClick={() => setContactEditDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {selectedContactForEdit && (
          <ContactForm
            selectedContact={selectedContactForEdit}
            handleClose={() => setContactEditDrawerOpen(false)}
            onContactUpdated={handleContactUpdated}
          />
        )}
      </Drawer>
    </Box>
  );
};

export default AccountDetails;
