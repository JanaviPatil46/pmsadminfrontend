import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AccountContactDrawer from "./AccountContactDrawer";

const AccountDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [tagList, setTagList] = useState([]);
const [teamMemberList, setTeamMemberList] = useState([]);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newCanLoginValue, setNewCanLoginValue] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
useEffect(() => {
  const fetchTags = async () => {
    try {
      const res = await fetch(`${TAGS_API}/tags/`);
      const data = await res.json();

      setTagList(data.tags); // store all tags
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  fetchTags();
}, []);

  const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${id}`
      );
      setAccount(res.data);
      console.log("result", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
console.log("selected contact list",selectedContact)
  useEffect(() => {
    fetchAccountDetails();
  }, [id]);
  // Open confirmation dialog before toggling
  const handleSwitchClick = (contact) => {
    setSelectedContact(contact);
    setNewCanLoginValue(!contact.canLogin); // what the value will be after toggle
    setDialogOpen(true);
  };
  // Toggle without dialog
  const handleNotifyToggle = async (contact) => {
    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${contact.contact._id}`,
        { canNotify: !contact.canNotify }
      );

      // update UI
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

  // Confirm toggle
  const handleConfirmToggle = async () => {
    if (!selectedContact) return;

    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${selectedContact.contact._id}`,
        { canLogin: newCanLoginValue }
      );

      // Update local state
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

  // Cancel dialog
  const handleCancelToggle = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };
const accountTags = tagList.filter(tag =>
  account.tags.includes(tag._id)
);
const assignedMembers = teamMemberList.filter(user =>
  account.teamMember.includes(user._id)
);

  if (!account) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Button component={RouterLink} to="/" variant="outlined" sx={{ mb: 2 }}>
        ← Back to Accounts
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDrawerOpen(true)}
        sx={{ ml: 2 }}
      >
        Edit Account
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{account.accountName}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Typography variant="body1">
          <b>Client Type:</b> {account.clientType}
        </Typography>
        <Typography variant="body1">
          <b>Company Name:</b> {account.companyName || "—"}
        </Typography>
<Divider sx={{ my: 2 }} />

<Typography variant="body1" sx={{ mt: 2 }}><b>Tags:</b></Typography>
<Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
  {accountTags.length > 0 ? (
    accountTags.map(tag => (
      <Chip 
        key={tag._id} 
        label={tag.tagName} 
        sx={{ background: tag.tagColour, color: "#fff" }}
      />
    ))
  ) : (
    <Typography>—</Typography>
  )}
</Box>

<Typography variant="body1" sx={{ mt: 2 }}><b>Team Members:</b></Typography>
<Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
  {assignedMembers.length > 0 ? (
    assignedMembers.map(member => (
      <Chip 
        key={member._id} 
        label={member.username} 
        variant="outlined"
      />
    ))
  ) : (
    <Typography>—</Typography>
  )}
</Box>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Contacts
        </Typography>
        <Stack spacing={1}>
          {account.contacts?.length > 0 ? (
            account.contacts.map((c) => (
              <Box
                key={c.contact._id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>
                  {c.contact.firstName} {c.contact.lastName} — {c.contact.email}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={c.canLogin}
                      onClick={() => handleSwitchClick(c)}
                      color="primary"
                   
                    />
                  }
                  label="Login"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={c.canNotify}
                      onClick={() => handleNotifyToggle(c)} // ✅ no dialog
                      color="primary"
                     
                    />
                  }
                  label="Notify"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={c.canEmailSync}
                      onClick={() => handleEmailSyncToggle(c)} // ✅ no dialog
                      color="primary"
                      
                    />
                  }
                  label="EmailSync"
                />
              </Box>
            ))
          ) : (
            <Typography>No contacts found</Typography>
          )}
        </Stack>
      </Paper>
      <AccountContactDrawer
        open={drawerOpen}
        // onClose={() => setDrawerOpen(false)}
        onClose={() => {
          setDrawerOpen(false);
          fetchAccountDetails(); // ✅ call here
        }}
        accountId={account._id}
      />

      <Dialog open={dialogOpen} onClose={handleCancelToggle}>
        <DialogTitle>Confirm Access Change</DialogTitle>
        <DialogContent>
          <Typography>
            {newCanLoginValue
              ? `Do you want to give access of client portal to ${selectedContact?.contact.email}?`
              : `Do you want to remove access of client portal from ${selectedContact?.contact.email}?`}
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
    </Box>
  );
};

export default AccountDetails;
